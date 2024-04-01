import {
  SimpleGrid,
  Container,
  Title,
  Button,
  RangeSlider,
  Grid,
  Text,
} from "@mantine/core";
import "./catalog.css";
import { EventApi } from "../../api/eventApi";
import { APIStatus } from "../../types";
import { AuthApi } from "../../api/authApi";
import { EventCard } from "./eventcard/eventcard";
import { useState, useEffect, useContext } from "react";
import { useNavigation, sessionContext } from "../../App";
import { Loader } from "../../loader/Loader";
import { GoArrowDown, GoArrowUp } from "react-icons/go";

const getMaxPrice = (events: any) => {
  const cards = events.map((event: any) => {
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

    return {
      ...event,
      start_price: minPrice,
      tickets_left: totalQuantity,
    };
  });

  // const minStartPrice = cards.reduce((minPrice:number, card:any) => {
  //   return Math.min(minPrice, card.start_price);
  // }, Number.MAX_VALUE);

  const maxStartPrice = cards.reduce((maxPrice: number, card: any) => {
    return Math.max(maxPrice, card.start_price);
  }, Number.MIN_VALUE);

  return maxStartPrice;
};

export function Catalog() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigator = useNavigation();
  const context = useContext(sessionContext);
  const [sort, setSort] = useState<string>("");
  const [value, setValue] = useState<[number, number]>([0, 1000]);
  const [endValue, setEndValue] = useState<[number, number]>([0, 1000]);
  const [maxValue, setMaxValue] = useState<number>(0);

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
        setMaxValue(getMaxPrice(result));
        setValue([0, getMaxPrice(result)]);
        setLoading(false);
      }
    };

    if (events.length === 0) {
      setError("");
      fetchData();
    }
  }, [events]);

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
    if (!context?.username) {
      setError("");
      fetchData();
    }
  }, [context?.username]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const cards = events.map((event: any) => {
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

    return {
      ...event,
      start_price: minPrice,
      tickets_left: totalQuantity,
    };
  });

  const sortedCards = cards
    .filter((event: any) => {
      return (
        event.start_price >= endValue[0] && event.start_price <= endValue[1]
      );
    })
    .sort((a, b) => {
      if (sort === "asc") {
        return a.start_price - b.start_price;
      } else if (sort === "desc") {
        return b.start_price - a.start_price;
      } else {
        return 0;
      }
    })
    .map((event: any, index: number) => {
      return (
        <EventCard
          key={index}
          id={event._id}
          title={event.title}
          image={event.image}
          date={new Date(event.start_date)}
          category={event.category}
          start_price={event.start_price}
          tickets_left={event.tickets_left}
        />
      );
    });

  return (
    <>
      <Title order={1} ta="center" mb={50}>
        Catalog
      </Title>
      <Container py="xl">
        <Grid mb="md">
          <Grid.Col span={2}>
            <Text fw={500}>Price Range:</Text>
          </Grid.Col>
          <Grid.Col span={4} offset={-0.5}>
            <RangeSlider
              mt={5}
              value={value}
              onChange={setValue}
              onChangeEnd={setEndValue}
              step={1}
              min={0}
              max={maxValue}
            />
          </Grid.Col>
          <Grid.Col span={1} offset={0.3}></Grid.Col>
          <Grid.Col span={1} offset={4}>
            {sort === "" && (
              <Button variant="light" onClick={() => setSort("desc")}>
                Sort
              </Button>
            )}
            {sort === "asc" && (
              <Button
                variant="light"
                rightSection={<GoArrowUp size={14} />}
                onClick={() => setSort("desc")}
              >
                Sort
              </Button>
            )}
            {sort === "desc" && (
              <Button
                variant="light"
                rightSection={<GoArrowDown size={14} />}
                onClick={() => setSort("asc")}
              >
                Sort
              </Button>
            )}
          </Grid.Col>
        </Grid>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>{sortedCards}</SimpleGrid>
      </Container>
    </>
  );
}
