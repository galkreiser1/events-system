import { SimpleGrid, Container, Title } from "@mantine/core";
import "./catalog.css";
import { EventApi } from "../../api/eventApi";
import { APIStatus } from "../../types";
import { AuthApi } from "../../api/authApi";
import { EventCard } from "./eventcard/eventcard";
import { useState, useEffect, useContext } from "react";
import { useNavigation, sessionContext } from "../../App";
import { Loader } from "../../loader/Loader";

export function Catalog() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigator = useNavigation();
  const context = useContext(sessionContext);

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
            navigator?.navigateTo("signin");
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

  useEffect(() => {
    const fetchData = async () => {
      let result: any = await AuthApi.getUserName();
      result = JSON.parse(result);
      if (typeof result === "number") {
        setLoading(false);
        switch (result) {
          case APIStatus.ServerError:
            setError("Server error");
            break;
          case APIStatus.Unauthorized:
            setError("Unauthorized, redirecting to login...");
            navigator?.navigateTo("signin");
            return;
          default:
            setError("Server error");
            break;
        }
      } else {
        setLoading(false);
        context?.setPermission(result?.permission || "U");
        context?.setUsername(result?.username || "");
      }
    };
    setError("");
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const cards = events.map((event: any, index: number) => {
    const availableTickets = event.tickets.filter(
      (ticket: any) => ticket.quantity > 0
    );
    let minPrice = 0;
    if (availableTickets.length > 0) {
      minPrice = Math.min(
        ...availableTickets.map((ticket: any) => 0 + ticket.price)
      );
    }
    const totalQuantity = availableTickets.reduce(
      (acc: number, ticket: any) => acc + ticket.quantity,
      0
    );
    return (
      <>
        <EventCard
          key={index}
          id={event._id}
          title={event.title}
          image={event.image}
          date={new Date(event.start_date)}
          category={event.category}
          start_price={minPrice}
          tickets_left={totalQuantity}
        />
      </>
    );
  });

  return (
    <>
      <Title order={1} ta="center" mb={50}>
        Catalog
      </Title>
      <Container py="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
      </Container>
    </>
  );
}
