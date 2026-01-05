import Barcode from "react-barcode";
import { Box, Typography } from "@mui/material";

export default function BarcodePrint({ product }) {
  return (
    <Box sx={{ textAlign: "center", p: 1 }}>
      <Typography fontSize={12}>{product.name}</Typography>
      <Barcode value={product.barcode} format="CODE128" height={50} />
      <Typography fontSize={10}>{product.barcode}</Typography>
    </Box>
  );
}
