const addCompanyBtn = '[data-cy="small-static-widget"]'
const companyModal = '[data-cy="add-company-modal"]'
const companyMenuBtn = '[data-cy="nav-link-company-list"]'
const errorMessage = '[data-cy="error-message"]'
const createCompanyBtn = '[data-cy="create-company-btn"]'
const closeModalBtn = '[data-cy="close-company-modal-btn"]'
const updateCompanyBtn = '[data-cy="update-company-btn"]'
const updateCompanyModal = '[data-cy="update-company-modal"]'
const uploadFile = '[data-cy="logo-upload-input"]'
const uploadFileBtn = '[data-cy="logo-upload-btn"]'

describe('Modal/Create Company', () => {
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

  it("should load company page", () => {
    cy.get(companyMenuBtn).click();
    cy.url().should('include', 'company-list');
  })

  it("should open modal when add company is clicked", () => {
    cy.get(addCompanyBtn).click();
    cy.get(companyModal).should("be.visible")
  })

  it("should include language select input", () => {
    cy.get('[data-cy="add-company-language-select"]').should("exist")
  })

  it("should show error message on empty form submit", () => {
    cy.get(createCompanyBtn).click();
    cy.get(errorMessage).should("be.visible")
  })

  it("should be able to select file to upload as icon", () => {
    cy.get(uploadFile).selectFile("cypress/e2e/rust_icon.png", { force: true })
  })

  it("should disable file selection if user already uploaded", () => {
    cy.get(uploadFileBtn).should("be.disabled")
  })

  it("should close modal on cancel click", () => {
    cy.get(closeModalBtn).click();
    cy.get(companyModal).should("not.exist")
  })

})

describe('Modal/Update Company', () => {
  beforeEach(() => {
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
      })
  })

  it("should load company page", () => {
    cy.get(companyMenuBtn).click();
    cy.url().should('include', 'company-list');
  })

  it("should show update company modal on pencil icon click", () => {
    cy.get(updateCompanyBtn).first().click();
    cy.get(updateCompanyModal).should("be.visible")
  })

  // it("should get client admin of selected company", async () => {
  //   cy
  //     .request("https://jll-be.scc.sh/auth")
  //     .then((resp) => {
  //       const clientAdmins = resp.body.data.filter((user) => user.role === "client-admin");

  //       cy.get('[cy="update-company-client-admin-select"]').contains("hello")

  //     })
  // })

  it("Should close the modal on close click", () => {
    cy.get('[data-cy="close-update-company-btn"]').click();
    cy.get(updateCompanyModal).should("not.exist")
  })

})