import React, { useState } from "react";
import { Container, Col, Row, Card, CardBody } from "react-bootstrap";
import ProductCard from "./component/ProductCard";
import CartItems from "./component/CartItems";
import Header from "./component/Header";
import { Route, Routes } from "react-router-dom";
import OrderReports from "./component/report/OrderReports";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <section className="">
              <Container fluid>
                <Row>
                  <Col sm={6} lg={8} className="pt-2">
                    <ProductCard />
                  </Col>
                  <Col sm={6} lg={4}>
                    <CartItems />
                  </Col>
                </Row>
              </Container>
            </section>
          }
        />
        <Route path="/reports" element={<OrderReports />} />
      </Routes>
    </>
  );
};

export default App;
