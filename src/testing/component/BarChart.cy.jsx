import BarChart from "../../components/BarChart";

const barChartData = [
  { date: "2021.4", value: 200 },
  { date: "2021.5", value: 350 },
  { date: "2021.6", value: 520 },
  { date: "2021.7", value: 269 },
  { date: "2021.8", value: 497 },
  { date: "2021.9", value: 448 },
  { date: "2021.10", value: 714 },
  { date: "2021.11", value: 875 },
  { date: "2021.12", value: 501 },
  { date: "2022.1", value: 474 },
  { date: "2022.2", value: 836 },
]

describe("Bar Chart", () => {
  it('<BarChart /> should mount', () => {
    const tooltip = ".recharts-tooltip-wrapper"

    cy.mount(<BarChart data={barChartData} />);

    cy.get(":nth-child(8) > .recharts-rectangle").trigger("mouseover")
    cy.get(tooltip).should("have.css", "visibility", "visible")
  })
})