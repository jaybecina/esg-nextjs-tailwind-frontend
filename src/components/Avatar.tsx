import React, { FC } from 'react'
import cx from "classnames";
import { UserIcon } from "@heroicons/react/24/outline"

export interface IAvatarProps {
  url: string;
  alternativeText: string;
  size: "sm" | "md" | "lg";
}

const Avatar: FC<IAvatarProps> = (props) => {
  return (
    <div className={cx("overflow-hidden rounded-full shadow-lg bg-gray-400 border-[1px] border-gray-100", {
      "h-[2rem] w-[2rem]": props.size === "sm",
      "h-[4rem] w-[4rem]": props.size === "md",
      "h-[80px] w-[80px]": props.size === "lg",
    })}>
      {props.url ? (
        <img
          alt={props.alternativeText}
          src={props.url} />
      ) : (
        <div className="flex flex-grow items-center justify-center h-full">
          <UserIcon className="text-white w-5 h-5" />
        </div>
      )}
    </div>
  )
}

export default Avatar