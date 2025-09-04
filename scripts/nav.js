import { today, addDays, subtractDays, addMonths, subtractMonths } from "./date.js";
import { getUrlDate, getUrlView } from "./url.js";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
});

export function initNav() {
    const todayButtonElements = document.querySelectorAll("[data-nav-today-button]");
    const previousButtonElement = document.querySelector("[data-nav-previous-button]");
    const nextButtonElement = document.querySelector("[data-nav-next-button]");
    const dateElement = document.querySelector("[data-nav-date]");

    // Get current state, i.e, current view and date
    let selectedView = getUrlView();
    let selectedDate = getUrlDate();

    for (const todayButtonElement of todayButtonElements) {
        //Whenever any 'Today' button in desktop/mobile mode is clicked, fire a customEvent called 'date-change' whose detail object carries today's date and tells the listening ancestors to update the calendar view to today. 
        todayButtonElement.addEventListener("click", () => {
            todayButtonElement.dispatchEvent(new CustomEvent("date-change", {
                detail: {
                    date: today()
                },
                bubbles: true
            }));
        });
    }

    // Whenever a 'Previous' button is clicked, fire a 'date-change' customEvent announcing the previous date (day/week/month depending on the selected view).
    previousButtonElement.addEventListener("click", () => {
        const newDate = getPreviousDate(selectedView, selectedDate);
        selectedDate = newDate;
        previousButtonElement.dispatchEvent(new CustomEvent("date-change", {
            detail: {
                date: newDate
            },
            bubbles: true
        }));
    });

    // Whenever a 'Next' button is clicked, fire a 'date-change' customEvent announcing the next date (day/week/month depending on the selected view).
    nextButtonElement.addEventListener("click", () => {
        const newDate = getNextDate(selectedView, selectedDate);
        selectedDate = newDate;
        nextButtonElement.dispatchEvent(new CustomEvent("date-change", {
            detail: {
                date: newDate
            },
            bubbles: true
        }));
    });

    // Whenever there is a view-change event, update the selectedView to the one propagated by that event's backpack-like detail object
    document.addEventListener("view-change", (event) => {
        selectedView = event.detail.view;
    });

    document.addEventListener("date-change", (event) => {
        selectedDate = event.detail.date;
        refreshDateElement(dateElement, selectedDate);
    });

    refreshDateElement(dateElement, selectedDate);
}


function refreshDateElement(dateElement, selectedDate) {
    // This function sets the dateElement(e.g September 2025) to the appropriate value
    dateElement.textContent = dateFormatter.format(selectedDate);
}

function getPreviousDate(selectedView, selectedDate) {
    if (selectedView === "day") {
        return subtractDays(selectedDate, 1);
    }

    if (selectedView === "week") {
        return subtractDays(selectedDate, 7);
    }

    return subtractMonths(selectedDate, 1);
}

function getNextDate(selectedView, selectedDate) {
    if (selectedView === "day") {
        return addDays(selectedDate, 1);
    }

    if (selectedView === "week") {
        return addDays(selectedDate, 7);
    }

    return addMonths(selectedDate, 1);
}

