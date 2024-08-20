import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft, IconArrowDownRight } from "@tabler/icons-react";
import { useSession } from "next-auth/react"; // Import useSession
import { trpc } from "@/app/_trpc/client";
import { useCluster } from "@/providers/cluster-provider";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";

const YearlyBreakup = () => {
  // Get session
  const { status } = useSession();
  const { cluster } = useCluster();

  // Fetch yearly revenue data
  const { data, isLoading, isError } = trpc.getYearlyRevenue.useQuery({
    network: cluster.networkName,
  });

  // Masked values
  const maskedValue = "****";
  const maskedPercentage = "+**%";

  // Chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;
  const errorlight = "#fdede8";

  // Chart options
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  // Default series data
  const seriescolumnchart: any = [0, 0, 0];

  // Loading and error states
  if (isLoading) {
    return (
      <DashboardCard title="Yearly Breakup">
        <>
          <Typography variant="h3" fontWeight="700" mt="-20px">
            Loading...
          </Typography>
          <Stack direction="row" spacing={1} my={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600">
              Loading...
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={7} sm={7}>
              <Typography variant="h3" fontWeight="700">
                Loading...
              </Typography>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={150}
                width={"100%"}
              />
            </Grid>
          </Grid>
        </>
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="Yearly Breakup">
        <>
          <Typography variant="h3" fontWeight="700" mt="-20px" color="error">
            Error
          </Typography>
          <Stack direction="row" spacing={1} my={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600" color="error">
              Error loading data
            </Typography>
          </Stack>
        </>
      </DashboardCard>
    );
  }

  // Determine percentage change from previous year
  const percentageChange = data?.percentageChange ?? 0;
  const isPositiveChange = percentageChange >= 0;

  return (
    <DashboardCard title="Yearly Breakup">
      <Grid container spacing={3}>
        {/* Column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {status === "authenticated"
              ? `$${data?.yearlyRevenue || 0}`
              : maskedValue}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar
              sx={{
                bgcolor: isPositiveChange ? successlight : errorlight,
                width: 27,
                height: 27,
              }}
            >
              {isPositiveChange ? (
                <IconArrowUpLeft width={20} color="#39B69A" />
              ) : (
                <IconArrowDownRight width={20} color="#FA896B" />
              )}
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {status === "authenticated"
                ? `${percentageChange.toFixed(2)}%`
                : maskedPercentage}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {status === "authenticated" ? "last year" : "last year"}
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2023
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primarylight,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2024
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* Column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
