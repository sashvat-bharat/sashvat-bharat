import React from 'react'
import "@/styles/research.css";
import TopBar from '@/components/layout/TopBar';

const page = () => {
  return (
    <>
      <TopBar />

      <center><h1 className='heading'>Research</h1></center>

      <div className='research_container'>

        <div className='research_card'>
          <h2>JIT (Just-in-Time) Tool Spawning Protocol</h2>
          <p>The JIT (Just-in-Time) Tool Spawning Protocol: A Server-Side Routing Architecture for Infinite-Tool AI Agents</p>
          <button>Read More</button>
        </div>

      </div>

    </>
  )
}

export default page