Feature: Qt ListView automation
Use cross-platform Qt technology to automate the ListView control in Qt, which can be executed on various platforms (such as Windows, Linux).
The app used for automation is the FetchMore app

  Scenario: Select list option for destination location
    When Search for "./resources/api" in the CukeTest installation path
    Then Click on option 13

  Scenario: select list option
    When Search for "./" in the CukeTest installation path
    Then Click on the option "version"

  Scenario: Action list options object
    When The action object is the 11th option in the list
    Then Jump to target option position
    Then Click on the target option