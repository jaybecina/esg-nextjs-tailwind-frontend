import { cyLogin } from "../support/component"

describe('Material Form', () => {

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
        window.localStorage.setItem('jll-token', resp.body.data)
        cy.visit("http://localhost:3000")
      })
  })

  const correctCheckbox = '[data-cy="correct-checkbox"]'
  const errorCheckbox = '[data-cy="error-checkbox"]'
  const reason = '[data-cy="error-reason"]'

  it("should navigate to kpi summary", () => {
    cy.get('[data-cy="nav-link-form"]').click()
    cy.url().should('include', "forms")
  })

  it("should redirect to kpi summary on pencil icon click", () => {
    cy.get('[data-cy="edit-form-btn"]').first().click();
    cy.url().should("include", "kpi-summary")
  })

  it("should collapse the first meter on name click", () => {
    cy.get('[data-cy="meter-name-btn"]').first().click();
    cy.get('[data-cy="meter-form-data"]').first().should("be.visible")
  })

  it("should allowed user to only check either correct or error", () => {
    cy.get(correctCheckbox).check()
    cy.get(errorCheckbox).check()
    cy.get(correctCheckbox).should("not.be.checked")
  })

  it("should disable the reason form if correct checkbox is checked", () => {
    cy.get(correctCheckbox).check();
    cy.get(reason).should("be.disabled")
  })


})