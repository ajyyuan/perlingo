// A dedicated surface keeps vertical page scrolling available on lesson content.
export function swipeDirection(start, end) {
  const dx=end.x-start.x, dy=end.y-start.y, duration=end.time-start.time;
  if(duration<0||duration>900||Math.abs(dy)<40||Math.abs(dy)<Math.abs(dx)*1.5)return null;
  return dy<0?'next':'prev';
}

export function bindLearningSwipe(root, {enabled, navigate}) {
  let gesture=null;
  root.addEventListener('pointerdown',event=>{
    if(gesture){gesture=null;return;}
    const surface=event.target.closest('[data-learning-swipe]');
    if(!surface||event.pointerType!=='touch'||!event.isPrimary||!enabled())return;
    gesture={id:event.pointerId,surface,x:event.clientX,y:event.clientY,time:event.timeStamp};
    surface.setPointerCapture(event.pointerId);
  });
  root.addEventListener('pointerup',event=>{
    const start=gesture;
    if(!start||start.id!==event.pointerId)return;
    gesture=null;
    if(!start.surface.isConnected||!enabled())return;
    const direction=swipeDirection(start,{x:event.clientX,y:event.clientY,time:event.timeStamp});
    if(direction){event.preventDefault();navigate(direction);}
  });
  const cancel=()=>{gesture=null;};
  root.addEventListener('pointercancel',cancel);
  root.addEventListener('lostpointercapture',cancel);
  // A second finger anywhere cancels navigation, including pinch gestures.
  root.ownerDocument.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'&&!event.isPrimary)cancel();
  },true);
}
