import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import customFetch from "../../utils/customFetch";

export default function CategoryForm({ onSuccess }) {
  const [name, setName] = useState("");

  const submit = async () => {
    await customFetch.post("/categories", { name });
    setName("");
    onSuccess();
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
      />
      <Button variant="contained" onClick={submit}>
        Add
      </Button>
    </Stack>
  );
}
