Feature: HimTrek Search and Enquiry
  Background:
    Given I open the HimTrek home page

  Scenario: User searches treks, adds to wishlist and submits enquiry
    When I search for "Uttarakhand" with checkin "14" and checkout "16"
    And I apply search filters and open a trek
    And I add the trek to wishlist
    And I submit an enquiry using "ENV" as email