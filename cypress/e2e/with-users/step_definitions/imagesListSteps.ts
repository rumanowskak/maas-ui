import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../utils";

// Step: user is logged in
Given("the user is logged in", () => {
  cy.login(); // assuming you already have a custom Cypress command for login
});

// Step: navigate to images page
When("the user navigates to the images page", () => {
  cy.visit(generateMAASURL("/images"));
});

// Step: check heading
Then("the main toolbar heading should be {string}", (expectedHeading) => {
  cy.get("[data-testid='main-toolbar-heading']").should(
    "contain",
    expectedHeading
  );
});
