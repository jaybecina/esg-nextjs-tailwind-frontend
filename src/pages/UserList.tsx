import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { get } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import DeleteModal from '../components/DeleteModal'
import Pagination from '../components/Pagination'
import SmallDynamicWidget from '../components/SmallDynamicWidget'
import SmallStaticWidget from '../components/SmallStaticWidget'
import AddUserModal from '../components/userList/AddUserModal'
import Table from '../components/userList/UserListTable'
import { usePagination } from '../helper/paginate'
import { useAlertBox } from '../hooks/alertBox'
import { useCreateUser, useDeleteUser, useGetUserList, useUpdateUser } from '../hooks/auth'
import { MODAL_MODE } from '../types/modal'
import { useTranslation } from "react-i18next"
import { useSearchParams } from 'react-router-dom'
import useDebounce from '../helper/debounce'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { SORT_DIRECTION } from '../types/pagination'

const UserList = () => {

  const [data, setData] = useState<Array<any>>([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [addUserModalVisible, setAddUserModalVisible] = useState<boolean>(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const company = useSelector((state: RootState) => state.companyAndYear.company);

  const [params, setParams] = useSearchParams()
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const { t } = useTranslation();
  const paginate = usePagination(10)
  const queryClient = useQueryClient();
  const deleteUser = useDeleteUser();
  const debouncedUserQuery = useDebounce(userQuery, 300)
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const alertBox = useAlertBox();
  const getUserList = useGetUserList({ 
    page: paginate.page,
    name: debouncedUserQuery,
    limit: paginate.resultPerPage,
    sort: sortBy,
    sortDirection
  });
  
  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  function showError(error: any) {
    alertBox.show({
      type: "error",
      title: "Something went wrong",
      description: error.data.message || "Please check your inputted data"
    })
  }

  function closeModal() {
    setAddUserModalVisible(false)
  }

  function openAddUserModal() {
    setMode(MODAL_MODE.create)
    setAddUserModalVisible(true)
  }

  function onDeleteClick(item: any) {
    setSelectedItem(item);
    setDeleteUserModalVisible(true)
  }

  function handleEditClick(item: any) {
    setSelectedItem(item);
    setMode(MODAL_MODE.edit)
    setAddUserModalVisible(true)
  }

  function handleUserUpdate(values: any) {
    updateUser.mutate(values, {
      onSuccess: () => {
        closeModal()
        queryClient.invalidateQueries("user-list")
      },
      onError: (error: any) => {
        showError(error)
      }
    })
  }

  function handleUserCreate(values: any) {
    createUser.mutate(values, {
      onSuccess: () => {
        closeModal()
        queryClient.invalidateQueries("user-list")
      },
      onError: (error: any) => {
        showError(error)
      }
    })
  }

  function onConfirm(values) {
    const payload = {
      id: values.id,
      role: values.role,
      email: values.email,
      password: values.password,
      name: values.name,
      company: values.company,
      phone: values.phone,
      defaultLanguage: values.language
    }

    if (mode === MODAL_MODE.create) {
      delete payload.id;
      handleUserCreate(payload)
    } else {
      delete payload.password;
      // delete payload.role;

      handleUserUpdate(payload)
    }
  }

  function removeItem() {
    deleteUser.mutate(selectedItem._id, {
      onSuccess: () => {
        setDeleteUserModalVisible(false)
      }
    })
  }

  useEffect(() => {
    const page = params.get("page")
    if (page) {
      paginate.setPage(Number(page))
    }
  }, [params])

  useEffect(() => {
    if (getUserList.data) {
      const { data, meta } = get(getUserList, "data") as any;

      setData(data);
      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getUserList.data])

  return (
    <main className="p-5">

      <DeleteModal
        title="Delete User"
        loading={deleteUser.isLoading}
        onConfirm={removeItem}
        label={selectedItem.name}
        isVisible={deleteUserModalVisible}
        closeModal={() => setDeleteUserModalVisible(false)} />

      <AddUserModal
        mode={mode}
        values={selectedItem}
        loading={createUser.isLoading || updateUser.isLoading}
        onConfirm={onConfirm}
        isVisible={addUserModalVisible}
        closeModal={closeModal} />

      <p className="text-3xl font-bold mb-3 mt-10">
        {t("User List")}
      </p>

      <div className="flex items-center justify-start gap-5">
        <SmallDynamicWidget
          label="Total Users"
          value={paginate.count.toString()}
          increasedBy={12}
        />

        <SmallStaticWidget
          label="Add User"
          onClick={openAddUserModal}
          description="Add a new user to our User List"
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-gray-500">
            <p className="text-sm">{t("All")} {paginate.totalPages} {t("Pages")}</p>
            <div className="flex gap-2 items-center">
              <p className="text-sm">{t("Result per page")}</p>
              <div className="bg-white text-sm pl-3 shadow-md border-[1px] rounded-md">
                <select
                  value={paginate.resultPerPage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => paginate.setResultPerPage(Number(e.target.value))}
                  className="w-[40px]">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[260px] border-gray-200 gap-2 shadow-md items-center">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <input
              placeholder={t("Search")}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUserQuery(e.target.value)}
              className="flex-grow placeholder:text-sm"
              type="text" />
          </div>
        </div>

        <Table
          handleEdit={handleEditClick}
          handleDelete={onDeleteClick}
          handleSortClick={onSortClick}
          sortBy={sortBy}
          sortDirection={sortDirection}
          page={paginate.page}
          resultPerPage={paginate.resultPerPage}
          header={[
            {label: 'ID'},
            {label: 'Company Name', key: 'companyName'},
            {label: 'Name', key: 'name', sortable: true },
            {label: 'Phone'},
            {label: 'Email'},
            {label: 'Role'},
            {label: ''},
          ]}
          data={data} >
          <Pagination {...paginate} />
        </Table>
      </div>

    </main>
  )
}

export default UserList