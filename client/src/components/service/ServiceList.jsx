// components/services/ServiceList.jsx
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";

const STATUS_FLOW = ["RECEIVED", "IN_PROGRESS", "READY", "DELIVERED"];

export default function ServiceList() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    customFetch.get("/services").then((res) => setRows(res.data || []));
  }, []);

  const updateStatus = async (id, status) => {
    await customFetch.patch(`/services/${id}/status`, { status });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const nextStatuses = (current) =>
    STATUS_FLOW.slice(STATUS_FLOW.indexOf(current));

  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Change</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.customer_name}</TableCell>
              <TableCell>{r.device_model}</TableCell>
              <TableCell>
                <Chip label={r.status} size="small" />
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={r.status}
                  disabled={r.status === "DELIVERED"}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                >
                  {nextStatuses(r.status).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => navigate(`/services/${r.id}`)}>
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
