@math
Feature: Simple maths
Cucumber sample:
  In order to do maths
  As a developer
  I want to increment variables

  Scenario: easy maths
    Given a variable set to 1
    When I increment the variable by 1
    Then the variable should contain 2

  @complex @math
  Scenario Outline: more complex stuff
    Given a variable set to <var>
    When I increment the variable by <increment>
    Then the variable should contain <result>
    Examples: 
      | var | increment | result |
      | 100 | 5         | 105    |
      | 101 | 5         | 106    |
      | 200 | 6         | 205    |
    Examples: 
      #data_source: ../math_data.csv