import { z } from "zod";

/** Sync with https://schema.org/EventStatusType */
export const EventStatus = {
  /** 活动已取消。 */
  EventCancelled: "cancelled",
  /** 活动已从现场参加转为线上参加。 */
  EventMovedOnline: "movedOnline",
  /** 活动已推迟到未来的某个日期，但具体日期未知。 */
  EventPostponed: "postponed",
  /** 活动已重新安排到未来的某个日期。 */
  EventRescheduled: "rescheduled",
  /** 活动按计划举办。 */
  EventScheduled: "scheduled",
};

export const EventStatusSchema = {
  [EventStatus.EventCancelled]: "https://schema.org/EventCancelled",
  [EventStatus.EventMovedOnline]: "https://schema.org/EventMovedOnline",
  [EventStatus.EventPostponed]: "https://schema.org/EventPostponed",
  [EventStatus.EventRescheduled]: "https://schema.org/EventRescheduled",
  [EventStatus.EventScheduled]: "https://schema.org/EventScheduled",
};

export const EventScale = {
  /** 小型聚会，个人举办的展会一般用这个。 */
  Cosy: "cosy",
  /** 二三线城市的展会一般用这个。 */
  Small: "small",
  /** 一线城市的展会一般用这个，比如：极兽聚 */
  Medium: "medium",
  /** 没有这种规模 */
  Large: "large",
  /** 没有这种规模 */
  Mega: "mega",
};

export const EventScaleLabel = {
  [EventScale.Cosy]: "小型规模",
  [EventScale.Small]: "中型规模",
  [EventScale.Medium]: "大型规模",
  [EventScale.Large]: "超大型规模",
  [EventScale.Mega]: "巨型规模",
};

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  startAt: z.string().datetime().nullable(),
  endAt: z.string().datetime().nullable(),
  status: z.string(),
  scale: z.string(),
  source: z.string().nullable(),
  address: z.string().nullable(),
  addressLat: z.string().nullable(),
  addressLon: z.string().nullable(),
  addressExtra: z.object({ city: z.string().nullable() }).nullable(),
  thumbnail: z.string().nullable(),
  poster: z
    .object({
      all: z.array(z.string()).nullable(),
    })
    .nullable(),
  detail: z.string().nullable(),
  features: z.object({}).nullable(),

  organization: z.object({
    id: z.string().uuid(), // 假设 id 是一个 UUID
    slug: z.string().min(1), // slug 至少有一个字符
    name: z.string().min(1), // name 至少有一个字符
    description: z.string().nullable(), // description 至少有一个字符
    status: z.enum(["active", "inactive"]), // 假设 status 只能是 'active' 或 'inactive'
    type: z.string().nullable(), // type 可以是字符串或 null
    logoUrl: z.string(), // logoUrl 应该是一个有效的 URL
    richMediaConfig: z.any().nullable(), // richMediaConfig 可以是任意类型或 null
    contactMail: z.string().email().nullable(), // contactMail 应该是一个有效的邮箱地址
    website: z.string().url().nullable(), // website 应该是一个有效的 URL
    twitter: z.string().url().nullable(), // twitter 可以是有效的 URL 或 null
    weibo: z.string().url().nullable(), // weibo 可以是有效的 URL 或 null
    qqGroup: z.string().nullable(), // qqGroup 可以是字符串或 null
    bilibili: z.string().url().nullable(), // bilibili 可以是有效的 URL 或 null
    wikifur: z.string().url().nullable(), // wikifur 可以是有效的 URL 或 null
    creationTime: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .nullable(), // creationTime 应该是一个有效的日期字符串
  }),
});

export type EventType = z.infer<typeof EventSchema>;
