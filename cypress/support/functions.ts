export function login() {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/auth',
    body: {
      email: "superadmin@gmail.com",
      password: "123456"
    }
  })
    .then((resp: any) => {
      window.localStorage.setItem('jll-token', resp.data.token)
    })
}