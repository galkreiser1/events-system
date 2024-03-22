import React, { useState } from "react";
import { Textarea, Button } from "@mantine/core";
import "./CommentForm.css";

type commentFormType = {
  setComment: (comment: string) => void;
  comment: string;
  close: () => void;
};

export function CommentForm({ setComment, comment, close }: commentFormType) {
  const maxCommentLength = 100;
  const displayError = comment.length > maxCommentLength;
  return (
    <div>
      <Textarea
        label="Add your comment to the event:"
        placeholder={`${maxCommentLength} chars max`}
        value={comment}
        onChange={(event) => setComment(event.currentTarget.value)}
        size="md"
        error={displayError ? "Max comment length is 100 chars" : ""}
      />
      <div className="button-container">
        <Button
          onClick={() => {
            if (comment.length === 0 || displayError) return;
            close();
            const date = new Date();
            console.log(comment, date);
            setComment("");
          }}
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
