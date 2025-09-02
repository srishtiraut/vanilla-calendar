import { today } from "./date.js";
import { getUrlDate } from "./url.js";

export function initEventCreateButtons() {

    // Pick all buttons labeled using the data attribute "data-event-create-button" and call the initEventCreateButton fx on them

    const buttonElements = document.querySelectorAll("[data-event-create-button]");

    for (const buttonElement of buttonElements) {
        initEventCreateButton(buttonElement)
    }
}

function initEventCreateButton(buttonElement) {

    let selectedDate = getUrlDate();

    //When the button is clicked, fire a customEvent to request a calendar-event-creation with some pre-set values for date and time
    buttonElement.addEventListener("click", () => {
        buttonElement.dispatchEvent(new CustomEvent("event-create-request", {
            detail: {
                date: selectedDate,
                startTime: 600,     //10:00AM
                endTime: 960        //04:00PM
            },
            // bubbles: true -> Allows this customEvent to propagate up through the DOM, so parent elements or other JS modules can listen for it.
            bubbles: true
        }));
    });

    //When User clicks the button, the new calendarEvent is always created on the currently selected date, not the old one.
    document.addEventListener("date-change", (event) => {
        selectedDate = event.detail.date;
    });
}