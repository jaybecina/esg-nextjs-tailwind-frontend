import { Field, FieldArray, useFormikContext } from 'formik'
import { capitalize, get } from 'lodash'
import { FC, MouseEvent, useEffect, useState, useRef } from 'react'
import { useGetCalculation, useGetCalculationPointers, useGetCalculations, useGetConstantPointers, useGetMaterialPointers, useGetPointers } from '../../hooks/calculation'
import { useGetMaterials } from '../../hooks/material'
import SelectField from '../SelectField'
import { useSearchParams } from 'react-router-dom'
import { CalculationFormType } from '../CreateEditCalculationModal'
import { useGetConstant } from '../../hooks/constant'
import AutocompleteField from '../AutocompleteField'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ReactSortable } from "react-sortablejs";


export interface IPointerOperator {
  _id: string;
  text: string;
  method: string;
}
export interface IMaterialPointer extends IPointerOperator {
  materialId: string;
  materialUniqueId: string;
  row: number;
  col: number;
  payload: { [key: string]: string }
}

const MaterialCalculationForm: FC<any> = (props) => {

  const { values, setValues, setFieldValue, handleChange } = useFormikContext<CalculationFormType>()
  const [params] = useSearchParams();
  const [materialId, setMaterialId] = useState<string>(null)
  const [selectedType, setSelectedType] = useState<string>("material");
  const [materialOptions, setMaterialOptions] = useState<any[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragData, setDragData] = useState<any>(null);
  const [position, setPosition] = useState<any>({ x: 0, y: 0 });
  const [boxPosition, setBoxPosition] = useState<any>({ x: 0, y: 0 });

  const [itemExpression, setItemExpression] = useState<any[]>([]);

  const getPointers = useGetPointers();
  const getMaterials = useGetMaterials({ page: 1, limit: 9999 });
  const getMaterialPointers = useGetMaterialPointers(materialId, selectedType)
  const getCalcPointers = useGetCalculationPointers(materialId, selectedType)
  const getConstantPointers = useGetConstantPointers(materialId, selectedType)
  const getCalculation = useGetCalculation(params.get("calculation_id"))
  const getConstants = useGetConstant({})
  const getCalculations = useGetCalculations({});

  const constants = get(getConstants, "data.data", []);
  const calculation = get(getCalculation, "data.data", {});
  const pointers = get(getPointers, "data.data", []);
  const materials = get(getMaterials, "data.data", []).filter((m) => m.type === "matrix");
  const materialPointers = get(getMaterialPointers, "data.data", []);
  const calculations = get(getCalculations, "data.data", []);
  const calcPointers = get(getCalcPointers, "data.data", []);
  const constantPointers = get(getConstantPointers, "data.data", []);

  function onPointerClick(pointer: any) {
    setFieldValue("expression", [...values.expression, pointer]);
  }

  function definePointersToDisplay() {
    switch (selectedType) {
      case "material":
        return materialPointers
      case "calculation":
        return calcPointers
      case "constant":
        return constantPointers
      default:
        return []
    }
  }

  useEffect(() => {
    if (getMaterials.isSuccess) {
      setMaterialOptions(materials.map((c) => ({ value: c._id, label: c.name })))
    }
  }, [getMaterials.data])

  useEffect(() => {
    if (selectedType === "constant") {
      setMaterialOptions(constants.map((c) => ({ value: c._id, label: c.name })))
    } else if (selectedType === "calculation") {
      setMaterialOptions(calculations.map((c) => ({ value: c._id, label: c.name })))
    } else {
      setMaterialOptions(materials.map((c) => ({ value: c._id, label: c.name })))
    }
  }, [selectedType])

  useEffect(() => {
    if (getCalculation.isSuccess) {
      setValues({
        name: calculation.name,
        uniqueId: calculation.uniqueId,
        expression: calculation.expression,
        type: "calculation",
        unit: calculation.unit,
      })
    }
  }, [getCalculation.data])


  const boxRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handlePositionChange = () => {
      if (boxRef.current && searchRef.current) {
        // console.log(`searchRef.current: ${searchRef.current}`);

        const boxRect = boxRef.current.getBoundingClientRect();
        const searchDiv = searchRef.current.getBoundingClientRect();

        const newBoxY = boxRect.y + searchDiv.height;

        setBoxPosition({ x: boxRect.x, y: newBoxY })
        // console.log(`Box position when there is search div: x = ${boxRect.x}, y = ${newBoxY}`);
      }
    }

    // console.log("useEffect w/ search definePointersToDisplay: ", definePointersToDisplay)

    // if(definePointersToDisplay.length > 0) return handlePositionChange();

    let prevSearchDivOffset = null;
    const currentSearchDivOffset = searchRef.current.offsetHeight;
    
    if(prevSearchDivOffset !== currentSearchDivOffset) {
      // console.log("there is change in searchDivHeight")
      handlePositionChange();
    }
   
    prevSearchDivOffset = searchRef.current.offsetHeight;
    

    // Add an event listener for position changes
    window.addEventListener('resize', handlePositionChange);
    
    // Cleanup the event listener when the component unmounts or the ref changes
    return () => {
      window.removeEventListener('resize', handlePositionChange);
    };
  }, []);


  useEffect(() => {
    let isMounted = true;

    if(isMounted) {
      setItemExpression(values.expression)
    }

    return () => {
      isMounted = false;
    };
  }, [values.expression])

  

  const handleDragStart = (e: any, pointer: any, index: any) => {
    setIsDragging(true)
    
    // Calculate the initial position of the button
    const startX = e.clientX;
    const startY = e.clientY;

    setPosition({
      x: startX,
      y: startY
    });
}

  const handleDragEnd = (e: any, pointer: any, index: number) => {
    setIsDragging(false)

    // Calculate the new position of the circle
    const newPosX = e.clientX;
    const newPosY = e.clientY;

    // console.log("newPos X: ", newPosX)
    // console.log("newPos Y: ", newPosY)

    // console.log("boxPosition X: ", boxPosition.x)
    // console.log("boxPosition Y: ", boxPosition.y)

    const boxRect = boxRef.current.getBoundingClientRect();

    const boxLeft = boxPosition.x - boxRect.width;
    const boxRight = boxPosition.x + boxRect.width;
    const boxTop = boxPosition.y - boxRect.height;
    const boxBottom = boxPosition.y + boxRect.height;

    if (
      newPosX >= boxLeft &&
      newPosX <= boxRight &&
      newPosY >= boxTop &&
      newPosY <= boxBottom
    ) {
      console.log('Circle is inside the box!');
      setFieldValue("expression", [...values.expression, pointer]);
    }
  }

  return (
    <main className="mt-3">
      <div className="grid grid-cols-12 gap-5 mt-2">

        <div className="col-span-6">
          <SelectField
            name="selectedType"
            placeholder="Type"
            label="Type"
            disabled={false}
            onSelect={(val) => {
              setSelectedType(val)
              setMaterialId(null)
            }}
            value={selectedType}
            options={[
              { value: "material", label: "Materials" },
              { value: "constant", label: "Constant" },
              { value: "calculation", label: "Calculation" },
            ]}
          />
        </div>
        <div className="col-span-6">
          <AutocompleteField
            label="Name"
            initialValue=""
            placeholder={`Select ${selectedType}`}
            setValue={(val: string) => setMaterialId(val)}
            options={materialOptions}
          />
        </div>
      </div>


      <section className="flex justify-start gap-2 mt-3">
        {pointers.map((pointer: IPointerOperator, index: number) => (
          <div
            key={index}
            id={`top-${index}`}
            className={`px-3 py-1 rounded bg-red-200 font-medium`}
            draggable="true"
            onDragStart={(e: any) => handleDragStart(e, pointer, index)}
            onDragEnd={(e: any) => handleDragEnd(e, pointer, index)}
            //   onClick={() => onPointerClick(pointer)}
          >
            {pointer.text}
          </div>
        ))}
      </section>

      <section ref={searchRef} className="flex justify-start items-start gap-2 mt-3 flex-wrap min-h-[100px] max-h-[300px] overflow-y-scroll">
        {definePointersToDisplay().map((pointer: any, index: number) => {
          const hasInput = pointer.text.includes("{{search}}");

          return (
            <button
              key={index}
              className="px-3 py-1 rounded bg-red-200 font-medium gap-1 text-left"
              type="button"
              // onClick={() => onPointerClick(pointer)}
              draggable="true"
              onDragStart={(e: any) => handleDragStart(e, pointer, index)}
              onDragEnd={(e: any) => handleDragEnd(e, pointer, index)}
            >
              {pointer.text.replaceAll("{{search}}", "")}
              {hasInput ? <input
                placeholder='Search'
                readOnly
                className="bg-white h-[20px] pointer-events-none rounded w-[85px] p-1 outline-0 ring-0"
                type="text" /> : null}
            </button>
          )
        })}
      </section>

      <section>
        <FieldArray
          name="expression">
          {(arrayHelpers) => {

            if (getCalculation.isLoading) {
              return (
                <div className="flex items-center justify-center h-[200px]">
                  Loading...
                </div>
              )
            }

            // console.log("values: ", values) //setFieldValue

            return (
              <section className="mt-10">
                <p className="text-xs text-gray-500">Calculator</p>
                <div ref={boxRef} className="border p-2 border-gray-900 min-h-[60px] overflow-y-scroll max-h-[300px] bg-gray-100 rounded flex justify-start itms-center flex-wrap gap-2">
                  <ReactSortable list={itemExpression} setList={setItemExpression} className='flex flex-wrap gap-4'>
                    {itemExpression?.map((pointer: IMaterialPointer, index: number) => {

                      let name = "";
                      let val = pointer.text.replaceAll("{{search}}", "");
                      const hasInput = pointer.text.includes("{{");

                      if (hasInput) {
                        const arr = pointer.text.split("_")
                        const index = arr.findIndex((i) => i.includes("{{"))
                        name = arr[index].replace("{{", "").replace("}}", "")
                      }

                      return (
                        <div
                          key={index}
                          onClick={(e: MouseEvent<HTMLDivElement>) => {
                            const node = get(e, "target.nodeName", "").toLowerCase()
                            if (node === "input")
                              return

                            arrayHelpers.remove(index)
                          }}
                          draggable="true"
                          className="px-3 cursor-pointer py-1 rounded bg-red-200 font-medium text-left flex items-center">
                          {val}
                          {hasInput ? (
                            <Field
                              name={`expression.${index}.payload.${name}`}
                              onChange={handleChange}
                              placeholder={capitalize(name)}
                              className="bg-white h-[20px] rounded w-[85px] p-1 outline-0 ring-0"
                            />
                          ) : null}
                        </div>
                      )
                    })}
                  </ReactSortable>
                </div>
                {values.expression.length > 0 ? <p className="text-xs text-amber-500 italic font-semibold">Note: to remove an item, click the pink box.</p> : null}
              </section>
            )
          }}
        </FieldArray>
      </section>


    </main>
  )
}

export default MaterialCalculationForm