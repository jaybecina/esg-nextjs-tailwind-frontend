import { FC } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import PopupModal from '../PopupModal'

interface IProps {
  isVisible: boolean;
  label?: string;
  closeModal: () => void;
  onConfirm?: () => void;
}

const DeleteCMSModal: FC<IProps> = (props) => {

  const {
    isVisible,
    closeModal,
    onConfirm
  } = props;

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">Delete Unit</p>
        <p className="text-center">
          Are you sure to <span className="font-bold">Delete</span> the{" "}
          <span className="font-bold">{props.label ? props.label : "No 9 User Trives Cheng"}</span>?
        </p>

        <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
          <button
            onClick={onConfirm}
            type="button"
            className="w-[85px] py-1 bg-jll-red hover:opacity-90 transition duration-100">
            Done
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-[85px] py-1 bg-jll-gray">
            Cancel
          </button>
        </div>
      </div>
    </PopupModal>
  )
}

export default DeleteCMSModal;