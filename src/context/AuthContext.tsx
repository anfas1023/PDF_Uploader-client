import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type AuthUser = {
  userId: string;
};

type UserContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

type userContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<UserContextType | null>(null);
const AuthUserContext: React.FunctionComponent<userContextProviderProps> = ({
  children,
}) => {
  // const navigate=useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null);
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/status", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data.id);
        console.log(user);

        // console.log("user token onde", user);
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
    }
  };
  //   console.log("hereererer");

  useEffect(() => {
    fetchUser();
  }, [user, setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthUserContext;
