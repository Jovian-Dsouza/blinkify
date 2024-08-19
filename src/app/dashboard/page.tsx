"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
// components
import SalesOverview from "@/app/dashboard/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/dashboard/components/dashboard/YearlyBreakup";
import ProductPerformance from "@/app/dashboard/components/dashboard/ProductPerformance";
import MonthlyEarnings from "@/app/dashboard/components/dashboard/MonthlyEarnings";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid> */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
