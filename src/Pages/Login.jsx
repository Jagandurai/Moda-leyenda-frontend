// import { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// function Login() {
//   const [currentState, setCurrentState] = useState("Login");
//   const {
//     navigate,
//     backendURL,
//     setRefreshToken,
//     setAccessToken,
//     accessToken,
//   } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try {
//       if (currentState === "Sign Up") {
//         const response = await axios.post(
//           `${backendURL}/api/user/register`,
//           { name, email, password }
//         );

//         if (response.data.success) {
//           setAccessToken(response.data.accessToken);
//           setRefreshToken(response.data.refreshToken);

//           localStorage.setItem("accessToken", response.data.accessToken);
//           localStorage.setItem("refreshToken", response.data.refreshToken);

//           toast.success("Account created successfully");
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         const response = await axios.post(
//           `${backendURL}/api/user/login`,
//           { email, password }
//         );

//         if (response.data.success) {
//           toast.success("Login successful");
//           setAccessToken(response.data.accessToken);
//           localStorage.setItem("accessToken", response.data.accessToken);
//         }
//       }
//     } catch (error) {
//       // ✅ FIXED ERROR HANDLING
//       if (error.response && error.response.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Something went wrong. Please try again.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       navigate("/");
//     }
//   }, [accessToken, navigate]);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>

//       {currentState === "Sign Up" && (
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           type="text"
//           className="w-full px-3 py-2 border border-gray-800"
//           placeholder="Name"
//           required
//         />
//       )}

//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="E-mail"
//         required
//         autoComplete="email"
//       />

//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//         type="password"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Password"
//         required
//         autoComplete="current-password"
//       />

//       <div className="w-full flex justify-between text-sm mt-[-8px]">
//         <p className="cursor-pointer">Forgot Your Password?</p>
//         {currentState === "Login" ? (
//           <p
//             onClick={() => setCurrentState("Sign Up")}
//             className="cursor-pointer"
//           >
//             Create Account
//           </p>
//         ) : (
//           <p
//             onClick={() => setCurrentState("Login")}
//             className="cursor-pointer"
//           >
//             Login Here
//           </p>
//         )}
//       </div>

//       <button className="bg-black text-white font-light px-8 py-2 mt-4">
//         {currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// }

// export default Login;



import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [currentState, setCurrentState] = useState("Login");

  const {
    navigate,
    backendURL,
    setRefreshToken,
    setAccessToken,
    accessToken,
  } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  /* =========================
     GOOGLE LOGIN HANDLER
  ========================== */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/user/google-login`,
        { token: credentialResponse.credential }
      );

      if (response.data.success) {
        toast.success("Login successful");
        setAccessToken(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  /* =========================
     EMAIL / PASSWORD LOGIN
  ========================== */
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(
          `${backendURL}/api/user/register`,
          { name, email, password }
        );

        if (response.data.success) {
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);

          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          toast.success("Account created successfully");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${backendURL}/api/user/login`,
          { email, password }
        );

        if (response.data.success) {
          toast.success("Login successful");
          setAccessToken(response.data.accessToken);
          localStorage.setItem("accessToken", response.data.accessToken);
        }
      }
    } catch (error) {
      // ✅ CLEAN ERROR MESSAGE
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  /* =========================
     REDIRECT AFTER LOGIN
  ========================== */
  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* =========================
          GOOGLE LOGIN BUTTON
      ========================== */}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google Login Failed")}
        />
      </div>

      <div className="text-gray-400 text-sm">or</div>

      {currentState === "Sign Up" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="E-mail"
        required
        autoComplete="email"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        autoComplete="current-password"
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>

        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}

export default Login;
