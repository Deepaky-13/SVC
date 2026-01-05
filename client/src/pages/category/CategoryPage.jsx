import { useState } from "react";
import { Box, Typography } from "@mui/material";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryList from "../../components/category/CategoryList";

export default function CategoryPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Categories
      </Typography>

      <CategoryForm onSuccess={() => setRefresh(!refresh)} />
      <CategoryList refresh={refresh} />
    </Box>
  );
}
