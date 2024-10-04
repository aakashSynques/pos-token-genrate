/** @format */

import axios from "axios";

// import moment from "moment/moment";

export const api_admin_url = `http://localhost:3031/api/admin`;
// export const api_admin_url = `https://apigracesresorts.q4hosting.com/api/admin`;

export const fetch = async (
  endPoint = "",
  method = "get",
  data = null,
  headers = {}
) => {
  const instance = axios.create({
    baseURL: api_admin_url,
  });
  return await instance({
    url: endPoint,
    method,
    data,
    headers,
  });
};

export const paymodeDropdown = [
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
];
