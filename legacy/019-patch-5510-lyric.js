
/* ================================================================
   5.5.703 AI 题库兼容归一化 + 回复防崩溃
   旧补丁的 32 个意图用 hi/mid/lo，新库用 rep{cold,mid,warm}，
   不统一会导致匹配后读 .rep 报错、聊天不回复。这里统一之。
   ================================================================ */
(function(){
 function norm(){
  try{
   if(!window.XZ_AI_INTENTS)return;
   for(var i=0;i<XZ_AI_INTENTS.length;i++){
    var it=XZ_AI_INTENTS[i];
    if(!it)continue;
    if(!it.rep && (it.hi||it.lo||it.mid)){
     var mid=(it.mid&&it.mid.length)?it.mid:((it.hi&&it.hi.length)?it.hi:it.lo)||['嗯嗯'];
     it.rep={
      warm:(it.hi&&it.hi.length)?it.hi:mid,
      mid:mid,
      cold:(it.lo&&it.lo.length)?it.lo:mid
     };
    }
    if(!it.t)it.t=it.id||'闲聊';
    if(!it.sim)it.sim=(it.kws&&it.kws[0])?it.kws[0]:it.t;
    if(it.rep){
     var fb=(it.rep.mid&&it.rep.mid.length)?it.rep.mid:['嗯嗯，我在听'];
     ['cold','mid','warm'].forEach(function(b){
      if(!it.rep[b]||!it.rep[b].length)it.rep[b]=fb;
      /* 修掉被截断成一两个字的残缺回复 */
      it.rep[b]=it.rep[b].map(function(x){
       return (typeof x==='string'&&x.replace(/[\s，。！？、,.!?~～…"'“”]/g,'').length<2)?fb[0]:x;
      });
     });
    }
   }
   /* 修复旧补丁里被截断的“你是谁”回复 */
   var who=null;
   for(var j=0;j<XZ_AI_INTENTS.length;j++){if(XZ_AI_INTENTS[j].id==='who'){who=XZ_AI_INTENTS[j];break;}}
   if(who){
    who.t='你是谁';who.sim='你是谁？';
    who.rep={cold:['我是你的校园 AI 聊天搭子。'],
     mid:['我是住在这个游戏里、专门陪你聊天的同学呀。'],
     warm:['我是最懂你的那个 AI 同学～陪你聊天、答疑、解闷，随时都在！']};
   }
   window.__XZ_NORM_DONE=true;
  }catch(e){if(window&&window.console)console.warn('AI norm error',e);}
 }
 /* 回复函数防崩溃：任何异常都回退到兜底语，绝不让聊天卡住 */
 function guard(){
  try{
   if(window.__XZ_REPLY_GUARD||typeof xzAIReply!=='function')return;
   var orig=xzAIReply;
   window.xzAIReply=function(it,p){
    try{
     if(it&&it.rep){var r=orig.apply(this,arguments);if(r)return r;}
     if(it&&(!it.rep)){norm();if(it.rep)return orig.apply(this,arguments);}
    }catch(e){}
    return (window.XZ_AI_FALLBACK&&XZ_AI_FALLBACK.length)?XZ_AI_FALLBACK[Math.floor(Math.random()*XZ_AI_FALLBACK.length)]:'嗯嗯，我在听';
   };
   window.__XZ_REPLY_GUARD=true;
  }catch(e){}
 }
 function run(){norm();guard();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);
 else run();
 setTimeout(run,400);setTimeout(run,1600);setTimeout(run,3000);
})();
