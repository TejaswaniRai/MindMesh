// Time slots constant that can be imported by other files
export const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
] as const;

export type TimeSlot = typeof TIME_SLOTS[number];

// In-memory store for classroom schedules
interface BookingDetails {
  batchName: string;
  teacherName?: string;
  courseName?: string;
  startTime?: string;
  endTime?: string;
}

interface DailySchedule {
  [roomNumber: string]: {
    [timeSlot in TimeSlot]?: BookingDetails | null;
  };
}

interface ScheduleStore {
  dates: {
    [date: string]: DailySchedule;
  };
}

// Optional external JSON overrides for recurring classes
// Structure matches RECURRING_REGULAR_CLASSES below
// If file is empty or missing keys, defaults are used
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON import typing
import regularClassesRaw from '@/lib/regular-classes.json';

// Recurring regular classes by weekday (1 = Monday ... 5 = Friday)
// Keys are room numbers used by the app (e.g., "CSE-101"). Adjust to match your rooms.
// These represent the standard timetable and should make rooms unavailable.
const RECURRING_REGULAR_CLASSES: Record<
  number,
  Record<string, Partial<Record<TimeSlot, BookingDetails>>>
> = {
  // Monday
  1: {
    'CSE-101': {
      '09:00-10:00': { batchName: 'CS2024A', courseName: 'CS101' },
      '10:00-11:00': { batchName: 'CS2024B', courseName: 'CS201' }
    },
    'CSE-102': {
      '11:00-12:00': { batchName: 'DS2024A', courseName: 'DS201' }
    },
    'CSE-103': {
      '14:00-15:00': { batchName: 'MATH2024A', courseName: 'MATH101' }
    },
    'CSE-104': {
      '15:00-16:00': { batchName: 'WEB2024A', courseName: 'WEB101' }
    },
    'CSE-201': {
      '16:00-17:00': { batchName: 'SE2024A', courseName: 'SE101' }
    }
  },
  // Tuesday
  2: {
    'CSE-101': {
      '11:00-12:00': { batchName: 'CS2024C', courseName: 'CS301' }
    },
    'CSE-102': {
      '09:00-10:00': { batchName: 'MATH2024A', courseName: 'STAT201' }
    },
    'CSE-201': {
      '14:00-15:00': { batchName: 'AI2024A', courseName: 'AI101' },
      '15:00-16:00': { batchName: 'AI2024A', courseName: 'ML201' }
    },
    'CSE-202': {
      '10:00-11:00': { batchName: 'WEB2024B', courseName: 'WEB201' }
    }
  },
  // Wednesday
  3: {
    'CSE-103': {
      '09:00-10:00': { batchName: 'DS2024B', courseName: 'DS101' },
      '10:00-11:00': { batchName: 'DS2024B', courseName: 'DS201' }
    },
    'CSE-104': {
      '14:00-15:00': { batchName: 'SE2024A', courseName: 'SE201' }
    },
    'CSE-203': {
      '15:00-16:00': { batchName: 'CSEC2024A', courseName: 'CSEC201' }
    }
  },
  // Thursday
  4: {
    'CSE-101': {
      '14:00-15:00': { batchName: 'CS2024A', courseName: 'DB201' }
    },
    'CSE-102': {
      '15:00-16:00': { batchName: 'CS2024C', courseName: 'CSEC101' }
    },
    'CSE-201': {
      '09:00-10:00': { batchName: 'AI2024B', courseName: 'AI301' }
    },
    'CSE-202': {
      '11:00-12:00': { batchName: 'WEB2024A', courseName: 'WEB301' }
    }
  },
  // Friday
  5: {
    'CSE-101': {
      '09:00-10:00': { batchName: 'CS2024B', courseName: 'ALGO201' }
    },
    'CSE-103': {
      '10:00-11:00': { batchName: 'MATH2024B', courseName: 'MATH101' }
    },
    'CSE-104': {
      '11:00-12:00': { batchName: 'WEB2024A', courseName: 'WEB201' }
    },
    'CSE-201': {
      '14:00-15:00': { batchName: 'DB2024A', courseName: 'DB301' }
    },
    'CSE-202': {
      '15:00-16:00': { batchName: 'DB2024A', courseName: 'DB201' }
    }
  }
};

type RegularClassesMap = Record<number, Record<string, Partial<Record<TimeSlot, BookingDetails>>>>;

