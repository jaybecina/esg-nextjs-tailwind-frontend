
import SideMenu from '../components/SideMenu'
import { Navigate, Outlet } from 'react-router-dom'
import { FC, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const FallBack: FC<any> = () => {
  return (
    <section className="p-5">
      Loading...
    </section>
  )
}

const Portal: FC<any> = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.isAuthenticated && !localStorage.getItem("jll-token")) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex bg-white flex-row relative h-screen">
      <SideMenu />
      <div className="pl-[220px] flex-grow">
        <div
          style={{ minHeight: "96vh" }}
          className="bg-gray-100 my-5 rounded-2xl ">
          <section className="w-full">  {/* container mx-auto */}
            <Suspense fallback={<FallBack />}>
              <Outlet />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Portal