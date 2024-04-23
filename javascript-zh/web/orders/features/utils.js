const path = require('path');
const xlsx = require('leanpro.xlsx');
const { Util } = require('leanpro.common');

/**
 * 获取页面中的订单表格中的数据。如果存在多页会自动翻页获取。
 * @param {Page} 当前页面的对象
 * @return 对象数组
 */
async function getOrders(page){
    let header = await getHeader(page)
    let pageNum = await page.evaluate(`
        (function () {
            let page = document.querySelectorAll(".ant-pagination-item");
            return page[page.length-1].innerText;
        })()
    `);
    pageNum = parseInt(pageNum)
    let body = []
    for (let i = 0; i < pageNum; i++) {
        body = await page.evaluate(`
            (function (){
                let mytable = document.getElementById('orderTable')
                let tbody =  mytable.querySelector('tbody');
                let tbodyData = [];
                for(let i=0, rows=tbody.rows.length; i<rows; i++){
                    for(let j=0, cells=tbody.rows[i].cells.length; j<cells; j++){
                        if(!tbodyData[i]){
                            tbodyData[i] = new Array();
                        }
                        tbodyData[i][j] = tbody.rows[i].cells[j].innerText;
                    }
                }
                return tbodyData;
            })()
        `);
        if (pageNum > 1) {
            await page.click(".ant-pagination-next");
        }
    }
    return arrayToJson(body, header)
}
/**
 * 获取页面中订单表格的表头数据。
 * @param {Page} 当前页面的对象
 * @return 数组
 */
async function getHeader(page){
    return page.evaluate(`
        (function () {
            let mytable = document.getElementById('orderTable')
            let thead = mytable.querySelector('thead');
            let theadData = [];
            for (let i=0; i<thead.rows.length; i++){
                for(let j=0,cells=thead.rows[i].cells.length;j<cells; j++){
                    if(!theadData[i]){
                        theadData[i] = new Array();
                    }
                    theadData[i][j] = thead.rows[i].cells[j].innerText;
                }
            }
            return theadData[0];
        })()
    `);
}
/**
 * 将从excel中获取的日期格式转换成YY-MM-DD的日期格式。
 * @param {num} 日期数据
 * @return 字符串
 */
function formatExcelTime(num, format = '-') {
    num = Number(num); // 强制类型转化，以防传来的值是字符串
    let millisecond = 0; // 转化后的毫秒数
    if (num > 60) {
        millisecond = (num - 25569) * 60 * 60 * 24 * 1000;
    } else {
        millisecond = (num - 25568) * 60 * 60 * 24 * 1000;
    }
    let date = new Date(millisecond); // 根据转化后的毫秒数获取对应的时间
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return yy + format + mm + format + dd; // 返回格式化后的日期
}

/**
 * 用于将二维数组转换成对象数组的方法。
 * @param {data} 表身数据
 * @param {header} 表头数据
 * @return 对象数组
 */
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

/**
 * 用于读取excel的方法。
 * @param {file} 文件路径
 * @return 对象数组
 */
function readXlsx(file) {
    let filename = path.join(__dirname, file);
    let workbook = xlsx.readFileSync(filename);
    const xlsxData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    return xlsxData;
}
/**
 * 用于获取最新的通知
 */
async function getLatestMessage(page) {
    await Util.delay(100)
    const messageboxes = await page.$$(`.ant-message-notice`)
    const msgs = await Promise.all(messageboxes.map(ele => ele.innerText()))
    return msgs.pop()
}
exports.readXlsx = readXlsx;
exports.getOrders = getOrders;
exports.getHeader = getHeader;
exports.formatExcelTime = formatExcelTime;
exports.arrayToJson = arrayToJson;
exports.getLatestMessage = getLatestMessage;