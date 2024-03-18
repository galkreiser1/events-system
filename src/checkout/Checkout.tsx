import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { OrderSummaryList } from "./OrderSummary";
import classes from "./Checkout.module.css";
import "@mantine/core/styles.css";
import bg from "./bg.svg";

import { useEffect, useState } from "react";

export function Checkout() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  let MOCKDATA = [
    { title: "Event:", description: "Maccabi Haifa match" },
    { title: "Tickets:", description: "2 X Gold Seats" },
    { title: "Original Price:", description: "100$" },
    { title: "Discount:", description: "0$" },
    { title: "Price After Discount:", description: "100$" },
  ];
  const [orderDetails, setOrderDetails] = useState(MOCKDATA);

  useEffect(() => {
    const originalPrice = parseInt(MOCKDATA[2].description.slice(0, -1));
    const priceAfterDiscount = originalPrice - discount;

    setOrderDetails([
      ...orderDetails.slice(0, 3), // Keep the first three items unchanged
      { title: "Discount:", description: `${discount}$` },
      { title: "Price After Discount:", description: `${priceAfterDiscount}$` },
    ]);
  }, [discount]);

  const activateCoupon = (coupon: string) => {
    if (coupon === "maccabi") {
      setDiscount(30);
      console.log("Coupon Activated");
    }
  };

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

          <OrderSummaryList orderDetails={orderDetails} />
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
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Insert Coupon Code"
                classNames={{
                  input: classes.inputcpn,
                  root: classes.inputWrappercpn,
                }}
              />
              <Button
                className={classes.controlcpn}
                onClick={() => activateCoupon(coupon)}
              >
                Activate
              </Button>
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
