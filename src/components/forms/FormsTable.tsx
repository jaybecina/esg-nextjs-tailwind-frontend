import { FC, ReactNode } from 'react'
import { format } from "date-fns"
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next"
import { useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import ProgressBar from '../ProgressBar';
import cx from "classnames"
import { useCreateBookmark, useDeleteBookmark, useGetBookmarks } from '../../hooks/bookmark'
import dayjs from 'dayjs';
import AccessControl, { ROLES } from '../AccessControl'
import { SORT_DIRECTION } from '../../types/pagination'

interface IProps {
  loading?: boolean;
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
  page?: number;
  handleRowDownload: (item: any) => void;
  handleRowClick: (item: any) => void;
  handleDeleteClick: (item: any) => void;
  handleSortClick: (sortBy: string, sortDirection: SORT_DIRECTION) => void;
  header: Array<{ label: string, sortable: boolean, key?: string }>;
  data: Array<{ [key: string]: any }>;
  children?: ReactNode;
}

const FormsTable: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const navigate = useNavigate();

  const getBookmarks = useGetBookmarks("form", 1, 9999);
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const bookmarks = get(getBookmarks, "data.data", [])
  const bookmarkedMaterialIds = bookmarks.map((b: any) => b.documentId);

  function handleBookmarkClick(id: string) {
    if (bookmarkedMaterialIds.includes(id)) {
      const bookmark = bookmarks.find((b) => b.documentId === id);
      deleteBookmark.mutate(bookmark._id)

    } else {
      createBookmark.mutate({
        collectionName: "form",
        documentId: id
      })
    }
  }

  function toggleDirection() {
    if (props.sortDirection === SORT_DIRECTION.ASC)
      return SORT_DIRECTION.DESC;
    return SORT_DIRECTION.ASC;
  }

  function handleRowNameClick(formId: string) {
    navigate(`/forms/user/kpi-summary/${formId}`)
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
                <p className="text-sm font-semibold py-2">No rows found</p>
              </td>
            </tr>
          )}
          {props.data && props.data.length > 0 && !props.loading && props.data.map((item, index) => {
            // If item is locked and the last update time is within 30 second, this form is locked
            const locked = item.locked ? dayjs().diff(dayjs(item.locked)) < 30 * 1000 : false;

            return (
              <tr
                className={cx({
                  "text-jll-gray cursor-not-allowed shadow-inner shadow-gray-300 bg-gray-100": item.status && item.status === "expired"
                })}
                key={index}>
                <td className="whitespace-nowrap p-2 text-center text-sm font-medium">
                  <div className="flex p-1 items-center justify-start gap-2">
                    <button
                      onClick={() => handleBookmarkClick(item._id)}
                      disabled={createBookmark.isLoading || deleteBookmark.isLoading}
                      className="disabled:cursor-progress disabled:pointer-events-none"
                      type="button">
                      <StarIcon className={cx("h-4 hover:text-yellow-400  w-4 text-gray-300", {
                        "text-yellow-400": bookmarkedMaterialIds.includes(item._id),
                      })} />
                    </button>
                    {index + 1 + ((props.page - 1) * 10)}
                  </div>
                </td>
                <td className="whitespace-nowrap p-2 text-left text-sm font-medium">
                  <span
                    className={locked ? "cursor-not-allowed" : "cursor-pointer"}
                    onClick={() => locked ? {} : handleRowNameClick(item._id)}>
                    {t(item?.formTemplate?.name) || t("Form")}
                    {locked ? t(" (Locked)") : ""}
                  </span>
                </td>
                <td className="whitespace-nowrap p-2 cursor-pointer text-left text-sm">
                  {item?.attachmentsCount || 0}
                  {/* {item?.formTemplate?.materials?.length || 0} materials */}
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

                <td className="whitespace-nowrap p-2 text-sm w-[65px] text-right">
                  <div className="flex items-center h-full flex-grow justify-end gap-3">
                  <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                    <button
                      data-cy="delete-form-btn"
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => props.handleRowDownload(item)}
                      type="button">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </AccessControl>

                  <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                    <button
                      data-cy="delete-form-btn"
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => props.handleDeleteClick(item)}
                      type="button">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </AccessControl>
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

export default FormsTable 