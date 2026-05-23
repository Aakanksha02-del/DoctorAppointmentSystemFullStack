import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const role = user?.role;

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!role) return;

    fetchDoctors();
    fetchAppointments();

    if (role === "admin") {
      fetchPatients();
      fetchReports();
    }

    if (role === "doctor") {
      fetchReports();
    }

    if (role === "user") {
      fetchReports();
    }
  }, [role]);

  const fetchDoctors = async () => {
    const res = await fetch(
      "http://localhost:5000/doctor/appliedDoctors",
      { headers }
    );
    const data = await res.json();

    setDoctors(data?.doctors || []);
  };

  const fetchPatients = async () => {
    const res = await fetch(
      "http://localhost:5000/user/getAllUsers",
      { headers }
    );
    const data = await res.json();

    const onlyPatients = (data?.users || []).filter(
      (u) => u.role === "user"
    );

    setPatients(onlyPatients);
  };

const fetchAppointments = async () => {

  try {

    let url = "";

    if (role === "admin") {

      url = "http://localhost:5000/appoint/getAllAppointments";

    } else if (role === "doctor") {

      url = "http://localhost:5000/appoint/getAppointmentOfDoctor";

    } else {

      url = "http://localhost:5000/appoint/getAppointmentsByUser";
    }

    const res = await fetch(url, { headers });

    const data = await res.json();

    console.log("ROLE:", role)
    console.log("DATA:", data)

    setAppointments(data?.apps || []);

  } catch (err) {

    console.log(err);
  }
};

  const fetchReports = async () => {
    const res = await fetch(
      "http://localhost:5000/api/reports",
      { headers }
    );

    const data = await res.json();

   
    setReports(data?.reports || []);
  };

  return (
    <div className="dashboard">

      <div className="welcome">
        <h2>Welcome 👋 {user?.name}</h2>
        <p>Manage your system efficiently</p>
      </div>

      <div className="cards">

        {(role === "admin" || role === "user") && (
          <div className="card blue">
            <h3>Doctors</h3>
            <p>{doctors.length}</p>
          </div>
        )}

        {role === "admin" && (
          <div className="card green">
            <h3>Patients</h3>
            <p>{patients.length}</p>
          </div>
        )}

        <div className="card red">
          <h3>Appointments</h3>
          {/* <p>{appointments.length}</p> */}
          <p>{Array.isArray(appointments) ? appointments.length : 0}</p>
        </div>

        <div className="card purple">
          <h3>Reports</h3>
          <p>{reports.length}</p>
        </div>

      </div>

      <style>{`
        .dashboard{
          padding:20px;
          background:#f3f4f6;
          min-height:100vh;
        }

        .welcome{
          padding:20px;
          background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);
          color:#fff;
          border-radius:12px;
          margin-bottom:20px;
        }

        .cards{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:15px;
        }

        .card{
          padding:20px;
          border-radius:14px;
          color:white;
          transition:0.3s;
          cursor:pointer;
        }

        .card:hover{
          transform:translateY(-10px) scale(1.03);
          box-shadow:0 20px 40px rgba(0,0,0,0.3);
        }

        .blue{background:linear-gradient(135deg,#1e3c72,#2a5298)}
        .green{background:linear-gradient(135deg,#134e5e,#71b280)}
        .red{background:linear-gradient(135deg,#ff512f,#dd2476)}
        .purple{background:linear-gradient(135deg,#5f2c82,#49a09d)}
      `}</style>

    </div>
  );
};

export default Dashboard;










