import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 10,
        },
    },
});
const persister = createSyncStoragePersister({
    storage: window.localStorage,
});
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <App />
        </PersistQueryClientProvider>
    </StrictMode>
);
