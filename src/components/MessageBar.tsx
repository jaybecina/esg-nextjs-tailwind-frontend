import React, { FC } from 'react';
import cx from "classnames";
import { TrashIcon } from "@heroicons/react/24/outline"

interface IProps {
  handleDelete?: (item: any) => void;
  id?: any;
  type: "news" | "remind",
  title: string;
  body: string;
}

const MessageBar: FC<IProps> = (props) => {

  return (
    <div className="p-2 border rounded-lg bg-white shadow-lg relative grid grid-cols-12">
      <div className="col-span-11">
        <div className="flex items-center mb-2">
          <p className="font-semibold whitespace-pre-wrap">
            <span className={cx("uppercase font-bold mr-2", {
              "text-jll-red": props.type === "news",
              "text-jll-orange": props.type === "remind",
            })}>{props.type}!</span>
            {props.title}
          </p>
        </div>
        <p className="font-medium mb-2 text-sm">{props.body}</p>
      </div>
      <div className="col-span-1">
        <div className="flex justify-end p-3">
          <button
            onClick={() => props.handleDelete(props.id || null)}
            className=""
            type="button">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageBar