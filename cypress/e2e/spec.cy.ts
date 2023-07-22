const homeNavlink = '[data-cy=nav-link-home]';

describe('empty spec', () => {
  it('Should Navigate to Home Page', () => {

    const hasRoute = ["home", "company-list"]

    cy.visit('http://localhost:3000')

    hasRoute.forEach((route: string) => {
      cy.get(`[data-cy=nav-link-${route}]`).click()
      cy.url().should('include', `/${route}`)
    })
  })

})