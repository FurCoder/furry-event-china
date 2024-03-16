import { sendTrack } from "@/utils/track";
import { useState } from "react";
import NextImage from "@/components/image";
import { IoIosArrowDown } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import clsx from "clsx";

function Slider() {
  const [expand, setExpand] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden mb-6 relative">
      <a
        className="relative block"
        target="_blank"
        href="https://www.wilddream.net/contest/2024contest?utm_source=fec"
        onClick={() => {
          sendTrack({
            eventName: "click-slider-link",
            eventValue: {
              href: "https://www.wilddream.net/contest/2024contest?utm_source=fec",
            },
          });
        }}
      >
        <NextImage
          priority
          src="https://www.wilddream.net/Public/images/contest/2024/banner_20231206.jpg"
          className="object-cover w-full h-full"
          alt="WildDream创作站兽主题绘画比赛·2024"
        />
      </a>

      <div className="p-6">
        <h6
          className="hover:cursor-pointer w-fit text-gray-600 font-bold text-base md:text-xl flex items-center"
          onClick={() => {
            setExpand(!expand);
            sendTrack({
              eventName: "click-slider-detail",
              eventValue: {
                item: "wilddream",
              },
            });
          }}
        >
          WildDream 创作站兽主题绘画比赛·2024
          <span className={clsx(!expand && "animate-bounce")}>
            <IoIosArrowDown
              className={clsx(
                "transition-all dutation-300 hover:cursor-pointer ml-2",
                {
                  "rotate-180": expand,
                  "rotate-0": !expand,
                }
              )}
            />
          </span>
        </h6>
        <div
          className={clsx(
            "transition-[max-height] duration-300 overflow-hidden",
            {
              "max-h-96": expand,
              "max-h-0 ": !expand,
            }
          )}
        >
          <div className="mb-2 flex flex-col md:flex-row md:items-center">
            <span className="text-sm text-gray-500">
              活动时间：2024年1月19日 - 2024年3月15日（北京时间 23:59）
            </span>
            <hr className="hidden md:block mr-2 h-4 border-r-[1px] border-gray-300" />
            <a
              className="text-red-400 text-sm underline underline-offset-4 inline-flex items-center"
              target="_blank"
              href="https://www.wilddream.net/contest/2024contest?utm_source=fec"
              onClick={() => {
                sendTrack({
                  eventName: "click-slider-link",
                  eventValue: {
                    href: "https://www.wilddream.net/contest/2024contest?utm_source=fec",
                  },
                });
              }}
            >
              前往活动页
              <FaLink />
            </a>
          </div>

          <p className="text-sm md:text-base text-gray-500">
            “WildDream创作站兽主题绘画比赛·2024”是由WildDream创作站主办的，以兽、兽人、动物、奇幻生物为主题的公益绘画比赛。
            <br />
            本比赛每届设定一个比赛主题，邀请在兽主题创作领域具有丰富经验的绘师担任评委，并辅以公众投票环节，希望能够发掘优秀的兽主题创作者，并为创作者们带来更多关注和支持。同时我们相信，地球上现有的野性生灵们始终是兽主题创作的源头活水。本比赛为濒危动物主题创作设立奖项，并将比赛周边收入捐赠给动物保育组织，希望为它们的生存和发展带来更多关注和支持。
          </p>
        </div>
      </div>
    </div>
  );
}
