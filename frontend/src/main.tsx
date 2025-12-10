import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";

import store from "./redux-store/store.ts"; // Import the Redux store
import {Provider} from "react-redux"; // Import the Provider component

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* Wrap the app with Provider and pass the store */}
      <Router />
    </Provider>
  </StrictMode>
);
