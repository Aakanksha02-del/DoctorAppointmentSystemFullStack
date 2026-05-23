import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar";
import AskQuestion from "./pages/AskQuestion";
import ChatPage from "./pages/ChatPage";
import DoctorQuestions from "./pages/DoctorQuestions";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<><Navbar /><Dashboard /></>}
          />
          <Route
            path="/doctors"
            element={<><Navbar /><Doctors /></>}
          />
          <Route
            path="/patients"
            element={<><Navbar /><Patients /></>}
          />
          <Route
            path="/appointments"
            element={<><Navbar /><Appointments /></>}
          />
          <Route
            path="/reports"
            element={<><Navbar /><Reports /></>}
          />
        </Route>
         
         
          <Route
            path="/ask-question" element={
              <>
                <Navbar />
                <AskQuestion />
              </>
            }
          />
         
  <Route
    path="/chat/:doctorId"
    element={<ChatPage />}
  />
      <Route
  path="/doctor-questions"
  element={<DoctorQuestions />}
/>

        <Route path="/" element={<Navigate to="/login" />} />
       
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;








