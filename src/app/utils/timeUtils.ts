function parseTimeString(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}
  
function getRandomTimeBetween(startTime: number, endTime: number, interval: number): number {
  const range = Math.floor((endTime - startTime) / interval);
  const randomIndex = Math.floor(Math.random() * (range + 1));
  return startTime + randomIndex * interval;
}

function padZero(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}
  
function formatTime(timeInMinutes: number): string {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${padZero(hours)}:${padZero(minutes)}`;
}

function getRandomIntRange(min: number, max: number): number {
  const range = max - min;
  return Math.floor(Math.random() * (range + 1)) + min;
}


export function getClosestDate(dayOfWeek: string, timeStr: string): Date {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = days.indexOf(dayOfWeek);

  if (dayIndex === -1) {
    throw new Error('Invalid day of week');
  }

  // Current date and time
  const now = new Date();
  const currentDayIndex = now.getDay();

  // Calculate how many days to add to get to the next occurrence of the specified day
  let daysToAdd = dayIndex - currentDayIndex;
  if (daysToAdd < 0 || (daysToAdd === 0 && now.getHours() * 60 + now.getMinutes() > parseTimeString(timeStr))) {
    daysToAdd += 7;
  }

  // Create a new Date object for the next occurrence of the day
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + daysToAdd);

  // Set the time
  const [hours, minutes] = timeStr.split(':').map(Number);
  nextDay.setHours(hours, minutes, 0, 0);

  return nextDay;
}

interface ITimeRange {
  start: string,
  end: string;
}

interface IGetRandomTimeInRange {
  [key: string] : ITimeRange[]; 
}

export function getRandomTimeInRange(schedule: IGetRandomTimeInRange) {
  // Get the day of the week
  const interval = 15;
  const availableDays = Object.keys(schedule).filter(key => schedule[key].length > 0);
  //if availableDays 0 ???
  const randomDayOfWeekIndex = getRandomIntRange(0, availableDays.length - 1);
  const randomKey = availableDays[randomDayOfWeekIndex];
  const { start, end } = schedule[randomKey][0];
  const startTime = parseTimeString(start);
  const endTime = parseTimeString(end);
  const randomTime = getRandomTimeBetween(startTime,  endTime - interval, interval);

  return [randomKey, formatTime(randomTime)];
}

export const getRandomTimeInBetweenRange = (schedule: IGetRandomTimeInRange) => {
  const randomDayTime = getRandomTimeInRange(schedule);
  return getClosestDate(randomDayTime[0], randomDayTime[1]);
};

