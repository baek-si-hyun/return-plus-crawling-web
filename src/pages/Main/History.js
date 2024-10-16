import { useSelector } from "react-redux";
import HistoryItem from "./HistoryItem";

function History() {
  const history = useSelector((state) => state.history.historyList);

  return (
    <div className="p-4 mt-12 text-white">
      {history.length === 0 ? (
        <p>다운로드 기록이 없습니다.</p>
      ) : (
        <div className="relative overflow-x-auto h-[34rem] overscroll-y-auto">
          <table className="min-w-full ">
            <thead className="sticky top-0 left-0 bg-gray-900">
              <tr className="border-b border-gray-500">
                <th className="px-4 py-2 text-left ">파일명</th>
                <th className="px-4 py-2 text-left ">검색어</th>
                <th className="px-4 py-2 text-left ">페이지 수</th>
                <th className="px-4 py-2 text-left ">다운로드 시간</th>
                <th className="px-4 py-2 text-left ">액션</th>
              </tr>
            </thead>
            <tbody className="">
              {history.map((record, i) => (
                <HistoryItem key={i} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;
