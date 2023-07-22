import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, useEffect, useState } from 'react'
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import MaterialsTable from '../components/materialList/MaterialListTable'
import AddMaterialModal from '../components/materialList/AddMaterialModal'
import { useTranslation } from "react-i18next"
import { usePagination } from '../helper/paginate'
import { get } from 'lodash'
import cx from "classnames";
import DeleteMaterial from '../components/materialList/DeleteMaterialModal'
import { MODAL_MODE } from '../types/modal'
import { useCreateMaterial, useDeleteMaterial, useGetMaterials, useUpdateMaterial } from '../hooks/material'
import Pagination from '../components/Pagination'
import useDebounce from '../helper/debounce'
import { useCreateCalculation } from '../hooks/calculation'
import { SORT_DIRECTION } from '../types/pagination'


const MaterialList = () => {

  const { t } = useTranslation()
  const [filter, setFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [deleteMaterialModalVisible, setDeleteMaterialModalVisible] = useState<boolean>(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const paginate = usePagination(10);
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();
  const createCalculation = useCreateCalculation();

  const debouncedSearch = useDebounce(search, 200)
  const getMaterialList = useGetMaterials({
    options: {},
    page: paginate.page,
    limit: paginate.resultPerPage,
    search: debouncedSearch,
    bookmarked: filter === "bookmarked" ? true : false,
    sort: sortBy,
    sortDirection
  });

  const materials = get(getMaterialList, "data.data", []);

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }


  function closeModal() {
    setAddUserModalVisible(false);
  }

  function handleRowClick(row) {
  }

  function openAddUserModal() {
    setMode(MODAL_MODE.create)
    setAddUserModalVisible(true)
  }

  function onEditClick(item: any) {
    setSelectedItem(item);
    setMode(MODAL_MODE.edit)
    setAddUserModalVisible(true)
  }

  function onConfirm(values: any) {
    const payload: { [key: string]: any } = {
      _id: values.id,
      name: values.name,
      uniqueId: values.uniqueId,
      size: Number(values.size),
      type: values.type,
    };

    if (values.type === "matrix") {
      payload.content = [
        {
          rows: values.rows,
          columns: values.columns
        }
      ]
    } else {
      payload.content = values.qnaRows
    }

    if (payload.type === "calculation") {
      if (mode === MODAL_MODE.create) {
        return createCalculation.mutate({
          name: values.name,
          uniqueId: values.uniqueId,
          unit: "m",
          size: Number(values.size),
          expression: values.expression
        })
      }
    }


    if (mode === MODAL_MODE.create) {
      delete payload._id;
      createMaterial.mutate(payload, {
        onSuccess: () => {
          setAddUserModalVisible(false)
        }
      })
    } else {
      updateMaterial.mutate(payload, {
        onSuccess: () => {
          setAddUserModalVisible(false)
        }
      })
    }
  }

  function handleDelete(item) {
    setSelectedItem(item);
    setDeleteMaterialModalVisible(true)
  }

  function handleDeleteMaterial() {
    deleteMaterial.mutate(selectedItem._id, {
      onSuccess: () => {
        setDeleteMaterialModalVisible(false)
      }
    })
  }

  useEffect(() => {
    if (getMaterialList.isSuccess) {
      const { data, meta } = getMaterialList.data as any;

      paginate.setMeta(meta)
      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getMaterialList.data])

  return (
    <main className="p-5">

      <DeleteMaterial
        label={selectedItem.name}
        loading={deleteMaterial.isLoading}
        onConfirm={handleDeleteMaterial}
        isVisible={deleteMaterialModalVisible}
        closeModal={() => setDeleteMaterialModalVisible(false)} />

      <AddMaterialModal
        mode={mode}
        values={selectedItem}
        isVisible={addUserModalVisible}
        loading={createMaterial.isLoading || updateMaterial.isLoading}
        onConfirm={onConfirm}
        closeModal={() => closeModal()} />

      <p className="text-3xl font-bold mb-3 mt-10">{t("Material List")}</p>

      <div className="flex items-center justify-start gap-5">
        <SmallDynamicWidget
          label="All Materials"
          value={paginate.count.toString()}
          increasedBy={20}
        />

        <SmallStaticWidget
          label="Add Material"
          onClick={openAddUserModal}
          description="Add a new material to material list"
        />
      </div>


      <div className="mt-10">
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

        {materials.length > 0 && (
          <MaterialsTable
            sortBy={sortBy}
            loading={getMaterialList.isLoading}
            sortDirection={sortDirection}
            handleSortClick={onSortClick}
            handleRowClick={handleRowClick}
            handleEdit={onEditClick}
            handleDelete={handleDelete}
            header={[
              { label: "Index" },
              { label: "File", key: "file" },
              { label: "Last Update Time", key: "updatedAt", sortable: true },
              { label: "" },
              { label: "" },
            ]}
            page={paginate.page}
            data={materials}>
            <Pagination {...paginate} />
          </MaterialsTable>
        )}
      </div>

    </main>
  )
}

export default MaterialList