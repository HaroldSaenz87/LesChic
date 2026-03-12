import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"
import closetImg from "../assets/closet.jpg"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)


  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=180%",
        scrub: 0,
        pin: true,
      },
    })

    // 1. Fade out the title on the black screen
    tl.to(titleRef.current, { opacity: 0, y: -30, ease: "power2.in" }, 0)

    // 2. Grow the hole in the closet layer until it clears the screen
    tl.to(introRef.current, {
      webkitMaskSize: "900vmin",
      maskSize: "900vmin",
      ease: "power2.in",
    }, 0)

    // 3. Fade in final hero content
    tl.to(heroContentRef.current, { opacity: 1, y: 0, ease: "power2.out" }, 0.65)
  })

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden ">

      {/* ── 1. Black title screen — sits behind everything ── */}
      <div className="absolute inset-0 z-1 flex flex-col items-center justify-center bg-[#0c0c0c] gap-16">

        <div className="w-[18vmin] h-[18vmin]" />
        <h1
          ref={titleRef}
          className="font-display text-white font-light tracking-[0.15em] text-8xl "
        >
          LesChic
        </h1>
        <p className="flex items-center justify-center font-display absolute bottom-[7vh] uppercase tracking-[0.45em] text-white/30 text-xs">
          Scroll

          <ChevronDown className="animate-bounce" />
        </p>
      </div>

      {/* ── 2. Closet image with hole-mask — starts with small keyhole, grows to reveal all ── */}
      <div ref={introRef} className="hole-mask absolute inset-0 z-2">
        <img src={closetImg} alt="Luxury closet" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── 3. Final hero content — fades in over closet ── */}
      <div ref={heroContentRef} className="absolute inset-0 z-3 flex flex-col items-center justify-start pt-[12vh] opacity-0 translate-y-6 pointer-events-none">
        
        <div className="pointer-events-auto w-105 max-w-[95vw] rounded-4xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] bg-black/30 backdrop-blur-2xl overflow-hidden">

          <div className="flex flex-col items-center pt-9 pb-7 border-b border-white/8">
            <p className="font-display text-white/45 uppercase tracking-[0.5em] text-[10px] mb-2">
              The Art of Dressing
            </p>
            <h1 className="font-display text-white font-light tracking-[0.14em] text-5xl">
              LesChic
            </h1>
          </div>

          {/* Form */}
          <div className="px-10 py-8 flex flex-col gap-3">
            <input type="email" placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-white/25 font-display tracking-wider transition" />
            <input type="password" placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-white/25 font-display tracking-wider transition" />

            <button className="mt-2 w-full py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.45em] font-display text-black font-semibold bg-linear-to-br from-white to-white/80 shadow-[0_4px_0px_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-none transition-all">
              Enter
            </button>

            <p className="text-center text-white/25 text-[10px] uppercase tracking-widest font-display mt-1">
              Forgot password?
            </p>
          </div>

          
        
        </div>

        
       


      </div>

    </div>
  )
}