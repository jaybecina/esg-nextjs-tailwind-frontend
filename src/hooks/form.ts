import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getDatesOfFinancialYear } from "../helper/financialYear";
import { setAuthLockedForm } from "../redux/slices/auth";
import { RootState } from "../redux/store";
import service from "../service";
import { SORT_DIRECTION } from "../types/pagination";
import { useAlertBox } from "./alertBox";

export type CreateFormPayloadType = {
  formTemplate: string;
  company: string;
  financialYear: string;
}

export const useReleaseForm = () => {
  const alertBox = useAlertBox()
  const queryClient = useQueryClient();
  const fetcher = (formId: string) => service.put(`/form/${formId}/resetStatus`);

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetMatrixMaterialChartData = (formId: string) => {
  const alertBox = useAlertBox()
  const queryKey: string[] = ["matrix-form-chart", String(formId)]
  const fetcher = () => service.get(`/form/${formId}/matrixInputResult`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(formId),
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetFormNotifications = (args: { formId: string }) => {
  const alertBox = useAlertBox()
  const queryKey = ["form-notifications", String(args.formId)];
  const params = {
    page: 1,
    limit: 9999
  }

  const fetcher = () => service.get(`/form/${args.formId}/notification`, {
    params
  });

  return useQuery({
    queryKey,
    enabled: Boolean(args.formId),
    queryFn: fetcher,
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetForms = (args: {
  page: number;
  limit: number;
  status?: string;
  companyId: string;
  search?: string;
  bookmarked?: boolean;
  sort?: string;
  sortDirection?: SORT_DIRECTION;
}) => {
  const { company: { yearEnd }, year } = useSelector((state: RootState) => state.companyAndYear)
  const { page, limit, status, companyId, search, sortDirection, sort, bookmarked } = args;

  const queryKey = ["forms", { 
    page, limit, status, companyId, search, bookmarked, sort, sortDirection, year 
  }]
  const finYear = getDatesOfFinancialYear(parseInt(year), yearEnd);

  const params: { [key: string]: any } = {
    page,
    limit,
    "filters[financialYear]": finYear.endDate
  };

  if (companyId) params["filters[company]"] = companyId;
  if (status) params["filters[status]"] = status;
  if (search) params["search"] = search;
  if (bookmarked) params["bookmarked"] = bookmarked;
  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const fetcher = () => service.get(`/form`, { params })

  return useQuery(queryKey, fetcher, {
    refetchOnWindowFocus: true
  })
}

export const useLockForm = () => {
  type LockedFormType = {
    id: string;
    name: string;
    locked: boolean
  }

  const dispatch = useDispatch();
  const alertBox = useAlertBox();
  const fetcher = (payload: LockedFormType) => service.put(`/form/${payload.id}/lock`, {
    locked: payload.locked
  })

  return useMutation(fetcher, {
    onSuccess: (data: any, vars) => {
      dispatch(setAuthLockedForm(vars))
    },
    onError: (error: any) => {
      if (error?.data?.error?.httpCode !== 401) {
        alertBox.show({
          type: "error",
          title: "Something went wrong",
          description: error?.data?.message || "Something went wrong",
        })
      }
    }
  })
}

export const useGetForm = (id: string) => {
  const alertBox = useAlertBox();
  const queryKey: Array<string> = ["form", String(id)]
  const fetcher = () => service.get(`/form/${id}`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(id),
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}

export const useUpdateForm = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: {
    id: string;
    data: {
      assignees: Array<string>;
      submitted: boolean;
      nextStatus?: string;
    }
  }) => service.put(`/form/${payload.id}`, payload.data)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms")
      queryClient.invalidateQueries("matrix-form-chart")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}

export const useCreateForm = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: CreateFormPayloadType) => service.post(`/form`, payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}

export const useDeleteForm = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (id: string) => service.delete(`/form/${id}`);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}