Feature: Web Automation Testing
Web samples, simulating common web scenarios

  Scenario: Shopping cart checkout
    Given open the browser and navigate to "https://cuketest.github.io/apps/shopping-cart/"
    When Click the Add to Cart button
    Then Add to Cart button should be "Sold Out"
    And the total should be "Total: $4.99"

  Scenario: Add multiple products and verify prices
    Given open the browser and navigate to "https://cuketest.github.io/apps/shopping-cart/"
    When Add 1 "40oz Bottle" to cart
    When Add 3 "6 Pack" to cart
    When Add 2 "30 Pack" to cart
    Then Verify that the cart total price is as expected