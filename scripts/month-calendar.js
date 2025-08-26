import { generateMonthCalendarDays, today, isTheSameDay } from "./date.js";
import { initEventList } from "./event-list.js";


const calendarTemplateElement = document.querySelector("[data-template='month-calendar']");

const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");

const calendarWeekClasses = {
    4: "four-week",
    5: "five-week",
    6: "six-week"
};

export function initMonthCalendar(parent, selectedDate, eventStore) {
    const calendarContent = calendarTemplateElement.content.cloneNode(true);
    const calendarElement = calendarContent.querySelector("[data-month-calendar]");
    const calendarDayListElement = calendarElement.querySelector("[data-month-calendar-day-list]");

    const calendarDays = generateMonthCalendarDays(selectedDate);
    const calendarWeeks = calendarDays / 7;

    const calendarWeekClass = calendarWeekClasses[calendarWeeks];
    calendarElement.classList.add(calendarWeekClass);

    for (const calendarDay of calendarDays) {
        const events = eventStore.getEventsByDate(calendarDay);


        console.log(events);


        initCalendarDay(calendarDayListElement, calendarDay, events);
    }

    parent.appendChild(calendarElement);

}

function initCalendarDay(parent, calendarDay, events) {
    const calendarDayContent = calendarDayTemplateElement.content.cloneNode(true);
    const calendarDayElement = calendarDayContent.querySelector("[data-month-calendar-day]");
    const calendarDayLabelElement = calendarDayContent.querySelector("[data-month-calendar-day-label]");

    if (isTheSameDay(today(), calendarDay)) {
        calendarDayElement.classList.add("month-calendar__day--highlight");
    }

    calendarDayLabelElement.textContent = calendarDay.getDate();

    initEventList(calendarDayElement, events);

    parent.appendChild(calendarDayElement);
}