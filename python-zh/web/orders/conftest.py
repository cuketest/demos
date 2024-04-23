from leanproWeb import WebAuto
from auto.sync_api import sync_auto
import time
import base64

# 使用WebAuto库启动一个Chromium浏览器实例，`headless=False`表示浏览器将以有头模式启动（即浏览器界面可见）
browser = WebAuto().__enter__().chromium.launch(headless=False)

# 在浏览器中创建一个新的浏览上下文
context = browser.new_context()

# 在当前浏览器实例中打开一个新的页面（或标签页）
page = browser.new_page()


# pytest钩子函数，会在测试会话结束时调用，用于执行清理工作，如关闭浏览器
def pytest_sessionfinish(session):
    # 关闭浏览器实例、浏览上下文和页面，释放资源。
    browser.close()
    context.close()
    page.close()


# 每个场景测试结束后调用，用于执行特定操作，如捕获屏幕截图
def pytest_bdd_after_scenario(request, feature, scenario):
    screenshot = page.screenshot()
    screen = base64.b64encode(screenshot).decode('utf-8')

    # 将屏幕截图附加到测试报告中，"image/png"指定了附加内容的MIME类型
    request.attach(screen, "image/png")
