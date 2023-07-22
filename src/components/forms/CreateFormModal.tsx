import React, { FC, useEffect, useState } from 'react'
import PopupModal from '../PopupModal'
import { useTranslation } from "react-i18next"
import { useGetFormTemplates } from '../../hooks/formTemplate';
import { get } from 'lodash';

interface IProps {
  isVisible: boolean;
  loading?: boolean;
  onConfirm: (values: any) => void;
  closeModal: () => void;
}

const CreateFormModal: FC<IProps> = ({ isVisible, closeModal, onConfirm, loading }) => {

  const { t } = useTranslation()
  const [selectedForms, setSelectedForms] = useState<any>([]);

  const getFormTemplates = useGetFormTemplates(Boolean(isVisible), 1, 9999)
  const formTemplates = get(getFormTemplates, "data.data", [])

  function handleChange(e: any) {
    const set = new Set([...selectedForms]);
    const value = e.target.value;

    if (set.has(value)) {
      set.delete(value)
    } else {
      set.add(value)
    }

    setSelectedForms([...set]);
  }

  function handleSubmit() {
    onConfirm(selectedForms)
  }

  useEffect(() => {
    if (!isVisible) {
      setSelectedForms([])
    }
  }, [isVisible])

  return (
    <PopupModal
      position="center"
      onClose={closeModal}
      isVisible={isVisible}>
      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <p className="text-center font-semibold text-3xl mb-5">
          {t("Add Form")}
        </p>

        <section className="overflow-y-scroll max-h-[500px]">
          {getFormTemplates.isLoading ? <p>Loading...</p> : null}
          {getFormTemplates.isSuccess ? formTemplates.map((formTemplate: any, index: number) => (
            <div
              key={index}
              className="flex items-center mb-2 justify-start gap-2">
              <input
                name="form"
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                value={formTemplate._id}
                onChange={handleChange}
                type="checkbox" />
              <p>{formTemplate.name}</p>
            </div>
          )) : null}
        </section>
        <div className="flex items-center justify-center gap-5 text-white font-medium mt-10">
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="w-[85px] disabled:opacity-50 disabled:cursor-progress py-1 bg-jll-red hover:opacity-90 transition duration-100">
            {t("Done")}
          </button>
          <button
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

export default CreateFormModal