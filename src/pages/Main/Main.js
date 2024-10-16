import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Main() {
  const [selectBox, setSelectBox] = useState(false);
  const [selectItem, setSelectItem] = useState({
    key: "msf",
    value: "기획재정부",
  });
  const [selectItems, setSelectItems] = useState([
    { key: "msf", value: "기획재정부" },
    { key: "mlit", value: "국토교통부" },
    { key: "seoul", value: "서울시청" },
  ]);

  const onSelectBoxHandler = () => {
    setSelectBox(true);
  };

  const outSelectBoxHandler = () => {
    setSelectBox(false);
  };

  const selectHandler = (data) => {
    setSelectItem(data);
  };

  useEffect(() => {
    console.log(selectItem);
  }, [selectItem]);

  return (
    <div
      className="flex justify-center w-screen h-screen text-white bg-gray-900 bg-center bg-cover"
      // style={{
      //   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/ae9dc6a0-72bb-44b3-d8d1-f7e1c15e1a00/public')`,
      // }}
    >
      <div className="flex-col items-center mt-48">
        <h1
          className="font-semibold tracking-wide text-7xl"
          style={{
            textShadow: "0px 0px 20px rgba(0, 0, 0, 0.9)",
          }}
        >
          ReturnPlus Web Crawler
        </h1>
        <div className="flex">
          <button
            id="dropdownDelayButton"
            data-dropdown-toggle="dropdownDelay"
            data-dropdown-delay="500"
            data-dropdown-trigger="hover"
            className="text-white font-medium rounded-s-lg text-sm px-5 py-2.5 text-center inline-flex items-center relative bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200  border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:ring-blue-500 hover:border-blue-500 border-2 focus:outline-none"
            type="button"
            onMouseOver={() => onSelectBoxHandler()}
            onMouseLeave={() => outSelectBoxHandler()}
          >
            {selectItem.value}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
            <div
              className={`${
                selectBox ? "" : "hidden"
              } absolute top-10 left-0 pt-2`}
            >
              <div
                id="dropdownDelay"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 "
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200 "
                  aria-labelledby="dropdownDelayButton"
                >
                  {selectItems.map((data) => (
                    <li key={data.key}>
                      <Link
                        to={data.key}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => selectHandler(data)}
                      >
                        {data.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Main;
