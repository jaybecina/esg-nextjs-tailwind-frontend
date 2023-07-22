import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import cx from "classnames";
import SelectField from '../components/SelectField';
import { useTranslation } from "react-i18next"
import { useGetCompanyList } from '../hooks/company';
import { get, remove } from 'lodash';
import AccessControl, { ROLES } from '../components/AccessControl';
import CompanyFinYearSelect from '../components/CompanyFinYearSelect';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useGetCalculationReport, useGetCalculationReportPreviewTable, useGetCalculations, useGetReportList, useUpdateReport } from '../hooks/calculation';
import PopupModal from '../components/PopupModal';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getDatesOfFinancialYear } from '../helper/financialYear';

interface IProps { }

const ReportItem: FC<{
  name: string,
  isLoading?: boolean;
  onEditClick: () => void
  downloadReport: () => void;
  previewReportTable: () => void;
}> = (props) => {


  const { t } = useTranslation()

  const data = useMemo(() => {
    const reports = [
      { name: "env-report", url: "/assets/env-data-bg.png", label: "Environment Data" },
      { name: "gov-report", url: "/assets/gov-data-bg.png", label: "Government Data" },
      { name: "soc-report", url: "/assets/soc-data-bg.png", label: "Social Data" }
    ]

    const index: number = reports.findIndex((i) => i.name === props.name);
    return reports[index]

  }, [props.name])

  return (
    <div className={cx('flex flex-col', {
      'cursor-progress': props.isLoading
    })}>
      <div
        className="flex flex-col justify-end p-5 rounded-lg"
        style={{
          width: "330px",
          height: "480px",
          backgroundImage: `url("${data.url}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <button
          onClick={props.downloadReport}
          type="button">
          <p className={cx("text-5xl whitespace-pre-wrap font-bold ", {
            "cursor-progress": props.isLoading,
            "text-white": true,
          })}>{t(data.label)}</p>
        </button>
      </div>
      <div className="flex justify-between">
        <button
          disabled={props.isLoading}
          onClick={props.previewReportTable}
          className="disabled:opacity-50 flex items-center justify-end gap-1 mt-2"
          type="button">
          <p className="text-gray-900 font-semibold text-sm">{t("Preview")}</p>
          <EyeIcon className="h-4 w-4" />
        </button>
        <button
          disabled={props.isLoading}
          onClick={props.onEditClick}
          className="disabled:opacity-50 flex items-center justify-end gap-1 mt-2"
          type="button">
          <p className="text-gray-900 font-semibold text-sm">{t("Edit")}</p>
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

const ReportTable: FC<{
  tblCol: string[],
  tblBody: string[]
}> = ({ tblCol, tblBody }) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tblCol?.map((col: string, i: number) => (
                    <>
                      <th key={`tblCol-${i}`} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col}
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tblBody?.map((body: any, index: number) => (
                  <tr key={`tblBodyTr-${index}`}>
                    {body?.map((b: string, i: number) => (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div key={`tblBodyTd-${index}`} className="text-sm text-gray-500">{b ? b : '---'}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserReport: FC<IProps> = (IProps) => {

  const { t } = useTranslation()
  const { companyId, company, year } = useSelector((state: RootState) => state.companyAndYear)
  const { endDate } = getDatesOfFinancialYear(parseInt(year), company.yearEnd)

  const [name, setName] = useState<string>("")
  const [reportModalVisble, setReportModalVisible] = useState<boolean>(false);
  const [calcList, setCalcList] = useState<Array<string>>([]);
  const [tblCol, setTblCol] = useState<string[]>([]);
  const [tblBody, setTblBody] = useState<string[]>([]);

  const getReportList = useGetReportList();
  const getCalculations = useGetCalculations({})
  const updateReport = useUpdateReport();
  const getReport = useGetCalculationReport({ name, companyId, endDate });

  const calculations = get(getCalculations, "data.data", []);
  const reportList = get(getReportList, "data.data", []);

  function handleGetReportData(tblColData: string[], tblBodyData: string[]) {
    setTblCol(tblColData);
    setTblBody(tblBodyData);
  }

  const getReportPreviewTable = useGetCalculationReportPreviewTable({ name, companyId, endDate, handleGetReportData });

  function handleCalculationSelect(e: ChangeEvent<HTMLInputElement>) {
    const { checked, dataset: { id } } = e.target;
    const set = new Set([...calcList])

    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }

    setCalcList([...set])
  }

  function downloadReport(report: any) {
    setName(report.name)
    setTimeout(() => getReport.refetch({}), 100)
  }

  function previewReportTable(report: any) {
    setName(report.name)
    setTimeout(() => getReportPreviewTable.refetch({}), 100)
  }

  function closeModal() {
    setReportModalVisible(false)
  }

  function onEditClick(report: any) {
    setName(report.name)
    setCalcList(report.calculations)
    setReportModalVisible(true)
  }

  function handleDoneClick() {
    updateReport.mutate({
      name,
      calculations: calcList
    }, {
      onSuccess: (data: any) => {
        closeModal()
      }
    })
  }

  function handleOrderChange(e: any, id: string) {
    const order: number = parseInt(e.target.value);
    const arr = [...calcList].filter((_id) => _id !== id);

    arr.splice(order, 0, id)
    setCalcList(arr)
  }

  useEffect(() => {
    if (reportModalVisble === false) {
      setCalcList([])
      setName("")
    }
  }, [reportModalVisble])

  return (
    <main className="p-5">

      <div className="flex items-center justify-between mb-5">
        <p className="text-2xl font-bold">{t("Environment, Social and Governance Report")}</p>
        <CompanyFinYearSelect />
      </div>

      <PopupModal
        position="center"
        onClose={closeModal}
        isVisible={reportModalVisble}>
        <div
          data-cy="add-material-modal"
          className="relative p-5 rounded-lg border shadow-lg bg-white w-[720px] transition ease-in-out duration-150">
          <button
            onClick={closeModal}
            className="absolute right-4 top-2"
            type="button">
            <XMarkIcon className="w-5 h-6" />
          </button>
          <p className="text-center font-semibold text-3xl mb-5">
            Edit Report
          </p>

          <section className="max-h-[420px] overflow-y-scroll">
            {calculations.map((calc: any) => (
              <div
                key={calc._id}
                className="flex items-center justify-start gap-2">
                <input
                  checked={calcList.includes(calc._id)}
                  onChange={handleCalculationSelect}
                  data-id={calc._id}
                  type="checkbox" />
                {calcList.includes(calc._id) ? (
                  <select
                    name="order"
                    value={calcList.indexOf(calc._id)}
                    onChange={(e) => handleOrderChange(e, calc._id)}
                    className="border rounded-md border-jll-gray-dark pl-2 text-sm text-jll-gray-dark w-[42px]">
                    {[...Array(calcList.length).keys()].map((order) => {
                      return <option
                        key={order}
                        value={order}>{order + 1}</option>
                    })}
                  </select>
                ) : null}
                <p>{calc.name}</p>
              </div>
            ))}
          </section>

          <div className="flex items-center justify-center gap-5 mt-10 text-white font-medium">
            <button
              onClick={handleDoneClick}
              type="button"
              disabled={updateReport.isLoading}
              className="w-[85px] py-1 disabled:cursor-progress disabled:opacity-50 bg-jll-red hover:opacity-90 transition duration-100">
              {t("Done")}
            </button>
            <button
              type="button"
              data-cy="material-close-btn"
              onClick={closeModal}
              className="w-[85px] py-1 bg-jll-gray">
              {t("Cancel")}
            </button>
          </div>
        </div>
      </PopupModal>

      <div className="flex justify-start gap-5 items-center mb-40">
        {reportList.map((item: { _id: string, calculations: Array<string>, name: string }) => (
          <ReportItem
            key={item._id}
            isLoading={(getReport.isLoading || getReport.isRefetching) || (getReportPreviewTable.isLoading || getReportPreviewTable.isRefetching)}
            downloadReport={() => downloadReport(item)}
            previewReportTable={() => previewReportTable(item)}
            onEditClick={() => onEditClick(item)}
            name={item.name} />
        ))}
      </div>
      <div className='flex justify-start items-center'>
        <ReportTable tblCol={tblCol} tblBody={tblBody} />
      </div>
    </main>
  )
}

export default UserReport