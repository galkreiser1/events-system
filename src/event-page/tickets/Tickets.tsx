// @ts-ignore

import React, { useState } from "react";
import { ScrollArea, Title, Button, Text, NumberInput } from "@mantine/core";
import classes from "./Tickets.module.css";
import { useNavigation } from "../../App";

export function Tickets() {
  const navigator = useNavigation();
  const TicketsData = [
    { type: "Regular", price: 20, available: 100 },
    { type: "VIP", price: 50, available: 50 },
    { type: "Gold", price: 100, available: 20 },
    //{ type: "Platinum", price: 200, available: 10 },
  ];

  const [numOfTicketsArray, setNumOfTicketsArray] = useState(
    TicketsData.map(() => 0)
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
    if (numOfTickets > TicketsData[index].available) {
      console.log("Not enough tickets available");
      return;
    }
    console.log(
      `Buying ${numOfTickets} tickets for ${TicketsData[index].type}`
    );
    navigator?.navigateTo("/checkout");
  };

  return (
    <div className={classes.tickets_wrapper}>
      <Title className={classes.buy_tickets_title}>Buy Tickets:</Title>
      <ScrollArea.Autosize maw={700}>
        <div className={classes.tickets_container}>
          {TicketsData.map((ticket, index) => (
            <div key={index} className={classes.ticket_card}>
              <Title className={classes.ticket_card_title}>{ticket.type}</Title>
              <Text> Price: {ticket.price}$</Text>
              <Text>Available: {ticket.available}</Text>
              <div className={classes.choose_tickets}>
                <NumberInput
                  value={numOfTicketsArray[index]}
                  onChange={(value) =>
                    handleChangeTickets(index, Number(value))
                  }
                  min={0}
                  max={ticket.available}
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
