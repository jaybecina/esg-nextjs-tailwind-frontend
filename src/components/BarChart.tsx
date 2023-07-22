import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/solid';
import { FC, useState } from 'react';
import cx from "classnames";
import * as rechart from "recharts"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import PopupModal from './PopupModal';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IProps {
  data: Array<any>;
}

const BarChart: FC<IProps> = ({ data }) => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function closeModal() {
    setModalVisible(false)
  }

  return (
    <main className="main border-jll-gray rounded-md border-[1px] shadow-lg bg-white h-full">

      <PopupModal
        position="center"
        onClose={closeModal}
        isVisible={modalVisible}>
        <div
          data-cy="barchart-magnify-modal"
          className="relative p-5 rounded-lg border shadow-lg bg-white w-[980px]">
          <div className="flex justify-between items-center mb-5">
            <p className="font-bold">Actual Total Electricity Consumption Per Month</p>
            <button
              onClick={closeModal}
              data-cy="barchart-modal-close-btn"
              type="button">
              <XMarkIcon className="w-5 h-6" />
            </button>
          </div>
          <rechart.BarChart
            width={920}
            height={450}
            data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis dataKey="value" />
            <Tooltip />
            <Bar
              barSize={38}
              dataKey="value"
              fill="#E30613">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </rechart.BarChart>
        </div>
      </PopupModal>

      <div className={cx("flex p-3", {
        "justify-center": data.length === 0,
        "justify-between": data.length > 0,
      })}>
        <p className="font-bold">Actual Total Electricity Consumption Per Month</p>

        {data.length > 0 && (
          <button
            onClick={() => setModalVisible(true)}
            data-cy="barchart-magnify-btn"
            className="cursor-pointer"
            type="button">
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <rechart.BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis dataKey="value" />
            <Tooltip />
            <Bar
              barSize={38}
              dataKey="value"
              fill="#E30613">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </rechart.BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="w-full h-[280px] flex items-center justify-center p-5">
          <div className="flex flex-col items-center gap-3">
            <p className="text-jll-black">Not working yet, waiting for your data to update.</p>
            <img
              height={200}
              width={220}
              src="/assets/placeholder-chart.png"
              alt="placeholder-chart" />
          </div>
        </div>
      )}
    </main>
  )
}

export default BarChart