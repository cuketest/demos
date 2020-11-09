const assert = require('assert');
const xlsx = require('leanpro.xlsx');
const { Given, When, Then } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const path = require('path');
const table = require('../support/table');
const db = require('../support/db');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////
Given("输出所有单元格数据", async function () {
    let tableModel = model.getTable("Table");
    let cells = await table.getAllCells(tableModel);
    let cellsValue = await Promise.all(cells.map(async (cell, index) => {
        let cellValue = await cell.name();
        return cellValue;
    }));
    this.attach(JSON.stringify(cellsValue));
});

Given("输出{int}行{int}列的数据", async function (row, column) {
    let tableModel = model.getTable("Table");
    let cell = table.getTargetCell(tableModel,row, column);
    let cellValue = await cell.name();
    this.attach(cellValue);
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
    for(let row in data){
        let rowData = Object.values(data[row]); // 将行数据的对象转换为数组
        for (let col in rowData) {
            let cellData = rowData[col];
            let cell = table.getTargetCell(tableModel, row, col)
            let cellValue = await cell.name();
            if (typeof (cellData) !== "String") {
                cellData = String(cellData);
            }
            cellData = cellData.replace(new RegExp(/\//g), ''); // 由于表格限制需要对含斜杠字符串进行处理
            await table.sendToCell(cell, cellData);
        }
    }

});

When("读取spreadsheet中的第{int}行数据", async function (targetRow) {
    let tableModel = model.getTable("Table");
    let cells = table.getTargetRow(tableModel, targetRow);
    let cellsValue = await Promise.all(cells.map(async (cell) => {
        return await cell.name();
    }))
    this.cells = cellsValue;
});

Then("将数据写入到MySQL数据库中", async function () {
    let cellData = this.cells;
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