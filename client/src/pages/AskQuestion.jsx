import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AskQuestion = () => {

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [question, setQuestion] = useState("");
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/doctor/allDoctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setDoctors(data.doctors);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc?.user_id?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {

    if (!doctorId || !question) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/questions/ask",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?._id,
            doctor: doctorId,
            question,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        const doc = doctors.find((d) => d._id === doctorId);
        const name = doc?.user_id?.name || "Doctor";

        setSuccessMsg(`✅ Sent successfully to ${name}`);

        setQuestion("");
        setDoctorId("");
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={container}>

      <h2 style={{ textAlign: "center" }}>
        ❓ Ask Doctor for Your Health
      </h2>

      <input
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      <div style={{ maxHeight: 320, overflowY: "auto" }}>

        {filteredDoctors.map((doc) => (

          <div
            key={doc._id}
            onClick={() => setDoctorId(doc._id)}
            style={{
              ...card,
              border: doctorId === doc._id ? "2px solid green" : "1px solid #ddd",
              background: doctorId === doc._id ? "#f0fdf4" : "#fff",
            }}
          >

            <img
              src={
                doc?.user_id?.img_path
                  ? `http://localhost:5000/upload/${doc.user_id.img_path}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              style={img}
              alt="doctor"
            />

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>
                 {doc?.user_id?.name}
              </h4>

              <p style={{ margin: 0, color: "#666" }}>
                {doc?.specialization}
              </p>

              <small style={{ color: "green" }}>
                ₹ {doc?.fees}
              </small>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${doc._id}`);
                }}
                style={btn}
              >
                💬 View Messages
              </button>

            </div>

          </div>

        ))}

      </div>

      <textarea
        placeholder="Write your health question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={textarea}
      />

      <button onClick={handleSubmit} style={submitBtn}>
        Submit Question
      </button>

      {successMsg && (
        <div style={successBox}>
          {successMsg}
        </div>
      )}

    </div>
  );
};

export default AskQuestion;

/*  STYLES  */

const container = {
  maxWidth: "700px",
  margin: "30px auto",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
};

const card = {
  display: "flex",
  gap: "10px",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "10px",
  cursor: "pointer",
};

const img = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
};

const textarea = {
  width: "100%",
  marginTop: "15px",
  padding: "10px",
};

const submitBtn = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  background: "green",
  color: "#fff",
  border: "none",
};

const btn = {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  marginLeft: "400px",  
}

const successBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#dcfce7",
  color: "green",
  borderRadius: "8px",
  textAlign: "center",
};