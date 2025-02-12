import MainWrapper from "@/components/ui/MainWrapper";
import { Connect } from "../home/Connect";
import { useVechainDomain, useWallet } from "@vechain/dapp-kit-react";

export default function Profile() {
  const { account } = useWallet();
  const { domain, address, isLoading } = useVechainDomain({ addressOrDomain: account });

  if (!account) {
    return (
      <MainWrapper className="items-center justify-center">
        <h2 className="text-2xl font-bold">Please connect your wallet</h2>
        <Connect />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <h2 className="text-2xl font-bold">Willkommen</h2>
      <p>
        {isLoading ? "Loading..." : domain || address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
      <Connect />
    </MainWrapper>



  );
}
