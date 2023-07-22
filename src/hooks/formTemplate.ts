import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { SORT_DIRECTION } from "../types/pagination";

export type FormTemplatePayloadType = {
  id?: string;
  name: string;
  uniqueId: string;
  materials: Array<string>;
}

export const useGetFormTemplates = (
  enabled: boolean = true,
  page: number,
  limit: number,
  search?: string,
  sort?: string,
  sortDirection?: SORT_DIRECTION
) => {
  const queryKey: Array<any> = ["form-templates", { page, limit, search, sort, sortDirection }];
  const alertBox = useAlertBox();
  const params = {}

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (search) params["search"] = search;

  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const fetcher = () => service.get(`/form-template`, { params })
  return useQuery(queryKey, fetcher, {
    enabled,
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetFormTemplateData = (id: string, enabled: boolean) => {
  const queryKey: Array<string> = ["form-template", String(id)];
  const alertBox = useAlertBox();
  const fetcher = () => service.get(`/form-template/${id}`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(id) && enabled,
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useCreateFormTemplate = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (payload: FormTemplatePayloadType) => service.post(`/form-template`, payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("form-templates")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useDeleteFormTemplate = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (id: string) => service.delete(`/form-template/${id}`);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("form-templates")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateFormTemplate = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (payload: {
    id: string,
    data: FormTemplatePayloadType
  }) => service.put(`/form-template/${payload.id}`, payload.data);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("form-templates")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}