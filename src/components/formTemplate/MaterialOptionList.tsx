import { ArrayHelpers, Field, FieldArray, getIn, useFormikContext } from 'formik';
import { get } from 'lodash';
import React, { ChangeEvent, FC, useEffect } from 'react'
import { useTranslation } from "react-i18next"

const MaterialOptionList: FC<{ loading: boolean, checked: Array<any> }> = ({ loading, checked }) => {

  const { values, handleChange, setFieldValue } = useFormikContext();
  const { t } = useTranslation();
  const materials = getIn(values, "materials")


  function handleSelectChange(e: ChangeEvent<HTMLInputElement>) {
    const isChecked: boolean = e.target.checked;
    const index: number = parseInt(e.target.dataset.index);

    if (!isChecked) {
      const uncheckedMaterial = getIn(values, `materials.${index}`)

      setFieldValue(`materials.${index}.checked`, false)
      setFieldValue(`materials.${index}.order`, 0)


      materials.forEach((mat, index) => {
        const order = parseInt(mat.order);
        const uncheckedOrder = parseInt(uncheckedMaterial.order);

        if (mat.checked && order > uncheckedOrder) {
          setFieldValue(`materials.${index}.order`, order - 1)
        }
      })

    } else {
      handleChange(e);
      setFieldValue(`materials.${index}.order`, checked.length + 1)
    }

  }

  function pushOrder(index: number) {
    const material = getIn(values, `materials.${index}`);
    setFieldValue(`materials.${index}.order`, material.order + 1)
  }

  async function handleSelectOrderChange(e: ChangeEvent<HTMLSelectElement>) {
    const value: number = parseInt(e.target.value);
    const index: number = parseInt(e.target.dataset.index);

    const prevValue = getIn(values, `materials[${index}].order`);
    const duplicateIndex = getIn(values, "materials", []).findIndex((m: any) => m.order === value);
    const duplicateOrder = getIn(values, `materials[${duplicateIndex}].order`);

    if (duplicateIndex > -1) {
      setFieldValue(`materials.${index}.order`, parseInt(duplicateOrder))
      setFieldValue(`materials.${duplicateIndex}.order`, parseInt(prevValue))

    } else {
      setFieldValue(`materials.${index}.order`, value)
    }
  }


  return (
    <FieldArray
      name="materials"
      render={(arrayHelper: ArrayHelpers) => {
        return (
          <section className="mt-[1rem] max-h-[420px] overflow-y-scroll">
            <p className="text-xs font-medium text-jll-gray-dark">{t("Materials")}</p>
            {materials.length > 0 ? materials.map((material, index: number) => (
              <div
                key={index}
                className="flex gap-y-4 mb-2 gap-x-2">
                <input
                  disabled={loading}
                  data-index={index}
                  name={`materials.${index}.checked`}
                  checked={materials[index].checked}
                  onChange={handleSelectChange}
                  type="checkbox" />
                {materials[index].checked && (
                  <select
                    disabled={loading}
                    data-index={index}
                    onChange={handleSelectOrderChange}
                    value={materials[index].order}
                    name={`materials.${index}.order`}
                    className="border rounded-md border-jll-gray-dark pl-2 text-sm text-jll-gray-dark w-[42px]">
                    {[...Array(checked.length).keys()].map((opt, idx) => {
                      return (
                        <option
                          key={idx}
                          value={(opt + 1).toString()}>{opt + 1}</option>
                      )
                    })}
                  </select>
                )}
                <p>{materials[index].name}</p>
              </div>
            )) : <>Loading...</>}
          </section>
        )
      }}
    />

  )
}

export default MaterialOptionList