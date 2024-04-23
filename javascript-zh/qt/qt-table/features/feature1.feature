# language: zh-CN
功能: Qt Table自动化
使用跨平台Qt技术实现Qt TableView/TableWidget控件的自动化，可在各个平台（如Windows、Linux）上执行。通过这个项目，我们可以学到如何将本地xlsx数据导入到Qt应用表格中，Qt应用表格中的数据如何导出到本地xlsx文件和csv文件中，还有Qt应用表格单元格的操作，包括获取单元格数据、修改单元格数据和滚动到单元格视图。

  场景: 从xlsx文件中导入数据
    当读取"origin.xlsx"文件中的数据
    那么将数据写入到应用表格中

  场景: 从应用中导出数据到其它应用中
    当读取表格中全部数据
    那么将数据写入到xlsx文件"data.xlsx"中
    那么将数据写入到CSV文件"data.csv"中

  场景: 单元格操作
    假如目标单元格在第90行第0列
    当修改数据为"New Value!"并验证
    那么滚动到目标单元格