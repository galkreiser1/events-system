import {
  SimpleGrid,
  Container,
  Title,
  Button,
  RangeSlider,
  Grid,
  Text,
  Loader,
} from "@mantine/core";
import "./catalog.css";
import { EventApi } from "../../api/eventApi";
import { APIStatus } from "../../types";
import { AuthApi } from "../../api/authApi";
import { EventCard } from "./eventcard/eventcard";
import { useState, useEffect, useContext } from "react";
import { useNavigation, sessionContext } from "../../App";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader as LegacyLoader } from "../../loader/Loader";
import { eventType, ticketsDataType } from "../../types";

const getMaxPrice = (events: eventType[]) => {
  const cards = events.map((event: any) => {
    const availableTickets = event.tickets.filter(
      (ticket: any) => ticket.quantity > 0
    );
    let minPrice = 0;
    if (availableTickets.length > 0) {
      minPrice = Math.min(
        ...availableTickets.map((ticket: ticketsDataType) => 0 + ticket.price)
      );
    }
    const totalQuantity = availableTickets.reduce(
      (acc: number, ticket: ticketsDataType) => acc + ticket.quantity,
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
  const [events, setEvents] = useState<eventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigator = useNavigation();
  const context = useContext(sessionContext);
  const [sort, setSort] = useState<string>("");
  const [value, setValue] = useState<[number, number]>([0, 1000]);
  const [endValue, setEndValue] = useState<[number, number]>([0, 1000]);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleResultError = (result: number) => {
    switch (result) {
      case APIStatus.ServerError:
        setError("Server error");
        break;
      case APIStatus.Unauthorized:
        navigator?.navigateTo("signin");
        return;
      default:
        setError("Server error");
        break;
    }
  };

  const handleFetchData = async () => {
    let result = await EventApi.getAllEvents(page);
    if (typeof result !== "number") {
      if (result.length === 0) {
        setHasMore(false);
      } else {
        // setEvents((prevEvents) => [...prevEvents, ...result]);
        // if (context?.permission === "U") {
        //   result = result.filter((event: any) => {
        //     return new Date(event.start_date) >= new Date();
        //   });
        // }

        // result = result.filter((event: any) => {
        //   return !events.find((e: any) => e._id === event._id);
        // });
        setEvents([...events, ...result]);
        // console.log("fetch data events after results: ", events);
        setPage(page + 1);
        setMaxValue(getMaxPrice(events));
        setValue([0, getMaxPrice(events)]);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await EventApi.getAllEvents(page);
      if (typeof result === "number") {
        setLoading(false);
        handleResultError(result);
      } else {
        if (result.length === 0) {
          setHasMore(false);
        } else {
          // if (context?.permission === "U") {
          //   result = result.filter((event: any) => {
          //     return new Date(event.start_date) >= new Date();
          //   });
          // }

          result = result.filter((event: eventType) => {
            return !events.find((e: eventType) => e._id === event._id);
          });

          if (page === 1) {
            setEvents([...result]);
          } else {
            setEvents([...events, ...result]);
          }
          setPage(page + 1);
        }
        setMaxValue(getMaxPrice(events));
        setValue([0, getMaxPrice(events)]);
        setLoading(false);
      }
    };

    if (events.length === 0 && hasMore) {
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
        handleResultError(result);
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
    return <LegacyLoader />;
  }

  if (error) {
    navigator?.navigateTo("error-page");
  }

  const cards = events.map((event: eventType) => {
    const availableTickets = event.tickets.filter(
      (ticket: ticketsDataType) => ticket.quantity > 0
    );
    let minPrice = 0;
    if (availableTickets.length > 0) {
      minPrice = Math.min(
        ...availableTickets.map((ticket: any) => 0 + ticket.price)
      );
    }
    const totalQuantity = availableTickets.reduce(
      (acc: number, ticket: ticketsDataType) => acc + ticket.quantity,
      0
    );

    return {
      ...event,
      start_price: minPrice,
      tickets_left: totalQuantity,
    };
  });

  const filteredCards = cards.filter((event: eventType) => {
    return new Date(event.start_date) >= new Date();
  });

  const chosenCards = context?.permission === "U" ? filteredCards : cards;

  if (chosenCards.length < 9 && hasMore) {
    handleFetchData();
  }

  const sortedCards = chosenCards
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
        <InfiniteScroll
          dataLength={events.length}
          next={handleFetchData}
          hasMore={hasMore}
          loader={<Loader size="sm" mt={50} className="scroll-loader" />}
          endMessage={
            <p style={{ textAlign: "center" }}>No more events to load</p>
          }
        >
          <SimpleGrid cols={{ base: 1, sm: 3 }}>{sortedCards}</SimpleGrid>
        </InfiniteScroll>
      </Container>
    </>
  );
}
