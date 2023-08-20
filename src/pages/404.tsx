import { sendTrack } from "@/utils/track";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    sendTrack({
      eventName: "Viewed 404 page",
      eventValue: {
        href: window.location.href,
      },
    });
  }, []);

  return (
    <div className="bg-white p-6 text-center">
      <h1 className="text-xl text-red-400">你似乎迷路了...</h1>
      <span>Who is my fearless hero?</span>
    </div>
  );
}
