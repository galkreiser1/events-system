export const LOCAL_SERVER_URL = "http://localhost:3000";

/* AUTH/USERS */

export const LOGIN_PATH = "/api/login";
export const LOGOUT_PATH = "/api/logout";
export const SIGNUP_PATH = "/api/signup";
export const USERNAME_PATH = "/api/username";
export const USERS_SERVER_URL = "https://events-system-users.onrender.com";

/* EVENTS */
export const GET_ALL_EVENTS_PATH = "/api/event";
export const GET_EVENT_PATH = "/api/event/:id";
export const CREATE_EVENT_PATH = "/api/event";
export const UPDATE_EVENT_DATE_PATH = "/api/event/:id/date";
export const UPDATE_EVENT_TICKET_PATH = "/api/event/:id/ticket";

/* ORDERS */
export const CREATE_ORDER_PATH = "/api/order";
export const GET_USER_ORDERS_PATH = "/api/order/:userId";
export const GET_USERS_BY_EVENT_PATH = "/api/order/users/:eventId";
