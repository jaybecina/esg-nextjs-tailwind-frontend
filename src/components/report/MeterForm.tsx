import { useFormik } from 'formik';
import React, { FC } from 'react'

interface IProps {
  onCancel: () => void;
  onConfirm: (data: {
    meter: string;
    name: string;
  }) => void;
}

const MeterForm: FC<IProps> = (props) => {

  const form = useFormik({
    initialValues: {
      meter: "",
      name: "",
    },
    onSubmit: (values) => {
      if (!values.meter || !values.name) {
        return alert("Meter and name is required.")
      }
      props.onConfirm(values)
    }
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      className="py-5 px-4 border border-jll-gray bg-white w-[320px]">
      <div className="flex gap-2">
        <p>Add</p>
        <input
          name="meter"
          value={form.values.meter}
          onChange={form.handleChange}
          className="px-1 h-[20px] w-[40px] border-b border-black"
          type="text" />
        <p>Meter Form</p>
      </div>
      <div className="flex items-center justify-start gap-2">
        <p>Meter Form Name</p>
        <input
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          className="px-1 h-[20px] w-[150px] border-b border-black"
          type="text" />
      </div>
      <div className="items-center justify-center gap-3 flex mt-5">
        <button
          className="bg-[#DBD6C7] rounded w-[75px] p-1 text-sm font-semibold"
          type="submit">
          Confirm
        </button>
        <button
          onClick={props.onCancel}
          className="ring-1 ring-jll-gray bg-white box-border p-1 shadow-md rounded w-[75px] text-sm font-semibold"
          type="button">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MeterForm