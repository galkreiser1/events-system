export const LOCAL_SERVER_URL = "http://localhost:3000";
export const IS_LOCAL = false;

/* AUTH/USERS */

export const LOGIN_PATH = "/api/login";
export const LOGOUT_PATH = "/api/logout";
export const SIGNUP_PATH = "/api/signup";
export const USERNAME_PATH = "/api/username";
export const USERS_SERVER_URL = "https://events-system-users.onrender.com";

/* EVENTS */
export const EVENTS_SERVER_URL = "https://events-system-event.onrender.com";
export const GET_ALL_EVENTS_PATH = "/api/event";
export const GET_EVENT_PATH = "/api/event/:id";
export const CREATE_EVENT_PATH = "/api/event";
export const UPDATE_EVENT_DATE_PATH = "/api/event/:id/date";
export const UPDATE_EVENT_TICKET_PATH = "/api/event/:id/ticket";

/* ORDERS */
export const ORDERS_SERVER_URL = "https://events-system-order.onrender.com";
export const CREATE_ORDER_PATH = "/api/order";
export const GET_USER_ORDERS_PATH = "/api/order/:userId";
export const GET_USERS_BY_EVENT_PATH = "/api/order/users/:eventId";

/* COMMENTS */

export const COMMENTS_SERVER_URL =
  "https://events-system-comments.onrender.com/";
export const CREATE_COMMENT_PATH = "/api/comment";
export const GET_COMMENTS_BY_EVENT_PATH = "/api/comment/:eventId/:page";
export const GET_NUM_OF_COMMENTS_BY_EVENT_PATH = "/api/comment/:eventId/num";
