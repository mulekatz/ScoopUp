import { useDisclosure, useSubmission } from "@/hooks";
import { useMemo, useCallback } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import Confetti from "react-confetti";

export const SubmissionModal = () => {
  const { isLoading, response, setResponse } = useSubmission();
  const { isOpen, onClose } = useDisclosure();

  const handleClose = useCallback(() => {
    onClose();
    // Reset response when modal is closed
    setResponse({
      validation: {
        validityFactor: 0,
        descriptionOfAnalysis: "",
      },
    });
  }, [onClose, setResponse]);

  const renderContent = useMemo(() => {
    const isValid = response?.validation.validityFactor === 1;

    if (isValid) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          {/* Airdrop Icon würde hier kommen */}
          <h2 className="text-3xl font-semibold mb-4">Congratulations!</h2>
          <div className="flex items-center space-x-2">
            <p className="text-2xl">You've earned 1</p>
            <img src="/images/b3tr-token.svg" alt="Token" className="h-6 w-6" />
          </div>
          <Confetti className="w-fit h-full" gravity={0.01}  />
        </div>

      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        {/* Alert Icon würde hier kommen */}
        <h2 className="text-3xl font-semibold mb-4">Oops! AI says</h2>
        <p className="text-sm text-center px-4">
          {response?.validation.descriptionOfAnalysis}
        </p>
      </div>
    );
  }, [response]);

  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerOverlay />
      <DialogTitle></DialogTitle>
      <DrawerContent className="h-[90vh] w-full max-w-2xl mx-auto" aria-describedby={undefined}>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">

            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          renderContent
        )}
      </DrawerContent>
    </Drawer>
  );
};
