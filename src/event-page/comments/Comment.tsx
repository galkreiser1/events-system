import React from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { commentApi } from "../../api/commentApi";

import { CommentForm } from "./CommentForm/CommentForm";
import { Loader } from "../../loader/Loader";
export function Comment({ eventData }: { eventData: any }) {
  // const isUser = context.permissions == "U" ? true : false;

  const [isLoading, setIsLoading] = React.useState(false);
  const [commentsData, setCommentsData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const comments = await commentApi.getCommentsByEvent(eventData._id, 1);
      setCommentsData(comments);
      setIsLoading(false);
      console.log(comments);
    };
    fetchComments();
  }, []);

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

  // if (!isUser) {
  // const event_id = eventSession.event_id;

  //setIsLoading(true);
  // const numOfComments = await getNumOfCommentsByEvent(event_id);
  //setIsLoading(true);

  //   return <Text> `total comments for the event: ${numOfComments}` </Text>
  // }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear() % 100}`;
  };

  return (
    <div className={classes.comments_wrapper}>
      <Title className={classes.comments_title}>Comments:</Title>
      {isLoading ? (
        <Loader />
      ) : commentsData.length === 0 ? (
        <div>
          <Text>
            No comments available yet, <br /> you can be the first :)
          </Text>
        </div>
      ) : (
        <ScrollArea type="auto" scrollbarSize={6} classNames={classes} h={200}>
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
        />
      </Modal>

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
  );
}
