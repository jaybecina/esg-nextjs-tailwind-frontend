import React, { FC } from 'react'

interface IProps {
  category: string;
  title: string;
}

const FormItem: FC<IProps> = ({ category, title }) => {
  return (
    <div className="shadow-md cursor-pointer hover:shadow-lg transition duration-150 bg-white rounded-lg px-2 py-3 flex items-center gap-2 justify-start">
      <p className="text-3xl font-semibold">{category}</p>
      <p className="text-sm">{title}</p>
    </div>
  )
}

export default FormItem