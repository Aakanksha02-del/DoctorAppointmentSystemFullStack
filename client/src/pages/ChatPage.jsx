import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { doctorId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [doctor, setDoctor] = useState({
    name: "Loading...",
    image:
      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  });

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setDoctor({
          name: data?.user_id?.name || "Doctor",
          ...data,     //aditional
          image:
            data?.user_id?.img_path
              ? `http://localhost:5000/upload/${data.user_id.img_path}`
              : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { ...data, seen: data.seen ?? false }]);
    });

    socket.on("incomingCall", (data) => setCall(data));

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("incomingCall");
      socket.off("callAccepted");
    };
  }, []);

  const isOnline = onlineUsers.includes(doctorId);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = {
      sender: user._id,
      // receiver: doctorId,
      receiver: doctor?.user_id?._id || doctorId,
      message: text,
      time: new Date().toLocaleTimeString(),
      seen: false,
    };

    socket.emit("sendMessage", msg);

    await fetch("http://localhost:5000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(msg),
    });

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const deleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const callUser = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(media);
    myVideo.current.srcObject = media;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: media,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: doctorId,
        signal: data,
        from: user._id,
      });
    });

    peer.on("stream", (remote) => {
      userVideo.current.srcObject = remote;
    });

    connectionRef.current = peer;
  };

  /* ACCEPT CALL  */
  const acceptCall = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(media);
    setCallAccepted(true);
    myVideo.current.srcObject = media;

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: media,
    });

    peer.on("signal", (data) => {
      socket.emit("acceptCall", {
        signal: data,
        to: call.from,
      });
    });

    peer.on("stream", (remote) => {
      userVideo.current.srcObject = remote;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  /* END CALL */
  const endCall = () => {
    connectionRef.current?.destroy();
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCall(null);
    setCallAccepted(false);
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        <div className="doctor-info">
          <img src={doctor.image} alt="doctor" />
          <div>
            <h3>{doctor.name}</h3>
            <small className={isOnline ? "online" : "offline"}>
              {isOnline ? "🟢 Online" : "⚪ Offline"}
            </small>
          </div>
        </div>

        <button className="call-btn" onClick={callUser}>
          📹 Call
        </button>
      </div>

      {call && !callAccepted && (
        <div className="call-popup">
          <h4>Incoming Call</h4>
          <button onClick={acceptCall}>Accept</button>
        </div>
      )}

      {stream && (
        <div className="video-box">
          <video ref={myVideo} autoPlay muted playsInline />
          <video ref={userVideo} autoPlay playsInline />

          <div className="end-call-wrapper">
            <button className="end-call-btn" onClick={endCall}>
              End Call
            </button>
          </div>
        </div>
      )}

      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.sender === user._id ? "me" : "other"
            }`}
          >
            <div className="bubble">{msg.message}</div>

            <div className="msg-info">
              <span>{msg.time}</span>

              <span>{msg.seen ? "✔✔ Seen" : "✔ Sent"}</span>

              {msg.sender === user._id && (
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(i)}
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
};

export default ChatPage;





