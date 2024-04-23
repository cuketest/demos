# language: zh-CN
功能: 远程自动化表单校验应用
在远程设备中，验证应用中的两个功能
1. 全球化：根据选择国家显示不同数字字符
2. 输入值校验：只允许输入-1000000 ~ 1000000范围内的值

  场景大纲: 全球化测试（不同国家的数字差异）
    当选择国家<locale>
    同时输入数字<input>
    那么实际结果为<expected>
    例子: 
      | locale             | input | expected |
      | Chinese/China      | 1000  | 1000     |
      | Arabic/South Sudan | 1000  | ١٠٠٠     |
      | English/Canada     | 1000  | 1000     |

  场景大纲: 最小输入限制测试（未超限）
    当输入最小值<minimum>
    那么最小结果应该为<expected>
    例子: 
      | minimum  | expected |
      | -1       | -1       |
      | -2       | -2       |
      | -10      | -10      |
      | -20      | -20      |
      | -999999  | -999999  |
      | -1000000 | -1000000 |

  场景大纲: 最大输入限制测试（未超限）
    当输入最大值<maximum>
    那么最大结果应该为<expected>
    例子: 
      | maximum | expected |
      | 1       | 1        |
      | 2       | 2        |
      | 10      | 10       |
      | 20      | 20       |
      | 999999  | 999999   |
      | 1000000 | 1000000  |

  场景大纲: 最小输入限制测试（超限）
    当输入最小值<minimum>
    那么最小结果应该为<expected>
    例子: 
      | minimum  | expected |
      | -1000001 | -1000000 |
      | -1000011 | -1000000 |
      | -9999999 | -1000000 |

  场景大纲: 最大输入限制测试（超限）
    当输入最大值<maximum>
    那么最大结果应该为<expected>
    例子: 
      | maximum | expected |
      | 1000001 | 1000000  |
      | 1000011 | 1000000  |
      | 9999999 | 1000000  |