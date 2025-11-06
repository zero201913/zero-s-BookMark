# 书签导航网页

一个基于 HTML/CSS/JavaScript 的本地书签导航项目，可读取 `data.json` 中的分类与链接，呈现搜索、分类过滤和丰富配色的书签卡片。

## 功能特色

- **动态数据加载**：从 `data.json` 读取书签分类及链接
- **分类过滤**：顶部按钮一键筛选对应分类
- **关键词搜索**：输入关键词即时过滤名称或 URL
- **颜色主题**：不同分类关联不同配色，卡片悬停动效
- **零依赖**：纯原生 Web 技术，无需额外框架

## 目录结构

```
data.json              书签数据（JSON 格式）
index.html             网页入口文件
script.js              逻辑：加载数据、搜索与过滤
styles.css             样式：布局与主题色
启动书签导航.bat      Windows 批处理，一键启动本地服务
```

## 快速开始

### 方法一：双击批处理

1. 确保已安装 Python（3.x）。
2. 直接双击 `启动书签导航.bat`。
3. 默认浏览器将自动打开 `http://localhost:8000`，即可使用。

### 方法二：手动启动

```powershell
cd d:\Web\BookMark
python -m http.server 8000
```
然后在浏览器访问 `http://localhost:8000`。

> 如需更换端口，可在命令末尾替换 `8000` 为其他可用端口，并同步修改 `启动书签导航.bat` 中的端口号。

## 数据文件说明 (`data.json`)

```json
{
  "bookmarks": {
    "分类名称": [
      { "name": "站点名称", "url": "https://example.com" },
      ...
    ],
    ...
  }
}
```
- `bookmarks` 对象的每个键为 **分类名称**。
- 每个分类对应一个书签数组，数组元素包含：
  - `name`：书签展示名称
  - `url`：跳转链接

修改或新增书签后，刷新页面即可看到更新内容。

## 自定义

- **新增分类颜色**：在 `script.js` 的 `categoryColors` 对象中添加键值对；同时可在 `styles.css` 中扩展 CSS 变量实现更灵活的配色方案。
- **布局与样式**：编辑 `styles.css` 调整卡片大小、字体或动画。

## 浏览器兼容性

项目使用 ES6+ 语法与 CSS Flexbox/Grid 布局，兼容现代主流浏览器（Chrome、Edge、Firefox、Safari 等）。

## License

MIT