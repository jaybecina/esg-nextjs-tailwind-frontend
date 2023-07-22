

describe('Create Material', () => {
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
      })
  })

  it("should navigate to material page")

})