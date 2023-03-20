import { Toast, ToastContainer } from "react-bootstrap"
import { Context } from "./StateProvider"
import { useContext, useEffect } from "react"
import { E_NotificationActionType } from "@/reducers/notifications"

interface NotificationProps {
  id: string
  title: string
  body: string
  onClose: (id: string) => void
}

const Notification = (props: NotificationProps) => {
  const { id, title, body, onClose } = props

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [id, onClose])

  return (
    <Toast onClose={() => { onClose(id) }}>
      <Toast.Header>
        <strong className="me-auto">{title}</strong>
        <small className="text-muted">just now</small>
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
  )
}

const Notifications = () => {
  const [{ notifications }, dispatch] = useContext(Context)

  const handleClose = (id: string) => {
    dispatch({ type: E_NotificationActionType.RemoveNotification, payload: { id } })
  }

  return (
    <ToastContainer position="bottom-end" className="p-3">
      {
        notifications.map(({ title, body, id }) => <Notification key={id} id={id} body={body} title={title} onClose={handleClose} />)
      }
    </ToastContainer>
  )
}

export default Notifications