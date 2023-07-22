import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import { MODAL_MODE } from '../types/modal'
import { usePagination } from '../helper/paginate'
import cx from "classnames"
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCreateCalculation, useDeleteCalculation, useGetCalculations, useUpdateCalculation } from '../hooks/calculation'
import useDebounce from '../helper/debounce'
import { get } from 'lodash'
import CalculationTable from '../components/CalculationTable'
import Pagination from '../components/Pagination'
import CreateEditCalculationModal from '../components/CreateEditCalculationModal'
import DeleteModal from '../components/DeleteModal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AutocompleteField from '../components/AutocompleteField'
import { SORT_DIRECTION } from '../types/pagination'

const Calculation = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [search, setSearch] = useState<string>("");

  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  const paginate = usePagination(10);
  const debouncedSearch = useDebounce(search, 200)
  const createCalculation = useCreateCalculation()
  const updateCalculation = useUpdateCalculation()
  const deleteCalculation = useDeleteCalculation()
  const getCalculations = useGetCalculations({
    page: paginate.page,
    limit: paginate.resultPerPage,
    name: debouncedSearch,
    sort: sortBy,
    sortDirection
  })

  const calculations = get(getCalculations, "data.data", []);

  function openAddCalculationModal() {
    setMode(MODAL_MODE.create)
    setAddModalVisible(true)
  }

  function onEditClick(item: any) {
    setSelectedItem(item);
    setMode(MODAL_MODE.edit)
    setAddModalVisible(true)

    navigate({
      pathname: window.location.pathname,
      search: `?calculation_id=${item._id}`
    })
  }

  function handleDelete(item) {
    setSelectedItem(item);
    setDeleteModalVisible(true)
  }

  function closeModal() {
    setAddModalVisible(false)
  }

  function handleDeleteCalculation() {
    deleteCalculation.mutate(selectedItem._id, {
      onSuccess: () => {
        setDeleteModalVisible(false)
      }
    })
  }

  function handleFormSubmit(values: any) {
    if (mode === MODAL_MODE.create) {
      createCalculation.mutate(values, {
        onSuccess: () => {
          closeModal()
        }
      })
    } else {
      updateCalculation.mutate({
        id: params.get("calculation_id"),
        data: values
      }, {
        onSuccess: () => {
          closeModal()
        }
      })
    }
  }

  useEffect(() => {
    if (getCalculations.isSuccess) {
      const { data, meta } = getCalculations.data as any;

      paginate.setMeta(meta)
      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getCalculations.data])

  return (
    <main className="p-5">

      <p className="text-3xl font-bold mb-3 mt-10">{t("Calculation List")}</p>

      <CreateEditCalculationModal
        isVisible={addModalVisible}
        closeModal={closeModal}
        loading={createCalculation.isLoading || updateCalculation.isLoading}
        onConfirm={handleFormSubmit}
        mode={mode}
      />

      <DeleteModal
        title="Delete Calculation"
        label={selectedItem.name}
        loading={deleteCalculation.isLoading}
        onConfirm={handleDeleteCalculation}
        isVisible={deleteModalVisible}
        closeModal={() => setDeleteModalVisible(false)} />

      <div className="flex items-center justify-start gap-5">
        <SmallDynamicWidget
          label="All Calculations"
          value={paginate.count.toString()}
          increasedBy={20}
        />

        <SmallStaticWidget
          label="Add Calculation"
          onClick={openAddCalculationModal}
          description="Add a new calculation to calculation list"
        />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex gap-3 items-center">

              <div className={cx("bg-[#dbd6c7] pl-2 py-[2px]  border-[1px] text-black rounded-md text-sm ", {
                "w-[120px]": true
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
            </div>
          </div>

          <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[260px] border-gray-200 gap-2 shadow-md items-center">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <input
              placeholder={t("Search")}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-grow placeholder:text-sm"
              type="text" />
          </div>
        </div>
      </section>

      <CalculationTable
        sortBy={sortBy}
        sortDirection={sortDirection}
        handleEdit={onEditClick}
        handleDelete={handleDelete}
        handleSortClick={onSortClick}
        header={[
          { label: "Index" },
          { label: "Name", key: "name", sortable: true },
          { label: "Last Update Time", key: "updatedAt", sortable: true },
          { label: "" },
        ]}
        page={paginate.page}
        data={calculations}>
        <Pagination {...paginate} />
      </CalculationTable>

    </main>
  )
}

export default Calculation