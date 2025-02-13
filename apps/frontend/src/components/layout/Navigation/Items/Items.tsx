import { NavLink } from "react-router";
import { ItemsProps } from "./Items.types";

export function Items({ icon, path, children, disabled }: ItemsProps) {
  return (
    <>
      {disabled ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <div className="flex items-center justify-center">{icon}</div>
          {children}
        </div>
      ) : (
        <NavLink
          to={path}
          className={({ isActive }) =>
            isActive ? "text-accent" : "text-primary-foreground"
          }
        >
          <div className="flex items-center justify-center">{icon}</div>
          {children}
        </NavLink>
      )}
    </>
  );
}
