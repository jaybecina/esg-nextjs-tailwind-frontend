describe('Modal/User', () => {

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'https://jll-be.scc.sh/auth',
      body: {
        email: "xtian@domain.com",
        password: "123456"
      }
    })
      .then((resp: any) => {
        window.localStorage.setItem('jll-token', resp.body.data)
      })
  })

  const addMeterBtn = '[data-cy="add-meter-btn"]'
  const meterModal = '[data-cy="add-meter-modal"]'
  const cancelMeterModalBtn = '[data-cy="cancel-meter-btn"]'
  const editMeterBtn = '[data-cy="edit-meter-btn"]'
  const meterForm = '[data-cy="meter-form-container"]'
  const meterNameBtn = '[data-cy="meter-name-btn"]'

  it("Should login as user and redirect to form", () => {
    cy.visit("http://localhost:3000/forms/user/kpi-summary")
  })

  it("should show modal on add click", () => {
    cy.get(addMeterBtn).click();
    cy.get(meterModal).should("be.visible");
  })

  it("should close modal on cancel click", () => {
    cy.get(cancelMeterModalBtn).click();
    cy.get(meterModal).should("not.exist")
  })

  it("should show modal on edit icon click", () => {
    cy.get(editMeterBtn).first().click();
    cy.get(meterModal).should("be.visible");
  })

  it("should toggle meter form on name click", () => {
    cy.get(cancelMeterModalBtn).click();
    cy.get(meterNameBtn).first().click();
    cy.get(meterForm).should("not.have.css", "hidden")
  })





})