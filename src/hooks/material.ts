import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import service from "../service";
import { SORT_DIRECTION } from "../types/pagination";
import { useAlertBox } from "./alertBox";

export interface MaterialType {
  _id?: string;
  name: string;
  uniqueId: string;
  size: number;
  type: "text" | "matrix";
}

export interface MaterialTextType extends MaterialType {
  content: Array<{ question: string, hints: string }>
}

export interface MaterialMatrixType extends MaterialType {
  content: [
    {
      rows: Array<{ name: string }>,
      columns: Array<{
        name: string;
        inputType: string;
        outputUnit: string
      }>
    }
  ]
}

export const useGetMaterials = (args: {
  options?: UseQueryOptions;
  page?: number;
  limit?: number;
  search?: string;
  bookmarked?: boolean;
  sort?: string;
  sortDirection?: SORT_DIRECTION;
}) => {
  const params = {
    page: 1,
    limit: 9999
  };
  const { page, options, limit, sort, sortDirection, search, bookmarked } = args;

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (search) params["search"] = search;
  if (bookmarked) params["bookmarked"] = bookmarked;
  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const queryKey = ["materials", { page, limit, search, bookmarked, sort, sortDirection }];
  const fetcher = () => service.get("/material", {
    params
  })

  return useQuery(queryKey, fetcher, options ? options : {})
}

export const useGetMeterFormMaterials = (materialIds: Array<string>) => {
  const promises: Array<Promise<AxiosResponse<any, any>>> = [];
  const alertBox = useAlertBox();
  const queryKey = ["material-ids"].concat(materialIds)

  materialIds.forEach((id: string) => {
    promises.push(service.get(`/material/${id}`))
  })

  const fetcher = () => Promise.all(promises);

  return useQuery(queryKey, fetcher, {
    retry: false,
    enabled: materialIds.length > 0,
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || ""
      })
    }
  })
}

export const useCreateMaterial = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: Partial<MaterialMatrixType | MaterialTextType>) => service.post("/material", payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("materials")
    },
    onError: (error: any) => {
      console.log({ error })
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || ""
      })
    }
  })
}

export const useUpdateMaterial = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: Partial<MaterialMatrixType | MaterialTextType>) =>
    service.put(`/material/${payload._id}`, payload)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("materials")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || ""
      })
    }
  })
}

export const useDeleteMaterial = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (id: string) => service.delete(`/material/${id}`)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("materials")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}