import pytest
from appium.options.common.base import AppiumOptions
from appium import webdriver


# Appium Server 配置
@pytest.fixture(scope='session')
def driver():
    options = AppiumOptions()
    options.load_capabilities({
        'platformName': 'Android',
        'platformVersion': '10.0',
        'appPackage': 'io.appium.android.apis',  # package 名字
        'appActivity': '.ApiDemos',  # 启动activity 名字
        'resetKeyboard': True,
        'noReset': True,
        'unicodeKeyboard': True
    })
    driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', options=options)
    yield driver
    driver.quit()
