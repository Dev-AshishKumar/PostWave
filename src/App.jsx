import "./App.css";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import authServices from "./appwrite/auth";
import { login, logout } from "./store/authSlice.js";
import { Header, Footer } from "./components/index.js";
import { Toaster, toast } from "sonner";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authServices
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div className=" bg-[#02020E] text-gray-300">
      <div className="min-h-screen flex flex-col w-full ">
        <Header />
        <main>
          <Outlet />
        </main>
        <div className="fixed top-0 right-0 m-4">
          <Toaster />
        </div>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
