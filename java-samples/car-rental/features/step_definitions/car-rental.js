const assert = require('assert');
const child_process = require('child_process');
module.exports = class CarRental {
    constructor(model){
        this.model = model;
        this.pid = null;
        this.pickOrReturn = "Pickup State"; // "Pickup State" | "Return State"
    }
    // "进入订单界面"
    async redirectToView(view) {
        // view: "View Orders" | "New Order" | "View Cars" | "Home"
        await this.model.getJButton(view).click(0, 0, 1);
    }
    // "搜索与{string}相关的订单"
    async orderSearching(condition) {
        await this.model.getJEdit("Search").set(condition);
        await this.model.getJButton("Search1").click(0, 0, 1);
    }
    // "检查订单"
    async orderCheckingByName(fullName) {
        let firstInTable = async(data) => {
            try{
                let lastName = await this.model.getJTable("table").getCellValue(0, 2);
                let firstName = await this.model.getJTable("table").getCellValue(0, 1);
                return firstName + ' ' + lastName === data
            }
            catch(e){
                return false;
            }
        }
        let nameInOrder = await firstInTable(fullName);
        assert.ok(nameInOrder, '目标订单不在表中');
        
    }
    // "选择地区{string}"
    async selectLocation(location, pickOrReturn) {
        const model = this.model;
        if(location == "New York"){
            await model.getGeneric("scroll bar").click(0, 150, 1);
            await model.getGeneric("scroll bar").click(0, 150, 1);
            await model.getGeneric("scroll bar").click(0, 150, 1);
            await model.getJLabel("New York").click(0, 0, 1);
            await model.getJCheckBox("Return car at the same locatio").toggleCheck();
            return ;
        }
        if(pickOrReturn) 
            this.pickOrReturn = pickOrReturn;
        let locationList = await this.getLocationList();
        let targetIndex = locationList.find((loc)=> loc == location);
        console.log(this.pickOrReturn);
        await this.model.getJList(this.pickOrReturn).select(targetIndex);
    }        

    async getLocationList(){
        let locationList = await this.model.getJList("Pickup State").data();
        return locationList;
    }
    // "进入下一步"
    async nextStep(){
        await this.model.getJButton("Next").click(0, 0, 1);
    }
    // "填写个人信息并选择附加服务"
    async fillForm() {
        await this.fillProfile();
        await this.fillPricing();
        await this.fillAddon();
    }
    // 填写个人信息
    async fillProfile(){
        await this.model.getJEdit("First Name").set("Mark");
        await this.model.getJEdit("Last Name").set("Test");
        await this.model.getJEdit("Driver License").click();
        await this.model.getJEdit("Driver License").pressKeys('123456');
        await this.model.getJEdit("Driver License").pressKeys('{TAB}');
    }
    // 填写优惠码
    async fillPricing(){
        await this.model.getJRadioButton("I have a discount coupon:").check();
        await this.model.getJEdit("Discount").set("ABCD-CBAD-ADBC-BCAD");
    }
    // 选择其它业务
    async fillAddon(){
        await this.model.getGeneric("greenhouse gas").click(0, 0, 1);
        await this.model.getGeneric("collision").click(0, 0, 1);
    }

    // "完成租车"
    async completeRental() {
        await this.model.getJButton("Finish").click(0, 0, 1);
        await this.model.getJButton("确定").pressKeys("~");
    }

    // "选中汽车{string}"
    async selectCar(carName) {
        // 展开选中树节点
        await this.model.getJLabel(carName).dblClick(0, 0, 1);
    }
    // "查看汽车信息"
    async checkCar() {
        // await this.model.getJLabel("label").takeScreenshot('selected_car.png'); // 将截图保存至本地
        let actualCarImage = await this.model.getJLabel("label").takeScreenshot();
        // let expectedCarImage = await Image.fromFile(".\\assets\\expected_car.png");
        let remain = await this.model.getJEdit("Currently available cars").value();
        console.log("当前选中的汽车库存为:", remain)
        let charge = await this.model.getJEdit("Car charge per day").value();
        console.log("当前选中的汽车每天租金为:", charge);
        return actualCarImage;
    }
    // "启动CarRental应用"
    static async launcher(path) {
        this.pid = child_process.spawn("java", ["-jar", path, "&"], { detached: true, shell: false });
    }
    // "关闭CarRental应用"
    async closeByDefault() {
        let windowChild = this.model.getJMenu("About");
        await windowChild.getJWindow("AnyWindow", {search:'up'}).close();
        try{
            // 如果是中途退出需要再次点击“确认”按钮
            await this.model.getJButton("Yes").click(0, 0, 1);
        }catch(e){};
    }
    // "通过菜单关闭CarRental应用"
    async closeByMenu() {
        await this.model.getJMenu("File").click(0, 0, 1);
        await this.model.getJMenuItem("Close").click(0, 0, 1);
    }
    // "使用账户名{string}登录"
    async login(username) {
        // console.log(this.model);
        await this.model.getJEdit("User name").set(username);
        await this.model.getJButton("Login").click(0, 0, 1); 
    }

}