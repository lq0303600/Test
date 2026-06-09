@echo off
REM 校园智能咨询问答平台 - 启动所有微服务

echo ========================================
echo 校园智能咨询问答平台 微服务启动
echo ========================================

REM 启动用户服务
echo [1/6] 启动用户服务 (端口 3001)...
start "UserService" cmd /k "cd /d %~dp0services\user-service && node app.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动知识库服务
echo [2/6] 启动知识库服务 (端口 3002)...
start "KnowledgeService" cmd /k "cd /d %~dp0services\knowledge-service && node app.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动AI服务
echo [3/6] 启动AI服务 (端口 3004)...
start "AIService" cmd /k "cd /d %~dp0services\ai-service && node app.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动问答服务
echo [4/6] 启动问答服务 (端口 3003)...
start "QAService" cmd /k "cd /d %~dp0services\qa-service && node app.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动消息服务
echo [5/6] 启动消息服务 (端口 3005)...
start "MessageService" cmd /k "cd /d %~dp0services\message-service && node app.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动API网关
echo [6/6] 启动API网关 (端口 3000)...
start "Gateway" cmd /k "cd /d %~dp0gateway && node app.js"

echo.
echo ========================================
echo 所有服务正在启动...
echo 访问地址: http://localhost:3000
echo ========================================
echo.
echo 按任意键关闭此窗口（不会停止服务）...
pause >nul
