import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Chip,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";

const STATUSES = ["RECEIVED", "IN_PROGRESS", "READY", "DELIVERED"];

export default function ServiceList({ refresh }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchServices = async () => {
    const res = await customFetch.get("/services");
    setRows(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await customFetch.patch(`/services/${id}/status`, { status });
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, [refresh]);

  return (
    <TableContainer component={Paper}>
      <Typography sx={{ p: 2 }} variant="h6">
        Service Jobs
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.device_model}</TableCell>

              <TableCell>
                <Select
                  size="small"
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              <TableCell>
                {new Date(row.created_at).toLocaleDateString()}
              </TableCell>

              {/* VIEW DETAILS */}
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/services/${row.id}`)}
                >
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {!rows.length && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No service jobs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
