import { today } from "./date.js";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
});

export function initNav() {
    const todayButtonElements = document.querySelectorAll("[data-nav-today-button]");
    const previousButtonElements = document.querySelectorAll("[data-nav-previous-button]");
    const nextButtonElements = document.querySelector("[data-nav-next-button]");
    const dateElement = document.querySelector("[data-nav-date]");

    let selectedView = "month";
    let selectedDate = today();

    refreshDateElement(dateElement, selectedDate);
}


function refreshDateElement(dateElement, selectedDate) {
    dateElement.textContent = dateFormatter.format(selectedDate);
}