// render.js - 只保留交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    let activeCategory = 'all';

    // 分类切换
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.category;
            filterBookmarks();
        });
    });

    // 搜索
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            searchBookmarks(query);
        } else {
            filterBookmarks();
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });

    // 过滤书签
    function filterBookmarks() {
        const query = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.category-section').forEach(section => {
            const cat = section.dataset.category;
            const shouldShowCat = activeCategory === 'all' || activeCategory === cat;

            let hasVisibleCard = false;

            section.querySelectorAll('.bookmark-card').forEach(card => {
                const name = card.dataset.name;
                const url = card.dataset.url;
                const matchesSearch = !query || name.includes(query) || url.includes(query);
                const matchesCat = shouldShowCat;

                if (matchesSearch && matchesCat) {
                    card.style.display = '';
                    hasVisibleCard = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // 隐藏整个分类如果没有可见卡片
            section.style.display = hasVisibleCard || shouldShowCat ? '' : 'none';
        });
    }

    // 搜索模式：显示搜索结果
    function searchBookmarks(query) {
        // 隐藏所有分类
        document.querySelectorAll('.category-section').forEach(s => s.style.display = 'none');

        // 创建搜索结果容器
        let resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results';
            resultsContainer.className = 'category-section';
            resultsContainer.innerHTML = `
                <h2 class="category-title" style="color: #888; border-bottom-color: #888;">
                    搜索结果: "${query}"
                </h2>
                <div class="bookmark-grid" id="search-grid"></div>
            `;
            document.getElementById('bookmarks-container').appendChild(resultsContainer);
        }

        const grid = document.getElementById('search-grid');
        grid.innerHTML = '';

        let found = false;
        document.querySelectorAll('.bookmark-card').forEach(card => {
            const name = card.dataset.name;
            const url = card.dataset.url;
            if (name.includes(query) || url.includes(query)) {
                const clone = card.cloneNode(true);
                clone.style.display = '';
                grid.appendChild(clone);
                found = true;
            }
        });

        if (!found) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">没有找到匹配的书签。</p>';
        }
    }

    // 初始化：设置 active 状态
    filterBookmarks();
});