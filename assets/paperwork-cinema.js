export function createPaperworkCinema(root) {
  const video=root.querySelector('.paperwork-film video');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,paused=reduced.matches,unavailable=false;
  function play(){
    if(paused||reduced.matches||!visible||document.hidden||unavailable)return;
    if(!video.src){video.src=video.dataset.src;video.load();}
    video.play().then(()=>{if(paused||reduced.matches||unavailable||!visible||document.hidden){video.pause();return;}root.dataset.cinemaState='playing';}).catch(error=>{if(error.name==='AbortError'||reduced.matches||unavailable||paused)return;root.dataset.cinemaState='autoplay-blocked';document.querySelector('#motion-toggle')?.click();});
  }
  const api={pause(){paused=true;video.pause();},resume(){paused=false;play();}};
  video.addEventListener('error',()=>{unavailable=true;root.dataset.cinemaState='unavailable';video.removeAttribute('src');video.load();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;if(paused){video.pause();video.removeAttribute('src');video.load();}else play();});
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)play();else video.pause();},{threshold:.15}).observe(video);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();});
  return api;
}
