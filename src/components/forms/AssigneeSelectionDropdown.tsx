import { FC } from 'react'

interface IProps {
  handleCheckboxChange: (e) => void;
  isAssignedToAll: boolean;
  assignees: string[];
  data: {_id: string, name: string}[];
}

const AssigneeSelectionDropdown:FC<IProps> = ({ data, isAssignedToAll, assignees, handleCheckboxChange }) => {

  return (
    <div 
      className="flex flex-col justify-start gap-y-1 bg-white rounded p-3 w-fit shadow absolute top-[2rem] left-0">
      <div className="flex items-center gap-x-2">
        <input 
          onChange={handleCheckboxChange}
          checked={isAssignedToAll}
          value="assign-to-all"
          id="assign-to-all"
          type="checkbox" />
        <label htmlFor="assign-to-all">Assign to all user</label>
      </div>

      {data.map((item) => (
        <div 
          key={item._id}
          className="flex items-center gap-x-2">
          <input 
            id={item._id}
            disabled={isAssignedToAll}
            value={item._id}
            className="disabled:opacity-50"
            onChange={handleCheckboxChange}
            checked={assignees.includes(item._id)}
            type="checkbox" />
          <label htmlFor={item._id}>{item.name}</label>
        </div>
      ))}
    </div>
  )
}

export default AssigneeSelectionDropdown