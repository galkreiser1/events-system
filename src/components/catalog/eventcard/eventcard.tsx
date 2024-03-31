import { Card, Image, Text, Group, Badge, Button } from "@mantine/core";
import "./eventcard.css";
import React from "react";
import { sessionContext, useNavigation } from "../../../App";
// import { Link } from "react-router-dom";

type EventCardProps = {
  id: string;
  image: string;
  title: string;
  date: Date;
  category: string;
  start_price: number;
  tickets_left: number;
};

export function EventCard({
  id,
  image,
  title,
  date,
  category,
  start_price,
  tickets_left,
}: EventCardProps) {
  const context = React.useContext(sessionContext);
  const navigator = useNavigation();
  let buttonText = "Buy Now";
  const permission = context?.permission || "U";
  if (permission !== "U") {
    buttonText = "Edit Event";
  }

  const handleClick = () => {
    context?.setEventId?.(id);
    navigator?.navigateTo("event-page");
  };
  return (
    <Card withBorder radius="md" p="md" className="card">
      <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section>

      <Card.Section className="section" mt="md">
        <Text fz="lg" fw={500}>
          {title}
        </Text>
      </Card.Section>

      <Card.Section className="section" mt="auto">
        <Badge size="lg" variant="light">
          {category}
        </Badge>
        <Text fz="md" mt="xs">
          {date.toLocaleDateString("en-GB")}
        </Text>

        {tickets_left > 0 && permission === "U" && (
          <Text mt="md">Starting from: {start_price}$</Text>
        )}
        {tickets_left === 0 && permission === "U" && (
          <Text mt="md">Sold Out</Text>
        )}
        <Text mt="md" c="dimmed">
          Tickets left: {tickets_left}
        </Text>
      </Card.Section>

      <Group mt="auto">
        {/* <Link to="/success"> */}
        <Button radius="md" style={{ flex: 1 }} onClick={handleClick}>
          {buttonText}
        </Button>
        {/* </Link> */}
      </Group>
    </Card>
  );
}
