import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import LoadingView from "./components/Loading/LoadingModal";
import PrivateRoute from "./components/Route/PrivateRoute";
import store, { persistor } from "./store";

const HomeView = lazy(() => import("./views/home/HomeView"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.Suspense fallback={<LoadingView open />}>
            <BrowserRouter>
              <ToastContainer />
              <LoadingView />
              <div className="container">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute guards={[]} element={<HomeView />} />
                    }
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </React.Suspense>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
