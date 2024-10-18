// src/pages/Main/Seoul.js
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addDownloadRecord } from "../../redux/historySlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure DatePicker styles are imported

function Seoul() {
  const searchInputRef = useRef(null);

  // 시작 날짜와 종료 날짜 상태 관리
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 버튼 상태 관리: 'idle', 'loading', 'ready'
  const [status, setStatus] = useState("idle");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [filename, setFilename] = useState("서울시청.xlsx");
  const [currentDownloadRecord, setCurrentDownloadRecord] = useState(null);

  const dispatch = useDispatch(); // Redux dispatch

  // Helper function to format dates as "YYYY-MM-DD"
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sanitizeFilename = (filename) => {
    // 파일명에서 사용할 수 없는 문자 제거
    return filename.replace(/[\\/*?:"<>|]/g, "");
  };

  const submitHandler = () => {
    const searchKeyword = searchInputRef.current.value;
    fetchData(searchKeyword, startDate, endDate);
  };

  const fetchData = async (searchKeyword, startDate, endDate) => {
    setStatus("loading"); // 버튼 상태를 'loading'으로 변경
    setDownloadUrl(null); // 이전 다운로드 URL 초기화
    setFilename("서울시청.xlsx"); // 파일 이름 초기화
    setCurrentDownloadRecord(null); // 현재 다운로드 기록 초기화

    try {
      // 날짜를 "YYYY-MM-DD" 형식으로 변환 또는 빈 문자열 전달
      const apiStartDate = startDate ? formatDate(startDate) : "";
      const apiEndDate = endDate ? formatDate(endDate) : "";

      const response = await fetch(
        `http://ec2-54-205-189-223.compute-1.amazonaws.com:8888/seoul/?search_keyword=${encodeURIComponent(
          searchKeyword
        )}&search_regdate_s=${encodeURIComponent(
          apiStartDate
        )}&search_regdate_e=${encodeURIComponent(apiEndDate)}`
      );

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        // Handle JSON response (no data found)
        const json = await response.json();
        if (json.count === 0) {
          alert(json.message || "No data found.");
          resetInputs();
          return;
        }
        // If JSON but count > 0, handle accordingly (unlikely based on API)
        throw new Error("Unexpected JSON response with data.");
      } else if (
        contentType &&
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        // Handle Excel file response
        const blob = await response.blob();

        // 현재 날짜를 YYYYMMDD 형식으로 가져오기
        const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

        // 검색어와 날짜를 기반으로 파일명 생성 (특수 문자 제거)
        const sanitizedKeyword = sanitizeFilename(searchKeyword);
        const customFilename = searchKeyword
          ? `서울시청_${sanitizedKeyword}_${today}.xlsx`
          : `서울시청_${today}.xlsx`;

        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url); // 다운로드 URL 저장
        setFilename(customFilename); // 생성된 파일 이름 저장
        setStatus("ready"); // 버튼 상태를 'ready'로 변경
        console.log("파일이 성공적으로 준비되었습니다.");

        // 데이터 수 추출 from headers
        const dataCount = response.headers.get("X-Data-Count") || "0";

        // 다운로드 기록 저장
        const downloadRecord = {
          key: "seoul",
          filename: customFilename,
          search_keyword: searchKeyword,
          search_regdate_s: apiStartDate, // 추가: 시작 날짜
          search_regdate_e: apiEndDate, // 추가: 종료 날짜
          download_time: new Date().toISOString(),
          data_count: parseInt(dataCount, 10), // 크롤링한 데이터 수 추가
        };
        setCurrentDownloadRecord(downloadRecord);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      setStatus("idle"); // 에러 발생 시 버튼 상태를 'idle'로 변경
      alert("데이터를 가져오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
      resetInputs();
    }
  };

  const resetInputs = () => {
    // 검색어 초기화
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    // 날짜 초기화
    setStartDate(null);
    setEndDate(null);
    // 버튼 상태 초기화
    setStatus("idle");
    setDownloadUrl(null);
    setFilename("서울시청.xlsx");
    setCurrentDownloadRecord(null);
  };

  const downloadFile = () => {
    if (downloadUrl) {
      // 다운로드 기록 디스패치
      if (currentDownloadRecord) {
        dispatch(addDownloadRecord(currentDownloadRecord));
      }

      const a = document.createElement("a");
      a.href = downloadUrl;

      // 파일명 설정
      a.download = filename; // 생성된 파일명 사용
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadUrl(null); // 다운로드 후 URL 초기화
      setStatus("idle"); // 버튼 상태를 'idle'로 변경
      setCurrentDownloadRecord(null); // 현재 다운로드 기록 초기화
      console.log("파일이 성공적으로 다운로드되었습니다.");
    }
  };

  return (
    <div className="flex items-center flex-1">
      {/* 검색어 입력 필드 */}
      <div className="flex-1">
        <input
          ref={searchInputRef}
          type="text"
          className="
            border-y-2 border-y-gray-300 h-11
            border-x-2 border-x-gray-50 dark:border-x-gray-700
            outline-none text-sm block w-full p-2.5
            bg-gray-50 dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:ring-blue-500 focus:border-blue-500
            dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
          "
          placeholder="검색어 (없을시 전체 검색)"
        />
      </div>

      {/* 날짜 범위 선택기 */}
      <div className="relative w-fit">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          isClearable={true}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 범위 선택"
          className="block p-2.5 h-11 pl-10 text-sm text-white placeholder-gray-400 bg-gray-700 border-t-2 border-b-2 border-l-2 border-r-2 rounded-r-lg outline-none w-60 border-l-gray-600 border-t-gray-600 border-b-gray-600 border-r-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 버튼 상태에 따른 조건부 렌더링 */}
      {status === "idle" && (
        <button
          type="button"
          className="
            rounded-lg text-sm px-5 py-2.5 font-medium
            text-white h-11
            focus:outline-none focus:ring-4 focus:ring-blue-800 bg-blue-600 hover:bg-blue-700
            ml-4
          "
          onClick={submitHandler}
          disabled={status === "loading"}
        >
          크롤링하기
        </button>
      )}
      {status === "loading" && (
        <button
          type="button"
          className="
            rounded-lg text-sm px-5 py-2.5 font-medium
            text-white
            focus:outline-none focus:ring-4 focus:ring-gray-300 
            bg-gray-500 cursor-not-allowed
            ml-4 h-11
            flex items-center justify-center
          "
          disabled
        >
          {/* 로딩 스피너 추가 */}
          <svg
            className="w-5 h-5 mr-3 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          크롤링중
        </button>
      )}
      {status === "ready" && (
        <div className="flex items-center ml-4">
          <button
            type="button"
            className="
              rounded-lg text-sm px-5 py-2.5 font-medium
              text-white
              focus:outline-none focus:ring-4 focus:ring-green-800
              bg-green-700 hover:bg-green-800 h-11
            "
            onClick={downloadFile}
          >
            다운로드하기
          </button>
          {/* 파일명 표시 */}
          <span className="ml-2 text-sm text-gray-300">{filename}</span>
        </div>
      )}
    </div>
  );
}

export default Seoul;
