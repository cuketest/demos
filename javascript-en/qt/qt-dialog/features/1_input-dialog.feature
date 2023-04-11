Feature: Cross-platform Qt application automation - input dialog
The input dialog is implemented by Qt's QInputDialog control class, which presents the same structure on various operating systems or CPU architectures (but the styles are different), so cross-platform automation can be easily realized.

  Scenario: Operand Value Dialog Box
    When Open the value dialog
    When Modify the value of the value box to 100

  Scenario: Action drop-down dialog
    When Open drop down dialog
    When Modify the value of the drop-down box to "Fall"

  Scenario: Manipulate text dialogs
    When Open text dialog
    When Modify the content of the text box as follows
      """
      Here is some test text
      """