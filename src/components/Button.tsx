import { FC, ReactNode } from "react";
import cx from "classnames"

interface IProps {
  dataCy?: string;
  asSubmit?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  px?: string;
  type: "lg" | "sm" | "icon",
  variant: "gradient" | "solid" | "outlined",
  fontSize?: number;
  rounded?: boolean;
}

const Button: FC<IProps> = (props) => {
  switch (props.type) {
    case "lg": {
      return (
        <button
          data-cy={props.dataCy ? props.dataCy : "jll-btn"}
          onClick={props.onClick ? props.onClick : null}
          type={props.asSubmit ? "submit" : "button"}
          disabled={props.disabled}
          className={cx("cursor-pointer disabled:cursor-progress disabled:opacity-50 fit-content box-border transition duration-150 hover:opacity-90 flex items-center justify-center rounded-[5px] py-1 px-[38px] font-semibold text-lg", {
            "transition duration-200 bg-gradient-to-l text-[white] from-jll-red to-jll-red-light": props.variant === "gradient",
            "bg-jll-gray text-[white]": props.variant === "solid",
            "inset-red": props.variant === "outlined",
          })}>
          <>
            {props.children}
          </>
        </button>
      )
    }
    case "sm": {
      return (
        <button
          disabled={props.disabled}
          data-cy={props.dataCy ? props.dataCy : "jll-btn"}
          onClick={props.onClick ? props.onClick : () => { }}
          type={props.asSubmit ? "submit" : "button"}
          className={cx("cursor-pointer disabled:cursor-progress disabled:opacity-50 fit-content box-border transition duration-150 hover:opacity-90 flex items-center justify-center px-3 py-1 font-semibold", {
            "transition duration-200 bg-gradient-to-l text-[white] from-jll-red to-jll-red-light": props.variant === "gradient",
            "bg-jll-gray text-[white]": props.variant === "solid",
            "inset-red": props.variant === "outlined",
            "rounded": props.rounded
          })}>
          <>
            {props.children}
          </>
        </button>
      )
    }
    case "icon": {
      return (
        <button
          disabled={props.disabled}
          data-cy={props.dataCy ? props.dataCy : "jll-btn"}
          onClick={props.onClick ? props.onClick : () => { }}
          type={props.asSubmit ? "submit" : "button"}
          className={cx("cursor-pointer disabled:cursor-progress disabled:opacity-50 fit-content box-border transition duration-150 hover:opacity-90 flex items-center justify-center px-3 py-1 font-semibold text-lg", {
            "transition duration-200 text-gradient-to-l text-jll-red from-jll-red to-jll-red-light": props.variant === "gradient",
            "text-jll-gray": props.variant === "solid",
            "inset-dark": props.variant === "outlined"
          })}>
          <>
            {props.children}
          </>
        </button>
      )
    }
    default: {
      return <></>
    }
  }
}

export default Button