const { Keyboard } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { Given, When, Then, AfterAll, BeforeAll, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require('path');
const db = require('../support/db');
const assert = require('assert');

setDefaultTimeout(60 * 1000);
const model = WinAuto.loadModel(__dirname + "\\model1.tmodel");
let child;

BeforeAll(async function () {
    child = Util.launchSample('spreadsheet.exe');
    if (await model.getWindow("Window").exists(5)) {
        await model.getWindow("Window").restore();
        Keyboard.disableIme(); // Disable input method
    }
    else {
        throw new Error("Testing application was not launched.")
    }
    CukeTest.minimize();
})

After(async function () {
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png')
})

AfterAll(async function () {
    await Util.stopProcess(child); 
    // CukeTest.restore();
})

//// your step definition /////
Given("Output all cell data", async function () {
    let tableModel = model.getTable("Table");
    let rowCount = await tableModel.rowCount();
    for(let i = 0; i < rowCount; i++){
        let rowData = await tableModel.rowData(i);
        this.attach(JSON.stringify(rowData));  // The output data is displayed in the report, please use "Run Project" to generate the report
    }
});

Given("Output cell data with {int} rows and {int} columns", async function (row, column) {
    let tableModel = model.getTable("Table");
    let cell = await tableModel.cellValue(row, column);
    this.attach(cell);
});

When("Read the data in the{string}file", async function (fileName) {
    // Generate code directly by dragging and dropping from the toolbox
    let workbook = xlsx.readFile(path.join(__dirname, '..', 'support', 'data', fileName));
    // console.log("The table data is", workbook);
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    // console.log("The workbook data is", worksheetData);
    this.attach(JSON.stringify(worksheetData, null, '\t'));
    this.xlsxData = worksheetData; // Save to the world object of the scene to pass data
});

Then("Write to the spreadsheet", async function () {
    let data = this.xlsxData;
    let tableModel = model.getTable("Table");
    let headers = await tableModel.columnHeaders();
    for (let row = 1; row < data.length; row++) { // Row 0 is not data, so skip it
        let rowData = data[row];
        for(let header in rowData){
            let cellData = rowData[header];
            let cell = await tableModel.select(row, header);
            await cell.click();
            await cell.set(cellData);
            await cell.pressKeys('~');
            await Util.delay(300);
            let actual = await cell.value();
            // let actual = await tableModel.cellValue(row,header);
            assert.equal(actual, cellData);
            console.log(`Successfully wrote ${cellData} at row ${row}, column ${header}`);
        }
    }
});

When("Read the row {int} of data in the spreadsheet", async function (targetRow) {
    let tableModel = model.getTable("Table");
    let rowdata = await tableModel.rowData(targetRow);
    this.cells = rowdata;
});

Then("Write data to MySQL database", async function () {
    this.attach("If you need to test the function of exporting data to MySQL database, please remove the script comment in this step");

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

Then("Data was successfully written to the database", async function () {
    this.attach("If you need to test the function of exporting data to MySQL database, please remove the script comment in this step");
    // let res = await db.query(`SELECT * FROM qt . spreadsheet;`);
    // let arr = Object.values(res[0]);
    // assert.deepEqual(arr,this.cells,'The first data does not match');
});