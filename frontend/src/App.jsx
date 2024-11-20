import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { BrowserRouter } from 'react-router-dom';

// User Routes
import { UserRegister } from "./pages/UserRegister";
import { UserLogin } from "./pages/UserLogin";


// Admin Routes
import { AdminLogin } from "./pages/Admin/AdminLogin";
import { DashBoard } from "./pages/Admin/DashBoard";
import { AdminProtectedRoute } from "./components/ProtectedRoutes/AdminProtectedRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userExist, userNotExist } from "./redux/features/userSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await axios.post("http://localhost:5000/api/v1/verify-token", {}, { withCredentials: true });
        const user = userResponse.data.data;
        dispatch(userExist(user));

      } catch (error) {
        dispatch(userNotExist());
      }
    }

    checkAuth();
  }, [dispatch])

  return (
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}>
      <Routes>
        {/* Home Screen */}
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        {/* User Registration and Login */}
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/userlogin" element={<UserLogin />} />

        {/* Admin Routes  */}
        {/* Admin Login  */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Admin Protected Routes for securing dashboard  */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
