import { useCallback, useRef, type ChangeEvent } from "react";
import { useWallet } from "@vechain/dapp-kit-react";
import { blobToBase64, getDeviceId, isMobileDevice, resizeImage } from "@/util";
import { submitReceipt } from "@/networking";
import { useDisclosure, useSubmission } from "@/hooks";
import { useImageStore } from "@/stores/useImageStore";
import { LiaCameraSolid } from "react-icons/lia";
import { PhotoButton } from "./PhotoButton";
import SubmitButton from "./SubmitButton/SubmitButton";
import { ResetButton } from "@/components/home/Submission/Timer";
import { Connect } from "../../Connect";
import { Overlay } from "./Overlay";
type FileInputEvent = ChangeEvent<HTMLInputElement>;

export const LivePhoto = () => {
  const { account } = useWallet();
  const { setIsLoading, setResponse } = useSubmission();
  const { onOpen } = useDisclosure();
  const {
    firstImage,
    secondImage,
    thirdImage,
    isExpired,

    setFirstImage,
    setSecondImage,
    setThirdImage,
    clearImages,
  } = useImageStore();

  const handleError = (error: unknown) => {
    console.error("Fehler beim Bildupload:", error);
    setResponse({
      validation: {
        validityFactor: 0,
        descriptionOfAnalysis:
          error instanceof Error
            ? error.message
            : "Ein unerwarteter Fehler ist aufgetreten",
      },
    });
  };

  const handleSubmitAllImages = useCallback(async () => {
    if (!account || !firstImage || !secondImage || !thirdImage) return;

    try {
      setIsLoading(true);
      onOpen();

      const deviceID = await getDeviceId();
      const response = await submitReceipt({
        address: account,
        deviceID,
        firstImage,
        secondImage,
        thirdImage,
      });

      setResponse(response);
    } catch (error) {
      handleError(error);
      clearImages();
    } finally {
      setIsLoading(false);
      clearImages();
    }
  }, [
    account,
    firstImage,
    secondImage,
    thirdImage,
    onOpen,
    setIsLoading,
    setResponse,
    clearImages,
    handleError,
  ]);

  const createHandleCameraCapture = useCallback(
    (imageType: "first" | "second" | "third") =>
      async (event: FileInputEvent) => {
        if (!isMobileDevice()) {
          alert("Diese Funktion ist nur auf mobilen Geräten verfügbar.");
          return;
        }

        const file = event.target.files?.[0];
        if (!file || !account) return;

        try {
          setIsLoading(true);
          const resizedBlob = await resizeImage(file);
          const base64Image = await blobToBase64(resizedBlob as Blob);

          switch (imageType) {
            case "first":
              setFirstImage(base64Image);
              console.log("Erstes Bild gespeichert");
              break;
            case "second":
              setSecondImage(base64Image);
              console.log("Zweites Bild gespeichert");
              break;
            case "third":
              setThirdImage(base64Image);
              console.log("Drittes Bild gespeichert");
              break;
          }
        } catch (error) {
          console.error("Fehler bei der Bildverarbeitung:", error);
          handleError(error);
          clearImages();
        } finally {
          setIsLoading(false);
          if (event.target) {
            event.target.value = "";
          }
        }
      },
    [
      account,
      setFirstImage,
      setSecondImage,
      setThirdImage,
      clearImages,
      handleError,
      setIsLoading,
    ]
  );

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
          icon={LiaCameraSolid}
          label="Before cleaning"
          disabled={isExpired}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
        <PhotoButton
          type="second"
          icon={LiaCameraSolid}
          label="After cleaning"
          disabled={!firstImage || isExpired}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
        <PhotoButton
          type="third"
          icon={LiaCameraSolid}
          label="Waste disposal"
          disabled={!firstImage || !secondImage || isExpired}
          inputRef={useRef<HTMLInputElement>(null)}
          createHandleCameraCapture={createHandleCameraCapture}
        />
      </div>
      <SubmitButton
        handleSubmitAllImages={handleSubmitAllImages}
        disabled={!firstImage || !secondImage || !thirdImage || isExpired}
      />
    </div>
  );
};
