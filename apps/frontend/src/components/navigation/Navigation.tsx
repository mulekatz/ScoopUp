import {
  LiaHomeSolid,
  LiaMap,
  LiaPlusCircleSolid,
  LiaUserSolid,
} from "react-icons/lia";
import { Items } from "./Items";

export default function Navigation() {
  return (
    <div className="sticky bottom-0 flex justify-around items-center h-24 w-full">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsla(0,100%,50%,0.2),transparent_1px),linear-gradient(to_bottom,hsla(0,100%,50%,0.2),transparent_1px)] bg-transparent backdrop-blur-lg bg-[size:.75rem_.75rem] [background-position:0.5rem_0.5rem]"></div>
      <Items icon={<LiaHomeSolid size={36} />} path="/">
        Home
      </Items>
      <Items icon={<LiaMap size={36} />} path="/map">
        Map
      </Items>
      <Items icon={<LiaPlusCircleSolid size={36} />} path="/add-bin">
        Add Bin
      </Items>
      <Items icon={<LiaUserSolid size={36} />} path="/profile">
        Profile
      </Items>
    </div>
  );
}
