import { Title, Text, Button, Container, Group } from "@mantine/core";
import "./SuccessPage.css";

export function SuccessPage() {
  return (
    <Container className="root">
      <Title className="title">Congratulations! Enjoy!</Title>
      <Container>
        <Text c="red" size="lg" ta="center" className="description" mb="md">
          Order #1234567890
        </Text>
        <Text c="dimmed" size="lg" ta="center" className="description">
          Event Name
        </Text>
        <Text c="dimmed" size="lg" ta="center" className="description">
          2x VIP Tickets
        </Text>
        <Text c="dimmed" size="lg" ta="center" className="description" mb="xl">
          Total: $100
        </Text>
      </Container>

      <Group justify="center">
        <Button variant="subtle" size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
