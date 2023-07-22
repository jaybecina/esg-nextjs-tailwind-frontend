import React, { FC } from 'react'
import { format } from "date-fns"

interface IProps {
  name?: string;
  startDate: Date;
  endDate: Date;
}

const ReportPageHeader: FC<IProps> = (props) => {
  return (
    <div className="text-center mb-5">
      <div className="flex items-center justify-center gap-2">
        {/* <img
          width={29}
          height={29}
          alt="plug icon"
          src="/assets/plug-icon.png" /> */}
        <p className="text-4xl font-bold">{props.name || "Actual electricity consumption"}</p>
      </div>
      <p className="text-[26px] italic font-semibold">
        {`Financial Year Report Date: ${format(new Date(props.startDate || new Date()), "dd MMM, yyyy").toString()}`}
      </p>
    </div>
  )
}

export default ReportPageHeader