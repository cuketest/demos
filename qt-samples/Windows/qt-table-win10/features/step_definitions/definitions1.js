const xlsx = require('leanpro.xlsx');
const { Given, When, Then } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const path = require('path');
const db = require('../support/db');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////
Given("输出所有单元格数据", async function () {
    let tableModel = model.getTable("Table");
    let rowCount = await tableModel.rowCount();
    for(let i = 0; i < rowCount; i++){
        let rowData = await tableModel.rowData(i);
        this.attach(JSON.stringify(rowData));  // 输出的数据显示在报告中，请使用“运行项目”来生成报告
    }
});

Given("输出{int}行{int}列的单元格数据", async function (row, column) {
    let tableModel = model.getTable("Table");
    let cell = await tableModel.cellValue(row, column);
    this.attach(cell);
});

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
    for (let row = 1; row < data.length; row++){ // 第0行不是数据，因此跳过
        let rowData = data[row];
        for(let header in rowData){
            let cellData = rowData[header];
            let cell = await tableModel.select(row, header);
            await cell.click();
            await cell.set(cellData);
            await cell.pressKeys('~');
            let actual = await cell.value();
            assert.strictEqual(actual, cellData);
            console.log(`成功在第${row}行${header}列写入${cellData}`);
        }
    }
});
When("读取spreadsheet中的第{int}行数据", async function (targetRow) {
    let tableModel = model.getTable("Table");
    let rowdata = await tableModel.rowData(targetRow);
    this.cells = rowdata;
});

Then("将数据写入到MySQL数据库中", async function () {
    let cellData = this.cells;
    console.log(cellData);
    await db.createTable(true);
    let res = await db.query(`INSERT INTO qt.spreadsheet
            (Item,
            Date,
            Price,
            Currency,
            ExRate,
            NOK)
            VALUES
            (?,?,?,?,?,?);`,
        cellData);
});

Then("数据被成功写入数据库", async function () {
    let res = await db.query(`SELECT * FROM qt . spreadsheet;`);
    let arr = Object.values(res[0]);
    assert.deepEqual(arr,this.cells,'首条数据不匹配');
});