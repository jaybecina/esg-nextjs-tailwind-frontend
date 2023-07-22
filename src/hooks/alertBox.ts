import { useContext } from "react"
import { AlertBoxContext } from "../context/alert"

const useAlertBox = () => {
  const alertBox = useContext(AlertBoxContext);

  function showError(message: string) {
    alertBox.show({
      type: "error",
      title: "Something went wrong",
      description: message || "",
    })

    setTimeout(() => alertBox.hide(), 3000)
  }

  function show(payload: {
    type: "error" | "success" | "warning",
    title: string,
    description: string,
    duration?: number;
    callback?: () => void;
  }) {
    alertBox.show(payload)

    setTimeout(() => {
      alertBox.hide()
      if (payload.callback) {
        payload.callback()
      }
    }, payload.duration || 3000)
  }

  function hide() {
    alertBox.hide()
  }

  return {
    state: alertBox.state,
    show,
    hide,
    showError
  }
}

export {
  useAlertBox,
}