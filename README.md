<div style="text-align:center">

# 清水河畔

基于 TypeScript、React 进行重构，用户界面基于 [MUI](https://mui.com/) 框架，编辑器选用 [Vditor](https://github.com/Vanessa219/vditor) 并针对河畔需求定制开发。

</div>

## 开发环境

- [Node.js](https://nodejs.org/en/download/)（pnpm 要求 v16.14 以上版本）
- [pnpm](https://pnpm.io/installation#using-npm)（`npm install -g pnpm`）

## 编译运行

- 安装依赖项

```
pnpm install
```

- 本地开发测试

```
pnpm run bbs:dev
```

- 编译生产版本

```
pnpm run bbs:build
```

### 本地开发测试的高级配置

- 环境变量：

  - `UESTC_BBS_BACKEND_SERVER=http://127.0.0.1:81`

    指定自定义的后端服务器地址，方便前后端同时开发测试。

- 常用参数：

  - `--host=0.0.0.0` HTTP 服务器监听地址
  - `--port=1234` HTTP 服务器监听端口

-

## 关于链接与路由的一些问题

1. 不用 `location.href`。在用户界面中使用 `<Link>` 组件，在程序中使用 `useNavigate`。

   在菜单（`<MenuItem>`）与按钮（`<Button>`）中通过 `component` 属性使渲染的元素成为链接，例如：

   ```
   import Link, { MenuItemLink } from '@/components/Link'

   <Button component={Link} to={pages.post()}>发帖</Button>
   <MenuItem component={MenuItemLink} to={pages.post()}>发帖</MenuItem>
   {/* 注意 <MenuItem> 的 component 属性设置为 MenuItemLink*/}
   ```

   _需要在程序中跳转到其他页面时，请使用 `useNavigate`。_ **用户界面中点击后直接产生的页面跳转应当使用 `<Link>`。**

2. 不要硬编码链接。需要链接地址时，内部链接调用 `@/utils/routes.ts` 中的 `pages.xxx` 函数生成，旧版河畔链接使用 `@/utils/siteRoot` 作为起始位置。

   例如：

   ```
   // 不要硬编码链接
   `/thread/${tid}`
   'https://bbs.uestc.edu.cn/forum.php'

   // 使用 pages.xxx 函数与 siteRoot
   pages.thread(tid)
   `${siteRoot}/forum.php`
   ```

3. 判断当前页面时，使用 `@/utils/routes.ts` 中的 `useActiveRoute`，而不要解析 `location.href` 值。

   例如：

   ```
   import { useActiveRoute } from '@/utils/routes'

   const activeRoute = useActiveRoute()
   if (activeRoute && activeRoute.id == 'thread') {
     // 当前页面为帖子内容页。
   }
   ```

4. 不在路由范围内但仍在河畔域名下的 URL，须在 `<Link>` 组件中指定 `external` 属性。

   例如：

   ```
   <Link external to={`${siteRoot}/forum.php`}>
   ```

   注意：`external` 属性仅仅表示该链接不经过 React Router 解析，并不会在新窗口中打开。如需新窗口打开，请另外设置 `target="_blank"`。

5. 添加新页面时，请在 `routes/index.tsx` 中设置好 `id` 属性，并在 `@/utils/routes.ts` 中添加 `pages.xxx` 函数。

## 特性

- 采用 Material UI 进行界面搭建，风格统一
- 基于 Vite，让冷启动不再等待
- Workspaces 同时管理论坛及其他模块
