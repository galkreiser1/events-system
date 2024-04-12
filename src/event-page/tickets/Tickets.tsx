// @ts-ignore

import React, { useContext, useState } from "react";
import { ScrollArea, Title, Button, Text, NumberInput } from "@mantine/core";
import classes from "./Tickets.module.css";
import { sessionContext, useNavigation } from "../../App";
import { APIStatus, ticketsDataType } from "../../types";
import { EventApi } from "../../api/eventApi";

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
      console.log("Please choose amount of tickets");
      return;
    }

    changeLoading(index, true);
    const updatedEvent = await EventApi.getEvent(context?.eventId || "");

    // check if event dates have changed:
    if (updatedEvent?.date !== eventData.date) {
      console.log("Event dates have changed"); // TODO: add error message
      setEventData(updatedEvent);
      changeLoading(index, false);

      return;
    }
    // check if enough tickets available:
    if (updatedEvent?.tickets[index]?.quantity < numOfTickets) {
      console.log("Not enough tickets available"); // TODO: add error message
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

    if (res === APIStatus.Success) {
      console.log(
        `Buying ${numOfTickets} tickets for ${ticketsData?.[index]?.type}`
      );

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
        console.log("Not enough tickets available");
      } else {
        console.log("Error buying tickets");
      }
      setTicketsData(updatedEvent?.tickets);
      // setEventData(updatedEvent); // TODO: update event data or only tickes data?
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
    </div>
  );
}
