from pytest_bdd import scenarios, scenario, given, when, then, parsers


@when(parsers.parse("选择国家{country}"))
def choose_country(country, modelQt):
    modelQt.getComboBox("localeSelector").open()
    modelQt.getList("List").findItem(country).click()


@when(parsers.parse("输入数字{input}"))
def input_number(input, modelQt):
    modelQt.getSpinBox("minVal").click()
    modelQt.getSpinBox("minVal").set(input)


@then(parsers.parse("实际结果为{expected}"))
def check_actural_result(expected, modelQt, request):
    request.attach(modelQt.getWindow("ValidatorsForm").takeScreenshot(), "image/png")
    modelQt.getSpinBox("minVal").checkProperty("value", expected, "实际数字与预期不符")
