import React, { FC, useCallback, useRef, useState } from 'react'
import type { Identifier, XYCoord } from 'dnd-core'
import update from 'immutability-helper'
import { useDrag, useDrop } from 'react-dnd'

export const ItemTypes = {
  CARD: 'card',
}

export interface CardProps {
  id: any
  text: string
  index: number
  draggableId: string;
  moveCard?: (dragIndex: number, hoverIndex: number, source: any) => void
}
interface DragItem {
  index: number
  id: string
  type: string
  draggableId: string
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export const Card: FC<CardProps> = ({ id, text, index, draggableId, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: [ItemTypes.CARD, 'pointer'],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop(item, ) {
      const dragIndex = item.index
      const hoverIndex = index
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      
      if (dragIndex === hoverIndex)
      return
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex, item.draggableId)
      item.index = hoverIndex

      console.log({ item, ref, index })
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'pointer',
    item: () => {
      return { id, draggableId, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {text}
    </div>
  )
}


const Pointer:FC<CardProps> = ({ id, index, draggableId, text}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index, draggableId }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  return (
    <div ref={dragRef} style={{ ...style, opacity }} >
      {text}
    </div>
  )
}

const Dnd = () => {

  const [pointers, setPointers] = useState([
    {id: 12, text: 'pointer 12', draggableId: 'pointer'},
    {id: 22, text: 'pointer 22', draggableId: 'pointer'},
    {id: 33, text: 'pointer 33', draggableId: 'pointer'},
  ])

  const [cards, setCards] = useState(
    [
    {
      id: 1,
      text: 'Write a cool JS library',
      draggableId: 'calculation'
    },
    {
      id: 2,
      text: 'Make it generic enough',
      draggableId: 'calculation'
    },
    {
      id: 3,
      text: 'Write README',
      draggableId: 'calculation'
    },
    {
      id: 4,
      text: 'Create some examples',
      draggableId: 'calculation'
    },
    {
      id: 5,
      text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      draggableId: 'calculation'
    },
    {
      id: 6,
      text: '???',
      draggableId: 'calculation'
    },
    {
      id: 7,
      text: 'PROFIT',
      draggableId: 'calculation'
    },
    ]
  )

  const moveCard = useCallback((dragIndex: number, hoverIndex: number, draggableId: any) => {
    console.log({ dragIndex, hoverIndex, draggableId })

    // const item = draggableId === 'pointer' ? pointers[dragIndex] : cards[dragIndex]

    // const list = [...cards]
    // list.splice(hoverIndex, 0, cards[dragIndex])

    // setCards(list)

    setCards((prevCards: any[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    )
  }, [])
  
  const renderCard = useCallback(
    (card: { id: number; text: string }, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          draggableId='calculation'
          moveCard={moveCard}
        />
      )
    },
    [],
  )

  const renderPointer = useCallback(
    (pointer: { id: number; text: string }, index: number) => {
      return (
        <Pointer 
            key={pointer.id}
            index={index}
            id={pointer.id}
            text={pointer.text}
            draggableId='pointer'
          />
      )
    },
    [],
  )

  return (
    <div className="">
      <div className="flex mb-5 flex-wrap gap-2">
        {pointers.map((pointer, index) => (
          renderPointer(pointer, index)
        ))}
      </div>
      <div className="my-5 border-2 border-green-500" />
      <div className="flex gap-2 flex-wrap">
        {cards.map((card, index) => (
          renderCard(card, index)
        ))}
      </div>
    </div>
  )
}

export default Dnd