import clsx from "clsx";
import { FaFire, FaHeart } from "react-icons/fa6";

function EventStatusBar({
  className,
  pageviews,
  fav,
}: {
  className?: string;
  pageviews: string;
  fav: string;
}) {
  return (
    <div className={clsx("flex gap-2", className)}>
      <ItemGroup icon={<FaFire />} text={pageviews} />
      <ItemGroup icon={<FaHeart />} text={fav} />
    </div>
  );
}

function ItemGroup({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | number;
}) {
  return (
    <div className={clsx("flex items-center text-slate-500 text-sm")}>
      <i>{icon}</i>
      <span className="ml-1">{text}</span>
    </div>
  );
}

export default EventStatusBar;
