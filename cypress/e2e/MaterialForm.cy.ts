import { cyLogin } from "../support/component"

describe('Material Form', () => {

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

  const values = ["Text", "Options", "Number", "Boolean"];
  const materialSelectType = '[data-cy="material-type-select"]'
  const matrixRowItem = '[data-cy="material-matrix-row-item"]'
  const matrixColumnItem = '[data-cy="material-matrix-column-item"]'
  const addRowBtn = '[data-cy="add-row-matrix-btn"]'
  const addColumnBtn = '[data-cy="add-column-matrix-btn"]'

  it("should navigate to material-list", () => {
    cy.get('[data-cy="nav-link-material"]').click()
    cy.url().should('include', "material-list")
  })

  it("should open modal on add material button clicked", () => {
    cy.get('[data-cy="small-static-widget"]').click()
    cy.get('[data-cy="add-material-modal"]').should("be.visible")
  })

  it("modal type should have `text` and `matrix` options", () => {
    cy.get(materialSelectType).select(1).should("have.value", "text")
    cy.get(materialSelectType).select(2).should("have.value", "matrix")
  })

  it("should add row on `add row` button click", () => {
    cy.get(addRowBtn).click();
    cy.get(matrixRowItem).should("have.length", 2);
  })

  it("should add column on `add column` button click", () => {
    cy.get(addColumnBtn).click();
    cy.get(matrixColumnItem).should("have.length", 2);
  })


})