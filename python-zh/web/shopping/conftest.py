from leanproWeb import WebAuto
import time
browser = WebAuto().__enter__().chromium.launch(headless=False)
context = browser.new_context()
page = browser.new_page()

# pytest钩子函数，会在测试会话结束时调用，用于执行清理工作，如关闭浏览器
def pytest_sessionfinish(session):
    browser.close()
    context.close()
    page.close()

# 每个场景测试结束后调用，用于执行特定操作，如捕获屏幕截图
def pytest_bdd_after_scenario(request, feature, scenario):
    # TODO: 附件到报告
    path = "./screenshots/{0}.png".format(request.node.name)
    sc = page.screenshot(path=path)