import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteDownloadRecord } from "../../redux/historySlice";

function HistoryItem({ record }) {
  const dispatch = useDispatch();
  const [isDisable, setDisable] = useState(false);

  const reDownload = async (record) => {
    setDisable(true);
    const { key, search_keyword, select_page_num, filename } = record;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/${key}?search_keyword=${encodeURIComponent(
          search_keyword
        )}&select_page_num=${encodeURIComponent(select_page_num)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Blob URL 생성 및 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("파일이 성공적으로 다운로드되었습니다.");
      setDisable(false);
    } catch (error) {
      console.error("Error fetching the data:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
      setDisable(false); // Ensure button is re-enabled even if there's an error
    }
  };

  const handleDelete = (timestamp) => {
    dispatch(deleteDownloadRecord(timestamp));
  };

  return (
    <tr className="border-b border-gray-500">
      <td className="px-4 py-2">{record.filename}</td>
      <td className="px-4 py-2">{record.search_keyword || "전체"}</td>
      <td className="px-4 py-2">{record.select_page_num}</td>
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