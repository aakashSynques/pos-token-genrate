import {
  ExclamationTriangleIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { fetch, paymodeDropdown } from "../service/utils";
import { getYear, formatDateTimePrint } from '../service/date.utils';
import { Col, Row } from "react-bootstrap";
import { FaRegMoneyBillAlt } from "react-icons/fa";


function ProductDetailModal({
  getProduct,
  productDetailOpen,
  setProductDetailOpen,
  setRefresh
}) {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => setProductDetailOpen(false);
  // const handleShow = () => setProductDetailOpen(true);
  useEffect(() => {
    setNetworkError("");
    setChangePaymentModeError("");
    setSuccessMessage("");
    setLoadingMessage("");

  }, [productDetailOpen]);

  const [changePaymode, setChangePaymentMode] = useState("");
  const [changePaymodeError, setChangePaymentModeError] = useState("");


  const printAgainInvoices = () => {
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

${getProduct?.orderData
        ?.map(
          (item) => `
    <div class="invoice-container ">
      <div class="invoice-header center" style="margin-top: 1px">
        <div style="display: flex; justify-content: space-between; font-size: 16px;">
          <div>
            <strong>Bake N Shake<strong>
          </div>
          <div>
            <strong>${getYear()}/${getProduct?.tokenNo}</strong>
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
 

               <td class="text-right" style="width:25%;">${(item.unitPrice * item.quantity)}<br><font size=1>Rs.</font></td>
            </tr>  </tbody>
        </table>
           <div class="divider"></div>
    
        <div style="display: flex; justify-content: space-between; font-size: 10px; line-height:0;">
          <p style="line-height:0; font-weight: normal;">
            
            ${formatDateTimePrint(getProduct?.orderDateTime)}
          </p>
          <p style="line-height:0; font-weight: normal;">
           
          ${getProduct?.payMode}
          </p>
        </div>
      </div>
      <div class="invoice-footer center">
           <p style="font-weight: normal; font-size: 10px; margin-bottom: 0px; line-height: 10px; margin-top: 0px">Thank You , Visit Again  - www.bakenshake.in</p>
      </div>
    </div>

    <div style="page-break-after: always;"></div>

`
        )
        .join("")}

    
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
    setProductDetailOpen(false);
  };




  // print bill 

  const printBill = () => {
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

   table{
          width: 100%;
      }table th{
          font-weight: normal;
           text-align: left;
      
           
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
   border-bottom: 1px dotted #1d11119c;
        margin-top: 5px;
      }
      
      table, tbody, td {
 
  border-collapse: collapse;
}

    </style>
  </head>
  <body> 
 
    <div class="invoice-container ">
      <div class="invoice-header center" style="margin-top: 30px; margin-bottom: 10px">
    <h4 style="line-height:0">Bake N Shake</h4>
        <div style="display: flex; justify-content: space-between; font-size: 16px;">
          <div>
            <strong>${formatDateTimePrint(getProduct?.orderDateTime)}<strong>
          </div>
          <div>
            <strong>${getYear()}/${getProduct?.tokenNo}</strong>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="invoice-body">
        <table>

 <tbody style="border-bottom: 1px dotted #1d11119c;">
    <th>Qty</th>
    <th>Description</th>
    <th class="text-right ">Rate</th>
  </tbody>

    
           ${getProduct?.orderData?.map((item) => `
            <tr>
              <td class="" style="width:20%;  font-size:15px">
           ${item.quantity}        
              </td>
              <td class="">${item.productName} </td>
              <td class="text-right ">${(item.unitPrice * item.quantity)} <br>
              </td>
            </tr>
               ` ).join("")}

                            <tr style="border-top: 1px dotted #1d11119c;">
              <td colspan="2">
               ${getProduct?.orderItem?.toLocaleString()} item(s)
              </td>
            
              <td class="text-right ">Total :  ${getProduct?.orderAmount?.toLocaleString("en-US")}
              <br>
              ${getProduct?.payMode}
              </td>
            </tr>
     
        </table>
        <div class="divider"></div>


      </div>

      <div class="invoice-footer center">
        <p style="font-weight: normal; font-size: 10px; margin-bottom: 0px; line-height: 10px; margin-top: 10px">Thank You , Visit Again - www.bakenshake.in</p>
      </div>
    </div>

 
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
    setProductDetailOpen(false);
  };






  const handlePayModeChange = (e) => {
    const selectedValue = e.target.value;
    setChangePaymentMode(selectedValue);
    setChangePaymentModeError("");
  };

  const changePaymodeHandler = async () => {
    setLoading(true);
    setNetworkError("");
    if (!window.confirm("Are you sure you want to Change Pay Mode?")) {
      // setNetworkError("choose coorect!");
      setLoading(false);
      return false;

    }
    if (!changePaymode) {
      setChangePaymentModeError("Please Select Pay Mode!");
      setLoading(false);
      return false;
    }

    try {
      const body = {
        fromDate: getProduct?.orderDateTime?.slice(0, 10),
        tokenNo: getProduct?.tokenNo,
        newPayMode: changePaymode,
      };
      const response = await fetch("/order/update_by_tokenno", "post", body);
      if (response.ok === false) {
        setLoading(false);
        setNetworkError(response.data.message);
      } else {
        setLoading(false);
        setSuccessMessage(response.data.message);
        setProductDetailOpen(false);
        // getOrderHandler();
        setRefresh(true);
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
      <Modal size="lg" show={productDetailOpen} onHide={setProductDetailOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details ({getProduct?.tokenNo})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="bg-white">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className='bg-light' style={{ textAlign: "center" }}>
                    #
                  </th>
                  <th scope="col" className='bg-light' style={{ textAlign: "left" }}>
                    Product Name
                  </th>
                  <th scope="col" className='bg-light' style={{ textAlign: "right" }}>
                    Quantity
                  </th>
                  <th scope="col" className='bg-light' style={{ textAlign: "right" }}>
                    Rate
                  </th>
                  <th scope="col" className='bg-light' style={{ textAlign: "right" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {getProduct &&
                  getProduct?.orderData?.length > 0 &&
                  getProduct?.orderData?.map((prod, indx) => {
                    return (
                      <>
                        <tr key={indx}>
                          <td style={{ textAlign: "center", width: "10%" }}>
                            {indx + 1}.
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {prod?.productName}
                          </td>
                          <td style={{ textAlign: "right", width: "10%" }}>
                            {prod?.quantity}
                          </td>
                          <td style={{ textAlign: "right", width: "10%" }}>
                            {prod?.unitPrice}
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {prod?.unitPrice * prod?.quantity}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                <tr>
                  <td scope="row" className='bg-light'></td>
                  <td className='bg-light'></td>
                  <td colSpan={1} className='bg-light text-end' >
                    <strong>
                      Qty: {getProduct?.orderItem?.toLocaleString()}
                    </strong>
                  </td>
                  <td colSpan={2} className='bg-light text-end' >
                    <strong>
                      Total: {getProduct?.orderAmount?.toLocaleString("en-US")}
                    </strong>
                  </td>
                </tr>


              </tbody>
            </table>

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

        <Modal.Footer style={{ display: "block" }} className="border-0 pt-0">
          <Row>
            <Col sm={8}>
              <div className="row">
                <div className="col-sm-3">Pay Mode :</div>
                <div className="col-sm-4">

                  <select
                    value={changePaymode}
                    // onChange={handlePayModeChange}
                    onChange={(e) => handlePayModeChange(e)}
                    className="form-control form-control py-1"
                  >
                    <option value="" disabled>
                      {getProduct?.payMode}
                    </option>
                    {paymodeDropdown?.map((pay, index) => (
                      <option key={index} value={pay.value}>
                        {pay.label}
                      </option>
                    ))}
                  </select>






                  {changePaymodeError && (
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
                        {changePaymodeError}
                      </p>
                    </div>
                  )}


                </div>


                <div className="col-sm-3">
                  <button
                    type="button"
                    className="btn btn-primary text-white bg-primary btn-sm py-1"
                    onClick={changePaymodeHandler}
                  > Update
                  </button>
                </div>
              </div>




            </Col>

            <Col sm={2} className="text-end">
              <Button className="btn btn-info w-100 text-white" onClick={() => printBill()}>Bill <FaRegMoneyBillAlt />
              </Button>
            </Col>

            <Col sm={2} className="text-end">
              <Button
                type="button"
                className="w-100"
                variant="success"
                onClick={() => printAgainInvoices()}
              >

                {" "}
                Print <PrinterIcon style={{ width: "16px", height: "16px" }} />

              </Button>
            </Col>




          </Row>


        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductDetailModal;
