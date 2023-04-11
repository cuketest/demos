Feature: QtTree automation
Automating the TreeView control in Qt

  Scenario: Manipulate tree node objects (requires recognition model)
    When Click on the tree node in the model"Windows  (C:)"
    When Expand and collapse tree nodes in a model"Windows  (C:)"

  Scenario: Manipulate tree objects (no need to recognize models)
    When Click on '["Windows  (C:)", "Windows", "System32"]' in the tree
    When Collapse and expand '["Windows  (C:)", "Windows", "System32"]' in tree

  Scenario: access target path
    When Access and select the ".\step_definitions\definitions1.js" file
    Then "definitions1.js" node selected