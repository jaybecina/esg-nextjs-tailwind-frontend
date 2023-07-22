import { FC } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Field, FieldArray, ErrorMessage, useFormikContext, getIn } from 'formik';
import cx from "classnames";
import { MaterialModalInitStateType } from './AddMaterialModal';

const MaterialFormQnA: FC<any> = () => {

  const { values, errors, touched } = useFormikContext<MaterialModalInitStateType>()

  function getError(field: string, index: number): string {
    let error: any = "";

    const errorMsg = getIn(error, `qnaRows[${index}][${field}]`)
    const isTouched = getIn(touched, `qnaRows[${index}][${field}]`)

    if (errorMsg && isTouched)
      error = errors.qnaRows[index][field]

    if (Boolean(error))
      return "border-jll-red"
    return "border-jll-gray-dark";
  }

  return (
    <div className="mt-[1rem] max-h-[380px] overflow-y-scroll">
      <FieldArray
        name="qnaRows">
        {(arrayHelpers) => (
          <section className={cx("flex flex-col gap-y-2", { hidden: !Boolean(values.type) })}>
            {values.qnaRows && values.qnaRows.length ? (
              values.qnaRows.map((_: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 mb-6">
                  <div className="">
                    <p className="text-xs font-medium mb-1 text-jll-gray-dark">Question</p>
                    <div className="flex gap-2 items-center">
                      <Field
                        name={`qnaRows.${index}.question`}
                        value={values.qnaRows[index].question}
                        placeholder="question"
                        style={{ outline: "none" }}
                        className={`flex-grow px-3 py-1 text-md border-[1px] rounded-md w-full bg-white ${getError("question", index)}`} />
                      <button
                        onClick={() => arrayHelpers.remove(index)}
                        type="button">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <ErrorMessage
                      name={`qnaRows.${index}.question`}
                      render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} />
                  </div>
                  <div className="">
                    <p className="text-xs font-medium mb-1 text-jll-gray-dark">Hints</p>
                    <Field
                      name={`qnaRows.${index}.hints`}
                      value={values.qnaRows[index].hints}
                      placeholder="Hints"
                      style={{ outline: "none" }}
                      className={`flex-grow px-3 py-1 text-md border-[1px] rounded-md w-full bg-white ${getError("hints", index)}`} />
                    <ErrorMessage
                      name={`qnaRows.${index}.hints`}
                      render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} />
                  </div>

                </div>
              ))
            ) : null}

            <button
              type="button"
              onClick={() => arrayHelpers.insert(values.qnaRows.length + 1, { question: "", hints: "" })}
              className="flex items-center flex-grow justify-center gap-1 text-jll-red w-full mt-3">
              <PlusIcon className="w-5 h-5" />
              <p className="font-semibold">Add Row</p>
            </button>
          </section>
        )}
      </FieldArray>
    </div>
  )
}

export default MaterialFormQnA;