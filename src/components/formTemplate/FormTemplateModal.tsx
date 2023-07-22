import { ChangeEvent, FC, useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrayHelpers, ErrorMessage, Field, FieldArray, Form, Formik, FormikProps, useFormik } from 'formik';
import PopupModal from '../PopupModal'
import TextField from '../TextField';
import { MODAL_MODE } from '../../types/modal';
import { useTranslation } from "react-i18next"
import * as Yup from "yup";
import slugify from "slugify";
import { useGetMaterials } from '../../hooks/material';
import { get } from 'lodash';
import MaterialOptionList from './MaterialOptionList';

interface IProps {
  loading?: boolean;
  values: { [key: string]: any };
  mode?: MODAL_MODE;
  isVisible: boolean;
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const validation = {
  name: Yup.string().required("Template name is required"),
  uniqueId: Yup.string().required("Unique Id is required"),
}

const FormTemplateModal: FC<IProps> = (props) => {

  const {
    isVisible,
    mode,
    values,
    loading,
    closeModal,
    onConfirm
  } = props;

  const { t } = useTranslation()
  const getMaterials = useGetMaterials({
    page: 1,
    limit: 9999,
    options: {
      enabled: isVisible
    }
  });

  const [initialValues, setInitialValues] = useState<any>({
    id: "",
    name: "",
    uniqueId: "",
    materials: []
  })

  function handleFormSubmit(values: any) {
    onConfirm(values)
  }

  useEffect(() => {
    const materials = get(getMaterials, "data.data", []);

    if (mode === MODAL_MODE.edit) {
      setInitialValues({
        id: values._id,
        name: values.name,
        uniqueId: values.uniqueId,
        materials: materials.map((m, index: number) => ({
          ...m,
          order: (values.materials.indexOf(m._id) + 1).toString(),
          checked: values.materials.includes(m._id)
        }))
      })
      return
    }

    if (mode === MODAL_MODE.create) {
      const arr = [];

      for (let m of materials) {
        arr.push({ ...m, order: 0, checked: false })
      }

      setInitialValues({
        id: "",
        name: "",
        uniqueId: "",
        materials: arr
      })
    }

  }, [mode, values, isVisible, getMaterials.data])

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
          {t(`${mode === MODAL_MODE.edit ? "Update" : "Create"} Form Template`)}
        </p>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape(validation)}
          onSubmit={handleFormSubmit}>
          {({ errors, touched, setFieldValue, handleBlur, handleChange, values }: FormikProps<any>) => {

            const checked = values.materials.filter((m) => m.checked);

            function getFormError(field: string) {
              return Boolean(errors[field] && touched[field]);
            }

            return (
              <Form>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <TextField
                      formik
                      name="name"
                      disabled={loading}
                      label="Form Template Name"
                      placeholder="Form template name"
                      type="text"
                      handleChange={(e) => {
                        setFieldValue("name", e.target.value)
                        setFieldValue("uniqueId", slugify(e.target.value, {
                          replacement: "-",
                          trim: true,
                          remove: /[#^^{};<>=_,?*+~.()'"!:@]/g,
                          lower: true
                        }))
                      }}
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
                      disabled={loading}
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
                </div>

                <MaterialOptionList
                  loading={loading}
                  checked={checked} />

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
              </Form>
            )
          }}
        </Formik>
      </div>
    </PopupModal>
  )
}

export default FormTemplateModal