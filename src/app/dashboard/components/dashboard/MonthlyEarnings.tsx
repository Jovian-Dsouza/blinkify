import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import {
  IconArrowDownRight,
  IconArrowUpLeft,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react"; // Import useSession
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import { trpc } from "@/app/_trpc/client";
import { useCluster } from "@/providers/cluster-provider";

const MonthlyEarnings = () => {
  // Get session
  const { status } = useSession();

  const { cluster } = useCluster();
  const { data, isLoading, isError } = trpc.getMonthlyRevenue.useQuery({
    network: cluster.networkName,
  });

  // Masked values
  const maskedValue = "****";
  const maskedPercentage = "+**%";

  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart: any = [
    {
      name: "",
      color: secondary,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ];

  return (
    <DashboardCard
      title="Monthly Earnings"
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={60}
          width={"100%"}
        />
      }
    >
      <>
        {isLoading ? (
          <Typography variant="h3" fontWeight="700" mt="-20px">
            Loading...
          </Typography>
        ) : isError ? (
          <Typography variant="h3" fontWeight="700" mt="-20px" color="error">
            Error
          </Typography>
        ) : (
          <Typography variant="h3" fontWeight="700" mt="-20px">
            ${data.monthlyRevenue}
          </Typography>
        )}
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          {isLoading ? (
            <Typography variant="subtitle2" fontWeight="600">
              Loading...
            </Typography>
          ) : isError ? (
            <Typography variant="subtitle2" fontWeight="600" color="error">
              Error
            </Typography>
          ) : (
            <>
              {data.percentageChange >= 0 ? (
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
                  <IconArrowDownRight width={20} color="#FA896B" />
                </Avatar>
              )}

              <Typography variant="subtitle2" fontWeight="600">
                {data.percentageChange
                  ? `${data.percentageChange.toFixed(2)}%`
                  : "+0%"}
              </Typography>
            </>
          )}
          <Typography variant="subtitle2" color="textSecondary">
            last month
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
