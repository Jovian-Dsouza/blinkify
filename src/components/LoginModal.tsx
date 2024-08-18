"use client";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import { WalletModalContext } from "@solana/wallet-adapter-react-ui";
import { useSession } from "next-auth/react";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { setVisible: showWalletModal } = useContext(WalletModalContext);
  const { data: session } = useSession();

  useEffect(() => {
    //@ts-ignore
    if (!session || !session.publicKey) {
      setIsOpen(true);
    }
  }, [session]);

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200"
      >
        Open Login Modal
      </button>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-70" />

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-lg">
            <DialogTitle
              as="h3"
              className="text-lg leading-6 font-medium text-white"
            >
              Connect to Your Wallet
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Please connect your wallet to access the full features of our
                platform.
              </p>
            </div>

            <div className="mt-4">
              <button
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200"
                onClick={() => {
                  setIsOpen(false);
                  showWalletModal(true);
                }}
              >
                Connect Wallet
              </button>
            </div>

            <div className="mt-4">
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
