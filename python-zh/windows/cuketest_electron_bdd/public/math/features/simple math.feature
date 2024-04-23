# language: zh-CN
@math
功能: 数学计算
加法测试，Cucumber样例

  场景: 简单数学计算
    假如初始值设为1
    当现在再加1
    那么结果为2

  @complex @math
  场景大纲: 混合场景
    假如初始值设为<var>
    当现在再加<increment>
    那么结果为<result>
    例子: 
      | var | increment | result |
      | 100 | 5         | 105    |
      | 101 | 5         | 106    |
      | 200 | 6         | 205    |
    例子: 
      #data_source: ../math_data.csv