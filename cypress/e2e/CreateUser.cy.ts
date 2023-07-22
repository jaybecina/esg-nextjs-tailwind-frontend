import jwtDecode from "jwt-decode";

describe('Modal/User', () => {

  const addUserModalBtn = '[data-cy="small-static-widget"]'
  const userModal = '[data-cy="add-user-modal"]'
  const userListMenuBtn = '[data-cy="nav-link-user-list"]'
  const errorMessage = '[data-cy="error-message"]'
  const createUserBtn = '[data-cy="create-user-btn"]'
  const closeModalBtn = '[data-cy="user-modal-close-btn"]'
  const alertBox = '[data-cy="alert-box-portal"]'

  const companySelect = '[data-cy="user-modal-company-select"]'

  let token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzVhNDBjMGE3NTdlY2ZmZjVlNjI4MTgiLCJlbWFpbCI6InZlcmNlbHVzZXIxQGRvbWFpbi5jb20iLCJyb2xlIjoiY2xpZW50LWFkbWluIiwiZXhwIjoxNjY5MTk4MzE3LCJpYXQiOjE2Njg1OTM1MTd9.zunz_9Unj-BL4zay_sEXrbxkSKP9rJ5TZnNsV0ts2XM"

  before(() => {
    cy.request({
      method: 'POST',
      url: 'https://jll-be.scc.sh/auth',
      body: {
        email: "verceluser1@domain.com",
        password: "123456"
      }
    })
      .then((resp: any) => {
        window.localStorage.setItem("jll-token", resp.body.data);
        cy.visit("http://localhost:3000/home")
      })
  })

  it("should login as client admin & load users page", () => {
    cy.get(userListMenuBtn).click();
    cy.url().should("include", "/user-list")
  })

  it("should open modal when add company is clicked", () => {
    cy.get('[data-cy="small-static-widget"]').click();
    cy.get(userModal).should("be.visible")
  })

  it("should show only companies current user is assign", () => {

    cy.request({
      method: 'GET',
      url: `https://jll-be.scc.sh/auth/635a40c0a757ecfff5e62818`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((resp: any) => {
        console.log({ resp })
        const companyId = resp?.body?.data?.company?._id;
        cy.get(companySelect).each(($option, index) => {
          if (index > 0) {
            expect($option).to.have.value(companyId)
            cy.log(`Expect ${$option} to have value ${companyId}`, expect($option).to.have.value(companyId))
          }
        })
      })
  })

  it("should show error message on empty form submit", () => {
    cy.get(createUserBtn).click();
    cy.get(errorMessage).should("be.visible")
  })

  it("should close modal on cancel", () => {
    cy.get(closeModalBtn).click();
    cy.get(userModal).should("not.exist")
  })

  it("unique field is email: should show error message", () => {
    cy.get(addUserModalBtn).click();
    cy.get('input[name=email]').type("superadmin@gmail.com")
    cy.get('input[name=name]').type("Super Admin")
    cy.get('input[name=password]').type("123456")
    cy.get('input[name=phone]').type("049 502 1937")
    cy.get('select[name=role]').select(1)
    cy.get('select[name=company]').select(1)

    cy.get(createUserBtn).click()
    cy.get(alertBox).should("exist")
  })


})