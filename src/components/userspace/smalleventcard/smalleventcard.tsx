import { Card, Image, Text, Group, Badge, Button } from "@mantine/core";
import "./smalleventcard.css";

type EventCardProps = {
  title: string;
  start_date: Date;
  end_date: Date;
  category: string;
  description: string;
  // start_price: number;
  // tickets_left: number;
};

export function SmallEventCard({
  title,
  start_date,
  end_date,
  category,
  description,
}: EventCardProps) {
  return (
    <Card withBorder radius="md" p="md" className="card">
      <Card.Section className="section" mt="md">
        <Text fz="lg" fw={500}>
          {title}
        </Text>
        <Badge size="lg" variant="light">
          {category}
        </Badge>
      </Card.Section>

      <Text fz="md" mt="xs">
        Start date: {start_date.toLocaleDateString("en-GB")}
      </Text>
      <Text fz="md">End date: {end_date.toLocaleDateString("en-GB")}</Text>

      <Card.Section className="section" mt="s">
        <Text fz="md" fw={500}>
          {description}
        </Text>
      </Card.Section>
    </Card>
  );
}
