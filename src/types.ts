export enum APIStatus {
  Success,
  BadRequest,
  Unauthorized,
  AlreadyExists,
  ServerError,
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
