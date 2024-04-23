from leanproAuto import WinAuto, Util, Keyboard
from leanproWeb import WebAuto
from pytest_bdd import scenarios, given, when, then, parsers
import pytest
import json
import sys
import os

# 获取安装路径
install_path = os.path.dirname(os.path.dirname(sys.executable))

# 加载Windows应用程序的UI模型文件
model = WinAuto.loadModel("models/model1.tmodel")

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

# 启动electron应用
app = WebAuto().__enter__().electron.launch(
    args=["--no--qt", "--no-detach"], 
    executable_path=f"{install_path}\\Cuke.exe"
)
context = app.context()
window = app.firstWindow()

with open(r'selectors.json', 'r', encoding='utf-8') as f:
    selectors = json.load(f)

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 新建剧本/脚本
@given(parsers.parse('点击{btnName}下拉按钮中的{itemName}'))
def new_feature(btnName, itemName):
    window.click(selectors[f'{btnName}下拉'])
    window.screenshot(path = os.path.join(os.getcwd(), 'testing-cache\\screenshots', f'点击{btnName}下拉列表-{itemName}下拉框完毕.png'))
    window.click(selectors[f'{btnName}下拉列表-{itemName}'])
    window.screenshot(path = os.path.join(os.getcwd(), 'testing-cache\\screenshots', f'选择{btnName}下拉列表-{itemName}下拉框.png'))


@given(parsers.parse('点击{btnName}按钮'))
def click_btn(btnName):
    window.click(selectors[btnName])
    window.screenshot(path=os.path.join(os.getcwd(), 'testing-cache\\screenshots', f'点击{btnName}.png'))


@given(parsers.parse('保存为{fileName}'))
def save_ad(fileName):
    model.getEdit("保存文件名").clearAll()

    # 禁用输入法
    Keyboard.disableIme()
    model.getEdit("保存文件名").pressKeys(os.path.join(os.getcwd(), 'testing-cache', fileName))
    model.getButton("保存").click()
    Util.delay(2000)


@given(parsers.parse('验证{fileName}文件存在'))
def verify_file_exist(fileName):
    fullname = os.path.join(os.getcwd(), 'testing-cache', fileName)
    is_exist = os.path.exists(fullname)
    assert is_exist == True, f'未找到文件{fullname}'


#运行项目
@given(parsers.parse('打开项目{projectDir}'))
def open_project(projectDir):
    title = model.getPane("CukeTest窗口").property("title")
    window.click(selectors["打开项目"])

    fullpath = os.path.join(os.getcwd(), projectDir)
    print('fullpath=',fullpath)
    model.getEdit("打开文件夹").set(fullpath)
    model.getButton("选择文件夹").click()
    Util.delay(2000)


@then('等待运行结束')
def waiting_for_end():
    ele = window.query_selector(selectors["停止运行"]) 
    if model.getPane("CukeTest报告窗口").exists(5):
        model.getWindow("CukeTest报告窗口").close()
    # 等待项目/剧本/脚本运行结束
    # 判断依据是“停止运行”按钮是否恢复
    while True:
        if 'disabled' in ele.get_attribute('class'):
            Util.delay(500)
            if 'disabled' in ele.get_attribute('class'):
                break


@then(parsers.parse('输出栏中出现运行结果包含下面内容{docString}'))
def output_content(docString, request):
    outputMessageBox = window.query_selector(selectors["输出栏"])
    outputMessage = outputMessageBox.inner_text()

    # 将输出信息添加到测试报告中
    request.attach(outputMessage)
    assert (docString.replace('\n', '') in outputMessage), "项目未运行"


@when(parsers.parse('打开文件{fileDir}'))
def open_dir(fileDir):
    window.click(selectors["打开"])
    fullpath = os.path.join(os.getcwd(), fileDir)
    print('fullpath=',fullpath)
    model.getEdit("打开文件名").set(fullpath)

    # 处理按钮可能不同的情况
    try:
        model.getButton("打开").click()
    except Exception as e:
        pass

    try:
        model.getGeneric("带下拉框的打开").click()
    except Exception as e:
        pass


# 打开模型管理器
@given(parsers.parse('点击{btnName}按钮打开新窗口'), target_fixture="newWindow")
def open_model(btnName):
    window.click(selectors[btnName])   
    newWindow = app.wait_for_event('window') # 等待新窗口
    print(newWindow.title())
    return newWindow


@when('截图模型管理器')
def screenshot_model(newWindow,request):
    screenshot = newWindow.screenshot(path = os.path.join(os.getcwd(), 'testing-cache\screenshots', 'mm_helper.png'))
    request.attach(screenshot, 'image/png')


@then('关闭模型管理器')
def close_model(newWindow):
    newWindow.close()
