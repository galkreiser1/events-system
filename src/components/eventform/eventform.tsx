import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  NativeSelect,
  Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useState } from "react";

dayjs.extend(customParseFormat);

export function EventForm() {
  const form = useForm({
    initialValues: {
      name: "",
      organizer: "",
      start_date: null,
      end_date: null,
      category: "",
      img: "",
      description: "",
    },
    validate: {
      name: (value) => (value.trim().length < 1 ? "Name can't be empty" : null),
      organizer: (value) =>
        value.trim().length < 1 ? "Organizer can't be empty" : null,
      start_date: (value) =>
        value === null ? "Start date can't be empty" : null,
      end_date: (value) => (value === null ? "End date can't be empty" : null),
      img: (value) =>
        value.trim().length < 1 ? "Img URL can't be empty" : null,
      description: (value) =>
        value.trim().length < 1 ? "Description can't be empty" : null,
    },
  });

  const [inputs, setInputs] = useState([
    {
      ticket_name: "Normal",
      ticket_price: 0,
      ticket_quantity: 0,
    },
  ]);

  const handleChangeInput = (index: number, event: any) => {
    const values: any = [...inputs];
    values[index][event.target.name] = event.target.value;
    setInputs(values);
  };

  const handleAddInput = () => {
    const values = [
      ...inputs,
      { ticket_name: "Normal", ticket_price: 0, ticket_quantity: 0 },
    ];
    setInputs(values);
  };

  const handleRemoveInput = (index: number) => {
    if (inputs.length === 1) return;
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
  };

  const validateName = (value: string) => {
    if (value.trim().length < 1) {
      return "Name can't be empty";
    }
    return "";
  };

  const validatePrice = (value: number) => {
    if (isNaN(value)) {
      return "Price must be a number";
    }
    if (value < 0) {
      return "Price can't be negative";
    }
    if (value.toString() == "") {
      return "Price can't be empty";
    }
    return "";
  };

  const validateQuantity = (value: number) => {
    if (isNaN(value)) {
      return "Quantity must be a number";
    }
    if (value < 0) {
      return "Quantity can't be negative";
    }
    if (value.toString() == "") {
      return "Quantity can't be empty";
    }
    if (!Number.isInteger(Number(value))) {
      return "Quantity must be a whole number";
    }
    return "";
  };

  const checkTicketInputs = () => {
    let hasError = false;
    inputs.forEach((input) => {
      if (
        validateName(input.ticket_name) !== "" ||
        validatePrice(input.ticket_price) !== "" ||
        validateQuantity(input.ticket_quantity) !== ""
      ) {
        hasError = true;
      }
    });
    return hasError;
  };

  const handleSubmit = (values: any) => {
    if (checkTicketInputs()) {
      return;
    }
    const combined_values = { ...values, tickets: inputs };
    console.log(combined_values);
  };

  return (
    <>
      <Container size="sm">
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
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
          <NativeSelect
            mb="lg"
            label="Category"
            variant="filled"
            data={[
              "Charity Event",
              "Concert",
              "Conference",
              "Convention",
              "Exhibition",
              "Festival",
              "Product Launch",
              "Sports Event",
            ]}
            {...form.getInputProps("category")}
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" mb="lg">
            <DatePickerInput
              valueFormat="DD/MM/YYYY HH:mm:ss"
              label="Start Date"
              placeholder="Date input"
              {...form.getInputProps("start_date")}
            />

            <DatePickerInput
              valueFormat="DD/MM/YYYY HH:mm:ss"
              label="End Date"
              placeholder="Date input"
              {...form.getInputProps("end_date")}
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

          {inputs.map((input, index) => {
            return (
              <Group justify="center" mt="lg" key={index}>
                <TextInput
                  label="Type"
                  name="ticket_name"
                  placeholder="Name"
                  value={input.ticket_name}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validateName(input.ticket_name)}
                />
                <TextInput
                  label="Price"
                  name="ticket_price"
                  placeholder="Price"
                  value={input.ticket_price}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validatePrice(input.ticket_price)}
                />
                <TextInput
                  label="Quantity"
                  name="ticket_quantity"
                  placeholder="Quantity"
                  value={input.ticket_quantity}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validateQuantity(input.ticket_quantity)}
                />
                <Button
                  mt="lg"
                  size="xs"
                  color="red"
                  onClick={() => handleRemoveInput(index)}
                >
                  -
                </Button>
              </Group>
            );
          })}

          <Group justify="center" mt="lg">
            <Button
              mt="lg"
              color="gray"
              size="xs"
              radius="xl"
              onClick={() => handleAddInput()}
            >
              Add Tickets
            </Button>
          </Group>

          <Group justify="center" mt="xl">
            <Button type="submit" size="md">
              Create Event
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
