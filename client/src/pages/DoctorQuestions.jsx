import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const DoctorQuestions = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  const [patients, setPatients] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  

  useEffect(() => {

    if (!user?._id) return;

    socket.emit("join", user._id);

    const receiveHandler = (msg) => {

      if (
        selectedUser &&
        (
          msg.sender === selectedUser._id ||
          msg.receiver === selectedUser._id
        )
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", receiveHandler);

    socket.on("incomingCall", (data) => {
      setCall(data);
    });

    socket.on("callAccepted", (signal) => {

      console.log("CALL ACCEPTED");

      setCallAccepted(true);

      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    socket.on("callEnded", () => {
      leaveCall();
    });

    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callEnded");
    };

  }, [selectedUser]);

  /* FETCH PATIENTS  */

  useEffect(() => {

    const fetchPatients = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/message/patients/${user._id}`
        );

        const data = await res.json();

        setPatients(data || []);

      } catch (err) {
        console.log(err);
      }
    };

    if (user?._id) {
      fetchPatients();
    }

  }, [user?._id]);

  /*  OPEN CHAT */

  const openChat = async (patient) => {

    try {

      setSelectedUser(patient);

      const res = await fetch(
        `http://localhost:5000/message/${user._id}/${patient._id}`
      );

      const data = await res.json();

      setMessages(data || []);

    } catch (err) {
      console.log(err);
    }
  };

  /*  SEND MESSAGE*/

  const sendMessage = async () => {

    try {

      if (!text.trim() || !selectedUser) return;

      const msg = {
        sender: user._id,
        receiver: selectedUser._id,
        message: text,
        time: new Date().toLocaleTimeString(),
        seen: false,
      };

      setMessages((prev) => [...prev, msg]);

      socket.emit("sendMessage", msg);

      await fetch("http://localhost:5000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(msg),
      });

      setText("");

    } catch (err) {
      console.log(err);
    }
  };

  /* DELETE MESSAGE */

  const deleteMessage = (index) => {

    const updated = [...messages];

    updated.splice(index, 1);

    setMessages(updated);
  };

  /* VIDEO CALL  */

  const callUser = async () => {

    try {

      const currentStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(currentStream);

      myVideo.current.srcObject = currentStream;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: currentStream,
      });

      peer.on("signal", (data) => {

        socket.emit("callUser", {
          userToCall: selectedUser._id,
          signalData: data,
          from: user._id,
        });
      });

      peer.on("stream", (remoteStream) => {

        userVideo.current.srcObject =
          remoteStream;
      });

      connectionRef.current = peer;

    } catch (err) {
      console.log(err);
    }
  };

  /* ACCEPT CALL */

  const acceptCall = async () => {

    try {

      setCallAccepted(true);

      const currentStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(currentStream);

      myVideo.current.srcObject = currentStream;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream,
      });

      peer.on("signal", (data) => {

        socket.emit("acceptCall", {
          signal: data,
          to: call.from,
        });
      });

      peer.on("stream", (remoteStream) => {

        userVideo.current.srcObject =
          remoteStream;
      });

      peer.signal(call.signal);

      connectionRef.current = peer;

    } catch (err) {
      console.log(err);
    }
  };

  /* END CALL */

  const leaveCall = () => {

    if (stream) {
      stream.getTracks().forEach((track) =>
        track.stop()
      );
    }

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    socket.emit("endCall", {
      to: selectedUser._id,
    });

    setCallAccepted(false);
    setStream(null);
    setCall(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f5f7fb",
      }}
    >

    

      <div
        style={{
          width: "320px",
          borderRight: "1px solid #ddd",
          background: "white",
          overflowY: "auto",
        }}
      >

        <h2
          style={{
            padding: 15,
            background: "#0d6efd",
            color: "white",
            margin: 0,
          }}
        >
          Patients
        </h2>

        {patients.length === 0 && (
          <p style={{ padding: 15 }}>
            No patients yet
          </p>
        )}

        {patients.map((p) => (

          <div
            key={p._id}
            onClick={() => openChat(p)}
            style={{
              padding: 15,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background:
                selectedUser?._id === p._id
                  ? "#e7f1ff"
                  : "white",
            }}
          >

            <h4 style={{ margin: 0 }}>
              {p.name}
            </h4>

            <small>{p.email}</small>

          </div>
        ))}
      </div>

      

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {!selectedUser ? (

          <div
            style={{
              padding: 30,
              fontSize: 20,
              color: "gray",
            }}
          >
            Select patient to start chat
          </div>

        ) : (

          <>
           

            <div
              style={{
                padding: 15,
                background: "#0d6efd",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >

                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setMessages([]);
                  }}
                  style={{
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>

                <h3 style={{ margin: 0 }}>
                  {selectedUser.name}
                </h3>

              </div>

              {!callAccepted || !stream ? (

                <button
                  onClick={callUser}
                  style={{
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  📹 Video Call
                </button>

              ) : (

                <button
                  onClick={leaveCall}
                  style={{
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: 10,
                    background: "red",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  End Call
                </button>
                

              )}
            </div>

           

            {call && !callAccepted && (

              <div
                style={{
                  padding: 15,
                  background: "#fff3cd",
                }}
              >

                <h4>Incoming Call...</h4>

                <button
                  onClick={acceptCall}
                  style={{
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>

              </div>
            )}

        

            {stream && (

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 10,
                  background: "#ddd",
                }}
              >

                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{
                    width: "500px",
                    borderRadius: 10,
                  }}
                />

                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{
                    width: "200px",
                    borderRadius: 10,
                  }}
                />

              </div>
            )}

           

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 15,
              }}
            >

              {messages.map((m, i) => (

                <div
                  key={i}
                  style={{
                    marginBottom: 15,
                    textAlign:
                      m.sender === user._id
                        ? "right"
                        : "left",
                  }}
                >

                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 15px",
                      borderRadius: 15,
                      background:
                        m.sender === user._id
                          ? "#0d6efd"
                          : "white",
                      color:
                        m.sender === user._id
                          ? "white"
                          : "black",
                      maxWidth: "70%",
                    }}
                  >

                    <div>
                      {m.message}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        marginTop: 5,
                        opacity: 0.8,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >

                      <span>
                        {m.time}
                      </span>

                      <span>
                        {m.sender === user._id
                          ? m.seen
                            ? "✔✔"
                            : "✔"
                          : ""}
                      </span>

                    </div>

                  </div>

                  {m.sender === user._id && (

                    <div>

                      <button
                        onClick={() => deleteMessage(i)}
                        style={{
                          marginTop: 5,
                          border: "none",
                          background: "transparent",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>

                    </div>
                  )}

                </div>
              ))}
            </div>

          

            <div
              style={{
                display: "flex",
                padding: 15,
                background: "white",
                borderTop: "1px solid #ddd",
              }}
            >

              <input
                type="text"
                placeholder="Type message..."
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />

              <button
                onClick={sendMessage}
                style={{
                  marginLeft: 10,
                  padding: "12px 20px",
                  background: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                Send
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorQuestions;