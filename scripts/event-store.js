import { isTheSameDay } from "./date.js";


export function initEventStore() {
    // CREATE an event in the local storage
    document.addEventListener("event-create", (event) => {
        const createdEvent = event.detail.event;
        const events = getEventsFromLocalStorage();
        events.push(createdEvent);

        saveEventIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent('events-change', {
            bubbles: true
        }));

    });

    // DELETE an event from the local storage
    document.addEventListener("event-delete", (event) => {
        const deletedEvent = event.detail.event;
        const events = getEventsFromLocalStorage().filter((event)=>{
            return event.id !== deletedEvent.id;
        });
        
        saveEventIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent('events-change', {
            bubbles: true
        })
        );

    });

        // DELETE an event from the local storage
    document.addEventListener("event-edit", (event) => {
        const editedEvent = event.detail.event;
        const events = getEventsFromLocalStorage().map((event)=>{
            return event.id === editedEvent.id ? editedEvent : event;
        });
        
        saveEventIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent('events-change', {
            bubbles: true
        })
        );

    });

    return {
        getEventsByDate(date){
            const events = getEventsFromLocalStorage();
            const filteredEvents = events.filter((event)=>isTheSameDay(event.date, date));

            return filteredEvents;
        }
    }
}


function saveEventIntoLocalStorage(events) {
    const safeToStringifyEvents = events.map((event) => ({
        ...event,
        date: event.date.toISOString()
    }));

    let stringifiedEvents;
    try {
        stringifiedEvents = JSON.stringify(safeToStringifyEvents);
    } catch (error) {
        console.error("Failed to stringify events", error);

    }

    localStorage.setItem("events", stringifiedEvents);
}

function getEventsFromLocalStorage() {
    const localStorageEvents = localStorage.getItem("events");
    if (localStorageEvents === null) {
        return [];
    }

    let parsedEvents;
    try {
        parsedEvents = JSON.parse(localStorageEvents);
    } catch (error) {
        console.error("Failed to parse events", error);
        return [];
    }
    const events = parsedEvents.map((event) => ({
        ...event,
        date: new Date(event.date)
    }));

    return events
}