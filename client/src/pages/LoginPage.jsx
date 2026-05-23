import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authRedux/authSlice";
import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  dispatch(loginUser(form)).then((res) => {
    const payload = res?.payload;

    if (!payload) {
      console.log("No response from server");
      return;
    }

    if (payload?.token) {
      localStorage.setItem("token", payload.token);
    }

    if (payload?.user) {
      localStorage.setItem("user", JSON.stringify(payload.user));
    }

    if (payload?.token && payload?.user) {
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }

      navigate("/dashboard");
    } else {
      console.log("Login failed");
    }
  });
};


  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #662e47, #de5179)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="p-4 shadow-lg" style={{ borderRadius: "15px" }}>
              <h3 className="text-center mb-4 fw-bold">Login</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Login"}
                  </Button>
                </div>
              </Form>

              <p className="text-center mt-3">
                Don’t have an account?{" "}
                <span
                  style={{ color: "#667eea", cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </p>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;






