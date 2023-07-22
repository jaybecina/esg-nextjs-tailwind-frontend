import { useMutation, useQuery, useQueryClient } from "react-query";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { SORT_DIRECTION } from "../types/pagination";

export interface IConstantSetting {
  _id?: string;
  name: string;
  uniqueId: string;
  year: number;
  unit: string;
  remarks?: string;
  meta: Array<{
    location: string;
    value: string;
  }>
}

export const useDeleteConstant = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (id: string) => service.delete(`/constant/${id}`);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("constant")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useCreateConstant = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: IConstantSetting) => service.post(`/constant`, payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("constant")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateConstant = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: {
    id: string,
    data: IConstantSetting
  }) => service.put(`/constant/${payload.id}`, payload.data);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("constant")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetConstant = (args: {
  page?: number,
  limit?: number,
  sort?: string;
  sortDirection?: SORT_DIRECTION,
  search?: string;
}) => {
  const { page, limit, sort, sortDirection, search } = args;
  const params = {
    page: 1,
    limit: 9999
  };

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (search) params["search"] = search;

  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const alertBox = useAlertBox();
  const queryKey: any[] = ["constant", { ...args }];
  const fetcher = () => service.get(`/constant`, { params })

  return useQuery({
    queryKey,
    enabled: true,
    queryFn: fetcher,
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}