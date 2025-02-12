import { NavLink } from "react-router";
import { ItemsProps } from "./Items.types";

export function Items({ icon, path, children }: ItemsProps) {
  return (
    <NavLink
      to={path}

      className={({ isActive }) => (isActive ? "text-accent" : "text-primary-foreground")}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      {children}
    </NavLink>


  );
}