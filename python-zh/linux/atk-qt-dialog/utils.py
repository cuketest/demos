import subprocess
import os
def run(appPath):
    # 定义环境变量
    custom_env = {
        "GTK_MODULES": "gail:atk-bridge",
        "QT_ACCESSIBILITY": "1",
        "QT_LINUX_ACCESSIBILITY_ALWAYS_ON": "1",
        **os.environ
    }
    # 启动子进程，指定环境变量
    process = subprocess.Popen([appPath], env=custom_env)
    return process
