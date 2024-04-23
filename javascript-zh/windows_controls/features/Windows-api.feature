# language: zh-CN
功能: auto CukeTest windows api
测试Windows的自动化API
使用simaplestyle app做为被测应用

  @smoke @basic
  场景: Windows应用窗口相关操作
    当激活应用窗口
    当最小化应用窗口
    当恢复应用窗口
    当最大化应用窗口
    那么应用窗口截屏

  @smoke @basic
  场景: Button对象控件常规操作
    当判断是否存在
    当点击Default按钮
    当双击Normal按钮
    当获取button的name属性值应该为"Default"
    当获取button控件所有属性
    那么button截图

  @smoke @basic @todo
  场景: checkbox控件对象常规操作
    * 勾选Normal复选框
    当判断checked控件已经被选中
    当取消选中checked控件
    当获取checked控件所有属性
    当获取checked控件特有属性
      # 获取Text 属性的时候会报Error 的错误。
    那么checkbox截图

  @smoke @basic @todo
  场景: Edit对象控件常规操作
    当清空文本内容
    当输入文本内容"你好，中国！"
    当使用presskey输入特殊键
    当获取edittext控件所有属性
    当获取edittext控件特有属性
      # 运行时text()方法未实现
      # readOnly属性未实现方法
    那么editText控件截图

  @advanced
  场景: RadioButton常规操作
    当选中RadioButton
    当获取RadioButton控件所有属性
    当获取RadioButton控件特有属性
    那么RadioButton控件截图

  @advanced @todo
  场景: Combox控件对象常规操作
    当下拉combox控件
    当第一个item值应该为"First Normal Item"
    当选择"Third Normal Item"选项
    当combox可编辑控件pressKey值
    当获取Combox控件所有属性
    当获取Combox控件特有属性
    那么Combox控件截图

  @advanced @todo
  场景: Listbox常规操作
    当滚动ListBox视图
    当选中第3个选项
    当使用scrollTo方法获取子元素属性
    当获取ListBox控件所有属性
    当获取ListBox控件特有属性
      # selectedItem()属性当没有被选中的item时会报错
    那么ListBox控件截图

  @advanced
  场景: Slider控件常规操作
    当拖拽Slider1
    当将Slider_Vertical设置为8
    当获取Slider控件所有属性
    当获取Slider控件特有属性
    那么Slider 控件截图

  @advanced @tree
  场景: Tree相关API操作
    当直接获取TreeItem
    当展开多级节点
    当执行Tree控件操作
    当获取Tree控件所有属性
    当获取Tree控件特有属性
    当折叠多级节点
    那么Tree控件截屏

    # check status相关方法提供了但是不能调用
    #那么get和setItemCheckedStatus方法验证
  @advanced @todo @tree
  场景: TreeItem相关操作
    当展开TreeItem控件
    当选中一个TreeItem控件
    当获取并返回TreeItem的节点路径
    # 当折叠TreeItem控件
    # checkState提供了但无法调用
    # toggleCheck并且参数缺省调用并不会报错
    当获取TreeItem控件所有属性
    当获取TreeItem控件特有属性
    那么TreeItem控件截屏

  @advanced
  场景: contextmenu相关操作
    假如展开子元素相关属性
    当获取menu控件所有属性
    当获取menu控件特有属性
    当获取menuitem控件所有属性
    当获取menuitem控件特有属性
    当menuitem操作方法
    当manymenu item操作
    那么menu控件截图

  @advanced
  场景: ProgressBar控件操作
    当获取ProgressBar控件所有属性
    当获取ProgressBar控件特有属性
    那么ProgressBar截图

  @advanced
  场景: Tab控件操作
    假如Tab控件操作
    当获取Tab控件所有属性
    当获取Tab控件特有属性
    那么Tab控件截屏

  @advanced
  场景: Group控件操作
    假如Group控件操作方法
    当获取Group控件所有属性
    当获取Group控件特有属性
    那么Group控件截图

  @advanced
  场景: datagrid控件操作
    * 翻至第2页
    # Table控件的特有方法调用都会出现以下提示
    # 即使是属性方法（不需要传参）
    # Error: A string was expected
    假如datagrid控件操作方法
    当获取datagrid控件所有属性
    当获取datagrid控件特有属性
    那么datagrid控件截屏

  @advanced @table
  场景大纲: DataGrid单元格索引
    当获取DataGrid中<row>行<col>列的单元格值为"<value>"
    并且先获取DataGrid的第<row>行，再获取该行的第<col>列的单元格的值，并为"<value>"
    例子: 
      | row | col | value        |
      | 0   | 0   | Bishop       |
      | 0   | 1   | DanBeryl     |
      | 1   | 1   | VioletPhoebe |

  @advanced
  场景: StatusBar控件操作
    假如StatusBar控件操作方法
    当获取StatusBar控件所有属性
    当获取StatusBar控件特有属性
    那么StatusBar控件截图
  @features
  场景: 描述模式及正则匹配模式
    假如使用描述模式匹配控件
    当使用getGeneric代替对象容器方法
    那么使用findControls遍历应用内控件
  @features
  场景大纲: 验证getGeneric获取效果
    假如使用"<type>"的方式调用getGeneric
    那么传入文本"<type>"并验证
    例子: 
      | number | type               | str |
      | 1      | origin method      |     |
      | 2      | only leaf criteria |     |
      | 3      | full tree criteria |     |
      | 4      | part of criteria   |     |
  @features
  场景大纲: 使用正则表达式匹配控件
    假如匹配节点"<node>"，启用"<field>"字段的正则匹配，参数为"<param>"
    当验证匹配到控件应该"<state>"
    那么验证应该匹配到<counts>个控件
    例子: 
      | node | field     | param | state | counts |
      | Edit | className | Box   | 存在    | 6      |
      | Edit | className | Box$  | 存在    | 6      |
      | Edit | className | Text  | 存在    | 5      |
      | Edit | className | ^Text | 存在    | 5      |
      | Edit | className | Pass  | 存在    | 1      |
      | Edit | className | ^Pass | 存在    | 1      |