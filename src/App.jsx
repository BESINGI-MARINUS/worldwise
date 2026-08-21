import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// import ProductPage from "./pages/ProductPage";
// import PricingPage from "./pages/PricingPage";
// import Homepage from "./pages/Homepage";
// import AppPage from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { CitiesProvider } from "./contexts/CitiesProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import { lazy, Suspense } from "react";

const ProductPage = lazy(() => import("./pages/ProductPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const Homepage = lazy(() => import("./pages/HomePage"));
const AppPage = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <BrowserRouter>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;

// vite v4.5.14 building for production...
// ✓ 446 modules transformed.
// dist/index.html                   0.48 kB │ gzip:   0.31 kB
// dist/assets/index-a2b2dd58.css   31.38 kB │ gzip:   5.22 kB
// dist/assets/index-98b59892.js   536.66 kB │ gzip: 157.31 kB
