import { FC, Fragment, ReactNode } from 'react'
import { createPortal } from 'react-dom';
import cx from "classnames";

interface IProps {
  children: ReactNode;
  isVisible: boolean;
  position?: "center" | "top";
  onClose: () => void;
}

const PopupModal: FC<IProps> = (props) => {
  const container = document.getElementById("modal-root");
  return (
    <Fragment>
      {props.isVisible
        ? createPortal(
          <main
            className="h-screen w-screen z-10 fixed top-0 left-0 bg-slate-800 bg-opacity-70">
            <div
              className={cx("fixed z-10", {
                "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2": props.position === 'center',
                "left-1/2 transform -translate-x-1/2": props.position === 'top',
                "animate-fade-in": props.isVisible,
                "animate-fade-out": !props.isVisible
              })}>
              {props.children}
            </div>
          </main>, container)
        : null
      }
    </Fragment>
  )
}

export default PopupModal;