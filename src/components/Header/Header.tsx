import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner"

const Header: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const userData = React.useContext(AuthContext);

  const handleLogout = async () => {
    console.log("Logging out...");

    try {
      const response = await axios.post(
        "http://localhost:3000/user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Trigger toast success
        // toast.success("Logout successful!", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "colored",
        // });


        toast.success("Logout sucessfully",{"position":"top-left"})

        // Clear local storage and redirect
        localStorage.clear();
        userData?.setUser(null);
        setTimeout(() => {
          navigate("/login");
        }, 3000);

        console.log("Logout successfully", response.data.message);
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error in Axios request:",
          error.response?.data || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }

      // Show error toast
      // toast.error("Logout failed!", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
    }
  };

  return (
    <>
      <div className="bg-slate-900">
        <div className="container p-2 mx-auto">
          <nav className="py-5 flex items-center justify-between">
            <div className="text-base text-white">PDF Uploader</div>
            <button
              onClick={handleLogout}
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </nav>
        </div>
        {/* ToastContainer for displaying notifications */}
        {/* <ToastContainer /> */}
      </div>
    </>
  );
};

export default Header;
