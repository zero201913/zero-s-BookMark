# 书签导航生成器 (Bookmark Nav Generator)

这是一个轻量级的静态书签网站生成工具。它通过读取 JSON 配置文件，自动生成包含分类筛选和搜索功能的静态 HTML 网站。

## 📂 项目结构

- **`data.json`**: 核心数据文件。所有的书签链接都维护在这里。
- **`build.js`**: 构建脚本。负责读取数据并将 HTML 生成到 `dist` 目录。
- **`index.html`**: 页面模板。
- **`render.js`**: 前端交互逻辑（搜索、分类切换）。
- **`styles.css`**: 页面样式。
- **`dist/`**: **最终生成结果**。部署时只需要这个文件夹的内容。

## 🛠️ 环境准备

确保你的电脑已安装 [Node.js](https://nodejs.org/)。

首次使用，请安装依赖：

```bash
npm install
```

## 📝 如何更新书签

1. 打开项目根目录下的 `data.json` 文件。
2. 在 `bookmarks` 对象中找到对应的分类，或者添加新分类。
3. 按照以下格式添加书签：

```json
"分类名称": [
    { "name": "网站名称", "url": "https://example.com" },
    { "name": "另一个网站", "url": "https://test.com" }
]
```

> **注意**：请严格遵守 JSON 语法（双引号、逗号不能多也不能少）。

## 🚀 生成网站 (Build)

当你修改完 `data.json` 或 `index.html` 模板后，执行以下命令生成静态文件：

```bash
npm run build
```

执行成功后，终端会提示输出到 `dist/` 目录。

## 👁️ 本地预览

生成后，你可以启动一个本地服务器来查看效果：

```bash
npm run preview
```

或者直接在浏览器中打开 `dist/index.html` 文件（某些功能在 file:// 协议下可能受限，推荐使用 preview）。

## ☁️ 部署 (Deploy)

由于生成的是纯静态文件，你可以将其部署到任何 Web 服务器或静态托管平台（如 GitHub Pages, Vercel, Netlify, Nginx 等）。

**部署步骤：**
1. 运行 `npm run build` 确保 `dist/` 目录是最新的。
2. 将 `dist/` 目录下的**所有文件**（`index.html`, `styles.css`, `render.js`）上传到你的服务器根目录。

### 常见问题
- **Q: 修改了 content 没有变化？**
  A: 请确认你是否运行了 `npm run build`，并且浏览器是否缓存了旧页面（可尝试 Ctrl+F5 强制刷新）。
- **Q: 报错 "data.json 不存在"？**
  A: 请确保你在项目根目录下运行命令。

