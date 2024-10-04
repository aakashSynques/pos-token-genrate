



import { useEffect, useRef, useState } from 'react';
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import emptyCart from "../assets/img/empty-cart.png";
import { getday, getYear, formatDateTimePrint } from '../service/date.utils';
import { clearCart } from '../redux/features/addTocartSlice';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';
import { fetch } from '../service/utils';
import { LiaRupeeSignSolid } from "react-icons/lia";

function PayNowModal({ payNowOpen, setPayNowOpen }) {
    const dispatch = useDispatch();
    const buttonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [networkError, setNetworkError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [payment, setPayment] = useState("Cash");
    const [paymentError, setPaymentError] = useState("");
    const handleClose = () => setPayNowOpen(false);
    const handleShow = () => setPayNowOpen(true);


    const handleCheckboxChange = (event) => {
        const selectedPay = event.target.value;
        if (selectedPay) {
            setPayment(selectedPay); // Set the selected payment method
            setPaymentError(""); // Clear any previous errors
        }
    };

    // const handleCheckboxChange = (selectedPay) => {
    //     if (selectedPay) {
    //         setPayment(selectedPay); // Set the selected payment method
    //         setPaymentError(""); // Clear any previous errors
    //     }
    // };



    const cartItem = useSelector((state) => state.addToCart.cartItems)


    const subTotal = cartItem?.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const totalqty = cartItem?.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const orderItem = cartItem?.reduce((qyt, item) => {
        return qyt + item.quantity;
    }, 0);

    useEffect(() => {
        const handleKeyPress = (e) => {
            // if (e.key === 'Enter' && buttonRef.current) {
            //     e.preventDefault(); // Prevent default action
            //     buttonRef.current.focus(); // Focus the button
            //     buttonRef.current.click(); // Trigger the button click
            // }

            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault(); // Prevent default action
                buttonRef.current.focus(); // Focus the button
                buttonRef.current.click(); // Trigger the button click
            }

        };
        // Add the event listener
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);




    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleKeyNavigation = (e) => {
        if (e.key === "ArrowRight") {
            // Move to the next radio button (from Cash to UPI)
            if (payment === "Cash") {
                handleCheckboxChange({ target: { value: "UPI" } });
            }
        } else if (e.key === "ArrowLeft") {
            // Move to the previous radio button (from UPI to Cash)
            if (payment === "UPI") {
                handleCheckboxChange({ target: { value: "Cash" } });
            }
        }
    };


    const currentDate = new Date();
    useEffect(() => {
        setSuccessMessage("");
        setLoadingMessage("");
        setNetworkError("");
    }, [cartItem]);

    const CreateOrderHandler = async () => {
        setLoading(true);
        setNetworkError("");

        if (!cartItem.length > 0) {
            setNetworkError("Please Select Product atleast one Item!");
            setLoading(false);
            return false;
        }
        if (!payment) {
            setPaymentError("Please Select Pay Mode!");
            setLoading(false);
            return false;
        }
        const currentDay = getday();
        try {
            const getNextToken = () => {
                const lastToken = localStorage.getItem("lastTokenNo");
                const nextToken = lastToken ? parseInt(lastToken) + 1 : 1; // Increment or start from 1
                localStorage.setItem("lastTokenNo", nextToken); // Store the new token number
                return nextToken;
            };
            const body = {
                tokenNo: `${currentDay}-${getNextToken()}`,
                orderAmount: subTotal,
                orderItem: orderItem,
                payMode: payment,
                orderDateTime: formatDateTime(currentDate),
                orderData: cartItem?.map((item) => ({
                    categroyId: item.categroyId,
                    categroyName: item.categroyName,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalAmount: (item.price * item.quantity),
                })),
            };
            let printDateTime = formatDateTimePrint(body?.orderDateTime)

            const response = await fetch("/order/add-order", "post", body);
            if (response.ok === false) {
                setLoading(false);
                setNetworkError(response.data.message);
            } else {
                setLoading(false);
                setSuccessMessage(response.data.message);

                const invoiceContent = `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        width: 100%;
      }

      .invoice-container {
        padding: 0 20px;
        margin: 0 auto;
    
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .invoice-header,
      .invoice-footer,
      .invoice-body {
        width: 100%;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0px;
      }

      table th,
      table td {
        padding: 5px;
      }

      .text-right {
        text-align: right;
      }

      .text-left {
        text-align: left;
      }

      .center {
        text-align: center;
      }

      .btn-print {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        margin-top: 20px;
      }

      .divider {
        border: none;
        border-style: dotted;
  border-width: 0.5px;
  border-color: #1d11119c; /* red */
  margin-top: 5px;
      }
    </style>
  </head>
  <body>

${cartItem.map((item) => `
    <div class="invoice-container ">
      <div class="invoice-header center" style="margin-top: 2px">
        <div style="display: flex; justify-content: space-between; font-size: 16px;">
          <div>
            <strong>Bake N Shake<strong>
          </div>
          <div>
            <strong>${getYear()}/${body.tokenNo}</strong>
          </div>
        </div>
      </div>

      <div class="divider"></div>
      <div class="invoice-body">
        <table>   
          <tbody>  <tr>
              <td class="text-center" style="width:20%; text-align:center; font-size:15px"><b>${item.quantity}</b><br><font size=1>Pc</font></td>
              <td class="text-left">${item.productName}  
               </td>
              <td class="text-right" style="width:25%;">${(item.price * item.quantity)}<br><font size=1>Rs.</font></td>
            </tr>  </tbody>
        </table>
           <div class="divider"></div>
    
        <div style="display: flex; justify-content: space-between; font-size: 10px; line-height:0;">
          <p style="line-height:0; font-weight: normal;">
            ${printDateTime}
          </p>
          <p style="line-height:0; font-weight: normal;">
    
          ${body.payMode}
          </p>
        </div>
      </div>
      <div class="invoice-footer center">
           <p style="font-weight: normal; font-size: 10px; margin-bottom: 0px; line-height: 10px; margin-top: 0px">Thank You , Visit Again  - www.bakenshake.in</p>
      </div>
    </div>

    <div style="page-break-after: always;"></div>

` ).join("")}

    
  </body>
</html> `;

                // Create iframe and inject the content
                const iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(invoiceContent);
                iframe.contentWindow.document.close();

                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                iframe.remove();

                dispatch(clearCart());
                setPayNowOpen(false);
                setPaymentError("");
                setPayment("Cash");

            }
        } catch (err) {
         
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setNetworkError(err.response.data.message);
            } else {
                setNetworkError("Something Went Wrong. Please Try Again Later.");
            }
        }
    };





    return (
        <>


            <Modal show={payNowOpen} onHide={setPayNowOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Order</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="">
                    <div className="cart-scroll1">
                        {cartItem && cartItem?.length > 0 ? (<table className="table">
                            <tbody>
                                {cartItem?.map((cart, index) => (
                                    <tr key={cart.productId}>
                                        <td className='text-center' style={{ width: "10%" }}>
                                            <h4 className="text-capitalize  mb-0"> {cart.quantity}</h4>
                                        </td>

                                        <td>
                                            <h5 className="text-capitalize title-font mb-0">{cart.productName}</h5>
                                            <font size="1">
                                                @{cart?.price?.toFixed(2)}
                                            </font>

                                        </td>
                                        <td>
                                            <h6 className="text-end">
                                                {/* {(cart?.price * cart?.quantity)} */}
                                                {(cart?.price * cart?.quantity)?.toLocaleString()}

                                            </h6>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>) : (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "60px",
                                // Full height of the viewport, adjust as needed
                            }}>
                                <img src={emptyCart && emptyCart} alt="empty_cart" style={{ width: "350px" }} />
                            </div>

                        )}

                    </div>

                    {/* <h6>10</h6> */}

                    <div >

                        <Row>
                            <Col md={6}>

                            </Col>

                        </Row>
                        {paymentError && (
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
                                    {paymentError}
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

                </div>
                </Modal.Body>
                <Modal.Footer style={{ display: "block" }} className='pt-0'>
                    <div>
                        <div className="checkbox-group text-end px-4 mb-3">
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="Cash"
                                        name="payment"
                                        checked={payment === "Cash"}
                                        onChange={handleCheckboxChange}
                                        autoFocus // Focus on Cash by default
                                        style={{ width: "20px", height: "16px" }}
                                        onKeyDown={(e) => handleKeyNavigation(e)} // Handle key navigation
                                    />
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            paddingLeft: "8px",
                                            marginRight: "30px",
                                        }}
                                    >
                                        Cash
                                    </span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="UPI"
                                        name="payment"
                                        checked={payment === "UPI"}
                                        onChange={handleCheckboxChange}
                                        style={{ width: "20px", height: "16px" }}
                                        onKeyDown={(e) => handleKeyNavigation(e)} // Handle key navigation
                                    />
                                    <span style={{ fontSize: "15px", paddingLeft: "8px" }}>UPI</span>
                                </label>
                            </div>

                            {paymentError && (
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
                                        {paymentError}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>




                    <Row>
                        <Col md={2}>
                            <p>Items :<br /> <b>{totalqty}</b> Pc</p>
                        </Col>

                        <Col md={5} className='text-center'>
                            <h1 className="text-success mb-0" style={{ lineHeight: "34px" }}>
                                <LiaRupeeSignSolid />
                                {subTotal?.toLocaleString()}
                            </h1>
                            <font size="1" className="mb-1 pt-0">Payable Amount</font>
                        </Col>
                        <Col md={5} className='text-end'>


                            <Button className='w-100 py-3' ref={buttonRef} variant="success" onClick={CreateOrderHandler}>
                                Order Now <font size='1'>(Shift + Enter)</font>
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PayNowModal;