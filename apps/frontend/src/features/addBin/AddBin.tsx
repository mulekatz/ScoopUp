import MainWrapper from "@/components/ui/MainWrapper";
import { AddBinCard } from "./components/AddBinCard";

export default function Dashboard() {
  return (
    <MainWrapper>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AddBinCard title="User XYZ">
        <p>Hello Dashboard</p>
      </AddBinCard>
    </MainWrapper>
  );
}
