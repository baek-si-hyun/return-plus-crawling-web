import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import Msf from "./pages/Main/Msf";
import Mlit from "./pages/Main/Mlit";
import Seoul from "./pages/Main/Seoul";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Msf />} />
          <Route path="/msf" element={<Msf />}></Route>
          <Route path="/mlit" element={<Mlit />}></Route>
          <Route path="/seoul" element={<Seoul />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
