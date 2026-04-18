// build.js —— 加上错误捕获
'use strict';

try {
    const fs = require('fs');
    const path = require('path');
    const cheerio = require('cheerio');

    console.log('开始构建...');

    // 1. 检查 data.json 是否存在
    if (!fs.existsSync('data.json')) {
        throw new Error('data.json 不存在！请确认文件在项目根目录。');
    }

    // 2. 读取并解析 data.json
    let rawData;
    try {
        rawData = fs.readFileSync('data.json', 'utf8');
        console.log('data.json 读取成功，长度:', rawData.length);
    } catch (err) {
        throw new Error('读取 data.json 失败: ' + err.message);
    }

    let bookmarksData;
    try {
        const parsed = JSON.parse(rawData);
        bookmarksData = parsed.bookmarks;
        if (!bookmarksData || typeof bookmarksData !== 'object') {
            throw new Error('data.json 格式错误：缺少 "bookmarks" 对象');
        }
        console.log('JSON 解析成功，分类数量:', Object.keys(bookmarksData).length);
    } catch (err) {
        throw new Error('JSON 解析失败: ' + err.message + '\n请检查 data.json 语法（逗号、引号、括号）');
    }

    // === 解析 av like 和 tag 数据 ===
    let avLikeData = {};
    let tagData = {};
    try {
        const parsed = JSON.parse(rawData);
        avLikeData = parsed['av like'] || {};
        tagData = parsed['tag'] || {};
        console.log('av like 数据解析成功，数量:', Object.keys(avLikeData).length);
        console.log('tag 数据解析成功，数量:', Object.keys(tagData).length);
    } catch (err) {
        console.warn('解析 av like 或 tag 数据失败:', err.message);
    }

    // 3. 检查 index.html
    if (!fs.existsSync('index.html')) {
        throw new Error('index.html 不存在！');
    }

    const template = fs.readFileSync('index.html', 'utf8');
    const $ = cheerio.load(template);

    // === 颜色生成器 - 使用 HSL 色相环自动分配颜色 ===
    const usedColors = new Set();
    
    function stringToHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }
    
    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    function getCategoryColor(category) {
        const hash = stringToHash(category);
        const hue = hash % 360;
        const saturation = 70 + (hash % 20);
        const lightness = 55 + (hash % 15);
        let color = hslToHex(hue, saturation, lightness);
        
        if (usedColors.has(color)) {
            const offset = (hash % 30) + 10;
            color = hslToHex((hue + offset) % 360, saturation, lightness);
        }
        
        usedColors.add(color);
        return color;
    }

    // === 生成分类按钮 ===
    const categoryFilter = $('.category-filter');
    categoryFilter.append(`<button class="filter-btn active" data-category="all">全部</button>`);

    Object.keys(bookmarksData).forEach(category => {
        const color = getCategoryColor(category);
        const btn = `
            <button class="filter-btn" data-category="${category}" 
                    style="background-color: ${color}; color: white;">
                ${category}
            </button>`;
        categoryFilter.append(btn);
    });

    // === 生成书签内容 ===
    const container = $('#bookmarks-container');

    Object.keys(bookmarksData).forEach(category => {
        const color = getCategoryColor(category);
        let sectionHtml = `
            <div class="category-section" data-category="${category}">
                <h2 class="category-title" style="color: ${color}; border-bottom-color: ${color};">
                    ${category}
                </h2>
                <div class="bookmark-grid">
        `;

        bookmarksData[category].forEach(bookmark => {
            if (!bookmark.name || !bookmark.url) {
                console.warn('跳过无效书签:', bookmark);
                return;
            }
            sectionHtml += `
                <div class="bookmark-card"
                     style="--category-color: ${color};"
                     data-name="${bookmark.name.toLowerCase()}"
                     data-url="${bookmark.url.toLowerCase()}"
                     data-category="${category}">
                    <a href="${bookmark.url}" target="_blank" rel="noopener">
                        ${bookmark.name}
                    </a>
                </div>
            `;
        });

        sectionHtml += `</div></div>`;
        container.append(sectionHtml);
    });

    // === 输出 dist ===
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
        console.log('创建 dist 目录');
    }

    // === 嵌入 av like 和 tag 数据到页面 ===
    const avLikeJson = JSON.stringify(avLikeData).replace(/"/g, '&quot;');
    const tagJson = JSON.stringify(tagData).replace(/"/g, '&quot;');

    // 替换 script
    let finalHtml = $.html().replace(
        /<script\s+src="script\.js"><\/script>/,
        '<script src="render.js"></script>'
    );

    // 在 body 开始处添加数据容器
    finalHtml = finalHtml.replace(
        /<body>/,
        `<body><div id="extra-data" data-av-like="${avLikeJson}" data-tag="${tagJson}"></div>`
    );

    fs.writeFileSync('dist/index.html', finalHtml);
    fs.copyFileSync('styles.css', 'dist/styles.css');
    fs.copyFileSync('render.js', 'dist/render.js');

    // 复制头像图片
    if (fs.existsSync('avatar.jpg')) {
        fs.copyFileSync('avatar.jpg', 'dist/avatar.jpg');
    }

    console.log('构建成功！');
    console.log('输出目录: dist/');
    console.log('文件列表:');
    console.log('  - index.html');
    console.log('  - styles.css');
    console.log('  - render.js');
    if (fs.existsSync('avatar.jpg')) {
        console.log('  - avatar.jpg');
    }

} catch (error) {
    console.error('构建失败！');
    console.error('错误信息:', error.message);
    process.exit(1); // 强制退出
}