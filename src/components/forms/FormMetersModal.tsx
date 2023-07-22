import { FC, useEffect, useMemo } from 'react'
import PopupModal from '../PopupModal'
import { useTranslation } from "react-i18next"
import DownloadMeterItem from './DownloadMeterItem';
import { useGetMeterFormMaterials } from '../../hooks/material';
import { get } from 'lodash';
import { generateFormInitialValues, useProcessFormMaterials } from '../../helper/processFormMaterials';
import { useGetForm } from '../../hooks/form';

interface IProps {
  isVisible: boolean;
  loading?: boolean;
  meters: Array<any>;
  form: any;
  closeModal: () => void;
}

const FormMetersModal: FC<IProps> = ({ isVisible, closeModal, meters, form, loading }) => {

  const { t } = useTranslation()

  return (
    <PopupModal
      position="center"
      onClose={closeModal}
      isVisible={isVisible}>
      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <p className="text-center font-semibold text-3xl mb-5">
          {t("Form Meters")}
        </p>

        <section className="overflow-y-scroll max-h-[500px] pb-5">
          {loading ? <p>Loading...</p> : (
            <>
              { meters && meters.length > 0 ? (
                <div className="flex flex-col gap-y-3">
                  {meters.map((item, index) => (
                    <DownloadMeterItem 
                      key={index}
                      form={form}
                      meter={item} />
                  ))}
                </div>
              ) : null }
            </>
          )}
        </section>

        <div className="flex items-center justify-center gap-5 text-white font-medium mt-10">
          <button
            type="button"
            onClick={closeModal}
            className="w-[85px] py-1 bg-jll-gray">
            {t("Done")}
          </button>
        </div>
      </div>
    </PopupModal>
  )
}

export default FormMetersModal