import { useRoutes } from "react-router-dom";
// import SignUp from "./pages/auth/signup/SignUp";
// import Login from "./pages/auth/login/Login";
// import Home from "./pages/home/Home";
// import Sidebar from "./components/common/Sidebar";
// import RightPanel from "./components/common/RightPanel";
// import Notification from "./pages/notification/Notification";
// import Profile from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";

import { useUser } from "./hooks /auth/useUser";
import HomeLoader from "./components/common/HomeLoader";
import routes from "./Router";

function App() {
  const { isLoading } = useUser();
  const content = useRoutes(routes);

  if (isLoading) <HomeLoader />;

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* <Sidebar />
      <Routes>
        <Route path="/" element={ authUser ? <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/notifications" element={<Notification />} />
        {/* <Route path="/profile/:userName" element={<Profile />} /> 
      </Routes>
      <RightPanel /> */}
      {content}
      <Toaster />
    </div>
  );
}

export default App;
