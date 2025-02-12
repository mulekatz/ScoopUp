import MainWrapper from "@/components/ui/MainWrapper";
import { Action } from "./Action";
import Submission from "@/components/home/Submission";


export default function Home() {
  return (
    <MainWrapper className="gap-12 lg:gap-24">
      <Submission />
      <Action />
    </MainWrapper>
  );
}
