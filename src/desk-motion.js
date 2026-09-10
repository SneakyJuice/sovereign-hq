import {gsap} from 'gsap';

export function createDeskMotion(host) {
  const rows = [...host.querySelectorAll('.desk-job')];
  const timeline = gsap.timeline({paused:true,repeat:-1,repeatDelay:1.1,
    onUpdate:()=>{host.dataset.frame=String(Math.round(timeline.totalTime()*100));}
  });
  rows.forEach((row,i)=>{
    const start=i*2.2;
    timeline.fromTo(host.querySelectorAll('.desk-source')[i],{y:0},{y:-5,duration:.45,ease:'power2.out'},start);
    timeline.to(host.querySelectorAll('.desk-source')[i],{y:0,duration:.5},start+.45);
    timeline.fromTo(host.querySelectorAll('.desk-signal')[i],{strokeDashoffset:80,opacity:0},{strokeDashoffset:0,opacity:1,duration:.9,ease:'power1.inOut'},start+.15);
    timeline.to(host.querySelectorAll('.desk-signal')[i],{opacity:0,duration:.35},start+1);
    timeline.fromTo(row,{backgroundColor:'rgba(212,183,122,0)'},{backgroundColor:'rgba(212,183,122,.24)',duration:.45},start+.8);
    timeline.fromTo(row.querySelector('.desk-check'),{scale:1},{scale:1.18,duration:.3,yoyo:true,repeat:1},start+1);
    timeline.to(row,{backgroundColor:'rgba(212,183,122,0)',duration:.8},start+1.4);
  });
  host.dataset.renderer='desk';
  return timeline;
}
