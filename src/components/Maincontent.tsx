import "@/styles/style.css";
import Image from "next/image";


export default function Maincontent() {
  return (
    <>
      <div className="landing_page">
        <Image className="background_image" src="/ascii.svg" alt="Logo" width={100} height={100} quality={100} />

        <div className="landing_components">
          <h1 className="landing_heading">Legacy Tech is a Liability <br /> so we&apos;re Building Something Sashvat.</h1>
        </div>
      </div>

      <div className="maincontent">

      </div>
    </>
  );
};
