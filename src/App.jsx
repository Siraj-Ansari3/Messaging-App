import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import SigninPage from "./Pages/SigninPage";
import AddContact from "./Pages/AddContact";
import { useFirebase } from "./Firebase";

function App() {
  const firebase = useFirebase();

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/addcontact' element={<AddContact />} />
      </Routes>
    </>
  );
}

export default App;
