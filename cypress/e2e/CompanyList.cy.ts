describe('Service Center/Contact Us', () => {
  before(() => {
    cy.request({
      method: 'POST',
      url: 'https://jll-be.scc.sh/auth',
      body: {
        email: "superadmin@gmail.com",
        password: "123456"
      }
    })
      .then((resp: any) => {
        const token = resp.body.data;
        cy.setLocalStorage("jll-token", token);
        cy.saveLocalStorage();
      })
  })


  beforeEach(() => { cy.restoreLocalStorage() })
  afterEach(() => { cy.saveLocalStorage() })

  it("should navigate to company page", () => {
    cy.visit("http://localhost:3000/company-list")
    cy.url().should("include", "company-list")
  })

  it("should type query on search box", () => {
    cy.get('[data-cy="search-company-input"]').type("Vercel")
  })

  it("should return result based on user search", () => {
    cy.get('[data-cy="company-list-item"]').contains("Vercel")
  })

})