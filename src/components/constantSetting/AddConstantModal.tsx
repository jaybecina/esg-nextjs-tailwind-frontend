import React, { FC, useEffect, useState } from 'react'
import { MODAL_MODE } from '../../types/modal'
import PopupModal from '../PopupModal'
import { useTranslation } from "react-i18next"
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FieldArray, Form, Formik, FormikProps, getIn, setIn } from 'formik';
import * as Yup from "yup";
import TextField from '../TextField';
import cx from "classnames"
import SelectField from '../SelectField';
import { get, isNil } from 'lodash';
import { useGetAvailableLocations } from '../../hooks/company';

interface IProps {
  mode: MODAL_MODE;
  values: { [key: string]: any };
  isVisible: boolean;
  loading?: boolean;
  onConfirm: (values: any) => void;
  closeModal: (modal?: string) => void;
}

interface IConstantContent {
  location: string;
  value: string;
}

interface IFormValues {
  name: string;
  year: string;
  unit: string;
  content: Array<IConstantContent>
}

const validationSchema = {
  name: Yup.string().required("Name is required"),
  year: Yup.string()
    .required("Year is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Year should be 4 characters only")
    .max(4, "Year should be 4 characters only"),
  content: Yup.array().of(Yup.object().shape({
    location: Yup.string().required("Location is required"),
    value: Yup.string().required("Value is required")
  }))
}

const AddConstantModal: FC<IProps> = (props) => {

  const { isVisible, closeModal, mode, onConfirm, values } = props;
  const { t } = useTranslation()

  const getLocations = useGetAvailableLocations();
  const locations = get(getLocations, "data.data", []);

  const [initialValues, setInitialValues] = useState<IFormValues>({
    name: "",
    year: "",
    unit: "",
    content: [
      { location: "", value: "" }
    ]
  })

  function resetForm() {
    setInitialValues({
      name: "",
      year: "",
      unit: "",
      content: [
        { location: "", value: "" }
      ]
    })
  }

  useEffect(() => {
    if (mode === MODAL_MODE.edit && values) {
      setInitialValues({
        name: values.name,
        year: values.year,
        unit: values.unit,
        content: values.meta
      })
    } else {
      resetForm()
    }
  }, [mode, values, isVisible])

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <main
        data-cy="add-material-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[720px] transition ease-in-out duration-150">
        <button
          onClick={() => closeModal()}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${mode === MODAL_MODE.create ? "Add" : "Update"} Constant`)}
        </p>

        <Formik
          enableReinitialize
          validationSchema={Yup.object().shape(validationSchema)}
          initialValues={initialValues}
          onSubmit={onConfirm}
          render={({ values, handleBlur, touched, handleChange, setFieldValue, errors }: FormikProps<any>) => {

            function getErrorMessage(field: string, index?: number): string {
              let message: string;
              const error = getIn(errors, !isNil(index) ? `content.${index}.${field}` : `${field}`, "");
              const touch = getIn(touched, !isNil(index) ? `content.${index}.${field}` : `${field}`, "");

              message = error;

              return error && touch ? message : undefined;
            }

            function getFormError(field: string, index?: number): boolean {
              const error = getIn(errors, !isNil(index) ? `content.${index}.${field}` : `${field}`, "");
              const touch = getIn(touched, !isNil(index) ? `content.${index}.${field}` : `${field}`, "");

              return error && touch ? true : false
            }

            return (
              <Form>
                <div className="grid grid-cols-12 gap-x-5 gap-y-2">
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="name"
                      label="Name"
                      disabled={props.loading}
                      placeholder="Constant setting name"
                      type="text"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.name}
                      errorMessage={getErrorMessage("name")}
                      error={getFormError("name")}
                    />
                  </div>
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="year"
                      disabled={props.loading}
                      label="Year"
                      placeholder="Year"
                      type="text"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.year}
                      errorMessage={getErrorMessage("year")}
                      error={getFormError("year")}
                    />
                  </div>
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="unit"
                      disabled={props.loading}
                      label="Unit"
                      placeholder="unit"
                      type="text"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      value={values.unit}
                      errorMessage={getErrorMessage("unit")}
                      error={getFormError("unit")}
                    />
                  </div>
                </div>


                <FieldArray
                  name="content"
                  render={arrayHelpers => {

                    return (
                      <section className="mt-5">

                        <div className="flex flex-col gap-y-2">
                          {values?.content?.map((row: IConstantContent, index: number) => {
                            const isFirst = index === 0;
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2">
                                <div className="flex-grow">
                                  <SelectField
                                    name="location"
                                    disabled={props.loading}
                                    placeholder="Select location"
                                    label={isFirst ? "Location" : ""}
                                    onSelect={(val) => setFieldValue(`content.${index}.location`, val)}
                                    value={values.content[index].location}
                                    errorMessage={getErrorMessage("location", index)}
                                    error={getFormError("location")}
                                    options={
                                      locations.map((t: string) => ({
                                        label: t,
                                        value: t
                                      }))
                                    }
                                  />
                                </div>
                                <div className="flex-grow">
                                  <TextField
                                    formik
                                    name={`content.${index}.value`}
                                    disabled={props.loading}
                                    label={isFirst ? "Value" : ""}
                                    placeholder="Value"
                                    type="number"
                                    value={values.content[index].value}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    errorMessage={getErrorMessage("value", index)}
                                    error={getFormError("value", index)}
                                  />
                                </div>
                                <button
                                  disabled={props.loading}
                                  className={cx("disabled:opacity-50 disabled:cursor-not-allowed", { "mt-[1rem]": isFirst })}
                                  onClick={() => arrayHelpers.remove(index)}
                                  type="button">
                                  <XMarkIcon className="h-4 w-4 text-jll-gray-dark" />
                                </button>
                              </div>
                            )
                          })}
                        </div>


                        <div className="flex items-center justify-center">
                          <button
                            disabled={props.loading}
                            type="button"
                            onClick={() => arrayHelpers.insert(values.content.length + 1, { location: "", value: "" })}
                            className="disabled:opacity-60 disabled:cursor-not-allowed flex items-center flex-grow justify-center gap-1 text-jll-red w-full mt-3">
                            <PlusIcon className="w-5 h-5" />
                            <p className="font-semibold">Add Columns</p>
                          </button>
                        </div>
                      </section>
                    )
                  }} />

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
                    onClick={() => closeModal()}
                    className="w-[85px] py-1 bg-jll-gray">
                    {t("Cancel")}
                  </button>
                </div>

              </Form>
            )
          }} />

      </main>

    </PopupModal>
  )
}

export default AddConstantModal