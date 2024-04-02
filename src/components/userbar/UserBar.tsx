import {
  Group,
  Button,
  Box,
  Avatar,
  Text,
  UnstyledButton,
  Loader,
} from "@mantine/core";
import classes from "./UserBar.module.css";
import { GoArrowLeft } from "react-icons/go";
import { useContext, useEffect, useState } from "react";
import { sessionContext, useNavigation } from "../../App";
import { AuthApi } from "../../api/authApi";
import { UserApi } from "../../api/userApi";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

export function UserBar() {
  const context = useContext(sessionContext);
  const navigator = useNavigation();
  const createEventPermissions = ["M", "A"];

  const [nextEvent, setNextEvent] = useState<string>("");
  const [numCoupons, setNumCoupons] = useState<number>(0);
  const [nextEventError, setNextEventError] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [eventLoading, setEventLoading] = useState<boolean>(true);
  const [couponLoading, setCouponLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const nextEventResult = await UserApi.getNextEvent();
      if (typeof nextEventResult === "number") {
        setEventLoading(false);
        setNextEventError("Error Fetching Next Event");
      } else {
        setEventLoading(false);
        setNextEvent(nextEventResult.next_event);
      }
      const couponResult = await UserApi.getNumofCoupons();
      if (typeof couponResult === "number") {
        setCouponLoading(false);
        setCouponError("Error Fetching Coupons");
      } else {
        setCouponLoading(false);
        setNumCoupons(couponResult.coupons_used);
      }
    };
    if (context?.username) {
      setEventLoading(true);
      setNextEventError("");
      setCouponLoading(true);
      setCouponError("");
      fetchData();
    }
  }, [context?.username]);

  useEffect(() => {
    const fetchData = async () => {
      let result: any = await AuthApi.getUserName();
      result = JSON.parse(result);
      if (typeof result === "number") {
        setUserError("Failed fetching user");
      } else {
        context?.setPermission(result?.permission || "U");
        context?.setUsername(result?.username || "");
      }
    };
    if (!context?.username) {
      fetchData();
    }
  }, [[context?.username]]);

  const handleLogOut = async () => {
    try {
      await AuthApi.logout();
    } catch (e) {
      console.log(e);
    }
    context?.setUsername("");
    navigator?.navigateTo("signin");
  };

  const handleBackButton = () => {
    if (context?.route !== "catalog") {
      window.history.back();
    }
  };

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {context?.permission === "U" && (
            <UnstyledButton onClick={() => navigator?.navigateTo("userspace")}>
              <Group gap={10}>
                <Avatar
                  src={user.image}
                  alt={user.name}
                  radius="xl"
                  size={30}
                />
                <Text fw={500} size="md" lh={1} mr={3}>
                  {!userError && context?.username}
                  {userError && userError}
                </Text>
              </Group>
            </UnstyledButton>
          )}

          {context?.permission !== "U" && (
            <Group gap={10}>
              <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
              <Text fw={500} size="md" lh={1} mr={3}>
                {!userError && context?.username}
                {userError && userError}
              </Text>
            </Group>
          )}

          {context?.permission &&
            createEventPermissions.includes(context.permission) && (
              <Group>
                <Button
                  color="blue"
                  onClick={() => navigator?.navigateTo("eventform")}
                >
                  Create Event
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigator?.navigateTo("couponform")}
                >
                  Create Coupon
                </Button>
              </Group>
            )}

          {context?.permission && context.permission === "U" && (
            <Group gap={150}>
              {context?.route === "catalog" && !eventLoading && (
                <Text fw={500} size="lg">
                  {nextEventError}
                  {!nextEvent && "No upcoming events!"}
                  {nextEvent && `Next event: ${nextEvent}`}
                </Text>
              )}

              {context?.route === "catalog" && eventLoading && (
                <Loader color="blue" type="dots" />
              )}

              {couponLoading && <Loader color="blue" type="dots" />}

              {!couponLoading && (
                <Text fw={500} size="lg">
                  {couponError}
                  Coupons used: {numCoupons}
                </Text>
              )}
            </Group>
          )}

          <Group visibleFrom="sm">
            <Button variant="default" size="md" onClick={handleBackButton}>
              <GoArrowLeft />
            </Button>

            <Button color="red" onClick={handleLogOut}>
              Sign Out
            </Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}
