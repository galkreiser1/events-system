import {
  Table,
  Title,
  Container,
  Accordion,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { SmallEventCard } from "./smalleventcard/smalleventcard";
import "./UserSpace.css";

const tickets = [
  {
    date: "2024-02-15",
    ticketType: "VIP",
    quantity: 2,
    event: {
      image: "event1.jpg",
      title: "Music Festival",
      start_date: "2024-02-14T18:00:00",
      end_date: "2024-02-16T23:59:59",
      category: "Festival",
      description: "A three-day music festival featuring top artists.",
    },
  },
  {
    date: "2024-03-20",
    ticketType: "General Admission",
    quantity: 3,
    event: {
      image: "event2.jpg",
      title: "Tech Conference",
      start_date: "2024-03-18T09:00:00",
      end_date: "2024-03-20T17:00:00",
      category: "Conference",
      description: "An annual conference for tech enthusiasts.",
    },
  },
  {
    date: "2024-04-10",
    ticketType: "Early Bird",
    quantity: 1,
    event: {
      image: "event3.jpg",
      title: "Art Exhibition",
      start_date: "2024-04-08T10:00:00",
      end_date: "2024-04-12T18:00:00",
      category: "Exhibition",
      description: "Showcasing the works of renowned artists.",
    },
  },
  // Add more objects as needed
];

export function UserSpace() {
  const rows = tickets.map((ticket, index) => (
    <Table.Tr key={index} className="row">
      <Table.Td>{ticket.date}</Table.Td>
      <Table.Td>{ticket.ticketType}</Table.Td>
      <Table.Td>{ticket.quantity}</Table.Td>
      <Table.Td className="cell">
        <Accordion>
          <Accordion.Item key={index} value={ticket.event.title}>
            <Accordion.Control>{ticket.event.title}</Accordion.Control>
            <Accordion.Panel>
              <SmallEventCard
                title={ticket.event.title}
                start_date={new Date(ticket.event.start_date)}
                end_date={new Date(ticket.event.end_date)}
                category={ticket.event.category}
                description={ticket.event.description}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title mb="xl">Username</Title>
      <Container size="auto">
        <Table withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Ticket Type</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th className="head">Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </>
  );
}
