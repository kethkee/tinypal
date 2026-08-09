import { Routes, Route } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import VerifyEmail from "./pages/VerifyEmail";
import CheckEmail from "./pages/CheckEmail";

function App() {
  return (
    <>
      <AppRouter />
      <Routes>
        <Route
          path="/verify-email/:userId/:token"
          element={<VerifyEmail />}
        />
        <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </>
  );
}

<Route
  path="/check-email"
  element={<CheckEmail />}
/>
export default App; 