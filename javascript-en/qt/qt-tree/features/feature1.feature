# language: en
Feature: QtTree automation
Use cross-platform Qt technology to automate the TreeView control in Qt, which can be executed on various platforms (such as Windows, Linux).

  Scenario: Expand the tree node according to itemPath
    When The itemPath of the target tree node is "[0, 0]", get the object of the tree node
    Then Expand the target tree node to the visible range
    Then Select the target tree node and verify
    Then Application screenshot

  Scenario: Expand and select the target tree node according to the file path
    When Expand to the tree node where the "./step_definitions/definitions1.js" file is located
    Then Select the target tree node and verify
    Then Application screenshot