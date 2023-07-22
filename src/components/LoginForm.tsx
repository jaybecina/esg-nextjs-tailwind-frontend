import { FC, useEffect, useRef, useState } from 'react'
import { LockClosedIcon, UserIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { UserIcon as UserSolid } from "@heroicons/react/24/solid"
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAlertBox } from '../hooks/alertBox';
import { useGetSingleUser, useLogin } from '../hooks/auth';
import { get } from 'lodash';
import jwtDecode from 'jwt-decode';
import cx from "classnames";
import TabItem from './TabItem';
import PopupModal from './PopupModal';
import { useDispatch } from "react-redux"
import { setAuthenticatedUser, setAuthToken } from '../redux/slices/auth';
import * as Yup from "yup";
import { ROLES } from './AccessControl';
import { setGlobalCompanyId } from '../redux/slices/companyAndYear';

const LoginForm: FC = () => {
  const [policyModalVisible, setPolicyModalVisible] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("user");
  const [type, setType] = useState<string>("password")
  const [userId, setUserId] = useState<string>(null);

  const dispatch = useDispatch();
  const alertBox = useAlertBox();
  const [params, setSearchParams] = useSearchParams()
  const login = useLogin();
  const usernameRef = useRef<HTMLInputElement>();
  const getUser = useGetSingleUser(userId);

  useEffect(() => {
    if (getUser.isSuccess) {
      const user = get(getUser, "data.data", {});

      if (user.role !== ROLES.SuperAdmin)
        dispatch(setGlobalCompanyId({ id: user?.company?._id }));

      setTimeout(() => {
        if (user.role === ROLES.User) {
          window.location.href = ("/forms")
        } else {
          window.location.href = ("/home")
        }
      }, 100)
    }
  }, [getUser.data])

  useEffect(() => {
    if (params.get("reset-password") === "success") {
      alertBox.show({
        type: "success",
        title: "Password successfully reset!",
        description: "You may now use your updated password to access your account.",
        callback: () => {
          params.delete("reset-password")
          setSearchParams(params)
        }
      })
    }
  }, [])

  const form = useFormik({
    initialValues: {
      tnc: false,
      username: "",
      password: "",
      keepLoggedIn: false,
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: (values, { }) => {
      // if (!values.tnc) {
      //   alertBox.show({
      //     type: "warning",
      //     title: "Terms and Condition",
      //     description: `Please make sure policies and terms is checked before logging in.`
      //   })
      //   return;
      // }
      login.mutate({
        email: values.username,
        password: values.password,
        keepLoggedIn: values.keepLoggedIn
      }, {
        onSuccess: (res: any) => {
          const token = res.data
          const decoded = jwtDecode(token) as any;

          localStorage.setItem("jll-token", token)
          dispatch(setAuthToken(token))
          setUserId(decoded._id)
        },
        onError: (error: unknown) => {
          form.setFieldError("username", " ")
          form.setFieldError("password", " ")
          alertBox.show({
            type: "error",
            title: get(error, "data.message", "Invalid credentials."),
            description: "Please check your credentials."
          })
        },
        onSettled: () => {

        }
      });
    }
  })

  function showPolicyMoal() {
    setPolicyModalVisible(true)
  }

  function hidePolicyModal() {
    setPolicyModalVisible(false)
  }

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  return (
    <>
      <PopupModal
        position="center"
        onClose={hidePolicyModal}
        isVisible={policyModalVisible}>
        <div
          data-cy="terms-policies-modal"
          className="relative p-5 border shadow-lg bg-white w-[920px]">
          <button
            onClick={hidePolicyModal}
            data-cy="terms-policies-close-modal-btn"
            className="absolute right-4 top-2"
            type="button">
            <XMarkIcon className="w-5 h-6" />
          </button>
          <p className="text-center font-semibold text-3xl mb-3">Policy</p>
          <div className="max-h-[600px] px-2 overflow-scroll">
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id commodo sem orci sit magna diam accumsan, sed. Adipiscing ante a id a nibh libero in. Mauris tristique id sed porta sagittis, elit ante enim praesent. Pharetra diam tristique ac, curabitur blandit malesuada consectetur. Ac blandit curabitur suspendisse vel bibendum a et. Elit netus sagittis, venenatis nulla dictum pharetra ultrices. Sed cras ac posuere egestas aliquam vivamus scelerisque. Donec et porttitor etiam augue feugiat. Faucibus turpis egestas volutpat pharetra, ornare libero volutpat etiam ac. Sapien ultricies risus consequat id arcu sed. Habitant vel, mauris quis sollicitudin. Nulla vitae scelerisque fringilla gravida amet praesent.<br /><br />
              Nunc sed tortor pellentesque cras risus, feugiat purus, eget. Pulvinar sapien tellus vitae, lectus in amet, eu. Vitae, condimentum lectus pharetra integer lorem convallis sem. Fermentum sollicitudin orci id rhoncus aliquam odio condimentum mauris ultricies. Viverra in vitae est adipiscing arcu id congue. Iaculis porttitor interdum enim proin. Ut sed diam duis faucibus in imperdiet porta molestie. Ante aliquet ultrices tortor accumsan eu pharetra aliquet tempus. Lorem vitae elit adipiscing nunc. Integer id enim donec tristique. Nunc, mauris auctor amet nullam phasellus duis. Commodo eu nisi erat amet sagittis. Sodales turpis sit tortor pretium diam. Bibendum nunc adipiscing at neque in. Volutpat id facilisi ut id.<br /><br />
              Risus neque et, amet massa senectus a nibh tempus. Pulvinar rhoncus in egestas sit adipiscing at dapibus. Vitae donec id elit tempus elementum, facilisis egestas aliquam pretium. Ante dignissim lectus eget venenatis sed nulla. Nulla sed ultrices enim faucibus sed. Mattis at vestibulum pretium tempor, pellentesque. Habitant amet amet justo, sagittis eget. Leo aliquam, libero vitae tempus. Tincidunt quisque vestibulum, tempor nisi fermentum posuere pellentesque proin eu. Ante massa aliquet id eget cras eu eget. Pulvinar semper vel integer nisl. Fusce eu vulputate mi, tellus nunc elit, nunc. Turpis feugiat auctor lorem placerat aenean proin. Sed tempus leo vitae dolor egestas id nulla odio. Feugiat velit, blandit sagittis, consectetur ornare ullamcorper ultrices in.<br /><br />
              Vitae vitae ac turpis adipiscing velit tristique. Mattis vulputate pharetra aliquam, suspendisse. Ipsum convallis enim vitae suscipit quis. Justo tempor, quis varius ipsum placerat. Nunc, vel arcu integer ultrices penatibus varius vestibulum. Massa risus blandit facilisis scelerisque ultrices in massa sed dolor. Nunc interdum pharetra sed morbi. In quam erat nulla pretium id. Commodo ipsum vel morbi risus. Massa commodo amet urna, quis tristique commodo. At urna sit justo, nulla lectus eleifend. Suspendisse et netus tincidunt sed duis vulputate morbi. Cursus integer nisi mi dui nunc mauris, libero in. Diam sed vel, nibh amet urna, ut cum massa. Enim id at metus, sem vitae.
              Ut elementum metus at elit suscipit at convallis commodo, urna. Commodo egestas id elementum, turpis turpis. Massa pellentesque arcu, leo vestibulum habitasse consequat vitae at. Tincidunt at pretium scelerisque purus in. Sem vel et rhoncus cursus vestibulum eu mattis suscipit ac. Odio tempus massa et feugiat ut risus. Nec, aliquam rhoncus maecenas a. Lobortis urna sed amet malesuada commodo. A, neque, quis pellentesque sit. Quis amet scelerisque a arcu iaculis. Eleifend tortor, arcu vitae quis id. Odio volutpat ac in ut semper commodo tellus amet.
            </p>
          </div>
          <div className="flex items-center justify-center mt-8 gap-4">
            <button
              onClick={hidePolicyModal}
              className="bg-jll-red text-sm px-4 text-white font-semibold py-1">
              Confirm
            </button>
            <button
              onClick={hidePolicyModal}
              className="inset-red text-sm px-4 py-1 font-semibold text-jll-black">
              Cancel
            </button>
          </div>
        </div>
      </PopupModal>

      <form
        onSubmit={form.handleSubmit}
        className="bg-white p-5 shadow-lg rounded border border-jll-gray w-[480px]">

        <p className="text-3xl text-center mb-10 font-semibold">Login</p>

        <div className="gap-10 justify-center mb-8 hidden">
          <TabItem
            icon={UserSolid}
            onClick={setTab}
            value="admin"
            isActive={tab === "admin"}
            label="Admin" />
          <TabItem
            icon={UserSolid}
            onClick={setTab}
            value="user"
            isActive={tab === "user"}
            label="User" />
        </div>

        <div className="flex flex-col gap-3 text-jll-gray-dark mb-3">
          <div>
            <div className={cx("flex shadow-lg rounded-md border p-2 items-center gap-2", {
              "border-jll-red": form.errors.username && form.touched.username
            })}>
              <UserIcon className="h-5 w-5 text-jll-gray" />
              <input
                ref={usernameRef}
                data-cy="username"
                name="username"
                disabled={login.isLoading || getUser.isLoading}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                className="flex-grow outline-0 disabled:opacity-50"
                placeholder="Username"
                type="text" />
            </div>
          </div>

          <div>
            <div className={cx("flex shadow-lg rounded-md border p-2 items-center gap-2", {
              "border-jll-red": form.errors.password && form.touched.password
            })}>
              <LockClosedIcon className="h-5 w-5 text-jll-gray" />
              <input
                data-cy="password"
                name="password"
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                disabled={login.isLoading || getUser.isLoading}
                className="flex-grow outline-0 disabled:opacity-50"
                placeholder="Password"
                type={type} />

              <button
                type="button"
                data-cy="show-password-btn"
                onClick={() => type === "password" ? setType("text") : setType("password")}>
                <EyeSlashIcon
                  data-cy="eye-slash-icon"
                  className={cx("h-5 w-5 text-jll-gray", {
                    "text-blue-500": type === "text"
                  })} />
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm mt-14">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="keepLoggedIn"
                onChange={() => form.setFieldValue("keepLoggedIn", !form.values.keepLoggedIn)}
                checked={form.values.keepLoggedIn}
                className="cursor-pointer" />
              <label htmlFor="">Keep me logged in</label>
            </div>
            <Link
              data-cy="forgot-password-link"
              to="/forget-password">
              <p
                className="underline cursor-pointer text-jll-gray-dark">Forgot your password?</p>
            </Link>
          </div>
          {/* {tab === "user" && (
            <div
              data-cy="policies-and-terms-checkbox"
              className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                id="policies-and-term"
                data-cy="policies-and-term"
                name="tnc"
                checked={form.values.tnc}
                value="policies-and-term"
                onChange={form.handleChange}
                className="cursor-pointer" />
              <label htmlFor="">
                I have read and agree to the relavant{" "}
                <span
                  data-cy="policies-link"
                  onClick={showPolicyMoal}
                  className="cursor-pointer underline">policies</span>{" "}and{" "}
                <span
                  data-cy="terms-link"
                  onClick={showPolicyMoal}
                  className="cursor-pointer underline">terms</span>.
              </label>
            </div>
          )} */}

          <div className="flex justify-center my-5">
            <button
              type="submit"
              data-cy="login-btn"
              disabled={login.isLoading || getUser.isLoading}
              className="cursor-pointer fit-content box-border transition duration-150 hover:opacity-90 flex items-center justify-center rounded-[5px] py-1 px-[38px] font-semibold text-lg bg-gradient-to-l text-[white] from-jll-red to-jll-red-light disabled:opacity-50">
              Login
            </button>
          </div>
        </div>

      </form>
    </>
  )
}

export default LoginForm;