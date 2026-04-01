import { useState, useEffect } from "react";
import "./data.css";

export default function Data() {
  const headings = [
    "ID",
    "Subscription Id",
    "MSISDN",
    "ICCID",
    "IMSI",
    "Activation Date",
    "Subscriber Creation Date",
    "Subscriber Plan Name",
    "Product Type",
    "Business Unit Name",
    "Product Status",
    "Upload Files",
    "Actions"
  ];

  const [rows, setRows] = useState([]);

  // Load data
  useEffect(() => {
    fetch("http://localhost:5000/subscriptions")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(r => ({
          ...r,
          activationDate: r.activationDate
            ? new Date(r.activationDate * 1000).toISOString().split("T")[0]
            : "",
          creationDate: r.creationDate
            ? new Date(r.creationDate * 1000).toISOString().split("T")[0]
            : "",
          file: null
        }));
        setRows(formatted);
      });
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        subscriptionId: "",
        msisdn: "",
        iccid: "",
        imsi: "",
        activationDate: "",
        creationDate: "",
        planName: "",
        productType: "",
        businessUnit: "",
        status: "",
        file: null
      }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // SAVE
  const saveRow = async (row, index) => {
    const payload = {
      subscriptionId: row.subscriptionId,
      msisdn: row.msisdn,
      iccid: row.iccid,
      imsi: row.imsi,
      activationDate: row.activationDate
        ? Math.floor(new Date(row.activationDate).getTime() / 1000)
        : null,
      creationDate: row.creationDate
        ? Math.floor(new Date(row.creationDate).getTime() / 1000)
        : null,
      planName: row.planName,
      productType: row.productType,
      businessUnit: row.businessUnit,
      status: row.status,
      file: row.file ? row.file.name : null
    };

    const res = await fetch("http://localhost:5000/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const updated = [...rows];
    updated[index].id = data.id;
    setRows(updated);

    alert("Saved ✅");
  };

  // UPDATE
  const updateRow = async (row) => {
    const payload = {
      subscriptionId: row.subscriptionId,
      msisdn: row.msisdn,
      iccid: row.iccid,
      imsi: row.imsi,
      activationDate: row.activationDate
        ? Math.floor(new Date(row.activationDate).getTime() / 1000)
        : null,
      creationDate: row.creationDate
        ? Math.floor(new Date(row.creationDate).getTime() / 1000)
        : null,
      planName: row.planName,
      productType: row.productType,
      businessUnit: row.businessUnit,
      status: row.status,
      file: row.file ? row.file.name : null
    };

    await fetch(`http://localhost:5000/subscriptions/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Updated ✅");
  };

  // 🗑 DELETE
  const deleteRow = async (id, index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/subscriptions/${id}`, {
      method: "DELETE"
    });

    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);

    alert("Deleted ✅");
  };

  return (
    <div className="data-container">
      <div className="data-row headings">
        {headings.map((h, i) => (
          <div key={i} className="data-cell">{h}</div>
        ))}
      </div>

      {rows.map((row, index) => (
        <div key={index} className="data-row">
          <div className="data-cell">{row.id ?? "NEW"}</div>

          <div className="data-cell">
            <input value={row.subscriptionId}
              onChange={e => handleChange(index, "subscriptionId", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.msisdn}
              onChange={e => handleChange(index, "msisdn", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.iccid}
              onChange={e => handleChange(index, "iccid", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.imsi}
              onChange={e => handleChange(index, "imsi", e.target.value)} />
          </div>

          <div className="data-cell">
            <input type="date" value={row.activationDate}
              onChange={e => handleChange(index, "activationDate", e.target.value)} />
          </div>

          <div className="data-cell">
            <input type="date" value={row.creationDate}
              onChange={e => handleChange(index, "creationDate", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.planName}
              onChange={e => handleChange(index, "planName", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.productType}
              onChange={e => handleChange(index, "productType", e.target.value)} />
          </div>

          <div className="data-cell">
            <input value={row.businessUnit}
              onChange={e => handleChange(index, "businessUnit", e.target.value)} />
          </div>

          <div className="data-cell">
            <select value={row.status}
              onChange={e => handleChange(index, "status", e.target.value)}>
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="data-cell">
            <input type="file"
              onChange={e => handleChange(index, "file", e.target.files[0])} />
          </div>

          <div className="data-cell">
            {!row.id ? (
              <button onClick={() => saveRow(row, index)}>Save</button>
            ) : (
              <>
                <button onClick={() => updateRow(row)}>Update</button>
                <button
                  style={{ backgroundColor: "#d83b01" }}
                  onClick={() => deleteRow(row.id, index)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <button className="add-row" onClick={addRow}>
        ➕ Add Row
      </button>
    </div>
  );
}
