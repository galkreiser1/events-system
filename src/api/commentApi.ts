import { APIStatus } from "../types";
import axios from "axios";
import {
  CREATE_COMMENT_PATH,
  GET_COMMENTS_BY_EVENT_PATH,
  GET_NUM_OF_COMMENTS_BY_EVENT_PATH,
  COMMENTS_SERVER_URL,
} from "../const";

// TODO: errors
export const commentApi = {
  createComment: async (comment: any): Promise<APIStatus> => {
    try {
      const res = await axios.post(
        COMMENTS_SERVER_URL + CREATE_COMMENT_PATH,
        comment
      );

      if (res.status === 201) {
        return APIStatus.Success;
      } else {
        return handleError(res.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },

  getCommentsByEvent: async (
    eventId: string,
    page: number
  ): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(
        `${COMMENTS_SERVER_URL}${GET_COMMENTS_BY_EVENT_PATH.replace(
          ":eventId",
          eventId
        ).replace(":page", page.toString())}`
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
        `${COMMENTS_SERVER_URL}${GET_NUM_OF_COMMENTS_BY_EVENT_PATH.replace(
          ":eventId",
          eventId
        )}`
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
