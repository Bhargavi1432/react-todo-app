import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import "./data.css";
import { useState, useEffect } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const emptyRow = {
  id: "",
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
  currentDate: Date.now(),
};

const toEpoch = (dateStr) =>
  dateStr ? new Date(dateStr).getTime() : "";

const fromEpoch = (epoch) =>
  epoch ? new Date(epoch).toLocaleString() : "";

export default function App() {
  const [rows, setRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  /* ✅ ✅ ✅ ONLY ADDITION — DO NOT REMOVE */
  useEffect(() => {
    const fetchSimData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-sim-data");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Failed to fetch SIM data", error);
      }
    };

    fetchSimData();
  }, []);
  /* ✅ ✅ ✅ END OF ADDITION */

  const addRow = () => {
    setRows([...rows, { ...emptyRow, id: rows.length + 1 }]);
    setEditingIndex(rows.length);
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] =
      field.includes("Date") ? toEpoch(value) : value;
    setRows(updated);
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const mapped = json.map((item, i) => ({
        id: item["Id"] || i + 1,
        subscriptionId: item["Subscription Id"] || "",
        msisdn: item["MSISDN"] || "",
        iccid: item["ICCID"] || "",
        imsi: item["IMSI"] || "",
        activationDate: toEpoch(item["Activation Date"]),
        creationDate: toEpoch(item["Subscriber Creation Date"]),
        planName: item["Subscriber Plan Name"] || "",
        productType: item["Product Type"] || "",
        businessUnit: item["Business Unit Name"] || "",
        status: item["Product Status"] || "",
        currentDate: Date.now(),
      }));

      setRows(mapped);
    }

    if (file.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = async function () {
        const pdf = await pdfjsLib.getDocument(reader.result).promise;
        const page = await pdf.getPage(1);
        const content = await page.getTextContent();

        const text = content.items.map((i) => i.str).join(" ");

        setRows([
          {
            ...emptyRow,
            id: 1,
            planName: text,
            currentDate: Date.now(),
          },
        ]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  /* ================= SAVE TO BACKEND ================= */
  const saveToDatabase = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/save-sim-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        }
      );

      const result = await response.json();
      alert(result.message || "Saved");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="container">
      <div className="toolbar">
        <button className="btn add" onClick={addRow}>
          + Add Row
        </button>

        <label className="btn upload">
          Upload Excel / PDF
          <input type="file" hidden onChange={handleFileUpload} />
        </label>

        <button className="btn save" onClick={saveToDatabase}>
          Save to Database
        </button>
      </div>

      <div className="table">
        <div className="table-header">
          {[
            "Id",
            "Subscription ID",
            "MSISDN",
            "ICCID",
            "IMSI",
            "Activation Date",
            "Creation Date",
            "Plan Name",
            "Product Type",
            "Business Unit",
            "Status",
            "Current Date",
            "Actions",
          ].map((h) => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>

        {rows.map((row, index) => (
          <div className="table-row card" key={index}>
            {Object.keys(emptyRow).map((field) => (
              <div className="td" key={field}>
                {editingIndex === index && field !== "currentDate" ? (
                  <input
                    type={field.includes("Date") ? "datetime-local" : "text"}
                    value={
                      field.includes("Date") && row[field]
                        ? new Date(row[field]).toISOString().slice(0, 16)
                        : row[field] || ""
                    }
                    onChange={(e) =>
                      handleChange(index, field, e.target.value)
                    }
                  />
                ) : field.includes("Date") ? (
                  fromEpoch(row[field])
                ) : (
                  row[field]
                )}
              </div>
            ))}

            <div className="td">
              <select
                onChange={(e) => {
                  if (e.target.value === "edit")
                    setEditingIndex(index);
                  if (e.target.value === "save")
                    setEditingIndex(null);
                  if (e.target.value === "delete")
                    deleteRow(index);
                }}
              >
                <option>Actions</option>
                <option value="edit">Edit</option>
                <option value="save">Update</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
