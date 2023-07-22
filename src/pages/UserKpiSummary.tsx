import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react'
import { usePagination } from '../helper/paginate'
import { MODAL_MODE } from '../types/modal'
import { CreateMeterPayloadType, useCreateMeterForm, useDeleteMeter, useGetMeterForms, useRenameMatrixAttachment, useUpdateMeter, useUploadMeterAttachment } from '../hooks/meter'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { get, isEmpty } from 'lodash'
import { useGetForm, useGetFormNotifications, useLockForm, useReleaseForm, useUpdateForm } from '../hooks/form'
import { useGetMeterFormMaterials } from '../hooks/material'
import { generateFormInitialValues, useProcessFormMaterials } from '../helper/processFormMaterials'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import { useQueryClient } from 'react-query'
import { useGetUserList } from '../hooks/auth'
import { useAlertBox } from '../hooks/alertBox'
import ReactPaginate from 'react-paginate'
import AddMeterModal from '../components/kpuSummary/AddMeterModal'
import MessageBox from '../components/MessageBox'
import ReportPageHeader from '../components/report/ReportPageHeader'
import FormBuilderMeterItem from '../components/FormBuilderMeterItem'
import AccessControl, { ROLES } from '../components/AccessControl'
import DeleteModal from '../components/DeleteModal'
import { FORM_STATUS, getNextState } from '../types/formState'
import FormStatus from '../components/FormStatus'
import { useInView } from 'react-intersection-observer'
import { isFinancialYearExpired } from '../helper/financialYear'
import UserKpiChart from '../components/UserKpiChart'
import useDebounce from '../helper/debounce'
import * as Yup from "yup"
import AssigneeSelectionDropdown from '../components/forms/AssigneeSelectionDropdown'
import { useOutsideClick } from '../hooks/outsideClick'
import cx from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

interface IProps { }
let lockInterval: any = null;

function allowFormEdit(currentUserRole: ROLES, currentFormStatus?: FORM_STATUS) {
  const allowUserEdit = currentUserRole === ROLES.User && (currentFormStatus == FORM_STATUS.in_progress || currentFormStatus == FORM_STATUS.error)
  const allowClientAdminEdit = currentUserRole === ROLES.ClientAdmin && (currentFormStatus == FORM_STATUS.in_progress || currentFormStatus == FORM_STATUS.error || currentFormStatus == FORM_STATUS.check_again || currentFormStatus == FORM_STATUS.submitted)
  const allowSuperAdminEdit = currentUserRole === ROLES.SuperAdmin;

  return (allowUserEdit || allowClientAdminEdit || allowSuperAdminEdit);
}

