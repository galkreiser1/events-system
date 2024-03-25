import "./App.css";
import "@mantine/core/styles.css";
import React from "react";
import { useState } from "react";
// import { EventForm } from "./components/eventform/eventform";
// import { Catalog } from "./components/catalog/catalog";
// import { UserSpace } from "./components/userspace/UserSpace";
// import { SuccessPage } from "./success_page/SuccessPage";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EventPage } from "./event-page/EventPage";

export interface sessionContextType {
  permission: number;
  setPermission: React.Dispatch<React.SetStateAction<number>>;
}
export const sessionContext = React.createContext<sessionContextType | null>(
  null
);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Catalog />,
//   },
//   {
//     path: "/user",
//     element: <UserSpace />,
//   },
//   {
//     path: "/eventform",
//     element: <EventForm />,
//   },
//   {
//     path: "/success",
//     element: <SuccessPage />,
//   },
// ]);

function App() {
  const [permission, setPermission] = useState(0);

  const providerValues: sessionContextType = {
    permission,
    setPermission,
  };

  return (
    <sessionContext.Provider value={providerValues}>
      {/* <RouterProvider router={router}> */}
      <EventPage />
    </sessionContext.Provider>
  );
}

export default App;