function coerceRegularClasses(raw: unknown): RegularClassesMap | null {
  try {
    const obj = raw as Record<string, Record<string, Partial<Record<string, BookingDetails>>>>;
    if (!obj || typeof obj !== 'object') return null;
    const out: RegularClassesMap = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    Object.entries(obj).forEach(([dayKey, rooms]) => {
      const dayNum = Number(dayKey) as 1 | 2 | 3 | 4 | 5;
      if (![1,2,3,4,5].includes(dayNum)) return;
      out[dayNum] = {};
      Object.entries(rooms || {}).forEach(([room, slots]) => {
        out[dayNum][room] = {};
        Object.entries(slots || {}).forEach(([slot, booking]) => {
          if ((TIME_SLOTS as readonly string[]).includes(slot)) {
            const b = booking as any;
            const normalized: BookingDetails = {
              batchName: b?.batchName ?? b?.batch_name ?? '',
              teacherName: b?.teacherName ?? b?.teacher_name ?? b?.TeacherName,
              courseName: b?.courseName ?? b?.course ?? b?.Course,
              startTime: b?.startTime ?? b?.start_time,
              endTime: b?.endTime ?? b?.end_time
            };
            (out[dayNum][room] as Partial<Record<TimeSlot, BookingDetails>>)[slot as TimeSlot] = normalized;
          }
        });
      });
    });
    return out;
  } catch {
    return null;
  }
}

const EXTERNAL_REGULAR_CLASSES = coerceRegularClasses(regularClassesRaw);

// Staff rooms that must not be bookable
const STAFF_ROOMS: string[] = ['CSE-103', 'CSE-104', 'CSE-203'];
export function isStaffRoom(roomNumber: string): boolean {
  return STAFF_ROOMS.includes(roomNumber);
}

// Initialize with empty schedule
const initializeSchedule = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  const schedule: ScheduleStore = {
    dates: {
      [todayStr]: {
        '101': {
          '09:00-10:00': { batchName: 'CS2024A', teacherName: 'Dr. Sarah Johnson', courseName: 'CS101' },
          '10:00-11:00': { batchName: 'CS2024B', teacherName: 'Dr. Sarah Johnson', courseName: 'CS201' },
          '11:00-12:00': null,
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'CS2024A', teacherName: 'Prof. Michael Chen', courseName: 'MATH101' },
          '15:00-16:00': null,
          '16:00-17:00': null
        },
        '102': {
          '09:00-10:00': null,
          '10:00-11:00': { batchName: 'DS2024A', teacherName: 'Dr. Maria Garcia', courseName: 'DS101' },
          '11:00-12:00': { batchName: 'DS2024A', teacherName: 'Dr. Maria Garcia', courseName: 'DS201' },
          '12:00-13:00': null,
          '14:00-15:00': null,
          '15:00-16:00': { batchName: 'WEB2024A', teacherName: 'Dr. Lisa Wang', courseName: 'WEB101' },
          '16:00-17:00': { batchName: 'WEB2024A', teacherName: 'Dr. Lisa Wang', courseName: 'WEB201' }
        },
        '201': {
          '09:00-10:00': { batchName: 'CS2024C', teacherName: 'Prof. David Thompson', courseName: 'SE101' },
          '10:00-11:00': { batchName: 'CS2024C', teacherName: 'Prof. David Thompson', courseName: 'SE201' },
          '11:00-12:00': null,
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'AI2024A', teacherName: 'Prof. Alex Rodriguez', courseName: 'AI101' },
          '15:00-16:00': { batchName: 'AI2024A', teacherName: 'Prof. Alex Rodriguez', courseName: 'ML201' },
          '16:00-17:00': null
        }
      },
      [tomorrowStr]: {
        '101': {
          '09:00-10:00': { batchName: 'CS2024B', teacherName: 'Dr. Sarah Johnson', courseName: 'CS301' },
          '10:00-11:00': null,
          '11:00-12:00': { batchName: 'CS2024A', teacherName: 'Dr. Emily Davis', courseName: 'DB101' },
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'CS2024A', teacherName: 'Dr. Emily Davis', courseName: 'DB201' },
          '15:00-16:00': null,
          '16:00-17:00': { batchName: 'CS2024C', teacherName: 'Prof. James Wilson', courseName: 'CSEC101' }
        },
        '102': {
          '09:00-10:00': { batchName: 'MATH2024A', teacherName: 'Prof. Michael Chen', courseName: 'MATH101' },
          '10:00-11:00': { batchName: 'MATH2024A', teacherName: 'Prof. Michael Chen', courseName: 'STAT301' },
          '11:00-12:00': null,
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'WEB2024B', teacherName: 'Dr. Lisa Wang', courseName: 'WEB301' },
          '15:00-16:00': null,
          '16:00-17:00': { batchName: 'DS2024B', teacherName: 'Dr. Maria Garcia', courseName: 'DS301' }
        },
        '201': {
          '09:00-10:00': null,
          '10:00-11:00': { batchName: 'AI2024B', teacherName: 'Prof. Alex Rodriguez', courseName: 'AI301' },
          '11:00-12:00': { batchName: 'AI2024B', teacherName: 'Prof. Alex Rodriguez', courseName: 'ML201' },
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'CSEC2024A', teacherName: 'Prof. James Wilson', courseName: 'CSEC201' },
          '15:00-16:00': { batchName: 'CSEC2024A', teacherName: 'Prof. James Wilson', courseName: 'CSEC301' },
          '16:00-17:00': null
        }
      },
      [dayAfterStr]: {
        '101': {
          '09:00-10:00': { batchName: 'CS2024A', teacherName: 'Dr. Sarah Johnson', courseName: 'CS201' },
          '10:00-11:00': { batchName: 'CS2024A', teacherName: 'Dr. Sarah Johnson', courseName: 'CS301' },
          '11:00-12:00': null,
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'SE2024A', teacherName: 'Prof. David Thompson', courseName: 'SE301' },
          '15:00-16:00': null,
          '16:00-17:00': { batchName: 'MATH2024B', teacherName: 'Prof. Michael Chen', courseName: 'MATH101' }
        },
        '102': {
          '09:00-10:00': null,
          '10:00-11:00': { batchName: 'WEB2024A', teacherName: 'Dr. Lisa Wang', courseName: 'WEB201' },
          '11:00-12:00': { batchName: 'WEB2024A', teacherName: 'Dr. Lisa Wang', courseName: 'WEB301' },
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'DS2024A', teacherName: 'Dr. Maria Garcia', courseName: 'DS201' },
          '15:00-16:00': { batchName: 'DS2024A', teacherName: 'Dr. Maria Garcia', courseName: 'DS301' },
          '16:00-17:00': null
        },
        '201': {
          '09:00-10:00': { batchName: 'AI2024A', teacherName: 'Prof. Alex Rodriguez', courseName: 'AI201' },
          '10:00-11:00': null,
          '11:00-12:00': { batchName: 'AI2024A', teacherName: 'Prof. Alex Rodriguez', courseName: 'AI301' },
          '12:00-13:00': null,
          '14:00-15:00': { batchName: 'DB2024A', teacherName: 'Dr. Emily Davis', courseName: 'DB301' },
          '15:00-16:00': { batchName: 'DB2024A', teacherName: 'Dr. Emily Davis', courseName: 'DB201' },
          '16:00-17:00': null
        }
      }
    }
  };

  return schedule;
};

