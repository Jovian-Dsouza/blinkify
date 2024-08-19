"use client";
import { useState, FormEvent, useMemo } from "react";
import { trpc } from "@/app/_trpc/client";
import { useCluster } from "@/providers/cluster-provider";
import { tokens } from "@/data/tokens";
import { UploadDropzone } from "@/utils/uploadthing";
import { TokenSelectWithIcon } from "./TokenSelectWithIcon";
import { TextInput } from "./TextInput";
import { FormField } from "./FormField";
import { TextareaInput } from "./TextareaInput";
import { useSession } from "next-auth/react";

export default function CreateAdvertisement() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [tokenAddress, setTokenAddress] = useState<string>(tokens[0].address);
  const { cluster } = useCluster();
  const { data: session } = useSession();

  const addAdvertisement = trpc.addAdvertisement.useMutation();

  const validateForm = () => {
    return (
      addAdvertisement.status !== "loading" &&
      title.trim() !== "" &&
      content.trim() !== "" &&
      mediaUrl.trim() !== "" &&
      amount > 0 &&
      tokenAddress.trim() !== "" &&
      session &&
      // @ts-ignore
      session.publicKey
    );
  };

  const isFormValid = useMemo(
    () => validateForm(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title, content, mediaUrl, amount, tokenAddress]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addAdvertisement.mutateAsync({
        title,
        content,
        mediaUrl,
        amount,
        tokenAddress,
        network: cluster.networkName,
      });
      alert("Advertisement created successfully!");
    } catch (error) {
      alert("Failed to create advertisement. Please try again.");
    }
  };

  return (
    <main className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Create Your Ad
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Product Name" htmlFor="title">
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product name"
          />
        </FormField>

        <FormField label="Description" htmlFor="content">
          <TextareaInput
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter a brief description of the product"
            rows={5}
          />
        </FormField>

        <FormField label="Image" htmlFor="mediaUrl">
          <div className="mt-2 w-full flex items-center">
            <UploadDropzone
              className="w-full"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0] && res[0].url) {
                  setMediaUrl(res[0].url);
                  console.log("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                console.log(`ERROR! ${error.message}`);
              }}
              onUploadBegin={(name) => {
                console.log("Uploading: ", name);
              }}
              onDrop={(acceptedFiles) => {
                console.log("Accepted files: ", acceptedFiles);
              }}
            />
          </div>
        </FormField>

        <FormField label="Amount" htmlFor="amount">
          <div className="flex gap-4 items-center max-w-sm">
            <TextInput
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter the amount"
            />
            <div className="w-1/2">
              <TokenSelectWithIcon
                token={tokens.find((token) => token.address === tokenAddress)!}
                onChange={(address: string) => setTokenAddress(address)}
              />
            </div>
          </div>
        </FormField>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`relative rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-200
            ${
              !isFormValid
                ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70"
                : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            }`}
            disabled={!isFormValid}
          >
            {addAdvertisement.status === "loading"
              ? "Creating..."
              : "Create Advertisement"}
          </button>
        </div>
      </form>
    </main>
  );
}
