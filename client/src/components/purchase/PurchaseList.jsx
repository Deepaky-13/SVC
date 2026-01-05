import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Collapse,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function PurchaseList({ refresh }) {
  const [rows, setRows] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [items, setItems] = useState({});

  useEffect(() => {
    const fetchPurchases = async () => {
      const res = await customFetch.get("/purchases");
      setRows(res.data);
    };
    fetchPurchases();
  }, [refresh]);

  const toggleRow = async (id) => {
    if (openRow === id) {
      setOpenRow(null);
      return;
    }

    setOpenRow(id);

    if (!items[id]) {
      const res = await customFetch.get(`/purchases/${id}/items`);
      setItems((prev) => ({ ...prev, [id]: res.data }));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Supplier</TableCell>
            <TableCell>Invoice No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <>
              {/* MAIN ROW */}
              <TableRow key={row.id} hover>
                <TableCell>
                  <IconButton size="small" onClick={() => toggleRow(row.id)}>
                    {openRow === row.id ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </TableCell>

                <TableCell>{row.supplier_name}</TableCell>
                <TableCell>{row.invoice_no}</TableCell>
                <TableCell>
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>₹{row.total_amount}</TableCell>
              </TableRow>

              {/* EXPANDED ROW */}
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0 }}>
                  <Collapse
                    in={openRow === row.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ m: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Purchased Items
                      </Typography>

                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>GST</TableCell>
                            <TableCell>MRP</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {(items[row.id] || []).map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.purchase_price}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.gst}</TableCell>
                              <TableCell>{item.mrp}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
