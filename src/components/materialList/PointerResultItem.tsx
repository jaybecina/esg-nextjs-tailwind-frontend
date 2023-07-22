import React, { FC } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IPointerOperator } from './MaterialCalculationForm'

interface IProps {
  index: number;
  onPointerClick: (pointer: IPointerOperator) => void;
  pointer: IPointerOperator
}

export const PointerResultItem:FC<IProps> = ({ pointer, index, onPointerClick }) => {

  const hasInput = pointer.text.includes("{{search}}");
  
  return (
    <Draggable
      key={pointer._id} 
      draggableId={pointer._id}
      index={index}>
      {(provided) => (
        <div
          className="bg-white p-2 mb-2 rounded"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {/* <div {...provided.dragHandleProps}>
            Drag Handle
          </div> */}
          <button
            key={index}
            className="px-3 py-1 rounded bg-red-200 font-medium gap-1 text-left"
            type="button"
            onClick={() => onPointerClick(pointer)}>
            {pointer.text.replaceAll("{{search}}", "")}
            {hasInput ? <input
              placeholder='Search'
              readOnly
              className="bg-white h-[20px] pointer-events-none rounded w-[85px] p-1 outline-0 ring-0"
              type="text" /> : null}
          </button>
        </div>
      )}
    </Draggable>
  )
}

export default PointerResultItem;