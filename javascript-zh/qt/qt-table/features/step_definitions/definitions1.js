const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const xlsx = require('leanpro.xlsx');
const { CukeTest } = require('cuketest');
const path = require('path');

// 加载Qt应用程序的UI模型文件
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
BeforeAll(async function () {

    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize();

    // 根据执行环境确定样例目录路径。
    let sampleDir = path.dirname(process.execPath);
    
    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    child = await QtAuto.launchQtProcessAsync([  
        // Linux
        `${sampleDir}/bin/dockwidgets`,
        // Windows
        `${sampleDir}\\bin\\dockwidgets.exe`,
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/dockwidgets', 
    ]); 

    // 等待被测应用的进程出现，最长等待时间为10秒。
    await model.getApplication("dockwidgets").exists(10);
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {

    // 截取Dock_Widgets窗口的屏幕截图
    let screenshot = await model.getWindow("Dock_Widgets").takeScreenshot();
    
    // 将截图附加到测试报告中
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {

    // 恢复CukeTest窗口大小，准备下一轮测试或结束测试工作。
    CukeTest.restore();
    CukeTest.maximize();

    // 关闭启动的测试应用进程。
    Util.stopProcess(child);
})

//// 你的步骤定义 /////

// {int} 占位符接收一个整数类型参数，整数值分别传递给变量row和col
Given("目标单元格在第{int}行第{int}列", async function (row, col) {

    // 获取表格中单元格对象并拿到它的值
    let targetCell = model.getTable("Table").getItem(row, col);
    let value = await targetCell.value();

    // 将值添加到报告中，方便查看
    this.attach(value);

    // 将单元格赋添加到上下文中，方便在其他步骤中调用
    this.cell = targetCell;
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量value
When("修改数据为{string}并验证", async function (value) {
    // 获取上面步骤传递的cell值
    let targetCell = this.cell;

    // 将目标控件值添加到测试报告中方便查看
    this.attach(await targetCell.value());
    await targetCell.set(value);

    // 检查value属性是否符合预期的值，不符合时将显示指定的消息。
    await targetCell.checkProperty('value', value, `修改后的值不为${value}`);
});

Then("滚动到目标单元格", async function () {
    let targetCell = this.cell;
    await targetCell.scrollIntoView();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量xlsxName
When("读取{string}文件中的数据", async function (xlsxName) {

    // 读取文件的内容
    let workbook = xlsx.readFile("./features/support/" + xlsxName);

    // 将工作表中的数据转换为 JSON 格式
    let worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    this.attach(JSON.stringify(worksheetData, null, '  '));
    this.xlsxData = worksheetData;
});

Then("将数据写入到应用表格中", async function () {
    
    // 获取从文件读取的数据和表格的列标题
    let data = this.xlsxData;
    let headers = await model.getTable("Table").columnHeaders();

    // 遍历数据行和表格列标题以设置单元格的值
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

    // 将获取到的表格数据、表头（每列）和表头（每行）添加到报告中，方便查看
    this.attach(JSON.stringify(data,null,'  '));
    this.attach(JSON.stringify(header, null, '  '));
    this.attach(JSON.stringify(rowHeaders, null, '  '));

    // 将data，header和rowHeaders保存到上下文，方便后续步骤调用
    this.data = data;
    this.header = header;
    this.rowHeaders = rowHeaders;
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量xlsxName
Then("将数据写入到xlsx文件{string}中", async function (xlsxName) {

    // 获取上面步骤传递的header和data值
    let header = this.header;
    let data = this.data;
    let xlsxData = arrayToJson(data, header);
    let filename = "./features/support/" + xlsxName;
    let workbook = xlsx.readFile("./features/support/origin.xlsx");

    // 将 JSON 数据转换为工作表
    let sheet = xlsx.utils.json_to_sheet(xlsxData, { header: header });
    workbook.Sheets[workbook.SheetNames[0]] = sheet;

    // 将工作表写入到xlsx文件中
    xlsx.writeFile(workbook, filename);
});

Then("将数据写入到MySQL数据库中", async function () {
    return 'pending';
});

Then("将数据写入到CSV文件{string}中", async function (csvName) {

    // 获取上面步骤传递的header和data值
    let header = this.header;
    let data = this.data;
    let csvData = arrayToJson(data, header);

    // 将csvData值添加到测试报告中方便查看
    this.attach(JSON.stringify(csvData, null, '  '));
    let filePath = "./features/support/" + csvName;

    // 将数据写入到csv文件中
    Util.saveToCsvFile(csvData, filePath);
});

/**
 * 将二维数组转换为对象数组的方法。
 * 该方法用于构建写入 XLSX 和 CSV 的数据。
 * 
 * @param {Array} data - 包含原始数据的二维数组。
 * @param {Array} header - 包含列标题的数组。
 * @returns {Array} - 返回由对象组成的数组，每个对象代表一行数据，键为列标题，值为对应的数据。
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