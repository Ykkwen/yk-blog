# 数据库设置指南

本文档将指导你如何将博客系统从基于文件的存储转换为使用数据库存储。

## 先决条件

- 安装 [Node.js](https://nodejs.org/) (v18 或更高版本)
- 安装并运行 PostgreSQL 数据库服务器
  - 你也可以使用 MongoDB，但需要修改 `prisma/schema.prisma` 文件中的 provider

## 设置步骤

### 1. 安装依赖

运行以下命令安装所需的依赖：

```bash
npm install
```

或者运行提供的安装脚本：

```bash
./setup-database.bat  # Windows
```

### 2. 配置数据库连接

编辑 `.env` 文件，设置你的数据库连接字符串：

```
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名"
```

对于 MongoDB，使用类似以下的连接字符串：

```
DATABASE_URL="mongodb://用户名:密码@localhost:27017/数据库名"
```

### 3. 创建数据库表

运行以下命令创建数据库表：

```bash
npx prisma db push
```

### 4. 导入现有内容

运行以下命令将现有的 Markdown 文件导入到数据库中：

```bash
npm run seed
```

### 5. 启用数据库模式

编辑 `.env` 文件，添加以下行以启用数据库模式：

```
USE_DATABASE="true"
```

### 6. 启动应用

```bash
npm run dev
```

## 数据库模型

博客文章在数据库中的结构如下：

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  date        DateTime
  description String
  content     String
  tags        String[]
  published   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 添加新文章

你可以通过以下两种方式添加新文章：

1. 继续在 `content/posts` 目录中添加 Markdown 文件，然后运行 `npm run seed` 导入到数据库
2. 直接在数据库中添加新文章

## 故障排除

- 如果遇到数据库连接问题，请检查 `.env` 文件中的连接字符串是否正确
- 如果遇到 Prisma 相关错误，尝试运行 `npx prisma generate` 重新生成客户端
