import { isTheSameDay } from "./date.js";


export function initEventStore() {
    // CREATE an event in the local storage
    document.addEventListener("event-create", (event) => {      //event-create customEvent is defined inside event-form.js
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

        //Keep only the events whose id does NOT match the deleted event’s id
        const events = getEventsFromLocalStorage().filter((event) => {
            return event.id !== deletedEvent.id;
        });

        saveEventIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent('events-change', {
            bubbles: true
        })
        );

    });

    // EDIT an existing event 
    document.addEventListener("event-edit", (event) => {
        const editedEvent = event.detail.event;

        /*Loop through the array of calendarEvents objects and for each calendarEvent:
            If its id matches the edited event’s id, replace it with the new editedEvent.
            Else, keep the event as it is.
        */
        const events = getEventsFromLocalStorage().map((event) => {
            return event.id === editedEvent.id ? editedEvent : event;
        });

        saveEventIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent('events-change', {
            bubbles: true
        })
        );

    });

    return {
        getEventsByDate(date) {
            const events = getEventsFromLocalStorage();

            //collect calendarEvents of the same day
            const filteredEvents = events.filter((event) => isTheSameDay(event.date, date));

            return filteredEvents;
        }
    }
}


function saveEventIntoLocalStorage(events) {

    /*
    This function takes your in-memory events array (with real Date objects) and 
    safely stores them into the browser's localStorage, which only supports strings.
    */

    const safeToStringifyEvents = events.map((event) => ({
        ...event,
        date: event.date.toISOString()      //Convert Date objects → Strings; maintain everything else as it was
    }));

    let stringifiedEvents;      //stores the array of objects but as a string
    try {
        stringifiedEvents = JSON.stringify(safeToStringifyEvents);
    } catch (error) {
        console.error("Failed to stringify events", error);

    }

    //Push calendarEvents into localStorage
    localStorage.setItem("events", stringifiedEvents);
}

function getEventsFromLocalStorage() {
    //This fx returns the events from local storage in a readable array of objects format

    const localStorageEvents = localStorage.getItem("events");          //array of events but in string format
    if (localStorageEvents === null) {
        return [];
    }

    let parsedEvents;
    try {
        parsedEvents = JSON.parse(localStorageEvents);      //convert string events into an object
    } catch (error) {
        console.error("Failed to parse events", error);
        return [];
    }

    // Convert date strings back into Date objects
    const events = parsedEvents.map((event) => ({
        ...event,
        date: new Date(event.date)
    }));

    //console.log(events);

    return events;     //returns events as an array of objects, each representing a calendar event.

}