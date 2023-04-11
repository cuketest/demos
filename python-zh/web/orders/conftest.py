from leanproWeb import WebAuto
from auto.sync_api import sync_auto
import time
browser = WebAuto().__enter__().chromium.launch(headless=False)
context = browser.new_context()
page = browser.new_page()

def pytest_sessionfinish(session):
    browser.close()
    context.close()
    page.close()


def pytest_bdd_after_scenario(request, feature, scenario):
    # TODO: 附件到报告
    path = "./screenshots/{0}.png".format(request.node.name)
    sc = page.screenshot(path=path)