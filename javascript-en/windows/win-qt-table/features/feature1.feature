Feature: QtTable Automation
Take the spreadsheet application as the object to complete the automatic operation of Qt

  Scenario: Retrieve table content in app
    When Output cell data with 0 rows and 0 columns
    When Read the row 1 of data in the spreadsheet
    Then Output all cell data

  Scenario: Import data from a file
    When Read the data in the"spreadsheet_data.xlsx"file
    Then Write to the spreadsheet

  Scenario: Export data from table to database
    When Read the row 1 of data in the spreadsheet
    Then Write data to MySQL database
    Then Data was successfully written to the database