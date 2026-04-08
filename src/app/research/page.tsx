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

        <div className='research_articles_container'>

          <h1 className='heading'>Research</h1>


          <div className='research_card'>
            <p className='publish_time'>Published: Mar 25, 2026</p>
            <h1 className='title_heading'>Introducing : JIT Tool Spawning Protocol</h1>
            <p className='short_description'>A Server-Side Routing Architecture for Infinite-Tool AI Agents</p>
          </div>

          <div className='research_card'>
            <p className='publish_time'>Published: April 02, 2026</p>
            <h1 className='title_heading'>Neural Context Compression: Scaling Beyond 10M Tokens</h1>
            <p className='short_description'>Exploring a novel architectural approach to KV-cache optimization that enables near-infinite context windows without linear memory degradation.</p>
          </div>

          <div className='research_card'>
            <p className='publish_time'>Published: March 28, 2026</p>
            <h1 className='title_heading'>Synthetica-V3: Cross-Modal Reasoning and Latent Synthesis</h1>
            <p className='short_description'>A breakthrough in unified model training where visual, auditory, and textual data share a singular latent space for true multi-sensory intelligence.</p>
          </div>

          <div className='research_card'>
            <p className='publish_time'>Published: March 15, 2026</p>
            <h1 className='title_heading'>Autonomous Heuristic Discovery in Decentralized Swarms</h1>
            <p className='short_description'>Analyzing how multi-agent systems can autonomously develop and refine their own communication protocols to solve complex logistical bottlenecks.</p>
          </div>


        </div>
      </div>
    </>
  )
}

export default page