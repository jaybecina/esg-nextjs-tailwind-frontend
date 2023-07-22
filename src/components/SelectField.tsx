import { FC, useRef, useState } from 'react'
import cx from "classnames";
import { useOutsideClick } from '../hooks/outsideClick';
import { useTranslation } from "react-i18next"
interface IProps {
  cy?: string;
  usedAs?: "form" | "util",
  label?: string;
  value?: string;
  error?: boolean;
  name: string;
  height?: number;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onSelect: (value: any) => void;
  options: Array<{ value: string | number, label: string }>
  canSelectDisable?: boolean;
  raw?: boolean;
}

const SelectField: FC<IProps> = (props) => {
  const ref = useRef()
  const { t } = useTranslation()

  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  useOutsideClick(ref, () => setOptionsVisible(false))

  function onSelect(val: any) {
    props.onSelect(val);
    setOptionsVisible(false);
  }

  return (
    <div className="relative w-full">
      <div onClick={() => setOptionsVisible(!optionsVisible)}>
        {props.label && <p className="text-xs mb-1 font-medium text-jll-gray-dark">{t(props.label)}</p>}
        <div className={cx("pl-2 py-[0.4rem] flex justify-between text-md border-[1px] rounded-md bg-white", {
          "border-jll-red": props.error,
          "border-jll-gray-dark": !props.error,
          "pr-3 pl-1": props.usedAs === "util",
          "opacity-50 bg-gray-200 cursor-not-allowed": props.disabled
        })}>
          <div className={cx("flex justify-start flex-grow", {
            "text-sm text-jll-gray-dark": props.usedAs === "util"
          })}>
            {props.required && !props.value && <span className="text-jll-red mr-1">*</span>}
            <select
              data-cy={props.cy}
              value={props.value}
              name={props.name}
              disabled={props.disabled}
              onChange={e => onSelect(e.target.value)}
              style={props.height ? { height: `${props.height}px` } : {}}
              className={cx("w-full text-sm pr-[1.5rem] whitespace-nowrap text-ellipsis", {
                "text-jll-gray": !props.value
              })}>
              <option value="" disabled={props.canSelectDisable ? false : true}>
                {props.placeholder}
              </option>
              {props.options && props.options.length > 0 && props.options.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  className="border border-gray-100 px-2 py-1 cursor-pointer transition font-medium duration-200 hover:bg-gray-100">{option.label}</option>))}
            </select>
          </div>
        </div>
        {props.error && props.errorMessage
          ? <p className="text-jll-red text-xs font-semibold">{t(props.errorMessage)}</p> : null}
      </div>
    </div>
  )
}

export default SelectField