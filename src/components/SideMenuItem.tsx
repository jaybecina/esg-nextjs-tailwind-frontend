import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { ISideMenuItem } from './SideMenu'
import { useTranslation } from "react-i18next"

interface IProps {
  item: ISideMenuItem;
}

const SideMenuItem: FC<IProps> = (props) => {

  const { t } = useTranslation()

  return (
    <NavLink
      to={props.item.href}
      data-cy={`nav-link-${props.item.key}`}
      className={(navData) => `relative group ${navData.isActive ? activeClass : ""}`}>
      <menu className="flex items-center gap-3 justify-start px-4 py-3 cursor-pointer transition duration-150 hover:bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="bg-gradient-to-l from-jll-red to-jll-red-light p-1 rounded">
          <props.item.icon className="w-7 h-7 text-white" />
        </div>
        <span className="font-medium transition duration-150 group-hover:font-semibold">{t(props.item.label)}</span>
      </menu>
    </NavLink>
  )
}

const activeClass = `
  before:content-['']
  before:absolute 
  before:right-0
  before:top:0
  before:h-full
  before:bg-[#DBD6C7]
  before:w-[5px]
  before:rounded-lg
`
export default SideMenuItem