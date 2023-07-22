import { FC, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import PopupModal from '../PopupModal'
import TextField from '../TextField';
import { isEmpty } from 'lodash';

interface IProps {
  values: { [key: string]: any },
  isVisible: boolean;
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const UpdateUnitModal: FC<IProps> = (props) => {

  const {
    values,
    isVisible,
    closeModal,
    onConfirm
  } = props;

  const form = useFormik({
    initialValues: {
      id: "",
      inputUnit: "",
      outputUnit: "",
      rate: ""
    },
    onSubmit: (values, { setStatus }) => {
      onConfirm(values)
    }
  })

  useEffect(() => {
    if (!isEmpty(props.values)) {
      form.setValues({
        id: values.id,
        inputUnit: values.inputUnit,
        rate: values.rate,
        outputUnit: values.outputUnit,
      })
    }
  }, [props.values])

  if (!isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">Update Unit</p>

        <form onSubmit={form.handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6">
              <TextField
                formik
                name="inputUnit"
                label="Input Unit"
                placeholder="Input Unit"
                type="text"
                handleChange={form.handleChange}
                value={form.values.inputUnit}
                errorMessage={form.errors.inputUnit}
                error={Boolean(form.errors.inputUnit)}
              />
            </div>
            <div className="col-span-6">
              <TextField
                formik
                name="outputUnit"
                label="Output Unit"
                placeholder="Output Unit"
                type="text"
                handleChange={form.handleChange}
                value={form.values.outputUnit}
                errorMessage={form.errors.outputUnit}
                error={Boolean(form.errors.outputUnit)}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <TextField
                formik
                name="rate"
                label="Rate"
                placeholder="Rate"
                type="text"
                handleChange={form.handleChange}
                value={form.values.rate}
                errorMessage={form.errors.rate}
                error={Boolean(form.errors.rate)}
              />
            </div>
          </div>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              className="w-[85px] py-1 bg-jll-red hover:opacity-90 transition duration-100">
              Done
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-[85px] py-1 bg-jll-gray">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </PopupModal>
  )
}

export default UpdateUnitModal;