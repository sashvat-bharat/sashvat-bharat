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
          <MoveRight strokeWidth={1} />
        </div>


        <div className='intro-text'>
          <h1>Rule the Horizon. Beyond Limits!</h1>
          <p>Built to last. Designed to lead. Engineered for the future.</p>
        </div>


        <center>
          <button className="event-horizon-btn">
            <span className="btn-text">Enter the Horizon</span>
            <div className="btn-underline"></div>
          </button>
        </center>

        <div className="hero-image">
          <Image src="/ascii.svg" alt="hero-image" width={100} height={100} />
        </div>

      </div>
    </>
  )
}

export default HeroSection