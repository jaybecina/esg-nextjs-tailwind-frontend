import React, { FC } from 'react'
import { EllipsisVerticalIcon, ArrowSmallUpIcon, ArrowSmallDownIcon } from "@heroicons/react/24/solid"
import cx from "classnames";
import { useTranslation } from "react-i18next"

interface Iprops {
  label: string;
  value: string;
  increasedBy: number;
}

const SmallDynamicWidget: FC<Iprops> = (props) => {

  const { t } = useTranslation();

  return (
    <div className="border-[1px] border-jll-gray bg-white rounded-md w-[380px] p-5 shadow-lg">
      <div className="flex justify-between">
        <p className="">{t(props.label)}</p>
        <button
          className="hidden"
          type="button">
          <EllipsisVerticalIcon className="h-6 w-6 text-jll-gray-dark" />
        </button>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-bold text-3xl">{t(props.value)}</p>
        {/* <div className={cx("flex items-center justify-center gap-1 h-[20px] rounded-full px-2", {
          "text-green-600 bg-green-200": props.increasedBy > 0,
          "text-red-600 bg-red-200": props.increasedBy <= 0,
          "hidden": props.increasedBy === null
        })}>
          {props.increasedBy > 0
            ? <ArrowSmallUpIcon className="w-4 h-4" />
            : <ArrowSmallDownIcon className="w-4 h-4" />}
          <span className="text-sm font-medium">{props.increasedBy}%</span>
        </div> */}
      </div>
    </div>
  )
}

export default SmallDynamicWidget