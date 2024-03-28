import { APIStatus } from "../types";
import axios from "axios";
import {
  CREATE_ORDER_PATH,
  USERS_SERVER_URL,
  LOCAL_SERVER_URL,
  IS_LOCAL,
} from "../const";

const SERVER_URL = IS_LOCAL ? LOCAL_SERVER_URL : USERS_SERVER_URL;

export const OrderApi = {
  createOrder: async (order: any): Promise<APIStatus> => {
    try {
      const res = await axios.post(SERVER_URL + CREATE_ORDER_PATH, order, {
        headers: { admin: "admin" },
      });

      if (res.status === 201) {
        return APIStatus.Success;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
    }
  },
  getUserOrders: async (): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/order`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
    }
  },
  getUsersByEvent: async (eventId: string): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/order/users/${eventId}`, {
        headers: { admin: "admin" },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
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
