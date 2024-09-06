import { DurationType, SelectedFilterType } from "@/types/list";
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
import { EventType } from "@/types/event";

setDefaultOptions({ locale: zhCN });

export function eventGroupByYear(data: EventType[], order: "asc" | "desc") {
  const groupByStartDate = groupBy(data, (e) =>
    e.startAt ? new Date(e.startAt).getFullYear() : "no-date"
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

export function eventGroupByMonth(data: EventType[], monthOrder: "asc" | "desc") {
  const groupByStartDate = groupBy(data, (e) =>
    e.startAt ? new Date(e.startAt).getMonth() + 1 : "no-date"
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
  events: EventType[],
  selectedFilter: SelectedFilterType
) {
  return events.filter((event) => {
    const now = Date.now();
    const endTime = event.endAt
      ? new Date(new Date(event.endAt).setHours(23, 59, 59, 999)).getTime()
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
      selectedFilter.eventScale[0] !== "all" &&
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

export function groupByCustomDurationEvent(events: EventType[]) {
  const currentMonth = getMonth(new Date()) + 1;
  const now = Date.now();

  const durationObject: { [x in DurationType]: EventType[] } = {
    now: [],
    soon: [],
    next: [],
    nextYear: [],
    passed: [],
  };

  events.forEach((event) => {
    const startTime = event.startAt
      ? new Date(new Date(event.startAt).setHours(0, 0, 0, 0)).getTime()
      : null;
    const endTime = event.endAt
      ? new Date(new Date(event.endAt).setHours(23, 59, 59, 999)).getTime()
      : null;

    const startMonth = event.startAt
      ? getDateMonth(event.startAt.toString())
      : null;
    const endMonth = event.endAt
      ? getDateMonth(event.endAt.toString())
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

export function sortEvents(events: EventType[], order: "asc" | "desc") {
  return events.sort((a, b) => {
    if (!a.endAt) {
      return 1;
    }

    if (!b.endAt) {
      return -1;
    }

    if (a.startAt && b.startAt) {
      if (order === "asc") {
        return compareAsc(a.startAt, b.startAt);
      }
      return compareDesc(a.startAt, b.startAt);
    }

    return 0;
  });
}
