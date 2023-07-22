import { isEmpty } from "lodash";
import { QueryCache, useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { endSession } from "../redux/slices/auth";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { SORT_DIRECTION } from "../types/pagination";

export type LoginPayloadType = {
  username: string;
  email: string;
  password: string;
  keepLoggedIn: boolean;
}

export interface IPagination {
  page?: number,
  limit?: number
}

export type CreateUserPayloadType = {
  id: string;
  password: string;
  email: string;
  role: "client-admin" | "user";
  name: string;
  company: string;
  phone: string;
}

export const useAuth = () => {
  const queryCache = new QueryCache()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function signOut() {
    queryCache.clear();
    dispatch(endSession())

    setTimeout(() => {
      navigate("/login")
    }, 500)
  }

  return {
    signOut
  }
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const alertBox = useAlertBox();
  const fetcher = (id: string) => service.delete(`/auth/notification/${id}`)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("user-notifications")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetUserNotification = (args: IPagination) => {
  const queryKey = "user-notifications";
  const params = {
    page: 1,
    limit: 9999
  };

  const { page, limit } = args;
  const alertBox = useAlertBox()
  const fetcher = () => service.get("/auth/me/notification", { params });

  console.log({ args })

  if (!isEmpty(args)) {
    if (page) params["page"] = page;
    if (limit) params["limit"] = limit;
  }

  return useQuery(queryKey, fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useForgetPassword = () => {
  const alertBox = useAlertBox()
  const fetcher = (email: string) => service.post("/auth/forget-password", { email });

  return useMutation(fetcher, {
    onError: (error: any) => {
      console.log(error)
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}

export const useResetPasswordByToken = () => {
  const alertBox = useAlertBox()

  type PayloadType = {
    password: string;
    token: string
  }

  const fetcher = (payload: PayloadType) => service.post("/auth/reset-password", payload);

  return useMutation(fetcher, {
    onError: (error: any) => {
      console.log(error)
      alertBox.show({
        type: "error",
        title: "Something went wrong",
        description: error?.data?.message || "Something went wrong",
      })
    }
  })
}

// used only on auth
export const useGetSingleUser = (userId: string) => {
  const queryKey = ["user", String(userId)];
  const dispatch = useDispatch();
  const fetcher = () => service.get(`/auth/${userId}`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(userId),
    onSuccess: (res) => {
      const user = res.data;
      // dispatch(setAuthenticatedUser(user))
    },
    onError: (error) => {
      console.log({ error })
    }
  })
}

export const useLogin = () => {
  const fetcher = (payload: Partial<LoginPayloadType>) => service.post("/auth", payload);

  return useMutation(fetcher, {
    onError: (error) => {
      console.log(error)
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const fetcher = (userId: string) => service.delete("/auth", {
    data: {
      id: userId
    }
  })

  return useMutation(fetcher, {
    onSuccess: (data: any) => {
      console.log(data);
      queryClient.invalidateQueries(["user-list"])
    },
    onError: (error) => {
      console.log({ error })
    }
  })
}

export const useCreateUser = () => {
  const fetcher = (payload: Partial<CreateUserPayloadType>) => service.post("/auth/register", payload)

  return useMutation(fetcher, {
    onError: (error) => {
      console.log(error)
    }
  })
}

export const useUpdateUser = () => {
  const fetcher = (payload: Partial<CreateUserPayloadType>) => service.put(`/auth/${payload.id}`, payload)

  return useMutation(fetcher, {
    onError: (error) => {
      console.log(error)
    }
  })
}

export const useGetUserList = (args: {
  page?: number,
  limit?: number,
  name?: string,
  enabled?: boolean,
  sort?: string;
  sortDirection?: SORT_DIRECTION;
}) => {
  const { page, limit, enabled, name, sort, sortDirection } = args;
  const params = {
    page: 1,
    limit: 9999
  };

  if (page) params["page"] = page;
  if (limit) params["limit"] = limit;
  if (name) params["search"] = name;
  
  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const queryKey = ["user-list", { page, limit, name, enabled, sort, sortDirection }]
  const fetcher = () => service.get("/auth", { params })

  return useQuery(queryKey, fetcher, {
    enabled,
    onError: (error: any) => {
      console.log(error)
    }
  })
}