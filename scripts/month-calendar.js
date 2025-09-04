import { generateMonthCalendarDays, today, isTheSameDay } from "./date.js";
import { initEventList } from "./event-list.js";
import { isEventAllDay, eventStartsBefore } from "./event.js";


const calendarTemplateElement = document.querySelector("[data-template='month-calendar']");   //pick the <template> for month-view-calendar

const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");  //pick the <template> for a month's day

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

    const calendarWeekClass = calendarWeekClasses[calendarWeeks];       //calendarWeekClasses[4] or calendarWeekClasses[5] orcalendarWeekClasses[6]
    calendarElement.classList.add(calendarWeekClass);

    for (const calendarDay of calendarDays) {
        const events = eventStore.getEventsByDate(calendarDay);

        sortCalendarDayEvents(events);

        initCalendarDay(calendarDayListElement, calendarDay, events);
    }

    parent.appendChild(calendarElement);

}

function initCalendarDay(parent, calendarDay, events) {
    const calendarDayContent = calendarDayTemplateElement.content.cloneNode(true);
    const calendarDayElement = calendarDayContent.querySelector("[data-month-calendar-day]");
    const calendarDayLabelElement = calendarDayContent.querySelector("[data-month-calendar-day-label]");
    const calendarEventListWrapper = calendarDayElement.querySelector("[data-month-calendar-event-list-wrapper]");

    if (isTheSameDay(today(), calendarDay)) {
        calendarDayElement.classList.add("month-calendar__day--highlight");
    }

    // dynamically inject the dates(as in day number) for given month
    calendarDayLabelElement.textContent = calendarDay.getDate();

    calendarDayLabelElement.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                date: calendarDay
            },
            bubbles: true
        }));

        document.dispatchEvent(new CustomEvent("view-change", {
            detail: {
                view: 'day'
            },
            bubbles: true
        }));

    });

    calendarEventListWrapper.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent('event-create-request', {
            detail: {
                date: calendarDay,
                startTime: 600,
                endTime: 960
            },
            bubbles: true
        }));
    });

    initEventList(calendarDayElement, events);

    parent.appendChild(calendarDayElement);     //Adds a new calendarDay element to the end of the calendar(parent element)’s children.
}

function sortCalendarDayEvents(events) {
    events.sort((eventA, eventB) => {
        if (isEventAllDay(eventA)) {
            return -1;
        }

        if (isEventAllDay(eventB)) {
            return 1;
        }

        return eventStartsBefore(eventA, eventB) ? -1 : 1;
    });
}