
import React from "react";

ASDas

import { Container, Col, Row, Card, CardBody, Button } from "react-bootstrap";
import { products } from "../product_data";
import CartItems from "./CartItems";
import { useDispatch } from "react-redux";
import { setCartItems } from "../redux/features/addTocartSlice";

const ProductCard = () => {
  const dispatch = useDispatch();
  console.log(products, "10");
  return (
    <>
      {products?.map((cat, index) => (
        <>
          <h6 className="mb-0 mt-1 text-uppercase" style={{    fontSize: "14px"
}}>{cat.categroyName}</h6>
          <Row>
            {cat?.productData.map((item, index) => {
              const addItem = {
                categroyId: cat?.categroyId,
                categroyName: cat?.categroyName,
                productId: item?.productId,
                productName: item?.productName,
                price: item?.price,
              };

              return (
                <Col sm={3} lg={3} className="py-1 item-card">
                  {/* <Card>
                    <CardBody
                      style={{ padding: "10px" }}
                      className="card-body-hover"
                    >  */}
                  <button
                    key={index}
                    onClick={() => dispatch(setCartItems(addItem))}
                    className="card-style btn btn-light  w-100 text-start py-2"  style={{  border: "1px solid #13131329"}}                
                  >
                    <div className="card-style">
                      <h5 className="text-capitalize">
                        {item.productName}
                      </h5>
                      <font class="mb-0" size="2">Code: {item.productCode} | Rs. {item.price} </font> 
                    </div>
                  </button>
                  {/* </CardBody>
                  </Card> */}
                </Col>
              );
            })}
          </Row>
        </>
      ))}
    </>
  );
};

export default ProductCard;
