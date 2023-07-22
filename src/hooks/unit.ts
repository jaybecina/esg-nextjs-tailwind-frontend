import { useMutation, useQuery, useQueryClient } from "react-query";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { SORT_DIRECTION } from "../types/pagination";

export type UnitPayloadType = {
  id?: string;
  input: string;
  output: string;
  rate: number
}

export const useGetUnits = (
  page?: number,
  limit?: number,
  sort?: string,
  sortDirection?: SORT_DIRECTION,
  search?: string
) => {
  const alertBox = useAlertBox();
  const params = {
    page: 1,
    limit: 9999
  }

  if (page) params["page"] = page
  if (limit) params["limit"] = limit
  if (search) params["search"] = search;

  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const queryKey = ["units", { page, limit, search, sort, sortDirection }]
  const fetcher = () => service.get("/unit", { params })

  return useQuery(queryKey, fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })

}

export const useCreateUnit = () => {
  const alertBox = useAlertBox();
  const fetcher = (payload: UnitPayloadType) => service.post("/unit", payload)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateUnit = () => {
  const alertBox = useAlertBox();
  const fetcher = (payload: UnitPayloadType) => service.put(`/unit/${payload.id}`, payload)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useDeleteUnit = () => {
  const alertBox = useAlertBox();
  const fetcher = (id: string) => service.delete(`/unit/${id}`)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}