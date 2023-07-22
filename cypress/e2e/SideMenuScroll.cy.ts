describe('Reload to same page', () => {

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
        cy.visit("http://localhost:3000")
      })
  })

  it("it should navigate to home", () => {
    cy.visit("http://localhost:3000")
  })

  it("it should zoom to simulate small screen", () => {
    cy.viewport(1024, 768)
  })

  it("it should show scroolbar and scroll to bottom", () => {
    cy.get('[data-cy="sidemenu-items"]').scrollTo("bottom")
  })




})