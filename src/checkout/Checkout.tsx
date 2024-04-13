import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  Loader,
  Notification,
  rem,
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
import { IconX, IconCheck } from "@tabler/icons-react";

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
  const [couponError, setCouponError] = useState<boolean>(false);
  const [couponErrorMessage, setCouponErrorMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [oldEvent, setOldEvent] = useState<any | null>(null);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

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

  const [errors, setErrors] = useState({
    holder: "",
    cc: "",
    exp: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchOldEvent = async () => {
      const oldEvent = await EventApi.getEvent(context?.eventId ?? "");
      setOldEvent(oldEvent);
    };

    fetchOldEvent();
  }, []);

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
      setCouponError(true);
      setCouponErrorMessage("Invalid Coupon");
      console.log("Invalid Coupon");
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
    const isValid = validateForm();
    if (!isValid) return;
    if (error) return;
    setBuyLoading(true);
    console.log("Payment Details:", paymentDetails);

    // check if enough tickets are available, only if timer expired
    // if (
    //   event?.tickets[context?.orderData?.ticket_index || 0]?.quantity <
    //   (context?.orderData.quantity ?? 0)
    // ) {
    //   setBuyLoading(false);
    //   console.log("Not enough tickets available"); //  Add error message
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
      oldEvent,
      context?.orderData?.ticket_type ?? "",
      context?.orderData?.quantity ?? 0,
      paymentDetails,
      activatedCoupon
    );

    if (res === APIStatus.Conflict) {
      setBuyLoading(false);
      setError(true);
      setErrorMessage(
        "Event dates have changed, please cancel and check updated event details"
      );
      console.log(
        "Dates have changed, please cancel and check updated event details"
      );
      return;
    }

    if (typeof res === "number") {
      setError(true);
      setErrorMessage("Payment Failed, please try again");
      setBuyLoading(false);
      console.log("Payment Failed:", res);
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

  const isExpirationDateValid = (expirationDate: string) => {
    // Parse the expiration date string in MM/YY format to get month and year
    const [expMonth, expYear] = expirationDate
      .split("/")
      .map((part) => parseInt(part, 10));

    // Create a new Date object for the expiration date with the parsed month and year
    const expirationDateObject = new Date(2000 + expYear, expMonth - 1); // Year 2000 is used as a base year for simplicity

    // Get the current date
    const currentDate = new Date();

    // Compare the expiration date with the current date
    return expirationDateObject > currentDate;
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const { holder, cc, exp, cvv } = paymentDetails;
    const newErrors: {
      holder: string;
      cc: string;
      exp: string;
      cvv: string;
    } = {
      holder: "",
      cc: "",
      exp: "",
      cvv: "",
    };

    if (!holder.trim() || !/^[a-zA-Z ]+$/.test(holder)) {
      newErrors.holder = "Please enter your name, English letters only";
    }

    if (!cc.trim() || !/^\d+$/.test(cc)) {
      newErrors.cc = "Please enter a valid credit card number - digits only";
    }

    if (!exp.trim() || !/^\d{2}\/\d{2}$/.test(exp)) {
      newErrors.exp = "Please enter a valid expiration date (MM/YY)";
    } else if (!isExpirationDateValid(exp)) {
      newErrors.exp = "Please enter a valid expiration date (future date)";
    }

    if (!cvv.trim() || !/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "Please enter a valid CVV (3 digits)";
    }

    setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    return Object.values(newErrors).every((error) => !error);
  };

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
                error={errors.holder}

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
                error={errors.cc}
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
                  error={errors.exp}
                />
                <TextInput
                  style={{ marginTop: "15px" }}
                  label="cvv"
                  placeholder="cvv"
                  required
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  name="cvv"
                  error={errors.cvv}
                />
              </SimpleGrid>
              <div className={classes.controlscpn}>
                <TextInput
                  mb={15}
                  value={coupon}
                  error={couponError && couponErrorMessage}
                  onChange={(event) => {
                    setCouponError(false);
                    setCouponErrorMessage("");
                    setCoupon(event.target.value);
                  }}
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
                <Button onClick={handleRollBack} color="red">
                  Cancel
                </Button>
              </Group>
              {error && (
                <Notification
                  mt={"md"}
                  icon={xIcon}
                  color="red"
                  title={errorMessage}
                  onClick={() => {
                    setError(false);
                    setErrorMessage("");
                  }}
                ></Notification>
              )}
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
}
