import { useEffect, useState } from "react";

function Appointments() {

  const [appointments, setAppointments] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (
    appID,
    status
  ) => {

    try {

      const res = await fetch(
        `http://localhost:5000/appoint/statusUpdate/${appID}`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAppointments();
      }

    } catch (err) {

      console.log(err);
    }
  };

  const createReport = async (
    patientID
  ) => {

    const diagnosis = prompt(
      "Enter Diagnosis"
    );

    const description = prompt(
      "Enter Description"
    );

    if (!diagnosis || !description)
      return;

    try {

      const res = await fetch(
        "http://localhost:5000/api/reports/create",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            user_id: patientID,

            doctor_id:
              user._id || user.id,

            doctorName: user.name,

            diagnosis,

            description,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        alert("✅ Report Created");

      } else {

        alert(data.msg);
      }

    } catch (err) {

      console.log(err);
    }
  };

  const fetchAppointments =
    async () => {

      let url = "";

      if (user.role === "admin") {

        url =
          "http://localhost:5000/appoint/getAllAppointments";

      } else if (
        user.role === "doctor"
      ) {

        url =
          "http://localhost:5000/appoint/getAppointmentOfDoctor";

      } else {

        url =
          "http://localhost:5000/appoint/getAppointmentsByUser";
      }

      const res = await fetch(url, {
        headers,
      });

      const data = await res.json();

      setAppointments(data?.apps || []);
    };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Appointments</h2>

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >

        <thead>

          <tr>

            {user.role !== "user" && (
              <th>Patient</th>
            )}

            {/* USER + ADMIN */}
            {(user.role === "user" ||
              user.role === "admin") && (
              <th>Doctor</th>
            )}

            <th>Status</th>

            <th>Payment</th>

            <th>Fees</th>

            <th>Date</th>

            <th>Time</th>

            {user.role === "doctor" && (
              <th>Action</th>
            )}

          </tr>

        </thead>

        <tbody>

          {appointments.length > 0 ? (

            appointments.map((a, i) => (

              <tr key={i}>

                {user.role !== "user" && (
                  <td>
                    {a?.user_id?.name ||
                      "N/A"}
                  </td>
                )}

                {(user.role === "user" ||
                  user.role === "admin") && (
                  <td>
                    {a?.doctor_id?.user_id
                      ?.name || "N/A"}
                  </td>
                )}

                <td>
                  {a?.status}
                </td>

                <td>
                  {a?.payment_status}
                </td>

                <td>
                  ₹{a?.fees}
                </td>

                <td>
                  {a?.date}
                </td>

                <td>
                  {a?.time}
                </td>

                {user.role === "doctor" && (

                  <td>

                    <button
                      onClick={() =>
                        updateStatus(
                          a._id,
                          "confirmed"
                        )
                      }

                      style={{
                        background:
                          "green",

                        color: "white",

                        border: "none",

                        padding:
                          "5px 10px",

                        marginRight:
                          "5px",

                        cursor: "pointer",
                      }}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          a._id,
                          "rejected"
                        )
                      }

                      style={{
                        background:
                          "red",

                        color: "white",

                        border: "none",

                        padding:
                          "5px 10px",

                        marginRight:
                          "5px",

                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        createReport(

                          typeof a?.user_id ===
                            "object"

                            ? a.user_id._id

                            : a.user_id
                        )
                      }

                      style={{
                        background:
                          "#2563eb",

                        color: "white",

                        border: "none",

                        padding:
                          "5px 10px",

                        cursor: "pointer",
                      }}
                    >
                      Create Report
                    </button>

                  </td>
                )}

              </tr>
            ))

          ) : (

            <tr>

              <td
                colSpan={
                  user.role === "doctor"
                    ? 8
                    : user.role ===
                      "admin"
                    ? 7
                    : 6
                }

                align="center"
              >
                No Appointments Found
              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Appointments;




