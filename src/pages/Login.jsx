import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { Button, Input } from "../components/index";
import authServices from "../appwrite/auth";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authServices.login(data);
      if (session) {
        const currentUser = await authServices.getCurrentUser();
        if (currentUser) {
          dispatch(authLogin({ userData: currentUser }));
          navigate("/");
        } else {
          setError("Failed to retrieve user data. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Failed to login. Please check your credentials or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setValue("email", "guest@account.com");
    setValue("password", "guest123");
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-grand-hotel text-yellow-300 text-center mb-6">
          PostWave
        </h2>

        <h2 className="text-xl text-center mb-6">Login to your account</h2>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)}>
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center">
          Don&apos;t have any account?&nbsp;
          <Link className="text-yellow-300 hover:underline" to="/signup">
            Sign Up
          </Link>{" "}
          or{" "}
          <button className="text-yellow-300" onClick={handleGuestLogin}>
            Guest Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
