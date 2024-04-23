from leanproAuto import WinAuto, Util, Auto
from pytest_bdd import scenarios, given, when, then, parsers
import os
import platform
import pytest
import base64

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

# 定义缓存目录
projectPath = os.getcwd() + '\\testcache\\'
tmpdir = os.path.join(os.getcwd(), 'testcache')

# 用来判断当前系统是win11还是win10
def getOSname():
    osRelease = platform.platform()
    osReleaseSplit = osRelease.split('.')[-1].split('-')
    osReleaseTail = osReleaseSplit[0]
    if int(osReleaseTail) > 20000:
        return "Windows 11"
    else:
        return "Windows 10 and below"

# 不同的系统加载不同的Windows应用程序的UI模型文件
osName = getOSname()
osModelMapping = {
    "Windows 10 and below": "/model1.tmodel",
    "Windows 11": "/modelWin11.tmodel"
}
model = WinAuto.loadModel('models' + osModelMapping[osName])

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 编辑内容并保存
@given('打开Windows记事本应用')
def open_notepad():
    Util.launchProcess('notepad.exe')

    # 等待记事本打开并最大化
    model.getDocument("文本编辑器").exists(5)
    model.getWindow("记事本").maximize()

@when('点击【文件】--【新建】')
def click_new():
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("新建(N)").invoke()

# target_fixture用来将text值传递给上下文
@when(parsers.parse('在记事本中输入文本{text}'), target_fixture="texts")
def enter_text(text):
    model.getDocument("文本编辑器").set(text)

    # 校验文本是否设置成功
    model.getDocument("文本编辑器").checkProperty("value", text)
    return text


@when('点击【文件】--【保存】')
def click_save():
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("保存(S)").invoke()


@when(parsers.parse('在文件对话框中保存为项目路径中的{filename}'), target_fixture="filepaths")
def enter_filename(filename):
    filepath = projectPath + filename
    model.getEdit("文件名:1").set(filepath)
    model.getButton("保存(S)1").click()
    Util.delay(2000)
    return filepath


@then('文件应该保存成功')
def saved_successfully(texts, filepaths):
    filepath = filepaths
    exist = os.path.exists(filepath)
    assert exist == True
    print(filepath + "文件已创建")

    f = open(filepath, encoding='utf-8')
    filecontent = f.read()
    assert filecontent == texts
    print('文件内容为:', filecontent)


# 更改记事本字体
@when('打开字体设置界面')
def click_font():
    model.getMenuItem("格式(O)").click()
    model.getMenuItem("字体(F)...").invoke()


@when(parsers.parse('从【字体】下拉框中选择{font}'))
def select_font(font):
    model.getComboBox("字体(F):").waitProperty("enabled", True, 3)
    model.getComboBox("字体(F):").select(font)
    Util.delay(500)


@when(parsers.parse('从【字形】下拉框中选择{weight}'))
def select_weight(weight):
    if osName == "Windows 11":
        weight = "Bold"
    model.getComboBox("字形(Y):").select(weight)
    Util.delay(500)


@when(parsers.parse('从【大小】下拉框中选择{size}'))
def select_size(size):
    model.getComboBox("大小(S):").select(size)
    Util.delay(500)


@when('完成字体设置')
def close_dialog():
    model.getButton("确定").click()
    Util.delay(500)


@then('字体应该设置成功')
def font_set_successfully(request):
    
    # 获取本地所期望的字体图片数据
    expected_image_data = model.getDocument("文本编辑器").modelImage()

    # 获取当前设置的字体图片数据
    screenshot_path = os.path.join(tmpdir, 'expected_image.png')
    model.getDocument("文本编辑器").takeScreenshot(screenshot_path)
    with open(screenshot_path, 'rb') as image_file:
        actual_image_data = image_file.read()
    
    # 将数据转为base64,方便做比对处理
    expected_image_data_base64 = base64.b64encode(expected_image_data).decode('utf-8')
    actual_image_data_base64 = base64.b64encode(actual_image_data).decode('utf-8')

    equal_result = Auto.visual.image.imageEqual(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1, "ignoreExtraPart": True})
    print('equal_result:', equal_result)

    # 校验图片是否相等,允许的最大像素百分比差异容忍度为1,且忽略图像中的额外部分
    compare_result = Auto.visual.image.imageCompare(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1,"ignoreExtraPart":True})
    # print('compare_result:', compare_result["diffImage"])

    # 生成差异图添加到测试报告中
    diff_image_data = base64.b64decode(compare_result["diffImage"])
    diff_image = os.path.join(tmpdir, 'diff_image.png')
    with open(diff_image, "wb") as f:
            f.write(diff_image_data)
    
    print(f"对比图片已保存至 {diff_image}")
    request.attach(compare_result["diffImage"], "image/png")
    assert equal_result, '字体比对与预期不一样'
