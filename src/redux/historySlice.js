import { createSlice } from "@reduxjs/toolkit";

// localStorage에서 초기 상태 로드
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("downloadHistory");
    if (serializedState === null) {
      return [];
    }
    const parsedData = JSON.parse(serializedState);

    // 다운로드 기록에 data_count가 없는 경우 기본값 설정
    const updatedData = parsedData.map((record) => ({
      ...record,
      data_count: record.data_count !== undefined ? record.data_count : 0,
    }));

    // 다운로드 시간을 기준으로 내림차순 정렬
    return updatedData.sort((a, b) => new Date(b.download_time) - new Date(a.download_time));
  } catch (e) {
    console.warn("Could not load download history from localStorage", e);
    return [];
  }
};

// localStorage에 상태 저장
const saveToLocalStorage = (historyList) => {
  try {
    const serializedState = JSON.stringify(historyList);
    localStorage.setItem("downloadHistory", serializedState);
  } catch (e) {
    console.warn("Could not save download history to localStorage", e);
  }
};

const historySlice = createSlice({
  name: "history",
  initialState: {
    historyList: loadFromLocalStorage(),
  },
  reducers: {
    addDownloadRecord: (state, action) => {
      // 새로운 기록을 배열의 앞쪽에 추가하여 최신순 유지
      state.historyList.unshift(action.payload);

      // 30일 이상 지난 기록 제거
      const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
      state.historyList = state.historyList.filter(
        (item) => new Date(item.download_time).getTime() > thirtyDaysAgo
      );

      saveToLocalStorage(state.historyList);
    },
    deleteDownloadRecord: (state, action) => {
      state.historyList = state.historyList.filter(
        (record) => record.download_time !== action.payload
      );
      saveToLocalStorage(state.historyList);
    },
    clearDownloadHistory: (state) => {
      state.historyList = [];
      saveToLocalStorage(state.historyList);
    },
  },
});

export const { addDownloadRecord, deleteDownloadRecord, clearDownloadHistory } = historySlice.actions;

export default historySlice.reducer;