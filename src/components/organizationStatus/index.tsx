import clsx from "clsx";
import { GrStatusGoodSmall } from "react-icons/gr";

export default function OrganizationStatus(props: { status: string }) {
  const statusConfig = getOranizationStatusConfig(props.status);
  return (
    <span className="flex items-center">
      <GrStatusGoodSmall className={clsx("mr-1", statusConfig.color)} />
      {statusConfig.label}
    </span>
  );
}

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
