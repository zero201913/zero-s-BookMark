// render.js - 交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    let activeCategory = 'all';

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
});
