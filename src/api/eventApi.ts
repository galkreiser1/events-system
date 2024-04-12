import { APIStatus } from "../types";
import axios from "axios";
import {
  LOCAL_SERVER_URL,
  GET_ALL_EVENTS_PATH,
  CREATE_EVENT_PATH,
  USERS_SERVER_URL,
  IS_LOCAL,
} from "../const";

import { eventType } from "../types";

const SERVER_URL = IS_LOCAL ? LOCAL_SERVER_URL : USERS_SERVER_URL;

export const EventApi = {
  getAllEvents: async (page = 1): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(
        SERVER_URL + GET_ALL_EVENTS_PATH + `?page=${page}`,
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
  getEvent: async (eventId: string): Promise<any | APIStatus> => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/event/${eventId}`, {
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
  createEvent: async (event: eventType): Promise<APIStatus> => {
    try {
      const res = await axios.post(SERVER_URL + CREATE_EVENT_PATH, event, {
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
  updateEventDate: async (
    eventId: string,
    eventData: any
  ): Promise<any | APIStatus> => {
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/event/${eventId}/date`,
        eventData,
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
  updateEventTicket: async (
    eventId: string,
    ticketData: any
  ): Promise<any | APIStatus> => {
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/event/${eventId}/ticket`,
        ticketData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        return APIStatus.Success;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
    }
  },
  lockTicket: async (
    event_id: string,
    type: string,
    quantity: Number
  ): Promise<any | APIStatus> => {
    try {
      const lockData = { event_id, type, quantity };
      const res = await axios.post(`${SERVER_URL}/api/event/lock`, lockData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        return res.data;
      } else {
        return handleError(res.status);
      }
    } catch (e: any) {
      return handleError(e.response.status);
    }
  },
  unlockTicket: async (
    lock_id: string,
    event_id: string,
    type: string,
    quantity: Number
  ): Promise<any | APIStatus> => {
    try {
      const unlockData = { lock_id, event_id, type, quantity };
      const res = await axios.post(
        `${SERVER_URL}/api/event/unlock`,
        unlockData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
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
      return APIStatus.BadRequest;
    case 401:
      return APIStatus.Unauthorized;
    case 403:
      return APIStatus.Forbidden;
    case 500:
      return APIStatus.ServerError;
    default:
      return APIStatus.ServerError;
  }
};
