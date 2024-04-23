Feature: Cross-Platform Automated Notepad Application
Using Qt Notepad as an example, explain the considerations for Qt automation testing when dealing with cross-platform scenarios.

Scenario: Edit Content and Save
    Given Open the Qt Notepad application
    When Enter text in the notepad
      """
      Hello World!
      """
    And Click on Save
    And Save in the file dialog as "helloworld.txt" in the project path
    Then The file should be saved successfully

Scenario: Change Notepad Font
    When Open the font settings interface
    And Select "Serif" from the Font dropdown
    And Select "Italic" from the Style dropdown
    And Select "36" from the Size dropdown
    And Complete the font settings
    Then The font should be set successfully
