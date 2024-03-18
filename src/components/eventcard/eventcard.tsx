import { Card, Image, Text, Group, Badge, Button } from "@mantine/core";
import "./eventcard.css";
import React from "react";
import { sessionContext } from "../../App";

// const mockdata = {
//   image:
//     "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
//   title: "Verudela Beach",
//   country: "Croatia",
//   description:
//     "Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.",
//   badges: [
//     { emoji: "☀️", label: "Sunny weather" },
//     { emoji: "🦓", label: "Onsite zoo" },
//     { emoji: "🌊", label: "Sea" },
//     { emoji: "🌲", label: "Nature" },
//     { emoji: "🤽", label: "Water sports" },
//   ],
// };

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
      </Card.Section>

      <Card.Section className="section" mt="auto">
        {context?.permission == 0 && (
          <Text mt="md" className="label">
            Starting from: {start_price}$
          </Text>
        )}
        <Text mt="md" className="label" c="dimmed">
          Tickets left: {tickets_left}
        </Text>
      </Card.Section>

      <Group mt="auto">
        <Button radius="md" style={{ flex: 1 }}>
          {buttonText}
        </Button>
      </Group>
    </Card>
  );
}
