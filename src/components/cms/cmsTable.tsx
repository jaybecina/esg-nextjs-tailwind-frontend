import { FC, ReactNode } from 'react'
import cx from "classnames"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import ReactPaginate from 'react-paginate';
import { useTranslation } from "react-i18next"


interface IProps {
  handleEdit: (item: any) => void;
  handleDelete: (item: any) => void;
  header: Array<string>;
  page?: number;
  data: Array<{ [key: string]: any }>;
  children: ReactNode
}

const CMStable: FC<IProps> = (props) => {
  const { t } = useTranslation()

  function getTitle(item: any): string {
    let title: string = item.title;
    const codes = {
      "zh-Hans": "Chinese Simplified",
      "zh-Hant": "Chinese Traditional",
      "en": "English",
    }

    if (item.category === "translation")
      title = codes[item.title] || ""

    return title;
  }

  return (
    <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-md w-full">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-[#F3F2EE]">
          <tr>
            {props.header.map((header, index: number) => (
              <th
                key={index}
                scope="col" className="py-2 px-2 text-left text-sm font-black text-gray-900">{t(header)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {props.data && props.data.length > 0 && props.data.map((item, index) => (
            <tr
              className={cx("", {
                "opacity-50 cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": item.status === "expired"
              })}
              key={index}>
              <td className="whitespace-nowrap pl-3 text-sm w-[50px] text-left font-medium text-gray-900">{index + 1 + ((props.page - 1) * 10)}</td>
              <td className="whitespace-nowrap p-2 text-left text-sm w-[360px] truncate font-medium text-gray-900">{t(getTitle(item))}</td>
              <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">
                {t(item.category === "faq"
                  ? "FAQ"
                  : item.category === "translation"
                    ? "Translation"
                    : "Contact Us"
                )}
              </td>

              <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right">
                <div className="flex items-center justify-end gap-3 p-1">

                  <button
                    data-cy="delete-content-btn"
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

export default CMStable; 