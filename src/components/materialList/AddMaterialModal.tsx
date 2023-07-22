import { FC, useEffect, useState } from 'react'
import { Formik, Form, FormikProps } from 'formik';
import PopupModal from '../PopupModal'
import SelectField from '../SelectField';
import { XMarkIcon } from '@heroicons/react/24/solid'
import TextField from '../TextField';
import { useTranslation } from "react-i18next"
import * as Yup from "yup";
import { MODAL_MODE } from '../../types/modal';
import MaterialFormMatrix from './MaterialFormMatrix';
import MaterialFormQnA from './MaterialFormQnA';
import slugify from "slugify";
import MaterialCalculationForm from './MaterialCalculationForm';

export type MaterialModalInitStateType = {
  id: string,
  name: string,
  uniqueId: string,
  type: string,
  size: string,
  rows: [{ name: string }],
  columns: [{ name: string, inputType: string, outputUnit: string }],
  qnaRows: [{ question: string, hints: string }],
  expression: any[]
}
interface IProps {
  isVisible: boolean;
  mode?: "create" | "edit" | MODAL_MODE;
  loading?: boolean;
  values?: { [key: string]: any },
  closeModal: () => void;
  onConfirm: (values: any) => void;
}

const defaultValidation = {
  name: Yup.string().required("Material name is required"),
  uniqueId: Yup.string().required("Material unique id is required"),
  type: Yup.string().required("Material type is required"),
  size: Yup.string().required("Material size is required"),
}

const initState: MaterialModalInitStateType = {
  id: "",
  name: "",
  uniqueId: "",
  type: "",
  size: "1",
  rows: [{ name: "" }],
  columns: [{ name: "", inputType: "", outputUnit: "" }],
  qnaRows: [{ question: "", hints: "" }],
  expression: []
}

