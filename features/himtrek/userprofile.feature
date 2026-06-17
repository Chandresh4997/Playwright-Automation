Feature: HimTrek User Profile
  Scenario: Update User Profile and Browse Activity
    Given I open the user profile page
    When I enter info about myself
    Then I can browse my activity
