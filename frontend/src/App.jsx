import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    try {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        "http://localhost:5000/api/mails/upload-excel",
        formData
      );
      alert("✅ Emails imported successfully");
      setFile(null);
      fetchRecord();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload file");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleSendMails = async () => {
    try {
      setLoadingSend(true);
      await axios.post("http://localhost:5000/api/mails/send-mails");
      alert("✅ Mails sent successfully");
      fetchRecord();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send mails");
    } finally {
      setLoadingSend(false);
    }
  };

  const fetchRecord = async () => {
    try {
      setLoadingRecords(true);
      const res = await axios.get("http://localhost:5000/api/mails/record");
      setData(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to fetch records");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <>
      {/* Main Section */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-700">
            📧 Mail Sender
          </h2>

          {/* File Upload */}
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <button
            onClick={handleUpload}
            disabled={loadingUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mb-3 transition-all disabled:opacity-50"
          >
            {loadingUpload ? "Uploading..." : "Upload Excel"}
          </button>

          <button
            onClick={handleSendMails}
            disabled={loadingSend}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loadingSend ? "Sending..." : "Send Pending Mails"}
          </button>
        </div>
      </div>

      {/* Records Section */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">
          📋 Email Records
        </h3>

        {loadingRecords ? (
          <p className="text-gray-500">Loading records...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Opened</th>
                  <th className="px-6 py-3">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.email}</td>
                    <td
                      className={`px-6 py-4 ${
                        item.status === "SENT"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-6 py-4">
                      {item.opened ? (
                        <span className="text-green-600 font-semibold">
                          Opened ✅
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Opened</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
