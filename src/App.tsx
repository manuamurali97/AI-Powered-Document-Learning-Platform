import React, { useEffect, useState } from "react";
import axios from "axios";

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/documents");
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  // Fetch full document
  const fetchFullDocument = async (id: string) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(
        `http://localhost:3000/documents/${id}/full`
      );
      setSelectedDoc(res.data);
    } catch (error) {
      console.error("Failed to fetch full document", error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    const interval = setInterval(() => {
      fetchDocuments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:3000/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Upload successful!");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Delete this document?")) return;

      await axios.delete(`http://localhost:3000/documents/${id}`);

      if (selectedId === id) {
        setSelectedDoc(null);
        setSelectedId(null);
      }

      fetchDocuments();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Delete failed");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") return "green";
    if (status === "PROCESSING") return "orange";
    if (status === "FAILED") return "red";
    return "blue";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>AI Document Learning Platform</h2>

      {/* Upload Section */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <br /><br />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <hr />

      {/* Document List */}
      <h3>Documents</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {documents.map((doc) => (
          <li
            key={doc.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background:
                selectedId === doc.id ? "#f0f8ff" : "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedId(doc.id);
                  fetchFullDocument(doc.id);
                }}
              >
                <strong>{doc.title}</strong>
                <br />
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: getStatusColor(doc.status),
                  }}
                >
                  {doc.status}
                </span>
              </div>

              <button
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(doc.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Loading State */}
      {detailLoading && (
        <div style={{ marginTop: "20px" }}>
          <p>Loading document details...</p>
        </div>
      )}

      {/* Document Details */}
      {!detailLoading && selectedDoc && (
        <div style={{ marginTop: "40px" }}>
          <h3>Document Details</h3>

          <p>
            <strong>Status: </strong>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "white",
                backgroundColor: getStatusColor(selectedDoc.status),
              }}
            >
              {selectedDoc.status}
            </span>
          </p>

          <h4>Summary</h4>
          {selectedDoc.summaries?.length > 0 ? (
            selectedDoc.summaries.map((s: any) => (
              <p key={s.id}>{s.content}</p>
            ))
          ) : (
            <p>No summary available</p>
          )}

          <h4>Questions</h4>
          {selectedDoc.questions?.length > 0 ? (
            <ul>
              {selectedDoc.questions.map((q: any) => (
                <li key={q.id}>{q.content}</li>
              ))}
            </ul>
          ) : (
            <p>No questions generated</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
