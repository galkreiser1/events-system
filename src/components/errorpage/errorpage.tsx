import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./errorpage.module.css";
import { useNavigation } from "../../App";

export function ErrorPage() {
  const navigator = useNavigation();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>500</div>
      <Title className={classes.title}>Server Error</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Something went wrong on our end. Please try again later.
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => navigator?.navigateTo("catalog")}
        >
          Take me back to catalog
        </Button>
      </Group>
    </Container>
  );
}
