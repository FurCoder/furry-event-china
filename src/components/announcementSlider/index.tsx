import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import SliderStyle from "./index.module.css";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const IS_CN_REGION = process.env.NEXT_PUBLIC_REGION === "CN";

function AnnouncementSlider() {
  const router = useRouter();
  const asPath = router.asPath;
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3000 }),
  ]);

  const defaultSliderClass =
    "px-4 py-4 bg-white border border-gray-200 rounded-xl text-red-400 text-sm md:text-base";
  return (
    <div className="overflow-hidden mb-6 mx-1 lg:mx-0" ref={emblaRef}>
      <div className="embla__container flex">
        {!IS_CN_REGION && (
          <div className={clsx(SliderStyle.embla__slide, defaultSliderClass)}>
            如您感觉加载速度较慢，请访问我们的境内域名地址:{" "}
            <a
              href={`https://www.furrycons.cn${asPath}`}
              className="underline cursor-pointer"
            >
              www.furrycons.cn
            </a>
            ，放心点击，您的路径将保持一致。
          </div>
        )}

        <div
          className={clsx(SliderStyle.embla__slide, defaultSliderClass, "ml-4")}
        >
          有任何建议和反馈，请加入我们的QQ群聊
          <a
            target="_blank"
            href="https://qm.qq.com/q/yIpHnyHg5y"
            className="underline cursor-pointer font-bold mx-1"
          >
            {`630572929 (点我加入)`}
          </a>
          直抒胸臆！或者点
          <span
            className="underline cursor-pointer mx-1 font-bold"
            onClick={() => {
              navigator.clipboard
                .writeText("630572929")
                .then(() => toast.success("🥳 复制成功，快去QQ加群吧"));
            }}
          >
            这里
          </span>
          复制群号。
        </div>
      </div>
    </div>
  );
}

export default AnnouncementSlider;
