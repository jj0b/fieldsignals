// Common timezones for the weekly brief delivery window
export const TIMEZONE_OPTIONS = [
  { value: "America/Toronto", label: "Eastern (Toronto)" },
  { value: "America/Vancouver", label: "Pacific (Vancouver)" },
  { value: "America/Edmonton", label: "Mountain (Edmonton)" },
  { value: "America/Winnipeg", label: "Central (Winnipeg)" },
  { value: "America/St_Johns", label: "Newfoundland" },
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "UTC", label: "UTC" },
] as const;
