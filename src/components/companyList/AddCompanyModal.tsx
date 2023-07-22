import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import PopupModal from '../PopupModal'
import SelectField from '../SelectField';
import TextField from '../TextField';
import cx from "classnames"
import * as Yup from "yup";
import { useTranslation } from "react-i18next"
import { useGetContents } from '../../hooks/content';
import { get, isEmpty } from 'lodash';
import { useGetAvailableLocations } from '../../hooks/company';


interface IProps {
  isVisible: boolean;
  loading?: boolean;
  closeModal: () => void;
  onConfirm: (values: any) => void;
}

const AddCompanyModal: FC<IProps> = (props) => {

  const {
    isVisible,
    closeModal,
    onConfirm,
  } = props;

  const { t } = useTranslation()
  const logoInputRef = useRef<HTMLInputElement>();
  const [attachments, setAttachments] = useState<Array<File>>([]);

  const getContents = useGetContents(1, 9999);
  const getLocations = useGetAvailableLocations();

  const translations = get(getContents, "data.data", []).filter((item) => item.category === "translation");
  const locations = get(getLocations, "data.data", []);

  const [validation, setValidation] = useState<{ [key: string]: any }>({
    companyName: Yup.string().required("Company name is required"),
    reportDate: Yup.string().required("Report date is required"),
    expiryDate: Yup.string().required("Expiry date is required"),
    language: Yup.string().required("Language is required"),
    location: Yup.string().required("Location is required"),
    defaultLanguage: Yup.string().required("Language is required"),
    submissionDeadline: Yup.string().required("Submission deadline is required"),
    companyPhone: Yup.string().required("Company phone is required"),
    name: Yup.string().required("Client admin name is required"),
    email: Yup.string()
      .required("Client admin email is required")
      .email(),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be atleast 6 characters")
  })

  const form = useFormik({
    initialValues: {
      reportDate: "",
      expiryDate: "",
      companyName: "",
      companyPhone: "",
      companyEmail: "",
      location: "",
      name: "",
      email: "",
      password: "",
      language: "", //language of client admin created
      defaultLanguage: "",
      submissionDeadline: "",
    },
    validationSchema: Yup.object().shape(validation),
    onSubmit: async (values, { setFieldError }) => {
      var regExp = /[a-zA-Z]/g;
      const dateField = ["reportDate", "expiryDate", "submissionDeadline"];

      let dateErrors = await new Promise<Array<string>>((res, rej) => {
        let errors = [];
        for (let date of dateField) {
          if (new Date(values[date]).toString() === "Invalid Date" || regExp.test(values[date])) {
            errors.push(date)
            setFieldError(date, "Invalid date. Should be (year-month-date) eg: 2022-01-31")
          }
        }
        res(errors)
      })

      if (dateErrors.length == 0) {
        onConfirm({
          ...values,
          logo: attachments[0]
        })
      }
    }
  });

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  function handleCloseModal() {
    closeModal();
    form.resetForm()
    setAttachments([])
  }

  function onLogoInputClick() {
    if (logoInputRef && logoInputRef.current) {
      logoInputRef.current.click()
    }
  }


  function handleFileChange(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    setAttachments([...attachments, ...files])
  }

  function removeAttachment(attachment: File) {
    const set = new Set([...attachments]);
    set.delete(attachment)

    setAttachments([...set])
  }

  useEffect(() => {
    if (!isVisible) {
      form.resetForm();
      setAttachments([])
    }
  }, [isVisible])

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={handleCloseModal}>

      <div
        data-cy="add-company-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t("Add Company")}
        </p>

        <form onSubmit={form.handleSubmit}>
          <p className="font-bold mb-1">{t("Company Information")}</p>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="companyName"
                label="Company Name"
                placeholder="Company Name"
                type="text"
                handleChange={form.handleChange}
                value={form.values.companyName}
                handleBlur={form.handleBlur}
                errorMessage={form.errors.companyName}
                error={getFormError("companyName")}
              />
            </div>
            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="reportDate"
                label="Financial Year Report Date"
                placeholder="eg: 2022-01-05"
                type="text"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.reportDate}
                errorMessage={form.errors.reportDate}
                error={getFormError("reportDate")}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="companyPhone"
                label="Company Contact Phone No."
                placeholder="Company Contact Phone No."
                type="text"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.companyPhone}
                errorMessage={form.errors.companyPhone}
                error={getFormError("companyPhone")}
              />
            </div>
            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="companyEmail"
                label="Company Email"
                placeholder="Company Email"
                type="email"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.companyEmail}
                errorMessage={form.errors.companyEmail}
                error={getFormError("companyEmail")}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="expiryDate"
                label="Expiry Date"
                placeholder="eg: 2022-01-05"
                type="text"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.expiryDate}
                errorMessage={form.errors.expiryDate}
                error={getFormError("expiryDate")}
              />
            </div>

            <div className="col-span-6">
              <TextField
                formik
                disabled={props.loading}
                name="submissionDeadline"
                label="Submission Deadline"
                placeholder="eg: 2022-01-05"
                type="text"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.submissionDeadline}
                errorMessage={form.errors.submissionDeadline}
                error={getFormError("submissionDeadline")}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <SelectField
                name="location"
                disabled={props.loading}
                placeholder="Select location"
                label="Location"
                onSelect={(val) => form.setFieldValue("location", val)}
                value={form.values.location}
                errorMessage={form.errors.location}
                error={getFormError("location")}
                options={
                  locations.map((t: string) => ({
                    label: t,
                    value: t
                  }))
                }
              />
            </div>
            <div className="col-span-6">
              <SelectField
                name="defaultLanguage"
                disabled={props.loading}
                placeholder="Select language"
                label="Language"
                onSelect={(val) => form.setFieldValue("defaultLanguage", val)}
                value={form.values.defaultLanguage}
                errorMessage={form.errors.defaultLanguage}
                error={getFormError("defaultLanguage")}
                options={
                  translations.map((t) => ({
                    label: t.title,
                    value: t._id
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <input
                hidden
                data-cy="logo-upload-input"
                onChange={handleFileChange}
                ref={logoInputRef}
                accept="image/*"
                type="file" />

              <p className="text-xs font-medium mb-1 text-jll-gray-dark">Logo</p>
              <button
                type="button"
                data-cy="logo-upload-btn"
                disabled={attachments.length > 0}
                onClick={onLogoInputClick}
                className={cx("px-3 h-[34px] disabled:bg-gray-100 disabled:cursor-not-allowed text-md text-left w-full border-[1px] border-jll-gray-dark rounded-md bg-white", {
                  "before:content-[*]": true,
                })}>
                <p className="text-jll-gray text-sm">Click to upload logo</p>
              </button>

              <div className="mt-2 flex flex-col gap-2">
                {attachments.length > 0 && attachments.map((attachment: File, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-1">
                    <button
                      onClick={() => removeAttachment(attachment)}
                      type="button"
                      className="rounded-full bg-jll-red-light p-[2px]">
                      <XMarkIcon className="w-3 h-3 text-white" />
                    </button>
                    <p className="text-sm">{attachment.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <>
            <p className="font-bold mb-1 mt-5">{t("Client Admin (Business Owner) Information")}</p>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6">
                <TextField
                  formik
                  disabled={props.loading}
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="text"
                  handleChange={form.handleChange}
                  handleBlur={form.handleBlur}
                  value={form.values.email}
                  errorMessage={form.errors.email}
                  error={getFormError("email")}
                />
              </div>
              <div className="col-span-6">
                <TextField
                  formik
                  disabled={props.loading}
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  handleChange={form.handleChange}
                  handleBlur={form.handleBlur}
                  value={form.values.password}
                  errorMessage={form.errors.password}
                  error={getFormError("password")}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-5 mt-2">
              <div className="col-span-6">
                <TextField
                  formik
                  disabled={props.loading}
                  name="name"
                  label="Name"
                  placeholder="Name"
                  type="text"
                  handleChange={form.handleChange}
                  handleBlur={form.handleBlur}
                  value={form.values.name}
                  errorMessage={form.errors.name}
                  error={getFormError("name")}
                />
              </div>
              <div className="col-span-6">
                <SelectField
                  name="language"
                  cy="add-company-language-select"
                  disabled={props.loading}
                  placeholder="Select language"
                  label="Language"
                  onSelect={(val) => form.setFieldValue("language", val)}
                  value={form.values.language}
                  errorMessage={form.errors.language}
                  error={getFormError("language")}
                  options={
                    translations.map((t) => ({
                      label: t.title,
                      value: t._id
                    }))
                  }
                />
              </div>
            </div>
          </>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              data-cy="create-company-btn"
              disabled={props.loading}
              type="submit"
              className="w-[85px] disabled:opacity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
              {t("Done")}
            </button>
            <button
              data-cy="close-company-modal-btn"
              type="button"
              onClick={handleCloseModal}
              className="w-[85px] py-1 bg-jll-gray">
              {t("Cancel")}
            </button>
          </div>

        </form>
      </div>
    </PopupModal>
  )
}

export default AddCompanyModal
