import { useDisclosure, useSubmission } from "@/hooks";
import { useCallback } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ValidationResponse } from "../ValidationResponse";
import { useValidation } from "@/hooks/useValidation";
import { SubmissionResponse } from "../SubmissionResponse";

// Separate Loading-Komponente für bessere Wiederverwendbarkeit
const LoadingSpinner = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div 
      className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent"
      role="progressbar"
      aria-label="Lädt..."
    />
  </div>
);

export const SubmissionModal = () => {
  const { responseValidation, isValidationLoading, setResponseValidation } = useValidation();
  const { isLoading, response, setResponse } = useSubmission();
  const { isOpen, onClose } = useDisclosure();

  const handleClose = useCallback(() => {
    onClose();
    setResponse(null);
    setResponseValidation(null);
  }, [onClose, setResponse, setResponseValidation]);

  if (!isOpen) return null;

  // Vereinfachte Render-Logik mit early returns
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isValidationLoading) {
      return <LoadingSpinner />;
    }

    if (response) {
      return (
        <>
          <SubmissionResponse />
        </>
      );
    }

    if (responseValidation && !response && !isLoading) {
      return <ValidationResponse />;
    }

    return null;
  };

  return (
    <Drawer 
      open={isOpen} 
      onOpenChange={handleClose}
    >

      <DrawerOverlay />
      <DialogTitle aria-describedby={undefined} />
      <DrawerContent
        className="h-[90vh] w-full max-w-2xl mx-auto text-primary-foreground bg-black bg-radial-[at_65%_35%] from-gray-800 from-2% via-purple-800/15 via-70% to-purple-800/15 to-100%"
        role="dialog"
        aria-describedby={undefined} 
        aria-modal="true"
        aria-labelledby="submission-modal-title"
      >
        {renderContent()}
      </DrawerContent>
    </Drawer>
  );
};
