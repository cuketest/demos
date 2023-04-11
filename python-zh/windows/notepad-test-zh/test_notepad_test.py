from leanproAuto import WinAuto, Util
from pytest_html import extras
import os

projectPath = os.getcwd() + '\\testcache\\'
model = WinAuto.loadModel('model1.tmodel')

# 编辑内容并保存
def test_edit_and_save():
    # 打开Windows记事本应用
    Util.launchProcess('notepad.exe')
    model.getDocument("文本编辑器").exists(5)
    model.getWindow("记事本").restore()

    text = 'hello world'
    # 在记事本中输入文本{string}
    model.getDocument("文本编辑器").set(text)

    # 点击【文件】--【保存】
    model.getMenuItem("文件(F)").click()
    model.getMenuItem("保存(S)").click()

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
    # Image = auto.image
    model = WinAuto.loadModel('model1.tmodel')

    # 点击【格式】--【字体】
    model.getMenuItem("格式(O)").click()
    model.getMenuItem("字体(F)...").click()

    font = 'Arial'
    # 从【字体】下拉框中选择{string}
    model.getComboBox("字体(F):").select(font)
    Util.delay(500)

    weight = '粗体'
    # 从【字形】下拉框中选择{string}
    model.getComboBox("字形(Y):").select(weight)
    Util.delay(500)

    size = '一号'
    # 从【大小】下拉框中选择{string}
    model.getComboBox("大小(S):").select(size)
    Util.delay(500)

    # 单击【确定】按钮以关闭【字体...】对话框
    model.getButton("确定").click()
    Util.delay(500)

    # 字体应该设置成功
    screenshot = model.getDocument("文本编辑器").takeScreenshot()
    # expectedImage = Image.fromData( model.getDocument("文本编辑器").modelImage())
    # actualImage = Image.fromData(screenshot)
    # result = Image.imageCompare(expectedImage, actualImage, {
    #     pixelPercentTolerance: 1,
    #     ignoreExtraPart: true
    # })
    # extra.append(extras.image(result.diffImage.getData()))
    # assert result.equal == True