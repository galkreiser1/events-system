import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { OrderSummaryList } from "./OrderSummary";
import bg from "./bg.svg";
import classes from "./Checkout.module.css";
import "@mantine/core/styles.css";

export function Checkout() {
  return (
    <Paper shadow="md" radius="lg">
      <div className={classes.wrapper}>
        <div
          className={classes.contacts}
          style={{ backgroundImage: `url(${bg})` }}
        >
          <Text fz="lg" fw={700} className={classes.title} c="#fff">
            Order Summary
          </Text>

          <OrderSummaryList />
        </div>

        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <Text fz="lg" fw={700} className={classes.title}>
            Checkout
          </Text>

          <div className={classes.fields}>
            <TextInput
              style={{ marginTop: "15px" }}
              label="Your name"
              placeholder="English letters only"
              required
            />
            <TextInput
              style={{ marginTop: "15px" }}
              label="Credit card number"
              placeholder="0-9 digits only"
              required
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                style={{ marginTop: "15px" }}
                label="Expiration date"
                placeholder="MM/YY"
                required
              />
              <TextInput
                style={{ marginTop: "15px" }}
                label="cvv"
                placeholder="cvv"
                required
              />
            </SimpleGrid>
            <div className={classes.controlscpn}>
              <TextInput
                placeholder="Insert Coupon Code"
                classNames={{
                  input: classes.inputcpn,
                  root: classes.inputWrappercpn,
                }}
              />
              <Button className={classes.controlcpn}>Activate</Button>
            </div>

            <Group justify="flex-start" mt="md">
              <Button type="submit" className={classes.control}>
                Buy Now
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
