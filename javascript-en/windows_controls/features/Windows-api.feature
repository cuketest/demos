Feature: Auto CukeTest Windows API
Test Windows Automation API.
using Simaplestyle app.

  @smoke @basic
  Scenario: Window Control Operation
    When Activate app window
    When Minimize app window
    When Restore app window
    When Maximize app window
    Then Take Screenshot of app window

  @smoke @basic
  Scenario: Button control's operation and attribute method
    When Determines whether button control existed
    When Click Default button
    When Double click Normal button
    When Button control's name attribute should be "Default"
    When Get button control's common attribute
    Then Take Screenshot of button control

  @smoke @basic @todo
  Scenario: checkbox control's operation and attribute method
    * Check Normal checkbox
    When Determines whether checkbox control has been checked
    When Uncheck Normal checkbox
    When Get checked control's common attribute
    When Get checked control's unique attribute
    Then Take Screenshot of checkbox control

  @smoke @basic @todo
  Scenario: Edit control's operation and attribute method
    When Clear all text area
    When Input text "Hello World!"
    When Enter control-key by pressKeys method
    When Get edittext control's common attribute
    When Get edittext control's unique attribute
    Then Take Screenshot of editText control

  @advanced
  Scenario: RadioButton control's operation and attribute method
    When Check RadioButton control
    When Get RadioButton control's common attribute
    When Get RadioButton control's unique attribute
    Then Take Screenshot of RadioButton control

  @advanced @todo
  Scenario: Combox control's operation and attribute method
    When Dropdown combobox control
    When The first item should be "First Normal Item"
    When Select "Third Normal Item" item
    When Presskey on editable-combobox control
    When Get Combox control's common attribute
    When Get Combox control's unique attribute
    Then Take Screenshot of Combox control

  @advanced
  Scenario: Slider control's operation and attribute method
    When Drag&drop Slider1 control
    When Set Slider_Vertical control value to 8
    When Get Slider control's common attribute
    When Get Slider control's unique attribute
    Then Slider Take Screenshot of  control

  @advanced @todo
  Scenario: Listbox control's operation and attribute method
    When Scroll ListBox control's view
    When Check the 3th. item
    When Get child element attribute by using scrollTo method
    When Get ListBox control's common attribute
    When Get ListBox control's unique attribute
    Then Take Screenshot of ListBox control

  @advanced @tree
  Scenario: Tree control's operation and attribute method
    When Get TreeItem control directly
    When Expand multi-level Tree node
    When Operate Tree control method
    When Get Tree control's common attribute
    When Get Tree control's unique attribute
    When Collapse multi-level Tree node
    Then Take Screenshot of Tree control

  @advanced @todo @tree
  Scenario: TreeItem control's operation and attribute method
    When Expand TreeItem control
    When Select a TreeItem control
    When Get a TreeItem control's treepath attribute
    When Get TreeItem control's common attribute
    When Get TreeItem control's unique attribute
    Then Take Screenshot of TreeItem control

  @advanced
  Scenario: contextmenu control's operation and attribute method
    When Expand child control's associated method
    When Get menu control's common attribute
    When Get menu control's unique attribute
    When Get menuitem control's common attribute
    When Get menuitem control's unique attribute
    When MenuItem's operation methods
    When Many MenuItems' operation methods
    Then Take Screenshot of menu control

  @advanced
  Scenario: ProgressBar control's operation and attribute method
    When Get ProgressBar control's common attribute
    When Get ProgressBar control's unique attribute
    Then Take Screenshot of ProgressBar control

  @advanced
  Scenario: Tab control's operation and attribute method
    When Tab's operation methods
    When Get Tab control's common attribute
    When Get Tab control's unique attribute
    Then Take Screenshot of Tab control

  @advanced
  Scenario: Grou control's operation and attribute method
    When Group's operation methods
    When Get Group control's common attribute
    When Get Group control's unique attribute
    Then Take Screenshot of Group control

  @advanced
  Scenario: datagrid control's operation and attribute method
    When Turn to page 2
    When datagrid's operation methods
    When Get datagrid control's common attribute
    When Get datagrid control's unique attribute
    Then Take Screenshot of datagrid control

  @advanced
  Scenario Outline: Get cell on DataGrid control
    When Determines <row> row <col> column cell value is "<value>" on DataGrid
    When Get the <row> row, then get its <col> column cell value is "<value>"
    Examples: 
      | row | col | value        |
      | 0   | 0   | Bishop       |
      | 0   | 1   | DanBeryl     |
      | 1   | 1   | VioletPhoebe |

  @advanced
  Scenario: StatusBar control's operation and attribute method
    When StatusBar's operation methods
    When Get StatusBar control's common attribute
    When Get StatusBar control's unique attribute
    Then Take Screenshot of StatusBar control

  @features
  Scenario: Description mode and regular matching mode
    When Match controls using the description pattern
    When Use getGeneric instead of object container method
    Then Traverse in-app controls with findControls

  @features
  Scenario Outline: Verify that getGeneric gets the effect
    When Use "<type>" to call getGeneric
    Then Pass in the text "<type>" and validate
    Examples: 
      | number | type               | str |
      | 1      | origin method      |     |
      | 2      | only leaf criteria |     |
      | 3      | full tree criteria |     |
      | 4      | part of criteria   |     |

  @features
  Scenario Outline: Use regular expressions to match controls
    When Match node "<node>", enable regular matching of "<field>" field, parameter is "<param>"
    When Validation matches to the control should be "<state>"
    Then Validation should match <counts> controls
    Examples: 
      | node | field     | param | state | counts |
      | Edit | className | Box   | exist | 6      |
      | Edit | className | Box$  | exist | 6      |
      | Edit | className | Text  | exist | 5      |
      | Edit | className | ^Text | exist | 5      |
      | Edit | className | Pass  | exist | 1      |
      | Edit | className | ^Pass | exist | 1      |