import React, { FC } from 'react'

interface IProps {
  status: string
}

const FormStatus: FC<IProps> = (props) => {

  function defineFormStatus() {
    switch (props.status) {
      case "in-progress": return <p className="font-semibold  text-gray-500">User in progress</p>
      case "submitted": return <p className="font-semibold  text-blue-500">Submitted</p>
      case "error": return <p className="font-semibold  text-red-500">Error, Waiting Modify</p>
      case "check-again": return <p className="font-semibold  text-orange-500">Admin Checked Error</p>
      case "completed": return <p className="font-semibold  text-green-500">Completed</p>
      default: return (<></>)
    }
  }

  return defineFormStatus()
}

export default FormStatus