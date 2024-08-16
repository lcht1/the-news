import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({});
const persister = createSyncStoragePersister({
    storage: window.localStorage,
});
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistQueryClientProvider>
    </StrictMode>
);
