// @ts-ignore

import React, { useContext, useState } from "react";
import {
  ScrollArea,
  Title,
  Button,
  Text,
  NumberInput,
  Notification,
  rem,
} from "@mantine/core";
import classes from "./Tickets.module.css";
import { sessionContext, useNavigation } from "../../App";
import { APIStatus, ticketsDataType } from "../../types";
import { EventApi } from "../../api/eventApi";
import { IconX } from "@tabler/icons-react";

export function Tickets({
  eventData,
  setEventData,
}: //setTicketsData,
{
  eventData: any;
  setEventData: any;
  setTicketsData: any;
}) {
  const navigator = useNavigation();
  // const ticketsData = [
  //   { type: "Regular", price: 20, quantity: 100 },
  //   { type: "VIP", price: 50, quantity: 50 },
  //   { type: "Gold", price: 100, quantity: 20 },
  //   //{ type: "Platinum", price: 200, quantity: 10 },
  // ];

  const context = useContext(sessionContext);
  const [ticketsData, setTicketsData] = useState<ticketsDataType[] | null>(
    eventData.tickets
  );

  const [numOfTicketsArray, setNumOfTicketsArray] = useState(
    ticketsData ? ticketsData.map(() => 0) : []
  );

  const [loadingButton, setLoadingButton] = useState(
    ticketsData ? ticketsData.map(() => false) : []
  );

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const handleChangeTickets = (index: number, value: number) => {
    const newNumOfTicketsArray = [...numOfTicketsArray];
    newNumOfTicketsArray[index] = value;
    setNumOfTicketsArray(newNumOfTicketsArray);
  };

  const changeLoading = (index: number, bool: boolean) => {
    const newLoadingArray = [...loadingButton];
    newLoadingArray[index] = bool;
    setLoadingButton(newLoadingArray);
  };

  const handleBuyNow = async (index: number) => {
    const numOfTickets = numOfTicketsArray[index];
    if (numOfTickets === 0) {
      setError(true);
      setErrorMessage("Please choose more than 0 tickets");
      console.log("0 tickets selected");
      return;
    }

    changeLoading(index, true);
    const updatedEvent = await EventApi.getEvent(context?.eventId || "");
    console.log(updatedEvent);

    // check if event dates have changed:
    if (
      updatedEvent?.start_date !== eventData.start_date ||
      updatedEvent?.end_date !== eventData.end_date
    ) {
      setError(true);
      setErrorMessage(
        "Event dates have changed, click on 'Buy Now' to approve"
      );
      console.log("Event dates have changed");
      setEventData(updatedEvent);
      changeLoading(index, false);

      return;
    }
    // check if enough tickets available:
    if (updatedEvent?.tickets[index]?.quantity < numOfTickets) {
      setError(true);
      setErrorMessage(
        "Not enough tickets available, please choose less tickets"
      );
      console.log("Not enough tickets available");
      setTicketsData(updatedEvent?.tickets);
      changeLoading(index, false);
      return;
    }

    const ticketsToBuy = {
      ticket_type: ticketsData?.[index]?.type,
      quantity: numOfTickets,
    };

    const event_id = context?.eventId ? context.eventId : "";
    const type = ticketsData?.[index]?.type ? ticketsData[index].type : "";
    const res = await EventApi.lockTicket(
      event_id,
      type,
      ticketsToBuy.quantity
    );

    if (typeof res !== "number") {
      console.log(
        `Buying ${numOfTickets} tickets for ${ticketsData?.[index]?.type}`
      );

      context?.setLockId(res.lock_id);

      const orderData = {
        event_id: context?.eventId || "",
        event_title: eventData?.title || "",
        ticket_type: ticketsData?.[index]?.type || "",
        quantity: Number(numOfTickets),
        price: Number(ticketsData?.[index]?.price) || 0,
        ticket_index: index,
      };
      context?.setOrderData(orderData);
      console.log(context?.orderData);
      changeLoading(index, false);
      navigator?.navigateTo("checkout");
    } else {
      if (res === APIStatus.BadRequest) {
        setError(true);
        setErrorMessage(
          "Not enough tickets available, please choose less tickets"
        );
        console.log("Not enough tickets available");
      } else {
        setError(true);
        setErrorMessage("Error buying tickets, please try again");

        console.log("Error buying tickets");
      }
      setTicketsData(updatedEvent?.tickets);
      // setEventData(updatedEvent);
      changeLoading(index, false);
      return;
    }
  };

  return (
    <div className={classes.tickets_wrapper}>
      <Title className={classes.buy_tickets_title}>Buy Tickets:</Title>
      <ScrollArea.Autosize maw={700}>
        <div className={classes.tickets_container}>
          {ticketsData?.map((ticket: ticketsDataType, index: number) => (
            <div key={index} className={classes.ticket_card}>
              <Title className={classes.ticket_card_title}>{ticket.type}</Title>
              <Text> Price: {ticket.price}$</Text>
              <Text>Available: {ticket.quantity}</Text>
              {context?.permission === "U" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className={classes.choose_tickets}>
                    <NumberInput
                      value={numOfTicketsArray[index]}
                      onChange={(value) =>
                        handleChangeTickets(index, Number(value))
                      }
                      min={0}
                      max={ticket.quantity}
                      allowNegative={false}
                      allowDecimal={false}
                      placeholder="Amount"
                      suffix=" tickets"
                    />
                  </div>
                  <Button
                    mt={"sm"}
                    color="rgb(100, 187, 221)"
                    onClick={() => handleBuyNow(index)}
                    loading={loadingButton[index]}
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea.Autosize>
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
    </div>
  );
}
