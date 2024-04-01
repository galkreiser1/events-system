import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  NativeSelect,
  Container,
  Notification,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DateTimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useState } from "react";
import { EventApi } from "../../api/eventApi";
import { Loader } from "../../loader/Loader";
import { IconX, IconCheck } from "@tabler/icons-react";
import { APIStatus } from "../../types";

dayjs.extend(customParseFormat);

export function EventForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  // const navigator = useNavigation();

  const form = useForm({
    initialValues: {
      title: "",
      organizer: "",
      start_date: null,
      end_date: null,
      category: "",
      image: "",
      location: "",
      description: "",
    },
    validate: {
      title: (value) =>
        value.trim().length < 1 ? "Title can't be empty" : null,
      organizer: (value) =>
        value.trim().length < 1 ? "Organizer can't be empty" : null,
      location: (value) =>
        value.trim().length < 1 ? "Location can't be empty" : null,
      start_date: (value) =>
        value === null ? "Start date can't be empty" : null,
      end_date: (value) => (value === null ? "End date can't be empty" : null),
      image: (value) =>
        value.trim().length < 1 ? "Img URL can't be empty" : null,
      description: (value) =>
        value.trim().length < 1 ? "Description can't be empty" : null,
    },
  });

  const [inputs, setInputs] = useState([
    {
      type: "Normal",
      price: 0,
      quantity: 0,
    },
  ]);

  const handleChangeInput = (index: number, event: any) => {
    const values: any = [...inputs];
    values[index][event.target.name] = event.target.value;
    setInputs(values);
  };

  const handleAddInput = () => {
    const values = [...inputs, { type: "Normal", price: 0, quantity: 0 }];
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
        validateName(input.type) !== "" ||
        validatePrice(input.price) !== "" ||
        validateQuantity(input.quantity) !== ""
      ) {
        hasError = true;
      }
    });
    return hasError;
  };

  const handleSubmit = async (values: any) => {
    if (checkTicketInputs()) {
      return;
    }
    const combined_values = { ...values, tickets: inputs };
    combined_values.category = combined_values.category
      ? combined_values.category
      : "Charity Event";
    setLoading(true);
    const result = await EventApi.createEvent(combined_values);
    if (result === APIStatus.Success) {
      setSuccess(true);
    } else {
      setError("Server error");
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container size="sm" mb="xl">
        <Group justify="center" mb="xl">
          {!success && error && (
            <Notification
              icon={xIcon}
              color="red"
              title={error}
              onClick={() => {
                setError("");
              }}
            ></Notification>
          )}

          {success && !error && (
            <Notification
              icon={checkIcon}
              color="teal"
              title="Event Created Successfully!"
              mt="md"
              onClick={() => {
                setSuccess(false);
              }}
            ></Notification>
          )}
        </Group>
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
              label="Title"
              name="title"
              variant="filled"
              {...form.getInputProps("title")}
            />
            <TextInput
              label="Organizer"
              name="organizer"
              variant="filled"
              {...form.getInputProps("organizer")}
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" mb="lg">
            <NativeSelect
              mb="lg"
              value="Charity Event"
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
            <TextInput
              label="Location"
              name="location"
              variant="filled"
              {...form.getInputProps("location")}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl" mb="lg">
            <DateTimePicker
              label="Start Date"
              placeholder="Pick date and time"
              {...form.getInputProps("start_date")}
            />

            <DateTimePicker
              label="End Date"
              placeholder="Pick date and time"
              {...form.getInputProps("end_date")}
            />
          </SimpleGrid>

          <TextInput
            label="Img URL"
            name="img-url"
            variant="filled"
            {...form.getInputProps("image")}
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
                  name="type"
                  placeholder="Name"
                  value={input.type}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validateName(input.type)}
                />
                <TextInput
                  label="Price"
                  name="price"
                  placeholder="Price"
                  value={input.price}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validatePrice(input.price)}
                />
                <TextInput
                  label="Quantity"
                  name="quantity"
                  placeholder="Quantity"
                  value={input.quantity}
                  onChange={(event) => {
                    handleChangeInput(index, event);
                  }}
                  error={validateQuantity(input.quantity)}
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
