type RawSlotFormat1 = {
  date: string;
  times: string[];
  doctor: { name: string; id: string };
  type: string;
};

type RawSlotFormat2 = {
  available_on: string;
  slots: { start: string; end: string }[];
  provider: string;
  category: string;
};

type UnifiedSlot = {
  date: string;        // in YYYY-MM-DD
  start_time: string;  // "HH:mm"
  provider: string;
};

export function normalizeSlots(
  rawData: (RawSlotFormat1 | RawSlotFormat2)[]
): UnifiedSlot[] {
  const normalized: UnifiedSlot[] = [];

  for (const item of rawData) {
    // Check if it matches format 1 (has 'date' and 'times')
    if ("date" in item && "times" in item && "doctor" in item) {
      const date = item.date;
      const provider = item.doctor.name;
      item.times.forEach((time) => {
        normalized.push({
          date,
          start_time: time,
          provider,
        });
      });
    } 
    // else assume format 2 (has 'available_on' and 'slots')
    else if ("available_on" in item && "slots" in item && "provider" in item) {
      // Convert date format from '2025/07/21' to '2025-07-21'
      const date = item.available_on.replace(/\//g, "-");
      const provider = item.provider;
      item.slots.forEach((slot) => {
        normalized.push({
          date,
          start_time: slot.start,
          provider,
        });
      });
    }
  }

  return normalized;
}