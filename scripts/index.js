import { initCalendar } from "./calendar.js";
import { initViewSelect } from "./view-select.js";
import { initEventCreateButtons } from "./event-create-button.js"
import { initEventFormDialog } from "./event-form-dialog.js";
import { initNotifications } from "./notifications.js";
import { initEventStore } from "./event-store.js";
import { initNav } from "./nav.js";
import { initEventDetailsDialog } from "./event-details-dialog.js";
import { initEventDeleteDialog } from "./event-delete-dialog.js";
import { initMiniCalendars } from "./mini-calendar.js";
import { initResponsive } from "./responsive.js"
import { initHamburger } from "./hamburger.js";
import { initMobileSidebar } from "./mobile-sidebar.js";
import { initUrl } from "./url.js";

const eventStore = initEventStore();

initCalendar(eventStore);
initEventCreateButtons();
initEventFormDialog();
initNav();
initNotifications();
initViewSelect();
initEventDetailsDialog();
initEventDeleteDialog();
initMiniCalendars();
initResponsive();
initHamburger();
initMobileSidebar();
initUrl();
