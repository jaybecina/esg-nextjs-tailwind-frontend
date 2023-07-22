import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid"

const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="h-screen w-screen grid place-items-center">
      <div className="w-[720px] h-[320px] shadow-md flex flex-col gap-3 text-white items-center  bg-jll-red-light justify-center border rounded-lg p-2">
        <p className="text-5xl font-bold">404 Page Not Found</p>
        <p className="mb-5">The page your trying to access is not available.</p>
        <Button
          onClick={() => navigate(-1)}
          type="lg"
          variant="gradient">
          <ArrowSmallLeftIcon className="w-5 h-5 mr-1" />
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default PageNotFound