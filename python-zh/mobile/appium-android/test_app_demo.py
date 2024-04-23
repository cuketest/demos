import pytest
from pytest_html import extras
from appium.webdriver.common.appiumby import AppiumBy

def test_api_demo_page_navigation(driver, extra):
    # 步骤 1：导航到 App 页面
    app = driver.find_element(by=AppiumBy.ACCESSIBILITY_ID, value="App")
    app_screenshot = app.screenshot_as_base64
    extra.append(extras.image(app_screenshot))
    app.click()

    # 步骤 2：点击 Action Bar
    action_bar = driver.find_element(by=AppiumBy.ACCESSIBILITY_ID, value="Action Bar")
    action_bar_screenshot = action_bar.screenshot_as_base64
    extra.append(extras.image(action_bar_screenshot))
    action_bar.click()

    # 步骤 3：断言新页面内容
    content = driver.find_element(by=AppiumBy.ANDROID_UIAUTOMATOR, value='new UiSelector().textStartsWith("Action")')
    content_screenshot = content.screenshot_as_base64
    extra.append(extras.image(content_screenshot))
    expected_text = "Action Bar Mechanics"
    assert expected_text in content.text, "文本与预期不符"
