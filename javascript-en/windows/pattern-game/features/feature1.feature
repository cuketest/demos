# language: en
Feature: Play games automatically
Image automation development through the Happy Elimination sample application that comes with qt. Qt 4 needs to be installed in the environment. The reference path of the sample application is:
    "{QT4_PATH}\demos\declarative\samegame\release\samegame.exe"

  Scenario: Complete a game
    When Start the qml application
    Then Start a new game
    When Eliminate "red" color
    When Eliminate "blue" color
    When Eliminate "green" color
    When Eliminate "red" color
    When Eliminate "blue" color
    When Eliminate "green" color
    When Eliminate "red" color
    When Eliminate "blue" color
    When Eliminate "green" color
    Then Verify that there are no more color blocks that can be eliminated
    Then Validation should see a victory prompt
    Then Close the app