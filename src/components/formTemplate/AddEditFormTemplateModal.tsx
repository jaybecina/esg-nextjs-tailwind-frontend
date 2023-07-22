import { ChangeEvent, FC, useEffect, useState } from "react"
import { useGetMaterials, useGetMeterFormMaterials } from '../../hooks/material';
import { get } from 'lodash';
import { MODAL_MODE } from "../../types/modal";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Field, FieldArray, Formik, FormikProps, useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import { useGetFormTemplateData } from "../../hooks/formTemplate";
import * as Yup from "yup";
import slugify from "slugify";
import PopupModal from '../PopupModal'
import TextField from '../TextField';
import useDebounce from "../../helper/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ColumnType, ItemType, useProcessFormMaterials } from "../../helper/processFormMaterials";
import cx from "classnames"

const validation = {
  name: Yup.string().required("Template name is required"),
  uniqueId: Yup.string().required("Unique Id is required"),
}

type Props = {
  loading?: boolean;
  mode?: MODAL_MODE;
  isVisible: boolean;
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const AddEditFormTemplateModal: FC<Props> = (props) => {

  const { t } = useTranslation()
  const { loading, mode, isVisible, closeModal, onConfirm } = props;
  const form = useFormik({
    initialValues: {
      name: "",
      uniqueId: "",
      materials: []
    },
    validationSchema: Yup.object().shape(validation),
    onSubmit: (values) => {
      onConfirm(values)
    }
  })

  const {
    handleBlur,
    setFieldValue,
    handleChange,
    setValues,
    resetForm,
    handleSubmit,
    touched,
    errors,
    values,
  } = form;

  const [search, setSearch] = useState<string>('')
  const [params] = useSearchParams()
  const getFormTemplate = useGetFormTemplateData(params.get("form_template_id"), mode === MODAL_MODE.edit)

  const searchDebounce = useDebounce(search, 300)
  const getMaterials = useGetMaterials({ search: searchDebounce, options: { enabled: isVisible, } });
  const materials = get(getMaterials, "data.data", []);
  
  const getMaterialForms = useGetMeterFormMaterials(form.values.materials);
  const materialsData = get(getMaterialForms, "data", []);

  const { data, formState } = useProcessFormMaterials(materialsData)

  console.log({ data })
  
  function getFormError(field: string) {
    return Boolean(errors[field] && touched[field]);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    setFieldValue("name", value)
    setFieldValue("uniqueId", slugify(value, {
      replacement: "-",
      trim: true,
      remove: /[#^^{};<>=_,?*+~.()'"!:@]/g,
      lower: true
    }))
  }

  function handleMaterialSelect(e: ChangeEvent<HTMLInputElement>) {
    const { checked, dataset: { id } } = e.target;
    const set = new Set([...values.materials])

    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }

    setFieldValue("materials", [...set])
  }

  function handleOrderChange(e: any, id: string) {
    const order: number = parseInt(e.target.value);
    const arr = [...values.materials].filter((_id) => _id !== id);

    arr.splice(order, 0, id)
    setFieldValue("materials", arr)
  }

  useEffect(() => {
    if (getFormTemplate.isSuccess) {
      const data = get(getFormTemplate, "data.data", {});
      setValues({
        materials: data.materials,
        name: data.name,
        uniqueId: data.uniqueId
      })
    }
  }, [getFormTemplate.data])

  useEffect(() => {
    if (isVisible === false) {
      resetForm()
      setSearch('')
    }
  }, [isVisible])

  if (!isVisible) return <></>;

  function generateForm(form, values) {
    if (form.type === "matrix") {
      return (
        <FieldArray
          name="">
          {() => {
            const size = form.size;
            const rows = values[form.uniqueId];

            return (
              <section className="w-full">
                <div className="flex flex-col gap-2 overflow-x-scroll">
                  {rows && rows.map((({ columns, name }: ItemType, index1: number) => {

                    return (
                      <div
                        key={`${name}-${index1}`}
                        style={{ width: columns.length > 3 ? "100%" : "60%" }}
                        className="gap-2 flex items-center justify-start flex-nowrap">
                        <div className="w-[200px] flex-shrink-0 text-right whitespace-pre-wrap text-sm">
                          <p className={cx({ "mt-7": index1 === 0 })}>{t(name)}</p>
                        </div>
                        {columns.map((column: ColumnType, index2: number) => {
                          if (index1 + 1 === rows.length) {
                            return (
                              <>
                                <div className="flex flex-col flex-shrink-0 w-[150px]">
                                  <p className="text-sm mb-5">Column Sum:{" "} 
                                    <span className="font-bold">0</span>
                                  </p>

                                  <Field
                                    key={`${column.name}-${index2}`}
                                    disabled
                                    component="select"
                                    placeholder="Preview input"
                                    className={`flex-shrink-0 max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed pl-2 py-[2px] text-md w-full border border-jll-gray-dark rounded bg-white`}>
                                    <option value="N/A">N/A</option>
                                  </Field>
                                </div> 
                             </>
                            )
                          } else {
                            return (
                              <div
                                className="flex-shrink-0 max-w-[150px]"
                                key={`${column.name}-${index2}`}>
                                  {index1 === 0 ? (
                                    <div 
                                      title={t(column.name)}
                                      className="mb-3">
                                    <p className="mb-2 cursor-pointer text-sm truncate">{t(column.name)}</p>
                                    </div>
                                  ) : null}
                                <Field
                                  disabled
                                  component="input"
                                  value="Preview input"
                                  placeholder="Preview input"
                                  type={column.inputType}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed border border-jll-gray-dark py-1 text-sm placeholder:text-sm rounded px-2 w-full"
                                />
                              </div>
                            )
                          }
                        })}
                      </div>
                    )
                  }))}
                </div>
              </section>
            )
          }
          }
        </FieldArray >
      )
    }

    if (form.type === "text") {
      return (
        <FieldArray
          name="">
          {() => {
            return (
              <section className="w-[50%]">
                {values[form.uniqueId] && values[form.uniqueId].map((item, index) => {
                  return (
                    <div key={index}>
                      <p className="mb-1 text-sm">{t(item.question)}</p>
                      <Field
                        as="textarea"
                        disabled
                        value="Preview input"
                        placeholder="Preview input"
                        className="disabled:opacity-50 disabled:cursor-not-allowed border placeholder:text-sm py-1 border-jll-gray-dark rounded px-2 w-full"
                        name=""
                        rows={1} />
                    </div>
                  )
                })}
              </section>
            )
          }}
        </FieldArray>
      )
    }
  }

  return (
    <section>
      <PopupModal
        position="center"
        isVisible={isVisible}
        onClose={closeModal}>
        <div className="relative p-5 rounded-lg border shadow-lg bg-white w-full h-[700px] lg:w-[1280px]">
          <button
            onClick={closeModal}
            className="absolute right-4 top-2"
            type="button">
            <XMarkIcon className="w-5 h-6" />
          </button>
          <p className="text-center font-semibold text-3xl mb-5">
            {t(`${mode === MODAL_MODE.edit ? "Update" : "Create"} Form Template`)}
          </p>

          <div className="grid grid-cols-12 gap-x-5">
            <div className="col-span-12 lg:col-span-5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="name"
                      disabled={loading || getFormTemplate.isLoading}
                      label="Form Template Name"
                      placeholder="Form template name"
                      type="text"
                      handleChange={handleNameChange}
                      handleBlur={handleBlur}
                      value={values.name}
                      errorMessage={errors.name}
                      error={getFormError("name")}
                    />
                  </div>
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="name"
                      readonly
                      disabled={loading || getFormTemplate.isLoading}
                      label="Form Template Unique Id"
                      placeholder="Form template unique id"
                      type="text"
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      value={values.uniqueId}
                      errorMessage={errors.uniqueId}
                      error={getFormError("uniqueId")}
                    />
                  </div>
                  <div className="col-span-6">
                    <div className="relative">
                      <TextField
                        // disabled={loading || getFormTemplate.isLoading}
                        label="Search Material"
                        placeholder="Search material"
                        type="text"
                        onChange={setSearch}
                        value={search}
                      />
                      <button 
                        disabled={!search}
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-[1.6rem] disabled:opacity-50 transition duration-150 hover:text-gray-500"
                        type="button">
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                </div>

                {(mode === MODAL_MODE.edit && getFormTemplate.isLoading) || getMaterials.isLoading ? (
                  <p className="my-3">Loading...</p>
                ) : (
                  <section className="mt-[1rem] h-[420px] overflow-y-scroll">
                    <p className="text-xs font-medium text-jll-gray-dark">{t("Materials")}</p>
                    {materials.map((mat: any) => (
                      <div
                        key={mat._id}
                        className="flex items-center justify-start gap-2">
                        <input
                          checked={values.materials.includes(mat._id)}
                          onChange={handleMaterialSelect}
                          data-id={mat._id}
                          type="checkbox" />
                        {values.materials.includes(mat._id) ? (
                          <select
                            name="order"
                            value={values.materials.indexOf(mat._id)}
                            onChange={(e) => handleOrderChange(e, mat._id)}
                            className="border rounded-md border-jll-gray-dark pl-2 text-sm text-jll-gray-dark w-[42px]">
                            {[...Array(values.materials.length).keys()].map((order) => {
                              return <option
                                key={order}
                                value={order}>{order + 1}</option>
                            })}
                          </select>
                        ) : null}
                        <p>{mat.name}</p>
                      </div>
                    ))}
                  </section>
                )}

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

            <div className="col-span-12 lg:col-span-7">
              <p className="mb-2 font-bold">Preview:</p>
              <Formik
                enableReinitialize
                onSubmit={() => {}}
                validationSchema={Yup.object().shape(validation)}
                initialValues={{}}>
                {() => {
                  return (
                    <div className="border rounded max-h-[560px] overflow-y-scroll">
                      {data && getMaterialForms.isLoading && (
                        <div className="h-[580px] bg-gray-50 flex justify-center items-center flex-col">
                          <p className="font-bold text-lg">Generating Preview...</p>
                        </div>
                      )}

                      {data && data.length === 0 && getMaterialForms.isIdle && (
                        <div className="h-[560px] bg-gray-50 flex justify-center items-center flex-col">
                          <p className="font-bold text-lg">Select materials to preview</p>
                        </div>
                      )}

                      <div className="p-2">
                        {data && data.length > 0 && getMaterialForms.isSuccess && data.map((form, index) => {
                          return (
                            <div key={index}>
                              <p className="font-bold mb-2">{form.name}</p>
                              {generateForm(form, formState)}
                            </div>
                          )
                        })}
                      </div>
                    </div>   
                  ) 
                }}
              </Formik>
            </div>
          </div>

        </div>
      </PopupModal>
    </section>
  )
}

export default AddEditFormTemplateModal;