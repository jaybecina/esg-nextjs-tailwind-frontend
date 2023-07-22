describe('Reload to same page', () => {

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

  it("it should navigate to company list", () => {
    cy.visit("http://localhost:3000/company-list")
    cy.url().should("include", "company-list")
  })

  it("it should reload", () => {
    cy.reload(true)
  })

  it("it should stay on company list page", () => {
    cy.url().should("include", "company-list")
  })

})