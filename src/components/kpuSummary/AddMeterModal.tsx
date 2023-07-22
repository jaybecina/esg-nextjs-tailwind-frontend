import { useFormik } from 'formik';
import React, { FC, useEffect } from 'react'
import PopupModal from '../PopupModal';
import TextField from '../TextField';
import * as Yup from "yup";
import { MODAL_MODE } from '../../types/modal';

interface IProps {
  isVisible: boolean;
  loading?: boolean;
  values?: { [key: string]: any }
  mode: MODAL_MODE;
  closeModal: () => void;
  onSubmit: (values: any) => void;
}

const AddMeterModal: FC<IProps> = (props) => {

  const {
    isVisible,
    loading,
    values,
    mode,
    closeModal,
    onSubmit
  } = props;

  const form = useFormik({
    initialValues: {
      id: "",
      name: ""
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required")
    }),
    onSubmit: (values) => {
      onSubmit(values)
    }
  })

  useEffect(() => {
    if (mode === MODAL_MODE.edit) {
      form.setValues({
        id: values.id,
        name: values.name
      })
    } else {
      form.resetForm()
    }
  }, [mode, values, isVisible])

  if (!isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>
      <form
        data-cy="add-meter-modal"
        onSubmit={form.handleSubmit}
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[600px]">
        <p className="text-center text-3xl">
          {mode === MODAL_MODE.create ? "Add" : "Update"} Meter
        </p>
        <div className="grid grid-cols-12">
          <div className="col-span-6">
            <TextField
              formik
              name="name"
              label="Name"
              disabled={loading}
              placeholder="Name"
              type="text"
              handleBlur={form.handleBlur}
              handleChange={form.handleChange}
              value={form.values.name}
              errorMessage={form.errors.name}
              error={Boolean(form.errors.name)}
            />
          </div>
        </div>
        <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
          <button
            disabled={loading}
            type="submit"
            className="w-[85px] disabled:opacity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
            Done
          </button>
          <button
            data-cy="cancel-meter-btn"
            type="button"
            onClick={props.closeModal}
            className="w-[85px] py-1 bg-jll-gray">
            Cancel
          </button>
        </div>
      </form>
    </PopupModal>
  )
}

export default AddMeterModal