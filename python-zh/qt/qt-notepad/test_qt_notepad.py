from leanproAuto import QtAuto, WinAuto, Util, Auto
from pytest_bdd import scenarios, scenario, given, when, then, parsers
import os
import platform
from pytest_html import extras
import pytest
import base64

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel('model.tmodel')

# 获取当前操作系统的名称和版本信息
system = platform.system()
version = platform.version()


# 测试在记事本中编辑内容并保存，参数包含输入文本和期望的文件名
@pytest.mark.parametrize("input_text, expected_filename", [
    ("Hello World!", "helloworld.txt"),
])
def test_edited_content(extra, input_text, expected_filename):
    # 在记事本中输入文本
    model.getEdit("textEdit").click()
    model.getEdit("textEdit").set(input_text)

    # 截屏并添加到测试报告中
    screen1 = model.getEdit("textEdit").takeScreenshot()
    extra.append(extras.image(screen1))
    model.getEdit("textEdit").checkProperty("plainText", input_text)

    # 点击保存
    model.getButton("Save").click()

    # 构建文件的全路径
    # 注意点：路径使用os核心库path来拼接，避免路径分隔符的问题。（Windows系统中路径分隔符为反斜杠'\'，而Linux系统中为斜杆'/'）
    relativePath = "helloworld.txt"
    fullpath = os.path.join(os.getcwd(), relativePath)
    
    try:
        os.remove(fullpath)
        print(f"文件 {fullpath} 删除成功")
    except OSError as e:
        print(f"删除文件 {fullpath} 时发生错误: {e}")

    # 设置控件值为文件全路径
    # 注意点：对于不同平台的分支操作，可以用os.platform()方法获取系统信息，接着分支处理
    if platform.system() == 'Windows':
        modelWin = WinAuto.loadModel("model.tmodel")
        modelWin.getEdit("文件名:1").exists(10)
        modelWin.getEdit("文件名:1").set(fullpath)
        modelWin.getButton("保存(S)").click()
    else:
        model.getEdit("fileNameEdit").set(fullpath)
        Util.delay(500)
        model.getButton("Save1").click()

    # 等待文件保存成功
    Util.delay(1000)

    # 断言文件是否存在
    assert os.path.exists(fullpath), "文件不存在"


# 测试更改记事本字体
@pytest.mark.parametrize("font_family, style, font_size, expected_image", [
    ("Courier New", "Italic", "36", "textEdit_windows_image")
])
def test_set_font(extra, font_family, style, font_size, expected_image):
    # 打开字体设置界面并截图
    screenshot_1 = model.getEdit("textEdit").takeScreenshot()
    extra.append(extras.image(screenshot_1))
    model.getButton("Font").click()

    # 选择字体
    data = model.getList("FontListView").data()
    if font_family not in data:
        font_family = "Courier 10 Pitch"
    if "kylin" in version.lower():
        font_family = "Sans Serif"
    Util.delay(500)
    model.getList("FontListView").select(font_family)

    # 选择字形
    model.getList("StyleListView").select(style)

    # 选择字号
    model.getList("SizeListView").select(font_size)

    # 截取字体设置界面的截图
    screenshot_2 = model.getWindow("Select_Font").takeScreenshot()
    extra.append(extras.image(screenshot_2))

    # 完成字体设置
    model.getButton("OK").click()
    Util.delay(500)
    screenshot_3 = model.getWindow("Notepad1").takeScreenshot()
    extra.append(extras.image(screenshot_3))

    # 构建预期的font属性值字符串，用于属性检查
    font_weight = -1
    font_style = 5
    letter_spacing = 50
    underline = 1
    strikeout = 0
    overline = 0
    outline = 0
    shadow = 0

    # Linux系统不包含style信息
    style_suffix = f",{style}" if system == 'Windows' else ""
    font_string = f"{font_family},{font_size},{font_weight},{font_style},{letter_spacing},{underline},{strikeout},{overline},{outline},{shadow}{style_suffix}"

    # 检查字体属性
    model.getEdit("textEdit").checkProperty("font", font_string)
    extra.append(extras.text(font_string, name="font_string"))

    # 根据操作系统选择预期的图像
    if system != 'Windows':
        expected_image = "textEdit_linux_image"
        if "KYLINOS" in version:
            expected_image = "textEdit_kylinos_image"

    # 检查图像是否匹配
    model.getVirtual(expected_image).checkImage({"pixelPercentTolerance": 1, "ignoreExtraPart": True})
