import clsx from "clsx";
import { GrStatusGoodSmall } from "react-icons/gr";

export default function OrganizationStatus(props: { status: string }) {
  const statusConfig = getOranizationStatusConfig(props.status);
  return (
    <div className="flex items-center">
      <div className="text-sm h-4 flex justify-center flex-col">
        <GrStatusGoodSmall className={clsx("mr-1", statusConfig.color)} />
      </div>
      <span className="leading-4 h-4">{statusConfig.label}</span>
    </div>
  );
}

export function getOranizationStatusConfig(status: string) {
  switch (status) {
    case "active":
      return { label: "活跃", color: "text-green-400" };
    case "inactive":
      return { label: "停止活动", color: "text-red-400" };
    default:
      return { label: "未知状态", color: "text-gray-400" };
  }
}
