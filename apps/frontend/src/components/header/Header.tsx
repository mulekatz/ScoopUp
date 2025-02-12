import { Link } from "react-router";
import Logo from "./Logo/Logo";

export default function Header() {
  return (
    <div className="flex items-center justify-center w-full px-12 pt-6 pb-12 lg:pb-24">
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );


}
