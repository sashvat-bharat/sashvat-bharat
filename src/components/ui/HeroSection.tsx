import Image from 'next/image'
import "@/styles/global.css"
import "@/styles/ui/HeroSection.css"
import { MoveRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <>
      <div className="hero-section">

        <div className='label'>
          <div className='dot'></div>
          <p>Introducing: JIT Tool Spawning Protocol</p>
          {/* <p>Introducing Genesis</p> */}
          {/* <p>Introducing Genesis, try now</p> */}
          <MoveRight strokeWidth={1} />
        </div>


        <div className='intro-text'>
          {/* <h1>Legacy Tech is a Liability. Build Something Sashvat.</h1> */}
          <h1>Rule the Horizon. Beyond Limits.</h1>
          <p>We’re building a new generation of technology that’s sustainable, ethical, and designed for the long haul. Because the best ideas deserve to last.</p>
        </div>

        <button className="button_w_icon">Experience Now</button>

        <div className="hero-image">
          <Image src="/ascii.svg" alt="hero-image" width={100} height={100} />
        </div>

      </div>
    </>
  )
}

export default HeroSection