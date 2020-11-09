const xlsx = require('leanpro.xlsx');
const { Given, When, Then } = require('cucumber');
const { QtModel, launchQtProcess } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const path = require("path");
const assert = require('assert');
let model = QtModel.loadModel(__dirname + "/model.tmodel");

//// 你的步骤定义 /////



Given("目标单元格在第{int}行第{int}列", async function (row, col) {
    let targetCell = model.getTable("Table").getItem(row, col);
    console.log("targetCell:", targetCell);
    this.cell = targetCell;
});

When("修改数据为{string}并验证", async function (value) {
    let targetCell = this.cell;
    console.log(await targetCell.value())
    await targetCell.set(value);
    let actualValue = await targetCell.value();
    assert.equal(actualValue, value, `修改后的值不为${value}`);
});

Then("滚动到目标单元格", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});


When("读取{string}文件中的数据", async function (xlsxName) {
    let workbook = xlsx.readFile("./features/support/"+xlsxName);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    console.log("xlsx data:", worksheetData);
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
});

When("读取表格中全部数据", async function () {
    let data = await model.getTable("Table").data();
    let header = await model.getTable("Table").columnHeaders();
    this.data = data;
    console.log(data);
    console.log(header);
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
});

Then("将数据写入到MySQL数据库中", async function () {

    return 'pending';
});

Then("将数据写入到CSV文件{string}中", async function (csvName) {
    let header = this.header;
    let data = this.data;
    let csvData = arrayToJson(data, header);
    console.log(csvData);
    let filePath = "./features/support/" + csvName;
    await Util.saveToCsvFile(csvData, filePath);
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