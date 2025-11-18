import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
// @ts-expect-error - Swiper CSS files don't have type declarations
import "swiper/css"
// @ts-expect-error - Swiper CSS files don't have type declarations
import "swiper/css/effect-fade"
// @ts-expect-error - Swiper CSS files don't have type declarations
import "swiper/css/navigation"
// @ts-expect-error - Swiper CSS files don't have type declarations
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    title: "겨울 신상 최대 80% 할인",
    description: "따뜻한 겨울을 위한 특별한 혜택",
    buttonText: "쇼핑하기",
    buttonLink: "/products?category=all",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
  },
  {
    id: 2,
    title: "무료 배송 이벤트",
    description: "전 상품 무료 배송으로 만나보세요",
    buttonText: "자세히 보기",
    buttonLink: "/events",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=1080&fit=crop",
  },
  {
    id: 3,
    title: "회원가입 시 10% 쿠폰",
    description: "지금 가입하고 첫 구매부터 할인받으세요",
    buttonText: "가입하기",
    buttonLink: "/signup",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop",
  },
]

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true)
  const swiperRef = useRef<SwiperType | null>(null)

  const handlePlayPause = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay?.stop()
      } else {
        swiperRef.current.autoplay?.start()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={false}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[600px] md:h-[700px]">
              {/* 배경 이미지 */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* 콘텐츠 */}
              <div className="relative z-10 flex h-full items-center justify-center">
                <div className="container mx-auto px-4 text-center text-white">
                  <h1 className="mb-4 text-4xl font-bold md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="mb-8 text-lg md:text-xl lg:text-2xl text-white/90">
                    {slide.description}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="swiper-button-prev-custom absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="swiper-button-next-custom absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="h-6 w-6 text-black" />
      </button>

      {/* 일시정지/재생 버튼 */}
      <button
        onClick={handlePlayPause}
        className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label={isPlaying ? "일시정지" : "재생"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-black" />
        ) : (
          <Play className="h-5 w-5 text-black" />
        )}
      </button>

      {/* 커스텀 인디케이터 스타일 */}
      <style>{`
        .hero-swiper .swiper-pagination {
          bottom: 2rem !important;
        }

        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 4px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active-custom {
          background: white;
          width: 32px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}

