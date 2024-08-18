"use client";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import CreateAdvertisement from "@/components/CreateAdvertisement";

const CreatePage = () => {
  return (
    <PageContainer title="Create Page" description="Create a blink Ad">
        <CreateAdvertisement />
    </PageContainer>
  );
};

export default CreatePage;
