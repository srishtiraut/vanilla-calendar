import { addMonths, subtractMonths, today } from "./date.js";


const calendarDayListItemTemplateElement = document.querySelector("[data-template='mini-calendar-day-list-item']");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: 'long',
    year: 'numeric'
});
export function initMiniCalendars(){
    const calendarElements = document.querySelectorAll("[data-mini-calendar]");

    for(const calendarElement of calendarElements){
        initMiniCalendar(calendarElement);
    }
}

function initMiniCalendar(calendarElement){
    const calendarPreviousButtonElement = calendarElement.querySelector("[data-mini-calendar-previous-button]");
    const calendarNextButtonElement = calendarElement.querySelector("[data-mini-calendar-next-button]"); 

    let selectedDate = today();
    let miniCalendarDate = today();

    function refreshMiniCalendar(){
        refreshDateElement(calendarElement, miniCalendarDate);
    }

    calendarPreviousButtonElement.addEventListener("click", ()=>{
        miniCalendarDate = subtractMonths(miniCalendarDate, 1);
        refreshMiniCalendar();
    });
    calendarNextButtonElement.addEventListener("click", ()=>{
        miniCalendarDate = addMonths(miniCalendarDate, 1);
        refreshMiniCalendar();
    });

    document.addEventListener("date-change", ()=>{
        selectedDate = event.detail.date;
        miniCalendarDate = event.detail.date;
        refreshMiniCalendar();
    });

    refreshMiniCalendar();
    
}

function refreshDateElement(parent, date){
    const calendarDateElement = parent.querySelector("[data-mini-calendar-date]");

    calendarDateElement.textContent = dateFormatter.format(date);
}