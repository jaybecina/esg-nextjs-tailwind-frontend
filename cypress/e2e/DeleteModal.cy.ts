describe('Delete Modal', () => {

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

  const avatarBtn = '[data-cy="avatar-btn"]'
  const xBtn = '[data-cy="delete-modal-x-btn"]'
  const cancelBtn = '[data-cy="delete-modal-cancel-btn"]'
  const modal = '[data-cy="delete-modal-container"]'
  const trigger = '[data-cy="delete-modal-btn"]'

  it("it should navigate to Preview page", () => {
    cy.visit("http://localhost:3000/preview")
    cy.url().should('include', "preview")
  })

  it("it should show modal on button click", () => {
    cy.get(trigger).click();
    cy.get(modal).should("be.visible")
  })

  it("it should close the modal if x button is clicked", () => {
    cy.get(xBtn).click();
    cy.get(modal).should("not.exist")
  })

  it("it should close the modal if cancel button is clicked", () => {
    cy.get(trigger).click();
    cy.get(cancelBtn).click();
    cy.get(modal).should("not.exist")
  })

})