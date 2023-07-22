import { get } from 'lodash'
import React, { FC, useState } from 'react'
import { useTranslation } from "react-i18next"
import cx from "classnames";
import { useDeleteNotification, useGetUserNotification } from '../hooks/auth'
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { interpolateValues } from '../helper/stringInterpolate';
import { format } from 'date-fns';

interface IProps { }

const Message: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const getUserNotifs = useGetUserNotification({});
  const deleteNotif = useDeleteNotification();
  const notifs = get(getUserNotifs, "data.data", []);


  return (
    <main className="p-5">
      <p className="text-3xl font-bold mb-3">{t("Message")}</p>

      <div className="flex flex-col gap-5">
        {getUserNotifs.isSuccess && notifs.length > 0 ? (
          <>
            {notifs.map((item) => {

              const { label, header, content } = item?.notificationTemplate;
              const title = interpolateValues(header, item?.payload)

              return (
                <div className="p-2 border rounded-lg bg-white shadow-lg relative grid grid-cols-12">
                  <div className="col-span-11">
                    <p className="text-xs">{format(new Date(item.createdAt), "MM-dd-yyyy p")}</p>
                    <div className="flex items-center mb-2">
                      <Link to={item?.payload?.url || "/"}>
                        <p className="font-semibold whitespace-pre-wrap">
                          <span className={cx("uppercase font-bold mr-2", {
                            "text-jll-red": label.toLowerCase() === "new",
                            "text-jll-orange": label.toLowerCase() === "remind",
                          })}>{label}!</span>
                          {title}
                        </p>
                      </Link>
                    </div>
                    <p className="font-medium mb-2 text-sm">{content}</p>
                  </div>
                  <div className="col-span-1">
                    <div className="flex justify-end p-3">
                      <button
                        disabled={deleteNotif.isLoading}
                        onClick={() => deleteNotif.mutate(item._id)}
                        className="disabled:cursor-progress disabled:opacity-50"
                        type="button">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : null}
      </div>
    </main>
  )
}

export default Message