"use client";
import { Typography } from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import AdvertisementCard from "@/components/AdvertisementCard";
import { shareOnX } from "@/utils/share";
import { useCluster } from "@/providers/cluster-provider";

const ManageLinks = () => {
  const { cluster } = useCluster();
  const getAdvertisements = trpc.getAdvertisements.useQuery({network: cluster.networkName });

  function handleShare(id: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/ad/${id}`;
    shareOnX("Buy now with Blinkify ", url);
  }

  function handleOpenAd(id: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/ad/${id}`;
    window.open(url, "_blank");
  }

  useEffect(() => {
    if (getAdvertisements.status === "success") {
      console.log(getAdvertisements.data);
    } else if (getAdvertisements.status === "error") {
      console.error(getAdvertisements.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAdvertisements.status, getAdvertisements.data]);

  return (
    <PageContainer
      title="Manage Links"
      description="This is the Manage Links page"
    >
      <DashboardCard title="Manage Links">
        {getAdvertisements.isLoading ? (
          <Typography>Loading...</Typography>
        ) : getAdvertisements.isError ? (
          <Typography>
            Error loading advertisements: {getAdvertisements.error.message}
          </Typography>
        ) : (
          <div className="flex flex-wrap -mx-4 p-4">
            {/* Render your data here */}
            {getAdvertisements.data?.map((ad) => (
              <div key={ad.id} className="px-4 mb-6">
                <AdvertisementCard
                  onOpen={() => handleOpenAd(ad.id)}
                  onDelete={() => {}}
                  onShare={() => {
                    handleShare(ad.id);
                  }}
                  {...ad}
                />
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ManageLinks;
