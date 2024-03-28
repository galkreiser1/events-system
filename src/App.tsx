import "./App.css";
import "@mantine/core/styles.css";
// import { EventForm } from "./components/eventform/eventform";
import { Catalog } from "./components/catalog/catalog";
import { EventPage } from "./event-page/EventPage";
import React, { useState, useEffect, createContext, useContext } from "react";
import { SignUp } from "./signup/SignUp";
import { SignIn } from "./signin/SignIn";
import { Checkout } from "./checkout/Checkout";
// import { Catalog } from "./components/catalog/catalog";
// import { UserSpace } from "./components/userspace/UserSpace";
// import { SuccessPage } from "./success_page/SuccessPage";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

export interface sessionContextType {
  permission: string;
  setPermission: React.Dispatch<React.SetStateAction<string>>;
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
  const [route, setRoute] = useState("");
  const [permission, setPermission] = useState("U");

  useEffect(() => {
    setPermission("U");
  }, []);

  useEffect(() => {
    navigateTo(window.location.pathname.split("/").pop() || "signin");
  }, []);

  //TODO: dont let the user get to pages that need data from previous pages

  useEffect(() => {
    window.addEventListener("popstate", () => {
      setRoute(window.location.pathname.split("/").pop() || "signin");

      console.log("URL changed:", window.location.href);
    });
  }, []);

  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    const componentPostfix = newRoute;
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/\/[^/]*$/, `/${componentPostfix}`);
    window.history.pushState({}, "", newPath);
  };
  const navigationValues: NavigationContextType = {
    navigateTo: navigateTo,
  };

  const sessionValues: sessionContextType = {
    permission,
    setPermission,
  };

  //TODO: navigation through URL input

  return (
    <sessionContext.Provider value={sessionValues}>
      <NavigationContext.Provider value={navigationValues}>
        {route === "signin" && <SignIn />}
        {route === "signup" && <SignUp />}
        {route === "catalog" && <Catalog />}
        {route === "event-page" && <EventPage />}
        {route === "checkout" && <Checkout />}
      </NavigationContext.Provider>
    </sessionContext.Provider>
  );
}

export default App;
