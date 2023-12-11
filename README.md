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

## 特性

- 采用 Material UI 进行界面搭建，风格统一
- 基于 Vite，让冷启动不再等待
- Workspaces 同时管理论坛及未来其他页面
