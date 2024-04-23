# language: zh-CN
功能: Qt Table自动化
使用跨平台Qt技术实现Qt TableView/TableWidget控件的自动化，可在各个平台（如Windows、Linux）上执行。

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