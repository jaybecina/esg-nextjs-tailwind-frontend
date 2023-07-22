describe('Service Center/Contact Us', () => {
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
        const token = resp.body.data;
        cy.setLocalStorage("jll-token", token);
        cy.saveLocalStorage();
      })
  })

  beforeEach(() => { cy.restoreLocalStorage() })
  afterEach(() => { cy.saveLocalStorage() })

  it("should navigate to contact us page", () => {
    cy.visit("http://localhost:3000/contact-us")
  })

  it("should display data from CMS page", () => {
    cy
      .request("https://jll-be.scc.sh/content")
      .then((resp) => {
        const content = resp.body.data.find((item: any) => item.title === "contact-us-content")
        const cf = content['customFields'];

        const fieldsOnContacts = ["title", "text", "phone", "email", "address"];

        fieldsOnContacts.forEach((field) => {
          cy.get(`[data-cy="contact-${field}"]`).contains(cf[field])
        })
      })
  })

})

describe('Service Center/FAQ', () => {
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
        const token = resp.body.data;
        cy.setLocalStorage("jll-token", token);
        cy.saveLocalStorage();
      })
  })

  beforeEach(() => { cy.restoreLocalStorage() })
  afterEach(() => { cy.saveLocalStorage() })

  it("should navigate to contact us page", () => {
    cy.visit("http://localhost:3000/contact-us")
  })

  it("should display category faq from cms", () => {
    cy
      .request("https://jll-be.scc.sh/content")
      .then((resp: any) => {
        const items = resp.body.data;
        items.forEach((item) => {
          if (item.category.toLowerCase() === "faq") {
            cy.get(`[data-cy="faq-${item._id}-title"]`).should("be.visible")
          }
        })
      })
  })

  it("should open the answer on accordion title click", () => {
    cy.get('[data-cy="accordion-title-btn"]').first().click()
    cy.get('[data-cy="faq-answer-container"]').first().should("be.visible")
  })


})