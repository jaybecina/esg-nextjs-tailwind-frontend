import Button from "../../components/Button";

describe("Button", () => {
  it('<Button /> should mount', () => {
    const selector = "[data-cy=jll-btn]";

    cy.mount(<Button type="lg" variant="gradient">Login</Button>);
    cy.get(selector).should("have.css", "cursor", "pointer");
    cy.get(selector).trigger('mouseover');
    cy.get(selector).should("have.class", "hover:opacity-90");
  })
})