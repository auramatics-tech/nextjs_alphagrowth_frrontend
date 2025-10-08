export const timeZones = [
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "UTC", label: "UTC" },
  { value: "GMT", label: "GMT" },
  { value: "Asia/Kolkata", label: "IST" },
  { value: "Europe/Paris", label: "CET" },
  { value: "Asia/Tokyo", label: "JST" },
  { value: "Australia/Sydney", label: "AEST" }
];

export const daysOfWeek = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export const generateEightHourShifts = () => {
  const slots = [];
  
  for (let start = 0; start <= 16; start++) {
    const end = (start + 8) % 24;
    slots.push(`${formatTime(start)} - ${formatTime(end)}`);
  }
  
  return slots;
};

export const formatTime = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const adjusted = hour % 12 === 0 ? 12 : hour % 12;
  return `${adjusted}:00 ${suffix}`;
};

