import dayjs from "dayjs";

export function getDatesOfFinancialYear(year: number, yearEnd: string) {
  const yearStartObj = dayjs(yearEnd).subtract(1, 'year').add(1, 'day');

  return {
    year,
    startDate: yearStartObj.year(year).format('YYYY-MM-DD'),
    endDate: yearStartObj.year(year).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD'),
  }
}

export function isFinancialYearExpired(financialYear: string) {
  return dayjs(financialYear).isBefore(dayjs());
}