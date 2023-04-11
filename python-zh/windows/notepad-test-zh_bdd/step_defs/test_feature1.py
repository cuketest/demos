from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
import os
import pytest

scenarios("../features")
projectPath = os.getcwd() + '\\testcache\\'
model = WinAuto.loadModel('./models/model1.tmodel')

# 编辑内容并保存
@given(parsers.parse('打开Windows记事本应用'))
def open_notepad():
    Util.launchProcess('notepad.exe')
    model.getDocument("文本编辑器").exists(5)
    model.getWindow("记事本").restore()


@when(parsers.parse('在记事本中输入文本{text}'), target_fixture="texts")
def enter_text(text):
    model.getDocument("文本编辑器").set(text)
    return text


@when(parsers.parse('点击【文件】--【保存】'))
def click_save():
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("保存(S)").click()


@when(parsers.parse('在文件对话框中保存为项目路径中的{filename}'), target_fixture="filepaths")
def enter_filename(filename):
    filepath = projectPath + filename
    model.getEdit("文件名:1").set(filepath)
    model.getButton("保存(S)1").click()
    Util.delay(2000)
    return filepath


@then(parsers.parse('文件应该保存成功'))
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
@when(parsers.parse('点击【格式】--【字体】'))
def click_font():
    model.getMenuItem("格式(O)").click()
    model.getMenuItem("字体(F)...").click()


@when(parsers.parse('从【字体】下拉框中选择{font}'))
def select_font(font):
    model.getComboBox("字体(F):").select(font)
    Util.delay(500)


@when(parsers.parse('从【字形】下拉框中选择{weight}'))
def select_weight(weight):
    model.getComboBox("字形(Y):").select(weight)
    Util.delay(500)


@when(parsers.parse('从【大小】下拉框中选择{size}'))
def select_size(size):
    model.getComboBox("大小(S):").select(size)
    Util.delay(500)


@when(parsers.parse('单击【确定】按钮以关闭【字体...】对话框'))
def close_dialog():
    model.getButton("确定").click()
    Util.delay(500)


@then(parsers.parse('字体应该设置成功'))
def font_set_successfully():
    screenshot = model.getDocument("文本编辑器").takeScreenshot()
    # expectedImage = Image.fromData( model.getDocument("文本编辑器").modelImage())
    # actualImage = Image.fromData(screenshot)
    # result = Image.imageCompare(expectedImage, actualImage, {
    #     pixelPercentTolerance: 1,
    #     ignoreExtraPart: true
    # })
    # extra.append(extras.image(result.diffImage.getData()))
    # assert result.equal == True
