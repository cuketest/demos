from pytest_bdd import scenarios, given, when, then, parsers
from appium.webdriver.common.appiumby import AppiumBy

# BDD 剧本与 Python 文件关联
scenarios('../features/appium_demo.feature')


@given('点击App跳转到App页面')
def go_to_app_page(driver, request):
    ele = driver.find_element(by=AppiumBy.ACCESSIBILITY_ID, value="App")
    request.attach(ele.screenshot_as_base64, "image/png")
    ele.click()


@when('在App页面中点击Action Bar')
def click_action_bar(driver, request):
    action_bar = driver.find_element(by=AppiumBy.ACCESSIBILITY_ID, value="Action Bar")
    request.attach(action_bar.screenshot_as_base64, "image/png")
    action_bar.click()


@then(parsers.parse('页面应该跳转到Action Bar页面,页面中应该包含"{text}"'))
def verify_text_on_page(driver, text, request):
    content = driver.find_element(by=AppiumBy.ANDROID_UIAUTOMATOR, value='new UiSelector().textStartsWith("Action")')
    request.attach(content.text)
    request.attach(content.screenshot_as_base64, "image/png")
    assert text in content.text, "The text does not match the expected text."
