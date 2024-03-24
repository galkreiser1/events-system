import { APIStatus } from "../types";
import axios from "axios";
import { CREATE_ORDER_PATH } from "../const";

export const OrderApi = {
  createOrder: async (order: any): Promise<APIStatus> => {
    try {
      const res = await axios.post(CREATE_ORDER_PATH, order, {
        headers: { admin: "admin" },
      });

      if (res.status === 201) {
        return APIStatus.Success;
      } else {
        return handleError(res.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },
  getUserOrders: async (userId: string): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(`/api/order/${userId}`, {
        headers: { admin: "admin" },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },
  getUsersByEvent: async (eventId: string): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(`/api/order/users/${eventId}`, {
        headers: { admin: "admin" },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },
};

const handleError = async (e: unknown): Promise<APIStatus> => {
  if (typeof e === "number") {
    return handleErrorByStatusCode(e);
  } else {
    console.error(e);
    return APIStatus.ServerError;
  }
};

const handleErrorByStatusCode = (statusCode: number): APIStatus => {
  switch (statusCode) {
    case 400:
      return APIStatus.BadRequest;
    case 401:
      return APIStatus.Unauthorized;
    case 500:
      return APIStatus.ServerError;
    default:
      return APIStatus.ServerError;
  }
};
