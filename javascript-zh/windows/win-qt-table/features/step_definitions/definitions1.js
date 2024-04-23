const { Keyboard } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { AfterAll, BeforeAll, After} = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require('path');

// 设置步骤的超时时间为120秒
setDefaultTimeout(120 * 1000);
const db = require('../support/db');
const assert = require('assert');

// 加载Windows应用的UI模型文件
const model = WinAuto.loadModel(__dirname + "\\model1.tmodel");
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
BeforeAll(async function () {
    child = Util.launchSample('spreadsheet.exe');
    if (await model.getWindow("Window").exists(5)) {
        await model.getWindow("Window").restore();
        // 禁用输入法
        Keyboard.disableIme(); 
    }
    else {
        throw new Error("Testing application was not launched.");
    }

    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize();
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png')
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await Util.stopProcess(child); 
    // CukeTest.restore();
})

//// 你的步骤定义 /////
Given("输出所有单元格数据", async function () {
    let tableModel = model.getTable("Table");

    // 获取表格行数
    let rowCount = await tableModel.rowCount();

    // 遍历每一行并获取其数据
    for(let i = 0; i < rowCount; i++){
        let rowData = await tableModel.rowData(i);
        // 输出的数据显示在报告中，请使用“运行项目”来生成报告
        this.attach(JSON.stringify(rowData));  
    }
});

// {int} 占位符接收一个整数类型参数，两个整数分别传递给变量row和column
Given("输出{int}行{int}列的单元格数据", async function (row, column) {

    // 获取单元格数据，添加到报告中
    let tableModel = model.getTable("Table");
    let cell = await tableModel.cellValue(row, column);
    this.attach(cell);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量fileName
When("读取{string}文件中的数据", async function (fileName) {
    // 直接由工具箱拖拽生成代码
    let workbook = xlsx.readFile(path.join(__dirname, '..', 'support', 'data', fileName));
    // console.log("表格数据为", workbook);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    // console.log("工作簿数据为", worksheetData);
    this.attach(JSON.stringify(worksheetData, null, '\t'));
    this.xlsxData = worksheetData; // 保存到场景的world对象中来传递数据
});

Then("写入到spreadsheet中", async function () {
    let data = this.xlsxData;
    let tableModel = model.getTable("Table");
    let headers = await tableModel.columnHeaders();

    // 通过循环点击单元格、设置数据、回车将数据写入到表格中
    for (let row = 1; row < data.length; row++){ // 第0行不是数据，因此跳过
        let rowData = data[row];
        for(let header in rowData){
            let cellData = rowData[header];
            let cell = await tableModel.select(row, header);
            await cell.click();
            await cell.set(cellData);
            await cell.pressKeys('~');
            await Util.delay(300);
            // let actual = await tableModel.cellValue(row,header);
            await cell.checkProperty('value', cellData, "写入数据不符合预期")
            console.log(`成功在第${row}行${header}列写入${cellData}`);
        }
    }
});

// {int} 占位符接收一个整数类型参数，整数传递给变量targetRow
When("读取spreadsheet中的第{int}行数据", async function (targetRow) {
    let tableModel = model.getTable("Table");

    // 获取行数据
    let rowdata = await tableModel.rowData(targetRow);
    this.cells = rowdata;
});

Then("将数据写入到MySQL数据库中", async function () {
    this.attach("如果需要测试导出数据到MySQL数据库的功能，请去除本步骤脚本注释");

    // let cellData = this.cells;
    // console.log(cellData);
    // await db.createTable(true);
    // let res = await db.query(`INSERT INTO qt.spreadsheet
    //         (Item,
    //         Date,
    //         Price,
    //         Currency,
    //         ExRate,
    //         NOK)
    //         VALUES
    //         (?,?,?,?,?,?);`,
    //     cellData);
});

Then("数据被成功写入数据库", async function () {
    this.attach("如果需要测试导出数据到MySQL数据库的功能，请去除本步骤脚本注释");
    // let res = await db.query(`SELECT * FROM qt . spreadsheet;`);
    // let arr = Object.values(res[0]);
    // assert.deepEqual(arr,this.cells,'首条数据不匹配');
});