import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

dayjs.extend(customParseFormat);

export function EventForm() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  return (
    <form onSubmit={form.onSubmit(() => {})}>
      <Title
        order={2}
        size="h1"
        style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
        fw={900}
        ta="center"
      >
        Create new event
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" mb="lg">
        <TextInput
          label="Name"
          name="name"
          variant="filled"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Organizer"
          name="organizer"
          variant="filled"
          {...form.getInputProps("organizer")}
        />
      </SimpleGrid>
      <TextInput
        label="Category"
        name="category"
        variant="filled"
        mb="lg"
        {...form.getInputProps("category")}
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" mb="lg">
        <DatePickerInput
          valueFormat="DD/MM/YYYY HH:mm:ss"
          label="Start Date"
          placeholder="Date input"
        />

        <DatePickerInput
          valueFormat="DD/MM/YYYY HH:mm:ss"
          label="End Date"
          placeholder="Date input"
        />
      </SimpleGrid>

      <TextInput
        label="Img URL"
        name="img-url"
        variant="filled"
        {...form.getInputProps("img")}
      />

      <Textarea
        mt="md"
        label="Description"
        maxRows={10}
        minRows={5}
        autosize
        name="message"
        variant="filled"
        {...form.getInputProps("description")}
      />

      <Group justify="center" mt="xl">
        <Button type="submit" size="md">
          Create Event
        </Button>
      </Group>
    </form>
  );
}
