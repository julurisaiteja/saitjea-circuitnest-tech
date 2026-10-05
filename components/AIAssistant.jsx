'use client';
import { useState } from 'react';
import { brand } from '../lib/brand';
export default function AIAssistant(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{role:'bot',text:`Hi — I'm ${brand.aiName}. Ask about products, sizing, deals, or ordering.`}]);
  function ask(h){ setMsgs(m=>[...m,{role:'user',text:h.q},{role:'bot',text:h.a}]); }
  return (<>
    {open&&(
      <div className="ai-panel">
        <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:'1px solid color-mix(in srgb, var(--muted) 25%, transparent)'}}>
          <div><p className="font-semibold">{brand.aiName}</p><p className="text-xs text-muted">Live demo assistant</p></div>
          <button onClick={()=>setOpen(false)} className="text-muted text-sm">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 p-4 text-sm">
          {msgs.map((m,i)=>(
            <div key={i} className={`max-w-[90%] rounded-2xl px-3 py-2 ${m.role==='user'?'ml-auto':''}`}
              style={{background:m.role==='user'?'var(--brand)':'color-mix(in srgb, var(--muted) 18%, transparent)',color:m.role==='user'?'#fff':'var(--text)'}}>{m.text}</div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 p-3" style={{borderTop:'1px solid color-mix(in srgb, var(--muted) 25%, transparent)'}}>
          {brand.aiHints.map(h=><button key={h.q} onClick={()=>ask(h)} className="chip text-left">{h.q}</button>)}
        </div>
      </div>
    )}
    <button className="ai-fab" aria-label="Open AI assistant" onClick={()=>setOpen(v=>!v)}>AI</button>
  </>);
}
