export enum APIStatus {
  Success,
  BadRequest,
  Unauthorized,
  AlreadyExists,
  ServerError,
  Conflict,
  Forbidden,
}
export type commentType = {
  event_id: string;
  username: string;
  text: string;
  date: string;
};

export type commentFormType = {
  setNewComment: (comment: string) => void;
  newComment: string;
  close: () => void;
};

export type ticketsDataType = {
  type: string;
  quantity: number;
  price: number;
};

export type orderDataType = {
  event_id: string;
  event_title: string;
  ticket_type: string;
  quantity: number;
  price: number;
};

export type eventType = {
  _id: string;
  title: string;
  category: string;
  description: string;
  organizer: string;
  start_date: Date;
  end_date: Date;
  location: string;
  tickets: ticketsDataType[];
  image: string;
};

export type userSpaceOrderType = {
  checkout_date: string;
  event: eventType;
  quantity: number;
  ticket_type: string;
  _id: string;
};

export type couponType = {
  code: string;
  discount: number;
};
