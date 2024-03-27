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
  permission: number;
  setPermission: React.Dispatch<React.SetStateAction<number>>;
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
  const [route, setRoute] = useState("signin");
  useEffect(() => {
    window.onpopstate = () => {
      setRoute(window.location.pathname);
    };
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

  //TODO: navigation through URL input

  return (
    <NavigationContext.Provider value={navigationValues}>
      {route === "signin" && <SignIn />}
      {route === "signup" && <SignUp />}
      {route === "catalog" && <Catalog />}
      {route === "event-page" && <EventPage />}
      {route === "checkout" && <Checkout />}
    </NavigationContext.Provider>
  );
}

export default App;
