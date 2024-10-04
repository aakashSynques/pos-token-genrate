import React, { useEffect, useMemo, useState } from 'react';
import { fetch } from '../../service/utils';
import ProductDetailModal from '../../modal/ProductDetailModal';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';
import { PropagateLoader } from "react-spinners";
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as XLSX from 'xlsx';
import DeleteOrderModal from '../../modal/DeleteOrderModal';

function OrderReports(props) {
    const [key, setKey] = useState('Bill');
    const [productDetailOpen, setProductDetailOpen] = useState(false);
    const [orderDeleteOpen, setOrderDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [networkError, setNetworkError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [getOrderReport, setGetOrderReport] = useState([]);
    const [getProduct, setGetProduct] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [dateError, setDateError] = useState('');

    const [toDate, setToDate] = useState('');
    const [toError, setToError] = useState('');

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh === true) {
            window.location.reload();
        }
    }, [refresh]);
    const getReportsByCash = getOrderReport?.filter((csh) => csh.payMode === "Cash");


    console.log('getOrderReport', getOrderReport)


    const numberOfItemsByCash = getReportsByCash && getReportsByCash?.length > 0
        ? getReportsByCash?.reduce((total, item) => total + (parseInt(item.orderItem) || 0), 0)
        : 0;


    const getTotalCash = getReportsByCash && getReportsByCash?.length > 0
        ? getReportsByCash?.reduce((total, item) => total + (parseInt(item.orderAmount) || 0), 0)
        : 0;





    const getReportsByUpi = getOrderReport?.filter((csh) => csh.payMode === "UPI");


    const numberOfItemsByUPI = getReportsByUpi && getReportsByUpi?.length > 0
        ? getReportsByUpi?.reduce((total, item) => total + (parseInt(item.orderItem) || 0), 0)
        : 0;


    const getTotalUPI = getReportsByUpi && getReportsByUpi?.length > 0
        ? getReportsByUpi?.reduce((total, item) => total + (parseInt(item.orderAmount) || 0), 0)
        : 0;



    // Set the default date to today's date in 'YYYY-MM-DD' format
    // useEffect(() => {
    //     const today = new Date();
    //     const formattedDate = today.toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
    //     setFromDate(formattedDate);
    //     setToDate(formattedDate);

    // }, []);
    useEffect(() => {
        const today = new Date();

        const formatDateTime = (date, setMidnight = false) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // Add leading 0 if needed
            const dd = String(date.getDate()).padStart(2, '0'); // Add leading 0 if needed

            const hh = setMidnight ? '00' : String(date.getHours()).padStart(2, '0'); // Default is current hours
            const min = setMidnight ? '00' : String(date.getMinutes()).padStart(2, '0'); // Default is current minutes

            return `${yyyy}-${mm}-${dd} ${hh}:${min}`; // Returns format 'YYYY-MM-DD HH:mm'
        };

        const formattedFromDate = formatDateTime(today, true);

        const nextDay = new Date(today);
        nextDay.setDate(today.getDate()); // Move to the next day
        nextDay.setHours(23, 59); // Set the time to 23:59 (11:59 PM)
        const formattedToDate = formatDateTime(nextDay);

        setFromDate(formattedFromDate);
        setToDate(formattedToDate);
    }, []);


    const subTotal = getOrderReport && getOrderReport?.length > 0
        ? getOrderReport.reduce((total, item) => total + (parseInt(item.orderAmount) || 0), 0)
        : 0;

    const numberOfItems = getOrderReport && getOrderReport?.length > 0
        ? getOrderReport.reduce((total, item) => total + (parseInt(item.orderItem) || 0), 0)
        : 0;
    // setTimeout(() => {
    //     getOrderHandler()
    // }, 1000);

    const getOrderHandler = async () => {
        setLoading(true);
        setNetworkError("");

        if (!fromDate) {
            setDateError("Please Select Date!");
            setLoading(false);
            return false;
        }
        if (!toDate) {
            setDateError("Please Select Date!");
            setLoading(false);
            return false;
        }


        try {
            const body = { fromDate, toDate };
            const response = await fetch("/order/get_order_by_date", "post", body);
            if (response.ok === false) {
                setLoading(false);
                setNetworkError(response.data.message);
            } else {
                setLoading(false);
                setSuccessMessage(response.data.message);
                setGetOrderReport(response.data.data);
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

    useEffect(() => {
        if (fromDate && toDate) {
            setDateError("");
            setToError("");
            getOrderHandler();

        }

    }, [fromDate, toDate]);


    const exportToExcelBillSummery = () => {
        const worksheet = XLSX.utils.json_to_sheet(getOrderReport); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the worksheet to the workbook

        // Create and download Excel file
        XLSX.writeFile(workbook, "Bill_Order_Report.xlsx");
    };


    const exportToExcelCashSummery = () => {
        const worksheet = XLSX.utils.json_to_sheet(getReportsByCash); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the worksheet to the workbook

        // Create and download Excel file
        XLSX.writeFile(workbook, "Cash_Order_Report.xlsx");
    };


    const exportToExcelUPISummery = () => {
        const worksheet = XLSX.utils.json_to_sheet(getReportsByUpi); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the worksheet to the workbook

        // Create and download Excel file
        XLSX.writeFile(workbook, "UPI_Order_Report.xlsx");
    };




    // ================================================================
    const groupedData = useMemo(() => {
        const result = {};

        getOrderReport?.length > 0 && getOrderReport?.forEach(order => {
            const { payMode, orderAmount } = order;
            const amount = parseFloat(orderAmount);

            if (!result[payMode]) {
                result[payMode] = { count: 1, amount: amount };
            } else {
                result[payMode].count += 1;
                result[payMode].amount += amount;
            }
        });

        return result;
    }, [getOrderReport]);

    // Calculate the subtotal (total amount)
    const totalAmount = Object?.values(groupedData)?.reduce((sum, item) => sum + item.amount, 0);
    // ===================================================================================================================
    const groupedProduct = getOrderReport?.flatMap(order => order.orderData).reduce((acc, item) => {
        const { productId, productName, quantity, totalAmount } = item;
        if (!acc[productId]) {
            acc[productId] = { productId, productName, quantity: 0, totalAmount: 0 };
        }
        acc[productId].quantity += quantity;
        acc[productId].totalAmount += parseFloat(totalAmount);
        return acc;
    }, {});

    const groupedProductwise = Object.values(groupedProduct);


    const numberOfItemsProduct = groupedProductwise && groupedProductwise?.length > 0
        ? groupedProductwise?.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0)
        : 0;
    const exportToExcelProductSummery = () => {
        const worksheet = XLSX.utils.json_to_sheet(groupedProductwise); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the worksheet to the workbook

        // Create and download Excel file
        XLSX.writeFile(workbook, "Product_Order_Report.xlsx");
    };
    // =====================================================================================
    const groupedCategory = getOrderReport?.flatMap(order => order.orderData).reduce((acc, item) => {
        const { categroyId, categroyName, productId, productName, quantity, totalAmount } = item;

        if (!acc[categroyId]) {
            acc[categroyId] = {
                categoryId: categroyId,
                categoryName: categroyName,
                amount: 0, // Initialize total amount
                products: [],
                totalQuantity: 0 // Initialize total quantity
            };
        }

        // Add product to the category
        acc[categroyId].products.push({
            productId,
            productName,
            quantity: parseInt(quantity),
            totalAmount: parseFloat(totalAmount)
        });

        acc[categroyId].totalQuantity += parseInt(quantity) || 0;
        acc[categroyId].amount += parseFloat(totalAmount) || 0;

        return acc;
    }, {});

    // Convert the grouped object into an array
    const groupedCategorywise = Object?.values(groupedCategory);

    const numberOfItemsCategory = groupedCategorywise.map(cat => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        totalQuantity: cat.totalQuantity,
        totalAmount: cat.amount // Ensuring totalAmount is formatted to two decimal places
    }));



    const numberOfItemsCategoryQty = numberOfItemsCategory && numberOfItemsCategory?.length > 0
        ? numberOfItemsCategory?.reduce((total, item) => total + (parseInt(item.totalQuantity) || 0), 0)
        : 0;

    const exportToExcelCategorySummery = () => {
        const worksheet = XLSX.utils.json_to_sheet(numberOfItemsCategory); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the worksheet to the workbook

        // Create and download Excel file
        XLSX.writeFile(workbook, "Category_Order_Report.xlsx");
    };
    // ====================================================================================================




    const [key1, setKey1] = useState('all');


    return (
        <>

            <div className='container pt-2' >
                <div className='row'>
                    <Col sm={4}></Col>
                    <Col sm={3}>
                        <input
                            type="datetime-local"

                            className='form-control'
                            value={fromDate}
                            onChange={(e) => {
                                if (fromDate) {
                                    setFromDate(e.target.value)
                                    setToDate("")
                                }
                            }}

                        />
                    </Col>
                    <Col sm={3}>

                        <input
                            type="datetime-local"
                            className='form-control'
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />

                    </Col>

                    <Col sm={2}>
                        <button className="btn btn-danger w-100" onClick={() => setOrderDeleteOpen(true)}>Flush</button>
                    </Col>

                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", marginLeft: "0.5px", justifyContent: "center" }}>
                    <PropagateLoader color="#36d7b7" loading={true} size={15} />
                </div>
            ) : networkError ? (
                <div  className='text-center pt-5 mt-5 text-danger'>
                    <h5>{networkError}</h5>
                </div>
            ) : (
                <>
                    <div className='container'>
                    <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mt-3"
                        >
                            <Tab eventKey="Bill" title="Bill Summary">
                                <div className='container py-1 mb-1  bg-white inner-tabs'>

                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key1}
                                        onSelect={(k) => setKey1(k)}
                                        className=""
                                    >

                                        {/* All tab */}
                                        <Tab eventKey="all" title="All">
                                            <button className="btn btn-primary btn-sm " onClick={exportToExcelBillSummery} style={{
                                                float: "right",
                                                marginTop: "-36px"
                                            }}>Export to Excel</button>

                                            <table className="table  table-hover">
                                                <thead >
                                                    <tr>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "left" }}>#</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "right" }}>Token No.</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "right" }}>Order Item</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "right" }}>Order Amount</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "center" }}>Pay Mode</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "center" }}>Order Date Time</th>
                                                        <th className='bg-light' scope="col" style={{ textAlign: "left" }}>View</th>
                                                    </tr>
                                                </thead>


                                                <tbody>
                                                    {getOrderReport && getOrderReport?.length > 0 && getOrderReport.map((ord, indx) => (
                                                        <tr key={indx}>
                                                            <td scope="row" style={{ textAlign: "left" }}>{indx + 1}.</td>
                                                            <td style={{ textAlign: "right" }}>{ord.tokenNo}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderItem)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderAmount)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.payMode}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.orderDateTime}</td>
                                                            <td>
                                                                <button onClick={() => { setProductDetailOpen(true); setGetProduct(ord) }} className='btn btn-sm btn-info ml-2 text-white'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td scope="row" className='bg-light'></td>
                                                        <td  className='bg-light'></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Qty: {numberOfItems?.toLocaleString()}</strong></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Total: {subTotal?.toLocaleString()}</strong></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {dateError && (
                                                <div style={{ display: "flex", marginLeft: "0.5px", justifyContent: "center" }}>
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
                                                        {dateError}
                                                    </p>
                                                </div>
                                            )}
                                        </Tab>

                                        {/* cash */}

                                        <Tab eventKey="cash" title="Cash">
                                            <button className="btn btn-primary btn-sm " onClick={exportToExcelCashSummery} style={{
                                                float: "right",
                                                marginTop: "-36px"
                                            }}>Export to Excel</button>


                                            <table className="table  p-3 table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "left" }}>#</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Token No.</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Order Item</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Order Amount</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "center" }}>Pay Mode</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "center" }}>Order Date Time</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "left" }}>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getOrderReport && getReportsByCash?.length > 0 && getReportsByCash.map((ord, indx) => (
                                                        <tr key={indx}>
                                                            <td scope="row" style={{ textAlign: "left" }}>{indx + 1}.</td>
                                                            <td style={{ textAlign: "right" }}>{ord.tokenNo}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderItem)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderAmount)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.payMode}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.orderDateTime}</td>
                                                            <td>
                                                                <button onClick={() => { setProductDetailOpen(true); setGetProduct(ord) }} className='btn btn-sm btn-info ml-2 text-white'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td className='bg-light' scope="row" ></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Qty: {numberOfItemsByCash?.toLocaleString()}</strong></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Total: {getTotalCash?.toLocaleString()}</strong></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {dateError && (
                                                <div style={{ display: "flex", marginLeft: "0.5px", justifyContent: "center" }}>
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
                                                        {dateError}
                                                    </p>
                                                </div>
                                            )}

                                        </Tab>


                                        <Tab eventKey="upi" title="UPI" >
                                            <button className="btn btn-primary btn-sm mb-3 " onClick={exportToExcelUPISummery} style={{
                                                float: "right",
                                                marginTop: "-36px"
                                            }}>Export to Excel </button>


                                            <table className="table  p-3 table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "left" }}>#</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Token No.</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Order Item</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Order Amount</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "center" }}>Pay Mode</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "center" }}>Order Date Time</th>
                                                        <th scope="col" className='bg-light' style={{ textAlign: "left" }}>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getOrderReport && getReportsByUpi?.length > 0 && getReportsByUpi?.map((ord, indx) => (
                                                        <tr key={indx}>
                                                            <td scope="row" style={{ textAlign: "left" }}>{indx + 1}.</td>
                                                            <td style={{ textAlign: "right" }}>{ord.tokenNo}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderItem)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "right" }}>{(ord.orderAmount)?.toLocaleString()}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.payMode}</td>
                                                            <td style={{ textAlign: "center" }}>{ord.orderDateTime}</td>
                                                            <td>
                                                                <button onClick={() => { setProductDetailOpen(true); setGetProduct(ord) }} className='btn btn-sm btn-info ml-2 text-white'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td className='bg-light' scope="row" ></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Qty: {numberOfItemsByUPI?.toLocaleString()}</strong></td>
                                                        <td className='bg-light' style={{ textAlign: "right" }}><strong>Total: {getTotalUPI?.toLocaleString()}</strong></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                        <td className='bg-light'></td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                            {dateError && (
                                                <div style={{ display: "flex", marginLeft: "0.5px", justifyContent: "center" }}>
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
                                                        {dateError}
                                                    </p>
                                                </div>
                                            )}


                                            
                                        </Tab>
                                    </Tabs>





                                    {/* <div className='row pt-3'>
                                        <Col sm={6}></Col>
                                        <Col sm={6}>
                                            <Row  >
                                                <Col sm={1}>
                                                    <button className="btn btn-primary btn-sm mb-3 ">ALL</button>
                                                </Col>
                                                <Col sm={1}>
                                                    <button className="btn btn-primary btn-sm mb-3 ">Cash</button>
                                                </Col>
                                                <Col sm={1}>
                                                    <button className="btn btn-primary btn-sm mb-3 ">UPI</button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </div> */}


                                </div>
                            </Tab>






                            <Tab eventKey="Punched" title="Bill Punched" >
                                <Row>
                                    <Col>

                                        <table className="table  table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className='bg-light'>#</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Bill Punched</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "center" }}>Pay Mode</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object?.keys(groupedData)?.map((payMode, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{index + 1}.</td>
                                                        <td style={{ textAlign: "right" }}>{(groupedData[payMode].count)?.toLocaleString()}</td>
                                                        
                                                        <td style={{ textAlign: "center" }}> {payMode}</td>
                                                        <td style={{ textAlign: "right" }}>{(groupedData[payMode].amount)?.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className='bg-light'></td>
                                                    <td className='bg-light text-end' colSpan={1}><strong>Qty:   {
                    Object.keys(groupedData)
                        .reduce((total, payMode) => total + (groupedData[payMode].count || 0), 0)?.toLocaleString()
                }</strong></td>
                                                    <td className='bg-light text-end' colSpan={3} ><strong>Total: {totalAmount?.toLocaleString()}</strong></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="Product" title="Product Summary">
                                <Row>
                                    <Col>
                                        <div className='text-end pt-2'>
                                            <button className="btn btn-primary btn-sm mb-3 " onClick={exportToExcelProductSummery}>Export to Excel </button>
                                        </div>
                                        <table className="table  table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className='bg-light'>#</th>
                                                    <th scope="col" className='bg-light'> Name</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}> Qty</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedProductwise?.map((prod, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{index + 1}.</td>
                                                        <td>{prod?.productName}</td>
                                                        <td style={{ textAlign: "right" }}>{(prod?.quantity)?.toLocaleString()}</td>
                                                        <td style={{ textAlign: "right" }}>{(prod.totalAmount)?.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className='bg-light' scope="row"></td>
                                                    <td className='bg-light'></td>
                                                    <td className='bg-light' style={{ textAlign: "right" }}><strong>Qty: {numberOfItemsProduct?.toLocaleString()}</strong></td>
                                                    <td className='bg-light' style={{ textAlign: "right" }}><strong>Total: {totalAmount?.toLocaleString()}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="Category" title="Category Summary" >
                                <Row>
                                    <Col>
                                        <div className='text-end pt-2'>
                                            <button className="btn btn-primary btn-sm mb-3 " onClick={exportToExcelCategorySummery}>Export to Excel</button>
                                        </div>
                                        <table className="table  table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className='bg-light'>#</th>
                                                    <th scope="col" className='bg-light'> Name</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}> Qty</th>
                                                    <th scope="col" className='bg-light' style={{ textAlign: "right" }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {numberOfItemsCategory?.map((cat, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{index + 1}.</td>
                                                        <td>{cat.categoryName}</td>
                                                        <td style={{ textAlign: "right" }}>{(cat?.totalQuantity)?.toLocaleString()}</td>
                                                        <td style={{ textAlign: "right" }}>{(cat.totalAmount)?.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                                <tr className='bg-light'>
                                                    <td className='bg-light' scope="row"></td>
                                                    <td className='bg-light'></td>
                                                    <td className='bg-light' style={{ textAlign: "right" }}>Qty: <strong>{numberOfItemsCategoryQty?.toLocaleString()}</strong></td>
                                                    <td className='bg-light' style={{ textAlign: "right" }}>Total: <strong>{totalAmount?.toLocaleString()}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Tab>

                        </Tabs>
                    </div>

                </>
            )}

            <ProductDetailModal
                getProduct={getProduct}
                productDetailOpen={productDetailOpen}
                setProductDetailOpen={setProductDetailOpen}
                getOrderHandler={getOrderHandler}
                setRefresh={setRefresh}

            />

            <DeleteOrderModal
                orderDeleteOpen={orderDeleteOpen}
                setOrderDeleteOpen={setOrderDeleteOpen}
                getOrderHandler={getOrderHandler}
            />
        </>
    );
}

export default OrderReports;
