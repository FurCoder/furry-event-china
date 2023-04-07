export function getOranizationStatusConfig(status: string) {
  switch (status) {
    case "active":
      return { label: "活跃", color: "text-green-400" };
    case "deactive":
      return { label: "停止活动", color: "text-red-400" };
    default:
      return { label: "未知状态", color: "text-gray-400" };
  }
}
