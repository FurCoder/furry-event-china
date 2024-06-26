import { DurationType, SelectedFilterType } from "@/types/list";
import { Event } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import {
  isBefore,
  isAfter,
  getYear,
  getMonth,
  setDefaultOptions,
  compareAsc,
  compareDesc,
} from "date-fns";
import { zhCN } from "date-fns/locale";

setDefaultOptions({ locale: zhCN });

export function eventGroupByYear(data: Event[], order: "asc" | "desc") {
  const groupByStartDate = groupBy(data, (e) =>
    e.startDate ? new Date(e.startDate).getFullYear() : "no-date"
  );

  const years = Object.keys(groupByStartDate).sort((a, b) => {
    if (a !== "no-date" && b !== "no-date") {
      return Number(b) - Number(a);
    }
    if (a === "no-date") {
      return -1;
    }
    if (b === "no-date") {
      return 1;
    }
    return 0;
  });

  return years.map((year) => ({
    year,
    events: sortEvents(groupByStartDate[year], order),
  }));
}

export function eventGroupByMonth(data: Event[], monthOrder: "asc" | "desc") {
  const groupByStartDate = groupBy(data, (e) =>
    e.startDate ? new Date(e.startDate).getMonth() + 1 : "no-date"
  );

  const months = Object.keys(groupByStartDate).sort((a, b) => {
    if (a !== "no-date" && b !== "no-date") {
      if (monthOrder === "desc") {
        return Number(b) - Number(a);
      }
      return Number(a) - Number(b);
    }

    if (a === "no-date") {
      return 1;
    }
    if (b === "no-date") {
      return -1;
    }

    return 0;
  });

  return months.map((month) => ({
    month,
    events: sortEvents(groupByStartDate[month], "asc"),
  }));
}

export function filteringEvents(
  events: Event[],
  selectedFilter: SelectedFilterType
) {
  return events.filter((event) => {
    const now = Date.now();
    const endTime = event.endDate
      ? new Date(new Date(event.endDate).setHours(23, 59, 59, 999)).getTime()
      : null;
    if (selectedFilter.onlyAvailable) {
      // for now, if event is cancelled, the data willn't include it at all.
      // if (event.status === EventStatus.EventCancelled) {
      //   return false;
      // }
      if (endTime && now > endTime) {
        return false;
      }
    }

    if (
      selectedFilter.eventScale[0] !== "All" &&
      !selectedFilter.eventScale.includes(event.scale)
    ) {
      return false;
    }
    return true;
  });
}

function isDateBelongNextYear(testDate: string) {
  return getYear(new Date(testDate)) > getYear(new Date());
}

function getDateMonth(testDate: string) {
  const isNextYear = isDateBelongNextYear(testDate);
  const dateBelongMonth = getMonth(new Date(testDate)) + 1;
  return isNextYear ? dateBelongMonth + 12 : dateBelongMonth;
}

export function groupByCustomDurationEvent(events: Event[]) {
  const currentMonth = getMonth(new Date()) + 1;
  const now = Date.now();

  const durationObject: { [x in DurationType]: Event[] } = {
    now: [],
    soon: [],
    next: [],
    nextYear: [],
    passed: [],
  };

  events.forEach((event) => {
    const startTime = event.startDate
      ? new Date(new Date(event.startDate).setHours(0, 0, 0, 0)).getTime()
      : null;
    const endTime = event.endDate
      ? new Date(new Date(event.endDate).setHours(23, 59, 59, 999)).getTime()
      : null;

    const startMonth = event.startDate
      ? getDateMonth(event.startDate.toString())
      : null;
    const endMonth = event.endDate
      ? getDateMonth(event.endDate.toString())
      : null;

    //next events
    if (
      startTime === null ||
      endTime === null ||
      startMonth === null ||
      endMonth === null
    ) {
      return durationObject.next.push(event);
    }

    //Passed events
    if (isAfter(now, endTime)) {
      return durationObject.passed.push(event);
    }

    //Now events
    if (isAfter(now, startTime) && isBefore(now, endTime)) {
      return durationObject.now.push(event);
    }

    //Soon events
    if (
      (startMonth === currentMonth || currentMonth + 1 === startMonth) &&
      isBefore(now, startTime)
    ) {
      return durationObject.soon.push(event);
    }

    //Next events
    if (startMonth > currentMonth) {
      if (startMonth > 12) {
        return durationObject.nextYear.push(event);
      }
      return durationObject.next.push(event);
    }
  });

  return durationObject;
}

export function sortEvents(events: Event[], order: "asc" | "desc") {
  return events.sort((a, b) => {
    if (!a.endDate) {
      return 1;
    }

    if (!b.endDate) {
      return -1;
    }

    if (a.startDate && b.startDate) {
      if (order === "asc") {
        return compareAsc(a.startDate, b.startDate);
      }
      return compareDesc(a.startDate, b.startDate);
    }

    return 0;
  });
}
