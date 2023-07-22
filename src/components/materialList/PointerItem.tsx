import React, { FC } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IPointerOperator } from './MaterialCalculationForm'

interface IProps {
  index: number;
  onPointerClick: (pointer: IPointerOperator) => void;
  pointer: IPointerOperator
}

export const PointerItem:FC<IProps> = ({ pointer, index, onPointerClick }) => {
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
          {...provided.dragHandleProps}
        >
          {/* <div {...provided.dragHandleProps}>
            Drag Handle
          </div> */}
          <button
            key={index}
            className="px-3 py-1 rounded bg-red-200 font-medium"
            type="button"
            onClick={() => onPointerClick(pointer)}>
            {pointer.text}
          </button>
        </div>
      )}
    </Draggable>
  )
}