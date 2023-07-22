import Avatar from '../components/Avatar'
import LargeDynamicWidget from '../components/LargeDynamicWidget'
import LargeStaticWidget from '../components/LargeStaticWidget'
import LineChart from '../components/LineChart'
import { useTranslation, } from "react-i18next"
import { RootState } from '../redux/store'
import { useSelector } from "react-redux"
import { isEmpty } from 'lodash'
import { useState } from 'react'
import CompanyFinYearSelect from '../components/CompanyFinYearSelect'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const lineChartData = [
  {
    name: "1",
    percentage: 79
  },
  {
    name: "2",
    percentage: 20
  },
  {
    name: "3",
    percentage: 24
  },
  {
    name: "4",
    percentage: 79
  },
  {
    name: "5",
    percentage: 30
  },
  {
    name: "6",
    percentage: 12
  },
  {
    name: "7",
    percentage: 76
  },
  {
    name: "8",
    percentage: 23
  },
  {
    name: "9",
    percentage: 30
  },
  {
    name: "10",
    percentage: 55
  },
  {
    name: "11",
    percentage: 45
  },
  {
    name: "12",
    percentage: 29
  },
  {
    name: "13",
    percentage: 100
  },
];

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth)
  const logo = auth?.user?.company?.logo?.url || "";

  const [year, setYear] = useState<any>("2022");
  const [company, setCompany] = useState<any>({});

  useEffect(() => {
    if (auth.user.role === "user") {
      navigate("/forms")
    }
  }, [])

  return (
    <main className="p-5">

      <div className="flex items-center justify-between">
        {!isEmpty(auth.user) ? (
          <header>
            <div className="flex items-center gap-3">
              <Avatar
                alternativeText={auth?.user?.company?.name || ""}
                size="md"
                url={logo} />
              <div>
                <p className="font-bold text-lg mb-0">{t("Hello")}, {auth.user
                  ? `${auth.user.email} (${auth.user.role})`
                  : "Kenson"}</p>
                <p className="-mt-1">{t("Have a nice day at work")}</p>
              </div>
            </div>
          </header>
        ) : <p>Loading...</p>}
        <CompanyFinYearSelect />
      </div>

      <div className="flex items-center mt-8 justify-start gap-5">
        <LargeDynamicWidget
          date={new Date()}
          label="Check Report"
          progress={63}
          totalProgress={95}
          dayLeft={2}
        />
        <LargeStaticWidget
          label="User List"
          text="Let's start to check Forms."
          href=""
          image="/assets/laptop.png"
          alternativeText="laptop-data-img"
          color="orange"
        />
        <LargeStaticWidget
          label="User Feedback"
          text="Create a better user experience for the platform"
          href=""
          image="/assets/questionnaire.png"
          alternativeText="laptop-data-img"
          color=""
        />
      </div>

      <div className="mt-5">
        <LineChart data={lineChartData} />
      </div>
    </main>
  )
}

export default Home