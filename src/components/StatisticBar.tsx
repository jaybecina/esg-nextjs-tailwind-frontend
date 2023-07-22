import React, { FC } from 'react'

interface IElecSum {
  date: string;
  value: number;
}

interface IProps {
  label: string;
  data: Array<IElecSum>
}

const StatisticBar: FC<IProps> = (props) => {
  return (
    <div className="border-[1px] border-gray-100 bg-white rounded-md w-full px-3 py-4 shadow-lg">
      <p className="font-bold mb-3">{props.label}</p>
      <div className="grid grid-cols-12 gap-2">
        {props.data.map((sum: IElecSum, index: number) => (
          <div
            key={index}
            className="col-span-2">
            <p className="text-sm">{sum.date}:{" "}{sum.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatisticBar