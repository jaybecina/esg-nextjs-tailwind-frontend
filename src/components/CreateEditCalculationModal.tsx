import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MODAL_MODE } from "../types/modal";
import { Form, Formik } from "formik";
import PopupModal from "./PopupModal"
import slugify from "slugify";
import TextField from "./TextField";
import SelectField from "./SelectField";
import MaterialCalculationForm from "./materialList/MaterialCalculationForm";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export type CalculationFormType = {
  name: string,
  uniqueId: string,
  unit: string,
  type: string,
  expression: any[]
}

const defaultValidation = {
  name: Yup.string().required("Calculation name is required"),
  uniqueId: Yup.string().required("Calculation unique id is required"),
  type: Yup.string().required("Calculation type is required"),
}

interface IProps {
  isVisible: boolean;
  mode: MODAL_MODE,
  loading?: boolean;
  closeModal: () => void;
  onConfirm: (values: any) => void;
}

const CreateEditCalculationModal: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const navigate = useNavigate();
  const { isVisible, closeModal, mode, onConfirm, loading } = props;

  const [initialValues, setInitialValues] = useState<CalculationFormType>({
    name: "",
    uniqueId: "",
    unit: "",
    type: "calculation",
    expression: []
  })

  function handleFormSubmit(values: any) {
    onConfirm(values)
  }

  useEffect(() => {
    if (isVisible === false) {
      navigate({
        pathname: window.location.pathname,
        search: ""
      })
    }
  }, [isVisible])

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div
        data-cy="add-material-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[720px] transition ease-in-out duration-150 max-h-[700px] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${mode === MODAL_MODE.create ? "Create" : "Update"} Calculation`)}
        </p>
        <Formik
          enableReinitialize
          validationSchema={Yup.object().shape(defaultValidation)}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}>
          {({ values, setFieldValue, errors, touched, handleChange, handleBlur }) => {

            function handleNameChange(val) {
              setFieldValue("name", val)
              setFieldValue("uniqueId", slugify(val, {
                replacement: "-",
                remove: /[#^^{};<>=_,?*+~.()'"!:@]/g,
                lower: true
              }))
            }

            function getFormError(field: string) {
              return errors[field] && touched[field];
            }

            function getErrorMessage(field: string): string {
              let message: string = "";

              if (errors[field])
                message = errors[field].toString()

              return message
            }

            return (
              <Form>
                <section>
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-6">
                      <TextField
                        formik
                        name="name"
                        label="Calculation Name"
                        disabled={props.loading}
                        placeholder="Calculation Name"
                        type="text"
                        handleChange={(e: any) => handleNameChange(e.target.value)}
                        value={values.name}
                        handleBlur={handleBlur}
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
                        label="Calculation Unique Id"
                        placeholder="Calculation Unique Id"
                        type="text"
                        value={values.uniqueId}
                        handleBlur={handleBlur}
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
                        label="Category"
                        disabled={props.loading}
                        onSelect={(val) => setFieldValue("type", val)}
                        value={values.type}
                        errorMessage={getErrorMessage("type")}
                        error={Boolean(getFormError("type"))}
                        options={[
                          { label: "Calculation", value: "calculation" }
                        ]}
                      />
                    </div>
                    <div className="col-span-6">
                      <TextField
                        formik
                        name="unit"
                        disabled={props.loading}
                        label="Unit"
                        placeholder="Unit"
                        type="text"
                        value={values.unit}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        errorMessage={getErrorMessage("unit")}
                        error={Boolean(getFormError("unit"))}
                      />
                    </div>
                  </div>
                </section>

                <MaterialCalculationForm />

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

export default CreateEditCalculationModal;