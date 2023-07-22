import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const TestApp = () => {
  const [items, setItems] = useState([
    { id: 'item1', content: 'Item 1' },
    { id: 'item2', content: 'Item 2' },
    { id: 'item3', content: 'Item 3' },
    { id: 'item4', content: 'Item 4' },
  ]);

  const [selectedPointers, setSelectedPointers] = useState<any[]>([]);

  const handleDragEnd = (result: DropResult) => {

    console.log({ result })
    if (!result.destination) return; // Return if dropped outside the droppable area

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      insertItem(result)
      
    } else {

      console.log({ result })
      moveItem(result)
    }
    
  };

  const insertItem = (result: DropResult) => {
    const { source, destination } = result;

    const newItems = [...selectedPointers]
    newItems.splice(destination.index, 0, items[source.index])

    setSelectedPointers(newItems)
  }

  const moveItem = (result: DropResult) => {
    const lists = {
      'selected-pointers': selectedPointers,
      'pointers': items
    }

    const { source, destination } = result;

    const newItems = [...lists[destination.droppableId]];
    const [removed] = newItems.splice(source.index, 1); // Remove the dragged item from the list
    newItems.splice(destination.index, 0, removed); // Insert the dragged item at the new position

    if (destination.droppableId === 'pointers') {
      setItems(newItems)
    } else {
      setSelectedPointers(newItems)
    }
  }
  
  return (
    <div className="app">
      <DragDropContext 
        
        onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Droppable droppableId="pointers">
              {(provided) => (
                <div
                  className="draggable-items bg-gray-200 p-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id} 
                      draggableId={item.id}
                      index={index}>
                      {(provided) => (
                        <div
                          id={item.id}
                          style={{ transform: 'none' }}
                          className="bg-white p-2 mb-2 rounded"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div {...provided.dragHandleProps}>
                            Drag Handle
                          </div>
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>


          <div className="col-span-6">
            <Droppable droppableId="selected-pointers">
              {(provided) => (
                <div
                  className="droppable-area bg-gray-300 p-4 h-full"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                   {selectedPointers.map((item, index) => (
                    <Draggable
                      key={`calculation-${index}`}
                      draggableId={`calculation-${index}`} 
                      index={index}>
                      {(provided) => (
                        <div
                          className="draggable-item bg-white p-2 mb-2 rounded"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div {...provided.dragHandleProps}>
                            Drag Handle
                          </div>
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TestApp;
