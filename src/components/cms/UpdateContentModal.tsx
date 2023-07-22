import { XMarkIcon } from '@heroicons/react/24/outline'
import { EditorState } from 'draft-js';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import PopupModal from '../PopupModal';
import TextField from '../TextField';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface IProps {
  isVisible: boolean;
  closeModal: () => void;
  onConfirm: (data: any) => void;
  values: { [key: string]: any };
}

const UpdateContentModal: FC<IProps> = (props) => {

  const { isVisible, closeModal, onConfirm, values } = props;

  const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
  const editor = React.useRef(null);

  function focusEditor() {
    if (editor && editor.current) {
      editor.current.focus()
    }
  }

  const form = useFormik({
    initialValues: {
      id: "",
      title: "",
      category: ""
    },
    onSubmit: (values, { setStatus }) => {
      onConfirm({
        ...values,
        content: editorState.getCurrentContent()
      })
    }
  })

  useEffect(() => {
    if (values) {
      form.setValues({
        id: values.id,
        title: values.title,
        category: values.category
      })

      if (values.content) {
        console.log(values.content)
        const editor = EditorState.createWithContent(values.content)
        setEditorState(editor)
      } else {
        const editor = EditorState.createEmpty()
        setEditorState(editor)
      }
    }
  }, [values])

  if (!props.isVisible) return null;

  return (
    <PopupModal
      position="center"
      isVisible={isVisible}
      onClose={closeModal}>

      <div className="relative p-5 rounded-lg border shadow-lg bg-white w-[700px]">
        <button
          onClick={closeModal}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-center font-semibold text-3xl mb-5">Add Content</p>
        <form onSubmit={form.handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6">
              <TextField
                formik
                name="title"
                label="Title"
                placeholder="Title"
                type="text"
                handleChange={form.handleChange}
                value={form.values.title}
                errorMessage={form.errors.title}
                error={Boolean(form.errors.title)}
              />
            </div>
            <div className="col-span-6">
              <TextField
                formik
                name="category"
                label="Category"
                placeholder="Category"
                type="text"
                handleChange={form.handleChange}
                value={form.values.category}
                errorMessage={form.errors.category}
                error={Boolean(form.errors.category)}
              />
            </div>
            <div>
              <p className="text-xs font-medium mb-1 text-jll-gray-dark">Content</p>
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
                      options: ['inline', 'list', 'textAlign']
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-5 justify-center gap-5 text-white font-medium">
            <button
              type="submit"
              className="w-[85px] py-1 bg-jll-red hover:opacity-90 transition duration-100">
              Done
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-[85px] py-1 bg-jll-gray">
              Cancel
            </button>
          </div>
        </form>
      </div>

    </PopupModal>
  )
}

export default UpdateContentModal