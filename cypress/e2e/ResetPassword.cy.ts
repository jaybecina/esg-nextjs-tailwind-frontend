describe('Reset Password', () => {

  before(() => {
    window.localStorage.removeItem("jll-token")
    cy.visit("http://localhost:3000/login")
  })

  const forgetPwBtn = '[data-cy="forgot-password-link"]'
  const forgetEmailInput = '[data-cy="reset-pw-email-input"]'
  const forgetEmailSubmit = '[data-cy="reset-pw-email-submit"]'
  const linkContainer = '[data-cy="link-container"]'

  it("should navigate to forget password from login via link click", () => {
    cy.get(forgetPwBtn).click()
    cy.url().should("include", "forget-password")
  })

  it("should perform API call to request password change and display link", () => {
    cy.get(forgetEmailInput).type("user@gmail.com")
    cy.get(forgetEmailSubmit).click().then(() => {
      cy.get(linkContainer).should("be.visible")
    })
  })


})