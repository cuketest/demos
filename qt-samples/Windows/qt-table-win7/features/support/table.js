const WIDTH = 7; // 表的宽度
// 坐标转换函数
function locate(row, column) {
    row = parseInt(row, 10);
    column = parseInt(column, 10);
    let index = (row + 1) * (WIDTH) + column + 2; // 根据行列值转换成索引值
    return index;
}

async function getAllCells(tableModel) {
    return tableModel.getControls({ type: "Custom" });
}
// 使用行列坐标索引目标单元格
function getTargetCell(tableModel, row, column) {
    let cellIndex = locate(row, column);
    return tableModel.getCustom({ index: cellIndex });
}
function getTargetRow(tableModel, row) {
    let rowData = [...Array(WIDTH).keys()].map((index) => {
        return getTargetCell(tableModel, row, index);
    })
    return rowData;
}
// 修改单元格的值
async function sendToCell(cell, value) {
    await cell.dblClick();
    await cell.pressKeys(value + '~');
    return await cell.name();
}

exports.sendToCell = sendToCell;
exports.locate = locate;
exports.getTargetCell = getTargetCell;
exports.getTargetRow = getTargetRow;
exports.getAllCells = getAllCells;
exports.WIDTH = WIDTH;