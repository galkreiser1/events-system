import { Card, Image, Text, Group, Badge, Button } from "@mantine/core";
import "./eventcard.css";
import React from "react";
import { sessionContext } from "../../../App";
import { Link } from "react-router-dom";

type EventCardProps = {
  image: string;
  title: string;
  date: Date;
  category: string;
  start_price: number;
  tickets_left: number;
};

export function EventCard({
  image,
  title,
  date,
  category,
  start_price,
  tickets_left,
}: EventCardProps) {
  const context = React.useContext(sessionContext);
  let buttonText = "Buy Now";
  const permission = context?.permission || 0;
  if (permission > 0) {
    buttonText = "Edit Event";
  }
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

        {context?.permission == 0 && (
          <Text mt="md">Starting from: {start_price}$</Text>
        )}
        <Text mt="md" c="dimmed">
          Tickets left: {tickets_left}
        </Text>
      </Card.Section>

      <Group mt="auto">
        {/* <Link to="/success"> */}
        <Button radius="md" style={{ flex: 1 }}>
          {buttonText}
        </Button>
        {/* </Link> */}
      </Group>
    </Card>
  );
}
