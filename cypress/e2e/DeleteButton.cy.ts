describe('Delete Button on all tables', () => {

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
        localStorage.setItem('jll-token', resp.body.data)
        cy.visit("http://localhost:3000")
      })
  })

  const data = [
    { page: "Company List", key: "company-list", button: "company" },
    { page: "User List", key: "user-list", button: "user" },
    { page: "Material", key: "material", button: "material" },
    { page: "Form", key: "form", button: "form" },
    { page: "Unit", key: "unit", button: "unit" },
    { page: "CMS", key: "cms", button: "content" },
  ]

  data.map((item) => (
    it(`should show delete button on ${item.page} Page`, () => {
      const menu = `[data-cy="nav-link-${item.key}"]`
      const deleteBtn = `[data-cy="delete-${item.button}-btn"]`

      cy.get(menu).click()
      cy.get(deleteBtn).should("be.visible")
    })
  ))
})