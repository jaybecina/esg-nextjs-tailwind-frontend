import { cyLogin } from "../support/component"

describe('User List', () => {

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

  const createUserSubmit = '[data-cy="create-user-btn"]'
  const emailInput = '[data-cy="user-modal-email-input"]'
  const passwordInput = '[data-cy="user-modal-password-input"]'
  const nameInput = '[data-cy="user-modal-name-input"]'
  const companySelect = '[data-cy="user-modal-company-select"]'
  const roleSelect = '[data-cy="user-modal-role-select"]'
  const phoneInput = '[data-cy="user-modal-phone-input"]'
  const deletUserBtn = '[data-cy="delete-user-btn"]'
  const deleteConfirmBtn = '[data-cy="delete-modal-confirm-btn"]'

  it("should navigate to user-list", () => {
    cy.visit("http://localhost:3000/user-list")
    cy.url().should("include", "user-list")
  })

  it("should open create user modal", () => {
    cy.get('[ data-cy="small-static-widget"]').click();
  })

  it("should fill out inputs to create user", () => {
    cy.get(emailInput).type("acmeuser@domain.com")
    cy.get(passwordInput).type("123456")
    cy.get(nameInput).type("Acme User 1")
    cy.get(companySelect).select(1)
    cy.get(roleSelect).select(2)
    cy.get(phoneInput).type("049 6152 341")
  })

  it("should submit form and create user and close modal", () => {
    cy.get(createUserSubmit).click();
  })

  it("should should go to last page", () => {
    cy.visit(`${window.location.origin}/user-list?page=5`)
  })

  // it("should show delete modal on delete icon click", () => {
  //   cy.get(deletUserBtn).click()
  //   cy.get(deleteConfirmBtn).should("be.visible")
  // })

  // it("should delete the last user and go back to previos page", () => {
  //   cy.get(deleteConfirmBtn).click();
  // })


})