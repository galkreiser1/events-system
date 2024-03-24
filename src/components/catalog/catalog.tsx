import { SimpleGrid, Container } from "@mantine/core";
import "./catalog.css";
import { EventApi } from "../../api/eventApi";
import { APIStatus } from "../../types";

import { EventCard } from "./eventcard/eventcard";
import { useState, useEffect } from "react";

// const mockdata = [
//   {
//     title: "Summer Beach Party",
//     image:
//       "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
//     date: "August 18, 2022",
//     category: "Party",
//     start_price: 20,
//     tickets_left: 150,
//   },
//   {
//     title: "Rock Concert Under the Stars",
//     image:
//       "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
//     date: "August 27, 2022",
//     category: "Concert",
//     start_price: 50,
//     tickets_left: 100,
//   },
//   {
//     title: "Sunset Yoga Session",
//     image:
//       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
//     date: "September 9, 2022",
//     category: "Yoga",
//     start_price: 10,
//     tickets_left: 200,
//   },
//   {
//     title: "Midnight Masquerade Ball",
//     image:
//       "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
//     date: "September 12, 2022",
//     category: "Masquerade",
//     start_price: 100,
//     tickets_left: 50,
//   },
// ];

export function Catalog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await EventApi.getAllEvents();
      if (typeof result === "number") {
        setLoading(false);
        switch (result) {
          case APIStatus.ServerError:
            setError("Server error");
            break;
          case APIStatus.Unauthorized:
            setError("Unauthorized");
            // redirect to login
            return;
          default:
            setError("Server error");
            break;
        }
      } else {
        setEvents(result);
        setLoading(false);
      }
    };

    setError("");
    fetchData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const cards = events.map((event: any, index: number) => {
    const availableTickets = event.tickets.filter(
      (ticket: any) => ticket.quantity > 0
    );
    const minPrice = Math.min(
      ...availableTickets.map((ticket: any) => ticket.price)
    );
    const totalQuantity = availableTickets.reduce(
      (acc: number, ticket: any) => acc + ticket.quantity,
      0
    );
    return (
      <EventCard
        key={index}
        title={event.title}
        image={event.image}
        date={new Date(event.start_date)}
        category={event.category}
        start_price={minPrice}
        tickets_left={totalQuantity}
      />
    );
  });

  return (
    <Container py="xl">
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
    </Container>
  );
}
