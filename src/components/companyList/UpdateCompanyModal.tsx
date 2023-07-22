import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import cx from "classnames"
import PopupModal from '../PopupModal'
import SelectField from '../SelectField';
import TextField from '../TextField';
import * as Yup from "yup";
import { get, isEmpty } from 'lodash';
import { useGetUserList } from '../../hooks/auth';
import { useTranslation } from "react-i18next"
import { useGetContents } from '../../hooks/content';
import { ROLES } from '../AccessControl';
import { useGetAvailableLocations } from '../../hooks/company';

const validation = {
  admin: Yup.string().required("Client admin is required"),
  companyName: Yup.string().required("Company name is required"),
  reportDate: Yup.string().required("Report date is required"),
  expiryDate: Yup.string().required("Expiry date is required"),
  defaultLanguage: Yup.string().required("Language is required"),
  submissionDeadline: Yup.string().required("Submission deadline is required"),
  companyPhone: Yup.string().required("Company phone is required"),
}
interface IProps {
  isVisible: boolean;
  loading?: boolean;
  values?: { [key: string]: any };
  closeModal: () => void;
  onConfirm: (values: any) => void;
}

const UpdateCompanyModal: FC<IProps> = (props) => {

  const {
    isVisible,
    closeModal,
    onConfirm,
    values
  } = props;

  const { t } = useTranslation()
  const logoInputRef = useRef<HTMLInputElement>();
  const [attachments, setAttachments] = useState<Array<File | { name: string }>>([]);
  const [users, setUsers] = useState<Array<any>>([]);

  const getLocations = useGetAvailableLocations();
  const getContents = useGetContents(1, 9999);

  const locations = get(getLocations, "data.data", []);
  const translations = get(getContents, "data.data", []).filter((item) => item.category === "translation");


  const getUserList = useGetUserList({
    page: 1,
    limit: 9999,
    enabled: !isEmpty(values)
  });

  useEffect(() => {
    const companyId: string = values._id;
    const userList = get(getUserList, "data.data", []);
    const clientAdmins = userList.filter((user) => user.role === ROLES.ClientAdmin);

    const data = clientAdmins.filter((user: any) => user.company?._id === companyId)
    setUsers(data);

  }, [getUserList.data, values])

  const form = useFormik({
    initialValues: {
      id: "",
      reportDate: "",
      expiryDate: "",
      defaultLanguage: "",
      companyName: "",
      companyPhone: "",
      companyEmail: "",
      admin: "",
      submissionDeadline: "",
      location: ""
    },
    validationSchema: Yup.object().shape(validation),
    onSubmit: (values, { setFieldError }) => {
      var regExp = /[a-zA-Z]/g;

      if (new Date(values.reportDate).toString() === "Invalid Date" || regExp.test(values.reportDate)) {
        setFieldError("reportDate", "Invalid date. Should be (year-month-date) eg: 2022-01-31")
        return;
      }

      if (new Date(values.expiryDate).toString() === "Invalid Date" || regExp.test(values.expiryDate)) {
        setFieldError("expiryDate", "Invalid date. Should be (year-month-date) eg: 2022-01-31")
        return;
      }

      if (new Date(values.submissionDeadline).toString() === "Invalid Date" || regExp.test(values.submissionDeadline)) {
        setFieldError("submissionDeadline", "Invalid date. Should be (year-month-date) eg: 2022-01-31")
        return;
      }

      onConfirm({
        ...values,
        logo: attachments[0]
      })
    }
  });

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  function handleCloseModal() {
    closeModal();
    form.resetForm()
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
    if (!isEmpty(values) && isVisible) {
      form.setValues({
        id: get(values, "_id", ""),
        admin: get(values, "admin._id", ""),
        companyEmail: get(values, "email", ""),
        companyName: get(values, "name", ""),
        companyPhone: get(values, "phone", ""),
        reportDate: get(values, "yearEnd", ""),
        expiryDate: get(values, "expiryDate", ""),
        submissionDeadline: get(values, "submissionDeadline", ""),
        defaultLanguage: get(values, "defaultLanguage._id", ""),
        location: get(values, "location", "")
      })

      if (values.logo) {
        setAttachments([values.logo])
      }
    }

    if (!isVisible) {
      form.resetForm()
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
        data-cy="update-company-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          data-cy="close-update-company-btn"
          onClick={handleCloseModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t("Update Company")}
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
                disabled={true}
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
                name="defaultLanguage"
                cy="add-company-language-select"
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

            <div className="col-span-6">
              <SelectField
                raw
                cy="update-company-client-admin-select"
                disabled={props.loading || getUserList.isLoading || getUserList.isFetching}
                name="admin"
                placeholder="Client Admin (Business Owner)"
                label="Client Admin (Business Owner)"
                onSelect={(val) => form.setFieldValue("admin", val)}
                value={form.values.admin}
                errorMessage={form.errors.admin}
                error={getFormError("admin")}
                options={users.map((user) => ({
                  label: user.name,
                  value: user._id
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <input
                hidden
                onChange={handleFileChange}
                data-cy="upload-logo-input"
                ref={logoInputRef}
                accept="image/*"
                type="file" />

              <p className="text-xs font-medium mb-1 text-jll-gray-dark">Logo</p>
              <button
                type="button"
                disabled={attachments.length > 0}
                data-cy="upload-logo-btn"
                onClick={onLogoInputClick}
                className={cx("px-3 py-1 h-[34px] disabled:bg-gray-100 disabled:cursor-not-allowed text-md text-left w-full border-[1px] border-jll-gray-dark rounded-md bg-white", {
                  "before:content-[*]": true,
                })}>
                <p className="text-jll-gray text-sm">Click to upload logo</p>
              </button>

              <div className="mt-1 flex flex-col gap-2">
                {attachments.length > 0 && attachments.map((attachment: File, index: number) => (
                  <div
                    key={index}
                    data-cy="company-icon"
                    className="flex items-center gap-1 mb-2">
                    <button
                      onClick={() => removeAttachment(attachment)}
                      data-cy="remove-attachment-btn"
                      type="button"
                      className="rounded-full bg-jll-red-light p-[2px]">
                      <XMarkIcon className="w-3 h-3 text-white" />
                    </button>
                    <p className="text-sm">{attachment?.name}</p>
                  </div>
                ))}
              </div>
            </div>
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
          </div>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              data-cy="submit-update-company-btn"
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

export default UpdateCompanyModal;
