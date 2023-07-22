import { LockClosedIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'
import Button from '../components/Button'
import * as Yup from "yup"
import cx from "classnames";
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom'
import { useResetPasswordByToken } from '../hooks/auth';

const ResetPassword: FC<any> = (props) => {

  const [type, setType] = useState("password");
  const [confirmType, setConfirmType] = useState("password");
  const { forgetToken } = useParams();
  const navigate = useNavigate();
  const resetPassword = useResetPasswordByToken();

  const form = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string().required("Confirm password is required")
    }),
    onSubmit: ({ password, confirmPassword }, { setFieldError }) => {
      if (password !== confirmPassword) {
        const msg: string = "Password should be match"
        setFieldError("password", msg);
        setFieldError("confirmPassword", msg);
        return
      }

      resetPassword.mutate({
        password,
        token: forgetToken
      }, {
        onSuccess: (data: any) => {
          navigate({
            pathname: "/login",
            search: "?reset-password=success"
          })
        }
      })
    }
  })

  return (
    <div className="bg-white p-5 flex flex-col items-center shadow-lg gap-8 rounded border border-jll-gray w-[480px]">
      <p className="text-2xl font-bold">Reset Password</p>

      <div className="w-full">
        <div className={cx("flex w-full shadow-lg rounded-md border p-2 items-center gap-2", {
          "ring-1 ring-jll-red": form.errors.password && form.touched.password
        })}>
          <LockClosedIcon className="h-5 w-5 text-jll-gray" />
          <input
            name="password"
            onChange={form.handleChange}
            disabled={resetPassword.isLoading}
            onBlur={form.handleBlur}
            className="flex-grow outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder='Password'
            type={type} />

          {/* <button onClick={() => type === "password" ? setType("text") : setType("password")}>
              <EyeSlashIcon className={cx("h-5 w-5 text-jll-gray", {
                "text-blue-500": type === "text"
              })} />
            </button> */}
        </div>
        {form.errors.password && form.touched.password && <p className="text-xs mt-1 text-jll-red font-semibold">{form.errors.password}</p>}
        <div className="my-3" />

        <div className={cx("flex w-full shadow-lg rounded-md border p-2 items-center gap-2", {
          "ring-1 ring-jll-red": form.errors.password && form.touched.password
        })}>
          <LockClosedIcon className="h-5 w-5 text-jll-gray" />
          <input
            disabled={resetPassword.isLoading}
            name="confirmPassword"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            className="flex-grow outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder='Repeat Password'
            type={confirmType} />

          {/* <button onClick={() => confirmType === "password" ? setConfirmType("text") : setConfirmType("password")}>
              <EyeSlashIcon className={cx("h-5 w-5 text-jll-gray", {
                "text-blue-500": confirmType === "text"
              })} />
            </button> */}
        </div>
        {form.errors.confirmPassword && form.touched.confirmPassword && <p className="text-xs mt-1 text-jll-red font-semibold">{form.errors.confirmPassword}</p>}
      </div>


      <Button
        disabled={resetPassword.isLoading}
        onClick={form.handleSubmit}
        type="lg"
        variant="gradient">
        Submit
      </Button>
    </div>
  )
}

export default ResetPassword;