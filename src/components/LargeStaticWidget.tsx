import React, { FC } from 'react'
import cx from "classnames"
import { useTranslation } from "react-i18next"

interface IProps {
  label: string;
  text: string;
  href: string;
  image: string;
  alternativeText?: string;
  color: "orange" | "";
}

const LargeStaticWidget: FC<IProps> = (props) => {

  const { t } = useTranslation()

  return (
    <div
      data-cy="large-static-widget"
      className={cx("w-[380px] cursor-pointer h-[280px] rounded-[6px] bg-white shadow-md border", {
        "bg-jll-orange-light": props.color === "orange"
      })}>
      <div className="flex items-center justify-between flex-col h-full">
        <div className="py-4 text-center flex flex-col flex-grow justify-end">
          <p className="text-3xl font-semibold">{t(props.label)}</p>
          <p className="">{t(props.text)}</p>
        </div>
        <div className="flex w-full p-2 justify-end items-end">
          <img
            alt={props.alternativeText}
            src={props.image} />
        </div>
      </div>
    </div>
  )
}

export default LargeStaticWidget