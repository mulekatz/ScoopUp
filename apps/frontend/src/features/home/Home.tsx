import MainWrapper from "@/components/ui/MainWrapper";
import { Action } from "./components/Action";
import Scoop from "@/features/scoop";


export default function Home() {
  return (
    <MainWrapper className="gap-12 lg:gap-24">
      <Scoop />
      <Action />
    </MainWrapper>
  );
}
