import { FC, useState } from 'react'

interface IProps {
  meter: number;
  typeOfUse?: string;
  area?: string;
  unit?: string;
  annualKpiTarget?: string;
  months: Array<{ month: string, value: number }>;
  informationCorrect: boolean;
  error: boolean;
  errorReason?: string;
  status: "wait" | "checked" | "error" | "in-progress" | "check-again";
}

const MeterItem: FC<IProps> = (props) => {

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [tickedOption, setTickedOption] = useState<string>("");

  function defineStatus() {
    switch (props.status) {
      case "wait": return <p className="text-sm text-jll-gray">Wait Check</p>;
      case "checked": return <p className="text-sm text-jll-green">Checked - Information Correct</p>;
      case "error": return <p className="text-sm text-jll-red">Checked - Error, Waiting User Modify</p>;
      case "in-progress": return <p className="text-sm text-jll-gray">User In Progress</p>;
      case "check-again": return <p className="text-sm text-jll-orange">Checked - Error, Waiting Admin Check it again</p>;
    }
  }

  return (
    <main className="p-3 bg-white shadow-lg rounded-md border-[1px] border-gray-100">
      <div
        data-cy="meter-name-btn"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer">
        <p className="font-semibold">Meter {props.meter}</p>
        {defineStatus()}
      </div>

      {!collapsed && (
        <section
          data-cy="meter-form-data"
          className="px-3 mt-3">
          <div className="grid grid-cols-12 text-sm">
            <div className="col-span-2">
              <div className="flex items-center justify-start gap-2 my-[2px]">
                <p>Type of use:</p>
                <p>{props.typeOfUse}</p>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-2">
              <div className="flex items-center justify-start gap-2 my-[2px]">
                <p>Area:</p>
                <p>{props.area}</p>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-start gap-2 my-[2px]">
                <p>Unit:</p>
                <p>{props.unit}</p>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-start gap-2 my-[2px]">
                <p>Annual KPI Target:</p>
                <p>{props.annualKpiTarget}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 text-sm">
            {props.months.map((item, index) => (
              <div
                key={index}
                className="col-span-2">
                <div className="flex items-center justify-start gap-2 my-[2px]">
                  <p>{item.month} Electricity:</p>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm font-semibold">Annual Actual total electricity consumption: 100</p>

          <div className="flex items-center justify-start gap-5 mt-1">
            <div className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                id="information-correct"
                data-cy="correct-checkbox"
                checked={tickedOption === "correct"}
                className="-mb-[1px]"
                onChange={(e) => setTickedOption(e.target.value)}
                name="information-correct"
                value="correct" />
              <label htmlFor="information-correct">Information Correct</label>
            </div>
            <div className="flex items-center gap-1 text-sm flex-grow">
              <input
                type="checkbox"
                id="error"
                data-cy="error-checkbox"
                checked={tickedOption === "error"}
                className="-mb-[1px]"
                onChange={(e) => setTickedOption(e.target.value)}
                name="error"
                value="error" />
              <label htmlFor="error">Error</label>
              <input
                data-cy="error-reason"
                disabled={tickedOption === "correct"}
                placeholder="Please enter the reason..."
                className="border-[1px] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed border-jll-gray px-2 py-[2px] w-full mr-[10rem]"
                type="text" />
            </div>
          </div>
        </section>
      )}

    </main>
  )
}

export default MeterItem