// In-memory store for classroom schedules
let scheduleStore: ScheduleStore | null = null;

// Load or initialize schedule
export function getScheduleStore(): ScheduleStore {
  if (scheduleStore) {
    return scheduleStore;
  }
  
  // If store is not initialized, create a new one
  scheduleStore = initializeSchedule();
  return scheduleStore;
}

// Save schedule to in-memory store
export function saveSchedule(schedule: ScheduleStore): void {
  scheduleStore = schedule;
}

// Helper function to get current time slot
export function getCurrentTimeSlot(): string {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  // Map current time to a time slot
  if (hour < 9 || (hour === 9 && minutes < 0)) return "09:00-10:00";
  if (hour < 10 || (hour === 10 && minutes < 0)) return "10:00-11:00";
  if (hour < 11 || (hour === 11 && minutes < 0)) return "11:00-12:00";
  if (hour < 12 || (hour === 12 && minutes < 0)) return "12:00-13:00";
  if (hour < 14 || (hour === 14 && minutes < 0)) return "14:00-15:00";
  if (hour < 15 || (hour === 15 && minutes < 0)) return "15:00-16:00";
  return "16:00-17:00";
}

// Helper function to get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper function to get schedule for a specific date
export function getScheduleForDate(date: string): DailySchedule {
  const store = getScheduleStore();
  if (!store.dates[date]) {
    // Initialize empty schedule for this date if it doesn't exist
    store.dates[date] = {};
  }
  return store.dates[date];
}

// Merge recurring regular classes for the date into the ad-hoc schedule for that date
// Explicit bookings in the dated schedule take precedence over recurring entries
export function getMergedScheduleForDate(date: string): DailySchedule {
  const daily = { ...getScheduleForDate(date) } as DailySchedule;

  const day = new Date(date).getDay();
  // Map JS getDay (Mon=1..Fri=5); ignore weekends
  if (day === 0 || day === 6) {
    return daily;
  }

  const recurringForWeekday = (EXTERNAL_REGULAR_CLASSES || RECURRING_REGULAR_CLASSES)[day as 1 | 2 | 3 | 4 | 5] || {};

  Object.entries(recurringForWeekday).forEach(([roomNumber, slots]) => {
    if (!daily[roomNumber]) {
      daily[roomNumber] = {};
    }
    Object.entries(slots).forEach(([timeSlot, booking]) => {
      const slotKey = timeSlot as TimeSlot;
      // Only apply recurring booking if there is not an explicit booking already
      if (daily[roomNumber][slotKey] === undefined || daily[roomNumber][slotKey] === null) {
        if (booking) {
          daily[roomNumber][slotKey] = booking as BookingDetails;
        }
      }
    });
  });

  return daily;
}

// Check if a proposed booking conflicts with recurring regular classes for a given date
export function hasRecurringConflict(date: string, roomNumber: string, timeSlot: TimeSlot): boolean {
  const day = new Date(date).getDay();
  if (day === 0 || day === 6) return false;
  const recurringForWeekday = (EXTERNAL_REGULAR_CLASSES || RECURRING_REGULAR_CLASSES)[day as 1 | 2 | 3 | 4 | 5] || {};
  const roomRecurring = recurringForWeekday[roomNumber];
  if (!roomRecurring) return false;
  return Boolean(roomRecurring[timeSlot]);
}
