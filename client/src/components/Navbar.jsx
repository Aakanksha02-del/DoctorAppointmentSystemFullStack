import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!token) return null;

  return (
    <>
      <div className="navbar">

        <div className="logo">🏥 DoctorApp</div>

        <div className="links">
          <Link to="/dashboard" className="link">Dashboard</Link>
          <Link to="/doctors" className="link">Doctors</Link>
          <Link to="/appointments" className="link">Appointments</Link>
          {user?.role === "admin" && (
          <Link to="/patients" className="link">Patients</Link>
          )}
          <Link to="/reports" className="link">Reports</Link>
       
           {user?.role === "user" && (
    <Link to="/ask-question" className="link">
      Ask Question
    </Link>
  )}

  {user?.role === "doctor" && (
    <Link to="/doctor-questions" className="link">
      Patient Questions
    </Link>
  )}
          </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <span>{user?.name}</span>

          <img
            src={
              user?.img_path
                ? `http://localhost:5000/upload/${user.img_path}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white"
            }}
          />

          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>

        </div>

      </div>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: linear-gradient(135deg,#0f172a,#1e293b);
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .logo {
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .links {
          display: flex;
          gap: 18px;
        }

        .link {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          padding: 6px 10px;
          border-radius: 6px;
          transition: 0.3s;
        }

        .link:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          transform: translateY(-2px);
        }

        .logoutBtn {
          background: linear-gradient(135deg,#ef4444,#dc2626);
          color: white;
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .logoutBtn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default Navbar;









