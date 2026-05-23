import { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  //  FETCH REPORTS 
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (data?.success) {
        setReports(data.reports || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        {user?.role === "admin"
          ? "All Reports"
          : "My Reports"}
      </h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            {user?.role === "admin" && (
              <>
                <th>Patient</th>
                <th>Doctor</th>
              </>
            )}

            {user?.role === "user" && <th>Doctor</th>}
            {user?.role === "doctor" && <th>Patient</th>}

            <th>Diagnosis</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r._id}>
               
                {user?.role === "admin" && (
                  <>
                    <td>{r?.user_id?.name || "N/A"}</td>

                    <td>
                      {r?.doctor_id?.user_id?.name
                        ? ` ${r.doctor_id.user_id.name}`
                        : "N/A"}
                    </td>
                  </>
                )}

                
                {user?.role === "user" && (
                  <td>
                    {r?.doctor_id?.user_id?.name
                      ? ` ${r.doctor_id.user_id.name}`
                      : "N/A"}
                  </td>
                )}

                
                {user?.role === "doctor" && (
                  <td>{r?.user_id?.name || "N/A"}</td>
                )}

                <td>{r?.diagnosis || "-"}</td>

                <td style={{ maxWidth: "300px" }}>
                  {r?.description || "-"}
                </td>

                <td>
                  {r?.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} align="center">
                No Reports Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        table {
          border-collapse: collapse;
        }

        th {
          text-align: left;
          background: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default Reports;



