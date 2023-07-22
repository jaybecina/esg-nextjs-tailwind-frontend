import React, { FC, useState } from 'react'
import { useGetMeterFormMaterials } from '../../hooks/material';
import { get } from 'lodash';
import { Collapse } from 'react-collapse'
import { ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import cx from "classnames"

interface IProps {
  meter: any;  
  form: any;
}

const DownloadMeterItem:FC<IProps> = ({ meter, form }) => {

  const getFormMaterials = useGetMeterFormMaterials(get(form, 'formTemplate.materials', []));
  const materials = get(getFormMaterials, "data", []);

  const [isOpen, setIsOpen] = useState<boolean>(false)

  function toggleCollapse() {
    setIsOpen(!isOpen)
  }

  function handleDownloadClick(index: number) {
    const material = materials[index];
    const answers = meter.inputs[index];

    if (material.data.type === "text") {
      generateCsvFromQuestions(material, answers)
    } else {
      generateCsvFromMatrix(material, answers)
    }
  }

  function generateCsvFromMatrix(material, answers) {
    const data = [];
    
    const { columns, rows } = material.data.content[0]
    const headers = ['col', ...columns.map((col) => col.name.split(" ").join('-'))];

    answers.answer.forEach((answer, index) => {
      const rowData = {}

      answer.forEach((innerAns, innerIndex) => {
        rowData['col'] = rows[index].name
        rowData[headers[innerIndex + 1]] = innerAns
      })

      data.push(rowData)
    })

    const rowsData = data.map((row) => {
      return headers.map((header) => row[header]).join(',');
    });

    initiateDownload(headers, rowsData, material.data.uniqueId)
  }

  function generateCsvFromQuestions(material, answers) {
    const data = [];

    material.data.content.forEach((item, index) => {
      const payload = {
        ...item,
        answer: answers[index].answer
      }
      data.push(payload)
    })

    const headers = Object.keys(data[0]);

    const rows = data.map((row) => {
      return headers.map((header) => row[header]).join(',');
    });

    initiateDownload(headers, rows, material.data.uniqueId)
  }

  function initiateDownload(headers, rows, name) {
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create a blob object with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${name}.csv`;

    // Programmatically click the anchor element to trigger the download
    anchor.click();

    // Clean up resources
    URL.revokeObjectURL(anchor.href);
  }
  
  return (
    <div  className="shadow-md rounded py-4 px-3 border border-gray-300">
      <button
        className="w-full flex justify-between items-center"
        onClick={toggleCollapse}
        type="button">
        <p className="font-semibold">{meter.name}</p>
        
        <ChevronDownIcon className={cx("h-4 w-4 duration-150 transition ease-linear", {
          'rotate-[-180deg]': isOpen
        })} />
      </button>

      <Collapse isOpened={isOpen}>
        <div className="ml-10 mt-2 flex flex-col items-start">
          {materials && materials.map((material, index) => (
            <p
              key={index} 
              className="">
              {material.data.name}
              <button 
                onClick={() => handleDownloadClick(index)}
                className="ml-3"
                type="button">
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
            </p>
          ))}
        </div>
      </Collapse>
    </div>
  )
}

export default DownloadMeterItem