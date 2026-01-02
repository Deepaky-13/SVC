import { getSettings, saveSettings } from "../models/settingsModel.js";

export const fetchSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    await saveSettings(req.body);
    res.json({ message: "Settings saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
