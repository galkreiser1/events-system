// @ts-ignore

import React, { useState } from "react";
import { ScrollArea, Title, Button, Text, NumberInput } from "@mantine/core";
import classes from "./Tickets.module.css";
import { useNavigation } from "../../App";
import { ticketsDataType } from "../../types";

export function Tickets({ ticketsData }: { ticketsData: any }) {
  const navigator = useNavigation();
  // const ticketsData = [
  //   { type: "Regular", price: 20, quantity: 100 },
  //   { type: "VIP", price: 50, quantity: 50 },
  //   { type: "Gold", price: 100, quantity: 20 },
  //   //{ type: "Platinum", price: 200, quantity: 10 },
  // ];

  const [numOfTicketsArray, setNumOfTicketsArray] = useState(
    ticketsData ? ticketsData.map(() => 0) : []
  );

  const handleChangeTickets = (index: number, value: number) => {
    const newNumOfTicketsArray = [...numOfTicketsArray];
    newNumOfTicketsArray[index] = value;
    setNumOfTicketsArray(newNumOfTicketsArray);
  };

  const handleBuyNow = (index: number) => {
    const numOfTickets = numOfTicketsArray[index];
    if (numOfTickets === 0) {
      console.log("Please choose amount of tickets");
      return;
    }
    if (numOfTickets > ticketsData[index]?.quantity) {
      console.log("Not enough tickets available");
      return;
    }
    console.log(
      `Buying ${numOfTickets} tickets for ${ticketsData[index]?.type}`
    );
    navigator?.navigateTo("checkout");
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
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
}
