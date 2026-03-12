import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"
import closetImg from "../assets/closet.jpg"
import { Login } from "../components/Login"
import { Signup } from "../components/Signup"

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
  });


  const [isRegister, setRegister] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".auth-form-container", {opacity: 0, y: 10}, {opacity: 1, y:0, duration: 0.7, ease: "power2.out"});
  }, [isRegister]);

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
        
        <div className="pointer-events-auto w-105 max-w-[95vw] rounded-4xl border border-accent/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] bg-background/30 backdrop-blur-2xl overflow-hidden">

          <div className="flex flex-col items-center pt-9 pb-7 border-b border-accent/10">
            <p className="font-display text-white/45 uppercase tracking-[0.5em] text-[13px] mb-2">
              The Art of Dressing
            </p>
            <h1 className="font-display text-white font-light tracking-[0.14em] text-5xl">
              LesChic
            </h1>
          </div>

          {/* signin and register form basically based on the toggle */}

          <div className="auth-form-container">
            {isRegister ? <Signup /> : <Login />}
          </div>

          {/* toggling things */}


          <div className="mx-8 mb-2 flex p-1.5 bg-white/5 rounded-full relative border border-accent/10">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-secondary rounded-full transition-all duration-300 ease-out shadow-lg ${isRegister ? "left-[calc(50%+2px)]" : "left-1"}`}/>

            <button onClick={() => setRegister(false)} className={`relative z-10 w-1/2 py-2 text-[10px] uppercase tracking-widest font-display transition-colors duration-300 cursor-pointer ${!isRegister ? "text-white" : "text-white/40 hover:text-white"}`}>
              Sign In
            </button>

            <button onClick={() => setRegister(true)} className={`relative z-10 w-1/2 py-2 text-[10px] uppercase tracking-widest font-display transition-colors duration-300 cursor-pointer ${isRegister ? "text-white" : "text-white/40 hover:text-white"}`}>
              Sign up
            </button>

          </div>


          
        
        </div>

        
       


      </div>

    </div>
  )
}