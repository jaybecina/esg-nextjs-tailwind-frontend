import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SharedLayout from './pages/Portal';
import AlertBox from "./components/AlertBox";
import jwtDecode from "jwt-decode";

import { ReactQueryDevtools } from 'react-query/devtools';
import { lazy, useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { useGetContents } from "./hooks/content";
import { get } from "lodash";
import i18n from "./helper/i18next"

// pages
import Preview from "./pages/Preview"
import { useAuth, useGetSingleUser } from "./hooks/auth";
import { setGlobalCompany, setGlobalCompanyId, setGlobalYear } from "./redux/slices/companyAndYear";
import { useGetCompanyList } from "./hooks/company";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ConstantSetting from "./pages/ConstantSetting";
import { setAuthenticatedUser } from "./redux/slices/auth";
import { setGlobalLanguage } from "./redux/slices/utils";
const Home = lazy(() => import("./pages/Home"))
const CompanyList = lazy(() => import("./pages/CompanyList"))
const UserList = lazy(() => import("./pages/UserList"))
const MaterialList = lazy(() => import("./pages/MaterialList"))
const Forms = lazy(() => import("./pages/Forms"))
const UserKpiSummary = lazy(() => import("./pages/UserKpiSummary"))
const Message = lazy(() => import("./pages/Message"))
const ContactUs = lazy(() => import("./pages/ContactUs"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Report = lazy(() => import("./pages/UserReport"))
const Unit = lazy(() => import("./pages/Unit"))
const Calculation = lazy(() => import("./pages/Calculation"))
const ResetPasswordGetEmail = lazy(() => import("./pages/ResetPasswordEmail"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const CommonScreenLayout = lazy(() => import("./pages/Login"))
const ContentManagementSystem = lazy(() => import("./pages/CMS"))
const FormTemplate = lazy(() => import("./pages/FormTemplate"))
const LoginForm = lazy(() => import("./components/LoginForm"))

function App() {
  const { signOut } = useAuth()
  const [userId, setUserId] = useState<string>("")
  const dispatch = useDispatch();

  const getContents = useGetContents(1, 999, "translation")
  const getCompanyList = useGetCompanyList(1, 9999);
  const getUser = useGetSingleUser(userId);
  const language = useSelector((state: RootState) => state.utils.language)
  const { companyId } = useSelector((state: RootState) => state.companyAndYear)

  const translations = get(getContents, "data.data", []).filter((item) => item.category === "translation");
  const companyList = get(getCompanyList, "data.data", []);

  useEffect(() => {
    function reloadResources() {
      i18n.reloadResources().then(() => {
        i18n.changeLanguage(language);
      });
    }

    reloadResources()
  }, [language])

  useEffect(() => {
    if (getUser.isSuccess) {
      const user = get(getUser, "data.data", {});

      dispatch(setAuthenticatedUser(user))
      dispatch(setGlobalLanguage({ language: user?.defaultLanguage?.title }))
    }
  }, [getUser.data])

  useEffect(() => {
    if (getCompanyList.isSuccess) {
      const index: number = companyList.findIndex((cl) => cl._id === companyId);

      if (index > -1) {
        dispatch(setGlobalCompany({ company: companyList[index] }))
      }
    }
  }, [companyId, getCompanyList.data])

  useEffect(() => {
    if (getContents.isSuccess) {

      translations.forEach((tz) => {
        i18n.addResourceBundle(tz.title, "translation", tz.customFields, true, true)
      });

    }
  }, [getContents.data])

  useEffect(() => {
    const savedCompany = localStorage.getItem("company-selected");
    const token = localStorage.getItem("jll-token")
    const savedYear = localStorage.getItem("year-selected");

    if (savedCompany)
      dispatch(setGlobalCompanyId({ id: savedCompany }))

    if (savedYear)
      dispatch(setGlobalYear({ year: savedYear }))

    if (token) {
      const decoded = jwtDecode(token) as any;
      if (Date.now() >= decoded.exp * 1000) {
        signOut()
        return;
      }

      setUserId(decoded._id)
    }
  }, [])

  return (
    <main>
      <AlertBox />
      <Routes>
        <Route element={<CommonScreenLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="forget-password" element={<ResetPasswordGetEmail />} />
          <Route path="auth/reset/:forgetToken" element={<ResetPassword />} />
        </Route>

        <Route element={<SharedLayout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="company-list" element={<CompanyList />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="calculation" element={<Calculation />} />
          <Route path="material-list" element={<MaterialList />} />
          <Route path="form-template" element={<FormTemplate />} />
          <Route path="message" element={<Message />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="report" element={<Report />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="constant-setting" element={<ConstantSetting />} />
          <Route path="unit" element={<Unit />} />
          <Route path="cms" element={<ContentManagementSystem />} />

          <Route path="forms">
            <Route index element={<Forms />} />
            <Route path="user/kpi-summary/:formId" element={<UserKpiSummary />} />
          </Route>

        </Route>

        <Route path="preview" element={<Preview />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />} />
      </Routes>

      <ReactQueryDevtools position="bottom-right" />
    </main>
  );
}

export default App;