import { XMarkIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Field, FieldArray, getIn, useFormikContext } from 'formik';
import cx from "classnames";
import AccessControl, { ROLES } from './AccessControl';
import FormStatus from './FormStatus';
import { useGetUnits } from '../hooks/unit';
import { get, isNumber } from 'lodash';
import { useGetMeter } from '../hooks/meter';
import { ColumnType, ItemType } from '../helper/processFormMaterials';
import { useAlertBox } from '../hooks/alertBox';
import { useTranslation } from 'react-i18next';
import { formatByThousand } from '../helper/utils';
interface IProps {
  data?: Array<any>,
  formState?: { [key: string]: any };
  meter?: any;
  loading?: boolean;
  formStatus?: string;
  updateLocked: boolean;
  setIsNeedToSave?: (status: boolean) => void;
  handleDeleteClick: (row: any) => void;
}

const FormBuilderMeterItem: FC<IProps> = (props) => {
  const { setFieldValue, values, handleChange, errors, handleBlur, touched } = useFormikContext()
  const { t } = useTranslation()
  const { meter, handleDeleteClick, data, formState, formStatus, updateLocked } = props;

  const inputRefs = useRef([]);

  const attachmentRef = useRef<HTMLInputElement>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const alertBox = useAlertBox();
  const getMeter = useGetMeter(meter?._id)
  const getUnits = useGetUnits();
  const units = get(getUnits, "data.data", []);

  useEffect(() => {
    if (getMeter.isSuccess) {
      const meter = get(getMeter, "data.data", {})
      const inputs = meter?.inputs || [];
      if (inputs.length > 0) {

      }
    }
  }, [getMeter.data])

  const handleKeyDown = (event) => {
    // event.preventDefault();

    // @desc meterId, formId, index1 as row, index2 as col
    const meterId = event.target.getAttribute('data-meterId');
    const formId = event.target.getAttribute('data-formId');
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));

    // index1 is row and index2 is col
    if (event.key === 'ArrowRight' && col === 0) {
      document.getElementById(`text-${meterId}.${formId}.${row}.columns.${col + 1}`).focus();
    } else if (event.key === 'ArrowLeft' && col === 1) { 
      document.getElementById(`text-${meterId}.${formId}.${row}.columns.${col - 1}`).focus();
    } else if (event.key === 'ArrowUp' && (row >= 1 && row <= 14)) { 
      event.preventDefault();
      document.getElementById(`text-${meterId}.${formId}.${row - 1}.columns.${col}`).focus();
    } else if (event.key === 'ArrowDown' && (row >= 0 && row <= 13)) {
      event.preventDefault();
      document.getElementById(`text-${meterId}.${formId}.${row + 1}.columns.${col}`).focus();
    } else {
      // default keys are allowed
    }
  };

  function onNameClick() {
    setIsCollapsed(!isCollapsed);
  }

  function removeAttachment(attachmentIndex: number) {
    const attachmentId = getIn(values, `[${meter._id}].attachments[${attachmentIndex}]._id`, "");

    const attachments = `${[meter._id]}.attachments`;
    const removeAttachments = `${[meter._id]}.removeAttachments`;
    const newAttachments = values[meter._id].attachments;
    newAttachments.splice(attachmentIndex, 1)

    setFieldValue(removeAttachments, [...values[meter._id].removeAttachments, attachmentId]);
    setFieldValue(attachments, newAttachments);
  }

  function dropHandler(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const attachments = values[meter._id].attachments;

    const filesAdded = Array.from(files).map((file: File) => ({
      description: "",
      file
    }))

    setIsDragging(false)
    setFieldValue(`${[meter._id]}.attachments`, [
      ...attachments,
      ...filesAdded
    ])
  }

  function dragOverHandler(ev: any) {
    setIsDragging(true)
    ev.preventDefault();
  }

  function dragLeavehandler(ev: any) {
    setIsDragging(false)
    ev.preventDefault();
  }

  function handleFileChange(ev: ChangeEvent<HTMLInputElement>, index?: number) {
    const files = ev.target.files;
    const attachments = values[meter._id].attachments;

    const filesAdded = Array.from(files).map((file: File) => ({
      description: "",
      file
    }))

    setFieldValue(`${[meter._id]}.attachments`, [
      ...attachments,
      ...filesAdded
    ])

    ev.target.value = null;
  }

  function onAttachmentClick() {
    if (attachmentRef && attachmentRef.current) {
      attachmentRef.current.click()
    }
  }

  function filterUnitOptions(outputUnit: string) {
    return units.filter((unit: any) => unit.output === outputUnit)
  }

  function getColumnSum(meterId: string, uniqueFormId: string, columnName: string) {
    if (!meterId || !uniqueFormId || !columnName || (!values && !values[meterId])) {
      return;
    }

    let sum: number = 0;
    const data = get(values, `[${meterId}][${uniqueFormId}]`, []);

    for (const item of data) {
      const index = item['columns'].findIndex((v) => v.name === columnName)

      if (index >= 0) {
        const col = item['columns'][index]
        const value = isNumber(col.value) ? col.value : 0;
        sum+= value
      }
    }

    return sum;
  }

  function generateForm(form, values) {
    if (form.type === "matrix") {
      return (
        <FieldArray
          name={meter?._id[form.uniqueId]}>
          {() => {
            const size = form.size;
            const rowsData = values[form.uniqueId];
            let rows = [];

            // Rearrange the array with "unit" as the first element
            if(rowsData?.length > 0 ) {
              const lastElement = rowsData?.slice(-1);
              const getAllButLast = rowsData?.slice(0, -1);
              rows.push(...lastElement, ...getAllButLast);
            }

            return (
              <section className="w-full">

                <div className="flex flex-col gap-2 overflow-x-scroll">
                  {rows && rows.map((({ columns, name }: ItemType, index1: number) => {
                    let sum: number = 0;
                    
                    return (
                      <div
                        key={`${name}-${index1}`}
                        style={{ width: columns.length > 3 ? "100%" : "60%" }}
                        className="gap-2 flex justify-start flex-nowrap">
                        <div className="w-[200px] flex-shrink-0 text-right whitespace-pre-wrap text-sm">
                        <p className={cx({ "mt-8": index1 === 0, "mt-1.5": index1 > 0 && (index1 + 1) < rows.length, "mt-1": (index1 + 1) === rows.length })}>{t(name)}</p>
                        </div>
                        {columns.map((column: ColumnType, index2: number) => {
                          // if (index1 === 0) {
                          return (
                            <>
                            {index1 === 0 ?
                              <div className="flex flex-col">
                                <div 
                                  title={t(column.name)}
                                >
                                  <p className="mb-2 cursor-pointer text-sm truncate">{t(column.name)}</p>
                                </div>
                                <div className="flex flex-col w-[150px]">
                                  <Field
                                    key={`${column.name}-${index2}`}
                                    id={`text-${meter?._id}.${form.uniqueId}.${index1}.columns.${index2}`}
                                    onKeyDown={(evt) => handleKeyDown(evt)}
                                    data-meterId={meter?._id}
                                    data-formId={form.uniqueId}
                                    data-row={index1}
                                    data-col={index2}
                                    disabled={updateLocked}
                                    component="select"
                                    placeholder="Output Type"
                                    className={`flex-shrink-0 max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed pl-2 py-[2px] text-md w-full border border-jll-gray-dark rounded bg-white ${updateLocked ? "opacity-50" : ""}`}
                                    name={`${meter?._id}.${form.uniqueId}.${index1}.columns.${index2}.value`}>
                                    {
                                      filterUnitOptions(column.outputUnit).map((unit, index: number) => (
                                        <option
                                          key={index}
                                          value={unit.input}>{unit.input}</option>
                                      ))
                                    }
                                    <option value="N/A">N/A</option>
                                  </Field>
                                </div> 
                              </div>
                            :
                              <></>
                            }
                            {index1 > 0 &&
                              <div
                                className="flex-shrink-0 max-w-[150px]"
                                key={`${column.name}-${index2}`}>
                                <Field
                                  id={`text-${meter?._id}.${form.uniqueId}.${index1 - 1}.columns.${index2}`}
                                  disabled={updateLocked}
                                  component="input"
                                  name={`${meter?._id}.${form.uniqueId}.${index1 - 1}.columns.${index2}.value`}
                                  placeholder={column.name}
                                  type={column.inputType}
                                  onKeyDown={(evt) => handleKeyDown(evt)}
                                  data-meterId={meter?._id}
                                  data-formId={form.uniqueId}
                                  data-row={index1 - 1}
                                  data-col={index2}
                                  // onChange={handleChange}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed border border-jll-gray-dark py-1 text-sm placeholder:text-sm rounded px-2 w-full"
                                />
                                  {index1 + 1 === rows?.length ?
                                    <p className="text-sm mt-2 mb-5">Column Sum:{" "} 
                                      <span className="font-bold">{formatByThousand(getColumnSum(meter?._id, form.uniqueId, column.name))}</span>
                                    </p>
                                    :
                                    <></>
                                  }
                              </div>
                            }
                            </>
                          )
                        })}
                      </div>
                    )
                  }))}
                </div>
              </section>
            )
          }
          }
        </FieldArray >
      )
    }

    if (form.type === "text") {
      return (
        <FieldArray
          name={meter?._id[form.uniqueId]}>
          {() => {
            return (
              <section className="w-[50%]">
                {values[form.uniqueId] && values[form.uniqueId].map((item, index) => {
                  return (
                    <div key={index}>
                      <p className="mb-1 text-sm">{t(item.question)}</p>
                      <Field
                        as="textarea"
                        disabled={updateLocked}
                        placeholder={item.hints || "Hints"}
                        className="disabled:opacity-50 disabled:cursor-not-allowed border placeholder:text-sm py-1 border-jll-gray-dark rounded px-2 w-full"
                        name={`${meter?._id}.${form.uniqueId}.${index}.value`}
                        rows={1} />
                    </div>
                  )
                })}
              </section>
            )
          }}
        </FieldArray>
      )
    }
  }

  function handleCheckboxChange(e: ChangeEvent<any>) {
    const { checked, dataset: { checkboxType, meterId } } = e.target;

    if (checkboxType === "error" && checked) {
      return setFieldValue(`${[meterId]}.approved`, false)
    }

    if (checkboxType === "correct" && checked) {
      setFieldValue(`${[meterId]}.errorReason`, "")
      setFieldValue(`${[meterId]}.approved`, true)
      return
    }

    setFieldValue(`${[meterId]}.approved`, null)
  }

  function onDownloadClick(file: any) {
    if (file instanceof File) {
      alertBox.showError("Please save the meter first before downloading")
    } else {
      const a = document.createElement('a');
      a.target = '_blank';
      a.download = file.name;
      a.href = file.url;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  return (
    <FieldArray
      name={meter?._id}>
      {() => {
        return (
          <main className="p-3 bg-white shadow-lg rounded-md border-[1px] border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-2">
                {isCollapsed ? (
                  <Field
                    disabled={updateLocked}
                    placeholder="Meter name"
                    type="text"
                    name={`${meter?._id}.name`}
                    className="disabled:opacity-50 disabled:cursor-not-allowed border rounded-md border-jll-gray-dark px-2 h-[30px] min-w-[280px]"
                  />
                ) : (
                  <button
                    className="transition duration-150 hover:opacity-70"
                    onClick={onNameClick}
                    type="button">
                    <p className="font-bold">{t(values[meter._id]?.name)}</p>
                  </button>
                )}

                {isCollapsed ? (
                  <button
                    onClick={onNameClick}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={onNameClick}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button">
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <FormStatus status={meter.finished ? 'completed' : formStatus} />
                <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                  <button
                    disabled={updateLocked}
                    onClick={() => handleDeleteClick({ id: meter?._id, name: meter?.name })}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </AccessControl>
              </div>
            </div>

            <section className={cx("pl-3 mt-3", {
              "block": isCollapsed,
              "hidden": !isCollapsed
            })}>

              <section className="flex flex-col gap-3 w-full">
                {data.map((form: any, index: number) => {
                  return (
                    <div key={index}>
                      <p className="font-bold mb-2">{form.name}</p>
                      {generateForm(form, formState)}
                    </div>
                  )
                })}
              </section>

              <input
                hidden
                ref={attachmentRef}
                multiple
                onChange={handleFileChange}
                type="file" />

              <div
                onClick={onAttachmentClick}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeavehandler}
                className={cx("rounded-lg h-[60px] border mt-2 cursor-pointer border-jll-gray-dark p-2", {
                  "bg-gray-100 border-dashed transition duration-150": isDragging,
                  "opacity-50 pointer-events-none": updateLocked
                })}>
                <p className="text-sm text-jll-gray">Attachments</p>
              </div>

              <div className="my-5 flex flex-col gap-3">
                {getIn(values, `${meter._id}.attachments`, []).map((item: { description: string, file: File }, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2">
                    <button
                      className="flex items-center mt-1"
                      onClick={() => removeAttachment(index)}
                      type="button">
                      <XMarkIcon className="w-5 h-5 text-black" />
                    </button>
                    <div className="w-[320px]">
                      <button
                        className="break-all"
                        onClick={() => onDownloadClick(item.file)}>
                        <p className="text-sm text-left leading-[1]">{item.file.name}</p>
                      </button>
                    </div>
                    <input
                      disabled={updateLocked}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue(`${meter._id}.attachments.${index}.description`, e.target.value)}
                      placeholder="Attachment description"
                      onBlur={handleBlur}
                      name={`${meter._id}.attachments.${index}.description`}
                      value={values[meter._id].attachments[index].description}
                      className="px-3 text-sm text-md border-[1px] h-[30px] w-[200px] rounded-md bg-white border-jll-gray-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      type="text" />
                  </div>
                ))}
              </div>

              <AccessControl allowedRoles={[ROLES.ClientAdmin, ROLES.SuperAdmin]}>
                <div className="flex items-center justify-start gap-5 mt-2 bg-gray-200 rounded-xl px-5 py-6">
                  <label>
                    <Field
                      type="checkbox"
                      data-checkbox-type="correct"
                      data-meter-id={meter._id}
                      checked={values[meter._id]?.approved === true}
                      value={true}
                      onChange={handleCheckboxChange} />
                    {" "}Information Correct
                  </label>

                  <label>
                    <Field
                      type="checkbox"
                      data-checkbox-type="error"
                      data-meter-id={meter._id}
                      checked={values[meter._id]?.approved === false}
                      value={false}
                      onChange={handleCheckboxChange} />
                    {" "}Error
                  </label>

                  <div className="flex items-center gap-1 text-sm flex-grow">
                    <div className="w-full">
                      <Field
                        data-cy="error-reason"
                        disabled={getIn(values[meter._id], "approved") === true}
                        name={`${meter._id}.errorReason`}
                        onChange={handleChange}
                        placeholder="Please enter the reason..."
                        className={
                          cx("border-[1px] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed border-jll-gray px-2 py-[2px] w-full mr-[10rem]", {
                            "border-jll-red": Boolean(errors[meter._id]?.errorReason),
                          })
                        }
                        type="text" />
                      {Boolean(errors[meter._id]?.errorReason)
                        ? <p
                          data-cy="error-message"
                          className="text-jll-red text-xs font-semibold">{t(errors[meter._id]?.errorReason)}</p> : null}
                    </div>
                   
                  </div>
                </div>
              </AccessControl>
              
              <AccessControl allowedRoles={[ROLES.User]}>
                {meter.errorReason ? (
                  <>
                    <p className="text-red-500">
                      <span className="font-bold">Error:{" "}</span>
                      {meter.errorReason}
                    </p>
                  </>
                ) : null}
              </AccessControl>
            </section>
          </main>
        )
      }}
    </FieldArray>
  )
}

export default FormBuilderMeterItem;