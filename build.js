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

    // 3. 检查 index.html
    if (!fs.existsSync('index.html')) {
        throw new Error('index.html 不存在！');
    }

    const template = fs.readFileSync('index.html', 'utf8');
    const $ = cheerio.load(template);

    // === 分类颜色映射 ===
    const categoryColors = {
        '开发与编程': '#4a6bff',
        '设计与前端': '#ff6b6b',
        'AI': '#6bff9e',
        '前后端参考文档': '#6bff9e',
        '文件与数据工具': '#ffb36b',
        '学习与知识': '#b36bff',
        '字体与文字': '#ff6bb3',
        '复习与笔记': '#ff6b6b',
        '资源与素材': '#6bffff',
        '打字与输入': '#ffff6b',
        '工具与服务': '#ff6b6b',
        '导航与整合页': '#6b6bff',
        '二次元与ACG': '#ff9e6b',
        '社交与视频平台': '#6bff6b',
        '成人内容（需自律）': '#ff6b9e',
        '个人娱乐': '#6bffb3'
    };

    // === 生成分类按钮 ===
    const categoryFilter = $('.category-filter');
    categoryFilter.append(`<button class="filter-btn active" data-category="all">全部</button>`);

    Object.keys(bookmarksData).forEach(category => {
        const color = categoryColors[category] || '#e9ecef';
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
        const color = categoryColors[category] || '#4a6bff';
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

    // 替换 script
    const finalHtml = $.html().replace(
        /<script\s+src="script\.js"><\/script>/,
        '<script src="render.js"></script>'
    );

    fs.writeFileSync('dist/index.html', finalHtml);
    fs.copyFileSync('styles.css', 'dist/styles.css');
    fs.copyFileSync('render.js', 'dist/render.js');

    console.log('构建成功！');
    console.log('输出目录: dist/');
    console.log('文件列表:');
    console.log('  - index.html');
    console.log('  - styles.css');
    console.log('  - render.js');

} catch (error) {
    console.error('构建失败！');
    console.error('错误信息:', error.message);
    process.exit(1); // 强制退出
}