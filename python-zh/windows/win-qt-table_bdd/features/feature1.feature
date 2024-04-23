# language: zh-CN
功能: QtTable自动化
使用Windows自动化技术对基于Qt框架开发的应用中的spreadsheet应用进行操作和验证。通过这个项目，我们可以学到如何读取表格数据，读取本地文件写入到表格中。

  场景: 检索应用中的表格内容
    假如输出0行0列的单元格数据
    当读取spreadsheet中的第1行数据
    那么输出所有单元格数据

  场景: 从文件中导入数据
    当读取spreadsheet_data.xlsx文件中的数据
    那么写入到spreadsheet中