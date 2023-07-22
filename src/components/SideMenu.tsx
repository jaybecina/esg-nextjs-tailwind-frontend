import { HomeIcon, BuildingOfficeIcon, CalculatorIcon, DocumentTextIcon, ArrowPathIcon, Cog6ToothIcon, EnvelopeIcon, ReceiptRefundIcon, ClipboardDocumentListIcon, Squares2X2Icon, QuestionMarkCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import { get, isEmpty } from "lodash";
import { FC, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import SideMenuItem from './SideMenuItem';
import cx from "classnames"
import { QueryCache } from "react-query"
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux"
import { endSession } from "../redux/slices/auth";
import { useGetContents } from "../hooks/content";
import { useOutsideClick } from "../hooks/outsideClick";
import { setGlobalLanguage } from "../redux/slices/utils";
import { useAuth } from "../hooks/auth";

interface IProps { }

export interface ISideMenuItem {
  label: string;
  href: string;
  key: string;
  icon: any;
}

const SideMenu: FC<IProps> = (props) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signOut } = useAuth()

  const langOptionsRef = useRef()
  const [dropdownIsVisible, setDropdownIsVisible] = useState<boolean>(false);
  const [sideItems, setSideItems] = useState<Array<ISideMenuItem>>([]);
  const auth = useSelector((state: RootState) => state.auth);
  const language = useSelector((state: RootState) => state.utils.language);
  const logo = auth?.user?.company?.logo?.url || "";

  const queryCache = new QueryCache()
  const getContents = useGetContents(1, 999, "translation")
  const translations = get(getContents, "data.data", []).filter((item) => item.category === "translation");

  const items: Array<ISideMenuItem> = [
    { key: "home", label: "Home", icon: HomeIcon, href: "/home" },
    { key: "company-list", label: "Company List", icon: BuildingOfficeIcon, href: "/company-list" },
    { key: "user-list", label: "User List", icon: DocumentTextIcon, href: "/user-list" },
    { key: "calculation", label: "Calculation", icon: CalculatorIcon, href: "/calculation" },
    { key: "material", label: "Material", icon: ReceiptRefundIcon, href: "/material-list" },
    { key: "form-template", label: "Form Template", icon: DocumentDuplicateIcon, href: "/form-template" },
    { key: "form", label: "Forms", icon: ClipboardDocumentListIcon, href: "/forms" },
    { key: "report", label: "Report", icon: DocumentTextIcon, href: "/report" },
    { key: "kpi-summary", label: "KPI Summary", icon: DocumentTextIcon, href: "/kpi-summary" },
    { key: "dashboard", label: "Dashboard", icon: Squares2X2Icon, href: "/dashboard" },
    { key: "constant-setting", label: "Constant Setting", icon: Cog6ToothIcon, href: "/constant-setting" },
    { key: "unit", label: "Unit Setting", icon: ArrowPathIcon, href: "/unit" },
    { key: "cms", label: "CMS", icon: DocumentTextIcon, href: "/cms" },
    { key: "message", label: "Message", icon: EnvelopeIcon, href: "/message" },
    { key: "help", label: "Help", icon: QuestionMarkCircleIcon, href: "/contact-us" },
  ];

  function getList(arr: Array<string>) {
    const list = [];
    items.forEach(item => {
      if (arr.includes(item.key)) {
        list.push(item)
      }
    })

    return list;
  }

  function buildItems(role: string) {
    const admin = ['home', 'company-list', 'user-list', 'calculation', 'material', 'form-template', 'form', 'report', 'dashboard', 'constant-setting', 'unit', 'cms', 'message', 'help'];
    const clientAdmin = ['home', 'user-list', 'form', 'report', 'dashboard', 'message', 'help'];
    const user = ['form', 'message', 'help'];

    switch (role) {
      case "client-admin": {
        const list = getList(clientAdmin)
        setSideItems(list)
        break;
      }
      case "super-admin": {
        const list = getList(admin)
        setSideItems(list)
        break;
      }
      case "user": {
        const list = getList(user)
        setSideItems(list)
        break;
      }
      default: {
        return null;
      }
    }
  }

  function handleLangChange(language: string) {
    setDropdownIsVisible(false)
    dispatch(setGlobalLanguage({ language }))
  }

  useEffect(() => {
    if (auth && !isEmpty(auth.user)) {
      buildItems(auth.user.role)
    }
  }, [auth])


  useOutsideClick(langOptionsRef, () => setDropdownIsVisible(false))

  return (
    <aside className="aside w-[220px] bg-white flex flex-col justify-between fixed left-0 z-[1] h-full">

      <div
        data-cy="sidemenu-items"
        className="flex flex-col overflow-scroll justify-start scrollbar-hidden">

        <div className="py-[5rem] flex items-center justify-center">
          <Link to="/">
            <img
              width={150}
              alt="esg-logo"
              loading="lazy"
              className="cursor-pointer"
              src="/assets/esg-logo.png" />
          </Link>
        </div>

        {sideItems && sideItems.length > 0 ? sideItems.map((item: ISideMenuItem, index: number) => (
          <SideMenuItem
            item={item}
            key={index} />
        )) : (
          <div className="flex justify-center">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="flex p-3 justify-start gap-4 items-center">
        <div className="relative">

          <div
            ref={langOptionsRef}
            style={{ top: "-8rem", display: dropdownIsVisible ? "block" : "none" }}
            className="p-2 rounded absolute border top-0 left-0 w-[150px] h-[115px] overflow-y-scroll bg-white shadow z-10">

            {translations.map((tz) => (
              <button
                key={tz._id}
                onClick={() => handleLangChange(tz.title.toLowerCase())}
                className="flex items-center w-full justify-start gap-2 mb-2"
                type="button">
                {/* <img width="20" height="20" src="assets/en-rounded.png" /> */}
                <p className={cx("font-semibold uppercase", {
                  "opacity-50": language === tz.title.toLowerCase()
                })}>{tz.title}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setDropdownIsVisible(!dropdownIsVisible)}
            className="flex items-center justify-start gap-1"
            type="button">
            <img
              width={30}
              height={30}
              src="/assets/localization.png"
              alt="locale-btn" />
            <p>{language.toUpperCase()}</p>
          </button>
        </div>

        <div className="opacity-30 bg-gray-500 w-[1px] h-[30px]" />

        <button
          data-cy="avatar-btn"
          type="button">
          <Avatar
            url={logo}
            alternativeText={auth?.user?.company?.name}
            size="sm"
          />
        </button>

        <div className="opacity-30 bg-gray-500 w-[1px] h-[30px]" />

        <button
          data-cy="signout-btn"
          onClick={signOut}
          type="button">
          <img
            width={30}
            height={30}
            src="/assets/power-icon.png"
            alt="power-icon" />
        </button>

      </div>


    </aside>
  )
}

export default SideMenu