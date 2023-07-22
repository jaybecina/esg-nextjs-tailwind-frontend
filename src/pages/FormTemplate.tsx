import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import SmallDynamicWidget from '../components/SmallDynamicWidget';
import SmallStaticWidget from '../components/SmallStaticWidget';
import cx from "classnames";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import FormTemplatesTable from '../components/tables/FormTemplatesTable';
import { usePagination } from '../helper/paginate';
import FormTemplateModal from '../components/formTemplate/FormTemplateModal';
import { MODAL_MODE } from '../types/modal';
import DeleteModal from '../components/DeleteModal';
import { FormTemplatePayloadType, useCreateFormTemplate, useDeleteFormTemplate, useGetFormTemplates, useUpdateFormTemplate } from '../hooks/formTemplate';
import { get, sortBy } from 'lodash';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import useDebounce from '../helper/debounce';
import { useAlertBox } from '../hooks/alertBox';
import AddEditFormTemplateModal from '../components/formTemplate/AddEditFormTemplateModal';
import { SORT_DIRECTION } from '../types/pagination';

const FormTemplate: FC<any> = () => {

  const { t } = useTranslation();

  const paginate = usePagination(10);
  const navigate = useNavigate();
  const createFormTemplate = useCreateFormTemplate();
  const deleteFormTemplate = useDeleteFormTemplate();
  const updateFormTemplate = useUpdateFormTemplate();
  const alertBox = useAlertBox()

  const [params] = useSearchParams();
  const [formTemplateModalVisible, setFormTemplateModalVisible] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});

  const [deleteFormModalVisible, setDeleteFormModalVisible] = useState<boolean>(false)
  const [filter, setFilter] = useState<string>("all");
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [search, setSearch] = useState<string>("")

  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const debounceSearch = useDebounce(search, 200)
  const getFormTemplates = useGetFormTemplates(
    true, 
    paginate.page,
    paginate.resultPerPage,
    debounceSearch,
    sortBy,
    sortDirection
  );
  const formTemplates = get(getFormTemplates, "data.data", []);

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  function openModal() {
    setMode(MODAL_MODE.create)
    setFormTemplateModalVisible(true)
  }

  function closeModal(modal: string) {
    if (modal === "form-template") setFormTemplateModalVisible(false)
    if (modal === "delete-template") setDeleteFormModalVisible(false)

    navigate({
      pathname: window.location.pathname,
      search: createSearchParams({}).toString()
    })
  }

  function handleDelete(item: any) {
    setSelectedRow(item);
    setDeleteFormModalVisible(true)
  }

  function handleDeleteFormTemplate() {
    deleteFormTemplate.mutate(selectedRow._id, {
      onSuccess: () => {
        closeModal("delete-template")
      }
    })
  }

  function onConfirm(values: any) {
    const templateId: string = "";
    const payload: FormTemplatePayloadType = {
      name: values.name,
      uniqueId: values.uniqueId,
      materials: values.materials
    }

    if (mode === MODAL_MODE.create) {
      createFormTemplate.mutate(payload, {
        onSuccess: () => {
          closeModal("form-template")
        }
      })

    } else {
      updateFormTemplate.mutate({
        id: params.get("form_template_id"),
        data: payload
      }, {
        onSuccess: () => {
          closeModal("form-template")
        }
      })
    }
  }

  function handleEdit(item: any) {
    openModal();
    setSelectedRow(item);
    setMode(MODAL_MODE.edit)

    navigate({
      pathname: window.location.pathname,
      search: createSearchParams({
        form_template_id: item._id
      }).toString()
    })
  }

  useEffect(() => {
    const page = params.get("page")
    if (page) {
      paginate.setPage(Number(page))
    }
  }, [params])

  useEffect(() => {
    if (getFormTemplates.data) {
      const { data, meta } = get(getFormTemplates, "data") as any;

      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getFormTemplates.data])


  return (
    <section className="p-5">

      <AddEditFormTemplateModal
        mode={mode}
        loading={createFormTemplate.isLoading || updateFormTemplate.isLoading}
        onConfirm={onConfirm}
        isVisible={formTemplateModalVisible}
        closeModal={() => closeModal("form-template")} />

      <DeleteModal
        label={selectedRow.name}
        title="Delete Form Template"
        closeModal={() => closeModal("delete-template")}
        loading={deleteFormTemplate.isLoading}
        onConfirm={handleDeleteFormTemplate}
        isVisible={deleteFormModalVisible} />

      <p className="text-3xl font-bold mb-3 mt-10">{t("Form Template")}</p>

      <div className="flex items-center justify-start gap-5 mb-5">
        <SmallDynamicWidget
          label={t("All Template")}
          value={paginate.count.toString()}
          increasedBy={null} />

        <SmallStaticWidget
          label={t("Add Form Template")}
          onClick={openModal}
          description={t("Add a new form template to form template list")} />
      </div>

      <div className="flex text-sm justify-between items-center mb-3">
        <div className={cx("bg-[#dbd6c7] pl-2 py-[2px]  border-[1px] text-black rounded-md text-sm ", {
          "w-[110px]": true
        })}>
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
            className="w-full">
            <option value="all">{t("See All")}</option>
          </select>
        </div>
        <div className="flex items-center gap-3 justify-end">
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

      <FormTemplatesTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleSortClick={onSortClick}
        sortBy={sortBy}
        sortDirection={sortDirection}
        header={[
          { label: "Name" },
          { label: "Unique ID" },
          { label: "Last Update Time", key: "updatedAt", sortable: true },
        ]}
        data={formTemplates}>
        <Pagination {...paginate} />
      </FormTemplatesTable>
    </section>
  )
}

export default FormTemplate;