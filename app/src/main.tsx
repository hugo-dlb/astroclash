import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ToastContainer } from "./utils/toast.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
        <ToastContainer />
    </ChakraProvider>
);
