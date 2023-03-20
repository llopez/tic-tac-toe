import { E_Transaction_Action } from "@/types"
import { useContext } from "react"
import { Modal, Spinner } from "react-bootstrap"
import { useWaitForTransaction } from "wagmi"
import { Context } from "./StateProvider"

const Transaction = () => {
  const [{ transaction }] = useContext(Context)

  const { isLoading } = useWaitForTransaction({ hash: transaction?.hash })

  return <Modal
    show={isLoading}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header>
      <Modal.Title>{transaction && E_Transaction_Action[transaction.action]}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" />
      <div className="p-2">Transaction <strong>{transaction?.hash}</strong> in progress</div>
    </Modal.Body>
  </Modal>
}

export default Transaction