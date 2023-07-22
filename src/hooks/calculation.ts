import { isEmpty } from "lodash";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { IMaterialPointer, IPointerOperator } from "../components/materialList/MaterialCalculationForm";
import { setAuthenticatedUser } from "../redux/slices/auth";
import service from "../service";
import { useAlertBox } from "./alertBox";
import { number } from "yup";
import { RootState } from "../redux/store";
import { getDatesOfFinancialYear } from "../helper/financialYear";
import { SORT_DIRECTION } from "../types/pagination";

type Payload = {
  name: string,
  uniqueId: string,
  unit?: string,
  expression: Array<IMaterialPointer | IPointerOperator>
} | { [key: string]: any }

export const useGetPointers = () => {
  const queryKey: string = "pointer";
  const alertBox = useAlertBox();
  const fetcher = () => service.get("/pointer")

  return useQuery(queryKey, fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetMaterialPointers = (materialId: string, type: string) => {
  const queryKey: string[] = ["material-pointer", String(materialId)]
  const alertBox = useAlertBox();
  const fetcher = () => service.get(`/material/${materialId}/pointer`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(materialId) && type === "material",
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCalculationPointers = (materialId: string, type: string) => {
  const queryKey: string[] = ["calculation-pointers", String(materialId)]
  const alertBox = useAlertBox();
  const fetcher = () => service.get(`/pointer/calculation/${materialId}`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(materialId) && type === "calculation",
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetConstantPointers = (materialId: string, type: string) => {
  const queryKey: string[] = ["constant-pointers", String(materialId)]
  const alertBox = useAlertBox();
  const fetcher = () => service.get(`/pointer/constant/${materialId}`)

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(materialId) && type === "constant",
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useCreateCalculation = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (payload: Payload) => service.post("/calculation", payload)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("calculations")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateCalculation = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();
  const fetcher = (payload: {
    id: string,
    data: Payload
  }) => service.put(`/calculation/${payload.id}`, payload.data)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("calculations")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCalculations = (args: {
  page?: number,
  limit?: number,
  name?: string,
  sort?: string;
  sortDirection?: SORT_DIRECTION;
}) => {
  const { page, limit, name, sort, sortDirection } = args;
  const params = {
    page: 1,
    limit: 9999
  }

  if (page) params['page'] = page;
  if (limit) params['limit'] = limit;
  if (name) params['search'] = name;
  if (sort && sortDirection) params[`sort[${sort}]`] = sortDirection;

  const alertBox = useAlertBox();
  const queryKey: any[] = ["calculations", args];
  const fetcher = () => service.get("/calculation", { params })

  return useQuery(queryKey, fetcher, {
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCalculation = (id: string) => {
  const queryKey: string[] = ["calculation", String(id)];
  const alertBox = useAlertBox();
  const fetcher = () => service.get(`/calculation/${id}`);

  return useQuery(queryKey, fetcher, {
    enabled: Boolean(id),
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useDeleteCalculation = () => {
  const queryClient = useQueryClient();
  const alertBox = useAlertBox();
  const fetcher = (id: string) => service.delete(`/calculation/${id}`);

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("calculations")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCalculationReport = (params: {
  name: string
  companyId: string;
  endDate: any;
}) => {

  const { name, companyId, endDate } = params;
  const alertBox = useAlertBox();
  const path = `/report/${name}/company/${companyId}/financialYear/${endDate}`

  return useQuery({
    queryKey: 'calculation-report-export',
    enabled: false,
    queryFn: () => service.get(path),
    onSuccess: ({ data }) => {
      // console.log("useGetCalculationReport: ")
      // console.log({ data })

      const csvContent = `data:text/csv;charset=utf-8,${data}`
      var encodedUri = encodeURI(csvContent);

      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${name}-${endDate}.csv`);
      document.body.appendChild(link);

      link.click();
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetCalculationReportPreviewTable = (params: {
  name: string
  companyId: string;
  endDate: any;
  handleGetReportData: (data1: string[], data2: string[]) => void;
}) => {

  const { name, companyId, endDate, handleGetReportData } = params;
  const alertBox = useAlertBox();
  const path = `/report/${name}/company/${companyId}/financialYear/${endDate}`

  return useQuery({
    queryKey: 'calculation-report-preview',
    enabled: false,
    queryFn: () => service.get(path),
    onSuccess: ({ data }) => {
      // console.log("useGetCalculationReport: ")
      // console.log({ data })

      const dataArray = data?.split('\n')?.map(line => line.split(','));

      let modifiedArray = dataArray?.slice(1); 

      // first param include first array as tbl column
      // second param include 2nd arr or more as tbl body data

      // removes the last array if content is empty inside the last array in second param
      const lastArrayIndex = modifiedArray?.length - 1;

      if (modifiedArray?.length > 0) {
        // Exclude the first object if the last array is not empty
        if(modifiedArray[lastArrayIndex][0] === "") {
          modifiedArray = modifiedArray?.slice(0, -1);
        }
      }
      
      handleGetReportData(dataArray[0], modifiedArray)
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useUpdateReport = () => {
  const alertBox = useAlertBox();
  const queryClient = useQueryClient();

  const fetcher = (payload: {
    name: string,
    calculations: string[]
  }) => service.post(`/report`, payload)

  return useMutation(fetcher, {
    onSuccess: () => {
      queryClient.invalidateQueries("report-list")
    },
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}

export const useGetReportList = () => {
  const alertBox = useAlertBox();

  return useQuery({
    queryKey: "report-list",
    queryFn: () => service.get('/report'),
    onError: (error: any) => {
      alertBox.showError(error?.data?.message)
    }
  })
}