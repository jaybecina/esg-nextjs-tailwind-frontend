describe('LoginForm', () => {
  const adminTab = '[data-cy="admin-tab-btn"]';
  const userTab = '[data-cy="user-tab-btn"]';
  const showPassword = '[data-cy="show-password-btn"]';
  const usernameInput = '[data-cy="username"]';
  const passwordInput = '[data-cy="password"]';
  const loginBtn = '[data-cy="login-btn"]';
  const termsAndPolicies = '[data-cy="policies-and-terms-checkbox"]';
  const forgotPasswordLink = '[data-cy="forgot-password-link"]';
  const termsLink = '[data-cy="terms-link"]';
  const policiesLink = '[data-cy="policies-link"]';
  const alertBox = '[data-cy="alert-box-portal"]';
  const termsAndPoliciesModal = '[data-cy="terms-policies-modal"]';
  const termsAndPoliciedXbtn = '[data-cy="terms-policies-close-modal-btn"]'
  const tncCheckbox = '[data-cy="policies-and-term"]'


  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  // it('Tab should be active on click', () => {
  //   cy.get(adminTab).click()
  //   cy.get(adminTab).should("have.class", "text-jll-red");
  //   cy.get(userTab).click()
  //   cy.get(userTab).should("have.class", "text-jll-red");
  // })

  // it('Should open modal when terms or policies are clicked', () => {
  //   cy.get(userTab).click();
  //   cy.get(termsLink).click();
  //   cy.get(termsAndPoliciesModal).should("exist")

  //   cy.get(termsAndPoliciedXbtn).click({ force: true });
  //   cy.get(termsAndPoliciesModal).should("not.exist")
  // })

  // it('Cursor should be pointer on Terms, Policies & Forgot password', () => {
  //   cy.get(forgotPasswordLink).should("have.class", "cursor-pointer");
  //   cy.get(termsLink).should("have.class", "cursor-pointer");
  //   cy.get(policiesLink).should("have.class", "cursor-pointer");
  // })

  it("Should navigate to reset password when click forget password link", () => {
    cy.get(forgotPasswordLink).click();
    cy.url().should("include", "forget-password")
  })

  it('Checkboxes should be cursor pointer', () => {
    cy.get('input[type="checkbox"').should("have.class", "cursor-pointer")
  })

  it('Should show password on eye icon click', () => {
    cy.get(passwordInput).should("have.attr", "type", "password")
    cy.get(passwordInput).type("hello-world")
    cy.get(showPassword).click()
    cy.get(passwordInput).should("have.attr", "type", "text")
  })

  it('Eye icon should be blue when click', () => {
    cy.get(showPassword).click()
    cy.get('[data-cy="eye-slash-icon"]').should("have.class", "text-blue-500")
  })

  // it('Should show checkbox for policies and terms when user is active', () => {
  //   cy.get(userTab).click();
  //   cy.get(termsAndPolicies).should("be.visible");
  // })

  // it('Should hide checkbox for policies and terms when admin is active', () => {
  //   cy.get(adminTab).click();
  //   cy.get(termsAndPolicies).should("not.exist");
  // })

  it('It should throw error on invalid credentials', () => {
    cy.get(usernameInput).type("hello");
    cy.get(passwordInput).type("world");

    cy.get(loginBtn).click();

    cy.get(alertBox).should("be.visible")
  })

  // it('Should submit if tnc is checked', () => {
  //   cy.get(userTab).click()
  //   cy.get(tncCheckbox).check()

  //   cy.get(loginBtn).click()
  //   cy.get(alertBox).should("not.be.visible")
  // })

})