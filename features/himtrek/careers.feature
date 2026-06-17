Feature: HimTrek Careers
  Background:
    Given I open the HimTrek home page

  Scenario: Browse Careers and view Terms and Conditions
    When I open the careers page
    Then I should see the Careers heading
    When I open the terms and conditions
    Then I should see the Terms and Conditions heading
