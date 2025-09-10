import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../utils";

Given("the user is logged in", () => {
  cy.login();
});

When("the user navigates to the images page", () => {
  cy.visit(generateMAASURL("/images"));
});

Then("the main toolbar heading should be {string}", (expectedHeading) => {
  cy.get("[data-testid='main-toolbar-heading']").should(
    "contain",
    expectedHeading
  );
});
