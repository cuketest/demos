from leanproAuto import WinAuto, QtAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
from pytest_html import extras
import time

model = WinAuto.loadModel('models/model1.tmodel')
modelQt = QtAuto.loadModel('models/model1.tmodel')
scenarios("../features")
animationDur = 1000
# Before({ tags: "@only-windows" }, async function () {
#     if sys.platform != "win32":
        # return "skipped"
# })
@when(parsers.parse('循环点击四个图案{count:d}次并统计识别时间'))
def automation_for_appchooser(count,extra):
    reports = []
    ptns = ["相机", "眼镜", "字典", "图标"]
    for i in range(count):
        report = {}
        for ptn in ptns:
            beforeTime = int(round(time.time() * 1000))
            model.getPattern(ptn).click()
            afterTime = int(round(time.time() * 1000))
            duration = afterTime - beforeTime
            report[ptn] = str(duration) + 'ms'
        reports.append(report)
    extra.append(extras.json(reports))


# 测试图像自动化的API
@then(parsers.parse('验证相机此时不居中'))
def verify_camera_not_centered():
    Util.delay(animationDur)
    result = model.getPattern('居中相机').exists(2)
    assert result == False

@then(parsers.parse('点击相机'))
def click():
    model.getPattern('相机').click()

@then(parsers.parse('验证相机此时居中'))
def verify_camera_centered():
    Util.delay(animationDur)
    result = model.getPattern('居中相机').exists(2)
    assert result == True

@when(parsers.parse('点击级联虚拟控件{virtualName}'))
def click_cascade_virtual_controls(virtualName):
    if virtualName.find('Qt') > -1:
        modelQt.getVirtual(virtualName).click()
    else:
        model.getVirtual(virtualName).click()

@then(parsers.parse('通过Windows控件虚拟化点击左上角'))
def virtualization_click_topLeft():
    panel = model.getGeneric("Custom")
    rect = panel.rect()
    virtual = panel.getVirtual()
    virtual.click(50, 50)

@then(parsers.parse('通过Qt控件虚拟化点击右上角'))
def virtualization_click_topRight():
    panel = modelQt.getGraphicsView("GraphicsView")
    rect = panel.rect()
    virtual = panel.getVirtual()
    virtual.click(rect.width - 50, 50)