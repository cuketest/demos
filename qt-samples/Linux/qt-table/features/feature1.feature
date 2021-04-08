# language: zh-CN
功能: Qt Table自动化
实现Qt TableView/TableWidget控件的自动化

  场景: 从xlsx文件中导入数据
    当读取"origin.xlsx"文件中的数据
    那么将数据写入到应用表格中

  场景大纲: 从示例表中导入数据
    假如将数据插入到第<row>行，数据为学号<id>，"<name>"学生，性别"<gender>"，成绩为<score>，父母为"<father>"与"<mother>"
    例子: 
      #data_source: support/testcase.csv

  场景: 从应用中导出数据到其它应用中
    当读取表格中全部数据
    那么将数据写入到xlsx文件"data.xlsx"中
    那么将数据写入到CSV文件"data.csv"中

  场景: 单元格操作
    假如目标单元格在第90行第0列
    当修改数据为"New Value!"并验证
    那么滚动到目标单元格