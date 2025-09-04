import { generateWeekDays, isTheSameDay, today } from "./date.js";
import { isEventAllDay, eventStartsBefore, eventEndsBefore, initDynamicEvent, eventCollidesWith, adjustDynamicEventMaxLines } from './event.js';
import { initEventList } from './event-list.js';

const calendarTemplateElement = document.querySelector("[data-template='week-calendar']");  //pick the <template> for week-view-calendar
const calendarDayOfWeekTemplateElement = document.querySelector("[data-template='week-calendar-day-of-week']");
const calendarAllDayListItemTemplateElement = document.querySelector("[data-template='week-calendar-all-day-list-item']");
const calendarColumnTemplateElement = document.querySelector("[data-template='week-calendar-column']");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: 'short'
});

export function initWeekCalendar(parent, selectedDate, eventStore, isSingleDay, deviceType) {
    const calendarContent = calendarTemplateElement.content.cloneNode(true);
    const calendarElement = calendarContent.querySelector("[data-week-calendar]");
    const calendarDayofWeekListElement = calendarElement.querySelector("[data-week-calendar-day-of-week-list]");
    const calendarAllDayListElement = calendarElement.querySelector("[data-week-calendar-all-day-list]");
    const calendarColumnsElement = calendarElement.querySelector("[data-week-calendar-columns]");
    const weekDays = isSingleDay ? [selectedDate] : generateWeekDays(selectedDate);

    for (const weekDay of weekDays) {
        const events = eventStore.getEventsByDate(weekDay);     //fetch all events of a weekDay

        /*
        Separate events into:
        allDayEvents → events like "Holiday".
        nonAllDayEvents → events with specific times.
        */
        const allDayEvents = events.filter((event) =>
            isEventAllDay(event)
        );
        const nonAllDayEvents = events.filter((event) => !isEventAllDay(event));
        sortEventsByTime(nonAllDayEvents);

        //Render day labels at the top
        initDayOfWeek(calendarDayofWeekListElement, selectedDate, weekDay, deviceType);

        if (deviceType === "desktop" || (deviceType === "mobile" && isTheSameDay(weekDay, selectedDate))) {
            //Render All-day events
            initAllDayListItem(calendarAllDayListElement, allDayEvents);

            //Render Timed event column
            initColumn(calendarColumnsElement, weekDay, nonAllDayEvents);
        }
    }

    if (isSingleDay) {
        calendarElement.classList.add("week-calendar--day");
    }

    parent.appendChild(calendarElement);        //insert this week calendar cookie into the calendar parent mould

    //Prevent event title from overflowing
    const dynamicEventElements = calendarElement.querySelectorAll("[data-event-dynamic]");
    for (const dynamicEventElement of dynamicEventElements) {
        adjustDynamicEventMaxLines(dynamicEventElement);
    }

}

function initDayOfWeek(parent, selectedDate, weekDay, deviceType) {
    const calendarDayOfWeekContent = calendarDayOfWeekTemplateElement.content.cloneNode(true);

    const calendarDayOfWeekElement = calendarDayOfWeekContent.querySelector("[data-week-calendar-day-of-week]");

    const calendarDayOfWeekButtonElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-button]");

    const calendarDayOfWeekDayElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-day]");

    const calendarDayOfWeekNumberElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-number]");

    //Fetch the date and day to be displayed on the week calendar top
    calendarDayOfWeekNumberElement.textContent = weekDay.getDate();
    calendarDayOfWeekDayElement.textContent = dateFormatter.format(weekDay);

    if (isTheSameDay(weekDay, today())) {
        calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--highlight");
    }

    if (isTheSameDay(weekDay, selectedDate)) {
        calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--selected");
    }


    calendarDayOfWeekButtonElement.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                date: weekDay
            },
            bubbles: true
        }));

        if (deviceType !== "mobile") {
            document.dispatchEvent(new CustomEvent('view-change', {
                detail: {
                    view: "day"
                },
                bubbles: true
            }));
        }
    });

    parent.appendChild(calendarDayOfWeekElement);
}

function initAllDayListItem(parent, events) {
    //This fx renders a single row at the top for all-day events

    const calendarAllDayListItemContent = calendarAllDayListItemTemplateElement.content.cloneNode(true);
    const calendarAllDayListItemElement = calendarAllDayListItemContent.querySelector("[data-week-calendar-all-day-list-item]");

    initEventList(calendarAllDayListItemElement, events);

    parent.appendChild(calendarAllDayListItemElement);

}

function initColumn(parent, weekDay, events) {
    //This fx builds the hourly grid for one day

    const calendarColumnContent = calendarColumnTemplateElement.content.cloneNode(true);
    const calendarColumnElement = calendarColumnContent.querySelector("[data-week-calendar-column]");
    const calendarColumnCellElements = calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");

    const eventsWithDynamicStyles = calculateEventsDynamicStyles(events);
    for (const eventWithDynamicStyles of eventsWithDynamicStyles) {
        initDynamicEvent(
            calendarColumnElement,
            eventWithDynamicStyles.event,
            eventWithDynamicStyles.styles
        );
    }

    //Clicking on empty slots opens "Create Event" dialog.
    for (const calendarColumnCellElement of calendarColumnCellElements) {
        const cellStartTime = Number.parseInt(calendarColumnCellElement.dataset.weekCalendarCell, 10);
        const cellEndTime = cellStartTime + 60;

        calendarColumnCellElement.addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent('event-create-request', {
                detail: {
                    date: weekDay,
                    startTime: cellStartTime,
                    endTime: cellEndTime
                },
                bubbles: true
            }));
        });
    }

    parent.appendChild(calendarColumnElement);
}

