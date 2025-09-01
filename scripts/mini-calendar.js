import { addMonths, generateMonthCalendarDays, isTheSameDay, subtractMonths, today } from "./date.js";
import { getUrlDate } from "./url.js";


const calendarDayListItemTemplateElement = document.querySelector("[data-template='mini-calendar-day-list-item']");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: 'long',
    year: 'numeric'
});
export function initMiniCalendars() {
    const calendarElements = document.querySelectorAll("[data-mini-calendar]");

    for (const calendarElement of calendarElements) {
        initMiniCalendar(calendarElement);
    }
}

function initMiniCalendar(calendarElement) {
    const calendarPreviousButtonElement = calendarElement.querySelector("[data-mini-calendar-previous-button]");
    const calendarNextButtonElement = calendarElement.querySelector("[data-mini-calendar-next-button]");

    let selectedDate = getUrlDate();
    let miniCalendarDate = getUrlDate();

    function refreshMiniCalendar() {
        refreshDateElement(calendarElement, miniCalendarDate);
        refreshDayListElement(calendarElement, miniCalendarDate, selectedDate);
    }

    calendarPreviousButtonElement.addEventListener("click", () => {
        miniCalendarDate = subtractMonths(miniCalendarDate, 1);
        refreshMiniCalendar();
    });
    calendarNextButtonElement.addEventListener("click", () => {
        miniCalendarDate = addMonths(miniCalendarDate, 1);
        refreshMiniCalendar();
    });

    document.addEventListener("date-change", (event) => {
        selectedDate = event.detail.date;
        miniCalendarDate = event.detail.date;
        refreshMiniCalendar();
    });

    refreshMiniCalendar();

}

function refreshDateElement(parent, date) {
    const calendarDateElement = parent.querySelector("[data-mini-calendar-date]");

    calendarDateElement.textContent = dateFormatter.format(date);



}


function refreshDayListElement(parent, miniCalendarDate, selectedDate) {
    const calendarDayListElement = parent.querySelector("[data-mini-calendar-day-list]");

    calendarDayListElement.replaceChildren();

    const calendarDays = generateMonthCalendarDays(miniCalendarDate);

    for (const calendarDay of calendarDays) {
        const calendarDayListItemContent = calendarDayListItemTemplateElement.content.cloneNode(true);
        const calendarDayListItemElement = calendarDayListItemContent.querySelector("[data-mini-calendar-day-list-item]");
        const calendarDayElement = calendarDayListItemElement.querySelector("[data-mini-calendar-day]");

        calendarDayElement.textContent = calendarDay.getDate();

        if (miniCalendarDate.getMonth() !== calendarDay.getMonth()) {
            calendarDayElement.classList.add("mini-calendar__day--other");
        }

        // if (isTheSameDay(selectedDate, calendarDay)) {
        //     calendarDayElement.classList.add("button--primary");
        // } else {
        //     calendarDayElement.classList.add("button--secondary");
        // }

        // calendarDayElement.classList.remove("button--primary", "button--secondary");
        // calendarDayElement.classList.add(
        //     isTheSameDay(selectedDate, calendarDay) ? "button--primary" : "button--secondary"
        // );


        // if (isTheSameDay(today(), calendarDay)) {
        //     calendarDayElement.classList.add("mini-calendar__day--highlight");
        // }

        // Reset button classes first
        calendarDayElement.classList.remove(
            "button--primary",
            "button--secondary",
            "mini-calendar__day--other",
            "mini-calendar__day--highlight"
        );

        // Case 1: selected date -> primary
        if (isTheSameDay(selectedDate, calendarDay)) {
            calendarDayElement.classList.add("button--primary");
        }
        // Case 2: today but not selected -> secondary + highlight
        else if (isTheSameDay(today(), calendarDay)) {
            calendarDayElement.classList.add("button--secondary", "mini-calendar__day--highlight");
        }
        // Case 3: normal days -> secondary
        else {
            calendarDayElement.classList.add("button--secondary");

            // If not in the current month, mark as "other"
            if (miniCalendarDate.getMonth() !== calendarDay.getMonth()) {
                calendarDayElement.classList.add("mini-calendar__day--other");
            }
        }


        calendarDayElement.addEventListener("click", () => {
            calendarDayElement.dispatchEvent(new CustomEvent('date-change', {
                detail: {
                    date: calendarDay
                },
                bubbles: true
            }));
        });

        calendarDayListElement.appendChild(calendarDayListItemElement);
    }
}