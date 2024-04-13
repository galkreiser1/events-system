import React, { useContext } from "react";
import classes from "./Comment.module.css";
import {
  Title,
  Group,
  Text,
  Avatar,
  Divider,
  ScrollArea,
  Button,
  Modal,
  Notification,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { commentApi } from "../../api/commentApi";
import { Pagination } from "@mantine/core";

import { CommentForm } from "./CommentForm/CommentForm";
import { Loader } from "../../loader/Loader";
import { sessionContext } from "../../App";
import { IconX } from "@tabler/icons-react";

export function Comment({ eventData }: { eventData: any }) {
  // const isUser = context.permissions == "U" ? true : false;

  const [isLoading, setIsLoading] = React.useState(false);
  const [commentsData, setCommentsData] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [numOfComments, setNumOfComments] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [addedNewComment, setAddedNewComment] = React.useState(false);

  const context = useContext(sessionContext);
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  React.useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const comments = await commentApi.getCommentsByEvent(eventData._id, page);
      const commentsNum = await commentApi.getNumOfCommentsByEvent(
        eventData._id
      );
      if (typeof comments === "number" && context?.permission === "U") {
        setError(true);
        setErrorMessage("Failed to get comments, please try again later");
        setIsLoading(false);
        return;
      }
      if (commentsNum === -1 && context?.permission !== "U") {
        setError(true);
        setErrorMessage("Failed to get comments, please try again later");
        setIsLoading(false);
        return;
      }
      setNumOfComments(Number(commentsNum));
      const commentsPerPage = 5;
      setTotalPages(Math.ceil(numOfComments / commentsPerPage));
      setCommentsData(comments);

      setIsLoading(false);
      console.log(numOfComments);
      console.log(comments);
    };
    fetchComments();
  }, [numOfComments, page, addedNewComment]);

  // const commentsData = [

  // get comments by event:

  // const commentsData = [
  // {
  //   From: "Benny",
  //   At: "2024-03-21T2030",
  //   Content: "I'm so excited for the game!",
  // },
  // {
  //   From: "Shlomo",
  //   At: "2024-03-21T2030",
  //   Content: "I Hope MAccabi will win this game",
  // },
  // {
  //   From: "Yossi",
  //   At: "2024-03-21T2030",
  //   Content:
  //     "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
  // },
  // { From: "David", At: "2024-03-21T2030", Content: "I'm sure we will win!" },
  // ];
  const [opened, { open, close }] = useDisclosure(false);
  const [newComment, setNewComment] = React.useState("");

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear() % 100}`;
  };

  return (
    <div className={classes.comments_wrapper}>
      <Title className={classes.comments_title}>Comments:</Title>
      {error && (
        <Notification
          mb={"md"}
          icon={xIcon}
          color="red"
          title={errorMessage}
          onClick={() => {
            setError(false);
            setErrorMessage("");
          }}
        ></Notification>
      )}
      {isLoading && (
        <div className={classes.loader}>
          <Loader />
        </div>
      )}
      {!isLoading && !error && context?.permission !== "U" && (
        <div>
          <Text>Users posted {numOfComments} comments so far</Text>
        </div>
      )}
      {!isLoading &&
        !error &&
        context?.permission === "U" &&
        commentsData.length === 0 && (
          <div>
            <Text>
              No comments available yet, <br /> you can be the first :)
            </Text>
          </div>
        )}
      {!isLoading &&
        !error &&
        commentsData.length > 0 &&
        context?.permission === "U" && (
          <ScrollArea
            type="auto"
            scrollbarSize={6}
            classNames={classes}
            h={200}
          >
            {commentsData.map((comment, index) => (
              <div key={index} className={classes.comment_container}>
                <Group>
                  <Avatar color="rgb(100, 187, 221)" src={null} />
                  <div>
                    <Text fw={600} size="sm">
                      {comment.username}
                    </Text>
                    <Text fw={400} size="xs" c="dimmed">
                      {formatDate(comment.date)}
                    </Text>
                  </div>
                </Group>
                <Text fw={500} pl={54} pt="sm" size="sm">
                  {comment.text}
                </Text>
                <Divider size="xs" my="sm" />
              </div>
            ))}
          </ScrollArea>
        )}

      {!isLoading && !error && context?.permission === "U" && (
        <div>
          <Modal
            opened={opened}
            onClose={() => {
              close();
              setNewComment("");
            }}
            title={eventData.title}
            size="md"
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
          >
            <CommentForm
              setNewComment={setNewComment}
              newComment={newComment}
              close={close}
              addedNewComment={addedNewComment}
              setAddedNewComment={setAddedNewComment}
              setErrorMessage={setErrorMessage}
              setError={setError}
            />
          </Modal>
          <Pagination
            color="rgb(100, 187, 221)"
            value={page}
            onChange={setPage}
            total={totalPages}
            mt={"lg"}
          />
          <Button
            onClick={open}
            mt={"lg"}
            color="rgb(100, 187, 221)"
            ta="center"
            w={150}
          >
            Add Comment
          </Button>
        </div>
      )}
    </div>
  );
}
