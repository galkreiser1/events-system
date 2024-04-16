// @ts-ignore
import React, { useState, useContext } from "react";
import { Textarea, Button } from "@mantine/core";
import "./CommentForm.css";
import { APIStatus, commentType } from "../../../types";
import { commentFormType } from "../../../types";
import { commentApi } from "../../../api/commentApi";
import { sessionContext } from "../../../App";

// type commentFormType = {
//   setComment: (comment: string) => void;
//   comment: string;
//   close: () => void;
// };

// type commentType = {
//   event_id: number;
//   username: string;
//   comment: string;
//   date: Date;
// };

// export interface commentFormType {
//   setNewComment: (comment: string) => void;
//   newComment: string;
//   close: () => void;
//   addedNewComment: boolean; // Add the missing property 'addedNewComment'
//   setAddedNewComment: (added: boolean) => void;
//   setErrorMessage: (message: string) => void;
//   setError: (error: boolean) => void;
// }

export function CommentForm({
  setNewComment,
  newComment,
  close,
  addedNewComment,
  setAddedNewComment,
  setErrorMessage,
  setError,
}: commentFormType) {
  const context = useContext(sessionContext);

  const maxCommentLength = 100;
  const displayError = newComment.length > maxCommentLength;

  const handlePostComment = async (commentText: string) => {
    if (commentText.length === 0 || displayError) return;
    const date = new Date();

    const commentData: commentType = {
      event_id: context?.eventId || "", // Provide a default value for context?.eventId
      username: context?.username ?? "Guest", // Provide a default value for context?.username
      text: commentText,
      date: date.toString(),
    };
    close();
    setNewComment("");
    const res = await commentApi.createComment(commentData);
    if (res === APIStatus.Success) {
      setAddedNewComment(!addedNewComment);
      console.log("Comment posted successfully");
    } else {
      setError(true);
      setErrorMessage("Failed to post comment, please try again");
      console.log("Failed to post comment");
    }

    console.log(commentData);
  };

  return (
    <div>
      <Textarea
        label="Add your comment to the event:"
        placeholder={`${maxCommentLength} chars max`}
        value={newComment}
        onChange={(event) => setNewComment(event.currentTarget.value)}
        size="md"
        error={displayError ? "Max comment length is 100 chars" : ""}
      />
      <div className="button-container">
        <Button
          onClick={() => handlePostComment(newComment)}
          mt={"lg"}
          color="rgb(100, 187, 221)"
          ta="center"
          w={100}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
