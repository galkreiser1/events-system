import "./App.css";
//import { Catalog } from "./components/catalog/catalog";
import "@mantine/core/styles.css";
import React from "react";
import { useState } from "react";
import { SignIn } from "./signin/SignIn";

export interface sessionContextType {
  permission: number;
  setPermission: React.Dispatch<React.SetStateAction<number>>;
}
export const sessionContext = React.createContext<sessionContextType | null>(
  null
);

function App() {
  const [permission, setPermission] = useState(0);

  const providerValues: sessionContextType = {
    permission,
    setPermission,
  };

  return (
    <sessionContext.Provider value={providerValues}>
      <SignIn />
      {/* <Checkout /> */}
    </sessionContext.Provider>
  );
}

export default App;
