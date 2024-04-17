// @ts-ignore
import react, { useContext, useEffect, useState } from "react";
import { Title, Text, Button, Notification, rem } from "@mantine/core";
import classes from "./EventPage.module.css";
import { Tickets } from "./tickets/Tickets";
import { Comment } from "./comments/Comment";
import { sessionContext } from "../App";
import { EventApi } from "../api/eventApi";
import { Loader } from "../loader/Loader";
import { ticketsDataType } from "../types";
import { DateTimePicker } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";

export function EventPage() {
  const [isLoading, setIsLoading] = react.useState<boolean>(true);
  const [eventData, setEventData] = react.useState<any>();
  const [ticketsData, setTicketsData] = react.useState<ticketsDataType[]>([]);
  const [isEditing, setIsEditing] = react.useState<boolean>(false);
  const [newStartDate, setNewStartDate] = useState<Date>();
  const [newEndDate, setNewEndDate] = useState<Date>();
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);
  const [updatePage, setUpdatePage] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const context = useContext(sessionContext);
  useEffect(() => {
    const fetchEvent = async () => {
      // console.log(context);

      const eventId = context?.eventId ?? "";
      const eventData = await EventApi.getEvent(eventId);
      if (typeof eventData === "number") {
        console.log("Error Fetching Event");
      }
      setEventData(eventData);
      setTicketsData(eventData.tickets);
      setNewStartDate(new Date(eventData.start_date));
      setNewEndDate(new Date(eventData.end_date));
      setIsLoading(false);
      // console.log(eventData);
    };
    fetchEvent();
  }, [updatePage]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear() % 100}`;
  };

  // Format HH:MM - HH:MM
  // const formatTime = (startTime: string, endTime: string) => {
  //   const start = new Date(startTime);
  //   const end = new Date(endTime);
  //   return (
  //     `${start.getHours()}:${start.getMinutes()}` +
  //     ` - ${end.getHours()}:${end.getMinutes()}`
  //   );
  // };

  const formatTime = (rawDate: Date) => {
    const date = new Date(rawDate);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const { minPrice, sumTickets } = !ticketsData
    ? { minPrice: 0, sumTickets: 0 }
    : ticketsData.reduce(
        (accumulator: any, ticket: ticketsDataType) => {
          // Update minPrice if current ticket price is lower
          accumulator.minPrice = Math.min(accumulator.minPrice, ticket.price);
          // Accumulate sumTickets
          accumulator.sumTickets += ticket.quantity;
          return accumulator;
        },
        { minPrice: Infinity, sumTickets: 0 }
      );

  // open DateTimePicker:
  // const handleEditDate = (date: Date) => {
  //   console.log("old Event:", eventData.start_date);
  //   setNewStartDate(date);
  //   console.log("Edit Event", newStartDate);
  // };

  useEffect(() => {
    if (startValue) {
      const newStartDate = startValue.toISOString();
      setNewStartDate(new Date(newStartDate));
    }
  }, [startValue]);

  useEffect(() => {
    if (endValue) {
      const newEndDate = endValue.toISOString();
      setNewEndDate(new Date(newEndDate));
    }
  }, [endValue]);

  const aproveDate = async () => {
    setIsLoading(true);
    // console.log("Approved new start date:", newStartDate);
    // console.log("Approved new end date:", newEndDate);
    if (newStartDate === undefined || newEndDate === undefined) {
      // console.log("nust choose date and time");
      setIsLoading(false);
      return;
    }
    if (newStartDate > newEndDate) {
      // console.log("Error: start date is after end date");
      setIsLoading(false);
      return;
    }
    const newDate = {
      start_date: newStartDate,
      end_date: newEndDate,
    };
    const res = await EventApi.updateEventDate(context?.eventId ?? "", newDate);
    if (typeof res === "number") {
      setError(true);
      setErrorMessage("Error Updating Event, Try Again");
      // console.log("Error Updating Event");
    }
    setIsEditing(false);
    setUpdatePage(!updatePage);
    setStartValue(null);

    setEndValue(null);
    setNewStartDate(new Date(eventData.start_date));
    setNewEndDate(new Date(eventData.end_date));
    setIsLoading(false);
  };

  // edit event on click will update using newDate

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
              {!isEditing && (
                <div className={classes.details_tickets_wrapper}>
                  <div className={classes.details_card}>
                    <Title className={classes.sub_title}>Event Details:</Title>
                    <Text>{eventData?.location}</Text>
                    <Text>
                      Starts at: {formatDate(eventData?.start_date)} ,{" "}
                      {formatTime(eventData?.start_date)}
                    </Text>
                    <Text>
                      Ends at: {formatDate(eventData?.end_date)} ,{" "}
                      {formatTime(eventData?.end_date)}
                    </Text>
                  </div>
                  <div className={classes.details_card}>
                    <Title className={classes.sub_title}>Tickets:</Title>
                    <Text> Start From: {minPrice}$</Text>
                    <Text>Available Tickets:</Text>
                    <Text>{sumTickets}</Text>
                  </div>
                </div>
              )}
              {isEditing && (
                <DateTimePicker
                  label="Start Date:"
                  dropdownType="modal"
                  minDate={
                    new Date(new Date(eventData?.start_date).getTime() + 60000) // add one minute to the start date
                  }
                  placeholder="can only be posponed to a later date"
                  value={startValue}
                  onChange={setStartValue}
                  error={
                    newStartDate &&
                    newEndDate &&
                    newStartDate > newEndDate &&
                    "Start date must be before end date"
                  }
                />
              )}
              {isEditing && (
                <DateTimePicker
                  label="End Date:"
                  dropdownType="modal"
                  minDate={
                    startValue
                      ? new Date(new Date(startValue).getTime() + 60000)
                      : new Date(
                          new Date(eventData?.start_date).getTime() + 60000
                        )
                  }
                  placeholder="can only be later than the start date"
                  value={endValue}
                  onChange={setEndValue}
                  error={
                    newStartDate &&
                    newEndDate &&
                    newStartDate > newEndDate &&
                    "Start date must be before end date"
                  }
                />
              )}
              {error && (
                <Notification
                  mt={"md"}
                  icon={xIcon}
                  color="red"
                  title={errorMessage}
                  onClick={() => {
                    setError(false);
                    setErrorMessage("");
                  }}
                ></Notification>
              )}
              <div className={classes.edit_wrapper}>
                {isEditing && (
                  <Button my="lg" onClick={aproveDate}>
                    Change Date
                  </Button>
                )}
                {(context?.permission == "A" || context?.permission == "M") &&
                  !isEditing && (
                    <Button
                      fullWidth
                      mt="lg"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit Event
                    </Button>
                  )}
              </div>
            </div>
            <img
              src={eventData?.image}
              style={{ width: "35%", borderRadius: "5%" }}
            />
          </div>
        </div>
        <Tickets
          eventData={eventData}
          setEventData={setEventData}
          setTicketsData={setTicketsData}
        />

        <Comment eventData={eventData} />
      </div>
    );
  }
}
