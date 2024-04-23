Feature: Qt ListView automation
Use cross-platform Qt technology to automate the ListView control in Qt, which can be executed on various platforms (such as Windows, Linux).
The app used for automation is the FetchMore app

  Scenario: Select list option for destination location
    When Search for "./" in the CukeTest installation path
    Then Click on option 13

  Scenario: select list option
    When Search for "./plugins" in the CukeTest installation path
    Then Click on the option "platforms"

  Scenario: Action list options object
    When The operation is performed on the item with the index 3 in the list
    Then Jump to target option position
    Then Click on the target option