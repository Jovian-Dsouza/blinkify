/* eslint-disable @next/next/no-img-element */
import { getTokenByAddress } from "@/data/tokens";
import { FC } from "react";

interface AdvertisementProps {
  title: string;
  content: string;
  mediaUrl: string;
  amount: string;
  tokenAddress: string;
}

const AdvertisementCard: FC<AdvertisementProps> = ({
  title,
  content,
  mediaUrl,
  amount,
  tokenAddress,
}) => {
  const token = getTokenByAddress(tokenAddress);
  if (!token) {
    return null;
  }
  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg w-[24rem]">
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={mediaUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
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
          <button className="text-sm absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-1.5 py-1 rounded-md hover:bg-gray-800 transition-all">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
