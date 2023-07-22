import { FC, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import PopupModal from '../PopupModal'
import SelectField from '../SelectField';
import TextField from '../TextField';
import { useGetCompanyList } from '../../hooks/company';
import { get } from 'lodash';
import * as Yup from "yup";

interface IProps {
  values: { [key: string]: any };
  isVisible: boolean;
  loading?: boolean;
  closeModal: () => void;
  onConfirm: (id: number, data: any) => void;
}

const UpdateUserModal: FC<IProps> = (props) => {

  const {
    isVisible,
    closeModal,
    onConfirm,
    loading
  } = props;

  const getCompanyList = useGetCompanyList();
  const companyList = get(getCompanyList, "data.data", []);

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      role: "",
      company: "",
      phone: ""
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required").min(6, "Password must be longer than or equal to 6 characters"),
      name: Yup.string().required("Name is required"),
      role: Yup.string().required("Role is required"),
      company: Yup.string().required(),
      phone: Yup.number().required("Phone is required")
    }),
    onSubmit: (values, { setStatus }) => {
      onConfirm(Number(props.values.id), values)
    }
  })

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  useEffect(() => {
    if (props.values) {
      form.setValues({
        company: get(props, "values.company._id", "1"),
        name: props.values.name,
        email: props.values.email,
        password: "123456",
        role: props.values.role,
        phone: props.values.phone
      })
    }
  }, [props.values])

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
        <p className="text-center font-semibold text-3xl mb-5">Update User</p>

        <form onSubmit={form.handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
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
              <TextField
                formik
                disabled={true}
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
                handleChange={form.handleChange}
                value={form.values.password}
                errorMessage={form.errors.password}
                error={getFormError("password")}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-2">
            <div className="col-span-6">
              <SelectField
                name="role"
                disabled={props.loading}
                placeholder="Select role"
                label="Role"
                onSelect={(val) => form.setFieldValue("role", val)}
                value={form.values.role}
                errorMessage={form.errors.role}
                error={getFormError("role")}
                options={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                  { label: "Client Admin", value: "client-admin" },
                ]}
              />
            </div>
            <div className="col-span-6">
              <SelectField
                disabled={props.loading}
                name="company"
                placeholder="Company"
                label="Company"
                onSelect={(val) => form.setFieldValue("company", val)}
                value={form.values.company}
                errorMessage={form.errors.company}
                error={getFormError("company")}
                options={companyList.map((company) => ({
                  label: company.name,
                  value: company._id
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-3">
            <div className="col-span-6">
              <TextField
                formik
                disabled={loading}
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="number"
                handleChange={form.handleChange}
                handleBlur={form.handleBlur}
                value={form.values.phone}
                errorMessage={form.errors.phone}
                error={getFormError("phone")}
              />
            </div>
          </div>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              className="w-[85px] disabled:opacity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
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

export default UpdateUserModal