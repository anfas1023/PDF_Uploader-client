import React, { useContext, useEffect, useState } from "react";
import bgImage from '../../assets/5040007.jpg';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
import { toast } from "sonner"
import {AuthContext} from '../../context/AuthContext'
import 'react-toastify/dist/ReactToastify.css';
const LoginPage: React.FC = () => {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const userData=useContext(AuthContext);

  useEffect(()=>{
    console.log("userData?.user",userData?.user);
    if(userData?.user){
      console.log("jkjkllllllllllllllllllllllll");
      
      navigate('/dashboard')
    }
  },[userData?.user]);
  const handleSubmit = async(e: React.FormEvent) => {
   
    e.preventDefault();
    // Handle sign-up logic here
    if ( !email || !password ) {
      console.error("All fields are required");
      // toast.error("All fields are required", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   theme: "colored",
      // });

      toast.warning("All fields are required",{"position":"top-left"})
      return; // Stop further execution
    }

    try {

      let data={
        email,
        password
      }
      const response=await axios.post(`http://localhost:3000/user/login`,data,{
        withCredentials:true
      });
      console.log(response);
      
      if (response.data) {
        localStorage.setItem("userId",response.data.userId.id)
        // localStorage.setItem("email",response.data.user.email)
        // localStorage.setItem("username",response.data.user.username)

        // toast.success("Login successful!", {
        //   position: "top-right",
        //   autoClose: 3000,  
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "colored",
        // });


        toast.success("Login sucessfully",{"position":"top-left"})

        userData?.setUser(response.data.userId.id);

       setTimeout(()=>{
        navigate("/dashboard");
       },3000)
      } else {
        alert("Login failed, please check your credentials");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
     
          // Server responded with a status other than 200 range
          console.error("Error response:", error.response.data.message || error.response.statusText);
          // toast.error(`Error: ${error.response.data.message || "Something went wrong!"}`, {
          //   position: "top-right",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   theme: "colored",
          // });

        toast.error(error.response.data.message,{"position":"top-left"})

      }
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-950 ">
    {/* Background Image Container */}
    {/* <ToastContainer /> */}
    <div
      className="flex-1 bg-cover bg-center hidden lg:block"
      style={{ backgroundImage: `url(${bgImage})` }}
    />
    {/* Sign-Up Form Container */}
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-lg p-8 bg- rounded-lg shadow-lg opacity-90">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-1 text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
         
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-1 text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
         
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
   
  </div>
  );
};

export default LoginPage;
