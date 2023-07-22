import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  const [list1, setList1] = useState([
    { id: 'item1', content: 'Item 1' },
    { id: 'item2', content: 'Item 2' },
  ]);
  const [list2, setList2] = useState([
    { id: 'item3', content: 'Item 3' },
    { id: 'item4', content: 'Item 4' },
  ]);
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
    setDroppedItems((prevItems) => [...prevItems, item]);
  };

  const DraggableItem = ({ item, index, list, setList }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'draggableItem',
      item: () => {
        return { type: 'draggableItem', ...item }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`draggable-item bg-white p-2 mb-2 rounded ${isDragging ? 'opacity-50' : ''}`}
      >
        {item.content}
      </div>
    );
  };

  const DroppableArea = () => {
    const [{ isOver }, drop] = useDrop({
      accept: 'draggableItem',
      drop: (item) => handleDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`droppable-area flex gap-x-2 bg-gray-200 p-4 ${isOver ? 'border-2 border-dashed' : ''}`}
      >
        {droppedItems.map((item, index) => (
          <div key={index} className="dropped-item bg-white p-2 mb-2 rounded">
            {item.content}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="flex flex-col gap-4">
        <div className="">
          <div className="flex gap-x-2 draggable-list bg-gray-200 p-4">
            {list1.map((item, index) => (
              <DraggableItem key={item.id} item={item} index={index} list={list1} setList={setList1} />
            ))}
          </div>
        </div>
        <div>
          <DroppableArea />
        </div>
      </div>
    </div>
  );
};

export default App;
