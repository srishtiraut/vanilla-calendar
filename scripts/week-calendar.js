import { generateWeekDays, isTheSameDay, today } from "./date.js";
import { isEventAllDay, eventStartsBefore, eventEndsBefore, initDynamicEvent } from './event.js';
import { initEventList } from './event-list.js';

const calendarTemplateElement = document.querySelector("[data-template='week-calendar']");

const calendarDayOfWeekTemplateElement = document.querySelector("[data-template='week-calendar-day-of-week']");

const calendarAllDayListItemTemplateElement = document.querySelector("[data-template='week-calendar-all-day-list-item']");

const calendarColumnTemplateElement = document.querySelector("[data-template='week-calendar-column']");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: 'short'
});

export function initWeekCalendar(parent, selectedDate, eventStore, isSingleDay) {
    const calendarContent = calendarTemplateElement.content.cloneNode(true);

    const calendarElement = calendarContent.querySelector("[data-week-calendar]");

    const calendarDayofWeekListElement = calendarElement.querySelector("[data-week-calendar-day-of-week-list]");

    const calendarAllDayListElement = calendarElement.querySelector("[data-week-calendar-all-day-list]");

    const calendarColumnsElement = calendarElement.querySelector("[data-week-calendar-columns]");

    const weekDays = isSingleDay ? [selectedDate] : generateWeekDays(selectedDate);

    for (const weekDay of weekDays) {

        const events = eventStore.getEventsByDate(weekDay);
        const allDayEvents = events.filter((event) =>
            isEventAllDay(event)
        );
        const nonAllDayEvents = events.filter((event)=>!isEventAllDay(event));
        sortEventsByTime(nonAllDayEvents);

        initDayOfWeek(calendarDayofWeekListElement, selectedDate, weekDay);

        initAllDayListItem(calendarAllDayListElement, allDayEvents);

        initColumn(calendarColumnsElement, weekDay, events);
    }

    if (isSingleDay) {
        calendarElement.classList.add("week-calendar--day");
    }

    parent.appendChild(calendarElement);

}

function initDayOfWeek(parent, selectedDate, weekDay) {
    const calendarDayOfWeekContent = calendarDayOfWeekTemplateElement.content.cloneNode(true);

    const calendarDayOfWeekElement = calendarDayOfWeekContent.querySelector("[data-week-calendar-day-of-week]");

    const calendarDayOfWeekButtonElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-button]");

    const calendarDayOfWeekDayElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-day]");

    const calendarDayOfWeekNumberElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-number]");

    calendarDayOfWeekNumberElement.textContent = weekDay.getDate();
    calendarDayOfWeekDayElement.textContent = dateFormatter.format(weekDay);

    if (isTheSameDay(weekDay, today())) {
        calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--highlight");
    }


    parent.appendChild(calendarDayOfWeekElement);
}

function initAllDayListItem(parent, events) {
    const calendarAllDayListItemContent = calendarAllDayListItemTemplateElement.content.cloneNode(true);

    const calendarAllDayListItemElement = calendarAllDayListItemContent.querySelector("[data-week-calendar-all-day-list-item]");

    initEventList(calendarAllDayListItemElement, events);

    parent.appendChild(calendarAllDayListItemElement);
}

function initColumn(parent, weekDay, events) {
    const calendarColumnContent = calendarColumnTemplateElement.content.cloneNode(true);

    const calendarColumnElement = calendarColumnContent.querySelector("[data-week-calendar-column]");

    const calendarColumnCellElements = calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");

    const eventsWithDynamicStyles = calculateEventsDynamicStyles(events);
    for(const eventWithDynamicStyles of eventsWithDynamicStyles){
        initDynamicEvent(
            calendarColumnElement,
            eventWithDynamicStyles.event,
            eventWithDynamicStyles.styles
        );
    }

    parent.appendChild(calendarColumnElement);
}

function calculateEventsDynamicStyles(events){
    return events.map((event)=>({
        event,
        styles:{
            top: "12.5%",
            bottom: "75%",
            left: "0",
            right: "0%"
        }
    }))
}


function sortEventsByTime(events){
    events.sort((eventA, eventB)=>{
        if(eventStartsBefore(eventA, eventB)){
            return -1;
        }
        if(eventStartsBefore(eventB, eventA)){
            return 1;
        }

        return eventEndsBefore(eventA, eventB) ? 1 : -1;
    });
}