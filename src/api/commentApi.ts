import { APIStatus, commentType } from "../types";
import axios from "axios";
import {
  CREATE_COMMENT_PATH,
  GET_COMMENTS_BY_EVENT_PATH,
  GET_NUM_OF_COMMENTS_BY_EVENT_PATH,
  API_GATEWAY_URL,
} from "../const";

export const commentApi = {
  createComment: async (comment: commentType): Promise<APIStatus> => {
    try {
      const res = await axios.post(
        API_GATEWAY_URL + CREATE_COMMENT_PATH,
        comment,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        return APIStatus.Success;
      } else {
        // console.log(res);
        return handleError(res.status);
      }
    } catch (e) {
      // console.log("failed to axios.post from frontend commentApi", e);
      return handleError(e);
    }
  },

  getCommentsByEvent: async (
    eventId: string,
    page: number
  ): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(
        API_GATEWAY_URL +
          GET_COMMENTS_BY_EVENT_PATH.replace(":eventId", eventId).replace(
            ":page",
            page.toString()
          ),
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },

  getNumOfCommentsByEvent: async (
    eventId: string
  ): Promise<number | APIStatus> => {
    try {
      const res = await axios.get(
        API_GATEWAY_URL +
          GET_NUM_OF_COMMENTS_BY_EVENT_PATH.replace(":eventId", eventId),
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        return res.data;
      } else {
        return -1;
      }
    } catch (e) {
      return -1;
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
