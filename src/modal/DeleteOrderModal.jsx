import { PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";
import { fetch } from '../service/utils';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';


function DeleteOrderModal({ getOrderHandler, orderDeleteOpen, setOrderDeleteOpen }) {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [networkError, setNetworkError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [enterPassword, setEnterPassword] = useState("");
    const [enterPasswordError, setEnterPasswordError] = useState("");



    const handleClose = () => setOrderDeleteOpen(false);
    const handlePasswordChange = (e) => {

        setEnterPassword(e.target.value)
        setEnterPasswordError("")

    }
    // const handleShow = () => setOrderDeleteOpen(true);
    useEffect(() => {
        setEnterPasswordError("")
        setNetworkError("")
        setEnterPassword("")
        setSuccessMessage("")
    }, [orderDeleteOpen]);

    const OrderDeleteHandler = async () => {
        setLoading(true);
        setNetworkError("");
        if (!window.confirm("Are you sure you want to delete this order Data")) {
            // setNetworkError("choose coorect!");
            setLoading(false);
            return false;

        }
        if (!enterPassword) {
            setEnterPasswordError("Please Select Date!");
            setLoading(false);
            return false;
        }

        try {
            const body = { password: enterPassword };
            const response = await fetch("/order/delete_orders", "post", body);
            if (response.ok === false) {
                setLoading(false);
                setNetworkError(response.data.message);
            } else {
                setLoading(false);
                setSuccessMessage(response.data.message);
                getOrderHandler();
                setOrderDeleteOpen(false)
                localStorage.removeItem("lastTokenNo");
            }
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setNetworkError(err.response.data.message);
            } else {
                setNetworkError("Something Went Wrong. Please Try Again Later 121SS.");
            }
        }
    };


    return (
        <>


            <Modal size='sm' show={orderDeleteOpen} onHide={setOrderDeleteOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Flush Data </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container-fluid bg-white'>
                        <div className='row'>
                            <Row>

                                <Col sm={12}>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter Secret Password"
                                        value={enterPassword}
                                        onChange={(e) => handlePasswordChange(e)} // Properly pass the event object
                                    />

                                </Col>
                            </Row>

                        </div>
                        {enterPasswordError && (
                            <div style={{ display: "flex", marginLeft: "0.5px" }}>
                                <ExclamationTriangleIcon
                                    style={{
                                        height: "16px",
                                        width: "16px",
                                        marginTop: "3px",
                                        marginRight: "2px",
                                        marginLeft: "0.5px",
                                        color: "red",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        marginTop: "3.5px",
                                    }}
                                >
                                    {enterPasswordError}
                                </p>
                            </div>
                        )}
                        <div className="text-center">
                            {loading && (
                                <strong
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        marginTop: "3.5px",
                                    }}
                                >
                                    {loadingMessage}
                                </strong>
                            )}
                            {networkError && (
                                <strong
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        marginTop: "3.5px",
                                    }}
                                >
                                    {networkError}
                                </strong>
                            )}
                            {successMessage && (
                                <strong
                                    style={{
                                        color: "green",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        marginTop: "3.5px",
                                    }}
                                >
                                    {successMessage}
                                </strong>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button> */}
                    <Button
                        type="button"
                        variant="danger" onClick={OrderDeleteHandler}>

                        <strong> Delete <TrashIcon style={{ width: "16px", height: "16px" }} /></strong>
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default DeleteOrderModal;