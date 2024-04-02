import { Table, Title, Container, Accordion } from "@mantine/core";
import { SmallEventCard } from "./smalleventcard/smalleventcard";
import "./UserSpace.css";
import { useEffect, useState } from "react";
import { OrderApi } from "../../api/orderApi";
import { APIStatus } from "../../types";
import { useNavigation } from "../../App";
import { Loader } from "../../loader/Loader";

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
    return <Loader />;
  }

  if (error) {
    navigator?.navigateTo("error-page");
  }

  const rows = orders.map((order: any, index) => (
    <Table.Tr key={index} className="row">
      <Table.Td>
        {new Date(order.checkout_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Table.Td>
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
      <Title mb={100} ta="center">
        Order History
      </Title>
      <Container size="lg">
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
