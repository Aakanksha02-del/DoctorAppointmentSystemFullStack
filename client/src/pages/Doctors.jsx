import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Doctors = () => {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

 
  const [paymentLoading, setPaymentLoading] = useState(false);

  
  const [showPayment, setShowPayment] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // FETCH
  const fetchDoctors = async () => {

    try {
      const res = await fetch(
        "http://localhost:5000/doctor/appliedDoctors",
        { headers }
      );

      const data = await res.json();
      setDoctors(data?.doctors || []);

    } catch (err) {
      console.log(err);
    }
  };

  //  CHAT 
  const openChat = (doc) => {
    navigate("/chat", {
      state: {
        receiverId: doc?.user_id?._id
      }
    });
  };

  // BOOK 
  const bookAppointment = async (doc) => {

    const date = prompt("Enter Date YYYY-MM-DD");
    const time = prompt("Enter Time");

    if (!date || !time) return;

    setSelectedDoctor(doc);
    setSelectedDate(date);
    setSelectedTime(time);
    setShowPayment(true);
  };

  //  PAY NOW
  const payNow = async () => {

    setPaymentLoading(true);

    setTimeout(async () => {

      setPaymentLoading(false);
      toast.success("Payment Successful");

      try {

        const res = await fetch(
          "http://localhost:5000/appoint/createAppointment",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              doctor_id: selectedDoctor._id,
              date: selectedDate,
              time: selectedTime,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          toast.success("Appointment Booked");
          setShowPayment(false);
        } else {
          toast.error(data.msg);
        }

      } catch (err) {
        console.log(err);
      }

    }, 2000);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Doctors</h2>

      <div style={container}>

        {doctors.length > 0 ? (

          doctors.map((doc) => (

            <div key={doc._id} style={card} className="cardHover">

              <img
                src={
                  doc?.user_id?.img_path
                    ? `http://localhost:5000/upload/${doc.user_id.img_path}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt=""
                style={img}
              />

              <h3>{doc?.user_id?.name}</h3>
              <p>{doc?.specialization}</p>
              <p>₹ {doc?.fees || 500}</p>

              
              {user?.role === "user" && (
                <button style={btn} onClick={() => bookAppointment(doc)}>
                  Book Appointment
                </button>
              )}
             </div>

          ))

        ) : (
          <p>No Doctors Found</p>
        )}

      </div>

      {/* PAYMENT MODAL (UNCHANGED) */}
      {showPayment && (
        <div style={overlayStyle}>
          <div style={modalStyle}>

            <h2>Scan & Pay</h2>

            <img
              src={"https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=hospital@upi"}
              alt="QR Code"
              style={{ width: "220px", marginBottom: "10px" }}
            />

            <p>hospital@upi</p>

            <h3>₹{selectedDoctor?.fees || 500}</h3>

            <button style={payBtn} onClick={payNow}>
              {paymentLoading ? "Processing..." : "Pay Now"}
            </button>

            <button
              style={closeBtn}
              onClick={() => setShowPayment(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      <style>{`
        .cardHover{
          transition:0.3s;
        }
        .cardHover:hover{
          transform:translateY(-10px);
          box-shadow:0 20px 40px rgba(0,0,0,0.3);
        }
      `}</style>

    </div>
  );
};

export default Doctors;

// CSS

const container = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
};

const card = {
  width: "220px",
  padding: "20px",
  borderRadius: "14px",
  textAlign: "center",
  background: "linear-gradient(135deg,#667eea,#764ba2)",
  color: "#fff",
};

const img = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
};

const btn = {
  marginTop: "10px",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  textAlign: "center",
  width: "320px",
};

const payBtn = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};

const closeBtn = {
  width: "100%",
  padding: "12px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};






