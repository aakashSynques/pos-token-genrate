
import React, { useState, useEffect, useRef } from "react";
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PayNowModal from "../modal/PayNowModal";
import { RxCross2 } from "react-icons/rx";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import emptyCart from "../assets/img/empty-cart.png";
import {
    clearCart,
    removeCartItem,
    updateQuantity,
} from "../redux/features/addTocartSlice";
function CartItems() {
    const [payNowOpen, setPayNowOpen] = useState(false);
    const [payment, setPayment] = useState("Cash");
    const [paymentError, setPaymentError] = useState("");
    const dispatch = useDispatch();

    // Focus on the input when the component is rendered (for new entry or changes)
    const cartItem = useSelector((state) => state.addToCart.cartItems);
    const subTotal = cartItem?.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    const totalqty = cartItem?.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
    const quantityRefs = useRef([]); // Array of refs for each quantity input
    const activeInputRef = useRef(null); // Track the currently active input

    const handleQuantityChange = (cart, value, index) => {
        const newQuantity = value === "" ? "" : Math.max(1, Number(value));

        dispatch(
            updateQuantity({ productId: cart.productId, quantity: newQuantity })
        );

        // After the value is updated, keep focus on the current input field
        if (quantityRefs.current[index]) {
            quantityRefs.current[index].focus();
            // quantityRefs.current[index].select();
        }
    };


    useEffect(() => {
        if (cartItem?.length > 0) {
            const lastItemIndex = cartItem?.length - 1;
            if (activeInputRef.current) {
                activeInputRef.current.focus();
                // activeInputRef.current.select(); // Select the value for easy editing
            } else {
                const lastFocusedIndex = quantityRefs.current.findIndex(
                    ref => ref === document.activeElement
                );

                if (lastFocusedIndex !== -1 && quantityRefs.current[lastFocusedIndex]) {
                    quantityRefs.current[lastFocusedIndex].focus();
                    // quantityRefs.current[lastFocusedIndex].select();
                } else if (quantityRefs.current[lastItemIndex]) {
                    quantityRefs.current[lastItemIndex].focus();
                    // quantityRefs.current[lastItemIndex].select();
                }
            }
        }
    }, [cartItem, activeInputRef, quantityRefs]);



    const handleKeyPressTab = (e, index) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default Tab behavior (optional)
            if (quantityRefs.current[index + 1]) {
                quantityRefs.current[index + 1].focus(); // Move focus to the next input field when Tab is pressed
            }
        }
    };
    useEffect(() => {
        if (activeInputRef.current) {
            activeInputRef.current.focus();
        }
    }, [cartItem]);

    const handleKeyPress = (e, index) => {
        if (e.key === "Enter") {
            // Blur the current input field
            if (quantityRefs.current[index]) {
                quantityRefs.current[index].blur();
            }

            // Check if there's a next input field in the list
            const nextIndex = index + 1;
            if (quantityRefs.current[nextIndex]) {
                // Move the focus to the next input field
                quantityRefs.current[nextIndex].focus();
                // quantityRefs.current[nextIndex].select(); // Optionally select the value for easy editing
            } else {
                // If there's no next input, focus on the search input (if applicable)
                const searchInput = document.getElementById("searchProduct");
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
    };


    useEffect(() => {
        const handleKeyDown = (event) => {

                if (event.shiftKey && event.key.toLowerCase() === 'c') {

                event.preventDefault(); // Prevent default behavior (optional)
                dispatch(clearCart());
            }
            // if (event.shiftKey && event.key === "S") {

                if (event.shiftKey && event.key.toLowerCase() === 's') {
                
                event.preventDefault(); // Prevent default behavior (optional)
                const payButton = document.getElementById("saveopen");
                if (payButton) {
                    setPayNowOpen(true)
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [cartItem, payment]);
    // ==================================================================================================================
    const handleBlur = (cart, index) => {
        const currentQuantity = quantityRefs.current[index]?.value;
        // Allow 0 as a valid quantity without resetting it to 1
        if (currentQuantity === "") {
            dispatch(updateQuantity({ productId: cart.productId, quantity: 0 }));
        }
    };



    return (
        <>
            <div className="cart-side">
                <div className="cart-scroll">
                    {cartItem && cartItem?.length > 0 ? (
                        <table className="table">
                            <tbody>
                                {cartItem?.map((cart, index) => (
                                    <tr key={cart.productId}>
                                        <td>
                                            <h5 className="text-capitalize title-font mb-0">
                                                {cart.productName}
                                            </h5>
                                            <div className="row pt-2">

                                                <Col sm={2}>
                                                    <button
                                                        className="btn text-danger text-center pt-0"
                                                        style={{ marginTop: "-9px" }}
                                                        onClick={() =>
                                                            dispatch(removeCartItem(cart.productId))
                                                        }
                                                    >
                                                        <RxCross2 />
                                                    </button>
                                                </Col>

                                                <Col sm={3} className="p-0">
                                                    <div key={cart.productId} className="cart-item">
                                                        {/* <input
                                                            key={index}
                                                            type="number"
                                                            value={cart.quantity === 0 ? "" : cart.quantity}
                                                            className="text-center form-control p-0 rounded-0"
                                                            onChange={(e) => {
                                                                const value = Math.min(Math.max(e.target.value), 100); // Limit between 1 and 100
                                                                handleQuantityChange(cart, value, index);
                                                            }}
                                                            onKeyDown={(e) => { handleKeyPressTab(e, index); handleKeyPress(e, index); }}
                                                            onBlur={() => handleBlur(cart, index)}
                                                            onFocus={(e) => e.target.select()} // Select the input when focused
                                                            ref={(el) => {
                                                                quantityRefs.current[index] = el; // Store the reference of each input field
                                                            }}
                                                            max={100}
                                                            min={1}
                                                        /> */}
                                                        <input
                                                            key={index}
                                                            type="number"
                                                            value={cart.quantity === 0 ? "" : cart.quantity} // If 0, show as empty input for easy editing
                                                            className="text-center form-control p-0 rounded-0"
                                                            onChange={(e) => {
                                                                const value = Math.min(Math.max(Number(e.target.value), 0), 100); // Allow 0 as a valid number
                                                                handleQuantityChange(cart, value, index);
                                                            }}
                                                            onKeyDown={(e) => { handleKeyPressTab(e, index); handleKeyPress(e, index); }}
                                                            onBlur={() => handleBlur(cart, index)}
                                                            onFocus={(e) => e.target.select()} // Select the input when focused
                                                            ref={(el) => {
                                                                quantityRefs.current[index] = el; // Store the reference of each input field
                                                            }}

                                                        />



                                                    </div>
                                                </Col>

                                                <Col sm={2}>
                                                    <font size="2">@{cart?.price?.toFixed(2)}</font>

                                                </Col>
                                            </div>
                                        </td>
                                        <td>
                                            <h5 className="text-end">
                                                {(cart?.price * cart?.quantity)?.toLocaleString()}

                                            </h5>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "60px",
                                // Full height of the viewport, adjust as needed
                            }}
                        >
                            <img
                                src={emptyCart && emptyCart}
                                alt="empty_cart"
                                style={{ width: "350px" }}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-light-table">
                    <Row>
                        <Col md={6}>
                            <h6 className="mb-1">Items : {totalqty}</h6>



                        </Col>
                        <Col md={6}>

                            <h1 className="text-end mb-1">  {subTotal?.toLocaleString()}</h1>

                        </Col>
                    </Row>

                    <div>

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


                    <Row className="my-1">
                        <Col sm={5} lg={5}>
                            <button
                                className="btn btn-danger text-white w-100"
                                onClick={() => dispatch(clearCart())}
                            >
                                Clear
                                <font size="2"> (Shif + C) </font>
                            </button>
                        </Col>
                        {cartItem && cartItem?.length > 0 ? (
                            <Col sm={7} lg={7}>
                                <button
                                    type="button"
                                    id="saveopen"
                                    className="btn btn-success text-white w-100"
                                    onClick={() => setPayNowOpen(true)}

                                >
                                    Pay <font size="2"> (Shif + S) </font>
                                </button>
                            </Col>
                        ) : (
                            <Col sm={7} lg={7}>
                                <button
                                    type="button"
                                    className="btn  text-white w-100"
                                    style={{ backgroundColor: "#427646" }}
                                >
                                    Pay <font size="2"> (Shif + S) </font>
                                </button>
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
            <PayNowModal payNowOpen={payNowOpen} setPayNowOpen={setPayNowOpen} />
        </>
    );
}

export default CartItems;

