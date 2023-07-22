import { ChangeEvent, FC, useRef, useState } from 'react'
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useFormik } from "formik"
import TextField from './TextField'
import SelectField from './SelectField'
import cx from "classnames";

interface IProps {
  onEdit?: (values) => void;
  removeMeter?: (meter: any) => void;
  item?: { meter: number, name: string };
  name?: string
}

const MeterInputBox: FC<IProps> = (props) => {

  const attachmentRef = useRef<HTMLInputElement>();
  const [formIsVisible, setFormIsVisible] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Array<File>>([]);

  const form = useFormik({
    initialValues: {
      typeOfUse: "",
      area: "",
      unit: "",
      annualKpiTarget: ""
    },
    onSubmit: (values, { setSubmitting }) => {

    }
  })

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  function removeAttachment(attachment: File) {
    const set = new Set([...attachments]);
    set.delete(attachment)

    setAttachments([...set])
  }

  function dropHandler(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    setAttachments([...attachments, ...files])
    setIsDragging(false)
  }

  function dragOverHandler(ev: any) {
    setIsDragging(true)
    ev.preventDefault();
  }

  function dragLeavehandler(ev: any) {
    setIsDragging(false)
    ev.preventDefault();
  }

  function handleFileChange(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    setAttachments([...attachments, ...files])
  }

  function onAttachmentClick() {
    if (attachmentRef && attachmentRef.current) {
      attachmentRef.current.click()
    }
  }

  return (
    <>
      <div
        className="border-[1px] border-gray-100 rounded-md w-full px-3 py-4 shadow-lg bg-white">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer flex items-center justify-start gap-2">
            <button
              data-cy="meter-name-btn"
              onClick={() => setFormIsVisible(!formIsVisible)}>
              <p className="font-bold">{props.item.name}</p>
            </button>
            {!formIsVisible && (
              <button
                data-cy="edit-meter-btn"
                onClick={() => props.onEdit(props.item)}
                type="button">
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {!formIsVisible && <p className="text-jll-gray font-semibold text-sm">Waiting Fill In</p>}
            <button
              onClick={() => props.removeMeter(props.item)}
              className=""
              type="button">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          data-cy="meter-form-container"
          className={cx("pr-[10rem] mt-3", { "hidden": !formIsVisible })}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <TextField
                name="typeOfUse"
                type="text"
                placeholder="Type of use"
                formik
                value={form.values.typeOfUse}
                handleChange={form.handleChange}
                required />
            </div>

            <div className="col-span-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <SelectField
                    value={form.values.unit}
                    required
                    name="unit"
                    onSelect={(val) => form.setFieldValue("unit", val)}
                    options={[
                      { value: "unit1", label: "uni one" },
                      { value: "unit2", label: "unit two" },
                      { value: "unit3", label: "unit three" }
                    ]}
                  />
                </div>
                <div className="w-1/2">
                  <SelectField
                    value={form.values.area}
                    required
                    name="area"
                    onSelect={(val) => form.setFieldValue("area", val)}
                    options={[
                      { value: "area1", label: "area one" },
                      { value: "area2", label: "area two" },
                      { value: "area3", label: "area three" }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <TextField
                name="annualKpiTarget"
                type="text"
                placeholder="Annual KPI target"
                formik
                value={form.values.annualKpiTarget}
                handleChange={form.handleChange}
                required />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 mt-2">
            {months.map(month => (
              <div
                key={month}
                className="col-span-2">
                <TextField
                  name={month.toLowerCase()}
                  type="number"
                  placeholder={`${month} Electricity`}
                  formik
                  value={form.values[month.toLocaleLowerCase()]}
                  handleChange={form.handleChange}
                  required />
              </div>
            ))}
          </div>

          <input
            hidden
            onChange={handleFileChange}
            ref={attachmentRef}
            type="file" />

          <div
            onClick={onAttachmentClick}
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeavehandler}
            className={cx("rounded-lg border mt-2 cursor-pointer border-jll-gray-dark p-2", {
              "bg-gray-100 border-dashed transition duration-150": isDragging
            })}>
            <p className="text-sm text-jll-gray"><span className="text-jll-red">*</span>Attachments</p>
            <p className="text-right text-sm mb-3">(Drag and Drop or click to update, the attachments file name will show after selected)</p>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {attachments.length > 0 && attachments.map((attachment: File, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1">
                <button
                  onClick={() => removeAttachment(attachment)}
                  type="button"
                  className="rounded-full bg-jll-red-light p-[2px]">
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
                <p className="text-sm">{attachment.name}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

export default MeterInputBox