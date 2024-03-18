import { SimpleGrid, Container } from "@mantine/core";
import "./catalog.css";

import { EventCard } from "../eventcard/eventcard";

const mockdata = [
  {
    title: "Summer Beach Party",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "August 18, 2022",
    category: "Party",
    start_price: 20,
    tickets_left: 150,
  },
  {
    title: "Rock Concert Under the Stars",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "August 27, 2022",
    category: "Concert",
    start_price: 50,
    tickets_left: 100,
  },
  {
    title: "Sunset Yoga Session",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "September 9, 2022",
    category: "Yoga",
    start_price: 10,
    tickets_left: 200,
  },
  {
    title: "Midnight Masquerade Ball",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "September 12, 2022",
    category: "Masquerade",
    start_price: 100,
    tickets_left: 50,
  },
];

export function Catalog() {
  const cards = mockdata.map((article) => (
    <EventCard
      title={article.title}
      image={article.image}
      date={new Date(article.date)}
      category={article.category}
      start_price={article.start_price}
      tickets_left={article.tickets_left}
    />
  ));

  return (
    <Container py="xl">
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{cards}</SimpleGrid>
    </Container>
  );
}
