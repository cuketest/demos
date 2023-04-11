Feature: Traverse native Windows application tree nodes
Traversing tree nodes with Windows Explorer as the application under test

  Scenario: traverse the resource manager
    When Open Explorer
    When Traverse the expanded tree "tree view"
    Then Attach the results