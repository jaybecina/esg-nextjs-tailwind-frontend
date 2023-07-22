describe('LoginForm', () => {
  const showAlertBtn = '[data-cy="show-alert-btn"]';
  const alertBox = '[data-cy="alert-box-portal"]';

  it('Alertbox should show and hide after 5 sec.', () => {
    cy.visit('http://localhost:3000/preview')
    cy.get(showAlertBtn).click()
    cy.get(alertBox).should("exist")
  })

  it('Should hide after 5sec', () => {
    cy.wait(5000)
    cy.get(alertBox).should("not.be.visible")
  })

})