function calculateEventsDynamicStyles(events) {

    const { eventGroups, totalColumns } = groupEvents(events);
    // console.log(eventGroups);

    const columnWidth = 100 / totalColumns;
    const initialEventGroupItems = [];

    for (const eventGroup of eventGroups) {
        for (const eventGroupItem of eventGroup) {
            if (eventGroupItem.isInitial) {
                initialEventGroupItems.push(eventGroupItem);
            }
        }
    }

    return initialEventGroupItems.map((eventGroupItem) => {
        const topPercentage = 100 * (eventGroupItem.event.startTime / 1440);
        const bottomPercentage = 100 - 100 * (eventGroupItem.event.endTime / 1440);
        const leftPercentage = columnWidth * eventGroupItem.columnIndex;
        const rightPercentage = columnWidth * (totalColumns - eventGroupItem.columnIndex - eventGroupItem.columnSpan);

        return {
            event: eventGroupItem.event,
            styles: {
                top: `${topPercentage}%`,
                bottom: `${bottomPercentage}%`,
                left: `${leftPercentage}%`,
                right: `${rightPercentage}%`
            }
        }
    });
}

function groupEvents(events) {
    //This fx groups overlapping events and assigns them to columns so they can sit side-by-side.

    if (events.length === 0) {
        return {
            eventGroups: [],
            totalColumns: 0
        };
    }

    const firstEventGroup = [
        {
            event: events[0],
            columnIndex: 0,
            isInitial: true,
            eventIndex: 0
        }
    ];

    const eventGroups = [firstEventGroup];      //The very first event always goes in column 0.


    //Out of remaining events, find which events in this group overlap with the current loopEvent
    for (let i = 1; i < events.length; i++) {
        const lastEventGroup = eventGroups[eventGroups.length - 1];
        const loopEvent = events[i];

        const lastEventGroupCollidingItems = lastEventGroup.filter((eventGroupItem) => eventCollidesWith(eventGroupItem.event, loopEvent));

        //If no events overlap, start a brand new group.
        //current event sits below the previous stack and gets full width.
        if (lastEventGroupCollidingItems.length === 0) {
            const newEventGroupItem = {
                event: loopEvent,
                columnIndex: 0,
                isInitial: true,
                eventIndex: i
            };
            const newEventGroup = [newEventGroupItem];

            eventGroups.push(newEventGroup);

            continue;
        }

        //If the new event overlaps with all events in the group, just add it as a new column at the far right.        
        if (lastEventGroupCollidingItems.length === lastEventGroup.length) {
            const newEventGroupItem = {
                event: loopEvent,
                columnIndex: lastEventGroup.length,
                isInitial: true,
                eventIndex: i
            };
            lastEventGroup.push(newEventGroupItem);
            continue;
        }

        //If it overlaps with some events but not all, find the first available free column (newColumnIndex).        
        let newColumnIndex = 0;
        while (true) {
            const isColumnIndexInUse = lastEventGroupCollidingItems.some((eventGroupItem) => eventGroupItem.columnIndex == newColumnIndex);

            if (isColumnIndexInUse) {
                newColumnIndex += 1;
            } else {
                break;
            }
        }

        //Add this new event into a new sub-group with its calculated column.
        const newEventGroupItem = {
            event: loopEvent,
            columnIndex: newColumnIndex,
            isInitial: true,
            eventIndex: i
        };

        const newEventGroup = [
            ...lastEventGroupCollidingItems.map((eventGroupItem) => ({
                ...eventGroupItem,
                isInitial: false
            })),
            newEventGroupItem
        ];

        eventGroups.push(newEventGroup);
    }

    //Calculate the maximum number of parallel columns needed to render this day's events.
    let totalColumns = 0;
    for (const eventGroup of eventGroups) {
        for (const eventGroupItem of eventGroup) {
            totalColumns = Math.max(totalColumns, eventGroupItem.columnIndex + 1);
        }
    }

    //Calculate how much horizontal width each event should occupy
    for (const eventGroup of eventGroups) {
        eventGroup.sort((columnGroupItemA, columnGroupItemB) => {
            return columnGroupItemA.columnIndex < columnGroupItemB.columnIndex ? -1 : 1;
        });

        for (let i = 0; i < eventGroup.length; i++) {
            const loopEventGroupItem = eventGroup[i];
            if (i === eventGroup.length - 1) {
                loopEventGroupItem.columnSpan = totalColumns - loopEventGroupItem.columnIndex;
            } else {
                const nextLoopEventGroupItem = eventGroup[i + 1];
                loopEventGroupItem.columnSpan = nextLoopEventGroupItem.columnIndex - loopEventGroupItem.columnIndex;
            }
        }
    }

    for (let i = 0; i < events.length; i++) {
        let lowestColumnSpan = Infinity;

        for (const eventGroup of eventGroups) {
            for (const eventGroupItem of eventGroup) {
                if (eventGroupItem.eventIndex === i) {
                    lowestColumnSpan = Math.min(lowestColumnSpan, eventGroupItem.columnSpan);
                }
            }
        }

        for (const eventGroup of eventGroups) {
            for (const eventGroupItem of eventGroup) {
                if (eventGroupItem.eventIndex === i) {
                    eventGroupItem.columnSpan = lowestColumnSpan;
                }
            }
        }
    }
    return { eventGroups, totalColumns };
}

function sortEventsByTime(events) {
    events.sort((eventA, eventB) => {
        if (eventStartsBefore(eventA, eventB)) {
            return -1;
        }
        if (eventStartsBefore(eventB, eventA)) {
            return 1;
        }

        return eventEndsBefore(eventA, eventB) ? 1 : -1;
    });
}