import { useCallback, useMemo, useRef, type ChangeEvent } from "react";
import { useWallet } from "@vechain/dapp-kit-react";
import { blobToBase64, getDeviceId, isMobileDevice, resizeImage } from "@/util";
import { submitReceipt, validateImage } from "@/networking";
import { useDisclosure, useSubmission } from "@/hooks";
import { useImageStore } from "@/stores/useImageStore";
import { LiaCameraSolid, LiaCheckSolid } from "react-icons/lia";
import { PhotoButton } from "./PhotoButton";
import SubmitButton from "./SubmitButton/SubmitButton";
import { ResetButton } from "@/features/scoop/components/Timer";
import { Connect } from "@/features/auth/Connect";
import { Overlay } from "@/components/ui/overlay";
import { useValidation } from "@/hooks/useValidation";

type FileInputEvent = ChangeEvent<HTMLInputElement>;
type ImageType = "first" | "second" | "third";

export const LivePhoto = () => {
  const { account } = useWallet();
  const { setIsLoading, setResponse } = useSubmission();
  const { onOpen, onClose } = useDisclosure();
  const { setIsValidationLoading, setResponseValidation } = useValidation();

  const {
    firstImage,
    secondImage,
    thirdImage,
    isExpired,
    setFirstImage,
    setSecondImage,
    setThirdImage,
    clearImage,
    clearImages,
  } = useImageStore();

  const imageSetters = useMemo(
    () => ({
      first: setFirstImage,
      second: setSecondImage,
      third: setThirdImage,
    }),
    [setFirstImage, setSecondImage, setThirdImage]
  );

  const validateAndSaveImage = useCallback(
    async (imageType: ImageType, base64Image: string) => {
      setIsValidationLoading(true);
      onOpen();

      try {
        const deviceID = await getDeviceId();

        const validationData = {
          firstImage: imageType === "second" ? firstImage : null,
          secondImage: imageType === "second" ? base64Image : null,
          thirdImage: imageType === "third" ? base64Image : null,
          address: account!,
          deviceID,
        };

        if (imageType === "first") {
          validationData.firstImage = base64Image;
        }

        const result = await validateImage(validationData);
        setResponseValidation(result);

        const isImageValid = result.isValid;
        
        if (!isImageValid) {
          clearImage(imageType);
          return;
        }

        if (isImageValid) {
          imageSetters[imageType](base64Image);
        }
      } catch (error) {
        console.error("Validation error:", error);
        clearImage(imageType);
      } finally {
        setIsValidationLoading(false);
      }
    },
    [
      account,
      firstImage,
      clearImage,
      setIsValidationLoading,
      setResponseValidation,
      onOpen,
      onClose,
      imageSetters,
    ]
  );

  const createHandleCameraCapture = useCallback(
    (imageType: ImageType) => async (event: FileInputEvent) => {
      if (!isMobileDevice()) {
        alert("Diese Funktion ist nur auf mobilen Geräten verfügbar.");
        return;
      }

      const file = event.target.files?.[0];
      if (!file || !account) return;

      try {
        const resizedBlob = await resizeImage(file);
        const base64Image = await blobToBase64(resizedBlob as Blob);
        await validateAndSaveImage(imageType, base64Image);
      } catch (error) {
        console.error("Fehler bei der Bildverarbeitung:", error);
        clearImage(imageType);
      } finally {
        if (event.target) {
          event.target.value = "";
        }
      }
    },
    [account, validateAndSaveImage, clearImage]
  );

  const handleSubmitReceipt = useCallback(async () => {
    if (!account || !firstImage || !secondImage || !thirdImage) return;
    setIsLoading(true);
    onOpen();

    try {
      const deviceID = await getDeviceId();
      const response = await submitReceipt({
        address: account,
        deviceID,
        isValid: true,
      });
      setResponse(response);
      clearImages();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account, firstImage, secondImage, thirdImage, setIsLoading, setResponse]);

  const isSubmitDisabled =
    !firstImage || !secondImage || !thirdImage || isExpired;

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <div className="relative flex flex-col w-fit gap-8">
        <ResetButton />
        {!account && (
          <Overlay>
            <div className="flex flex-col gap-12 items-center justify-center">
              <h2 className="text-2xl font-bold text-primary-foreground text-center">
                Please connect your wallet!
              </h2>
              <Connect />
            </div>
          </Overlay>
        )}
        <PhotoButton
          type="first"
          icon={ firstImage ? {Icon: LiaCheckSolid, className:"text-accent"} : {Icon: LiaCameraSolid} }
          label="Before cleaning"
          disabled={isExpired || !!firstImage}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
        <PhotoButton
          type="second"
          icon={ secondImage ? {Icon: LiaCheckSolid, className:"text-accent"} : {Icon: LiaCameraSolid} }
          label="After cleaning"
          disabled={!firstImage || isExpired || !!secondImage}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
        <PhotoButton
          type="third"
          icon={ thirdImage ? {Icon: LiaCheckSolid, className:"text-accent"} : {Icon: LiaCameraSolid} }
          label="Waste disposal"
          disabled={!firstImage || !secondImage || isExpired || !!thirdImage}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
      </div>
      <SubmitButton
        handleSubmitAllImages={handleSubmitReceipt}
        disabled={isSubmitDisabled}
      />
    </div>
  );
};
