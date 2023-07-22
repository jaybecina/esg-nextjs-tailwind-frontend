import React, { FC } from 'react'
import { format } from "date-fns"
import Avatar from './Avatar';
import { useTranslation } from "react-i18next"

interface IProps {
  date: Date;
  label: string;
  progress: number;
  totalProgress: number;
  dayLeft: number;
  avatars?: Array<any>;
}

const LargeDynamicWidget: FC<IProps> = (props) => {

  const total = (props.progress / props.totalProgress) * 100;
  const { t } = useTranslation()

  return (
    <div className="border-[1px] shadow-lg border-jll-gray w-[380px] p-5 bg-[#edebe3] rounded-md">
      <p>{format(props.date, "d MMMM yyyy").toString()}</p>
      <p className="text-3xl text-center my-6 font-semibold">{t(props.label)}</p>
      <div className="relative  w-[90%] mx-auto mb-6">
        <div className="relative bg-white rounded-full h-[15px] overflow-hidden">
          <div
            style={{ width: `${Math.round(total)}%` }}
            className="bg-gradient-to-l from-jll-red to-jll-red-light h-full" />
        </div>

        <div className="flex justify-between text-jll-gray-dark">
          <p>{t("Progress")}</p>
          <p>{Math.round(total)}%</p>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-jll-gray-dark mb-1">{t("Report Admin")}</p>
          {/* array in props */}
          <div className="flex justify-start">
            {[1, 2, 3, 4, 5].map((_, index: number) => (
              <div
                key={index}
                className="relative -ml-1">
                <Avatar
                  url=""
                  alternativeText={index.toString()}
                  size='sm' />
              </div>
            ))}
          </div>
        </div>
        <p className="bg-white px-3 py-1 text-sm rounded-full">
          {props.dayLeft} {t("Day Left")}
        </p>

      </div>
    </div>
  )
}

export default LargeDynamicWidget