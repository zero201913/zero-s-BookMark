// render.js - 交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    let activeCategory = 'all';
    
    // 主题切换逻辑
    const themeToggle = document.querySelector('header h1');
    const htmlElement = document.documentElement;
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }
    
    // 主题切换事件监听
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        
        // 保存主题到本地存储
        localStorage.setItem('theme', newTheme);
    });

    // 分类切换
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前分类
            activeCategory = this.dataset.category;
            
            // 执行过滤
            filterBookmarks();
        });
    });

    // 执行搜索（点击按钮或回车时，强制切换到“全部”进行全局搜索）
    function performSearch() {
        // 切换到 "全部" 分类
        activeCategory = 'all';
        
        // 更新按钮 UI
        document.querySelectorAll('.filter-btn').forEach(b => {
            if (b.dataset.category === 'all') {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // 执行过滤
        filterBookmarks();
    }

    // 事件监听
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });

    // 实时搜索（可选：输入时在当前分类下过滤，或者这里也强制切到all，通常保持在当前分类下过滤比较自然）
    searchInput.addEventListener('input', () => {
        // 实时输入时不强制切换分类，直接在当前视图下过滤
        filterBookmarks();
    });

    // 核心过滤逻辑
    function filterBookmarks() {
        const query = searchInput.value.trim().toLowerCase();
        
        // 如果之前的 searchBookmarks 留下了遗迹（#search-results），清理掉
        const oldSearchResults = document.getElementById('search-results');
        if (oldSearchResults) {
            oldSearchResults.remove();
        }

        document.querySelectorAll('.category-section').forEach(section => {
            const cat = section.dataset.category;
            // 判断该分类是否应该显示（基于 activeCategory）
            const isCategoryActive = activeCategory === 'all' || activeCategory === cat;

            let hasVisibleCard = false;

            section.querySelectorAll('.bookmark-card').forEach(card => {
                const name = card.dataset.name || '';
                const url = card.dataset.url || '';
                
                // 匹配搜索词
                const matchesSearch = !query || name.includes(query) || url.includes(query);
                
                // 最终决定卡片是否显示：
                // 1. 分类必须是激活的（或者选了“全部”）
                // 2. 必须匹配搜索词
                if (isCategoryActive && matchesSearch) {
                    card.style.display = '';
                    hasVisibleCard = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // 决定整个分类块是否显示
            // 逻辑：
            // - 如果分类下有可见卡片 -> 显示
            // - 如果没有可见卡片，但在当前激活分类下且没有搜索词（空分类） -> 显示（或者隐藏，看需求，通常隐藏比较好）
            // - 这里的逻辑修正为：只要有 visible card 就显示，否则隐藏。
            //   这样搜索时，空的分类会自动隐藏。
            
            if (hasVisibleCard) {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // 初始化
    filterBookmarks();

    // === 额外内容页面切换逻辑 ===
    const toggleExtraBtn = document.getElementById('toggle-extra-btn');
    const closeExtraBtn = document.getElementById('close-extra-btn');
    const extraPage = document.getElementById('extra-page');
    const extraContent = document.getElementById('extra-content');
    const extraDataContainer = document.getElementById('extra-data');

    // 获取嵌入的数据
    let avLikeData = {};
    let tagData = {};

    if (extraDataContainer) {
        const avLikeJson = extraDataContainer.getAttribute('data-av-like');
        const tagJson = extraDataContainer.getAttribute('data-tag');
        try {
            if (avLikeJson) {
                avLikeData = JSON.parse(avLikeJson.replace(/&quot;/g, '"'));
            }
            if (tagJson) {
                tagData = JSON.parse(tagJson.replace(/&quot;/g, '"'));
            }
        } catch (e) {
            console.warn('解析额外数据失败:', e);
        }
    }

    // 随机鲜艳颜色生成函数
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 85%, 60%)`;
    }

    // 生成额外内容
    function renderExtraContent() {
        let html = '';

        // av like 部分
        if (Object.keys(avLikeData).length > 0) {
            html += '<div class="extra-section">';
            html += '<h2 class="extra-section-title">AV Like</h2>';
            html += '<div class="extra-grid">';
            for (const [name, url] of Object.entries(avLikeData)) {
                html += `
                    <a href="${url}" target="_blank" rel="noopener" 
                       class="extra-item" 
                       style="background-color: ${getRandomColor()};">
                        ${name}
                    </a>
                `;
            }
            html += '</div></div>';
        }

        // tag 部分
        if (Object.keys(tagData).length > 0) {
            html += '<div class="extra-section">';
            html += '<h2 class="extra-section-title">Tag</h2>';
            html += '<div class="extra-grid">';
            for (const [name, prompt] of Object.entries(tagData)) {
                html += `
                    <div class="extra-item extra-item-copy" 
                         style="background-color: ${getRandomColor()};"
                         data-prompt="${prompt.replace(/"/g, '&quot;')}"
                         title="点击复制提示词">
                        ${name}
                    </div>
                `;
            }
            html += '</div></div>';
        }

        extraContent.innerHTML = html;

        // 添加复制功能
        document.querySelectorAll('.extra-item-copy').forEach(item => {
            item.addEventListener('click', function() {
                const prompt = this.getAttribute('data-prompt').replace(/&quot;/g, '"');
                navigator.clipboard.writeText(prompt).then(() => {
                    alert('提示词已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            });
        });

        // 滚动到额外页面的顶部
        extraPage.scrollTop = 0;
    }

    // 打开额外页面
    if (toggleExtraBtn) {
        toggleExtraBtn.addEventListener('click', function() {
            extraPage.classList.add('active');
            toggleExtraBtn.style.display = 'none';
            closeExtraBtn.style.display = 'flex';
            renderExtraContent();
            // 禁用主页面滚动
            document.body.style.overflow = 'hidden';
        });
    }

    // 关闭额外页面
    if (closeExtraBtn) {
        closeExtraBtn.addEventListener('click', function() {
            extraPage.classList.remove('active');
            closeExtraBtn.style.display = 'none';
            toggleExtraBtn.style.display = 'flex';
            // 恢复主页面滚动
            document.body.style.overflow = '';
        });
    }
});
