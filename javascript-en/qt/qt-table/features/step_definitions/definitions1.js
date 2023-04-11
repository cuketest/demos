const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { CukeTest } = require('cuketest');
const assert = require('assert');
const path = require('path');
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// Timeout and Hook settings ///
setDefaultTimeout(60 * 1000);  //set step timeout to be 60 seconds
let child;

BeforeAll(async function () {
    CukeTest.minimize();
    let sampleDir = path.dirname(process.execPath) // CukeTest default sample path
    child = await QtAuto.launchQtProcessAsync([  // Multiple startup paths are passed in for different systems, and the available paths will be automatically selected
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

//// Step Definitions /////
Given("The target cell is at row {int}, column {int}", async function (row, col) {
    let targetCell = model.getTable("Table").getItem(row, col);
    let value = await targetCell.value()
    this.attach(value);
    this.cell = targetCell;
});

When("Modify the data to {string} and verify", async function (value) {
    let targetCell = this.cell;
    this.attach(await targetCell.value());
    await targetCell.set(value);
    let actualValue = await targetCell.value();
    assert.equal(actualValue, value, `The modified value is not${value}`);
});

Then("Scroll to target cell", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});

When("Read the data in the {string} file", async function (xlsxName) {
    let workbook = xlsx.readFile("./features/support/" + xlsxName);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    this.attach(JSON.stringify(worksheetData, null, '  '));
    this.xlsxData = worksheetData;
});

Then("Write data to application form", async function () {
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

When("Read all data in the table", async function () {
    let data = await model.getTable("Table").data();
    let header = await model.getTable("Table").columnHeaders();
    this.attach(JSON.stringify(data,null,'  '));
    this.attach(JSON.stringify(header, null, '  '));
    this.data = data;
    this.header = header;
});


Then("Write data to xlsx file {string}", async function (xlsxName) {
    let header = this.header;
    let data = this.data;
    let xlsxData = arrayToJson(data, header);
    let filename = "./features/support/" + xlsxName;
    let workbook = xlsx.readFile("./features/support/origin.xlsx");
    let sheet = xlsx.utils.json_to_sheet(xlsxData, { header: header });
    workbook.Sheets[workbook.SheetNames[0]] = sheet;
    xlsx.writeFile(workbook, filename);
});

Then("Write data to CSV file {string}", async function (csvName) {
    let header = this.header;
    let data = this.data;
    let csvData = arrayToJson(data, header);
    this.attach(JSON.stringify(csvData, null, '  '));
    let filePath = "./features/support/" + csvName;
    Util.saveToCsvFile(csvData, filePath);
});

function arrayToJson(data, header) {
    // Method for converting a two-dimensional array to an array of objects
    // for building data for writing to xlsx and csv
    let rows = data.map((datum) => {
        let keyvalueSet = {};
        datum.forEach((cell, index) => {
            keyvalueSet[header[index]] = cell;
        })
        return keyvalueSet;
    })
    return rows;
}