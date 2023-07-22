import { ChangeEvent, FC, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import PopupModal from '../PopupModal'
import SelectField from '../SelectField';
import TextField from '../TextField';
import { useTranslation } from "react-i18next"
import { useGetCompanyList } from '../../hooks/company';
import { get } from 'lodash';
import { MODAL_MODE } from '../../types/modal';
import * as Yup from "yup";
import { useSelector } from "react-redux"
import { RootState } from '../../redux/store';
import { useGetContents } from '../../hooks/content';

interface IProps {
  isVisible: boolean;
  values?: { [key: string]: any };
  loading?: boolean;
  mode?: MODAL_MODE;
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const AddUserModal: FC<IProps> = (props) => {

  const {
    isVisible,
    closeModal,
    onConfirm,
    mode,
    values
  } = props;

  const { t } = useTranslation()
  const auth = useSelector((state: RootState) => state.auth)
  const { company } = useSelector((state: RootState) => state.companyAndYear)
  const getCompanyList = useGetCompanyList(1, 9999);
  const getContents = useGetContents();

  const translations = get(getContents, "data.data", []).filter((item) => item.category === "translation");
  const companyList = get(getCompanyList, "data.data", []);

  const form = useFormik({
    initialValues: {
      id: "",
      email: "",
      password: "",
      name: "",
      role: "",
      company: "",
      language: "",
      phone: ""
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required").min(6, "Password must be longer than or equal to 6 characters"),
      name: Yup.string().required("Name is required"),
      role: Yup.string().required("Role is required"),
      company: Yup.string().required("Company is required"),
      phone: Yup.number().required("Phone is required")
    }),
    onSubmit: (values) => {
      onConfirm(values)
    }
  })

  function getCompanyOptions() {
    const items = [];

    if (auth.user.role === "client-admin") {
      companyList.forEach((company: any) => {
        if (company._id === auth?.user?.company?._id) {
          items.push({
            label: company.name,
            value: company._id
          })
        }
      })
      return items;
    }

    if (companyList.length > 0) {
      return companyList.map((company: any) => ({
        label: company.name,
        value: company._id
      }))
    }

    return items;
  }

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  function handleCloseModal() {
    closeModal();
    form.resetForm()
  }

  function handleCompanyChange(companyId: string) {
    const company = companyList.find((c) => c._id === companyId);

    form.setFieldValue("company", companyId);
    form.setFieldValue("language", company?.defaultLanguage?._id || "")
  }

  useEffect(() => {
    if (mode === MODAL_MODE.edit) {
      form.setValues({
        id: values._id,
        email: values.email,
        password: "123456",
        name: values.name,
        role: values.role,
        company: get(values, "company._id", ""),
        phone: values.phone,
        language: values?.defaultLanguage?._id
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
      onClose={handleCloseModal}>

      <div
        data-cy="add-user-modal"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${(mode === MODAL_MODE.edit ? "Update" : "Add")} User`)}
        </p>

        <form onSubmit={form.handleSubmit}>
          {getCompanyList.isLoading ? (
            <div className="h-[233px] flex items-center justify-center">
              <p className="">Loading...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-6">
                  <TextField
                    formik
                    disabled={props.loading || mode === MODAL_MODE.edit}
                    name="email"
                    dataCy="user-modal-email-input"
                    label="Email"
                    placeholder="Email"
                    type="text"
                    handleChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    value={form.values.email}
                    errorMessage={form.errors.email}
                    error={getFormError("email")} />
                </div>
                <div className="col-span-6">
                  <TextField
                    formik
                    dataCy="user-modal-password-input"
                    disabled={props.loading || mode === MODAL_MODE.edit}
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    handleChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    value={form.values.password}
                    errorMessage={form.errors.password}
                    error={getFormError("password")} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-5 mt-2">
                <div className="col-span-6">
                  <TextField
                    formik
                    disabled={props.loading}
                    name="name"
                    dataCy="user-modal-name-input"
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
                    raw
                    disabled={props.loading}
                    name="company"
                    cy="user-modal-company-select"
                    placeholder="Company"
                    label="Company"
                    onSelect={(val: string) => handleCompanyChange(val)}
                    value={form.values.company}
                    errorMessage={form.errors.company}
                    error={getFormError("company")}
                    options={getCompanyOptions()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5 mt-3">
                <div className="col-span-6">
                  <SelectField
                    raw
                    name="role"
                    cy="user-modal-role-select"
                    disabled={props.loading || form.values.role === "super-admin"}
                    placeholder="Select role"
                    label="Role"
                    onSelect={(val) => {
                      form.setFieldValue("role", val)
                    }}
                    value={form.values.role}
                    errorMessage={form.errors.role}
                    error={getFormError("role")}
                    options={[
                      { label: "User", value: "user" },
                      { label: "Client Admin", value: "client-admin" },
                    ]}
                  />
                </div>
                <div className="col-span-6">
                  <TextField
                    formik
                    disabled={props.loading}
                    name="phone"
                    label="Phone"
                    placeholder="Phone"
                    dataCy="user-modal-phone-input"
                    type="number"
                    handleChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    value={form.values.phone}
                    errorMessage={form.errors.phone}
                    error={getFormError("phone")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 mt-2 gap-5">
                <div className="col-span-6">
                  <SelectField
                    name="language"
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

          )}

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              data-cy="create-user-btn"
              disabled={props.loading}
              className="w-[85px] py-1 disabled:opacity-50 disabled:cursor-progress bg-jll-red hover:opacity-90 transition duration-100">
              {t("Done")}
            </button>
            <button
              type="button"
              data-cy="user-modal-close-btn"
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

export default AddUserModal