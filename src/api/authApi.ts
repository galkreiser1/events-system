import { APIStatus } from "../types";
import {
  SERVERURL,
  LOGIN_PATH,
  LOGOUT_PATH,
  SIGNUP_PATH,
  USERNAME_PATH,
} from "../const";

interface Credentials {
  username: string;
  password: string;
}

export const AuthApi = {
  login: async ({ username, password }: Credentials): Promise<APIStatus> => {
    try {
      const response = await fetch(SERVERURL + LOGIN_PATH, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        return APIStatus.Success;
      } else {
        return handleError(response.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },

  signUp: async ({ username, password }: Credentials): Promise<APIStatus> => {
    try {
      const response = await fetch(SERVERURL + SIGNUP_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        return APIStatus.Success;
      } else {
        const errorMessage = await response.text();
        if (
          response.status === 400 &&
          errorMessage === "Username already exists"
        ) {
          return APIStatus.AlreadyExists;
        }
        return handleError(response.status);
      }
    } catch (e) {
      return handleError(e);
    }
  },

  logout: async (): Promise<APIStatus> => {
    try {
      const response = await fetch(SERVERURL + LOGOUT_PATH, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        return APIStatus.Success;
      }
      return handleError(response.status);
    } catch (e) {
      return handleError(e);
    }
  },
  getUserName: async (): Promise<string | APIStatus> => {
    try {
      const response = await fetch(SERVERURL + USERNAME_PATH, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        return data.username;
      }
      return handleError(response.status);
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
