Feature: shopping page
url:https://cuketest.github.io/apps/shopping/index.html

  Background: Open the Index Page
    Given open the url "https://cuketest.github.io/apps/shopping/index.html"

  Scenario: Pay Parking Fee
    When I click "Pagar estacionamento"
    Then I should get the "Pagar Estacionamento" page
    And I click the Número do Ticket
    Then I input keyword "012311241234567" of Número do Ticket
    And I click Cartão de crédito
    Then I input keyword "1234567812345678" of Cartão de crédito
    And I click Vencimento
    Then I input keyword "12" of Vencimento
    And I click Código
    Then I input keyword "20" of Código
    Then I click the button of Pagar

  Scenario: open new Lojas & Restaurantes
    Given I click "Lojas & Restaurantes"
    Then I click MODA list
    Then I click "Adidas"
    Then I should get the page "Adidas"
    And I click Back button
    Then I should get the "Lojas" page
    Then I click Restaurante list
    Then I click "Bacio Di Latte"
    Then I should get the page "Bacio Di Latte"
#  Scenario: swith the window
#    Given I click "Código Fonte"
#    When I should get the new tab window ""