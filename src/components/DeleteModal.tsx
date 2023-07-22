import { FC } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline';
import PopupModal from './PopupModal';
import { useTranslation } from "react-i18next"

interface IProps {
  isVisible: boolean;
  loading?: boolean;
  title: string;
  label?: string;
  closeModal: () => void;
  onConfirm?: () => void;
}

const DeleteModal: FC<IProps> = (props) => {

  const {
    title,
    label,
    isVisible,
    closeModal,
    onConfirm
  } = props;

  const { t } = useTranslation()

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div
        data-cy="delete-modal-container"
        className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          data-cy="delete-modal-x-btn"
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">{t(title)}</p>
        <p className="text-center">
          Are you sure to delete{" "}
          <span className="font-bold">{label ? label : "this item"}</span>?
        </p>

        <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
          <button
            disabled={props.loading}
            onClick={onConfirm}
            type="button"
            data-cy="delete-modal-confirm-btn"
            className="w-[85px] disabled:opacity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
            {t("Done")}
          </button>
          <button
            data-cy="delete-modal-cancel-btn"
            type="button"
            onClick={closeModal}
            className="w-[85px] py-1 bg-jll-gray">
            {t("Cancel")}
          </button>
        </div>
      </div>
    </PopupModal>
  )
}

export default DeleteModal;