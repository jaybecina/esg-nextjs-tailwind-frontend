import React, { ChangeEvent, FC } from 'react';
import cx from "classnames"
import { useTranslation } from "react-i18next"

interface IProps {
  label?: string;
  placeholder?: string;
  dataCy?: string;
  error?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  type: "text" | "number" | "password" | "email";
  errorMessage?: any;
  value: string | number;
  formik?: boolean;
  handleBlur?: (e: React.ChangeEvent<any>) => void;
  handleChange?: (e: React.ChangeEvent<any>) => void;
  onChange?: (value: any) => void;
}

const TextField: FC<IProps> = (props) => {

  const { t } = useTranslation()

  return (
    <div className="">
      {props.label && <p className="text-xs font-medium mb-1 text-jll-gray-dark">{t(props.label)}</p>}
      <div className={cx("px-3 py-1 text-md border-[1px] rounded-md bg-white", {
        "border-jll-red": props.error,
        "border-jll-gray-dark": !props.error,
        "before:content-[*]": true,
        "opacity-50 bg-gray-200": props.disabled
      })}>
        <div className="flex justify-start">
          {props.required && !props.value && <span className="text-jll-red mr-1">*</span>}
          <input
            data-cy={props.dataCy}
            disabled={props.disabled}
            readOnly={props.readonly}
            name={props.name}
            className={`w-full placeholder:text-sm ${props.disabled ? "cursor-not-allowed" : ""}`}
            onBlur={props.handleBlur}
            onChange={props.formik
              ? props.handleChange
              : (e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)
            }
            placeholder={props.placeholder}
            value={props.value}
            type={props.type} />
        </div>
      </div>
      {props.error && props.errorMessage
        ? <p
          data-cy="error-message"
          className="text-jll-red text-xs font-semibold">{t(props.errorMessage)}</p> : null}
    </div>
  )
}

export default TextField