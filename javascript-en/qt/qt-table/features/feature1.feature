Feature: Qt Table Automation
Use cross-platform Qt technology to automate Qt TableView/TableWidget controls, which can be executed on various platforms (such as Windows, Linux).

  Scenario: Import data from xlsx file
    When Read the data in the "origin.xlsx" file
    Then Write data to application form

  Scenario: Export data from applications to other applications
    When Read all data in the table
    Then Write data to xlsx file "data.xlsx"
    Then Write data to CSV file "data.csv"

  Scenario: cell manipulation
    When The target cell is at row 90, column 0
    Then Modify the data to "New Value!" and verify
    Then Scroll to target cell