import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { convertFromRaw, EditorState } from 'draft-js';
import { useFormik } from 'formik';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import PopupModal from '../PopupModal';
import { MODAL_MODE } from '../../types/modal';
import TextField from '../TextField';
import SelectField from '../SelectField';
import cx from "classnames";
import * as Yup from "yup";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { isEmpty, remove } from 'lodash';
import { useTranslation } from "react-i18next"

interface IProps {
  isVisible: boolean;
  mode?: MODAL_MODE;
  loading?: boolean;
  values?: { [key: string]: any },
  closeModal: () => void;
  onConfirm: (data: any) => void;
}

const AddContentModal: FC<IProps> = (props) => {

  const { isVisible, closeModal, onConfirm, values, loading, mode } = props;

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [customFieldError, setCustomFieldError] = useState<string>("");
  const [translations, setTranslations] = useState<Array<{ [key: string]: any }>>([
    { id: 1, key: "", value: "", errors: [] }
  ]);

  const { t } = useTranslation()
  const cfRef = useRef<HTMLDivElement>(null);
  const editor = React.useRef(null);

  function focusEditor() {
    if (editor && editor.current) {
      editor.current.focus()
    }
  }

  function handleAddFieldClick() {
    let blankInputs = 0;

    translations.forEach((item) => {
      if (!item.key || !item.value) {
        blankInputs++;
        const errors = [];
        const cloned = [...translations];
        const index = translations.findIndex(i => i.id === parseInt(item.id))
        if (!item.key) errors.push("key")
        if (!item.value) errors.push("value")

        cloned[index].errors = errors
        setTranslations(cloned)
      }
    })

    if (blankInputs === 0) {
      setTranslations((prev) => [...prev, { id: translations.length + 1, key: "", value: "", errors: [] }])
      setTimeout(() => cfRef.current.scrollIntoView({ behavior: "smooth" }), 100)
    } else {
      setCustomFieldError("Please complete content to inputs before adding another one.")
    }
  }

  function handleCustomFieldChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, dataset: { id, type } } = e.target;

    const cloned = [...translations];
    const index = cloned.findIndex((i) => i.id === parseInt(id));
    cloned[index][type] = value;
    cloned[index].errors = remove(cloned[index].errors, type)

    setCustomFieldError("")
    setTranslations(cloned)
  }

  function getFormError(field: string) {
    return form.errors[field] && form.touched[field];
  }

  const form = useFormik({
    initialValues: {
      id: "",
      title: "",
      category: ""
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      category: Yup.string().required("Category is required")
    }),
    onSubmit: (values) => {
      const customFields = {};

      for (const item of translations) {
        customFields[item.key] = item.value
      }

      onConfirm({
        ...values,
        content: editorState.getCurrentContent(),
        customFields
      })
    }
  })

  useEffect(() => {
    if (mode === MODAL_MODE.edit) {
      form.setValues({
        id: values._id,
        title: values.title,
        category: values.category,
      })

      if (values.content) {
        const content = convertFromRaw(JSON.parse(values.content))
        setEditorState(EditorState.createWithContent(content))
      }

      const cf = values.customFields;
      const alteredCf = [];

      if (!isEmpty(cf)) {
        Object.entries(cf).forEach((obj, index: number) => {
          const key = obj[0];
          const value = obj[1];

          alteredCf.push({
            id: index,
            errors: [],
            key,
            value
          })
        })
        setTranslations(alteredCf)
      }


    } else {
      form.resetForm();
      setTranslations([{ id: 1, key: "", value: "", errors: [] }])
      setCustomFieldError("")
      setEditorState(EditorState.createEmpty())
    }
  }, [mode, values, isVisible])

  function handleCloseModal() {
    closeModal();
    setTranslations([{ id: 1, key: "", value: "", errors: [] }])
    setCustomFieldError("")
  }

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={handleCloseModal}>

      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">
          {t(`${mode === MODAL_MODE.edit ? "Update" : "Add"} Content`)}
        </p>

        <form onSubmit={form.handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6">
              {form.values.category === "translation" ? (
                <SelectField
                  name="title"
                  disabled={props.loading}
                  placeholder="Select language"
                  label="Language"
                  onSelect={(val) => form.setFieldValue("title", val)}
                  value={form.values.title}
                  errorMessage={form.errors.title}
                  error={getFormError("title")}
                  options={[
                    { label: "Chinese (Traditional)", value: "zh-Hant" },
                    { label: "Chinese (Simplified)", value: "zh-Hans" },
                    { label: "English", value: "en" }
                  ]}
                />
              ) : (
                <TextField
                  formik
                  name="title"
                  label="Title"
                  placeholder="Title"
                  type="text"
                  disabled={loading}
                  handleChange={form.handleChange}
                  handleBlur={form.handleBlur}
                  value={form.values.title}
                  errorMessage={form.errors.title}
                  error={getFormError("title")}
                />
              )}
            </div>
            <div className="col-span-6">
              <SelectField
                name="category"
                disabled={props.loading}
                placeholder="Select category"
                label="Category"
                onSelect={(val) => {
                  form.setFieldValue("title", "")
                  form.setFieldValue("category", val)
                }}
                value={form.values.category}
                errorMessage={form.errors.category}
                error={getFormError("category")}
                options={[
                  { label: "Contact Us", value: "contactUs" },
                  { label: "FAQ", value: "faq" },
                  { label: "Translation", value: "translation" }
                ]}
              />
            </div>

            <div className="">
              <p className="text-xs font-medium mb-1 text-jll-gray-dark">{t("Content")}</p>
              <div className="rounded border-md border-jll-gray-dark border w-fit">
                <div
                  className="h-[250px] w-[655px] p-2"
                  onClick={focusEditor}>
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorStyle={{ height: "195px" }}
                    onEditorStateChange={(state: EditorState) => setEditorState(state)}
                    toolbar={{
                      options: ['inline'],
                      inline: {
                        options: ['bold', 'italic', 'underline'],
                      },
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          <section className="mt-5">
            <p className="text-xs mb-5 text-gray-500">{t("Custom Field")}</p>

            <div className="max-h-[320px] overflow-scroll">
              {translations.map((item, index: number) => (
                <div
                  ref={cfRef}
                  key={index}>
                  {index === 0 && (
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6"><p className="text-sm text-jll-gray-dark font-semibold">{t("Content")}</p></div>
                      <div className="col-span-6"><p className="text-sm text-jll-gray-dark font-semibold">{t("Value")}</p></div>
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-6">
                      <input
                        value={item.key}
                        data-id={item.id}
                        data-type="key"
                        onChange={handleCustomFieldChange}
                        className={cx("px-3 py-1 text-md w-full flex-grow border-[1px] rounded-md bg-white", {
                          "border-jll-gray-dark": !item.errors.includes("key"),
                          "border-jll-red": item.errors.includes("key")
                        })}
                        type="text" />
                    </div>
                    <div className="col-span-6">
                      <input
                        value={item.value}
                        data-id={item.id}
                        data-type="value"
                        onChange={handleCustomFieldChange}
                        className={cx("px-3 py-1 text-md w-full flex-grow border-[1px] rounded-md bg-white", {
                          "border-jll-gray-dark": !item.errors.includes("value"),
                          "border-jll-red": item.errors.includes("value")
                        })}
                        type="text" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {Boolean(customFieldError) ? <p className="text-jll-red text-center text-xs font-semibold">{customFieldError}</p> : null}

            <div className="flex justify-center mt-5">
              <button
                type="button"
                onClick={handleAddFieldClick}
                className="flex text-jll-red items-center gap-1 justify-center">
                <PlusIcon className="h-5 w-5" />
                <p className="text-sm font-semibold">{t("Add Field")}</p>
              </button>
            </div>
          </section>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              disabled={loading}
              className="w-[85px] disabled:opacity-50 disabled:cursor-not-allowed py-1 bg-jll-red hover:opacity-90 transition duration-100">
              {t("Done")}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-[85px] py-1 bg-jll-gray">
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>


    </PopupModal>
  )
}

export default AddContentModal