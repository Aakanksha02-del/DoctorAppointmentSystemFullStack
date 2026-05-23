import { useEffect, useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/user/getAllUsers",
        { headers }
      );

      const data = await res.json();

      console.log("ALL USERS ", data);

      const onlyPatients = (data?.users || []).filter(
        (u) =>
          u.role === "user" &&
          !u.name?.toLowerCase().includes("dr")
      );

      setPatients(onlyPatients);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      <div style={styles.left}>
        <h1 style={styles.title}>CarePlus Hospital</h1>

        <p style={styles.desc}>
          We provide compassionate healthcare with modern technology and
          experienced doctors. Your health is our priority.
        </p>

        <div style={styles.info}>
          <p>📍 Pune, Maharashtra</p>
          <p>📞 +91 98765 43210</p>
          <p>⏰ 24/7 Emergency</p>
        </div>

        <div style={styles.totalBox}>
          <h3>Total Patients</h3>
          <p>{filteredPatients.length}</p>
        </div>
      </div>

      <div style={styles.right}>
        <h2>Patients List</h2>

        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p, i) => (
                <tr key={i}>
                  <td>{p?.name}</td>
                  <td>{p?.email}</td>
                  <td>{p?.contactNumber || p?.phone || "Not Provided"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Patients Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;

/*  CSS */

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  left: {
    flex: 1,
    background: "linear-gradient(135deg, #010913, #06b6d4)",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
  },

  right: {
    flex: 2,
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
  },

  title: {
    fontSize: "26px",
    marginBottom: "10px",
  },

  desc: {
    opacity: 0.9,
    marginBottom: "20px",
  },

  info: {
    marginBottom: "20px",
    lineHeight: "1.8",
  },

  totalBox: {
    background: "rgba(255,255,255,0.2)",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
  },

  search: {
    width: "100%",
    padding: "10px",
    margin: "10px 0 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};