@math
Feature: Web Selenium Test
open shopping cart page manage the web element.

  Scenario: shopping cart
    Given open the browser
    When I click Add to Cart btn
    Then Add to Cart button should be Sold Out
    And the total should be "$4.99"
