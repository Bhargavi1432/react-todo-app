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
    "Actions"
  ];

  const [rows, setRows] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    const res = await fetch("http://localhost:5000/subscriptions");
    const data = await res.json();

    const formatted = data.map((r) => ({
      ...r,
      isEditing: false,
      activationDate: r.activationDate
        ? new Date(r.activationDate * 1000).toISOString().split("T")[0]
        : "",
      creationDate: r.creationDate
        ? new Date(r.creationDate * 1000).toISOString().split("T")[0]
        : ""
    }));

    setRows(formatted);
  };

  // ➕ Add new row
  const addRow = () => {
    setRows([
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
        isEditing: true
      },
      ...rows
    ]);
  };

  // 📤 Upload file
  const uploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5000/upload-subscription-file", {
      method: "POST",
      body: formData
    });

    await loadSubscriptions();
    alert("File uploaded and data loaded ✅");
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // 💾 Save
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
      status: row.status
    };

    const res = await fetch("http://localhost:5000/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    const updated = [...rows];
    updated[index].id = data.id;
    updated[index].isEditing = false;
    setRows(updated);

    alert("Saved ✅");
  };

  // ✅ Update
  const updateRow = async (row, index) => {
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
      status: row.status
    };

    await fetch(`http://localhost:5000/subscriptions/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const updated = [...rows];
    updated[index].isEditing = false;
    setRows(updated);

    alert("Updated ✅");
  };

  // 🗑 Delete
  const deleteRow = async (id, index) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

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

      <h2 className="page-title">Subscriptions</h2>

      {/* Top actions */}
      <div className="table-actions">
        <button onClick={addRow}>➕ Add Row</button>

        <label className="upload-btn">
          📤 Upload File
          <input
            type="file"
            hidden
            accept=".xlsx,.xls,.pdf"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
        </label>
      </div>

      {/* Scroll wrapper */}
      <div className="table-scroll">
        <div className="data-row headings">
          {headings.map((h, i) => (
            <div key={i} className="data-cell">{h}</div>
          ))}
        </div>

        {rows.map((row, index) => (
          <div key={index} className="data-row">

            <div className="data-cell">{row.id ?? "NEW"}</div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.subscriptionId}
                onChange={(e) => handleChange(index, "subscriptionId", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.msisdn}
                onChange={(e) => handleChange(index, "msisdn", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.iccid}
                onChange={(e) => handleChange(index, "iccid", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.imsi}
                onChange={(e) => handleChange(index, "imsi", e.target.value)} />
            </div>

            <div className="data-cell">
              <input type="date" disabled={!row.isEditing} value={row.activationDate}
                onChange={(e) => handleChange(index, "activationDate", e.target.value)} />
            </div>

            <div className="data-cell">
              <input type="date" disabled={!row.isEditing} value={row.creationDate}
                onChange={(e) => handleChange(index, "creationDate", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.planName}
                onChange={(e) => handleChange(index, "planName", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.productType}
                onChange={(e) => handleChange(index, "productType", e.target.value)} />
            </div>

            <div className="data-cell">
              <input disabled={!row.isEditing} value={row.businessUnit}
                onChange={(e) => handleChange(index, "businessUnit", e.target.value)} />
            </div>

            <div className="data-cell">
              <select disabled={!row.isEditing} value={row.status}
                onChange={(e) => handleChange(index, "status", e.target.value)}>
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="data-cell action-cell">
              <button
                className="menu-btn"
                onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
              >
                ⋮
              </button>

              {openMenuIndex === index && (
                <div className="dropdown">
                  {!row.isEditing && (
                    <div onClick={() => {
                      const updated = [...rows];
                      updated[index].isEditing = true;
                      setRows(updated);
                      setOpenMenuIndex(null);
                    }}>
                      ✏️ Edit
                    </div>
                  )}

                  {row.isEditing && !row.id && (
                    <div onClick={() => saveRow(row, index)}>💾 Save</div>
                  )}

                  {row.isEditing && row.id && (
                    <div onClick={() => updateRow(row, index)}>✅ Update</div>
                  )}

                  {row.id && (
                    <div className="danger" onClick={() => deleteRow(row.id, index)}>
                      🗑 Delete
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
