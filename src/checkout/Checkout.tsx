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
import bg from "./bg.png";

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
  const originalPrice = parseInt(MOCKDATA[2].description.slice(0, -1));
  const [paymentDetails, setPaymentDetails] = useState({
    holder: "",
    cc: "",
    exp: "",
    cvv: "",
    charge: originalPrice,
  });

  useEffect(() => {
    const priceAfterDiscount = originalPrice - discount;
    setPaymentDetails({ ...paymentDetails, charge: priceAfterDiscount });

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

  const handleFormSubmit = () => {
    console.log("Payment Details:", paymentDetails);
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  //TODO: add form validations

  return (
    <div
      style={{
        display: "flex",
        placeContent: "center",
        placeItems: "center",
        height: "80vh",
      }}
    >
      <Paper shadow="md" radius="lg">
        <div className={classes.wrapper}>
          <div
            className={classes.contacts}
            style={{ backgroundImage: `url(${bg})` }}
          >
            <Text fz="xl" fw={700} className={classes.title} c="#fff">
              Order Summary
            </Text>

            <OrderSummaryList orderDetails={orderDetails} />
          </div>
          <form
            className={classes.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <Text fz="xl" fw={700} mb={30} className={classes.title}>
              Checkout
            </Text>

            <div className={classes.fields}>
              <TextInput
                style={{ marginTop: "15px" }}
                label="Your name"
                placeholder="English letters only"
                required
                value={paymentDetails.holder}
                onChange={handleInputChange}
                name="holder"

                //{...form.getInputProps("holder")}
              />
              <TextInput
                style={{ marginTop: "15px" }}
                label="Credit card number"
                placeholder="0-9 digits only"
                required
                value={paymentDetails.cc}
                onChange={handleInputChange}
                name="cc"
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  style={{ marginTop: "15px" }}
                  label="Expiration date"
                  placeholder="MM/YY"
                  required
                  value={paymentDetails.exp}
                  onChange={handleInputChange}
                  name="exp"
                />
                <TextInput
                  style={{ marginTop: "15px" }}
                  label="cvv"
                  placeholder="cvv"
                  required
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  name="cvv"
                />
              </SimpleGrid>
              <div className={classes.controlscpn}>
                <TextInput
                  mb={15}
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
                <Button
                  type="submit"
                  className={classes.control}
                  onClick={handleFormSubmit}
                >
                  Buy Now
                </Button>
              </Group>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
}
