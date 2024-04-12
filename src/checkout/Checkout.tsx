import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import { OrderSummaryList } from "./OrderSummary";
import classes from "./Checkout.module.css";
import "@mantine/core/styles.css";
import bg from "./bg.png";

import { useContext, useEffect, useState } from "react";
import { sessionContext } from "../App";
import { Timer } from "./Timer";
import { EventApi } from "../api/eventApi";
import { PaymentApi } from "../api/paymentApi";
import { APIStatus, successDataType } from "../types";
import { useNavigation } from "../App";

export function Checkout() {
  const [coupon, setCoupon] = useState<string>("");
  const [activatedCoupon, setActivatedCoupon] = useState<string | undefined>(
    undefined
  );
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const context = useContext(sessionContext);
  const navigator = useNavigation();
  const [loadingRollback, setLoadingRollback] = useState(false);

  const orderData = [
    { title: "Event:", description: context?.orderData?.event_title },
    {
      title: "Tickets:",
      description: `${context?.orderData?.quantity} x ${context?.orderData?.ticket_type}`,
    },
    {
      title: "Original Price:",
      description: `${
        (context?.orderData?.price ?? 0) * (context?.orderData?.quantity ?? 0)
      }$`,
    },
    { title: "Discount:", description: "0$" },
    {
      title: "Price After Discount:",
      description: `${
        (context?.orderData?.price ?? 0) * (context?.orderData?.quantity ?? 0)
      }$`,
    },
  ];

  // let MOCKDATA = [
  //   { title: "Event:", description: "Maccabi Haifa match" },
  //   { title: "Tickets:", description: "2 X Gold Seats" },
  //   { title: "Original Price:", description: "100$" },
  //   { title: "Discount:", description: "0$" },
  //   { title: "Price After Discount:", description: "100$" },
  // ];
  const [orderDetails, setOrderDetails] = useState(orderData);
  console.log(orderDetails);
  const originalPrice = parseInt(
    orderData[2]?.description?.slice(0, -1) ?? "0"
  );

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

    console.log(orderDetails);
  }, [discount]);

  const activateCoupon = async (coupon: string) => {
    setCouponLoading(true);
    const couponData = await PaymentApi.getCoupon(coupon);
    console.log(couponData);
    if (typeof couponData === "number") {
      console.log("Invalid Coupon"); // TODO: Add error message
      setCouponLoading(false);
      return;
    }
    setActivatedCoupon(coupon);
    setCouponLoading(false);
    setDiscount(couponData.discount);
    console.log("Coupon Activated");
    return;
  };

  const handleFormSubmit = async () => {
    setBuyLoading(true);
    console.log("Payment Details:", paymentDetails);
    const event = await EventApi.getEvent(context?.eventId ?? "");

    // check if enough tickets are available, only if timer expired
    // if (
    //   event?.tickets[context?.orderData?.ticket_index || 0]?.quantity <
    //   (context?.orderData.quantity ?? 0)
    // ) {
    //   setBuyLoading(false);
    //   console.log("Not enough tickets available"); // TODO: Add error message
    //   return;
    // }

    if (context?.lockId) {
      await EventApi.unlockTicket(
        context?.lockId,
        context?.eventId,
        context?.orderData?.ticket_type,
        context?.orderData?.quantity
      );
    }

    const res = await PaymentApi.Buy(
      event,
      context?.orderData?.ticket_type ?? "",
      context?.orderData?.quantity ?? 0,
      paymentDetails,
      activatedCoupon
    );

    if (res === APIStatus.Conflict) {
      setBuyLoading(false);
      console.log("Dates have changed, go back to check updated event details"); // TODO: Add error message
      return;
    }

    if (typeof res === "number") {
      setBuyLoading(false);
      console.log("Payment Failed:", res); // TODO: Add error message "Try again"
      return;
    }
    if (typeof res === "object") {
      // type of res is res.data, meaning payment was successful
      const payment_id = res.order_id;

      const successData: successDataType = {
        payment_id: payment_id,
        event_title: context?.orderData?.event_title ?? "",
        ticket_type: context?.orderData?.ticket_type ?? "",
        quantity: context?.orderData?.quantity ?? 0,
        total: paymentDetails.charge,
      };

      context?.setSuccessData(successData);

      setBuyLoading(false);
      console.log("Payment Successful");
      navigator?.navigateTo("success");
    }
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  //TODO: add form validations
  const handleRollBack = async () => {
    setLoadingRollback(true);
    console.log("Rolling back");
    // const ticketsToRollBack = {
    //   ticket_type: context?.orderData.ticket_type ?? "",
    //   quantity: -(context?.orderData.quantity ?? 0),
    // };
    // const res = await EventApi.updateEventTicket(
    //   context?.eventId ?? "",
    //   ticketsToRollBack
    // );
    // console.log(
    //   `RolledBack ${ticketsToRollBack.quantity} tickets of type ${ticketsToRollBack.ticket_type} `,
    //   res
    // );
    setLoadingRollback(false);
    navigator?.navigateTo("event-page");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        placeContent: "center",
        placeItems: "center",
        height: "80vh",
      }}
    >
      {!loadingRollback && <Timer onComplete={handleRollBack} />}
      {loadingRollback && <Loader />}
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
                  loading={couponLoading}
                  className={classes.controlcpn}
                  onClick={() => activateCoupon(coupon ?? "")}
                >
                  Activate
                </Button>
              </div>

              <Group justify="flex-start" mt="md">
                <Button
                  type="submit"
                  className={classes.control}
                  onClick={handleFormSubmit}
                  loading={buyLoading}
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
