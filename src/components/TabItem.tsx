import { FC } from 'react';
import cx from "classnames";
import { UserIcon } from "@heroicons/react/24/solid"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  value: string;
  label: string;
  isActive: boolean;
  icon?: any;
  onClick: (value: string) => void;
}

const TabItem: FC<IProps> = (props) => {

  function defineIcon() {
    if (props.value === "admin") {
      return <FontAwesomeIcon size='2xl' icon={faUserGear} />
    } else {
      return <UserIcon className="w-10 h-10" />
    }
  }

  return (
    <main
      data-cy={`${props.label.toLowerCase()}-tab-btn`}
      onClick={() => props.onClick(props.value)}
      className={cx("flex cursor-pointer items-center border-b-2 justify-center gap-1 px-8 pb-2", {
        "text-jll-red border-jll-red": props.isActive,
        "text-jll-gray-dark border-jll-gray-dark": !props.isActive
      })}>
      <div className={cx("", {
        "flex items-center relative": props.label.toLowerCase() === "admin"
      })}>
        {defineIcon()}
        {/* {props.label.toLowerCase() === "admin" && <Cog8ToothIcon className="absolute border-[1px] border-white h-5 w-5" />} */}
      </div>
      <p className="text-lg font-semibold">{props.label}</p>
    </main>
  )
}

export default TabItem