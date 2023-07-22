import React, { FC, ReactNode } from 'react'
import { format } from "date-fns"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "react-i18next"
import cx from "classnames";
import { useCreateBookmark, useDeleteBookmark, useGetBookmarks } from '../../hooks/bookmark'
import { get } from 'lodash'
import { SORT_DIRECTION } from '../../types/pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  handleRowClick: (item: any) => void;
  handleDelete: (item: any) => void;
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  handleEdit: (item: any) => void;
  loading?: boolean;
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
  header: Array<{ label: string, sortable?: boolean, key?: string }>;
  page?: number;
  data: Array<{ [key: string]: any }>;
  children: ReactNode;
}

const Table: FC<IProps> = (props) => {

  const { t } = useTranslation()

  const getBookmarks = useGetBookmarks("material", 1, 9999);
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const bookmarks = get(getBookmarks, "data.data", [])
  const bookmarkedMaterialIds = bookmarks.map((b: any) => b.documentId);

  function handleBookmarkClick(item: any) {
    if (bookmarkedMaterialIds.includes(item._id)) {
      const bookmark = bookmarks.find((b) => b.documentId === item._id);
      deleteBookmark.mutate(bookmark._id)

    } else {
      createBookmark.mutate({
        collectionName: "material",
        documentId: item._id,
        data: item,
        page: props.page,
        limit: 9999
      })
    }
  }

  function toggleDirection() {
    if (props.sortDirection === SORT_DIRECTION.ASC)
      return SORT_DIRECTION.DESC;
    return SORT_DIRECTION.ASC;
  }


  return (
    <div className={cx("overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-md w-full", {
      "cursor-progress": props.loading
    })}>
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
              key={index}>
              <td className="whitespace-nowrap p-2 text-center text-sm font-medium text-gray-900 w-[65px]">
                <div className="flex p-1 items-center justify-start gap-2">
                  <button
                    className="disabled:cursor-progress disabled:pointer-events-none"
                    disabled={createBookmark.isLoading || deleteBookmark.isLoading}
                    onClick={() => handleBookmarkClick(item)}
                    type="button">
                    <StarIcon className={cx("h-4 w-4 text-gray-300", {
                      "text-yellow-400": bookmarkedMaterialIds.includes(item._id),
                    })} />
                  </button>
                  {index + 1 + ((props.page - 1) * 10)}
                </div>
              </td>
              <td className="whitespace-nowrap p-2 text-left text-sm font-medium text-gray-900 w-[350px]">
                <p className="whitespace-pre-wrap">{t(item.name)}</p>
              </td>
              <td className="whitespace-nowrap p-2 text-left text-sm text-jll-black">
                {format(new Date(item.updatedAt), "dd MMM, yyyy").toString()}
                <p className="opacity-50">{format(new Date(item.updatedAt), "p").toString()}</p>
              </td>


              <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right">
              </td>

              <td className="whitespace-nowrap p-2 text-sm text-jll-black text-right">
                <div className="flex items-center justify-end gap-3 p-1">
                  <button
                    data-cy="delete-material-btn"
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

export default Table 