import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { List, ListItem, Paper } from "@mui/material";

export default function CategoryList({ refresh }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    customFetch.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, [refresh]);

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {categories.map((c) => (
          <ListItem key={c.id}>{c.name}</ListItem>
        ))}
      </List>
    </Paper>
  );
}
