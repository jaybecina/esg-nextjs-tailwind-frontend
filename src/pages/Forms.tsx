import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { get } from 'lodash'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import FormsTable from '../components/forms/FormsTable'
import InfoBar from '../components/InfoBar'
import { usePagination } from '../helper/paginate'
import cx from "classnames";
import CreateFormModal from '../components/forms/CreateFormModal'
import DeleteModal from '../components/DeleteModal'
import AccessControl, { ROLES } from '../components/AccessControl'
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from '../redux/store'
import CompanyFinYearSelect from '../components/CompanyFinYearSelect'
import Pagination from '../components/Pagination'
import { useSearchParams } from 'react-router-dom'
import { useCreateForm, useDeleteForm, useGetForms } from '../hooks/form'
import useDebounce from '../helper/debounce'
import { getDatesOfFinancialYear } from '../helper/financialYear'
import { SORT_DIRECTION } from '../types/pagination'
import { useGetMeterForms } from '../hooks/meter'
import FormMetersModal from '../components/forms/FormMetersModal'


interface IProps { }

const Forms: FC<IProps> = () => {

  const { t } = useTranslation()
  const user = useSelector((state: RootState) => state.auth.user)
  const { company, year } = useSelector((state: RootState) => state.companyAndYear)
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [params] = useSearchParams();

  const [deleteFormModalVisible, setDeleteFormModalVisible] = useState<boolean>(false)
  const [filter, setFilter] = useState<string>("all");
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)
  const [search, setSearch] = useState<string>("");

  const [downloadMeterModalVisible, setDownloadMeterModalVisible] = useState<boolean>(false)
  const [selectedForm, setSelectedForm] = useState({})

  const deleteForm = useDeleteForm();
  const paginate = usePagination(10)
  const createForm = useCreateForm();
  
  const getMetersForms = useGetMeterForms({
    form: get(selectedForm, '_id'),
    page: 1,
    name: '',
    limit: 9999,
    company: user?.company?._id
  });

  const meters = get(getMetersForms, 'data.data', [])

  const debounceSearch = useDebounce(search, 200)
  const getForms = useGetForms({
    page: paginate.page,
    limit: paginate.resultPerPage,
    companyId: company?._id,
    search: debounceSearch,
    bookmarked: filter === "bookmarked" ? true : false,
    sort: sortBy,
    sortDirection
  })

  const forms = get(getForms, "data.data", []);
  const meta = get(getForms, "data.meta", {});

  useEffect(() => {
    if (filter === "bookmarked") {
      paginate.setPage(1)
    }
  }, [filter])

  useEffect(() => {
    const page = params.get("page")
    if (page) {
      paginate.setPage(Number(page))
    }
  }, [params])

  useEffect(() => {
    if (getForms.data) {
      const { data, meta } = get(getForms, "data") as any;

      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getForms.data])

  function handleRowClick(row) {

  }

  function handleRowDownload(item) {
    setSelectedForm(item)
    setDownloadMeterModalVisible(true)
    getMetersForms.refetch()
  }

  function handleCloseFormMeterModal() {
    setSelectedForm(null)
    setDownloadMeterModalVisible(false)
  }

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  function openCreateFormModal() {
    setFormModalVisible(true)
  }

  function handleConfirmClick(values: Array<string>) {

    const promises: Array<Promise<any>> = [];
    const yearEnd = company?.yearEnd || new Date();

    const finYear = getDatesOfFinancialYear(parseInt(year), yearEnd);

    values.forEach((formTemplateId: string) => {
      promises.push(createForm.mutateAsync({
        formTemplate: formTemplateId,
        company: company?._id,
        financialYear: finYear.endDate
      }))
    })

    Promise
      .all(promises)
      .then(() => {
        setFormModalVisible(false)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  function closeDeleteFormModal() {
    setDeleteFormModalVisible(false)
  }

  function handleDeleteClick(item: any) {
    setSelectedRow(item);
    setDeleteFormModalVisible(true)
  }

  function deleteFormConfirm() {
    deleteForm.mutate(selectedRow._id, {
      onSuccess: () => {
        setDeleteFormModalVisible(false)
      }
    })
  }

  return (
    <main className="p-5">
      {downloadMeterModalVisible ? (
        <FormMetersModal 
          meters={meters}
          form={selectedForm}
          closeModal={handleCloseFormMeterModal}
          isVisible={downloadMeterModalVisible}
          loading={getMetersForms.isLoading || getMetersForms.isRefetching}
        />
      ) : null}

      <DeleteModal
        label={selectedRow?.formTemplate?.name}
        title="Delete Form"
        closeModal={closeDeleteFormModal}
        loading={deleteForm.isLoading}
        onConfirm={deleteFormConfirm}
        isVisible={deleteFormModalVisible} />

      <CreateFormModal
        loading={createForm.isLoading}
        onConfirm={handleConfirmClick}
        closeModal={() => setFormModalVisible(false)}
        isVisible={formModalVisible} />

      <div className="flex justify-between items-center mt-10">
        <p className="text-3xl font-bold mb-3">{t("Forms")}</p>

        <CompanyFinYearSelect />
      </div>

      <section className="mt-5">
        <InfoBar
          totalToFillUp={get(meta, "meter.incomplete", 0)}
        />
      </section>

      <section className="mt-10">
        <div className="flex text-sm justify-between items-center mb-3">
          <div className={cx("bg-[#dbd6c7] pl-2 py-[2px]  border-[1px] text-black rounded-md text-sm ", {
            "w-[110px]": true
          })}>
            <select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                paginate.setPage(1)
                setTimeout(() => setFilter(e.target.value), 100)
              }}
              className="w-full">
              <option value="all">{t("See All")}</option>
              <option value="bookmarked">{t("Bookmarked")}</option>
            </select>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <AccessControl allowedRoles={[ROLES.SuperAdmin]}>
              <button
                data-cy="create-form-btn"
                onClick={openCreateFormModal}
                className="bg-gradient-to-l hover:opacity-90 rounded transition duration-150 text-[white] from-jll-red to-jll-red-light px-3 py-1 font-medium"
                type="button">
                {t("Create Form")}
              </button>
            </AccessControl>
            <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[260px] border-gray-200 gap-2 shadow-md items-center">
              <MagnifyingGlassIcon className="w-4 h-4" />
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder={t("Search")}
                className="flex-grow placeholder:text-sm"
                type="text" />
            </div>
          </div>
        </div>
        <FormsTable
          sortBy={sortBy}
          sortDirection={sortDirection}
          loading={getForms.isLoading}
          handleRowDownload={handleRowDownload}
          handleDeleteClick={handleDeleteClick}
          handleRowClick={handleRowClick}
          handleSortClick={onSortClick}
          page={paginate.page}
          header={[
            { label: "Index", sortable: false },
            { label: "File", sortable: true, key: "file" },
            { label: "Attachment", sortable: true, key: "attachment" },
            { label: "User Complete Schedule", sortable: true, key: "inputProgress" },
            { label: "Last Update Time", sortable: true, key: "updatedAt" },
            { label: "Admin Check Progress", sortable: true, key: "adminCheckedProgress" },
            { label: "", sortable: false },
          ]}
          data={forms}>
          <Pagination {...paginate} />
        </FormsTable>
      </section>
    </main>
  )
}

export default Forms