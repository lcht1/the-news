import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
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
