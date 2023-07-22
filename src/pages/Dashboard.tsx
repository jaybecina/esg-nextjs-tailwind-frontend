import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import * as rechart from "recharts"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import SelectField from '../components/SelectField';
import { useTranslation } from "react-i18next"
import CompanyFinYearSelect from '../components/CompanyFinYearSelect';
import InfoBar from '../components/InfoBar';
import { useGetCompany, useGetDashboardData, useGetMaterialOptions } from '../hooks/company';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useGetMaterials } from '../hooks/material';
import randomColor from "randomcolor";
import { processGraph } from '../helper/processGraph';
import { useGetForms } from '../hooks/form';

interface IProps { }

const Dashboard: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const { company, year } = useSelector((state: RootState) => state.companyAndYear)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")

  const getDashboardData = useGetDashboardData(selectedMaterial);
  const getOptions = useGetMaterialOptions();
  const options = get(getOptions, "data.data", []);
  const chartTitle = options.find((m) => m._id === selectedMaterial)?.name;

  const memoizedData = useMemo(() => {
    if (getDashboardData.isSuccess) {
      const data = get(getDashboardData, "data.groupByRow", []);
      return processGraph(data)
    }
  }, [getDashboardData.data])

  const colors = useMemo(() => {
    const count = Object.keys(get(memoizedData, "[0]", {})).length;
    return randomColor({ luminosity: 'bright', hue: 'red', count: count || 10 });
  }, [memoizedData])

  const getFormsParams = {
    page: 1,
    limit: 9999,
    companyId: company?._id,
    search: "",
    bookmarked: false
  }

  const getForms = useGetForms(getFormsParams);
  const meta = get(getForms, "data.meta", {});

  useEffect(() => {
    if (getOptions.isSuccess) {
      if (!selectedMaterial) {
        setSelectedMaterial(options[0]?._id)
      }
    }
  }, [getOptions.data])

  const CustomTooltip = (args: any) => {
    const { active, payload, label } = args;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded outline-0 border-0 max-h-[280px] w-[150px] shadow-lg relative overflow-scroll">
          {payload.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-start gap-x-2">
              <p
                style={{ color: item.color }}
                className="">{item.name}:</p>
              <p
                style={{ color: item.fill }}
                className="">{item.value}</p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };


  return (
    <main className="p-5">

      <div className="flex items-center justify-end">
        <CompanyFinYearSelect />
      </div>

      <section className="mt-5">
        <InfoBar
          totalToFillUp={get(meta, "meter.incomplete", 0)}
        />
      </section>

      <div className="w-full mt-[3rem] bg-white shadow-md py-3 px-5 rounded">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-3xl font-semibold">{chartTitle}</p>
          </div>

          <div className="w-[250px]">
            <SelectField
              name="company"
              disabled={false}
              placeholder={t("Select material")}
              canSelectDisable
              label="Material"
              onSelect={(val: any) => setSelectedMaterial(val)}
              value={selectedMaterial}
              options={options.map((mat: any) => {
                return {
                  value: mat._id,
                  label: mat.name
                }
              })}
            />
          </div>
        </div>

        <div className="mb-10">
          {getDashboardData.isLoading ? (
            <section className="flex items-center justify-center h-[520px]">
              <p>Loading...</p>
            </section>
          ) : (
            <ResponsiveContainer width="95%" height={520}>
              <rechart.BarChart data={memoizedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="row" />
                <YAxis />
                <Tooltip
                  wrapperStyle={{ pointerEvents: 'auto' }}
                  content={<CustomTooltip />} />
                <rechart.Legend />
                {memoizedData && memoizedData.length > 0 && Object.keys(memoizedData[0]).map((key: string, index: number) => {
                  if (key.toLowerCase() !== "row") {
                    return (
                      <Bar
                        key={index}
                        dataKey={key}
                        fill={colors[index] || "#E30613"}>
                      </Bar>
                    )
                  }
                })}
              </rechart.BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </main>
  )
}

export default Dashboard;