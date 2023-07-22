describe('Homepage', () => {

  const companySelect = '[data-cy="global-company-select-list"]'
  const yearSelect = '[data-cy="global-year-select-list"]'

  describe("as Super Admin", () => {
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

    it("should navigate to homepage", () => {
      cy.visit("http://localhost:3000/home")
      cy.url().should("include", "/home")
    })

    it("should show & select global companies select", () => {
      cy.get(companySelect).should("be.visible")
      cy.get(companySelect).select("63845eb97c2712d323f9e5a6")
    })

    it("should show & select global year select", () => {
      cy.get(yearSelect).should("be.visible");
      cy.get(yearSelect).select("2022");
    })

    it("should not include attachment column", () => {
      cy.get('[data-cy="home-table-header"]').should("not.have.text", "Attachment")
    })

    it("should navigate to form on name click", () => {
      const first = '[data-cy="home-form-item"]';
      cy
        .get(first)
        .invoke('prop', 'dataset')
        .then(state => {
          cy.visit(`http://localhost:3000/forms/user/kpi-summary/${state.formId}`)
          cy.url().should("include", state.formId);
        });
    })

    it("should logout super admin", () => {
      cy.get('[data-cy="signout-btn"]').click()
    })
  })

  describe("as Client Admin", () => {
    before(() => {
      cy.request({
        method: 'POST',
        url: 'https://jll-be.scc.sh/auth',
        body: {
          email: "acme.user1@domain.com",
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

    it("should navigate to homepage", () => {
      cy.visit("http://localhost:3000/home")
      cy.url().should("include", "/home")
    })

    it("should not show & global companies select", () => {
      cy.get(companySelect).should("not.exist")
    })

    it("should show & select global year select", () => {
      cy.get(yearSelect).should("be.visible");
      cy.get(yearSelect).select("2022");
    })

    it("should not include attachment column", () => {
      cy.get('[data-cy="home-table-header"]').should("not.have.text", "Attachment")
    })

    it("should navigate to form on name click", () => {
      const first = '[data-cy="home-form-item"]';
      cy
        .get(first)
        .invoke('prop', 'dataset')
        .then(state => {
          cy.visit(`http://localhost:3000/forms/user/kpi-summary/${state.formId}`)
          cy.url().should("include", state.formId);
        });
    })
  })


})