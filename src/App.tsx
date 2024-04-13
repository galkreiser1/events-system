import "./App.css";
import "@mantine/core/styles.css";
import { Catalog } from "./components/catalog/catalog";
import { EventPage } from "./event-page/EventPage";
import React, { useState, useEffect, createContext, useContext } from "react";
import { SignUp } from "./signup/SignUp";
import { SignIn } from "./signin/SignIn";
import { Checkout } from "./checkout/Checkout";
import { UserSpace } from "./components/userspace/UserSpace";
import { EventForm } from "./components/eventform/eventform";
import { UserBar } from "./components/userbar/UserBar";
import { CouponForm } from "./components/couponform/couponform";
import { ErrorPage } from "./components/errorpage/errorpage";
import { orderDataType, successDataType } from "./types";
import { AuthApi } from "./api/authApi";
import { SuccessPage } from "./success_page/SuccessPage";

export interface sessionContextType {
  permission: string;
  setPermission: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  eventId: string;
  setEventId: React.Dispatch<React.SetStateAction<string>>;
  route: string;
  orderData: orderDataType;
  setOrderData: React.Dispatch<React.SetStateAction<orderDataType>>;
  successData: successDataType;
  setSuccessData: React.Dispatch<React.SetStateAction<successDataType>>;
  lockId: string;
  setLockId: React.Dispatch<React.SetStateAction<string>>;
}
export const sessionContext = React.createContext<sessionContextType | null>(
  null
);

export interface NavigationContextType {
  navigateTo: (newRoute: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => useContext(NavigationContext);

function App() {
  const [route, setRoute] = useState<string>("");
  const [permission, setPermission] = useState<string>("U");
  const [username, setUsername] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [lockId, setLockId] = useState<string>("");
  const [orderData, setOrderData] = useState<orderDataType>({
    event_id: "",
    event_title: "",
    ticket_type: "",
    quantity: 0,
    price: 0,
    ticket_index: undefined,
  });

  const [successData, setSuccessData] = useState<successDataType>({
    payment_id: "",
    event_title: "",
    ticket_type: "",
    quantity: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      let result: any = await AuthApi.getUserName();
      result = JSON.parse(result);
      if (typeof result === "number") {
        navigateTo("signin");
      } else {
        setPermission(result?.permission || "U");
        setUsername(result?.username || "");
        navigateTo("catalog");
      }
    };

    if (!username) {
      fetchData();
    }
  }, []);

  // useEffect(() => {
  //   window.addEventListener("popstate", () => {
  //     setRoute(window.location.pathname.split("/").pop() || "signin");

  //     console.log("URL changed:", window.location.href);
  //   });
  // }, []);

  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    // uncomment for URL pagename postfix
    // const componentPostfix = newRoute;
    // const currentPath = window.location.pathname;
    // const newPath = currentPath.replace(/\/[^/]*$/, `/${componentPostfix}`);
    // window.history.pushState({}, "", newPath);
  };
  const navigationValues: NavigationContextType = {
    navigateTo: navigateTo,
  };

  const sessionValues: sessionContextType = {
    permission,
    setPermission,
    username,
    setUsername,
    eventId,
    setEventId,
    route,
    orderData,
    setOrderData,
    successData,
    setSuccessData,
    lockId,
    setLockId,
  };

  return (
    <sessionContext.Provider value={sessionValues}>
      <NavigationContext.Provider value={navigationValues}>
        {route !== "signin" &&
          route !== "signup" &&
          route !== "error-page" &&
          route !== "success" &&
          username && <UserBar />}
        {route === "signin" && <SignIn />}
        {route === "signup" && <SignUp />}
        {route === "catalog" && <Catalog />}
        {route === "event-page" && <EventPage />}
        {route === "checkout" && <Checkout />}
        {route === "userspace" && <UserSpace />}
        {route === "eventform" && <EventForm />}
        {route === "couponform" && <CouponForm />}
        {route === "error-page" && <ErrorPage />}
        {route === "success" && <SuccessPage />}
      </NavigationContext.Provider>
    </sessionContext.Provider>
  );
}

export default App;
