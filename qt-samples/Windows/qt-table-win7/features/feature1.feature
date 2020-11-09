# language: zh-CN
功能: QtTable自动化
以spreadsheet应用为对象，完成对Qt的自动化操作

  场景: 检索应用中的表格内容
    假如输出所有单元格数据
    同时输出0行0列的数据

  场景: 从文件中导入数据
    当读取"spreadsheet_data.xlsx"文件中的数据
    那么写入到spreadsheet中

  场景: 从表格中导出数据到数据库
    当读取spreadsheet中的第0行数据
    那么将数据写入到MySQL数据库中
    那么数据被成功写入数据库