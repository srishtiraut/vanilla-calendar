import { generateMonthCalendarDays } from "./date.js";

const calendarTemplateElement = document.querySelector("[data-template='month-calendar']");

const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");

export function initMonthCalendar(parent, selectedDate) {
    const calendarContent = calendarTemplateElement.content.cloneNode(true);
    const calendarElement = calendarContent.querySelector("[data-month-calendar]");
    const calendarDayListElement = calendarElement.querySelector("[data-month-calendar-day-list]");

    const calendarDays = generateMonthCalendarDays(selectedDate);

    for(const calendarDay of calendarDays){
        initCalendarDay(calendarDayListElement, calendarDay);
    }

    parent.appendChild(calendarElement);

}

function initCalendarDay(parent, calendarDay){
    const calendarDayContent = calendarDayTemplateElement.content.cloneNode(true);
    const calendarDayElement = calendarDayContent.querySelector("[data-month-calendar-day]");
    const calendarDayLabelElement = calendarDayContent.querySelector("[data-month-calendar-day-label]");

    calendarDayLabelElement.textContent = calendarDay.getDate();

    parent.appendChild(calendarDayElement);
}