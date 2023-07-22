import { get } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import service from "../service";
import { useAlertBox } from "./alertBox";

export type BookmarkPayloadType = {
  collectionName: string;
  documentId: string;
  data?: any;
  page?: number;
  limit?: number;
}

export const useCreateBookmark = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (payload: BookmarkPayloadType) => service.post("/bookmark", payload);

  return useMutation(fetcher, {
    onMutate: async ({ data, collectionName, page, limit }) => {
      // const queryKey = ['bookmarks', { collection: collectionName, page, limit }]
      // await queryClient.cancelQueries({ queryKey: 'bookmarks' })

      // const previousData = queryClient.getQueryData(queryKey) as any;

      // queryClient.setQueryData(queryKey, { ...previousData, data: [...previousData.data, data] })

      // return { previousData }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("bookmarks")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: get(error, "data.message")
      })
    }
  })
}

export const useGetBookmarks = (collectionName: string, page: number, limit: number) => {
  const alertBox = useAlertBox();
  const querykey: Array<any> = ["bookmarks", { collection: collectionName, page, limit }];

  const params = {
    page,
    limit
  };

  if (collectionName) params["filters[collectionName]"] = collectionName;

  const fetcher = () => service.get("/bookmark", { params })

  return useQuery(querykey, fetcher, {

    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: get(error, "data.message")
      })
    }
  })
}

export const useDeleteBookmark = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (id: string) => service.delete(`/bookmark/${id}`);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("bookmarks")
    },
    onError: (error: any) => {
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: get(error, "data.message")
      })
    }
  })
}