describe('Modal/User', () => {

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

  const data = [
    { page: "Company List", key: "company-list" },
    { page: "User List", key: "user-list" },
    { page: "Material", key: "material" },
    { page: "Form", key: "form" },
    { page: "Unit", key: "unit" },
    { page: "CMS", key: "cms" },
  ]

  data.map((item) => (
    it(`should display table full width for ${item.page} Page`, () => {
      const menu = `[data-cy="nav-link-${item.key}"]`;
      cy.get(menu).click()

      cy.get("table").should("have.css", "min-width", "100%")
    })
  ))



})