@math
Feature: Web Selenium Test
url:https://cuketest.github.io/apps/bootstrap-calculator/

  Background: calculator
    Given open url "https://cuketest.github.io/apps/bootstrap-calculator/"
    When I click 1 + 1
    Then I click the =
    And I should  get the result "2"
    And History panel should has "1 + 1 = 2" text

  Scenario: history
    When I click the "C"
    Then History panel should be null