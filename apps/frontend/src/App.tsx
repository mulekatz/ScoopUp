import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { BrowserRouter } from "react-router";
import { NETWORK, NODE_URL, WALLETS } from "@/config";
import { SuspenseWrapper } from "@/components/ui/SuspenseWrapper";
import { RouterConfig } from "@/routes/RouterConfig";

function App() {
  return (
    <DappKitContainer>
      <BrowserRouter>
        <SuspenseWrapper>
          <RouterConfig />
        </SuspenseWrapper>
      </BrowserRouter>
    </DappKitContainer>
  );
}

export default App;

function DappKitContainer({ children }: { children: React.ReactNode }) {
  return (
    <DAppKitProvider
      nodeUrl={NODE_URL}
      genesis={NETWORK}
      usePersistence
      allowedWallets={[WALLETS]}
    >
      {children}
    </DAppKitProvider>
  );
}
