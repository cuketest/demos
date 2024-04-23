from leanproAuto import QtAuto, WinAuto, Util, Auto
from pytest_bdd import scenarios, scenario, given, when, then, parsers
import os
import platform
import base64

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel('models/model.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

# 获取当前操作系统名称和版本信息
system = platform.system()
version = platform.version()

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@when(parsers.parse('在记事本中输入文本{docString}'))
def set_text(docString):
    # 点击 "textEdit"
    model.getEdit("textEdit").click()
    # 设置控件值为"Hello World!"
    model.getEdit("textEdit").set(docString.strip('\n'))


@when("点击保存")
def click_save():
    # 点击 "Save"
    model.getButton("Save").click()


@when(parsers.parse('在文件对话框中保存为项目路径中的"{relativePath}"'), target_fixture = "fullpath")
def set_fullpath(relativePath):
    # 注意点：路径使用os核心库path来拼接，避免路径分隔符的问题。
    # （Windows系统中路径分隔符为反斜杠'\'，而Linux系统中为斜杆'/'）
    fullpath = os.path.join(os.getcwd(), relativePath)
    try:
        os.remove(fullpath)
        print(f"文件 {fullpath} 删除成功")
    except OSError as e:
        print(f"删除文件 {fullpath} 时发生错误: {e}")

    # 设置控件值为文件全路径
    # 注意点：对于不同平台的分支操作，可以用os.platform()方法获取系统信息，接着分支处理
    if platform.system() == 'Windows':
        modelWin = WinAuto.loadModel("models/model.tmodel")
        modelWin.getEdit("文件名:1").exists(10)
        modelWin.getEdit("文件名:1").set(fullpath)
        modelWin.getButton("保存(S)").click()
    else:
        model.getEdit("fileNameEdit").set(fullpath)
        Util.delay(500)
        # 点击 "Save1"
        model.getButton("Save1").click()
    return fullpath


@then("文件应该保存成功")
def vertify_exists(fullpath):
    # 等待文件保存成功
    Util.delay(1000)

    # 检查文件是否存在
    assert os.path.exists(fullpath), "文件不存在"


@when("打开字体设置界面")
def set_font(request):
    screenshot_1 = model.getEdit("textEdit").takeScreenshot()
    request.attach(screenshot_1, 'image/png')
    # 点击 "Font"
    model.getButton("Font").exists(3)
    model.getButton("Font").click()


@when(parsers.parse('从【字体】下拉框中选择"{font_family}"'), target_fixture="font_family")
def select_font(font_family):
    # 选择字体列表项
    data = model.getList("FontListView").data()
    print("version=",version)
    if font_family not in data:
        font_family = "Courier New"
    if "kylin" in version.lower():
        font_family = "Sans Serif"
    Util.delay(500)
    model.getList("FontListView").select(font_family)
    return font_family


@when(parsers.parse('从【字形】下拉框中选择"{style}"'), target_fixture="style")
def select_style(style):
    # 选择字形 "Italic"
    model.getList("StyleListView").select(style)
    return style


@when(parsers.parse('从【大小】下拉框中选择"{font_size}"'), target_fixture="font_size")
def select_size(request, font_size):
    # 选择字号 "12"
    model.getList("SizeListView").select(font_size)

    # 截取字体设置界面的截图
    screenshot_2 = model.getWindow("Select_Font").takeScreenshot()
    request.attach(screenshot_2, 'image/png')
    return font_size


@when("完成字体设置")
def set_complete(request):
    model.getButton("OK").click()
    Util.delay(500)
    screenshot_3 = model.getEdit("textEdit").takeScreenshot()
    request.attach(screenshot_3, 'image/png')


@then("字体应该设置成功")
def vertify_font(request, font_family, style, font_size):
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
    request.attach(font_string)


@then(parsers.parse('界面上的文本显示应与预期图像"{expected_image}"相匹配'))
def vertify_font(request, expected_image):
    # 根据操作系统选择预期的图像
    if system != 'Windows':
        expected_image = "textEdit_linux_image"
        if "KYLINOS" in version:
            expected_image = "textEdit_kylinos_image"
    
    # 检查图像是否匹配
    model.getVirtual(expected_image).checkImage({"pixelPercentTolerance": 1, "ignoreExtraPart":True})
 