const AddMaterialModal: FC<IProps> = (props) => {
  const {
    isVisible,
    closeModal,
    onConfirm,
    values,
    mode
  } = props;

  const { t } = useTranslation()
  const [validation, setValidation] = useState<any>(defaultValidation)
  const [initialValues, setInitialValues] = useState<any>(initState)

  function applyMatrixValidation() {
    setValidation(Object.assign({}, defaultValidation, {
      rows: Yup.array().of(Yup.object().shape({
        name: Yup.string().required("Row is required")
      })),
      columns: Yup.array().of(Yup.object().shape({
        name: Yup.string().required("Column name is required"),
        inputType: Yup.string().required("Type is required"),
        outputUnit: Yup.string().required("Unit is required")
      }))
    }))
  }

  function applyTextQnAValidation() {
    setValidation(Object.assign({}, defaultValidation, {
      qnaRows: Yup.array().of(Yup.object().shape({
        question: Yup.string().required("Question is required"),
        hints: Yup.string().required("Hints is required")
      }))
    }))
  }

  function handleFormSubmit(values: any) {
    const payload = values;

    if (payload.type === "matrix") {
      delete payload.qnaRows;

    } else {
      delete payload.rows;
      delete payload.columns;
    }

    onConfirm(payload)
  }

  useEffect(() => {
    if (mode === MODAL_MODE.edit && values) {
      const data: { [key: string]: any } = {
        id: props.values._id,
        name: props.values.name,
        type: props.values.type,
        uniqueId: props.values.uniqueId,
        size: props.values.size,
      }

      if (props.values.type === "text") {
        data.qnaRows = props.values.content
      }

      if (props.values.type === "matrix") {
        data.columns = props.values.content[0].columns
        data.rows = props.values.content[0].rows
      }

      setInitialValues(data)
    } else {
      setInitialValues(initState)
    }
  }, [mode, values, isVisible])

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div
        data-cy="add-material-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[720px] transition ease-in-out duration-150">
        <button
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${mode === MODAL_MODE.create ? "Create" : "Update"} Material`)}
        </p>

        <Formik
          enableReinitialize
          validationSchema={Yup.object().shape(validation)}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}>
          {({ values, setFieldValue, touched, handleChange, errors, setErrors }: FormikProps<any>) => {

            function getFormError(field: string) {
              return errors[field] && touched[field];
            }

            function getErrorMessage(field: string): string {
              let message: string = "";

              if (errors[field])
                message = errors[field].toString()

              return message
            }

            function handleOnTypeChange(val: string) {
              if (val === "matrix") {
                applyMatrixValidation();
              } else if (val === "text") {
                applyTextQnAValidation();
              }

              if (values.type) {
                const agreed = window.confirm("Are you sure you want to switch type? Inputted data will be lost.")
                if (agreed) {
                  setFieldValue("rows", [{ name: "" }])
                  setFieldValue("columns", [{ name: "", inputType: "", outputUnit: "" }])
                  setFieldValue("qnaRows", [{ question: "", hints: "" }])
                  setErrors({
                    rows: {},
                    columns: {},
                    qnaRows: {}
                  })
                }
              }

              setFieldValue("type", val);
            }

            function handleNameChange(val) {
              setFieldValue("name", val)
              setFieldValue("uniqueId", slugify(val, {
                replacement: "-",
                remove: /[#^^{};<>=_,?*+~.()'"!:@]/g,
                lower: true
              }))
            }

            return (
              <Form className="mt-[3rem]">
                <section>
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-6">
                      <TextField
                        formik
                        name="name"
                        label="Name"
                        disabled={props.loading}
                        placeholder="Material Name"
                        type="text"
                        handleChange={(e: any) => handleNameChange(e.target.value)}
                        value={values.name}
                        errorMessage={getErrorMessage("name")}
                        error={Boolean(getFormError("name"))}
                      />
                    </div>
                    <div className="col-span-6">
                      <TextField
                        formik
                        name="uniqueId"
                        readonly
                        disabled={props.loading}
                        label="Material Unique Id"
                        placeholder="Material Unique Id"
                        type="text"
                        handleChange={handleChange}
                        value={values.uniqueId}
                        errorMessage={getErrorMessage("uniqueId")}
                        error={Boolean(getFormError("uniqueId"))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-5 mt-2">
                    <div className="col-span-6">
                      <SelectField
                        name="type"
                        cy="material-type-select"
                        placeholder="Type"
                        label="Type"
                        disabled={props.loading}
                        onSelect={(val) => handleOnTypeChange(val)}
                        value={values.type}
                        errorMessage={getErrorMessage("type")}
                        error={Boolean(getFormError("type"))}
                        options={[
                          { label: "Text - Q&A", value: "text" },
                          { label: "Matrix", value: "matrix" },
                          // { label: "Calculation", value: "calculation" }
                        ]}
                      />
                    </div>
                    {/* <div className="col-span-6">
                      <SelectField
                        name="size"
                        placeholder="Size"
                        label="Size"
                        disabled={props.loading}
                        onSelect={(val) => setFieldValue("size", val)}
                        value={values.size}
                        errorMessage={getErrorMessage("size")}
                        error={Boolean(getFormError("size"))}
                        options={[...Array(12).keys()].map((item) => (
                          { label: (item + 1).toString(), value: item + 1 }
                        ))}
                      />
                    </div> */}
                  </div>
                </section>

                {values.type === "matrix"
                  ? <MaterialFormMatrix />
                  : values.type === "calculation"
                    ? <MaterialCalculationForm />
                    : <MaterialFormQnA />
                }

                <div className="flex items-center justify-center gap-5 mt-10 text-white font-medium">
                  <button
                    type="submit"
                    disabled={props.loading}
                    className="w-[85px] py-1 disabled:cursor-progress disabled:opacity-50 bg-jll-red hover:opacity-90 transition duration-100">
                    {t("Done")}
                  </button>
                  <button
                    type="button"
                    data-cy="material-close-btn"
                    onClick={closeModal}
                    className="w-[85px] py-1 bg-jll-gray">
                    {t("Cancel")}
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </PopupModal>
  )
}

export default AddMaterialModal