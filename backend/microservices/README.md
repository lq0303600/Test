# 校园智能咨询问答平台 - 微服务架构

## 架构概览

本项目采用微服务架构，将原有单体应用拆分为5个独立的微服务：

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway (3000)                    │
│               统一入口，路由分发，认证鉴权                 │
└─────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  用户服务      │    │  知识库服务   │    │  问答服务      │
│  (3001)       │    │  (3002)      │    │  (3003)       │
│               │    │              │    │               │
│ • 注册登录    │    │ • 知识点CRUD │    │ • 提交问题    │
│ • 身份认证    │    │ • 分类管理   │    │ • 历史查询    │
│ • 权限管理    │    │ • 关键词检索 │    │ • 状态跟踪    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐    ┌───────────────┐
            │  AI服务        │    │  消息服务      │
            │  (3004)        │    │  (3005)        │
            │                │    │                │
            │ • RAG检索增强  │    │ • 消息推送     │
            │ • 意图识别     │    │ • 通知提醒     │
            │ • 自动分类     │    │ • 会话记录     │
            │ • 智能答复     │    │                │
            │ • 转接人工    │    │                │
            └───────────────┘    └───────────────┘
```

## 微服务列表

### 1. 用户服务 (user-service) - 端口 3001
**职责**: 用户账号管理、身份认证、权限控制

**功能**:
- 用户注册（用户名、密码、角色）
- 用户登录（JWT Token认证）
- 多角色权限管理（学生/教师/管理员/客服）
- 用户信息管理
- 密码修改

**角色说明**:
- `student`: 学生（默认角色）
- `teacher`: 教师
- `admin`: 管理员
- `customer_service`: 客服

### 2. 知识库服务 (knowledge-service) - 端口 3002
**职责**: 校园知识库管理

**功能**:
- 知识点CRUD操作
- 分类管理（入学/学术/校园/就业/生活/其他）
- 关键词检索
- 全文搜索（FULLTEXT）
- 访问统计

### 3. 问答发布服务 (qa-service) - 端口 3003
**职责**: 用户问答管理

**功能**:
- 提交咨询问题
- 查询历史问答
- 问题状态跟踪（pending/processing/answered/resolved/transferred）
- 优先级管理
- 人工回答
- 问题转接

### 4. AI智能问答服务 (ai-service) - 端口 3004
**职责**: AI智能回答（核心服务）

**功能**:
- **RAG检索增强问答**: 先检索知识库，再生成回答
- **意图识别**: 自动识别用户问题意图（咨询/查询/申请/办理/投诉）
- **自动分类**: 将问题分类到对应类别
- **智能答复**: 调用DeepSeek API生成回答
- **置信度评估**: 评估回答质量，低质量自动转人工
- **无法解答自动转接人工客服**

### 5. 消息交互服务 (message-service) - 端口 3005
**职责**: 消息通知和推送

**功能**:
- 消息推送
- AI回复通知
- 人工转接提醒
- 会话消息记录
- 未读消息统计

### 6. API网关 (gateway) - 端口 3000
**职责**: 统一入口，路由分发

**功能**:
- 请求路由分发到各微服务
- 统一认证鉴权
- 日志记录
- 服务健康检查
- 错误处理

## 快速启动

### 方式一：分别启动各服务

```bash
# 1. 启动用户服务
cd microservices/services/user-service
npm install
npm start

# 2. 启动知识库服务
cd microservices/services/knowledge-service
npm install
npm start

# 3. 启动AI服务
cd microservices/services/ai-service
npm install
npm start

# 4. 启动问答服务
cd microservices/services/qa-service
npm install
npm start

# 5. 启动消息服务
cd microservices/services/message-service
npm install
npm start

# 6. 启动API网关
cd microservices/gateway
npm install
npm start
```

### 方式二：使用启动脚本

```bash
cd microservices
start-all.bat
```

### 方式三：使用Docker Compose（推荐）

```bash
cd microservices
docker-compose up -d
```

## API使用示例

### 用户注册
```bash
POST /api/users/register
Content-Type: application/json

{
  "username": "student001",
  "password": "123456",
  "role": "student"
}
```

### 用户登录
```bash
POST /api/users/login
Content-Type: application/json

{
  "username": "student001",
  "password": "123456"
}
```

### 提交问题
```bash
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "图书馆开放时间",
  "content": "请问图书馆周一到周五几点开门？",
  "category": "campus"
}
```

### 查询知识库
```bash
GET /api/knowledge/search?q=图书馆&limit=5
```

### 获取问答历史
```bash
GET /api/questions/history?page=1&pageSize=10
Authorization: Bearer <token>
```

## 服务间通信

微服务之间通过HTTP REST API进行通信：

```
问答服务 ──调用──> AI服务
    │              │
    │              └──调用──> 知识库服务
    │
    └──调用──> 消息服务
              │
              └──调用──> 用户服务（获取用户信息）
```

## 数据库

每个微服务使用独立的数据库表，但共享同一个MySQL数据库实例：

- `campus_qa_platform.users` - 用户表
- `campus_qa_platform.knowledge_base` - 知识库表
- `campus_qa_platform.questions` - 问题表
- `campus_qa_platform.answers` - 回答表
- `campus_qa_platform.messages` - 消息表

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务端口 | 见各服务配置 |
| DB_HOST | 数据库地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | Lq200603 |
| DB_NAME | 数据库名 | campus_qa_platform |
| JWT_SECRET | JWT密钥 | campus-qa-secret-key-2024 |
| DEEPSEEK_API_KEY | DeepSeek API密钥 | sk-86165900516a4017a61aaaf062cfd73c |

### 服务URL配置

在网关和服务中配置其他服务的URL：

```javascript
// gateway/config/app.js
services: {
  userService: 'http://localhost:3001',
  knowledgeService: 'http://localhost:3002',
  qaService: 'http://localhost:3003',
  aiService: 'http://localhost:3004',
  messageService: 'http://localhost:3005'
}
```

## 扩展建议

### 1. 服务注册与发现
引入Consul或Nacos实现服务注册与发现

### 2. API网关
可替换为Kong、Zuul等专业网关

### 3. 消息队列
引入RabbitMQ或Kafka实现异步通信和解耦

### 4. 熔断器
引入Hystrix或Resilience4j实现熔断和降级

### 5. 链路追踪
引入Jaeger或Zipkin实现分布式追踪

### 6. 容器化
使用Docker Compose或Kubernetes进行容器编排

## 项目结构

```
microservices/
├── services/
│   ├── user-service/        # 用户服务
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── package.json
│   ├── knowledge-service/   # 知识库服务
│   ├── qa-service/          # 问答服务
│   ├── ai-service/           # AI服务
│   └── message-service/     # 消息服务
├── gateway/                  # API网关
│   ├── config/
│   ├── middleware/
│   ├── app.js
│   └── package.json
├── start-all.bat            # 启动脚本
└── README.md
```

## 注意事项

1. **启动顺序**: 用户服务 → 知识库服务 → AI服务 → 问答服务 → 消息服务 → API网关
2. **依赖关系**: 问答服务依赖AI服务和消息服务，知识库服务被AI服务调用
3. **数据库初始化**: 各服务会自动创建所需的数据库表
4. **端口占用**: 确保各服务端口（3000-3005）未被占用

## License

MIT
