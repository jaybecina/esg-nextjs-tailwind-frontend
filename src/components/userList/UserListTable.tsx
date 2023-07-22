import { FC, ReactNode } from 'react'
import cx from "classnames"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"
import { get } from 'lodash';
import { ROLES } from '../AccessControl';
import { SORT_DIRECTION } from '../../types/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  handleEdit: (item: any) => void;
  handleDelete: (item: any) => void;
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  resultPerPage?: number;
  page?: number;
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
    <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-md w-full">
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
          {(!props.data || props.data.length === 0) && (
            <tr className="text-jll-black">
              <td
                className="w-full py-2 text-center"
                colSpan={10}>
                <p className="text-sm font-bold">{t("No rows found")}</p>
              </td>
            </tr>
          )}
          {props.data && props.data.length > 0 && props.data.map((item, index) => {
            return (
              <tr
                className={cx("", {
                  "opacity-50 cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": item.status === "expired"
                })}
                key={index}>
                <td className="whitespace-nowrap p-2 text-left text-sm font-medium text-gray-900 w-[65px]"> {index + 1 + ((props.page - 1) * props.resultPerPage)}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm font-medium text-gray-900">{get(item, "company.name", "")}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">{item.name}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">{item.phone}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">{item.email}</td>
                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">{item.role}</td>

                <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">
                  {item.status && item.status === "expired" ? "expired" : ""}
                </td>

                <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right w-[65px]">
                  <div className="flex items-center justify-end gap-3 p-1">
                    {item.role !== ROLES.SuperAdmin && (
                      <button
                        data-cy="delete-user-btn"
                        onClick={() => props.handleDelete(item)}
                        type="button">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}

                    <button
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
      {props.data && props.data.length > 0 ? props.children : null}
    </div>
  )
}

export default Table 