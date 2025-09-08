Feature: Footer

Background:
    Given the user is logged in
    And the user is on the home page

Scenario: Navigating to the local documentation
    When the user looks for the "local documentation" link
    Then the link should include "/MAAS/docs/"

Scenario: It has a link to legal
    When the user looks for the "legal information" link
    Then the link should include "https://www.ubuntu.com/legal"

Scenario: It displays a feedback link
    When the user looks for the "give feedback" button
    Then it should exist
