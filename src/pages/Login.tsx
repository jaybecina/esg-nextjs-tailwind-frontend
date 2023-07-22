import { FC, Suspense } from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Login: FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  // if (auth.isAuthenticated && localStorage.getItem("jll-token")) {
  //   return <Navigate to="/home" replace />
  // }

  return (
    <div className="main h-screen">
      <div
        className="py-2 bg-black px-10">
        <img
          width={82}
          height={36}
          loading="lazy"
          src="/assets/jll-logo.png"
          alt="jll-logo" />
      </div>
      <div
        style={{ height: `calc(100% - 52px)` }}
        className="grid grid-cols-12">
        <div className="col-span-6 h-full">
          <div className="p-5  bg-[#DBD6C7] h-full flex items-center flex-col justify-end">
            <img
              width={737}
              height={763}
              loading="lazy"
              src="/assets/login-hero.png"
              alt="hero-login" />
          </div>
        </div>
        <div className="col-span-6 h-full">
          <div className="bg-gray-100 h-full flex items-center justify-center flex-col gap-[3rem]">
            <img
              loading="lazy"
              width={200}
              height={57}
              src="/assets/esg-logo.png"
              alt="esg-logo" />
            <p className="text-5xl font-medium">Hello, Welcome Back</p>
            <Suspense fallback={<>Loading...</>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Login