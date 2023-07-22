
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

  it("should navigate to company list page", () => {
    cy.visit("http://localhost:3000/company-list")
    cy.url().should("include", "/company-list")
  })

  it("should select first company and show update modal", () => {
    cy.get('[data-cy="company-list-item"]')
      .first()
      .find('[data-cy="update-company-btn"]')
      .click()

    cy.get('[data-cy="update-company-btn"]').should("be.visible")
  })

  it("should remove existing icon for company", () => {
    cy.get('[data-cy="remove-attachment-btn"]').first().click({ force: true });
    cy.get('[data-cy="company-icon"]').should("not.exist");
  })

  it("should upload a new icon to company", () => {
    cy.get('[data-cy="upload-logo-btn"]').click()
    cy.get('[data-cy="upload-logo-input"]').selectFile("cypress/e2e/rust_icon.png", { force: true })

    cy.get('[data-cy="submit-update-company-btn"]').click();
  })






})