import { initDialog } from "./dialog.js";
import { eventTimeToDate } from "./event.js";

const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: 'numeric',
    minute: 'numeric'
})

export function initEventDetailsDialog() {
    const dialog = initDialog("event-details");
    const deleteButtonElement = dialog.dialogElement.querySelector("[data-event-details-delete-button]");
    const editButtonElement = dialog.dialogElement.querySelector("[data-event-details-edit-button]");

    let currentEvent = null;

    document.addEventListener("event-click", (event) => {     //event-click customEvent is created in event.js
        currentEvent = event.detail.event;      //currentEvent is set to the clicked event’s data.
        fillEventDetailsDialog(dialog.dialogElement, event.detail.event);   //update the dialog UI with this event's details.
        dialog.open();          //displays the dialog on screen.
    });

    // event listener for delete button
    deleteButtonElement.addEventListener("click", () => {
        dialog
            .close()
            .then(() => {
                deleteButtonElement.dispatchEvent(new CustomEvent('event-delete-request', {
                    detail: {
                        event: currentEvent
                    },
                    bubbles: true
                }));
            });
    });

    //event listener for edit button
    editButtonElement.addEventListener("click", () => {
        dialog
            .close()
            .then(() => {
                editButtonElement.dispatchEvent(new CustomEvent('event-edit-request', {
                    detail: {
                        event: currentEvent
                    },
                    bubbles: true
                }));
            });
    });
}

function fillEventDetailsDialog(parent, event) {
    const eventDetailsElement = parent.querySelector("[data-event-details]");
    const eventDetailsTitleElement = parent.querySelector("[data-event-details-title]");
    const eventDetailsDateElement = parent.querySelector("[data-event-details-date]");
    const eventDetailsStartTimeElement = parent.querySelector("[data-event-details-start-time]");
    const eventDetailsEndTimeElement = parent.querySelector("[data-event-details-end-time]");

    eventDetailsTitleElement.textContent = event.title;
    eventDetailsDateElement.textContent = eventDateFormatter.format(event.date);
    eventDetailsStartTimeElement.textContent = eventTimeFormatter.format(eventTimeToDate(event, event.startTime));
    eventDetailsEndTimeElement.textContent = eventTimeFormatter.format(eventTimeToDate(event, event.endTime));

    eventDetailsElement.style.setProperty("--event-color", event.color);
}