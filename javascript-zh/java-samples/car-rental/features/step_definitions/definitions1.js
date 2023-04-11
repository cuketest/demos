const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { JavaModel, JavaAuto } = require("leanpro.java");
const { Util } = require('leanpro.common');
const CarRental = require('./car-rental.js');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let model = JavaModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////

const cr = new CarRental(model);

Then("使用账户名{string}登录", async function (username) {
    await cr.login(username);
});

Then("进入订单界面", async function () {
    await cr.redirectToView("View Orders")
});

Then("搜索与{string}相关的订单", async function (keyword) {
    await cr.orderSearching(keyword);
});

Then("检查订单客户全称为{string}", async function (fullName) {
    await cr.orderCheckingByName(fullName);
});

Then("返回首页", async function () {
    await cr.redirectToView("Home");
});

Then("进入租车界面", async function () {
    await cr.redirectToView("New Order");
});

Then("选择地区{string}", async function (location) {
    await cr.selectLocation(location);
    await cr.nextStep();
});

Then("选择汽车{string}", async function (car) {
    await cr.selectCar(car);
    await cr.nextStep();
});

Then("填写个人信息并选择附加服务", async function () {
    await cr.fillForm();
    await cr.nextStep();
});

Then("完成租车", async function () {
    await cr.completeRental();
});

Then("进入看车界面", async function () {
    await cr.redirectToView("View Cars");
});

Then("选中汽车{string}", async function (car) {
    await cr.selectCar(car);    
});

Then("进入下一步", async function () {
    await cr.nextStep();
});

Then("查看汽车信息", async function () {
    let info = await cr.checkCar();
    this.attach(info, "image/png");
});

Then("关闭CarRental应用", async function () {   
    await cr.closeByDefault();
});



