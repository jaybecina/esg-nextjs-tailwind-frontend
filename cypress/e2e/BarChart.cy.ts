describe('Modal/Popup', () => {

  const magnifyBtn = '[data-cy="barchart-magnify-btn"]'
  const chartModal = '[data-cy="barchart-magnify-modal"]'
  const closeModalBtn = '[data-cy="barchart-modal-close-btn"]'

  before(() => {
    cy.visit('http://localhost:3000/preview')
  })

  it('Zoom icon should be pointer when hover', () => {
    cy.get(magnifyBtn).should("have.class", "cursor-pointer")
  })

  it('Enlarge the chart on zoom click', () => {
    cy.get(magnifyBtn).click()
    cy.get(chartModal).should("be.exist")
  })

  it('Modal should close on X click', () => {
    cy.get(closeModalBtn).click()
    cy.get(chartModal).should("not.exist")
  })

  it('Tooltip should show on hover', () => {
    cy.get('.recharts-area-area').trigger("mouseover")
    cy.get('.recharts-tooltip-wrapper').should("be.visible")
  })
})