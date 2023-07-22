import { FC, useMemo } from 'react'
import Avatar, { IAvatarProps } from './Avatar'
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { get } from 'lodash';
import { useGetCompany, useGetCompanyByFinancialYear } from '../hooks/company';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { format } from 'date-fns';
import { getDatesOfFinancialYear } from '../helper/financialYear';

interface IProps {
  totalToFillUp: number;
}

const InfoBar: FC<IProps> = ({ totalToFillUp }) => {

  const getProgressData = useGetCompanyByFinancialYear();
  const progress = get(getProgressData, "data.data", {})
  const { companyId, year, company: { yearEnd } } = useSelector((state: RootState) => state.companyAndYear);
  const finYear = getDatesOfFinancialYear(parseInt(year), yearEnd);

  const getCompanyData = useGetCompany(companyId)
  const companyData = get(getCompanyData, "data.data", {});

  const percentValue = useMemo(() => {
    return ((progress?.inputProgress + progress?.adminCheckedProgress) / 2) * 100 || 0
  }, [progress]);

  return (
    <div className="border-[1px] border-jll-gray h-[120px] bg-white rounded-md w-full px-3 py-4 shadow-lg">

      {getCompanyData.isLoading ? <div className="flex items-center h-full justify-center"><p>Loading...</p></div> : null}

      {!getCompanyData.isLoading ? (
        <div className="flex items-center justify-start gap-3">
          <Avatar
            size="lg"
            alternativeText={companyData?.name}
            url={companyData?.logo?.url} />

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">{companyData?.name}</p>
            <div className="flex gap-5">
              <p className="text-sm">ID: {companyData?._id}</p>
              <p className="text-sm">Business Owner: {companyData?.admin?.name}</p>
              <div className="flex gap-1 items-center">
                <PhoneIcon className="w-5 h-5" />
                <p className="text-sm">{companyData?.phone}</p>
              </div>
              <div className="flex gap-1 items-center">
                <EnvelopeIcon className="w-5 h-5" />
                <p className="text-sm">{companyData?.email}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <p className="text-sm">
                A total of <span className="underline italic font-bold">{totalToFillUp}</span>{" "} to fill out
              </p>
              <div className="flex gap-2 items-center justify-start">
                <p className="text-sm">Total Complete Progress:</p>
                <div className="w-[120px] overflow-hidden relative bg-jll-red-light h-[5px] bg-opacity-25 rounded-full">
                  <div
                    className="bg-jll-red h-[5px]"
                    style={{ width: `${percentValue.toFixed(2)}%` }} />
                </div>
                <p className="text-sm text-jll-gray">
                  {percentValue.toFixed(2)}%
                </p>
              </div>

              {getCompanyData.isSuccess ? (
                <div className="flex gap-2 items-center justify-start">
                  <p className="text-sm">
                    Reporting period:{" "}
                    {format(new Date(finYear.startDate), "MM/dd/yyyy")} -
                    {format(new Date(finYear.endDate), "MM/dd/yyyy")}
                  </p>
                </div>
              ) : null}

              <div className="flex gap-1 items-center">
                <p className="text-sm">Finish Deadline</p>
                <span className="h-2 w-2 bg-opacity-30 rounded-full bg-green-700"></span>
                <p className="text-sm">{companyData?.submissionDeadline}</p>
              </div>

            </div>
          </div>

        </div>
      ) : null}
    </div>
  )
}

export default InfoBar