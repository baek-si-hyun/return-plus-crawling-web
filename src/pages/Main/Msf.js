import { useRef, useState } from "react";

function Msf() {
  const searchInputRef = useRef(null);
  const pageNumInputRef = useRef(null);
  
  // 버튼 상태 관리: 'idle', 'loading', 'ready'
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [filename, setFilename] = useState('기획재정부.xlsx'); // 기본 파일 이름

  const submitHandler = () => {
    const searchKeyword = searchInputRef.current.value;
    const pageNum = pageNumInputRef.current.value;
    fetchData(searchKeyword, pageNum);
  };

  const fetchData = async (searchKeyword, pageNum) => {
    setStatus('loading');  // 버튼 상태를 'loading'으로 변경
    setDownloadUrl(null);  // 이전 다운로드 URL 초기화
    setFilename('기획재정부.xlsx'); // 파일 이름 초기화

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/msf?search_keyword=${encodeURIComponent(searchKeyword)}&select_page_num=${encodeURIComponent(pageNum)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // 현재 날짜를 YYYYMMDD 형식으로 가져오기
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

      // 검색어와 날짜를 기반으로 파일명 생성 (특수 문자 제거)
      const sanitizedKeyword = sanitizeFilename(searchKeyword);
      const customFilename = searchKeyword
        ? `기획재정부_${sanitizedKeyword}_${today}.xlsx`
        : `기획재정부_${today}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);        // 다운로드 URL 저장
      setFilename(customFilename); // 생성된 파일 이름 저장
      setStatus('ready');        // 버튼 상태를 'ready'로 변경
      console.log('파일이 성공적으로 준비되었습니다.');
    } catch (error) {
      console.error('Error fetching the data:', error);
      setStatus('idle');        // 에러 발생 시 버튼 상태를 'idle'로 변경
      alert('데이터를 가져오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
    }
  };

  const sanitizeFilename = (filename) => {
    // 파일명에서 사용할 수 없는 문자 제거
    return filename.replace(/[\\/*?:"<>|]/g, "");
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;

      // 파일명 설정
      a.download = filename; // 생성된 파일명 사용
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadUrl(null);    // 다운로드 후 URL 초기화
      setStatus('idle');       // 버튼 상태를 'idle'로 변경
      console.log('파일이 성공적으로 다운로드되었습니다.');
    }
  };

  return (
    <div className="flex flex-1 ">
      {/* 검색어 입력 필드 */}
      <div>
        <input
          ref={searchInputRef}
          type="text"
          className="
            border-y-2 border-y-gray-300
            border-x-2 border-x-gray-50 dark:border-x-gray-700
            outline-none text-sm block w-full p-2.5 h-11
            bg-gray-50 dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:ring-blue-500 focus:border-blue-500
            dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
          "
          placeholder="검색어 (없을시 전체 검색)"
        />
      </div>
      
      {/* 페이지 수 입력 필드 */}
      <div className="relative flex items-center max-w-[11rem]">
        {/* 페이지 수 조절 버튼 및 입력 필드 */}
        <button
          type="button"
          id="decrement-button"
          data-input-counter-decrement="bedrooms-input"
          className="p-3 bg-gray-100 border-2 h-11 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          ref={pageNumInputRef}
          type="text"
          data-input-counter
          data-input-counter-min="1"
          data-input-counter-max="5"
          aria-describedby="helper-text-explanation"
          className="block w-full pb-6 text-sm font-medium text-center text-gray-900 outline-none border-y-2 border-y-gray-300 border-x-2 border-x-gray-50 dark:border-x-gray-700 h-11 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          defaultValue="5"  // 'value' 대신 'defaultValue' 사용
          required
        />
        <div className="absolute flex items-center space-x-1 text-xs text-gray-400 -translate-x-1/2 bottom-1 start-1/2 rtl:translate-x-1/2 rtl:space-x-reverse">
          <span>페이지 수 (기본 5)</span>
        </div>
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="bedrooms-input"
          className="p-3 text-gray-900 bg-gray-100 border-2 h-11 rounded-e-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
      
      {/* 버튼 상태에 따른 조건부 렌더링 */}
      {status === 'idle' && (
        <button
          type="button"
          className="
            rounded-lg text-sm px-5 py-2.5 font-medium
            bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700
            text-white
            focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 ml-4
          "
          onClick={submitHandler}
          disabled={status === 'loading'}
        >
          크롤링하기
        </button>
      )}
      {status === 'loading' && (
        <button
          type="button"
          className="
            rounded-lg text-sm px-5 py-2.5 font-medium
            bg-gray-500 cursor-not-allowed
            text-white
            focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800 ml-4
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
      {status === 'ready' && (
        <div className="flex items-center ml-4">
          <button
            type="button"
            className="
              rounded-lg text-sm px-5 py-2.5 font-medium
              bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700
              text-white
              focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800
            "
            onClick={downloadFile}
          >
            다운로드하기
          </button>
          {/* 파일명 표시 */}
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {filename}
          </span>
        </div>
      )}
    </div>
  );
}

export default Msf;