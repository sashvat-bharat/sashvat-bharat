import "@/styles/global.css";
import TopBar from "@/components/layout/TopBar";
import HeroSection from "@/components/ui/HeroSection";


const page = () => {
  return (
    <>
      <div className='home-container'>
        <TopBar />
        <HeroSection />
      </div>
    </>
  )
}

export default page
