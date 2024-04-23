const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { CukeTest } = require('cuketest');
const path = require('path');
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// Timeout and Hook settings ///
//set step timeout to be 60 seconds
setDefaultTimeout(60 * 1000);  
let child;

// Prepare the test environment before executing all test scenarios, start the application under test, and wait for it to appear.
BeforeAll(async function () {

    // Minimize the CukeTest window to avoid interference with UI testing.
    CukeTest.minimize();

    // Determine the sample directory path based on the execution environment.
    let sampleDir = path.dirname(process.execPath)

    // Pass multiple startup paths according to different systems, and the available path will be automatically selected
    child = await QtAuto.launchQtProcessAsync([
        // Linux
        sampleDir + "/bin/dockwidgets",
        // Windows
        sampleDir + "\\bin\\dockwidgets.exe",
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/dockwidgets', 
    ]); 

    // Wait for the tested application process to appear, with a maximum waiting time of 10 seconds.
    await model.getApplication("dockwidgets").exists(10);
})

// Capture a screenshot of the current window after each test scenario and attach it to the test report.
After(async function () {

    // Capture a screenshot of the Dock_Widgets window
    let screenshot = await model.getWindow("Dock_Widgets").takeScreenshot();

    // Attach the screenshot to the test report
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

// After all test scenarios are executed, close the tested application.
AfterAll(async function () {

    // Restore the CukeTest window size for the next round of testing or end of testing work.
    CukeTest.restore();
    CukeTest.maximize();

    // Close the launched test application process.
    Util.stopProcess(child);
})

//// Step Definitions /////
// {int} placeholder receives an integer type parameter, with integer values passed to the row and col variables
Given("The target cell is at row {int}, column {int}", async function (row, col) {
    
    // Get the cell object in the table and obtain its value
    let targetCell = model.getTable("Table").getItem(row, col);
    let value = await targetCell.value()
    
    // Attach the value to the report for easy viewing
    this.attach(value);

    // Add the cell to the context for easy access in other steps
    this.cell = targetCell;
});

// {string} placeholder receives a string type parameter, with the string passed to the value variable
When("Modify the data to {string} and verify", async function (value) {
    
    // Get the cell value passed from the previous step
    let targetCell = this.cell;
    this.attach(await targetCell.value());

    // Attach the target control value to the test report for inspection
    await targetCell.set(value);

    // Check if the value attribute matches the expected value, displaying the specified message if it does not.
    await targetCell.checkProperty('value', value, `The modified value is not${value}`)
});

Then("Scroll to target cell", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});

// {string} placeholder receives a string type parameter, with the string passed to the xlsxName variable
When("Read the data in the {string} file", async function (xlsxName) {

    // Read the contents of the file
    let workbook = xlsx.readFile("./features/support/" + xlsxName);

    // Convert the data in the worksheet to JSON format
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    this.attach(JSON.stringify(worksheetData, null, '  '));
    this.xlsxData = worksheetData;
});

Then("Write data to application form", async function () {

    // Get the data read from the file and the column headers of the table
    let data = this.xlsxData;
    let headers = await model.getTable("Table").columnHeaders();

    // Iterate through the data rows and table column headers to set the cell values
    for (let row = 0; row < data.length; row++) {
        let rowDatum = data[row];
        for (let col = 0; col < headers.length; col++) {
            let value = rowDatum[headers[col]];
            await model.getTable("Table").setCellValue(row, col, value);
        }
    }
});

When("Read all data in the table", async function () {
    // Table data
    let data = await model.getTable("Table").data();
    // Header (each column)
    let header = await model.getTable("Table").columnHeaders();
    // Header (each row)
    let rowHeaders = await model.getTable("Table").rowHeaders();

    // Attach the obtained table data, header (each column), and header (each row) to the report for easy viewing
    this.attach(JSON.stringify(data,null,'  '));
    this.attach(JSON.stringify(header, null, '  '));
    this.attach(JSON.stringify(rowHeaders, null, '  '));
    this.data = data;
    this.header = header;
    this.rowHeaders = rowHeaders;
});

// {string} placeholder receives a string type parameter, with the string passed to the xlsxName variable
Then("Write data to xlsx file {string}", async function (xlsxName) {

    // Get the header and data values passed from the previous steps
    let header = this.header;
    let data = this.data;
    let xlsxData = arrayToJson(data, header);
    let filename = "./features/support/" + xlsxName;
    let workbook = xlsx.readFile("./features/support/origin.xlsx");
    
    // Convert JSON data to worksheet
    let sheet = xlsx.utils.json_to_sheet(xlsxData, { header: header });
    workbook.Sheets[workbook.SheetNames[0]] = sheet;
    
    // Write the worksheet to the xlsx file
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


/**
 * Method to convert a two-dimensional array to an array of objects.
 * This method is used to build data for writing to XLSX and CSV files.
 * 
 * @param {Array} data - Two-dimensional array containing raw data.
 * @param {Array} header - Array containing column headers.
 * @returns {Array} - Returns an array of objects, each object representing a data row, with keys as column headers and values as corresponding data.
 */
function arrayToJson(data, header) {
    let rows = data.map((datum) => {
        let keyvalueSet = {};
        datum.forEach((cell, index) => {
            keyvalueSet[header[index]] = cell;
        })
        return keyvalueSet;
    })
    return rows;
}