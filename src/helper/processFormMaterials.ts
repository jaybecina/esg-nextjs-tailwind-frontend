import { useEffect, useState } from "react";
import * as Yup from "yup"

export type RowType = { name: string }
export type ColumnType = { id?: string, name: string, inputType: string, outputUnit: string }
export type ItemType = { id?: string, name: string; columns: Array<ColumnType> }

export const useProcessFormMaterials = (formMaterials: Array<any>, meters?: Array<any>): {
  data: Array<any>;
  uniqueIds: Array<{ uniqueId: string, type: "matrix" | "text" }>;
  formState: { [key: string]: any };
} => {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    formMaterials.forEach(({ data: form }) => {

      const trimmedObj = {};

      trimmedObj[form.uniqueId] = {}

      if (form.type === "matrix") {
        const { rows, columns } = form.content[0];
        const data = rows.map((row: RowType) => ({
          ...row,
          type: "matrix",
          columns: columns.map((col: ColumnType) => ({ ...col, value: "" }))
        }))

        trimmedObj[form.uniqueId] = [
          ...data,
          {
            name: "Unit",
            type: "matrix",
            columns: columns.map((col: ColumnType) => ({
              ...col,
              value: col.outputUnit
            }))
          }
        ];
      }

      if (form.type === "text") {
        const content: Array<{ question: string, hints: string }> = form.content;
        trimmedObj[form.uniqueId] = content.map((c) => ({ ...c, type: "text", value: "" }))
      }

      setData(prev => ({
        ...prev,
        ...trimmedObj
      }))

    })
  }, [formMaterials])

  return {
    formState: data,
    uniqueIds: formMaterials.map((material) => ({
      uniqueId: material.data.uniqueId,
      type: material.data.type
    })),
    data: formMaterials.map((material) => material.data)
  }
}

export const generateFormInitialValues = (meters, formState) => {
  const obj = {}
  const validation = {};

  if (!meters || !formState)
    return;

  meters.length > 0 && meters.map((meter: any, index: number) => {
    const meterFormState = JSON.parse(JSON.stringify(formState))
    const inputs = meter?.inputs || [];

    if (inputs.length > 0) {
      Object.keys(meterFormState).map((m, i) => {
        const type = meterFormState[m][0].type;
        const meter = meterFormState[m]

        if (type === "text") {
          meter.forEach((met, idx) => {
            const answer = inputs[i] && inputs[i] && inputs[i][idx]?.answer;
            met.value = answer || ""
          })
        }

        if (type == "matrix") {
          const input = inputs[i]?.answer
          const unit = inputs[i]?.unit

          meter.forEach((row, idx) => {
            if (row.name.toLowerCase() !== "unit") {
              row["columns"].forEach((col, colIdx) => {
                col.value = input[idx][colIdx]
              })
            } else {
              row["columns"].forEach((u, colIdx) => {
                u.value = unit[colIdx] ? unit[colIdx] : ""
              })
            }
          })
        }
      })
    }

    obj[meter._id.toString()] = {
      _id: meter._id,
      name: meter.name,
      attachments: meter.attachments || [],
      removeAttachments: [],
      approved: meter.approved,
      errorReason: meter.errorReason || "",
      ...meterFormState
    }

    validation[meter._id.toString()] = Yup.object().shape({
      approved: Yup.boolean().nullable(true),
      errorReason: Yup.string().when('approved', {
        is: (approved: boolean) => approved === false,
        then: Yup.string().required("Please provide an error reason"),
      }),
    });

  })

  return {
    initialValues: obj,
    validation
  };
}