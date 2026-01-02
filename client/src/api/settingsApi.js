import customFetch from "../utils/customFetch";

export const fetchSettings = () => customFetch.get("/settings");
export const saveSettings = (data) => customFetch.post("/settings", data);
