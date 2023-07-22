import React, { ChangeEvent, useEffect, useState } from 'react'
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import ConstantSettingTable from '../components/constantSetting/ConstantSettingTable'
import { usePagination } from '../helper/paginate'
import { useTranslation } from "react-i18next"
import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import cx from "classnames"
import Pagination from '../components/Pagination'
import AddConstantModal from '../components/constantSetting/AddConstantModal'
import { MODAL_MODE } from '../types/modal'
import { IConstantSetting, useCreateConstant, useDeleteConstant, useGetConstant, useUpdateConstant } from '../hooks/constant'
import { get } from 'lodash'
import slugify from 'slugify'
import DeleteModal from '../components/DeleteModal'
import useDebounce from '../helper/debounce'
import { SORT_DIRECTION } from '../types/pagination'

type ConstantItemType = {
  name: string;
  year: any;
}

const ConstantSetting = () => {

  const { t } = useTranslation();
  const paginate = usePagination(10);

  const [selectedRow, setSelectedRow] = useState<any>({});
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [deleteConstantVisble, setDeleteConstantVisible] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const debounceSearch = useDebounce(search, 200)
  const createConstant = useCreateConstant();
  const deleteConstant = useDeleteConstant();
  const updateConstant = useUpdateConstant();
  const getConstant = useGetConstant({ 
    page: paginate.page, limit: 10,
    sort: sortBy,
    sortDirection,
    search: debounceSearch
  });

  const [params, setParams] = useSearchParams()

  const constantList = get(getConstant, "data.data", []);

  function openAddContentSettingModal() {
    setMode(MODAL_MODE.create)
    setAddModalVisible(true)
  }

  function handleDeleteItem(row: IConstantSetting) {
    setSelectedRow(row)
    setDeleteConstantVisible(true)
  }

  function handleEditClick(row: IConstantSetting) {
    setSelectedRow(row)
    setMode(MODAL_MODE.edit)
    setAddModalVisible(true)
  }

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  function onConfirm(values: any) {
    const payload: IConstantSetting = {
      name: values.name,
      uniqueId: slugify(values.name, { replacement: "-", remove: /[#^^{};<>=_,?*+~.()'"!:@]/g, lower: true }),
      year: parseInt(values.year),
      unit: values.unit,
      remarks: "",
      meta: values.content
    }

    if (mode === MODAL_MODE.create) {
      createConstant.mutate(payload, {
        onSuccess: () => {
          setAddModalVisible(false)
        }
      })
    } else {
      updateConstant.mutate({
        id: selectedRow._id,
        data: payload
      }, {
        onSuccess: () => {
          setAddModalVisible(false)
        }
      })
    }

  }

  function closeModal(modal: string) {
    if (modal === "delete") { }

    setAddModalVisible(false)
  }

  function onDeleteConstantConfirm() {
    deleteConstant.mutate(selectedRow._id, {
      onSuccess: () => {
        setDeleteConstantVisible(false)
      }
    })
  }


  useEffect(() => {
    if (getConstant.data) {
      const { data, meta } = get(getConstant, "data") as any;

      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getConstant.data])

  return (
    <main className="p-5">

      <DeleteModal
        title="Delete Constant"
        loading={deleteConstant.isLoading}
        label={selectedRow.name}
        isVisible={deleteConstantVisble}
        onConfirm={onDeleteConstantConfirm}
        closeModal={() => setDeleteConstantVisible(false)} />

      <AddConstantModal
        mode={mode}
        values={selectedRow}
        isVisible={addModalVisible}
        loading={createConstant.isLoading || updateConstant.isLoading}
        onConfirm={onConfirm}
        closeModal={closeModal} />

      <p className="text-3xl font-bold mb-3 mt-10">{t("Constant Setting")}</p>

      <section className="flex items-center justify-start gap-5">
        <SmallDynamicWidget
          label="All Materials"
          value={paginate.count.toString()}
          increasedBy={20}
        />

        <SmallStaticWidget
          label="Add Constant"
          onClick={openAddContentSettingModal}
          description="Add a new constant for unit conversion"
        />
      </section>

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


      <ConstantSettingTable
        data={constantList}
        page={paginate.page}
        loading={getConstant.isLoading}
        handleEdit={handleEditClick}
        handleDelete={handleDeleteItem}
        handleSortClick={onSortClick}
        sortBy={sortBy}
        sortDirection={sortDirection}
        header={[
          {label: 'ID'},
          {label: 'Name', key: 'name', sortable: true },
          {label: "Year"},
          {label: 'Last Updated Time', key: 'updatedAt', sortable: true },
        ]}
      >
        <Pagination {...paginate} />
      </ConstantSettingTable>
    </main>
  )
}

export default ConstantSetting