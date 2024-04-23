from leanproAuto import WinAuto, Util, Auto
from pytest_html import extras
import os
import platform
import base64

# 缓存文件路径
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

osName = getOSname()

# 不同的系统加载不同的Windows应用程序的UI模型文件
osModelMapping = {
    "Windows 10 and below": "model1.tmodel",
    "Windows 11": "modelWin11.tmodel"
}
model = WinAuto.loadModel(osModelMapping[osName])


# 编辑内容并保存
def test_edit_and_save():
    # 打开Windows记事本应用
    Util.launchProcess('notepad.exe')

    # 等待记事本打开并最大化
    model.getDocument("文本编辑器").exists(5)
    model.getWindow("记事本").maximize()

    # 点击【文件】--【新建】
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("新建(N)").invoke()
    text = 'hello world'
    # 在记事本中输入文本{string}
    model.getDocument("文本编辑器").set(text)

    # 校验文本是否设置成功
    model.getDocument("文本编辑器").checkProperty("value", text)

    # 点击【文件】--【保存】
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("保存(S)").invoke()

    filename = 'helloworld.txt'
    # 在文件对话框中保存为项目路径中的{string}
    filepath = projectPath + filename
    model.getEdit("文件名:1").set(filepath)
    model.getButton("保存(S)1").click()
    Util.delay(2000)

    # 文件应该保存成功
    exist = os.path.exists(filepath)
    assert exist == True
    print(filepath + "文件已创建")

    f = open(filepath, encoding='utf-8')
    filecontent = f.read()
    assert filecontent == text
    print('文件内容为:', filecontent)


# 更改记事本字体
def test_change_notepad_font(extra):
    # 打开字体设置界面
    model.getMenuItem("格式(O)").click()
    model.getMenuItem("字体(F)...").invoke()

    font = 'Arial'
    # 从【字体】下拉框中选择{string}
    model.getComboBox("字体(F):").waitProperty("enabled", True, 3)
    model.getComboBox("字体(F):").select(font)
    Util.delay(500)

    weight = '粗体'
    if osName == "Windows 11":
        weight = "Bold"
    # 从【字形】下拉框中选择{string}
    model.getComboBox("字形(Y):").select(weight)
    Util.delay(500)

    size = '20'
    # 从【大小】下拉框中选择{string}
    model.getComboBox("大小(S):").select(size)
    Util.delay(500)

    # 单击【确定】按钮以关闭【字体...】对话框
    model.getButton("确定").click()
    Util.delay(500)

    # 字体应该设置成功

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

    # 校验图片是否相等,允许的最大像素百分比差异容忍度为1,且忽略图像中的额外部分
    equal_result = Auto.visual.image.imageEqual(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1, "ignoreExtraPart": True})
    print('equal_result:', equal_result)

    compare_result = Auto.visual.image.imageCompare(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1,"ignoreExtraPart":True})
    # print('compare_result:', compare_result["diffImage"])

    # 生成差异图添加到测试报告中
    diff_image_data = base64.b64decode(compare_result["diffImage"])
    diff_image = os.path.join(tmpdir, 'diff_image.png')
    with open(diff_image, "wb") as f:
            f.write(diff_image_data)
    
    extra.append(extras.image(diff_image))
    print(f"对比图片已保存至 {diff_image}")
    assert equal_result, '字体比对与预期不一样'