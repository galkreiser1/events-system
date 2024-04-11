import { Title, Text, Button, Container, Group } from "@mantine/core";
import "./SuccessPage.css";
import { sessionContext, useNavigation } from "../App";
import { useContext } from "react";
// import { Link } from "react-router-dom";

export function SuccessPage() {
  const context = useContext(sessionContext);
  const navigator = useNavigation();

  const successData = context?.successData;

  return (
    <Container className="root">
      <Title className="title">Congratulations! Enjoy!</Title>
      <Container>
        <Text c="green" size="lg" ta="center" className="description" mb="md">
          OrderId: {successData?.payment_id}
        </Text>
        <Text size="lg" ta="center" className="description">
          {context?.successData?.event_title}
        </Text>
        <Text size="lg" ta="center" className="description">
          {context?.successData.quantity} x {context?.successData?.ticket_type}
        </Text>
        <Text size="lg" ta="center" className="description" mb="xl">
          Total: ${context?.successData.total}
        </Text>
      </Container>
      <Group justify="center">
        <Button
          onClick={() => {
            navigator?.navigateTo("catalog");
          }}
          size="md"
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
