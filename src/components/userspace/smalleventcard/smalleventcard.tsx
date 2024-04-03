import { Card, Text, Badge } from "@mantine/core";
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
        Start date:{" "}
        {start_date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Text>
      <Text fz="md">
        End date:{" "}
        {end_date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Text>

      <Card.Section className="section" mt="s">
        <Text fz="md" fw={500}>
          {description}
        </Text>
      </Card.Section>
    </Card>
  );
}
