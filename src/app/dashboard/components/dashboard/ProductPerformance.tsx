import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import { useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { useCluster } from "@/providers/cluster-provider";


const ProductPerformance = () => {
  // Get session
  const { cluster } = useCluster();
  const { status } = useSession();
  const {
    data: products = [],
    isLoading,
    isError,
  } = trpc.getProductPerformance.useQuery({ network: cluster.networkName });

  if (status === "unauthenticated") {
    return (
      <DashboardCard title="Product Performance">
        <Typography variant="h6" color="error">
          You need to be authenticated to view this data.
        </Typography>
      </DashboardCard>
    );
  }

  if (isLoading) {
    return (
      <DashboardCard title="Product Performance">
        <Typography variant="h6">Loading...</Typography>
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="Product Performance">
        <Typography variant="h6" color="error">
          Failed to load data.
        </Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Product Performance">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {products.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No products found.
          </Typography>
        ) : (
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Active
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Sales
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Revenue
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor: product.active
                          ? "success.main"
                          : "error.main",
                        color: "#fff",
                      }}
                      size="small"
                      label={product.active ? "Active" : "Inactive"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" color="textSecondary">
                      {product.saleCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${product.revenue}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
