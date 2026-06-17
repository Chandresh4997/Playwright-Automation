@login
Feature: HimTrek login
  Background:
    Given I open the HimTrek home page

  Scenario: Successful login with valid credentials
    When I login with username and password
    Then I should see the home page