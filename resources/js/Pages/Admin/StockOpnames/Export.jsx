import { useEffect, useState } from "react";

export default function ExportStockOpname() {
  const [data, setData] = useState([]);

  // AUTO DOWNLOAD
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "/admin/stock-opnames/export/download";
    document.body.appendChild(iframe);

    return () => document.body.removeChild(iframe);
  }, []);

  // FETCH DATA
  useEffect(() => {
    fetch("/api/stock-opnames/export")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Preview Export Stock Opname</h4>

        {/* FALLBACK BUTTON */}
        <a
          href="/admin/stock-opnames/export/download"
          className="btn btn-success"
        >
          <i className="bi bi-file-earmark-excel"></i> Download Excel
        </a>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-success">
            <tr>
              <th>No</th>
              <th>ID Opname</th>
              <th>Tanggal</th>
              <th>Nama Barang</th>
              <th>Physical Quantity</th>
              <th>System Quantity</th>
              <th>Quantity Difference</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const diff =
                row.physical_quantity - row.system_quantity;

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.opname_id}</td>
                  <td>{row.tanggal}</td>
                  <td>{row.nama_barang}</td>
                  <td>{row.physical_quantity}</td>
                  <td>{row.system_quantity}</td>
                  <td
                    className={
                      diff < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
