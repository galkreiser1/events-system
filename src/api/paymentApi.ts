import { APIStatus } from "../types";
import axios from "axios";
import {
  CREATE_COUPON_PATH,
  IS_LOCAL,
  LOCAL_SERVER_URL,
  USERS_SERVER_URL,
  BUY_PATH,
} from "../const";

import { couponType } from "../types";

const SERVER_URL = IS_LOCAL ? LOCAL_SERVER_URL : USERS_SERVER_URL;

export const PaymentApi = {
  getCoupon: async (couponCode: string): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(
        SERVER_URL + `/api/payment/coupon/${couponCode}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
    }
  },
  createCoupon: async (coupon: couponType): Promise<APIStatus> => {
    try {
      const res = await axios.post(SERVER_URL + CREATE_COUPON_PATH, coupon, {
        withCredentials: true,
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
  Buy: async (
    event: any,
    ticket_type: string,
    quantity: Number,
    payment_details: any,
    coupon_code: string | undefined = undefined
  ): Promise<APIStatus> => {
    try {
      const res = await axios.post(
        SERVER_URL + BUY_PATH,
        { event, ticket_type, quantity, payment_details, coupon_code },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        return APIStatus.Success;
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
      return APIStatus.AlreadyExists;
    case 401:
      return APIStatus.Unauthorized;
    case 403:
      return APIStatus.Forbidden;
    case 409:
      return APIStatus.Conflict;
    case 500:
      return APIStatus.ServerError;
    default:
      return APIStatus.ServerError;
  }
};
