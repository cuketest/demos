const xlsx = require('leanpro.xlsx');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, After } = require('cucumber');
const { QtModel, QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const cuketest = require('cuketest');
const path = require("path");
const assert = require('assert');
let model = QtModel.loadModel(__dirname + "/model.tmodel");

//// 你的步骤定义 /////

BeforeAll(async function () {
    cuketest.minimize();
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/dockwidgets");
})
After(async function () {
    let screenshot = await model.getWindow("Dock_Widgets").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(100);
})

Given("目标单元格在第{int}行第{int}列", async function (row, col) {
    let targetCell = model.getTable("Table").getItem(row, col);
    let value = await targetCell.value();
    this.attach(`第${row}行第${col}列单元格的值为: ${value}`);
    this.cell = targetCell;
});

When("修改数据为{string}并验证", async function (value) {
    let targetCell = await this.cell;
    let previousValue = await targetCell.value();
    await targetCell.set(value);
    let actualValue = await targetCell.value();
    assert.strictEqual(actualValue, value, `修改后的值不为${value}`);
    this.attach(`旧值为${previousValue}，新值为${actualValue}`);
});

Then("滚动到目标单元格", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});


When("读取{string}文件中的数据", async function (xlsxName) {
    let workbook = xlsx.readFile("./features/support/"+xlsxName);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    this.attach(JSON.stringify(worksheetData, null, '\t'));
    this.xlsxData = worksheetData;
    
});

Then("将数据写入到应用表格中", async function () {
    let data = this.xlsxData;
    let headers = await model.getTable("Table").columnHeaders();
    for(let row=0; row<data.length; row++){
        let rowDatum = data[row];
        for(let col=0; col<headers.length; col++){
            let value = rowDatum[headers[col]];
            await model.getTable("Table").setCellValue(row,col,value);
        }
        
    }
    this.attach(JSON.stringify(data, null, '\t'));
});

Given("将数据插入到第{int}行，数据为学号{int}，{string}学生，性别{string}，成绩为{int}，父母为{string}与{string}", async function (row,id,name, gender,score,father,mother) {
    await model.getTable("Table").setCellValue(row, '学号', id);
    await model.getTable("Table").setCellValue(row, '名字', name);
    await model.getTable("Table").setCellValue(row, '性别', gender);
    await model.getTable("Table").setCellValue(row, '成绩', score);
    await model.getTable("Table").setCellValue(row, '父亲', father);
    await model.getTable("Table").setCellValue(row, '母亲', mother);
    
    // console.log("滚动的位置为:", row, 0);
    try{
        await model.getTable("Table").scrollTo(row, 0);
    }catch(err){
        
    }
    await Util.delay(100);
});

When("读取表格中全部数据", async function () {
    let data = await model.getTable("Table").data();
    let header = await model.getTable("Table").columnHeaders();
    this.data = data;
    // console.log(data);
    // console.log(header);
    this.header = header;
});


Then("将数据写入到xlsx文件{string}中", async function (xlsxName) {
    let header = this.header;
    let data = this.data;
    let xlsxData = arrayToJson(data, header);
    let filename = "./features/support/"+xlsxName;
    let workbook = xlsx.readFile("./features/support/origin.xlsx");
    let sheet = xlsx.utils.json_to_sheet(xlsxData, {header: header});
    workbook.Sheets[workbook.SheetNames[0]] = sheet;
    xlsx.writeFile(workbook, filename);
    this.attach(JSON.stringify(sheet, null, '\t'));
});


Then("将数据写入到CSV文件{string}中", async function (csvName) {
    let header = this.header;
    let data = this.data;
    let csvData = arrayToJson(data, header);
    let filePath = "./features/support/" + csvName;
    await Util.saveToCsvFile(csvData, filePath);
    this.attach(JSON.stringify(csvData, null, '\t'));
});

function arrayToJson(data, header){
    // 用于将二维数组转换成对象数组的方法
    // 用于构建写入xlsx和csv的数据
    let rows = data.map((datum) => {
        let keyvalueSet = {};
        datum.forEach((cell, index) => {
            keyvalueSet[header[index]] = cell;
        })
        return keyvalueSet;
    })
    return rows;
}