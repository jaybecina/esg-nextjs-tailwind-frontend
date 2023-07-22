import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, useEffect, useState } from 'react'
import AddCompanyModal from '../components/companyList/AddCompanyModal'
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import Table from '../components/Table'
import { usePagination } from '../helper/paginate'
import { useCreateCompany, useDeleteCompany, useGetCompanyList, useUpdateCompany } from '../hooks/company'
import { useQueryClient } from 'react-query'
import { useAlertBox } from '../hooks/alertBox'
import { useTranslation } from "react-i18next"
import { get } from 'lodash'
import Pagination from '../components/Pagination'
import DeleteModal from '../components/DeleteModal'
import UpdateCompanyModal from '../components/companyList/UpdateCompanyModal'
import useDebounce from '../helper/debounce'
import { SORT_DIRECTION } from '../types/pagination'

const CompanyList = () => {

  const [selectedItem, setSelectedItem] = useState<{ [key: string]: any }>({});
  const [addCompanyModalVisble, setAddCompanyModalVisible] = useState<boolean>(false);
  const [updateCompanyModalVisible, setUpdateCompanyModalVisible] = useState<boolean>(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState<boolean>(false);
  const [search, setSeach] = useState<string>("")
  const debounceSearch = useDebounce(search, 500)

  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const { t } = useTranslation()
  const paginate = usePagination(10)
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const createCompany = useCreateCompany();
  const deleteCompany = useDeleteCompany();
  const updateCompany = useUpdateCompany();
  const getCompanyList = useGetCompanyList(
    paginate.page,
    paginate.resultPerPage, 
    debounceSearch,
    sortBy,
    sortDirection
  );

  const companyList = get(getCompanyList, "data.data", []);

  function closeModal() {
    setAddCompanyModalVisible(false)
    setUpdateCompanyModalVisible(false)
  }

  function openAddCompanyModal() {
    setAddCompanyModalVisible(true)
  }

  function handleDeleteUserClick(item: any) {
    setSelectedItem(item)
    setDeleteUserModalVisible(true)
  }

  function handleEditItem(item: any) {
    setSelectedItem(item);
    setUpdateCompanyModalVisible(true)
  }

  function handleDeleteItem() {
    deleteCompany.mutate(selectedItem._id, {
      onSuccess: () => {
        setDeleteUserModalVisible(false)
        queryClient.invalidateQueries("company-list")
      }
    })
  }

  function showError(error: any) {
    alertBox.show({
      type: "error",
      title: "Something went wrong",
      description: error || "Please check your inputted data"
    })
  }

  function handleUpdateCompany(values: any) {
    const formData = new FormData();

    formData.append("email", values.companyEmail);
    formData.append("name", values.companyName);
    formData.append("phone", values.companyPhone);
    formData.append("location", values.location);
    formData.append("admin", values.admin);
    formData.append("expiryDate", values.expiryDate);
    formData.append("submissionDeadline", values.submissionDeadline);
    formData.append("defaultLanguage", values.defaultLanguage);

    // if (values.logo instanceof File) {
    formData.append("logo", values.logo ? values.logo : null);
    // }

    updateCompany.mutate({
      id: values.id,
      company: formData
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries("company-list")
        closeModal()
      },
      onError: (error: any) => {
        console.log(error)
        showError(error.data.message)
      }
    })
  }

  async function handleCreateCompany(values: any) {
    try {
      const formData = new FormData()

      formData.append("admin[email]", values.email)
      formData.append("admin[password]", values.password)
      formData.append("admin[name]", values.name)
      formData.append("admin[role]", "client-admin")
      formData.append("admin[defaultLanguage]", values.language)

      formData.append("logo", values.logo);
      formData.append("name", values.companyName)
      formData.append("location", values.location);
      formData.append("email", values.companyEmail)
      formData.append("phone", values.companyPhone)
      formData.append("yearEnd", values.reportDate)
      formData.append("expiryDate", values.expiryDate)
      formData.append("submissionDeadline", values.submissionDeadline)
      formData.append("defaultLanguage", values.defaultLanguage)

      createCompany.mutate(formData, {
        onSuccess: () => {
          queryClient.invalidateQueries("company-list")
          closeModal()
        }
      })

    } catch (error) {
      showError(error.data.message)
    }
  }

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  useEffect(() => {
    if (getCompanyList.isSuccess) {

      const meta = get(getCompanyList, "data.meta", { count: 0, page: 1 });
      paginate.setMeta(meta)

      if (companyList.length === 0 && meta?.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getCompanyList.data])

  return (
    <main className="p-5">
      <DeleteModal
        title="Delete Company"
        loading={deleteCompany.isLoading}
        isVisible={deleteUserModalVisible}
        onConfirm={handleDeleteItem}
        label={selectedItem.name}
        closeModal={() => setDeleteUserModalVisible(false)} />

      <AddCompanyModal
        loading={createCompany.isLoading}
        onConfirm={handleCreateCompany}
        isVisible={addCompanyModalVisble}
        closeModal={closeModal} />

      <UpdateCompanyModal
        loading={updateCompany.isLoading}
        onConfirm={handleUpdateCompany}
        values={selectedItem}
        isVisible={updateCompanyModalVisible}
        closeModal={closeModal} />

      <p className="text-3xl font-bold mb-3  mt-10">{t("Company List")}</p>

      <div className="flex items-center justify-start gap-5">
        <SmallDynamicWidget
          label="In Progress Report"
          value="1,026"
          increasedBy={29}
        />
        <SmallDynamicWidget
          label="Companies Number"
          value={paginate.count.toString()}
          increasedBy={12}
        />

        <SmallStaticWidget
          label="Add Company"
          onClick={openAddCompanyModal}
          description="Add a new company to our company list"
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-gray-500">
            <p className="text-sm">{t("All")} {paginate.totalPages} {t("Pages")}</p>
            <div className="flex gap-2 items-center">
              <p className="text-sm">{t("Result per page")}</p>
              <select
                value={paginate.resultPerPage.toString()}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => paginate.setResultPerPage(parseInt(e.target.value))}
                className="w-[55px] h-[22px] text-sm pl-4 bg-white shadow-md border-[1px] rounded-md">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>

          <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[260px] border-gray-200 gap-2 shadow-md items-center">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <input
              placeholder={t("Search")}
              data-cy="search-company-input"
              onChange={e => setSeach(e.target.value)}
              className="flex-grow placeholder:text-sm"
              type="text" />
          </div>
        </div>

        <Table
          sortBy={sortBy}
          sortDirection={sortDirection}
          page={paginate.page}
          resultPerPage={paginate.resultPerPage}
          loading={getCompanyList.isLoading}
          handleSortClick={onSortClick}
          handleEdit={handleEditItem}
          handleDelete={handleDeleteUserClick}
          header={[
            // "ID", "Company Name", "Business Owner", "Contact", "User Complete Schedule", "Last Update Time", "Date of Expiry", "Admin Check Progress", ""
            {label: 'ID'},
            {label: 'Company Name', key: 'name', sortable: true},
            {label: 'Business Owner'},
            {label: 'Contact'},
            {label: 'User Complete Schedule', key: 'inputProgress', sortable: true },
            {label: 'Last Update Time', key: 'updatedAt', sortable: true },
            {label: 'Date of Expiry'},
            {label: 'Admin Check Progress', key: 'adminCheckedProgress', sortable: true },
            {label: '' },
          ]}
          data={companyList}>
          <Pagination {...paginate} />
        </Table>
      </div>

    </main>
  )
}

export default CompanyList