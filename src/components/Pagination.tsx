import React, { FC } from 'react'
import { useTranslation } from "react-i18next"

type PaginationType = {
  handlePrevClick: () => void;
  handleNextClick: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  page: number;
  totalPages: number
}

const Pagination: FC<PaginationType> = ({
  handleNextClick,
  handlePrevClick,
  page,
  totalPages,
  prevDisabled,
  nextDisabled
}) => {

  const { t } = useTranslation()

  return (
    <div className="px-3 relative py-2 flex justify-between items-center border-t bg-white">
      <button
        disabled={prevDisabled}
        onClick={handlePrevClick}
        className="px-5 text-sm disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed text-center rounded bg-white shadow-md disabled:shadow-none border py-1">
        {t("Prev")}
      </button>
      <p className="font-semibold text-center text-sm">
        {t("Page")} {page} {t("of")} {totalPages}
      </p>
      <button
        disabled={nextDisabled}
        onClick={handleNextClick}
        className="px-5 text-sm disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed text-center rounded bg-white shadow-md disabled:shadow-none border py-1">
        {t("Next")}
      </button>
    </div>
  )
}

export default Pagination