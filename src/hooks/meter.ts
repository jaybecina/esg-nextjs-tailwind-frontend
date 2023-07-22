import { fi } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { ROLES } from "../components/AccessControl";
import { RootState } from "../redux/store";
import service from "../service";
import { useAlertBox } from "./alertBox";

export type CreateMeterPayloadType = {
  form: string;
  name: string;
  assignees?: Array<string>;
}

export type MeterParamsType = {
  page: number;
  limit: number;
  name?: string;
  company?: string;
  financialYear?: string;
  assignees?: string;
  approved?: string;
  form?: string;
}


export const useRenameMatrixAttachment = () => {
  const alertBox = useAlertBox();

  const fetcher = (payload: {
    meterId: string,
    attachmentId: string,
    description: string
  }) => service.put(`/meter/${payload.meterId}/attachments/${payload.attachmentId}`, {
    description: payload.description
  })

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUploadMeterAttachment = () => {
  const alertBox = useAlertBox();

  const fetcher = (payload: {
    meterId: string,
    formData: FormData
  }) => service.put(`/meter/${payload.meterId}/attachments`, payload.formData)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useAddMeterAttachment = () => {

  type PayloadType = {
    meterId: string,
    formData: FormData;
  }

  const alertBox = useAlertBox();
  const req = (payload: PayloadType) => service.put(`/meter/${payload.meterId}/attachments`, payload.formData);

  return useMutation(req, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetMeterForms = (args: MeterParamsType) => {
  const userRole = useSelector((state: RootState) => state.auth.user.role);
  const queryKey = ["meters", args]
  const params: { [key: string]: any } = {
    page: args.page,
    limit: args.limit
  };

  if (args.form) params["filters[form]"] = args.form;
  if (args.name) params["search"] = args.name;
  if (args.company) params["filters[company]"] = args.company;
  if (args.assignees) params["filters[assignees][]"] = args.assignees;

  if (userRole === ROLES.SuperAdmin) {
    delete params["filters[company]"]
  }

  const fetcher = () => service.get(`/meter`, { params })

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(args.form)
  })
}

export const useCreateMeterForm = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: CreateMeterPayloadType) => service.post(`/meter`, payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("meters")
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

export const useDeleteMeter = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (id: string) => service.delete(`/meter/${id}`)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("meters")
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

export const useUpdateMeter = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient()
  const fetcher = (payload: {
    id: string;
    data: any;
  }) => service.put(`/meter/${payload.id}`, payload.data)

  return useMutation(fetcher, {
    onSuccess: () => {
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

export const useGetMeter = (id: string) => {
  const alertBox = useAlertBox();
  const queryKey = ["meter", String(id)]
  const fetcher = () => service.get(`/meter/${id}`);

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

// export const useExportMaterial = (d) => {

// }