import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authRedux/authSlice";
import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    gender: "",
    DOB: "",
    myFile: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "myFile") {
      setForm({ ...form, myFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("contactNumber", form.contactNumber);
    formData.append("gender", form.gender);
    formData.append("DOB", form.DOB);

    if (form.myFile) {
      formData.append("myFile", form.myFile);
    }

    dispatch(registerUser(formData)).then((res) => {
      const payload = res?.payload;

      if (payload?.success) {
        navigate("/login");
      } else {
        console.log("Register failed");
      }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="p-4 shadow-lg" style={{ borderRadius: "15px" }}>
              <h3 className="text-center mb-4 fw-bold">Create Account</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Control
                  className="mb-3"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                />

                <Form.Control
                  className="mb-3"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />

                <Form.Control
                  className="mb-3"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />

                <Form.Control
                  className="mb-3"
                  name="contactNumber"
                  placeholder="Phone"
                  onChange={handleChange}
                />

                <Form.Select
                  className="mb-3"
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </Form.Select>

                <Form.Control
                  className="mb-3"
                  type="date"
                  name="DOB"
                  onChange={handleChange}
                />

                <Form.Control
                  className="mb-3"
                  type="file"
                  name="myFile"
                  onChange={handleChange}
                />

                <div className="d-grid">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Register"}
                  </Button>
                </div>
              </Form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <span
                  style={{ color: "#667eea", cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;






