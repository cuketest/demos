Feature: Automated notepad apps
Take Windows 10 Notepad as an example to explain how to solve the menu drop-down problem when automatically testing Windows desktop applications.
For example: Notepad's [Format]--[Font], [File]--[Save]

  Scenario: Edit the content and save
    When Open the Windows Notepad app
    When Enter the text "hello world" in Notepad
    And Click [File]--[Save]
    And Save as "helloworld.txt" in the project path in the file dialog box
    Then The file should be saved successfully

  Scenario: Change the Notepad font
    When Click [Format]--[Font]
    And Select "Arial" from the [Font] drop-down box
    And Select "Bold" from the [Font Style] drop-down box
    And Select "20" from the [Size] drop-down box
    And Click the [OK] button to close the [Font...] dialog box
    Then The font should be set successfully