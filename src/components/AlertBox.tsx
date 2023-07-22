import { FC, Fragment, useContext } from 'react'
import { createPortal } from 'react-dom';
import { ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import { AlertBoxContext } from '../context/alert';

const AlertBox: FC = () => {
  const container = document.getElementById("alert-root");
  const { state } = useContext(AlertBoxContext);

  function defineIconAndColor() {
    switch (state.type) {
      case "error": {
        return <XCircleIcon className="w-8 h-8 text-jll-red-light" />
      }
      case "success": {
        return <CheckCircleIcon className="w-8 h-8 text-jll-green" />
      }
      case "warning": {
        return <ExclamationCircleIcon className="w-8 h-8 text-jll-orange" />
      }
    }
  }

  return (
    <Fragment>
      {createPortal(
        <main
          data-cy="alert-box-portal"
          className={cx("min-h-[58px] w-[320px] bg-white fixed p-2 m-5 right-0 rounded-lg shadow-md items-center justify-start gap-3 flex z-20", {
            "animate-alert-show": state.isVisible,
            "transition duration-300 translate-x-[110%]": !state.isVisible
          })}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2 items-center flex justify-start">
              {defineIconAndColor()}
            </div>
            <div className="col-span-10">
              <p className="font-semibold text-lg">{state.title}</p>
              <p
                style={{ lineHeight: "1rem" }}
                className="text-sm whitespace-pre-wrap">{state.description}</p>
            </div>
          </div>
        </main>, container)
      }
    </Fragment>
  )
}

export default AlertBox