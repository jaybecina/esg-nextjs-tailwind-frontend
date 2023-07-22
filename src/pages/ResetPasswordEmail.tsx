import { UserIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAlertBox } from '../hooks/alertBox'
import cx from "classnames";
import * as Yup from "yup";
import { useFormik } from 'formik'
import { useForgetPassword } from '../hooks/auth'

const ResetPasswordGetEmail: FC<any> = (props) => {

  const navigate = useNavigate();
  const alertBox = useAlertBox();
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [link, setLink] = useState<string>("")

  const forgetPassword = useForgetPassword();
  const form = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email()
    }),
    onSubmit: ({ email }) => {
      if (!email) {
        return alertBox.show({
          type: "error",
          title: "Email is required",
          description: "Please fill up all required fields."
        })
      }

      forgetPassword.mutate(email, {
        onSuccess: (res: any) => {
          setIsSuccess(true)
          setLink(res.data)
        }
      })
    }
  })

  return (
    <div className="bg-white p-5 flex flex-col items-center shadow-lg gap-8 rounded border border-jll-gray w-[480px]">
      <p className="text-2xl font-bold">Reset Password</p>
      {isSuccess && link ? (
        <div
          data-cy="link-container"
          className="pb-[3rem] pt-5">
          <p className="text-center">
            <span className="font-medium">
              Please check on your mailbox or <br /> go to the link below for reseting password:
            </span><br /><br />
            <a
              target="_blank"
              className="cursor-pointer hover:underline text-blue-500"
              href={link}>{link}</a>
          </p>
        </div>
      ) : (
        <>
          <div className="w-full">
            <div className={cx("flex shadow-lg rounded-md border p-2 items-center gap-2 flex-grow w-full", {
              "ring-1 ring-jll-red": form.errors.email && form.touched.email
            })}>
              <UserIcon className="h-5 w-5 text-jll-gray" />
              <input
                disabled={forgetPassword.isLoading}
                name="email"
                data-cy="reset-pw-email-input"
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                className="flex-grow outline-0 w-full disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Email"
                type="text" />
            </div>
            {form.errors.email && form.touched.email && <p className="text-xs mt-1 text-jll-red font-semibold">Email is required.</p>}
          </div>

          <div className="flex items-center gap-2 flex-end">
            <button
              type="button"
              data-cy="reset-pw-email-submit"
              onClick={() => form.handleSubmit()}
              className="cursor-pointer fit-content box-border transition duration-150 hover:opacity-90 flex items-center justify-center rounded-[5px] py-1 px-[32px] font-semibold text-lg bg-gradient-to-l text-[white] from-jll-red to-jll-red-light disabled:opacity-50">
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-jll-gray text-white text-lg rounded-[5px] py-1 px-4 transition duration-150 hover:opacity-80 font-semibold">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ResetPasswordGetEmail