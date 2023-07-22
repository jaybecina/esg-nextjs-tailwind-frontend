import { RootState } from '../redux/store'
import { useSelector } from "react-redux"
import { get, orderBy } from 'lodash'
import { useGetCompany } from '../hooks/company'
import { usePagination } from '../helper/paginate'
import CompanyFinYearSelect from '../components/CompanyFinYearSelect'
import InfoBar from '../components/InfoBar'
import HomeTable from '../components/home/HomeTable'
import Pagination from '../components/Pagination'
import { useGetForms } from '../hooks/form'
import { useEffect, useState } from 'react'
import { SORT_DIRECTION } from '../types/pagination'


const Home = () => {
  const { company } = useSelector((state: RootState) => state.companyAndYear)

  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(SORT_DIRECTION.DESC)

  const paginate = usePagination(10)

  const getForms = useGetForms({
    page: paginate.page,
    limit: paginate.resultPerPage,
    companyId: company?._id,
    sort: sortBy,
    sortDirection
  });

  const forms = get(getForms, "data.data", []);
  const meta = get(getForms, "data.meta", {});

  function onSortClick(sortBy: string, direction: SORT_DIRECTION) {
    setSortBy(sortBy);
    setSortDirection(direction);
  }

  useEffect(() => {
    if (getForms.data) {
      const { data, meta } = get(getForms, "data") as any;

      paginate.setMeta(meta)

      if (data.length === 0 && meta.page > 1) {
        paginate.handlePrevClick()
      }
    }
  }, [getForms.data])

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

      <div className="mt-[3rem]">
        <HomeTable
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSortClick={onSortClick}
          loading={getForms.isLoading}
          page={paginate.page}
          header={[
            { label: "Index" },
            { label: "File", key: "file" },
            { label: "User Complete Schedule", key: "inputProgress", sortable: true },
            { label: "Last Update Time", key: "updatedAt", sortable: true },
            { label: "Admin Check Progress", key: "adminCheckedProgress", sortable: true }
          ]}
          data={forms}>
          <Pagination {...paginate} />
        </HomeTable>
      </div>
    </main>
  )
}

export default Home