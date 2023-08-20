import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "./utils/toast";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
    <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
        <ToastContainer />
    </ChakraProvider>
);
