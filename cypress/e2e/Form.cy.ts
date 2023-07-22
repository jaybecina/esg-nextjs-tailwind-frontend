describe('Create form on Super Admin', () => {

  const createFormBtn = '[data-cy="create-form-btn"]'

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

  it("should login as super admin and navigate to form page", () => {
    cy.visit("http://localhost:3000/forms")
  })

  it("'Create Form' button should be visible", () => {
    cy.get(createFormBtn).should("be.visible")
  })

  it("should logout super admin", () => {
    cy.get('[data-cy="signout-btn"]').click()
  })
})

describe('Create form on Client Admin', () => {
  const createFormBtn = '[data-cy="create-form-btn"]'

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
        const token = resp.body.data;
        cy.setLocalStorage("jll-token", token);
        cy.saveLocalStorage();
      })
  })

  beforeEach(() => { cy.restoreLocalStorage() })
  afterEach(() => { cy.saveLocalStorage() })

  it("should login as client admin and navigate to form page", () => {
    cy.visit("http://localhost:3000/forms")
  })

  it("'Create Form' button should not be visible", () => {
    cy.get(createFormBtn).should("not.exist")
  })

  it("should logout client admin", () => {
    cy.get('[data-cy="signout-btn"]').click()
  })
})

describe('Create form on User', () => {
  const createFormBtn = '[data-cy="create-form-btn"]'

  before(() => {
    cy.request({
      method: 'POST',
      url: 'https://jll-be.scc.sh/auth',
      body: {
        email: "hellouser2@domain.com",
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

  it("should login as user and navigate to form page", () => {
    cy.visit("http://localhost:3000/forms")
  })

  it("'Create Form' button should not be visible", () => {
    cy.get(createFormBtn).should("not.exist")
  })

  it("should logout user", () => {
    cy.get('[data-cy="signout-btn"]').click()
  })
})