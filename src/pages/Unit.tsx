import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query';
import DeleteModal from '../components/DeleteModal';
import Pagination from '../components/Pagination';
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import AddUnitModal from '../components/unit/AddUnitModal';
import UnitsTable from '../components/unit/UnitsTable';
import { usePagination } from '../helper/paginate';
import { useTranslation } from "react-i18next"
import { UnitPayloadType, useCreateUnit, useDeleteUnit, useGetUnits, useUpdateUnit } from '../hooks/unit';
import { MODAL_MODE } from '../types/modal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SORT_DIRECTION } from '../types/pagination';
import useDebounce from '../helper/debounce';

interface IProps { }

const Unit: FC<IProps> = () => {

  const [data, setData] = useState<Array<any>>([]);
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [addUnitModalVisible, setAddUnitModalVisible] = useState<boolean>(false);
  const [deleteUnitModalVisible, setDeleteUnitModalVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const searchDebounced = useDebounce(search, 200);

  const { t } = useTranslation()
  const paginate = usePagination(10);
  const queryClient = useQueryClient();
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const getUnits = useGetUnits(
    paginate.page,
    paginate.resultPerPage,
    sortBy,
    sortDirection,
    searchDebounced
  );

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  function openAddUnitModal() {
    setAddUnitModalVisible(true)
  }

  function closeAddUnitModal() {
    setAddUnitModalVisible(false)
  }

  function closeDeleteUnitModal() {
    setDeleteUnitModalVisible(false)
  }

  function handleEditClick(row: any) {
    setMode(MODAL_MODE.edit)
    setSelectedRow(row)
    setAddUnitModalVisible(true)
  }

  function handleDeleteClick(row: any) {
    setSelectedRow(row)
    setDeleteUnitModalVisible(true)
  }

  function handleAddUnit(values: any) {
    createUnit.mutate(values, {
      onSuccess: () => {
        setAddUnitModalVisible(false)
        queryClient.invalidateQueries("units")
      },
      onError: () => {
        setAddUnitModalVisible(true)
      }
    })
  }

  function handleDeleteUnit() {
    deleteUnit.mutate(selectedRow._id, {
      onSuccess: () => {
        setDeleteUnitModalVisible(false)
        queryClient.invalidateQueries("units")
      }
    })
  }

  function handleEditUnit(values: any) {
    updateUnit.mutate(values, {
      onSuccess: () => {
        setAddUnitModalVisible(false)
        queryClient.invalidateQueries("units")
      }
    })
  }

  function handleFormSubmit(values: any) {
    const payload: UnitPayloadType = {
      id: values.id,
      input: values.inputUnit,
      output: values.outputUnit,
      rate: values.rate,
    }

    if (mode === MODAL_MODE.create) {
      handleAddUnit(payload)
    } else {
      handleEditUnit(payload)
    }
  }

  useEffect(() => {
    if (getUnits.data) {
      const { data, meta } = getUnits.data as any;
      setData(data);
      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getUnits.data])
  return (
    <section className="p-5">

      <AddUnitModal
        values={selectedRow}
        loading={createUnit.isLoading || updateUnit.isLoading}
        mode={mode}
        isVisible={addUnitModalVisible}
        closeModal={closeAddUnitModal}
        onConfirm={handleFormSubmit} />

      <DeleteModal
        title="Delete unit"
        loading={deleteUnit.isLoading}
        isVisible={deleteUnitModalVisible}
        closeModal={closeDeleteUnitModal}
        label={`${selectedRow.input} to ${selectedRow.output}`}
        onConfirm={handleDeleteUnit} />

      <p className="text-3xl font-bold mb-3 mt-10">{t("Unit Setting")}</p>

      <div className="flex items-center justify-start gap-5 mb-5">
        <SmallDynamicWidget
          label={t("Total Units")}
          value={paginate.count.toString()}
          increasedBy={null} />

        <SmallStaticWidget
          label={t("Add Unit")}
          onClick={openAddUnitModal}
          description={t("Add a new unit for unit conversion")} />
      </div>

      <div className="mt-10 flex justify-end items-center mb-3">
        <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[260px] border-gray-200 gap-2 shadow-md items-center">
          <MagnifyingGlassIcon className="w-4 h-4" />
          <input
            placeholder={t("Search")}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="flex-grow placeholder:text-sm"
            type="text" />
        </div>
      </div>

      {data && data.length > 0 && (
        <UnitsTable
          page={paginate.page}
          resultPerPage={paginate.resultPerPage}
          handleEdit={handleEditClick}
          handleDelete={handleDeleteClick}
          handleSortClick={onSortClick}
          sortBy={sortBy}
          sortDirection={sortDirection}
          header={[
            {label: 'ID'},
            {label: 'Input Unit', key: 'input', sortable: true},
            {label: 'Output Unit', key: 'output', sortable: true },
            {label: 'Rate', key: 'rate', sortable: true},
            {label: ''},
          ]}
          data={data}>
          <Pagination {...paginate} />
        </UnitsTable>
      )}
    </section>
  )
}

export default Unit