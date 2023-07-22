import { FC, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import PopupModal from '../PopupModal'
import TextField from '../TextField';
import { MODAL_MODE } from '../../types/modal';
import { useTranslation } from "react-i18next"
import * as Yup from "yup";

interface IProps {
  loading?: boolean;
  values: { [key: string]: any };
  mode?: MODAL_MODE;
  isVisible: boolean;
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const AddUnitModal: FC<IProps> = (props) => {

  const {
    isVisible,
    mode,
    values,
    loading,
    closeModal,
    onConfirm
  } = props;

  const { t } = useTranslation()
  const form = useFormik({
    initialValues: {
      id: "",
      inputUnit: "",
      outputUnit: "",
      rate: ""
    },
    validationSchema: Yup.object().shape({
      inputUnit: Yup.string().required("Input unit is required"),
      outputUnit: Yup.string().required("Output unit is required"),
      rate: Yup.string().required("Rate is required"),
    }),
    onSubmit: (values) => {
      onConfirm(values)
    }
  })

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  function handleCloseModal() {
    closeModal();
    form.resetForm()
  }

  useEffect(() => {
    if (mode === MODAL_MODE.edit) {
      form.setValues({
        id: values._id,
        inputUnit: values.input,
        outputUnit: values.output,
        rate: values.rate
      })
    } else {
      form.resetForm()
    }
  }, [mode, values, isVisible])

  if (!props.isVisible) return null;

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
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${mode === MODAL_MODE.edit ? "Update" : "Add"} Unit`)}
        </p>

        <form onSubmit={form.handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6">
              <TextField
                formik
                name="inputUnit"
                disabled={loading}
                label="Input Unit"
                placeholder="Input Unit"
                type="text"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.inputUnit}
                errorMessage={form.errors.inputUnit}
                error={getFormError("inputUnit")}
              />
            </div>
            <div className="col-span-6">
              <TextField
                formik
                name="outputUnit"
                label="Output Unit"
                placeholder="Output Unit"
                type="text"
                disabled={loading}
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.outputUnit}
                errorMessage={form.errors.outputUnit}
                error={getFormError("outputUnit")}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <TextField
                formik
                name="rate"
                disabled={loading}
                label="Rate"
                placeholder="Rate"
                type="number"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.rate}
                errorMessage={form.errors.rate}
                error={getFormError("rate")}
              />
            </div>
          </div>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              disabled={loading}
              className="w-[85px] disabled:oapcity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
              {t("Done")}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-[85px] py-1 bg-jll-gray">
              {t("Cancel")}
            </button>
          </div>

        </form>
      </div>
    </PopupModal>
  )
}

export default AddUnitModal