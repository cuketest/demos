const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { CukeTest } = require('cuketest');
const assert = require('assert');
const path = require('path');
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// 超时时间和Hook设置 ///
setDefaultTimeout(60 * 1000);  //set step timeout to be 60 seconds
let child;
BeforeAll(async function () {
    CukeTest.minimize();
    let sampleDir = path.dirname(process.execPath) // CukeTest默认的sample路径
    child = await QtAuto.launchQtProcessAsync([  // 针对系统不同传入多个启动路径，会自动选择可用的路径
        sampleDir + "/bin/dockwidgets",
        sampleDir + "\\bin\\dockwidgets.exe"
    ]); 
    await model.getApplication("dockwidgets").exists(10);
})

After(async function () {
    let screenshot = await model.getWindow("Dock_Widgets").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

AfterAll(async function () {
    CukeTest.restore();
    CukeTest.maximize();
    Util.stopProcess(child);
})

//// 你的步骤定义 /////
Given("目标单元格在第{int}行第{int}列", async function (row, col) {
    let targetCell = model.getTable("Table").getItem(row, col);
    let value = await targetCell.value()
    this.attach(value);
    this.cell = targetCell;
});

When("修改数据为{string}并验证", async function (value) {
    let targetCell = this.cell;
    this.attach(await targetCell.value());
    await targetCell.set(value);
    let actualValue = await targetCell.value();
    assert.equal(actualValue, value, `修改后的值不为${value}`);
});

Then("滚动到目标单元格", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});

When("读取{string}文件中的数据", async function (xlsxName) {
    let workbook = xlsx.readFile("./features/support/" + xlsxName);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    this.attach(JSON.stringify(worksheetData, null, '  '));
    this.xlsxData = worksheetData;
});

Then("将数据写入到应用表格中", async function () {
    let data = this.xlsxData;
    let headers = await model.getTable("Table").columnHeaders();
    for (let row = 0; row < data.length; row++) {
        let rowDatum = data[row];
        for (let col = 0; col < headers.length; col++) {
            let value = rowDatum[headers[col]];
            await model.getTable("Table").setCellValue(row, col, value);
        }
    }
});

When("读取表格中全部数据", async function () {
    // 表格数据
    let data = await model.getTable("Table").data();
    // 表头（每列）
    let header = await model.getTable("Table").columnHeaders();
    // 表头（每行）
    let rowHeaders = await model.getTable("Table").rowHeaders();
    this.attach(JSON.stringify(data,null,'  '));
    this.attach(JSON.stringify(header, null, '  '));
    this.attach(JSON.stringify(rowHeaders, null, '  '));
    this.data = data;
    this.header = header;
    this.rowHeaders = rowHeaders
});


Then("将数据写入到xlsx文件{string}中", async function (xlsxName) {
    let header = this.header;
    let data = this.data;
    let xlsxData = arrayToJson(data, header);
    let filename = "./features/support/" + xlsxName;
    let workbook = xlsx.readFile("./features/support/origin.xlsx");
    let sheet = xlsx.utils.json_to_sheet(xlsxData, { header: header });
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
    this.attach(JSON.stringify(csvData, null, '  '));
    let filePath = "./features/support/" + csvName;
    Util.saveToCsvFile(csvData, filePath);
});

function arrayToJson(data, header) {
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