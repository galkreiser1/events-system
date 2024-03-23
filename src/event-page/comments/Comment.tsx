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
import { CommentForm } from "./CommentForm/CommentForm";
export function Comment({ eventData }: { eventData: any }) {
  const commentsData = [
    {
      From: "Benny",
      At: "2024-03-21T2030",
      Content: "I'm so excited for the game!",
    },
    {
      From: "Shlomo",
      At: "2024-03-21T2030",
      Content: "I Hope MAccabi will win this game",
    },
    {
      From: "Yossi",
      At: "2024-03-21T2030",
      Content:
        "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
    },
    { From: "David", At: "2024-03-21T2030", Content: "I'm sure we will win!" },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  const [comment, setComment] = React.useState("");

  return (
    <div className={classes.comments_wrapper}>
      <Title className={classes.comments_title}>Comments:</Title>
      <ScrollArea type="auto" scrollbarSize={6} classNames={classes} h={200}>
        {commentsData.map((comment, index) => (
          <div key={index} className={classes.comment_container}>
            <Group>
              <Avatar color="rgb(100, 187, 221)" src={null} />
              <div>
                <Text fw={600} size="sm">
                  {comment.From}
                </Text>
                <Text fw={400} size="xs" c="dimmed">
                  {comment.At}
                </Text>
              </div>
            </Group>
            <Text fw={500} pl={54} pt="sm" size="sm">
              {comment.Content}
            </Text>
            <Divider size="xs" my="sm" />
          </div>
        ))}
      </ScrollArea>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setComment("");
        }}
        title={eventData.title}
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <CommentForm setComment={setComment} comment={comment} close={close} />
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
