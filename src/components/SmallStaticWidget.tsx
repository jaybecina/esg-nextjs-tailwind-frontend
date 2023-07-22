import React, { FC } from 'react'
import { PlusIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "react-i18next"
interface IProps {
  label: string;
  description: string;
  onClick?: () => void;
}

const SmallStaticWidget: FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <div className="flex bg-[#dbd6c7] h-[110px] w-[380px] flex-col items-center py-2 justify-center px-5 rounded-md shadow-lg relative overflow-hidden">
      <div className="absolute -left-[4rem] -top-[7rem] bg-[#d5cfbf] h-[300px] w-[100px] transform rotate-[35deg]" />
      <button
        data-cy="small-static-widget"
        onClick={props.onClick ? props.onClick : () => { }}
        className="text-white h-[35px] w-[35px] bg-white rounded-md bg-opacity-30 flex justify-center items-center mb-1"
        type="button">
        <PlusIcon className="h-6 w-6" />
      </button>
      <p className="font-semibold">{t(props.label)}</p>
      <p className="-mt-1 text-sm text-jll-gray-dark font-medium mb-0">{t(props.description)}</p>
    </div>
  )
}

export default SmallStaticWidget