import { sendTrack } from "@/utils/track";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaArrowUp, FaHome } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";

const buttonCls = clsx(
  "bg-white p-3 text-slate-700 text-lg hover:text-red-400",
  "lg:p-4"
);
function Sidebar() {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <aside
      className={clsx(
        "fixed",
        "flex flex-col divide-y shadow overflow-hidden z-20",
        "lg:right-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:rounded-l-lg lg:rounded-none",
        "right-4 bottom-4 rounded-lg"
      )}
    >
      <button
        className={clsx(buttonCls)}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          sendTrack({
            eventName: "click-sidebar",
            eventValue: { "click-position": "back-top" },
          });
        }}
      >
        <FaArrowUp />
      </button>

      {router.pathname !== "/" && (
        <Link
          className={clsx(buttonCls)}
          href="/"
          onClick={() => {
            sendTrack({
              eventName: "click-sidebar",
              eventValue: { "click-position": "back-home" },
            });
          }}
        >
          <FaHome />
        </Link>
      )}

      {/* <button className={clsx(buttonCls)}>
        <MdFeedback />
      </button> */}
    </aside>
  );
}

export default Sidebar;
