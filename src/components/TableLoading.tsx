import React, { FC } from 'react'

const TableLoading: FC = () => {
  return (
    <div className="bg-gray-200 mb-10 rounded-lg h-[380px] w-full overflow-hidden flex flex-col justify-between animate-pulse border border-gray-300">
      <div className="w-full h-[37px] bg-gray-300 animate-pulse"></div>

      <div className="flex-grow flex flex-col gap-2 border p-5">
        <div className="bg-gray-300 h-[35px] w-full border rounded" />
        <div style={{ width: "calc(100% - 120px)" }} className="bg-gray-300 h-[35px] border rounded" />
        <div style={{ width: "calc(100% - 40%)" }} className="bg-gray-300 h-[35px] border rounded" />
        <div style={{ width: "calc(100% - 10%)" }} className="bg-gray-300 h-[35px] border rounded" />
        <div style={{ width: "calc(100% - 20%)" }} className="bg-gray-300 h-[35px] border rounded" />
      </div>

      <div className="flex items-center justify-between p-2 border-t border-gray-100">
        <div className="bg-gray-300 w-[100px] rounded-md h-[30px] animate-pulse"></div>
        <div className="bg-gray-300 w-[100px] rounded-md h-[30px] animate-pulse"></div>
      </div>
    </div>
  )
}

export default TableLoading