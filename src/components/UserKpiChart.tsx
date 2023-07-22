import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, BarChart } from 'recharts';
import randomColor from "randomcolor"
import { Legend } from 'recharts'
import cx from "classnames";
import { ResponsiveContainer } from 'recharts'
import { useGetMatrixMaterialChartData } from '../hooks/form';
import { useParams } from 'react-router-dom';
import { get } from 'lodash';
import { processGraph } from '../helper/processGraph';
import { InboxIcon } from '@heroicons/react/24/outline';
import { formatByThousand } from '../helper/utils';

const UserKpiChart = () => {

  const params = useParams()
  const [chartData, setChartData] = useState<Array<any>>([])
  const [chartName, setChartName] = useState<string>("");
  const [chartPages, setChartPages] = useState<number>(0);
  const [chartIndex, setChartIndex] = useState<number>(0);
  const getChartData = useGetMatrixMaterialChartData(params.formId);

  const memoizedData = useMemo(() => {
    const base = get(getChartData, "data.data", []);
    const data = get(base, `[${chartIndex}].groupByRow`, []);

    setChartPages(base.length)
    setChartName(base[chartIndex]?.materialName)

    return processGraph(data)
  }, [getChartData.data])

  const colors = useMemo(() => {
    const count = Object.keys(get(memoizedData, "[0]", {})).length;
    return randomColor({ luminosity: 'bright', hue: 'red', count: count || 10 });
  }, [memoizedData])

  useEffect(() => {
    if (getChartData.isSuccess) {
      const base = get(getChartData, "data.data");
      const data = get(base, `[${chartIndex}].groupByRow`, []);
      const rechartData = processGraph(data)

      console.log({ data, rechartData })

      setChartPages(base.length)
      setChartName(base[chartIndex]?.materialName)
      setChartData(data)
    }

    Array.from(document.getElementsByClassName('.recharts-legend-item-text')).forEach((text) => {
      console.log(text)
    })
  }, [getChartData.data, chartIndex])

  const CustomTooltip = (args: any) => {
    const { active, payload, label } = args;

    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-2 rounded outline-0 border-0 max-h-[320px] w-fit shadow-lg relative overflow-scroll ring-0">
          {payload.map((item: any, index: number) => {
            const datakey = item.dataKey.replace('.value', '');

            return (
              <div
                key={index}
                className="grid grid-cols-12">
                <div className="col-span-9">
                  <p
                    style={{ color: item.color }}
                    className="truncate text-sm">{item.name.replace('.value', '') + " " + `(${item.payload[datakey].unit})`}:</p>
                </div>
                <div className="col-span-3">
                  <p
                    style={{ color: item.fill }}
                    className="text-right text-sm">{formatByThousand(parseFloat(item.payload[datakey].value.toFixed(2))) }</p>
                </div>
              </div>
            )
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full bg-white shadow-md px-5 rounded-md py-[1rem]">
      {getChartData.isLoading ? (
        <>
          <section className="h-[410px] flex items-center justify-center">
            <p>Loading...</p>
          </section>
        </>
      ) : null}

      {!chartData || chartData.length === 0 && getChartData.isSuccess ? (
        <div className="h-[416px] flex items-center justify-center">
          <div className="opacity-20 flex items-center flex-col">
            <InboxIcon className="w-12 h-12" />
            <p className="font-semibold text-sm">No Data Found</p>
          </div>
        </div>
      ) : null}

      {chartData && chartData.length > 0 && getChartData.isSuccess ? (
        <div className="">
          <p className="mb-2 text-xl font-semibold">{chartName}</p>
          <ResponsiveContainer
            width="95%"
            height={chartData.length > 0 ? 360 : 410}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              {chartData.length > 7 ? (
                <XAxis
                  dataKey="row"
                  interval={0}
                  tick={{ fontSize: 12 }}
                  angle={50} tickMargin={50}
                  height={120} />
              ) : (
                <XAxis dataKey="row" />
              )}
              <YAxis />
              <Tooltip
                wrapperStyle={{ pointerEvents: 'auto' }}
                content={<CustomTooltip />} />
              <Legend formatter={(value: string) => value.replace('.value', '')} />
              {chartData && chartData.length > 0 && Object.keys(chartData[0]).map((key: string, index: number) => {
                if (key.toLowerCase() !== "row") {
                  return (
                    <Bar
                      key={index}
                      dataKey={`${key}.value`}
                      fill={colors[index] || "#E30613"}>
                    </Bar>
                  )
                }
              })}
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-1">
            {[...Array(chartPages)].map((data: any, index: number) => (
              <button
                key={index}
                onClick={() => setChartIndex(index)}
                type="button">
                <p className={cx("text-sm", {
                  "text-gray-200": chartIndex !== index,
                  "text-gray-500": chartIndex == index,
                })}>⬤</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default UserKpiChart