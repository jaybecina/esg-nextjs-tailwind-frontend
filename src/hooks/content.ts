import { useMutation, useQuery, useQueryClient } from "react-query";
import service from "../service";
import { useAlertBox } from "./alertBox";

export type ContentPayloadType = {
  id?: string;
  title?: string;
  thumbnail?: string;
  content?: string;
  intro?: string;
  slug?: string;
  category?: string;
  customFields?: { [key: string]: any };
}

export const useCreateContent = () => {
  const queryClient = useQueryClient()
  const alertBox = useAlertBox();
  const fetcher = (payload: Partial<ContentPayloadType>) => service.post("/content", payload);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("contents")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetContents = (page?: number, limit?: number, category?: string) => {
  const params = {
    page: 1,
    limit: 9999
  };

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (category) params["category"] = category;

  const queryKey = ["contents", { page, limit, category }];
  const alertBox = useAlertBox();
  const fetcher = () => service.get("/content", { params })

  return useQuery(queryKey, fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useDeleteContent = () => {
  const alertBox = useAlertBox();
  const fetcher = (id: string) => service.delete(`/content/${id}`)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateContent = () => {
  const alertBox = useAlertBox();
  const fetcher = (payload: {
    id: string;
    data: Partial<ContentPayloadType>
  }) => service.put(`/content/${payload.id}`, payload.data)

  return useMutation(fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}