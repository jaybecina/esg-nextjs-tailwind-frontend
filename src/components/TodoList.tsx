import React, { FC, useState } from 'react'
import { ArrowPathIcon, CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import PopupModal from './PopupModal';

interface IProps {
  height?: number;
  data: Array<{
    todo: string;
    completed: boolean;
  }>
}

const TodoList: FC<IProps> = (props) => {

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  function hideTodoModal() {
    setModalIsVisible(false)
  }

  return (
    <div className="border shadow-lg border-jll-gray rounded-md bg-white overflow-hidden w-[280px]">
      <div className="flex justify-between items-center p-3">
        <p className="font-semibold text-lg">To Do List</p>
        {props.data.length > 0 && (
          <button
            onClick={() => setModalIsVisible(true)}
            type="button"
            className="text-sm border border-jll-red rounded-full px-2">
            See All
          </button>
        )}
      </div>

      <PopupModal
        position="center"
        isVisible={modalIsVisible}
        onClose={hideTodoModal}>
        <div className="relative p-5 rounded border shadow-lg bg-white w-[700px]">
          <p className="text-center text-3xl">TODO</p>
          <div className="p-5">
            {props.data && props.data.length > 0 && props.data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-start gap-2 border-b border-gray-300 py-2">
                <div className="bg-gray-200 p-[5px] rounded-full mt-1">
                  <CheckIcon className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm">{item.todo}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={hideTodoModal}
              className="text-sm text-white px-5 bg-jll-gray py-1"
              type="button">
              Cancel
            </button>
          </div>
        </div>
      </PopupModal>

      <div
        style={{ height: `${props.height || 275}px` }}
        className="flex flex-col gap-2 py-3 overflow-scroll bg-gray-50">
        {props.data.length > 0 ? props.data.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-start gap-2 px-3">
            <div className="bg-gray-200 p-[5px] rounded-full mt-1">
              <CheckIcon className="h-4 w-4 text-white" />
            </div>
            <div className="border-b border-gray-300 pb-2">
              <p className="text-sm">{item.todo}</p>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center w-hull h-full gap-2">
            <PencilSquareIcon className="w-10 h-10" />
            <p className="text-sm whitespace-pre">{`Not working yet, waiting for\n your data to update.`}</p>
          </div>
        )}
      </div>

      {props.data.length > 0 && (
        <div className="flex justify-end px-3 py-2">
          <button
            className="text-sm flex gap-1 text-jll-gray-dark items-center"
            type="button">
            <ArrowPathIcon className="w-4 h-4" />
            <span>5 minutes ago</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList