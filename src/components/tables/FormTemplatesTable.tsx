import { FC, ReactNode } from 'react'
import cx from "classnames"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { SORT_DIRECTION } from '../../types/pagination'

interface IProps {
  handleDelete: (item: any) => void;
  handleEdit: (item: any) => void;
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  header: Array<{ label: string, sortable?: boolean, key?: string }>;
  data: Array<{ [key: string]: any }>;
  children: ReactNode;
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
}

const FormTemplatesTable: FC<IProps> = (props) => {
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
            <tr className="bg-white text-center ">
              <td colSpan={7}>
                <p className="text-sm font-semibold py-2">{t("No rows found")}</p>
              </td>
            </tr>
          )}
          {props.data && props.data.length > 0 && props.data.map((item, index) => (
            <tr
              className={cx("", {
                "opacity-50 cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": item.status === "expired"
              })}
              key={index}>
              <td className="whitespace-pre-wrap p-2 text-left w-[400px] text-sm font-medium text-gray-900">{t(item.name)}</td>
              <td className="whitespace-pre-wrap p-2 text-left w-[400px] text-sm text-jll-black">{t(item.uniqueId)}</td>
              <td className="whitespace-pre-wrap p-2 text-sm">
                {format(new Date(item.updatedAt), "dd MMM, yyyy").toString()}
                <p className="opacity-50">{format(new Date(item.updatedAt), "p").toString()}</p>
              </td>

              <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right">
                <div className="flex items-center justify-end gap-3 p-1">
                  <button
                    data-cy="delete-unit-btn"
                    onClick={() => props.handleDelete(item)}
                    type="button">
                    <TrashIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => props.handleEdit(item)}
                    type="button">
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.children}
    </div>
  )
}

export default FormTemplatesTable; 