import { groupBy } from "lodash-es";
import { Event } from "@/xata/xata";

export function sortByStartDateDesc(data: Event[]) {
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

  return years.map((year) => ({ year, events: groupByStartDate[year] }));
}
