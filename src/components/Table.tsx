import { FC, ReactNode } from 'react'
import { format } from "date-fns"
import cx from "classnames"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import ProgressBar from './ProgressBar';
import { useTranslation } from "react-i18next"
import { get } from 'lodash';
import { SORT_DIRECTION } from '../types/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  handleEdit?: (item: any) => void;
  handleDelete?: (item: any) => void;
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  resultPerPage?: number;
  page?: number;
  loading?: boolean;
  header: Array<{ label: string, sortable?: boolean, key?: string }>;
  data: Array<{ [key: string]: any }>;
  children?: ReactNode;
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
}

const Table: FC<IProps> = (props) => {
  const { t } = useTranslation()

  function toggleDirection() {
    if (props.sortDirection === SORT_DIRECTION.ASC)
      return SORT_DIRECTION.DESC;
    return SORT_DIRECTION.ASC;
  }

  return (
    <div className="shadow-lg ring-1 ring-black ring-opacity-5 rounded-md overflow-hidden w-full">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-[#F3F2EE]">
          <tr>
            {props.header.map((item, index: number) => (
              <th
                key={index}
                scope="col" className="py-2 px-2 text-left text-sm font-black text-gray-900">
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
          {((!props.data || props.data.length === 0) && !props.loading) && (
            <tr className="text-jll-black">
              <td
                className="w-full py-2 text-center"
                colSpan={10}>
                <p className="text-sm font-bold">{t("No rows found")}</p>
              </td>
            </tr>
          )}

          {(!props.data || props.loading) && (
            <tr className="bg-white text-center ">
              <td colSpan={10}>
                <p className="text-sm font-semibold py-2">{t("Loading...")}</p>
              </td>
            </tr>
          )}

          {props?.data?.map((item, index) => {
            const isExpired = new Date(item.expiryDate) <= new Date() ? "expired" : "";

            return (
              <tr
                data-cy="company-list-item"
                data-id={item._id}
                className={cx("text-jll-black company-list-item", {
                  "text-jll-gray cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": isExpired
                })}
                key={index}>
                <td className="whitespace-nowrap p-2 text-center text-sm font-medium w-[40px]">
                  {index + 1 + ((props.page - 1) * props.resultPerPage)}
                </td>
                <td className="whitespace-nowrap p-2 text-left text-sm font-medium max-w-[150px] truncate">{item.name}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm">{get(item, "admin.name", "N/A")}</td>

                <td className="whitespace-nowrap p-2 text-sm">
                  <p>Phone No: {item.phone}</p>
                  <p className="-mt-1">{item.email}</p>
                </td>

                <td className="whitespace-nowrap p-2 text-sm">
                  <ProgressBar
                    value={item.inputProgress}
                    total={null}
                    color="red" />
                </td>

                <td className="whitespace-nowrap p-2 text-sm">
                  {format(new Date(item.updatedAt), "dd MMM, yyyy").toString()}
                  <p className="opacity-50">{format(new Date(item.updatedAt), "p").toString()}</p>
                </td>

                <td className="whitespace-nowrap p-2 text-sm">
                  {item.expiryDate && (
                    <>
                      {format(new Date(item.expiryDate), "dd MMM, yyyy").toString()}
                      <p className="opacity-50">{format(new Date(item.expiryDate), "p").toString()}</p>
                    </>
                  )}
                </td>

                <td className="whitespace-nowrap p-2 text-sm">
                  <ProgressBar
                    value={item.adminCheckedProgress}
                    total={null}
                    color="orange" />
                </td>
                <td className="whitespace-nowrap p-2 w-[65px] text-sm text-right">
                  <div className="flex items-center justify-end gap-2 p-1">
                    <button
                      data-cy="delete-company-btn"
                      onClick={() => props.handleDelete(item)}
                      type="button">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button
                      data-cy="update-company-btn"
                      onClick={() => props.handleEdit(item)}
                      type="button">
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {props.children}

    </div>
  )
}

export default Table