const KpiSummary: FC<IProps> = (props) => {
  const dropdownUserRef = useRef<HTMLDivElement>(null)
  const formikRef = useRef<any>();
  const observer = useRef<any>(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const user = useSelector((state: RootState) => state.auth.user)

  const { companyId } = useSelector((state: RootState) => state.companyAndYear)
  const { ref: lastFilledRecordRef, inView, entry } = useInView({ threshold: 0 });

  const [financialYearPassed, setFinancialYearPassed] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
  const [meterFormVisible, setMeterFormVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODAL_MODE>(MODAL_MODE.create);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [materialIds, setMaterialIds] = useState<Array<string>>([]);
  const [isNeedToSave, setIsNeedToSave] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<string>("")
  const [touchedSnapshot, setTouchedSnapshot] = useState<{ [key: string]: any }>({});
  const [meterSearch, setMeterSearch] = useState<string>("");
  const meterSearchDebounce = useDebounce(meterSearch, 200)

  const paginate = usePagination(10);
  const alertBox = useAlertBox();
  const deleteMeter = useDeleteMeter();
  const updateMeter = useUpdateMeter();
  const releaseForm = useReleaseForm();
  const createMeterForm = useCreateMeterForm(); 
  const getForm = useGetForm(params.formId);
  const getUsers = useGetUserList({ enabled: user.role !== "user" });
  const lockForm = useLockForm();
  const updateForm = useUpdateForm();
  const uploadMeterAttachment = useUploadMeterAttachment();
  const getFormNotifs = useGetFormNotifications({ formId: params.formId });
  const renameAttachmentDescription = useRenameMatrixAttachment();
  // will fix rerender
  const getMaterialForms = useGetMeterFormMaterials(materialIds);

  const getMetersForms = useGetMeterForms({
    form: params.formId,
    page: paginate.page,
    name: meterSearchDebounce,
    limit: paginate.resultPerPage,
    company: user?.company?._id
  });

  const form = get(getForm, "data.data");
  const users = get(getUsers, "data.data", []);

  const materials = get(getMaterialForms, "data", []);
  const meters = get(getMetersForms, "data.data", []);
  const notifs = get(getFormNotifs, "data.data", []);

  
  const { formState, data, uniqueIds } = useProcessFormMaterials(materials, meters)
  const {initialValues, validation } = useMemo(() => generateFormInitialValues(meters, formState), [meters, formState]);

  const updateLocked = updateMeter.isLoading || !allowFormEdit(user.role as ROLES, form?.status);

  const [userDropdownVisible, setUserDropdownVisible] = useState<boolean>(false);
  const [isAssignedToAll, setIsAssignedToAll] = useState<boolean>(false);
  const [assignees, setAssignees] = useState<string[]>([])

  useEffect(() => {
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [isNeedToSave]);

  useEffect(() => {
    if (getForm.isSuccess) {
      const { formTemplate, assignees, financialYear } = get(getForm, "data.data")

      if (isFinancialYearExpired(financialYear)) {
        setFinancialYearPassed(true)
      }

      if (assignees) {
        const ids = assignees.map((user) => user._id)
        setAssignees(ids);
      }

      if (formTemplate?.materials?.length > 0)
        setMaterialIds(formTemplate.materials)

    }
  }, [getForm.data])

  useEffect(() => {
    if (getMetersForms.data) {
      const { data, meta } = get(getMetersForms, "data") as any;

      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getMetersForms.data])

  useEffect(() => {
    // Every lock will keep 30s so need to set interva
    //  to keep locking the form on 28s
    lockFormLoop()
    return () => {
      clearInterval(lockInterval);
      lockForm.mutate({ locked: false, id: params.formId, name: '' });
    }
  }, [])

  function beforeunload(e: any) {
    if (isNeedToSave) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  function generateUsers() {
    const role = user.role;
    const filteredUsers = []

    if (role === ROLES.SuperAdmin) {
      users.forEach((user) => {
        if ([ROLES.User, ROLES.ClientAdmin].includes(user.role) && companyId === user?.company?._id) {
          filteredUsers.push(user)
        }
      })

      return filteredUsers;
    }

    if (role === ROLES.ClientAdmin) {
      users.forEach((user) => {
        if (user.role === ROLES.User && companyId === user?.company?._id) {
          filteredUsers.push(user)
        }
      })

      return filteredUsers;
    }

    return filteredUsers;
  }

  function lockFormLoop() {
    const obj = {
      locked: true,
      id: params.formId,
      name: ""
    };

    // Initial call
    lockForm.mutate(obj);

    // Loop
    lockInterval = setInterval(() => {
      console.log('call lock form');
      lockForm.mutate(obj);
    }, 28000);
  }

  function removeMeter() {
    deleteMeter.mutate(selectedRow.id, {
      onSuccess: () => {
        setDeleteModalVisible(false)
      }
    })
  }

  function handleSubmitMeterForm(data: any) {
    const payload: CreateMeterPayloadType = {
      form: params.formId,
      name: data.name,
      assignees: null
    }

    createMeterForm.mutate(payload, {
      onSuccess: () => {
        setMeterFormVisible(false)
      }
    })
  }

  function openAddMeterFormModal() {
    setMode(MODAL_MODE.create)
    setMeterFormVisible(true)
  }

  function handleDeleteMeterClick(values) {
    setSelectedRow(values)
    setDeleteModalVisible(true)
  }

  async function handleFormSubmit(values: any, helpers: FormikHelpers<any>) {
    const promises: Array<Promise<any>> = [];
    const submitted = submitType === 'submit';

    const allApproved = Object.values(values).find((i: any) =>
      typeof (i.approved) === 'undefined' || i?.approved === false || i?.approved === null) ? false
      : true;

    const finishedMeter = [];
    meters.forEach(i => { if (i.finished) finishedMeter.push(i._id) });

    if (meters.length === 0)
      return alertBox.showError('Please create at least 1 meter');

    for (const i in values) {
      const meter = values[i];

      // Skip the meter that was approved for user. Admin can change anytime
      if (finishedMeter.includes(meter._id) && user?.role === ROLES.User)
        continue;

      if (meter?.attachments?.length > 0) {
        const formData = new FormData();

        meter.attachments.forEach((item) => {
          if (item.file instanceof File)
            formData.append("descriptions[]", item.description)
        })

        meter.attachments.forEach((item) => {
          if (item.file instanceof File)
            formData.append("attachments", item.file)
        })

        if (formData.has("descriptions[]") || formData.has("attachments")) {
          promises.push(uploadMeterAttachment.mutateAsync({
            formData,
            meterId: meter._id
          }))
        }
      }

      // check if description has been updated
      const updatedAttachments = touchedSnapshot[meter._id]?.attachments || [];

      if (updatedAttachments.length > 0) {
        updatedAttachments?.forEach((a: any, index: number) => {
          if (!(meter.attachments[index]?.file instanceof File)) {
            promises.push(renameAttachmentDescription.mutateAsync({
              meterId: meter._id,
              attachmentId: meter.attachments[index]?._id,
              description: meter.attachments[index]?.description
            }))
          }
        })
      }

      // Submit function moved to form level, don't need to submit single meter
      // so submitted always be false.
      const payload: { [key: string]: any } = {
        name: meter.name,
        submitted: false,
        removeAttachments: meter.removeAttachments,
        inputs: [],
        approved: meter.approved,
        errorReason: meter.errorReason
      }

      for (const field in meter) {
        const material = uniqueIds.find((i) => i.uniqueId === field);

        if (!isEmpty(material) && material.type === "text") {
          const answers = meter[field].map((mat) => ({ answer: mat.value }));
          payload.inputs.push(answers)
        }

        if (!isEmpty(material) && material.type === "matrix") {
          let answer = []
          let unit = [];

          meter[field].forEach((row) => {
            if (row.name.toLowerCase() === "unit") {
              unit = row.columns.map((col) => col.value)
            } else {
              answer.push(row.columns.map((col) => col.value))
            }
          })

          payload.inputs.push({
            answer,
            unit
          })
        }
      }

      promises.push(updateMeter.mutateAsync({
        id: meter._id,
        data: payload
      }))
    }

    await Promise.all(promises);
    queryClient.invalidateQueries("meters")

    await updateForm.mutateAsync({
      id: params.formId,
      data: {
        assignees: isAssignedToAll ? null : assignees,
        submitted: submitted,
        nextStatus: getNextState(form.status, submitted, allApproved),
      }
    });

    queryClient.invalidateQueries(["form", params.formId]);
    queryClient.invalidateQueries("form-notifications");
    alertBox.show({
      type: "success",
      title: "Success!",
      description: "Meter successfully updated."
    })
  }

  function handleCheckboxChange(e) {
    const value = e.target.value;

    if (value === 'assign-to-all') {
      setIsAssignedToAll(!isAssignedToAll)
      setAssignees([])
      return;
    }

    const index = assignees.findIndex((id) => id === value);
    if (index >= 0) {
      const filteredAssignees = assignees.filter((id) => id !== value);
      setAssignees(filteredAssignees)

    } else {
      setAssignees((prev) => [...prev, value])
    }
  }

  console.log({ assignees })
  useOutsideClick(dropdownUserRef, () => setUserDropdownVisible(false))

  return (
    <main className="p-5">
      <DeleteModal
        title="Delete Meter"
        loading={deleteMeter.isLoading}
        onConfirm={removeMeter}
        label={selectedRow.name}
        isVisible={deleteModalVisible}
        closeModal={() => setDeleteModalVisible(false)} />

      <AddMeterModal
        mode={mode}
        values={selectedRow}
        loading={createMeterForm.isLoading}
        isVisible={meterFormVisible}
        onSubmit={handleSubmitMeterForm}
        closeModal={() => setMeterFormVisible(false)} />

      <ReportPageHeader
        name={form?.formTemplate?.name}
        startDate={form?.financialYear}
        endDate={new Date("2025-12-12")} />

      <div className="flex items-center gap-2 justify-start h-[450px]">
        <div className="grow">
          <UserKpiChart />
        </div>

        <MessageBox
          data={notifs.map((notif: any) => ({
            avatar: {
              url: notif?.createdBy?.company?.logo?.url || "",
              alternativeText: notif?.createdBy?.name,
              size: "sm"
            },
            text: notif?.notificationTemplate?.header.replace("{{username}}", notif?.createdBy?.name),
            phone: notif?.createdBy?.phone || "N/A",
            email: notif?.createdBy?.email,
            date: new Date(notif?.createdAt)
          }))}
        />
      </div>

      <div className="relative min-h-[500px] mt-10">
        <section>
          <Formik
            enableReinitialize
            innerRef={formikRef}
            onSubmit={handleFormSubmit}
            validationSchema={Yup.object().shape(validation)}
            initialValues={initialValues}>
            {({ errors, values, touched }: FormikProps<any>) => {
              function handleFormBtnClick(e: any) {
                const type = e.target.dataset["type"];

                setSubmitType(type);
                if (formikRef.current) {
                  setTouchedSnapshot(touched)
                  formikRef.current.handleSubmit()
                }
              }

              return (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex rounded-md px-2 py-1 bg-white border-[1px] w-[320px] border-gray-200 gap-2 shadow-md items-center">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <input
                          placeholder='Search'
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setMeterSearch(e.target.value)}
                          className="flex-grow placeholder:text-sm"
                          type="text" />
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-1 items-center mr-2">
                          <b>Form Status: </b>
                          <FormStatus status={form?.status} />
                        </div>
                        <p className="mr-3">Total Meter: {meters.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                        <div className="w-[300px] mt-[-1.2rem]">
                          {getUsers.isSuccess ? (
                            <>
                              <p className="text-xs mb-1 font-medium text-jll-gray-dark">Assignee</p>
                              <div className="pl-2 py-1 flex justify-between text-md border-[1px] rounded-md bg-white relative">

                               {userDropdownVisible ? (
                                  <div ref={dropdownUserRef}>
                                    <AssigneeSelectionDropdown
                                      isAssignedToAll={isAssignedToAll}
                                      handleCheckboxChange={handleCheckboxChange}
                                      assignees={assignees}
                                      data={generateUsers().map((user) => ({ _id: user._id, name: user.name }))}
                                    />
                                  </div>
                               ) : null}

                                <div 
                                  onClick={() => setUserDropdownVisible(!userDropdownVisible)}
                                  className={cx("cursor-pointer flex justify-between items-center w-full text-sm disabled:opacity-50 disabled:pointer-events-none text-left py-[1px] relative pr-2", {
                                    'cursor-not-allowed opacity-50': getForm.isLoading || updateForm.isLoading || updateMeter.isLoading
                                  })}>
                                  
                                  <p>Assigned to {isAssignedToAll ? 'all' : assignees.length} users</p>

                                  <FontAwesomeIcon icon={faCaretDown} />
                                </div>

                              </div>
                            </>
                          ) : <></>}
                        </div>
                      </AccessControl>

                      {
                        !updateLocked && !financialYearPassed &&
                        <>
                          <button
                            data-type="save"
                            disabled={getForm.isLoading || updateForm.isLoading || updateMeter.isLoading}
                            onClick={handleFormBtnClick}
                            className="bg-white px-5 py-1 disabled:opacity-50 disabled:cursor-progress inset-red">
                            Save
                          </button>
                          <button
                            data-type="submit"
                            disabled={getForm.isLoading || updateForm.isLoading || updateMeter.isLoading}
                            onClick={handleFormBtnClick}
                            className="bg-gradient-to-l hover:opacity-90 disabled:opacity-50 disabled:cursor-progress transition duration-150 text-[white] from-jll-red to-jll-red-light px-5 py-1 font-medium">
                            Submit
                          </button>
                        </>
                      }

                      {
                        !updateLocked && !financialYearPassed &&
                        <>
                          <AccessControl allowedRoles={[ROLES.SuperAdmin]}>
                            <button
                              disabled={releaseForm.isLoading}
                              onClick={() => releaseForm.mutate(form._id, {
                                onSuccess: () => {
                                  window.location.reload()
                                }
                              })}
                              className="flex items-center justify-start gap-2 px-3 shadow py-1 bg-blue-500"
                              type="button">
                              <span className="text-white font-medium">Release</span>
                            </button>
                          </AccessControl>
                          <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                            <button
                              data-cy="add-meter-btn"
                              onClick={openAddMeterFormModal}
                              className="flex items-center justify-start gap-2 px-3 shadow py-1 bg-jll-brown"
                              type="button">
                              <PlusIcon className="h-4 w-4 border border-jll-black rounded" />
                              Add Meter Form
                            </button>
                          </AccessControl>
                        </>
                      }
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-3">
                    {meters.length === 0 ? "" : meters.map((meter: any, index: number) => (
                      <FormBuilderMeterItem
                        key={index}
                        meter={meter}
                        data={data}
                        loading={updateMeter.isLoading}
                        formStatus={form?.status}
                        formState={formState}
                        updateLocked={updateLocked}
                        setIsNeedToSave={setIsNeedToSave}
                        handleDeleteClick={handleDeleteMeterClick}
                      />
                    ))}
                  </div>
                </>
              )
            }}
          </Formik>

          {meters.length === 0 ? null : (
            <div className="flex items-center justify-between mt-3">
              <div className="shadow-md text-jll-gray-dark text-sm bg-white flex items-center overflow-hidden border-[1px] py-1">
                <p className="pl-2">Show:</p>
                <select
                  value={paginate.resultPerPage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => paginate.setResultPerPage(parseInt(e.target.value))}
                  className="w-[45px] pl-1">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>

              <ReactPaginate
                breakLabel="..."
                disabledClassName="opacity-50"
                previousLabel={<ChevronLeftIcon className="w-5 h-5" />}
                nextLabel={<ChevronRightIcon className="w-5 h-5" />}
                previousClassName="px-1 text-sm text-center bg-white border py-1"
                nextClassName="px-1 text-sm text-center bg-white border py-1"
                pageClassName="px-2 border border-jll-gray bg-white"
                containerClassName="flex items-center justify-end gap-2"
                activeClassName="bg-jll-red text-white border border-jll-red items-center"
                onPageChange={({ selected }) => paginate.setPage(selected + 1)}
                pageRangeDisplayed={1}
                pageCount={paginate.totalPages}
                renderOnZeroPageCount={null} />
            </div>
          )}

        </section>
      </div>

    </main>
  )
}

export default KpiSummary