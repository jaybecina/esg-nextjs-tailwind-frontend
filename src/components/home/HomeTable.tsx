import { FC, ReactNode } from 'react'
import { format } from "date-fns"
import { TrashIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"
import ProgressBar from '../ProgressBar';
import cx from "classnames"
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { SORT_DIRECTION } from '../../types/pagination';

interface IProps {
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
  loading?: boolean;
  page?: number;
  header: Array<{ label: string, sortable?: boolean, key?: string }>;
  data: Array<{ [key: string]: any }>;
  children?: ReactNode;
}

const HomeTable: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const navigate = useNavigate();

  function handleRowNameClick(formId: string) {
    navigate(`/forms/user/kpi-summary/${formId}`)
  }

  function toggleDirection() {
    if (props.sortDirection === SORT_DIRECTION.ASC)
      return SORT_DIRECTION.DESC;
    return SORT_DIRECTION.ASC;
  }


  return (
    <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-md w-full">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-[#F3F2EE]">
          <tr>
            {props.header.map((item, index: number) => (
              <th
                key={index}
                scope="col"
                data-cy="home-table-header"
                className="py-2 px-2 text-left text-sm font-black text-gray-900">
                {t(item.label)}
                {item.sortable && (
                  <button
                    onClick={() => props.handleSortClick(item.key, toggleDirection())}
                    className="ml-2">
                    <FontAwesomeIcon icon={
                      props.sortBy === item.key && props.sortDirection === SORT_DIRECTION.ASC
                        ? faCaretUp
                        : faCaretDown} />
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {props.loading ? (
            <tr className="bg-white text-center ">
              <td colSpan={7}>
                <p className="text-sm py-2">Loading...</p>
              </td>
            </tr>
          ) : null}

          {(!props.data || props.data.length === 0 && !props.loading) && (
            <tr className="bg-white text-center ">
              <td colSpan={7}>
                <p className="text-sm font-semibold py-2">{t("No rows found")}</p>
              </td>
            </tr>
          )}

          {props.data && props.data.length > 0 && !props.loading && props.data.map((item, index) => {
            const locked = item.locked ? dayjs().diff(dayjs(item.locked)) < 30 * 1000 : false;

            return (
              <tr
                className={cx({
                  "text-jll-gray cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": item.status && item.status === "expired"
                })}
                key={index}>
                <td className="whitespace-nowrap p-2 text-center text-sm font-medium">
                  <div className="flex p-1 items-center justify-start gap-2">
                    {index + 1 + ((props.page - 1) * 10)}
                  </div>
                </td>
                <td className="whitespace-nowrap p-2 text-left text-sm font-medium">
                  <span
                    data-cy="home-form-item"
                    data-form-id={item._id}
                    onClick={() => locked ? {} : handleRowNameClick(item._id)}
                    className={locked ? "cursor-not-allowed" : "cursor-pointer"}>
                    {item?.formTemplate?.name || "Form"}
                    {locked ? " (Locked)" : ""}
                  </span>
                </td>

                <td className="whitespace-nowrap p-2 text-left text-sm font-medium">
                  <div className="w-[160px]">
                    <ProgressBar
                      value={item?.inputtedFieldsCount}
                      total={item?.fieldsTotal}
                      color={item.status && item.status === "expired" ? "gray" : "red"} />
                  </div>
                </td>


                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">
                  {format(new Date(item?.updatedAt || new Date().toString()), "dd MMM, yyyy").toString()}
                  <p className="opacity-50">{format(new Date(item?.updatedAt || new Date().toString()), "p").toString()}</p>
                </td>

                <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right">
                  <div className="w-[160px]">
                    <ProgressBar
                      value={item?.adminCheckedCount}
                      total={item?.meters?.length}
                      color={item?.status && item.status === "expired" ? "gray" : "orange"} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {props.data.length === 0 ? null : props.children}
    </div>
  )
}

export default HomeTable 