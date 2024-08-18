"use client";
import { Typography } from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import AdvertisementCard from "@/components/AdvertisementCard";

const ManageLinks = () => {
  const getAdvertisements = trpc.getAdvertisements.useQuery();

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
              <div
                key={ad.id}
                className="px-4 mb-6"
              >
                <AdvertisementCard {...ad} />
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ManageLinks;
