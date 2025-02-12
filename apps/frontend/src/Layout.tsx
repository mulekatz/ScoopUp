import { Outlet } from "react-router";
import Header from "./components/header";
import Navigation from "./components/navigation";

export default function Layout() {
  return (
    <div className="flex flex-col items-center w-full text-primary-foreground bg-black bg-radial-[at_65%_35%] from-gray-800 from-2% via-purple-800/15 via-70% to-purple-800/15 to-100%">
      <div className="relative flex flex-col items-center min-h-screen w-full max-w-2xl">
        <Header />
        <Outlet />
        <Navigation />
      </div>
    </div>
  );
}
