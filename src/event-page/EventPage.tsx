// @ts-ignore
import react, { useContext, useEffect } from "react";
import { Title, Text } from "@mantine/core";
import classes from "./EventPage.module.css";
import { Tickets } from "./tickets/Tickets";
import { Comment } from "./comments/Comment";
import { sessionContext } from "../App";
import { EventApi } from "../api/eventApi";
import { Loader } from "../loader/Loader";
import { ticketsDataType } from "../types";

export function EventPage() {
  const [isLoading, setIsLoading] = react.useState<boolean>(true);
  const [eventData, setEventData] = react.useState<any>();
  const [ticketsData, setTicketsData] = react.useState<ticketsDataType[]>([]);

  const context = useContext(sessionContext);
  useEffect(() => {
    const fetchEvent = async () => {
      console.log(context);

      const eventId = context?.eventId ?? "";
      const eventData = await EventApi.getEvent(eventId);
      if (typeof eventData === "number") {
        console.log("Error Fetching Event");
      }
      setEventData(eventData);
      setTicketsData(eventData.tickets);
      setIsLoading(false);
      console.log(eventData);
    };
    fetchEvent();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (
      `${start.getHours()}:${start.getMinutes()}` +
      ` - ${end.getHours()}:${end.getMinutes()}`
    );
  };

  const { minPrice, sumTickets } = ticketsData.reduce(
    (accumulator: any, ticket: ticketsDataType) => {
      // Update minPrice if current ticket price is lower
      accumulator.minPrice = Math.min(accumulator.minPrice, ticket.price);
      // Accumulate sumTickets
      accumulator.sumTickets += ticket.quantity;
      return accumulator;
    },
    { minPrice: Infinity, sumTickets: 0 }
  );

  // const eventData = {
  //   title: "Maccabi Haifa match",
  //   location: "Sami Ofer",
  //   description:
  //     "Maccabi Haifa match against Real Madrid in the UEFA champions league semi-final, Maccabi Haifa match against Real Madrid in the UEFA champions league semi-final.",
  //   image:
  //     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  //   type: "Sport Event",
  //   date: "2024-03-21",
  //   start_time: "20:30",
  //   end_time: "23:00",
  //   availableTickets: 100,
  //   priceStarts: 20,
  // };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className={classes.page_container}>
        <div className={classes.top_wrapper}>
          <div className={classes.event_row}>
            <div className={classes.event_details}>
              <Title ta={"center"} className={classes.title}>
                {eventData?.title}
              </Title>
              <Text ta="center" c="dimmed">
                {eventData?.category}
              </Text>

              <Text size={"lg"} ta={"center"} mt={"xl"} mb={"lg"} fw={"470"}>
                {eventData?.description}
              </Text>
              <div className={classes.details_tickets_wrapper}>
                <div className={classes.details_card}>
                  <Title className={classes.sub_title}>Event Details:</Title>
                  <Text>{eventData?.location}</Text>
                  <Text>
                    {formatTime(eventData?.start_date, eventData?.end_date)}
                  </Text>

                  <Text>{formatDate(eventData?.start_date)}</Text>
                </div>
                <div className={classes.details_card}>
                  <Title className={classes.sub_title}>Tickets:</Title>
                  <Text> Start From: {minPrice}$</Text>
                  <Text>Available Tickets:</Text>
                  <Text>{sumTickets}</Text>
                </div>
              </div>
            </div>
            <img
              src={eventData?.image}
              style={{ width: "50%", borderRadius: "5%" }}
            />
          </div>
        </div>
        <Tickets ticketsData={ticketsData} />

        <Comment eventData={eventData} />
      </div>
    );
  }
}
