import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import Msf from "./components/Msf";
import Mlit from "./components/Mlit";
import Seoul from "./components/Seoul";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
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
