import { useDisclosure, useSubmission } from "@/hooks";
import { useCallback } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import Confetti from "react-confetti";
import { ValidationResult } from "../Validation/ValidationResult/";

export const SubmissionModal = () => {
  const { isLoading, response, setResponse } = useSubmission();
  const { isOpen, onClose } = useDisclosure();

  const handleClose = useCallback(() => {
    onClose();
    setResponse(null);
  }, [onClose, setResponse]);

  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerOverlay />
      <DialogTitle />
      <DrawerContent className="h-[90vh] w-full max-w-2xl mx-auto" aria-describedby={undefined}>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          response && (
            <>
              <ValidationResult validation={response} />
              {response.overallValid && <Confetti className="w-fit h-full" gravity={0.05} />}
            </>
          )
        )}
      </DrawerContent>
    </Drawer>
  );
};
