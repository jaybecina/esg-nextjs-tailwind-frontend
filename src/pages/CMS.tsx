import { convertToRaw } from 'draft-js';
import { FC, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query';
import AddContentModal from '../components/cms/AddContentModal';
import CMStable from '../components/cms/cmsTable';
import DeleteModal from '../components/DeleteModal';
import Pagination from '../components/Pagination';
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import { usePagination } from '../helper/paginate';
import { useCreateContent, useDeleteContent, useGetContents, useUpdateContent } from '../hooks/content';
import { MODAL_MODE } from '../types/modal';
import { useTranslation } from "react-i18next"

interface IProps { }

const ContentManagementSystem: FC<IProps> = () => {

  const [data, setData] = useState<Array<any>>([]);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [addContentModalVisible, setAddContentModaVisible] = useState<boolean>(false);
  const [deleteCmsModalVisible, setDeleteCmsModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const { t } = useTranslation()
  const paginate = usePagination(10);
  const queryClient = useQueryClient();
  const createContent = useCreateContent();
  const deleteContent = useDeleteContent();
  const updateContent = useUpdateContent();
  const getContents = useGetContents(paginate.page, paginate.resultPerPage);

  function openAddContentModal() {
    setMode(MODAL_MODE.create)
    setAddContentModaVisible(true)
  }

  function closeAddContentModal() {
    setAddContentModaVisible(false)
  }

  function closeDeleteContentModal() {
    setDeleteCmsModalVisible(false)
  }

  function handleEditClick(row: any) {
    setSelectedRow(row)
    setMode(MODAL_MODE.edit)
    setAddContentModaVisible(true)
  }

  function handleDeleteClick(row: any) {
    setSelectedRow(row)
    setDeleteCmsModalVisible(true)
  }

  function handleAddContent(values: any) {
    createContent.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries("contents")
        setAddContentModaVisible(false)
      }
    })
  }

  function handleEditContent(values: any) {
    const payload = {
      id: values.id,
      data: {
        title: values.title,
        category: values.category,
        content: JSON.stringify(convertToRaw(values.content)),
        customFields: values.customFields
      }
    }

    updateContent.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries("contents")
        setAddContentModaVisible(false)
      }
    })
  }

  function onConfirm(values: any) {
    const payload = {
      id: values.id,
      title: values.title,
      category: values.category,
      thumbnail: "",
      content: JSON.stringify(convertToRaw(values.content)),
      slug: "",
      customFields: values.customFields,
    }

    if (mode === MODAL_MODE.create) {
      handleAddContent(payload)
    } else {
      handleEditContent(values)
    }
  }

  function handleDeleteContent() {
    deleteContent.mutate(selectedRow._id, {
      onSuccess: () => {
        queryClient.invalidateQueries("contents")
        setDeleteCmsModalVisible(false)
      }
    })
  }

  useEffect(() => {
    if (getContents.data) {
      const { data, meta } = getContents.data as any;
      setData(data);
      paginate.setMeta(meta)
      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getContents.data])


  return (
    <section className="p-5">

      {addContentModalVisible && (
        <AddContentModal
          loading={createContent.isLoading || updateContent.isLoading}
          mode={mode}
          values={selectedRow}
          isVisible={addContentModalVisible}
          closeModal={closeAddContentModal}
          onConfirm={onConfirm} />)}

      <DeleteModal
        title="Delete Content"
        loading={deleteContent.isLoading}
        isVisible={deleteCmsModalVisible}
        onConfirm={handleDeleteContent}
        label={`${selectedRow.title}`}
        closeModal={closeDeleteContentModal} />

      <p className="text-3xl font-bold mb-3 mt-10">{t("CMS")}</p>

      <div className="flex items-center justify-start gap-5 mb-5">
        <SmallDynamicWidget
          label="Total Content"
          value={paginate.count.toString()}
          increasedBy={null}
        />

        <SmallStaticWidget
          label="Add Content"
          onClick={openAddContentModal}
          description="Add a new content"
        />
      </div>

      {data && data.length > 0 && (
        <CMStable
          handleEdit={handleEditClick}
          handleDelete={handleDeleteClick}
          page={paginate.page}
          header={["ID", "Title", "Category", ""]}
          data={data}>
          <Pagination {...paginate} />
        </CMStable>
      )}
    </section>
  )
}

export default ContentManagementSystem