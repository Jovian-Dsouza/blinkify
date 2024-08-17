"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useCluster } from "@/providers/cluster-provider";
import { tokens } from "@/data/tokens";
import { UploadButton } from "@/utils/uploadthing";

export default function CreateAdvertisement() {
  const [title, setTitle] = useState("test2");
  const [content, setContent] = useState("test2");
  const [mediaUrl, setMediaUrl] = useState("");
  const [amount, setAmount] = useState(0.1);
  const [tokenAddress, setTokenAddress] = useState(tokens[0].address);
  const { cluster } = useCluster();

  const addAdvertisement = trpc.addAdvertisement.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
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
    <main className="flex flex-col items-center justify-center px-12 py-8 bg-gray-900 rounded-xl">
      <h1 className="text-2xl font-bold text-white mb-8">
        Create Advertisement
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <UploadButton
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
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="tokenAddress"
          >
            Token
          </label>
          <select
            id="tokenAddress"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {tokens.map((token, index) => (
              <option key={index} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={addAdvertisement.status === "loading"}
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
