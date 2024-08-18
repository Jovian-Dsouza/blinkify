/* eslint-disable @next/next/no-img-element */
import { getTokenByAddress } from "@/data/tokens";
import { FC } from "react";
import { IconShare, IconTrash } from "@tabler/icons-react";
import Tooltip from "@mui/material/Tooltip";

interface AdvertisementProps {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  amount: string;
  tokenAddress: string;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const AdvertisementCard: FC<AdvertisementProps> = ({
  id,
  title,
  content,
  mediaUrl,
  amount,
  tokenAddress,
  onDelete,
  onShare,
}) => {
  const token = getTokenByAddress(tokenAddress);
  if (!token) {
    return null;
  }

  return (
    <div className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg w-[24rem] group">
      {/* Blurred Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={mediaUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg transition-transform transform group-hover:blur-sm duration-300"
        />

        {/* Centered Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Tooltip title="Share">
            <button
              onClick={() => onShare(id)}
              className="text-gray-600 hover:text-white bg-gray-200 hover:bg-indigo-600 p-3 rounded-full focus:outline-none transition-colors duration-200 ease-in-out transform hover:scale-125"
              aria-label="Share"
            >
              <IconShare width={24} height={24} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => onDelete(id)}
              className="text-red-600 hover:text-white bg-red-200 hover:bg-red-600 p-3 rounded-full focus:outline-none transition-colors duration-200 ease-in-out transform hover:scale-125"
              aria-label="Delete"
            >
              <IconTrash width={24} height={24} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        <p className="text-gray-500 text-xs mb-1">blinkify.fun</p>
        <h2 className="text-md font-bold text-gray-900 mb-0.5 truncate">
          Buy {title} for {amount} {token.symbol}
        </h2>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{content}</p>

        <div className="relative mt-auto">
          <input
            disabled={true}
            type="email"
            placeholder="Enter your Email address"
            className="w-full border border-gray-300 rounded-md p-2 pl-4 pr-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="text-sm absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-all">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
