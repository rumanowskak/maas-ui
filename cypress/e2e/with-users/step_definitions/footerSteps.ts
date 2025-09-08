import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../utils";

Given("the user is on the home page", () => {
  cy.visit(generateMAASURL("/"));
});

When("the user looks for the {string} link", (linkName: string) => {
  cy.findByRole("link", { name: new RegExp(linkName, "i") }).as("element");
});

When("the user looks for the give feedback button", () => {
  cy.findByRole("button", { name: /give feedback/i });
});

Then("the link should include {string}", (expectedHref) => {
  cy.get("@element").should("have.attr", "href").and("include", expectedHref);
});

Then("it should exist", () => {
  cy.get("@element").should("exist");
});
