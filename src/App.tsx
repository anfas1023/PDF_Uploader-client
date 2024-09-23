import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Pdfcontainer from "./components/PdfComponent/PdfContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PdfComp from "./PdfComp";
import SignInPage from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import AuthUserContext, { AuthContext } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
function App() {
  return (
  
<div className="flex flex-col min-h-screen">
<Toaster />
  <AuthUserContext >
  <Router>
    <Header /> 
    <div className="flex-grow">
      <Routes>
        <Route path="/dashboard" element={
          <Pdfcontainer />} 
          />
        <Route path="/show" element={<PdfComp />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    <Footer /> 
  </Router>
  </AuthUserContext>
</div>

  );
}

export default App;
