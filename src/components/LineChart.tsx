import React, { FC, useState } from 'react'
import { ResponsiveContainer } from 'recharts';
import cx from "classnames";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface IProps {
  data?: Array<{
    name?: string;
    percentage?: number;
  }>
}

const lineChartDataA = [
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
const lineChartDataB = [
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
];
const lineChartDataC = [
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
];

const LineChart: FC<IProps> = (props) => {

  const [form, setForm] = useState("a")
  const [data, setData] = useState<Array<{ name: string, percentage: number }>>(lineChartDataA);

  function onFormClick(type: string) {
    if (type === "a") {
      setData(lineChartDataA)
      setForm("a")
    }
    if (type === "b") {
      setData(lineChartDataB)
      setForm("b")
    }
    if (type === "c") {
      setData(lineChartDataC)
      setForm("c")
    }
  }

  return (
    <div className="main border rounded-md shadow-lg w-full bg-white">
      <div className="p-3">
        <p
          data-cy="active-form-label"
          className="font-bold">Task Progress: Form {form.toUpperCase()}</p>
      </div>
      <div className="flex items-start justify-start gap-5">
        <ResponsiveContainer
          height={400}
          width="87%">
          <AreaChart
            width={1020}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5
            }}
          >
            {/* <Legend content={renderLegend} /> */}

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis name="percentage" unit="%" domain={[0, 100]} />
            <Tooltip />
            <Area
              type="monotone"
              dot={{ stroke: 'red', strokeWidth: 2 }}
              dataKey="percentage"
              stroke="#f9cdd0"
              fill="#f9cdd0" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex hidden flex-col text-jll-black gap-5">
          <button
            data-cy="linechart-btn-a"
            onClick={() => onFormClick('a')}
            className={cx("ring-2 ring-jll-red rounded hover:opacity-80 transition duration-150 font-semibold px-6 text-sm py-1", {
              "bg-jll-red ring-2 text-white ring-jll-red": form === 'a'
            })}
            type="button">
            Form A
          </button>
          <button
            data-cy="linechart-btn-b"
            onClick={() => onFormClick('b')}
            className={cx("ring-jll-black ring-2 rounded hover:opacity-80 transition duration-150 font-semibold px-6 text-sm py-1", {
              "bg-jll-red ring-2 text-white ring-jll-red": form === 'b'
            })}
            type="button">
            Form B
          </button>
          <button
            data-cy="linechart-btn-c"
            onClick={() => onFormClick('c')}
            className={cx("ring-jll-orange ring-2 rounded hover:opacity-80 transition duration-150 font-semibold px-6 text-sm py-1", {
              "bg-jll-red ring-2 text-white ring-jll-red": form === 'c'
            })}
            type="button">
            Form C
          </button>
        </div>
      </div>
    </div>
  )
}

export default LineChart