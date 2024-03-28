import { Table, Title, Container, Accordion } from "@mantine/core";
import { SmallEventCard } from "./smalleventcard/smalleventcard";
import "./UserSpace.css";
import { useEffect, useState } from "react";
import { OrderApi } from "../../api/orderApi";
import { APIStatus } from "../../types";
import { useNavigation } from "../../App";

// const orders = [
//   {
//     date: "2024-02-15",
//     ticketType: "VIP",
//     quantity: 2,
//     event: {
//       image: "event1.jpg",
//       title: "Music Festival",
//       start_date: "2024-02-14T18:00:00",
//       end_date: "2024-02-16T23:59:59",
//       category: "Festival",
//       description: "A three-day music festival featuring top artists.",
//     },
//   },
//   {
//     date: "2024-03-20",
//     ticketType: "General Admission",
//     quantity: 3,
//     event: {
//       image: "event2.jpg",
//       title: "Tech Conference",
//       start_date: "2024-03-18T09:00:00",
//       end_date: "2024-03-20T17:00:00",
//       category: "Conference",
//       description: "An annual conference for tech enthusiasts.",
//     },
//   },
//   {
//     date: "2024-04-10",
//     ticketType: "Early Bird",
//     quantity: 1,
//     event: {
//       image: "event3.jpg",
//       title: "Art Exhibition",
//       start_date: "2024-04-08T10:00:00",
//       end_date: "2024-04-12T18:00:00",
//       category: "Exhibition",
//       description: "Showcasing the works of renowned artists.",
//     },
//   },
// ];

export function UserSpace() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigator = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const result = await OrderApi.getUserOrders();
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
        setOrders(result);
        setLoading(false);
      }
    };

    setError("");
    fetchData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const rows = orders.map((order, index) => (
    <Table.Tr key={index} className="row">
      <Table.Td>{order.checkout_date}</Table.Td>
      <Table.Td>{order.ticket_type}</Table.Td>
      <Table.Td>{order.quantity}</Table.Td>
      <Table.Td className="cell">
        <Accordion>
          <Accordion.Item key={index} value={order.event.title}>
            <Accordion.Control>{order.event.title}</Accordion.Control>
            <Accordion.Panel>
              <SmallEventCard
                title={order.event.title}
                start_date={new Date(order.event.start_date)}
                end_date={new Date(order.event.end_date)}
                category={order.event.category}
                description={order.event.description}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Container size="lg">
        <Title mb="xl">Username</Title>
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
