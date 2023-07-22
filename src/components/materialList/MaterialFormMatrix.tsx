import { ChangeEvent, FC, useEffect, useState } from 'react'
import { PlusIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { Field, FieldArray, ErrorMessage, useFormikContext, getIn } from 'formik';
import cx from "classnames";
import { get } from 'lodash';
import { useGetUnits } from '../../hooks/unit';
import { MaterialModalInitStateType } from './AddMaterialModal';

const MaterialFormMatrix: FC<any> = () => {
  const { setFieldValue, values, errors, touched } = useFormikContext<MaterialModalInitStateType>()
  const [units, setUnits] = useState<any[]>([]);
  const getUnits = useGetUnits(1, 99999);

  function getError(section: string, field: string, index: number): string {
    let error: any = "";

    if (section === "rows") {
      const errorMsg = getIn(errors, `rows[${index}]`);
      const isTouched = getIn(touched, `rows[${index}]`);

      if (errorMsg && isTouched)
        error = errorMsg

      return error;
    }

    const errorMsg = getIn(errors, `[${section}][${index}][${field}]`)
    const isTouched = getIn(touched, `[${section}][${index}][${field}]`)

    if (errorMsg && isTouched)
      error = errorMsg

    if (Boolean(error))
      return "border-jll-red"
    return "border-jll-gray-dark";
  }

  useEffect(() => {
    if (getUnits.isSuccess) {
      const uniqueUnits = [];
      const data = get(getUnits, "data.data", [])
      data.forEach((unit) => {
        const index = uniqueUnits.findIndex((uu) => uu.output === unit.output);
        if (index === -1) {
          uniqueUnits.push(unit)
        }
      })

      setUnits(uniqueUnits)
    }
  }, [getUnits.data])

  return (
    <div className="grid grid-cols-12 mt-[3rem] max-h-[400px] overflow-y-scroll gap-5">
      <div className="col-span-4">
        <FieldArray
          name="rows">
          {(arrayHelpers) => (
            <section className={cx("flex flex-col gap-y-2", { hidden: !Boolean(values.type) })}>
              {values.rows.length ? (
                values.rows.map((row: { name: string }, index: number) => (
                  <div key={index}>
                    {index === 0 && <p className="text-xs font-medium mb-1 text-jll-gray-dark">Row</p>}
                    <div
                      data-cy="material-matrix-row-item"
                      className="flex gap-2 items-center justify-between">
                      <div className="w-full">
                        <Field
                          placeholder="Row name"
                          style={{ outline: "none" }}
                          className={`px-3 py-1 w-full text-md border-[1px] rounded-md bg-white ${getError("rows", "name", index) ? "border-jll-red" : "border-jll-gray-dark"}`}
                          name={`rows.${index}.name`}
                          id={`rows.${index}.name`}
                        />
                        <ErrorMessage
                          name={`rows.${index}.name`}
                          render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} 
                        />
                      </div>
                      <button
                        onClick={() => arrayHelpers.remove(index)}
                        type="button">
                        <XMarkIcon className="h-4 w-4 text-jll-gray-dark" />
                      </button>
                    </div>
                  </div>
                ))
              ) : null}

              <button
                type="button"
                data-cy="add-row-matrix-btn"
                onClick={() => arrayHelpers.insert(values.rows.length + 1, "")}
                className="flex items-center flex-grow justify-center gap-1 text-jll-red w-full mt-3">
                <PlusIcon className="w-5 h-5" />
                <p className="font-semibold">Add Row</p>
              </button>
            </section>
          )}
        </FieldArray>
      </div>

      <div className="col-span-8">
        <FieldArray
          name="columns">
          {(arrayHelpers) => (
            <section className={cx("flex flex-col gap-y-2", { hidden: !Boolean(values.type) })}>

              {values.columns.length > 0 ? (
                values.columns.map((column: { [key: string]: any }, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex flex-col ${index === 0 ? 'mt-6' : ''}`}>
                        <div className='w-4 h-4 cursor-pointer' onClick={() => arrayHelpers.move(index, index - 1)}>
                          <ChevronUpIcon className='w-4 h-4 cursor-pointer' />
                        </div>
                        <div className='w-4 h-4 cursor-pointer' onClick={() => arrayHelpers.move(index, index + 1)}>
                          <ChevronDownIcon className='w-4 h-4 cursor-pointer' />
                        </div>
                      </div>
                      <div
                        data-cy="material-matrix-column-item"
                        className="grid grid-cols-12 gap-2 flex-grow">
                        <div className="col-span-6">
                          {index === 0 && <p className="text-xs font-medium mb-1 text-jll-gray-dark">Column</p>}
                          <Field
                            placeholder="Column name"
                            name={`columns.${index}.name`}
                            id={`columns.${index}.name`}
                            value={values.columns[index].name}
                            style={{ outline: "none" }}
                            className={`px-3 py-1 w-full text-md border-[1px] rounded-md bg-white ${getError("columns", "name", index)}`}
                          />
                          <ErrorMessage
                            name={`columns.${index}.name`}
                            render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} />
                        </div>

                        <div className="col-span-3">
                          {index === 0 && <p className="text-xs font-medium mb-1 text-jll-gray-dark">Input Type</p>}
                          <div className={`pl-2 w-full py-1 flex justify-between text-md border-[1px] rounded-md bg-white ${getError("columns", "inputType", index)}`}>
                            <Field
                              className={cx("w-full", { "text-jll-gray": !values.columns[index].inputType })}
                              component="select"
                              value={values.columns[index].inputType}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                const value = e.target.value;
                                setFieldValue(`columns.${index}.inputType`, value)
                                if (value === "text") {
                                  setFieldValue(`columns.${index}.outputUnit`, "N/A")
                                } else {
                                  setFieldValue(`columns.${index}.outputUnit`, "")
                                }
                              }}
                              name={`columns.${index}.inputType`}
                              id={`columns.${index}.inputType`}
                            >
                              <option value="" disabled>Type</option>
                              <option value="number">Number</option>
                              <option value="text">Text</option>
                            </Field>
                          </div>
                          <ErrorMessage
                            name={`columns.${index}.inputType`}
                            render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} />
                        </div>

                        <div className="col-span-3">
                          {index === 0 && <p className="text-xs font-medium mb-1 text-jll-gray-dark">Output Unit</p>}
                          <div className={`pl-2 w-full py-1 flex justify-between text-md border-[1px] rounded-md bg-white ${getError("columns", "outputUnit", index)}`}>
                            <Field
                              component="select"
                              className={cx("w-full", { "text-jll-gray": !values.columns[index].outputUnit })}
                              value={values.columns[index].outputUnit}
                              placeholder="Output Type"
                              name={`columns.${index}.outputUnit`}
                              id={`columns.${index}.outputUnit`}
                            >
                              <option value="" disabled>Type</option>
                              {units.map((unit, index: number) => (
                                <option
                                  key={index}
                                  value={unit.output}>{unit.output}</option>
                              ))}
                              <option value="N/A">N/A</option>
                            </Field>
                          </div>
                          <ErrorMessage
                            name={`columns.${index}.outputUnit`}
                            render={msg => <p className="text-jll-red text-xs font-semibold">{msg}</p>} />
                        </div>
                      </div>

                      <button
                        className={cx("", { "mt-[1rem]": index === 0 })}
                        onClick={() => arrayHelpers.remove(index)}
                        type="button">
                        <XMarkIcon className="h-4 w-4 text-jll-gray-dark" />
                      </button>
                    </div>
                  </div>
                ))
              ) : null}

              <button
                data-cy="add-column-matrix-btn"
                type="button"
                onClick={() => arrayHelpers.insert(values.columns.length + 1, { name: "", inputType: "", outputUnit: "" })}
                className="flex items-center flex-grow justify-center gap-1 text-jll-red w-full mt-3">
                <PlusIcon className="w-5 h-5" />
                <p className="font-semibold">Add Columns</p>
              </button>
            </section>
          )}
        </FieldArray>
      </div>
    </div>
  )
}

export default MaterialFormMatrix;