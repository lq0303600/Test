@echo off
chcp 65001 >nul
echo ==============================================
echo        校园智能咨询问答平台 - 推送脚本
echo ==============================================
echo.

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

if not exist "%GIT_PATH%" (
    echo 错误: Git 未安装或路径不正确!
    pause
    exit /b 1
)

cd /d d:\download\Test

echo [1/4] 配置 Git 用户信息...
"%GIT_PATH%" config --global user.name "LQ"
"%GIT_PATH%" config --global user.email "lq0303600@github.com"

echo [2/4] 添加文件到暂存区...
"%GIT_PATH%" add .

echo [3/4] 提交代码...
"%GIT_PATH%" commit -m "校园智能咨询问答平台更新"

echo [4/4] 推送到 GitHub...
echo.
echo 请在弹出的窗口中输入您的 GitHub 凭据:
echo - 用户名: lq0303600
echo - 密码: 使用 Personal Access Token
"%GIT_PATH%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================
    echo 推送成功!
    echo 仓库地址: https://github.com/lq0303600/Test
    echo ==============================================
) else (
    echo.
    echo ==============================================
    echo 推送失败，请检查网络连接或凭据!
    echo ==============================================
)

pause