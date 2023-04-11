# language: en
Feature: QtList Automation
Operation and automated testing of the list window developed for Qt's ListView component.

  Scenario: Action Target Options
    When Click the target item"."
    When Select target item".."

  Scenario: scroll list
    When Use the list method to scroll

  Scenario: Select target after search
    When Enter the path in the search box"C:/Windows"
    Then Determine if the target item exists in the search results"notepad.exe"