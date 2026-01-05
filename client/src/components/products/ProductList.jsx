import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Chip,
  Box,
} from "@mui/material";
import { Edit, Block, CheckCircle } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import customFetch from "../../utils/customFetch";

export default function ProductList({ onEdit }) {
  const [rows, setRows] = useState([]);

  const fetchProducts = async () => {
    const res = await customFetch.get("/products");
    setRows(res.data);
  };

  const handleToggle = async (row) => {
    await customFetch.patch(`/products/${row.id}/status`, {
      active: row.active ? 0 : 1,
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.category_name}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.brand}</TableCell>

              {/*  BARCODE IMAGE */}
              <TableCell>
                {row.barcode && (
                  <Box sx={{ textAlign: "center" }}>
                    <Barcode
                      value={row.barcode}
                      format="CODE128"
                      width={1.2}
                      height={40}
                      displayValue={false}
                    />
                    <Box sx={{ fontSize: 10 }}>{row.barcode}</Box>
                  </Box>
                )}
              </TableCell>

              {/* STATUS */}
              <TableCell>
                <Chip
                  label={row.active ? "Active" : "Inactive"}
                  color={row.active ? "success" : "default"}
                  size="small"
                />
              </TableCell>

              {/* ACTIONS */}
              <TableCell align="right">
                <IconButton onClick={() => onEdit(row)}>
                  <Edit />
                </IconButton>

                <IconButton onClick={() => handleToggle(row)}>
                  {row.active ? <Block /> : <CheckCircle />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
