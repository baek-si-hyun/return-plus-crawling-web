// src/components/HistoryItem.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteDownloadRecord } from "../../redux/historySlice";

function HistoryItem({ record }) {
  const dispatch = useDispatch();
  const [isDisable, setDisable] = useState(false);

  const reDownload = async (record) => {
    setDisable(true);
    const {
      key,
      search_keyword,
      select_page_num,
      search_regdate_s,
      search_regdate_e,
      filename,
    } = record;

    try {
      let url = `http://127.0.0.1:8000/${key}?search_keyword=${encodeURIComponent(
        search_keyword
      )}`;

      if (key === "msf") {
        // For 'msf', include 'select_page_num'
        url += `&select_page_num=${encodeURIComponent(select_page_num || "")}`;
      } else if (key === "mlit" || key === "seoul") {
        // For 'mlit' and 'seoul', include date ranges
        url += `&search_regdate_s=${encodeURIComponent(
          search_regdate_s || ""
        )}&search_regdate_e=${encodeURIComponent(search_regdate_e || "")}`;
      }

      const response = await fetch(url);

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        if (json.count === 0) {
          alert(json.message || "No data found.");
          setDisable(false);
          return;
        }
        throw new Error("Unexpected JSON response with data.");
      } else if (
        contentType &&
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        console.log("파일이 성공적으로 다운로드되었습니다.");
      } else {
        throw new Error("Unexpected response format.");
      }

      setDisable(false);
    } catch (error) {
      console.error("Error fetching the data:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
      setDisable(false);
    }
  };

  const handleDelete = (timestamp) => {
    dispatch(deleteDownloadRecord(timestamp));
  };

  return (
    <tr className="border-b border-gray-500">
      <td className="px-4 py-2">{record.filename}</td>
      <td className="px-4 py-2">{record.search_keyword || "전체"}</td>
      <td className="px-4 py-2">
        {record.data_count !== undefined ? record.data_count : "N/A"}
      </td>
      <td className="px-4 py-2">
        {new Date(record.download_time).toLocaleString()}
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => reDownload(record)}
          className={`px-4 py-2 mr-2 text-sm font-medium text-white border border-gray-700 rounded 
            hover:bg-gray-500 
            disabled:bg-gray-400 disabled:text-gray-200 disabled:border-gray-400 
            disabled:cursor-not-allowed disabled:hover:bg-gray-400 
            transition-colors duration-100 ease-in-out`}
          disabled={isDisable}
        >
          다운로드
        </button>
        <button
          onClick={() => handleDelete(record.download_time)}
          className="px-4 py-2 text-sm font-medium text-white transition-colors duration-100 ease-in-out border border-gray-700 rounded hover:bg-gray-500"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}

export default HistoryItem;
