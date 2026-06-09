@echo off
REM 校园智能问答平台 - 微服务启动脚本

echo ========================================
echo 校园智能问答平台 微服务启动脚本
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [错误] 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 设置工作目录
cd /d "%~dp0"

REM 安装依赖
echo [1/6] 安装用户服务依赖...
cd services\user-service
call npm.cmd install

echo [2/6] 安装知识库服务依赖...
cd ..\knowledge-service
call npm.cmd install

echo [3/6] 安装问答服务依赖...
cd ..\qa-service
call npm.cmd install

echo [4/6] 安装AI服务依赖...
cd ..\ai-service
call npm.cmd install

echo [5/6] 安装消息服务依赖...
cd ..\message-service
call npm.cmd install

echo [6/6] 安装API网关依赖...
cd ..\gateway
call npm.cmd install

cd ..\..

echo.
echo ========================================
echo 所有依赖安装完成！
echo ========================================
echo.
echo 启动顺序：
echo 1. 用户服务 (端口 3001)
echo 2. 知识库服务 (端口 3002)
echo 3. AI服务 (端口 3004)
echo 4. 问答服务 (端口 3003)
echo 5. 消息服务 (端口 3005)
echo 6. API网关 (端口 3000)
echo.
echo 请分别进入各个服务目录运行 npm start
echo ========================================

pause
