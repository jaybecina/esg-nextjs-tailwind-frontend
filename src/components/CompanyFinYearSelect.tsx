import { get, isEmpty, isNil, range } from 'lodash';
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useGetCompanyList } from '../hooks/company';
import { setGlobalCompany, setGlobalCompanyId, setGlobalYear } from '../redux/slices/companyAndYear';
import { RootState } from '../redux/store';
import AccessControl, { ROLES } from './AccessControl'
import SelectField from './SelectField'

interface IProps { }

const CompanyFinYearSelect: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { year, company, companyId } = useSelector((state: RootState) => state.companyAndYear);
  const user = useSelector((state: RootState) => state.auth.user);

  const getCompanyList = useGetCompanyList(1, 9999);
  const companyList = get(getCompanyList, "data.data", []);

  useEffect(() => {
    if (getCompanyList.isSuccess) {

      if ((!company || !companyId) && user.role === ROLES.SuperAdmin) {
        dispatch(setGlobalCompanyId({ id: companyList[0]?._id }))
      }
    }
  }, [getCompanyList.data, company, user])

  function handleCompanyChange(val: string) {
    dispatch(setGlobalCompanyId({ id: val }))
  }

  function getCompanyOptions() {
    const items = [];

    if (user.role === "client-admin") {
      companyList.forEach((company: any) => {
        if (company._id === user?.company?._id) {
          items.push({
            label: company.name,
            value: company._id
          })
        }
      })
      return items;
    }

    if (companyList.length > 0) {
      return companyList.map((company: any) => ({
        label: company.name,
        value: company._id
      }))
    }

    return items;
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <AccessControl allowedRoles={[ROLES.SuperAdmin]}>
        <div className="w-[190px]">
          <SelectField
            name="company"
            cy="global-company-select-list"
            disabled={getCompanyList.isLoading}
            placeholder={t("Select Company")}
            label="Company"
            onSelect={(val: any) => handleCompanyChange(val)}
            value={company?._id || ""}
            options={getCompanyOptions()}
          />
        </div>
      </AccessControl>

      <div className="w-[150px]">
        <SelectField
          raw
          cy="global-year-select-list"
          name="year"
          placeholder="Year"
          label={t("Financial Year")}
          onSelect={(val: any) => {
            localStorage.setItem("year-selected", val)
            dispatch(setGlobalYear({ year: val }))
          }}
          value={year.toString()}
          options={range(new Date().getFullYear() - 2, new Date().getFullYear() + 4).map((year: number) => ({
            label: year.toString(),
            value: year.toString()
          }))
          }
        />
      </div>
    </div>
  )
}

export default CompanyFinYearSelect