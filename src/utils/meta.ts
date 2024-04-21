import { format } from "date-fns";

const universalKeywords = [
  "兽聚",
  "兽展",
  "兽聚日历",
  "兽展日历",
  "FEC 兽展",
  "FEC 兽聚",
  "FEC 兽展日历",
  "FEC 兽聚日历",
];

function keywordgenerator({
  page,
  event,
}: {
  page: "home" | "event" | "organization";
  event?: {
    name?: string;
    city?: string;
    startDate?: string | Date | null;
  };
}) {
  const nowYear = new Date().getFullYear();
  const startYear = event?.startDate ? format(event.startDate, "yyyy年") : null;

  const universalHomeKeywords = [
    `${nowYear} 兽展`,
    `${nowYear} 兽展时间表`,
    `${nowYear} 兽聚`,
    `${nowYear} 兽聚时间表`,
    "",
  ];

  const universalEventKeywords = [
    `${event?.name}`,
    `${event?.name}兽聚`,
    `${event?.name}兽展`,
    `${event?.name}举办时间`,
    `${event?.name}时间`,
    ...(event?.city ? [`${event.city}兽聚`, `${event.city}兽展`] : []),
    ...(startYear ? [`${startYear}兽聚`, `${startYear}兽展`] : []),
  ];

  const universalOrganizationKeywords = [
    `${nowYear} 兽展`,
    `${nowYear} 兽展时间表`,
    `${nowYear} 兽聚`,
    `${nowYear} 兽聚时间表`,
  ];

  switch (page) {
    case "home":
      return [
        ...universalHomeKeywords,
        //在所有页面都迁移到这个函数前不要注入默认关键词，在layout做过一次这个事情了
        //  ...universalKeywords
      ].join(",");

    case "event":
      return universalEventKeywords.join(",");

    case "organization":
      return [...universalOrganizationKeywords].join(",");

    default:
      return universalKeywords.join(",");
  }
}

function titleGenerator(title?: string) {
  return title
    ? `${title}-FEC·兽展日历 | FEC·兽聚日历`
    : "FEC·兽展日历 | FEC·兽聚日历";
}

export { universalKeywords, keywordgenerator, titleGenerator };
