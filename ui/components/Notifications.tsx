import { Toast, ToastContainer } from "react-bootstrap"
import { Context } from "./StateProvider"
import { useContext } from "react"
import { E_NotificationActionType } from "@/reducers/notifications"

const Notifications = () => {
  const [{ notifications }, dispatch] = useContext(Context)

  const handleClose = (id: number) => {
    dispatch({ type: E_NotificationActionType.RemoveNotification, payload: { id } })
  }

  return (
    <ToastContainer position="bottom-end" className="p-3">
      {
        notifications.map(({ title, body, id }) => <Toast key={id} onClose={() => { handleClose(id) }}>
          <Toast.Header>
            <strong className="me-auto">{title}</strong>
            <small className="text-muted">just now</small>
          </Toast.Header>
          <Toast.Body>{body}</Toast.Body>
        </Toast>)
      }
    </ToastContainer>
  )
}

export default Notifications