// @ts-ignore
import react from "react";
import { Title, Text } from "@mantine/core";
import classes from "./EventPage.module.css";
import { Tickets } from "./tickets/Tickets";
import { Comment } from "./comments/Comment";

export function EventPage() {
  const eventData = {
    title: "Maccabi Haifa match",
    location: "Sami Ofer",
    description:
      "Maccabi Haifa match against Real Madrid in the UEFA champions league semi-final, Maccabi Haifa match against Real Madrid in the UEFA champions league semi-final.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    type: "Sport Event",
    date: "2024-03-21",
    start_time: "20:30",
    end_time: "23:00",
    availableTickets: 100,
    priceStarts: 20,
  };

  // TODO: add comment button

  return (
    <div className={classes.page_container}>
      <div className={classes.top_wrapper}>
        <div className={classes.event_row}>
          <div className={classes.event_details}>
            <Title ta={"center"} className={classes.title}>
              {eventData.title}
            </Title>
            <Text ta="center" c="dimmed">
              {eventData.type}
            </Text>

            <Text size={"lg"} ta={"center"} mt={"xl"} mb={"lg"} fw={"470"}>
              {eventData.description}
            </Text>
            <div className={classes.details_tickets_wrapper}>
              <div className={classes.details_card}>
                <Title className={classes.sub_title}>Event Details:</Title>
                <Text> Location: {eventData.location}</Text>
                <Text>
                  Time: {eventData.start_time} - {eventData.end_time}
                </Text>
                <Text>Date: {eventData.date}</Text>
              </div>
              <div className={classes.details_card}>
                <Title className={classes.sub_title}>Tickets:</Title>
                <Text> Start From: {eventData.priceStarts}$</Text>
                <Text>Available Tickets:</Text>
                <Text>{eventData.availableTickets}</Text>
              </div>
            </div>
          </div>
          <img
            src={eventData.image}
            style={{ width: "50%", borderRadius: "5%" }}
          />
        </div>
      </div>
      <Tickets />

      <Comment eventData={eventData} />
    </div>
  );
}
