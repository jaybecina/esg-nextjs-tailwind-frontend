export default describe('Modal/Popup', () => {

  const showModalBtn = '[data-cy="preview-show-modal-btn"]';
  const modalPopup = '[data-cy="preview-show-modal"]'
  const modalCloseBtn = '[data-cy="preview-modal-close-btn"]'
  const confirmBtn = '[data-cy="jll-btn-confirm-modal"]'
  const cancelBtn = '[data-cy="jll-btn-cancel-modal"]'

  before(() => {
    cy.visit('http://localhost:3000/preview')
  })

  it('Should popup on click', () => {
    cy.get(showModalBtn).click()
    cy.get(modalPopup).should("be.visible")
  })


  it('Buttons should lighten on hover', () => {
    cy.get(confirmBtn).trigger('mouseover');
    cy.get(confirmBtn).should("have.class", "hover:opacity-90");
    cy.get(cancelBtn).trigger('mouseover');
    cy.get(cancelBtn).should("have.class", "hover:opacity-90");
  })

  it('Close modal on X click', () => {
    cy.get(modalCloseBtn).click();
    cy.get(modalPopup).should("not.exist")
  })
})