# 教师智慧校园系统

基于 Node.js Express 微服务架构的智慧校园管理平台，包含完整的前后端代码，支持教师端功能。

## 项目结构

```
Test/
├── backend/                      # 后端服务
│   ├── app.js                   # 主入口文件（单体版本）
│   ├── config/                  # 配置文件
│   ├── controllers/             # 控制器
│   ├── middleware/              # 中间件
│   ├── models/                  # 数据模型
│   ├── routes/                  # 路由
│   ├── services/                # 业务逻辑
│   ├── utils/                   # 工具函数
│   ├── database/                # 数据库配置
│   ├── public/                  # 前端静态文件
│   │   └── index.html           # 主页面
│   ├── microservices/           # 微服务版本
│   │   ├── gateway/             # API网关
│   │   │   ├── app.js          # 网关入口
│   │   │   ├── public/         # 前端文件
│   │   │   └── config/         # 配置
│   │   └── services/           # 微服务
│   │       ├── user-service/   # 用户服务
│   │       ├── ai-service/      # AI服务
│   │       └── message-service/ # 消息服务
│   ├── .env                     # 环境变量
│   └── package.json             # 依赖配置
├── package.json                  # 根目录配置
└── README.md                    # 项目说明
```

## 快速开始

### 方式一：从项目根目录启动（推荐）

```bash
# 1. 进入项目目录
cd Test

# 2. 安装依赖（如果尚未安装）
cd backend
npm install

# 3. 返回根目录
cd ..

# 4. 启动服务
npm start
```

### 方式二：直接进入后端目录启动

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

### 方式三：使用微服务版本

```bash
# 进入微服务网关目录
cd backend/microservices/gateway

# 安装依赖
npm install

# 启动网关服务
npm start
```

## 访问地址

启动后访问：
- **前端页面**: http://localhost:8080
- **API接口**: http://localhost:8080/api
- **健康检查**: http://localhost:8080/api/health

## 演示账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 教师 | teacher1 | 123456 |
| 教师 | teacher2 | 123456 |
| 教师 | teacher3 | 123456 |

## 主要功能

### 教师端功能
- ✅ AI帮助 - DeepSeek AI智能问答
- ✅ 个人中心 - 用户信息、账号设置
- ✅ 我的授课 - 学期选择、课程详情
- ✅ 课程表 - 按学期查看
- ✅ 成绩录入 - 按课程录入
- ✅ 作业管理 - 发布/结束作业、实时提交人数
- ✅ 考勤管理 - 按科目/时间记录、重点人员标记
- ✅ 期中测试题库 - AI出题、AI批改
- ✅ 学生名单 - 详情查看、人数统计
- ✅ 成绩统计 - 分学科统计
- ✅ 校园地图 - 可视化地图
- ✅ 食堂 - 菜品、价格、售卖点位
- ✅ 报修通道 - 发布报修、查看修理员
- ✅ 图书馆 - 图书检索、借阅、续借、归还

### API接口

#### 用户接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息

#### 问答接口
- `POST /api/qa/ask` - 提交问题并获取AI回答
- `GET /api/qa/history` - 获取问答历史
- `GET /api/qa/questions/:id` - 获取问题详情

#### 知识库接口
- `GET /api/knowledge/list` - 获取知识库列表
- `GET /api/knowledge/:id` - 获取知识库详情
- `POST /api/knowledge` - 创建知识库
- `PUT /api/knowledge/:id` - 更新知识库
- `DELETE /api/knowledge/:id` - 删除知识库

#### AI接口
- `POST /api/ai/chat` - AI聊天
- `POST /api/ai/search-ask` - AI搜索问答

## 环境配置

配置文件位置：`backend/.env`

```env
# 应用配置
PORT=8080
NODE_ENV=development

# JWT配置
JWT_SECRET=campus_qa_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info

# 数据库配置（可选，未配置时使用模拟数据）
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=campus_qa_platform

# DeepSeek AI配置（可选）
# DEEPSEEK_API_KEY=your_api_key
# DEEPSEEK_API_URL=https://api.deepseek.com
```

## 技术栈

### 后端
- Node.js
- Express.js
- CORS
- JWT
- MySQL (可选)
- Axios

### 前端
- HTML5
- CSS3
- JavaScript (原生)
- AJAX/Fetch API

## 部署说明

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 生产环境部署

1. **安装依赖**
```bash
cd backend
npm install --production
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置生产环境参数
```

3. **启动服务**
```bash
# 使用 PM2 部署
npm install -g pm2
pm2 start app.js --name campus-platform

# 或使用 nohup 后台运行
nohup npm start > app.log 2>&1 &
```

4. **配置反向代理（Nginx）**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 微服务架构

项目支持两种部署模式：

### 1. 单体架构（简单部署）
所有功能集成在一个 Express 应用中，适合小型部署。

### 2. 微服务架构（推荐生产环境）
- **API Gateway** (端口 8080): 统一入口
- **User Service** (端口 3001): 用户认证
- **Knowledge Service** (端口 3002): 知识库
- **QA Service** (端口 3003): 问答服务
- **AI Service** (端口 3004): AI服务
- **Message Service** (端口 3005): 消息服务

启动微服务：
```bash
cd backend/microservices
# 分别启动各个服务
cd gateway && npm start &
cd services/user-service && npm start &
# ... 其他服务
```

## 常见问题

### 1. 端口被占用
如果端口 8080 被占用，可以修改 `.env` 文件中的 `PORT` 值。

### 2. API调用失败
检查：
- 后端服务是否启动
- 端口配置是否一致
- 浏览器控制台是否有跨域错误

### 3. 数据库连接失败
如果使用 MySQL，确保：
- MySQL 服务已启动
- `.env` 中的数据库配置正确
- 数据库已创建

### 4. AI功能不可用
检查 `.env` 中的 `DEEPSEEK_API_KEY` 是否配置正确。

## 开发说明

### 目录结构说明
- `controllers/` - 处理请求逻辑
- `routes/` - 定义API路由
- `middleware/` - 中间件（认证、验证等）
- `services/` - 业务逻辑层
- `utils/` - 工具函数
- `public/` - 前端静态文件

### 添加新功能
1. 在 `routes/` 中定义路由
2. 在 `controllers/` 中实现处理逻辑
3. 在 `services/` 中编写业务逻辑
4. 前端通过 AJAX 调用相应API

## License

MIT License

## 作者

教师智慧校园系统开发团队
