import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/index.ts";

const queryClient = new QueryClient({});
const persister = createSyncStoragePersister({
    storage: window.localStorage,
});
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store} stabilityCheck="never">
            <PersistGate loading={null} persistor={persistor}>
                <PersistQueryClientProvider
                    client={queryClient}
                    persistOptions={{ persister }}
                >
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </PersistQueryClientProvider>
            </PersistGate>
        </Provider>
    </StrictMode>
);
