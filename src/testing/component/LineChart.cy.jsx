import LineChart from "../../components/LineChart";

const lineChartData = [
  {
    name: "1",
    percentage: 79
  },
  {
    name: "2",
    percentage: 20
  },
  {
    name: "3",
    percentage: 24
  },
  {
    name: "4",
    percentage: 79
  },
  {
    name: "5",
    percentage: 30
  },
  {
    name: "6",
    percentage: 12
  },
  {
    name: "7",
    percentage: 76
  },
  {
    name: "8",
    percentage: 23
  },
  {
    name: "9",
    percentage: 30
  },
  {
    name: "10",
    percentage: 55
  },
  {
    name: "11",
    percentage: 45
  },
  {
    name: "12",
    percentage: 29
  },
  {
    name: "13",
    percentage: 100
  },
];

describe("Line Chart", () => {
  const tooltip = ".recharts-tooltip-wrapper"
  const formBtnA = '[data-cy="linechart-btn-a"]'
  const formBtnB = '[data-cy="linechart-btn-b"]'
  const formBtnC = '[data-cy="linechart-btn-c"]'
  const activeClass = "bg-jll-red ring-2 text-white ring-jll-red";
  const currentFormLabel = '[data-cy="active-form-label"]'

  beforeEach(() => {
    cy.mount(<LineChart data={lineChartData} />);
  })

  it('Button background should lighten on hover & cursor pointer', () => {
    cy.get(formBtnA).should("have.class", "hover:opacity-80");
    cy.get(formBtnB).should("have.class", "hover:opacity-80");
    cy.get(formBtnC).should("have.class", "hover:opacity-80");
  })

  it('Button should be highlighed when selected', () => {
    cy.get(formBtnA).click();
    cy.get(formBtnA).should("have.class", activeClass)
    cy.get(formBtnB).click();
    cy.get(formBtnB).should("have.class", activeClass)
    cy.get(formBtnC).click();
    cy.get(formBtnC).should("have.class", activeClass)
  })

  it('Tooltip should show on hover', () => {
    cy.get('.recharts-area-area').trigger("mouseover")
    cy.get('.recharts-tooltip-wrapper').should("be.visible")
  })

  it('Should show current form selected', () => {
    cy.get(formBtnA).click();
    cy.get(currentFormLabel).should("have.text", "Task Progress: Form A")
    cy.get(formBtnB).click();
    cy.get(currentFormLabel).should("have.text", "Task Progress: Form B")
    cy.get(formBtnC).click();
    cy.get(currentFormLabel).should("have.text", "Task Progress: Form C")
  })
})