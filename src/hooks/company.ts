import { get, isEmpty, isNil } from "lodash";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getDatesOfFinancialYear } from "../helper/financialYear";
import { RootState } from "../redux/store";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { SORT_DIRECTION } from "../types/pagination";

export type CompanyPayloadType = {
  name: string;
  yearEnd: string;
  phone: string;
  email: string;
  expiryDate: string;
  logo?: any,
  admin: Partial<{
    password: string;
    email: string;
    role: string;
    name: string;
    phone: string;
  }>;
}

export const useGetMaterialOptions = () => {
  const alertBox = useAlertBox();
  const { company: { yearEnd }, year, companyId } = useSelector((state: RootState) => state.companyAndYear)
  const finYear = getDatesOfFinancialYear(parseInt(year), yearEnd);
  const queryKey: string[] = ["dashboard-material-options", finYear.endDate, companyId];

  const fetcher = () => service.get(`/company/${companyId}/financialYear/${finYear.endDate}/material`);

  return useQuery({
    queryKey,
    enabled: true,
    queryFn: fetcher,
    onError: (err: any) => {
      alertBox.showError(err?.data?.message)
    }
  })
}

export const useGetAvailableLocations = () => {
  const alertBox = useAlertBox();
  const queryFn = () => service.get("/location")

  return useQuery({
    queryKey: "locations",
    enabled: true,
    queryFn,
    onError: (err: any) => {
      alertBox.showError(err?.data?.message)
    }
  })
}

export const useGetDashboardData = (materialId: string) => {
  const alertBox = useAlertBox();
  const { company, year } = useSelector((state: RootState) => state.companyAndYear)

  const finYear = getDatesOfFinancialYear(parseInt(year), company.yearEnd)

  const queryKey = ['dashboard', String(company?._id), String(finYear.endDate), String(materialId)];

  const fetcher = () => service.get(`/company/${company?._id}/financialYear/${finYear.endDate}/material/${materialId}`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(materialId),
    onError: (err: any) => {
      // alertBox.show({
      //   type: "error",
      //   title: "Something went wrong",
      //   description: err?.data?.message
      // })
    }
  })
}

export const useGetCompanyUsers = (companyId: string) => {
  const queryKey = ["company-users", String(companyId)];
  const fetcher = () => service.get(`/company/${companyId}/users`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(companyId),
    onError: (error: any) => {
      console.log({ error })
    }
  })
}

export const useGetCompanyByFinancialYear = () => {
  const alertBox = useAlertBox();
  const { companyId, year, company: { yearEnd } } = useSelector((state: RootState) => state.companyAndYear);

  const finYear = getDatesOfFinancialYear(parseInt(year), yearEnd);

  const queryKey: Array<any> = ["company-data", String(companyId), String(finYear.endDate)];

  const fetcher = () => service.get(`/company/${companyId}/financialYear/${finYear.endDate}`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(year && yearEnd),
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCompany = (id: string) => {
  const queryKey: Array<any> = ["company-data", String(id)]
  const fetcher = () => service.get(`/company/${id}`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(id)
  })
}

export const useGetCompanyList = (
  page?: number,
  limit?: number,
  search?: string,
  sort?: string,
  sortDirection?: SORT_DIRECTION
) => {
  const params = {
    page: 1,
    limit: 9999
  };

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (search) params["search"] = search;

  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const queryKey: Array<any> = ["company-list", { page, limit, search, sort, sortDirection }]
  const fetcher = () => service.get("/company", { params })

  return useQuery(queryKey, fetcher, {
    onError: (error) => {
      console.log({ error })
    }
  })
}

export const useCreateCompany = () => {
  const alertBox = useAlertBox();
  const req = (payload: FormData) => service.post("/company", payload);

  return useMutation(req, {
    onError: (error) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: get(error, "data.message")
      })
    }
  })
}

export const useDeleteCompany = () => {
  const alertBox = useAlertBox();
  const req = (companyId: string) => service.delete(`/company/${companyId}`)

  return useMutation(req, {
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message
      })
    }
  })
}

export const useUpdateCompany = () => {
  const alertBox = useAlertBox();
  const req = (payload: {
    id: string;
    company: FormData
  }) => service.put(`/company/${payload.id}`, payload.company)

  return useMutation(req, {
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message
      })
    }
  })
}