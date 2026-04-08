import React from 'react'
import "@/styles/global.css";
import "@/styles/research/research.css";
import TopBar from '@/components/layout/TopBar';

const page = () => {
  return (
    <>

      <div className='research_page_container'>
        <TopBar />
        <br />

        {/* <h1 className='heading'>Research</h1> */}

        <div className='research_articles_container'>

          <h1 className='heading'>Research</h1>


          <div className='research_card'>
            <p className='publish_time'>Published: Mar 25, 2026</p>
            <h1 className='title_heading'>Introducing : JIT Tool Spawning Protocol</h1>
            <p className='short_description'>A Server-Side Routing Architecture for Infinite-Tool AI Agents</p>
          </div>

          <div className='research_card'>
            <p className='publish_time'>Published: Mar 25, 2026</p>
            <h1 className='title_heading'>Introducing : JIT Tool Spawning Protocol</h1>
            <p className='short_description'>A Server-Side Routing Architecture for Infinite-Tool AI Agents</p>
          </div>

          <div className='research_card'>
            <p className='publish_time'>Published: Mar 25, 2026</p>
            <h1 className='title_heading'>Introducing : JIT Tool Spawning Protocol</h1>
            <p className='short_description'>A Server-Side Routing Architecture for Infinite-Tool AI Agents</p>
          </div>


        </div>
      </div>
    </>
  )
}

export default page