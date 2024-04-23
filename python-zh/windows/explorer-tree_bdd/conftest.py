from leanproAuto import WinAuto

model = WinAuto.loadModel('./models/model1.tmodel')


# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    if model.getWindow("Window").getWindow({ "className": "#32770" }).exists():
        model.getWindow("Window").getWindow({ "className": "#32770" }).close()
    model.getWindow("Window").minimize()