import LargeStaticWidget from "../../components/LargeStaticWidget";

describe("LargeStaticWidget", () => {
  it('<LargeStaticWidget /> should mount', () => {
    const selector = "[data-cy=large-static-widget]";

    cy.mount(<LargeStaticWidget
      label="User List"
      text="Let's start to check Forms."
      href=""
      image="/assets/laptop.png"
      alternativeText="laptop-data-img"
      color="orange"
    />);

    cy.get(selector).should("have.css", "cursor", "pointer")
  })
})