import React, { FC, ReactNode } from 'react'
import { useSelector } from "react-redux"
import { RootState } from '../redux/store'

type AccessControlType = {
  allowedRoles: Array<string>,
  children: ReactNode
}

export enum ROLES {
  SuperAdmin = "super-admin",
  ClientAdmin = "client-admin",
  User = "user"
}

const AccessControl: FC<AccessControlType> = ({ allowedRoles, children }) => {
  const auth = useSelector((state: RootState) => state.auth)

  if (allowedRoles.includes(auth.user.role)) {
    return <>{children}</>
  }

  return null;
}

export default AccessControl;