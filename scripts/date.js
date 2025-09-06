export function today() {

    //Returns today's date set to 12:00 PM.

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12
    );
}

export function addMonths(date, months) {

    //Returns a new Date by adding a given number of months to the provided date.

    const firstDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1,
        date.getHours()
    );
    const lastDayOfMonth = getLastDayOfMonthDate(firstDayOfMonth);

    const dayOfMonth = Math.min(date.getDate(), lastDayOfMonth.getDate());

    return new Date(
        date.getFullYear(),
        date.getMonth() + months,
        dayOfMonth,
        date.getHours()
    );
}

export function subtractMonths(date, months) {
    return addMonths(date, -months);
}

export function addDays(date, days) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days,
        date.getHours()
    );
}

export function subtractDays(date, days) {
    return addDays(date, -days);
}

export function generateMonthCalendarDays(currentDate) {
    const calendarDays = [];
    const lastDayofPreviousMonthDate = getLastDayOfMonthDate(subtractMonths(currentDate, 1));
    const lastDayofPreviousMonthWeekDay = lastDayofPreviousMonthDate.getDay();

    //Find out trailing days from the previous month (if needed)
    if (lastDayofPreviousMonthWeekDay !== 6) {
        for (let i = lastDayofPreviousMonthWeekDay; i >= 0; i -= 1) {
            const calendarDay = subtractDays(lastDayofPreviousMonthDate, i);
            calendarDays.push(calendarDay);
        }
    }

    //Pick all days of the current month
    const lastDayofCurrentMonthDate = getLastDayOfMonthDate(currentDate);
    for (let i = 1; i <= lastDayofCurrentMonthDate.getDate(); i += 1) {
        const calendarDay = addDays(lastDayofPreviousMonthDate, i);
        calendarDays.push(calendarDay);
    }

    //Calculate total weeks needed
    const totalWeeks = Math.ceil(calendarDays.length / 7);
    const totalDays = totalWeeks * 7;
    const missingDayAmount = totalDays - calendarDays.length;

    for (let i = 1; i <= missingDayAmount; i += 1) {
        const calendarDay = addDays(lastDayofCurrentMonthDate, i);
        calendarDays.push(calendarDay);

    }

    return calendarDays;
}

export function isTheSameDay(dateA, dateB) {
    return dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate();
}

export function generateWeekDays(date) {

    //Returns the final array containing all 7 dates of the week, in order from Sunday → Saturday.

    const weekDays = [];
    const firstWeekDay = subtractDays(date, date.getDay());         //date.getDay() returns the day of the week as a number

    for (let i = 0; i <= 6; i++) {
        const weekDay = addDays(firstWeekDay, i);
        weekDays.push(weekDay);
    }

    return weekDays;
}

function getLastDayOfMonthDate(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,    //next month
        0,      //The day before the 1st of the ,here, next month
        12
    );
}