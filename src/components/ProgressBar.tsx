import React, { FC, useEffect, useState } from 'react'
import cx from "classnames"

interface IProps {
  value: number;
  total: number;
  color: string;
}

const ProgressBar: FC<IProps> = ({ value, total, color }) => {

  const [percent, setPercent] = useState<any>("");

  useEffect(() => {
    if (value && total) {
      setPercent(Math.round((value / total) * 100))
    }

    if (total === null) {
      setPercent(Math.round(value * 100))
    }
  }, [value, total])

  if (!value || !total) {
    return (
      <div className="flex items-center gap-2">
        <div className={cx("w-full h-[5px] overflow-hidden bg-opacity-30 rounded-full relative flex-grow bg-jll-gray-dark")}>
           <div
            style={{ width: "100%" }}
            className={cx("absolute h-[5px]", {
              "bg-jll-gray-dark": color === "gray",
            })} />
        </div>  
        <div className="w-[40px]">
          <p className="text-sm text-left text-jll-gray">0%</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cx("w-full h-[5px] overflow-hidden bg-opacity-30 rounded-full relative flex-grow", {
        "bg-jll-red-light": color === "red",
        "bg-jll-orange-light": color === "orange",
        "bg-jll-gray-dark": color === "gray",
        "bg-black": color === "black"
      })}>
        <div
          style={{ width: `${percent}%` }}
          className={cx("absolute h-[5px]", {
            "bg-jll-red-light": color === "red",
            "bg-jll-orange": color === "orange",
            "bg-jll-gray-dark": color === "gray",
            "bg-black": color === "black"
          })} />
      </div>
      <div className="w-[40px]">
        <p className="text-sm text-left text-jll-gray">{percent || 0}%</p>
      </div>
    </div>
  )
}

export default ProgressBar;