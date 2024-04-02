import {
  TextInput,
  SimpleGrid,
  Group,
  Title,
  Button,
  Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { PaymentApi } from "../../api/paymentApi";
import { APIStatus } from "../../types";
import { useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Notification, rem } from "@mantine/core";
import { Loader } from "../../loader/Loader";

export function CouponForm() {
  const form = useForm({
    initialValues: {
      code: "",
      discount: 0,
    },
    validate: {
      code: (value) => value.trim().length < 2,
      discount: (value) => value < 0,
    },
  });

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    setError("");
    setLoading(true);
    let result: any = await PaymentApi.createCoupon(values);
    setLoading(false);
    switch (result) {
      case APIStatus.Success:
        setSuccess(true);
        break;
      case APIStatus.AlreadyExists:
        setError("Coupon already exists");
        break;
      case APIStatus.Forbidden:
        setError("Permission Denied");
        break;
      default:
        setError("Server error");
        break;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container size="sm">
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
            title="Coupon Created Successfully!"
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
          Create New Coupon
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="Code"
            placeholder="Coupon code"
            name="code"
            variant="filled"
            {...form.getInputProps("code")}
          />
          <TextInput
            label="Discount"
            placeholder="Discount amount"
            name="discount"
            variant="filled"
            {...form.getInputProps("discount")}
          />
        </SimpleGrid>

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Create Coupon
          </Button>
        </Group>
      </form>
    </Container>
  );
}
