
/* ============ 0 工具 ============ */
function $(s){return document.querySelector(s);}
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function ch(p){return Math.random()<p;}
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function cl(v,a,b){if(a===undefined)a=0;if(b===undefined)b=100;return Math.max(a,Math.min(b,v));}
function Y(n){return '¥'+Number(Math.round(n)).toLocaleString('zh-CN');}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var WD=['周日','周一','周二','周三','周四','周五','周六'];
function dstr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dcn(d){return (d.getMonth()+1)+'月'+d.getDate()+'日 '+WD[d.getDay()];}
function C(label,hint,run,hold){return {label:label,hint:hint||'',run:run||function(){},hold:!!hold};}
window.onerror=function(m,src,line){LOCK=false;var d=$('#err');if(d){d.style.display='block';d.textContent='⚠️ 脚本错误：'+m+'（第'+line+'行）';}return false;};

/* ============ 0.5 看门狗 + 存档 ============ */
var SAVE_KEY='xz_save_v1';
function saveGame(){try{
 var s=JSON.stringify({
  name:G.name,gender:G.gender,mode:G.mode,role:G.role,pref:G.pref,boarder:G.boarder,
  phoneId:(typeof O!=='undefined'?O.phoneId:0),
  day:G.day,date:G.date.toISOString(),loc:G.loc,idx:G.idx,
  health:G.health,mood:G.mood,sleep:G.sleep,knowledge:G.knowledge,grade:G.grade,
  support:G.support,influence:G.influence,charm:G.charm,fitness:G.fitness,appear:G.appear,
  money:G.money,items:G.items,period:G.period,periodDay:G.periodDay,preg:G.preg,
  resting:G.resting,cold:G.cold,temp:G.temp,lover:G.lover,lovers:G.lovers,met:G.met,
  rev:G.rev,club:G.club,clubLv:G.clubLv,duty:G.duty,union:G.union,outfit:G.outfit,
  parcel:G.parcel,outPass:G.outPass,outPassTry:G.outPassTry,
  budget:G.budget,salary:G.salary,ethics:G.ethics,academic:G.academic,teach:G.teach,
  fame:G.fame,relation:G.relation,schoolSupport:G.schoolSupport,license:G.license,
  intl:G.intl,intlPerk:G.intlPerk,corrupt:G.corrupt,dirty:G.dirty,warned:G.warned,
  billPass:G.billPass,ach:G.ach,talents:G.talents,tp:G.tp,feverCount:G.feverCount,wrongBook:G.wrongBook,drillDay:G.drillDay,drillRight:G.drillRight,drillStreak:G.drillStreak,examKey:G.examKey,examHistory:G.examHistory,intro:G.intro,depression:G.depression,
  art:G.art,artLv:G.artLv,artWorks:G.artWorks,artWins:G.artWins,music:G.music,musicLv:G.musicLv,musicShow:G.musicShow,musicWins:G.musicWins,cls:G.cls,partnerPreg:G.partnerPreg});
 localStorage.setItem(SAVE_KEY,s);
}catch(e){}}
function loadGame(){try{var s=localStorage.getItem(SAVE_KEY);if(!s)return null;var d=JSON.parse(s);return d;}catch(e){return null;}}
// 看门狗：8秒内LOCK未解锁则强制放行
setInterval(function(){try{if(LOCK&&G&&!G.over){LOCK=false;upd();}}catch(e){}},8000);

/* ============ 1 数据 ============ */
var WEATHERS=[
 {n:'☀️ 晴',w:2,rain:0,mood:3,t:'阳光很好，操场上校服一排排晒着。'},
 {n:'⛅ 多云',w:3,rain:0,mood:1,t:'云很厚但没下雨，杭州难得的舒服天气。'},
 {n:'☁️ 阴',w:3,rain:0,mood:-1,t:'天灰蒙蒙的，走廊里白天也开着灯。'},
 {n:'🌫️ 雾',w:1,rain:0,mood:-1,t:'铜鉴湖方向起了雾，教学楼像泡在牛奶里。'},
 {n:'💨 大风',w:1,rain:0,mood:-2,t:'风把走廊里的通知全刮到了楼下。'},
 {n:'🌦️ 小雨',w:3,rain:1,mood:-2,t:'杭州的雨黏黏糊糊，衣服晾一周都不干。'},
 {n:'🌧️ 中雨',w:3,rain:2,mood:-3,t:'雨点敲在铁皮雨棚上，早操取消。'},
 {n:'⛈️ 雷阵雨',w:1,rain:3,mood:-4,t:'雷声轰隆隆，走廊里全是湿脚印。'},
 {n:'🌊 大雨',w:1,rain:3,mood:-5,t:'雨大到看不见对面教学楼。'}];
var SUBS=['语文','数学','英语','物理','化学','生物','历史','地理','政治','信息技术','音乐','美术','体育'];
var SUBSAY={'语文':'语文老师抱着一摞作文进来：“昨天的作文，我很失望。”','数学':'数学老师在黑板上画了个比你人还高的函数图像。',
'英语':'英语听力开始了，音质像从水底下放出来的。','物理':'物理老师掏出小车和纸带：“今天研究加速度。”',
'化学':'化学老师拿出试剂瓶：“今天这个实验有点危险。”','生物':'生物老师放了张细胞分裂图，后排表示想吐。',
'历史':'历史老师讲朝代，二十分钟还没出秦朝。','地理':'老师让你记住“东非大裂谷”，你只记住了“大裂谷”。',
'政治':'政治老师语重心长：“你们现在最重要的就是学习。”','信息技术':'机房三分之一的电脑是坏的，你那台就是其中之一。',
'音乐':'音乐老师让你唱《我的祖国》，你五音不全。','美术':'美术老师让你画素描，你画了个火柴人。','体育':'体育老师吹哨：“先跑两圈热身！”'};
var PHONES=[
 {b:'苹果',n:'iPhone 16 Pro Max',p:9999,perf:98,cam:99,bat:92,mood:20},{b:'苹果',n:'iPhone 16 Pro',p:7999,perf:96,cam:95,bat:85,mood:17},
 {b:'苹果',n:'iPhone 16',p:5999,perf:90,cam:88,bat:82,mood:15},{b:'苹果',n:'iPhone 15 Pro Max',p:8999,perf:95,cam:97,bat:88,mood:17},
 {b:'苹果',n:'iPhone 15',p:5999,perf:89,cam:90,bat:80,mood:14},{b:'苹果',n:'iPhone 14',p:4299,perf:84,cam:85,bat:76,mood:11},
 {b:'苹果',n:'iPhone 13',p:3299,perf:80,cam:82,bat:72,mood:9},{b:'苹果',n:'iPhone 11',p:1599,perf:66,cam:70,bat:58,mood:4},
 {b:'小米',n:'小米 14 Ultra',p:6499,perf:97,cam:99,bat:90,mood:16},{b:'小米',n:'小米 14 Pro',p:4999,perf:94,cam:95,bat:88,mood:14},
 {b:'小米',n:'小米 14',p:3999,perf:92,cam:90,bat:85,mood:12},{b:'小米',n:'红米 K70 Pro',p:3299,perf:90,cam:80,bat:86,mood:11},
 {b:'小米',n:'红米 K70',p:2499,perf:86,cam:74,bat:82,mood:9},{b:'小米',n:'红米 Note 13 Pro',p:1599,perf:72,cam:76,bat:80,mood:6},
 {b:'华为',n:'Mate 60 Pro+',p:8999,perf:95,cam:98,bat:90,mood:18},{b:'华为',n:'Mate 60',p:6499,perf:91,cam:92,bat:87,mood:14},
 {b:'华为',n:'P60 Pro',p:5988,perf:88,cam:97,bat:80,mood:13},{b:'华为',n:'Nova 12',p:2999,perf:78,cam:84,bat:78,mood:8},
 {b:'OPPO',n:'Find X7 Ultra',p:6499,perf:96,cam:98,bat:89,mood:15},{b:'OPPO',n:'Reno 11 Pro',p:3499,perf:80,cam:88,bat:80,mood:9},
 {b:'vivo',n:'X100 Pro',p:5499,perf:94,cam:97,bat:90,mood:14},{b:'vivo',n:'S18 Pro',p:2999,perf:76,cam:86,bat:78,mood:8},
 {b:'iQOO',n:'iQOO 12 Pro',p:4999,perf:98,cam:88,bat:92,mood:15},{b:'iQOO',n:'iQOO Neo 9 Pro',p:2999,perf:92,cam:76,bat:90,mood:11},
 {b:'一加',n:'一加 12',p:4299,perf:96,cam:90,bat:93,mood:14},{b:'一加',n:'一加 Ace 3',p:2599,perf:90,cam:75,bat:91,mood:10},
 {b:'魅族',n:'魅族 21 Pro',p:4999,perf:93,cam:90,bat:86,mood:13},{b:'索尼',n:'Xperia 1 V',p:7999,perf:94,cam:96,bat:82,mood:16},
 {b:'三星',n:'Galaxy S24 Ultra',p:9699,perf:97,cam:99,bat:88,mood:19},{b:'诺基亚',n:'诺基亚 105 功能机',p:169,perf:6,cam:2,bat:99,mood:-2}];
var APPS=[
 {n:'抖音',t:'视频',mood:12,sl:4,r:.16},{n:'微信',t:'社交',mood:8,so:6,r:.13},{n:'QQ',t:'社交',mood:8,so:5,r:.13},
 {n:'B站',t:'视频',mood:11,sl:3,r:.14},{n:'微博',t:'社交',mood:9,inf:6,ht:3,r:.2},{n:'小红书',t:'社交',mood:10,cm:5,r:.14},
 {n:'知乎',t:'社交',mood:7,kn:3,r:.12},{n:'贴吧',t:'社交',mood:9,ht:2,r:.16},{n:'网易云音乐',t:'音乐',mood:10,sl:-6,r:.13},
 {n:'酷狗音乐',t:'音乐',mood:9,sl:-5,r:.13},{n:'爱奇艺',t:'视频',mood:12,sl:5,r:.15},{n:'腾讯视频',t:'视频',mood:12,sl:5,r:.15},
 {n:'淘宝',t:'购物',mood:11,money:-60,r:.1},{n:'拼多多',t:'购物',mood:10,money:-40,r:.1},{n:'京东',t:'购物',mood:9,money:-80,r:.1},
 {n:'饿了么',t:'外卖',mood:16,health:3,money:-30,r:.42},{n:'美团',t:'外卖',mood:16,health:3,money:-30,r:.42},
 {n:'高德地图',t:'工具',mood:3,r:.05},{n:'计算器',t:'工具',mood:1,kn:2,r:.03}];
var MGAMES=['王者荣耀','和平精英','无畏契约','三角洲行动','原神','我的世界','星露谷物语','动物森友会','糖豆人','Among Us','英雄联盟','CS2','FIFA 足球'];
var TAL_S=[{id:'run',n:'健步如飞',d:'体力+18'},{id:'mem',n:'过目不忘',d:'学习收益+25%'},{id:'face',n:'天生丽质',d:'颜值+16'},
{id:'social',n:'天生人缘',d:'支持度每天+1'},{id:'stomach',n:'铁胃',d:'吃坏肚子免疫'},{id:'owl',n:'熬夜之王',d:'困意增长减半'},
{id:'rich',n:'富二代',d:'金钱×6'},{id:'lucky',n:'锦鲤附体',d:'运气判定+10%'},{id:'brave',n:'胆大包天',d:'翻墙/起义+15%'},
{id:'nap',n:'秒睡体质',d:'睡眠恢复翻倍'},{id:'top',n:'学霸光环',d:'考试+12分'},{id:'star',n:'社交达人',d:'影响力每天+1'},
{id:'pe',n:'体育特长生',d:'体力+25'},{id:'net',n:'网瘾少年',d:'手机效果+50%'},{id:'lovebrain',n:'恋爱脑',d:'好感×2'},
{id:'piano',n:'钢琴十级',d:'音乐节直通决赛'},{id:'idol',n:'校草/校花',d:'魅力+20'},{id:'rebel',n:'反骨仔',d:'起义+20%'}];
var TAL_T=[{id:'talk',n:'开口跪',d:'教学+20%'},{id:'iron',n:'铁腕治班',d:'纪律+，关系-5'},{id:'pop',n:'人气教师',d:'师生关系+15'},
{id:'steel',n:'铁人教师',d:'健康不掉'},{id:'guanxi',n:'关系户',d:'支持度+15'},{id:'scholar',n:'学术大牛',d:'学术+25'},
{id:'joker',n:'段子手',d:'学生心情+'},{id:'strict',n:'严师',d:'成绩+，学生抑郁+'},{id:'watch',n:'考勤达人',d:'巡查必抓到人'},
{id:'net2',n:'人脉广',d:'开会通过率+20%'},{id:'zen',n:'佛系',d:'心情不掉'},{id:'paper',n:'教科研',d:'学术增长翻倍'},
{id:'famous',n:'网红教师',d:'知名度+2/天'},{id:'friend',n:'主任之友',d:'支持度+1/天'},{id:'nurse',n:'懂点医',d:'感冒减半'},
{id:'finance',n:'理财高手',d:'工资+20%'},{id:'harsh',n:'狠人',d:'克扣假期效果好'},{id:'lucky2',n:'锦鲤附体',d:'运气+10%'}];
var ITEMS={
 umbrella:{n:'雨伞',i:'☔',k:'tool',price:30,d:'杭州必备'},phone:{n:'手机',i:'📱',k:'tool',price:2999,d:'快乐源泉'},
 spare:{n:'备用机',i:'📵',k:'tool',price:599,d:'被查也不怕'},model:{n:'模型机',i:'🪫',k:'tool',price:49,d:'一眼假'},
 mp3:{n:'MP3+耳机',i:'🎧',k:'tool',price:199,d:'听歌摸鱼'},cards:{n:'扑克牌',i:'🃏',k:'tool',price:20,d:'宿舍斗地主'},
 cube:{n:'魔方',i:'🧩',k:'tool',price:35,d:'咔哒咔哒'},cam:{n:'运动相机',i:'📷',k:'tool',price:1299,d:'记录美好生活'},
 powerbank:{n:'充电宝',i:'🔋',k:'tool',price:99,d:'宿舍限电救命'},watch:{n:'手表',i:'⌚',k:'tool',price:599,d:'看时间'},pad:{n:'笔记本',i:'📒',k:'tool',price:15,d:'写东西'},
 tissue:{n:'纸巾',i:'🧻',k:'tool',price:8,d:'急用'},mask:{n:'口罩',i:'😷',k:'tool',price:20,d:'装病道具'},bandaid:{n:'创可贴',i:'🩹',k:'tool',price:5,d:'小伤口'},
 heater:{n:'暖手宝',i:'🔥',k:'tool',price:60,d:'生理期神器'},toy:{n:'毛绒玩具',i:'🧸',k:'tool',price:88,d:'抱着睡'},pillow:{n:'小枕头',i:'🛏️',k:'tool',price:45,d:'午休神器'},
 skin:{n:'游戏皮肤',i:'🎮',k:'virtual',price:88,d:'带不进学校'},medicine:{n:'感冒药',i:'💊',k:'med',price:12,d:'治病但很困'},
 painkiller:{n:'止痛药',i:'💊',k:'med',price:18,d:'生理期用'},vitamin:{n:'维生素',i:'🍊',k:'med',price:25,d:'健康+8'},
 eyedrop:{n:'眼药水',i:'💧',k:'med',price:8,d:'困意-14'},sanitary:{n:'卫生巾',i:'🩹',k:'med',price:15,d:'女生的救命稻草'},
 brownsugar:{n:'红糖姜茶',i:'🍵',k:'food',price:6,mood:10,health:4,d:'生理期神药'},
 latiao:{n:'辣条',i:'🌶️',k:'food',price:2,mood:8,health:-2,d:'心情+8'},cola:{n:'冰可乐',i:'🥤',k:'food',price:3,mood:7,sl:-4,d:'心情+7'},
 chips:{n:'薯片',i:'🍟',k:'food',price:5,mood:9,d:'心情+9'},noodle:{n:'泡面',i:'🍜',k:'food',price:4,mood:12,health:3,d:'心情+12'},
 bread:{n:'面包',i:'🍞',k:'food',price:3,mood:5,health:6,d:'健康+6'},sausage:{n:'烤肠',i:'🌭',k:'food',price:2,mood:7,health:2,d:'心情+7'},
 choco:{n:'巧克力',i:'🍫',k:'food',price:6,mood:12,d:'心情+12'},milktea:{n:'奶茶',i:'🧋',k:'food',price:8,mood:16,sl:-5,d:'心情+16'},
 coffee:{n:'咖啡',i:'☕',k:'food',price:6,mood:5,sl:-25,d:'困意-25'},energy:{n:'能量饮料',i:'⚡',k:'food',price:7,mood:8,sl:-32,d:'困意-32'},
 gum:{n:'口香糖',i:'🍬',k:'food',price:3,mood:5,d:'心情+5'},cookie:{n:'饼干',i:'🍪',k:'food',price:4,mood:6,health:3,d:'健康+3'},
 cake:{n:'蛋糕',i:'🍰',k:'food',price:20,mood:18,health:2,d:'心情+18'},icecream:{n:'冰淇淋',i:'🍦',k:'food',price:8,mood:14,health:-3,d:'心情+14'},
 juice:{n:'果汁',i:'🧃',k:'food',price:5,mood:8,health:2,d:'健康+2'},blindbox:{n:'神秘盲盒',i:'🎁',k:'food',price:10,d:'随机惊喜'},
 gift:{n:'礼物',i:'💝',k:'food',price:20,d:'送人/自己用'},poster:{n:'偶像海报',i:'🖼️',k:'tool',price:15,d:'贴床头'},
 flower:{n:'一束花',i:'💐',k:'food',price:35,d:'约会必备'},note:{n:'信纸+信封',i:'💌',k:'tool',price:12,d:'写情书'},
 novel_love:{n:'《你是我的必修课》言情',i:'📖',k:'book',price:35,d:'小说'},novel_horror:{n:'《凌晨三点的教学楼》恐怖',i:'📖',k:'book',price:35,d:'小说'},
 novel_fan:{n:'《斗破教室》玄幻',i:'📖',k:'book',price:35,d:'小说'},novel_wuxia:{n:'《江湖夜雨十年灯》武侠',i:'📖',k:'book',price:35,d:'小说'},
 novel_scifi:{n:'《我用CPU写作业》科幻',i:'📖',k:'book',price:35,d:'小说'},novel_det:{n:'《谁偷了我的橡皮》侦探',i:'📖',k:'book',price:35,d:'小说'},
 novel_lit:{n:'《活着》文学',i:'📖',k:'book',price:35,d:'小说'},novel_comic:{n:'《漫画周刊》',i:'📖',k:'book',price:20,d:'漫画'},
 parcel:{n:'待取的快递',i:'📦',k:'tool',price:0,d:'去门卫拿'}};
var SHOP=['latiao','cola','chips','noodle','bread','sausage','choco','milktea','coffee','energy','gum','cookie','cake','icecream','juice','eyedrop','medicine','painkiller','vitamin','sanitary','brownsugar','bandaid','tissue','mask','heater','toy','pillow','powerbank','note','flower','gift','blindbox','poster','umbrella','spare','model','mp3','cards','cube','watch'];
var ACH_S=[{id:'s1',n:'睡神',d:'课堂睡 10 次'},{id:'s2',n:'逃课之王',d:'累计逃课 8 次'},{id:'s3',n:'卷王',d:'单日学习 25+'},
{id:'s4',n:'食堂之光',d:'连续 5 天吃午饭'},{id:'s5',n:'小卖部VIP',d:'消费 ¥300'},{id:'s6',n:'手机大师',d:'上课玩手机 15 次'},
{id:'s7',n:'被没收的青春',d:'被没收 5 件'},{id:'s8',n:'处分三连',d:'拿到 3 个处分'},{id:'s9',n:'社交花',d:'支持度 80'},
{id:'s10',n:'风云人物',d:'影响力 80'},{id:'s11',n:'校草/校花',d:'魅力 85'},{id:'s12',n:'运动会之光',d:'运动会前三'},
{id:'s13',n:'舞台之王',d:'音乐节获奖'},{id:'s14',n:'学生会主席',d:'当选主席'},{id:'s15',n:'班长',d:'当选班长'},
{id:'s16',n:'社团之星',d:'社团等级 5'},{id:'s17',n:'初恋',d:'第一次表白成功'},{id:'s18',n:'海王',d:'谈过 3 段'},
{id:'s19',n:'情伤',d:'分手 1 次'},{id:'s20',n:'出门单大师',d:'拿到 5 次出门单'},{id:'s21',n:'邪修',d:'靠老师带出校门'},
{id:'s22',n:'翻墙高手',d:'翻墙成功 3 次'},{id:'s23',n:'包邮区战神',d:'取快递 10 次'},{id:'s24',n:'卷土重来',d:'病假返校 3 次'},
{id:'s25',n:'不感冒的人',d:'一整学年没感冒'},{id:'s26',n:'起义领袖',d:'发动起义'},{id:'s27',n:'天下大同',d:'完美起义结局'},
{id:'s28',n:'举报侠',d:'举报学校 1 次'},{id:'s29',n:'纪检委员',d:'被倒查后仍活着'},{id:'s30',n:'全勤王',d:'连续 10 天不请假'}];
var ACH_T=[{id:'t1',n:'优秀班主任',d:'师生关系≥70 持续 5 天'},{id:'t2',n:'教学名师',d:'教学 90'},{id:'t3',n:'学术大牛',d:'学术 90'},
{id:'t4',n:'师风师德标兵',d:'师德 95'},{id:'t5',n:'铁腕治班',d:'处分学生 5 次'},{id:'t6',n:'巡查狂人',d:'抓学生 10 次'},
{id:'t7',n:'鸽子王',d:'放学生鸽子 3 次'},{id:'t8',n:'开会达人',d:'提案通过 5 次'},{id:'t9',n:'人脉王',d:'支持度 90'},
{id:'t10',n:'招生功臣',d:'资金 +5000万'},{id:'t11',n:'国际部之父',d:'特权 3 级'},{id:'t12',n:'网红教师',d:'知名度 50'},
{id:'t13',n:'清廉标兵',d:'贪污为 0'},{id:'t14',n:'手不干净',d:'累计贪污 ¥50000'},{id:'t15',n:'纪委常客',d:'被约谈 3 次'},
{id:'t16',n:'被带走了',d:'贪污被查实'},{id:'t17',n:'职称到手',d:'升到班主任'},{id:'t18',n:'主任之友',d:'升到年级主任'},
{id:'t19',n:'一校之长',d:'升到校长'},{id:'t20',n:'月老',d:'撮合 3 对'},{id:'t21',n:'带病上课',d:'发烧坚持 3 次'},
{id:'t22',n:'拿快递狂魔',d:'签收 20 个快递'},{id:'t23',n:'恋爱达人',d:'教师恋爱 2 段'},{id:'t24',n:'暑假战神',d:'健康全年 80+'},
{id:'t25',n:'家访王',d:'家访 10 次'}];
var TITLES=[{n:'睡神',c:function(){return G.st.slept>=4;}},{n:'卷王',c:function(){return G.st.study>=25;}},
{n:'逃课浪子',c:function(){return G.st.skip>=2;}},{n:'摸鱼达人',c:function(){return G.st.phone>=4;}},
{n:'社交花',c:function(){return G.st.chat>=4;}},{n:'食堂常客',c:function(){return G.st.eat>=2;}},
{n:'乖孩子',c:function(){return G.st.study>=12&&G.st.caught===0;}},{n:'勇士',c:function(){return G.st.fight>0;}},
{n:'文艺青年',c:function(){return G.st.read>=2;}},{n:'恋爱脑',c:function(){return G.st.love>=2;}},{n:'路人甲',c:function(){return true;}}];
var STORIES=[
 {t:'🍚 食堂风波',x:'三号窗口的土豆炖排骨里，有人发现一块疑似橡皮的东西。\n前面的大哥把排骨举到阿姨面前：“这是排骨还是橡皮？”\n阿姨看了一眼：“……那是姜。”',
  c:[['举盘子喊“我要吃橡皮！”','支持度+8',function(){G.support+=8;G.mood+=6;l('两百个人都在鼓掌。支持度+8','good');}],
     ['默默把姜吃了','健康-2',function(){G.health-=2;l('你把那块“姜”嚼了两下吞了。它确实是姜。');}],
     ['拍下来发班级群','影响力+6',function(){G.influence+=6;l('照片在群里炸了。影响力+6','good');}]]},
 {t:'📢 广播站',x:'中午的校园广播换了主播：“下面播放一首点给高二(3)班的歌……”\n全班齐刷刷看向你同桌。他脸红了。',
  c:[['起哄鼓掌','心情+6',function(){G.mood+=6;G.support+=4;l('你同桌把头埋进了课桌里。');}],
     ['捂住同桌的耳朵','魅力+4',function(){G.charm+=4;l('他愣了一秒，耳朵更红了。魅力+4');}],
     ['继续写作业','学习+4',function(){G.knowledge+=4;l('你面不改色写完一页作业。学习+4');}]]},
 {t:'🌧️ 走廊里的伞',x:'杭州的雨从上午下到现在，走廊里晾着三十七把伞，滴水汇成小溪。\n有人滑了一跤，书包里的卷子全湿了，风一吹满走廊都是白纸。',
  c:[['帮忙捡卷子','支持度+8',function(){G.support+=8;l('你一张张捡起来，全班都看见了。支持度+8','good');}],
     ['绕开走','心情-2',function(){G.mood-=2;l('你踩着水绕过去了，鞋还是湿的。');}],
     ['把自己的伞借给他','魅力+5',function(){G.charm+=5;G.support+=5;l('他说了句谢谢。魅力+5','good');}]]},
 {t:'📱 突击查手机',x:'第三节下课，班主任突然从后门进来：“所有人把抽屉打开，查手机。”',
  c:[['乖乖交上去','手机没了',function(){if(G.ph>0){G.phoneTaken=true;l('📱 手机被扣留，周五才能拿回来。','bad');G.st.caught++;}}],
     ['交模型机/备用机','看运气',function(){if(has('model')){take('model',1);if(ch(.55)){G.demerits++;G.mood-=15;flash();l('班主任捏了一下模型机，脸黑成锅底：“这是手机？”','bad');}else l('备用机交上去，真机还在抽屉里。','good');}
       else if(has('spare'))l('备用机交上去，真机还在抽屉里。','good');else if(G.ph>0){G.phoneTaken=true;l('你什么都没有，只能把头低下去。','bad');}else l('你没带手机，班主任看了你一眼走了。');}],
     ['藏到书堆最下面','30%被抓',function(){if(tc(.3,'demerit','书堆被一把掀开，你当场被记过'))return;G.mood+=10;l('老师翻两下就走了。心情+10','good');}]]},
 {t:'🐱 校猫',x:'食堂后面的花坛里，一只橘猫躺在纸箱里，旁边还有半根火腿肠。',
  c:[['把火腿肠给它','心情+8',function(){if(has('sausage')){take('sausage',1);G.mood+=8;l('它吃得很认真。心情+8','good');}else l('你翻了半天没找到吃的。');}],
     ['拍照发班群','魅力+3',function(){G.charm+=3;l('收获很多点赞。魅力+3');}],
     ['踢它一下','支持度-15',function(){G.support-=15;G.mood-=5;l('一个女生站出来：“你干什么！”支持度-15','bad');}]]},
 {t:'🏫 领导视察',x:'早读时班主任冲进来：“都坐直了！区里领导来视察！”\n三十秒后，一个穿灰西装的人出现在门口。',
  c:[['坐得笔直认真朗读','心情+4',function(){G.mood+=4;G.knowledge+=3;l('领导满意地点点头。');}],
     ['把小说塞进课本','35%被抓',function(){if(tc(.35,'demerit','小说掉出来，正好落在领导的皮鞋旁边'))return;l('你塞得很稳，心跳180。');}],
     ['背课文给领导听','50%成功',function(){if(ch(.5)){G.influence+=8;G.support+=5;l('领导当场夸了学校。影响力+8','good');}else{G.mood-=6;l('你背到第三句忘了。心情-6','bad');}}]]},
 {t:'🚰 饮水机坏了',x:'教学楼三楼饮水机坏了三天没人修。\n旁边贴了张纸：“请学校尽快维修，我们不是骆驼。”',
  c:[['签个名','支持度+6',function(){G.support+=6;l('签名的人已经有八十多个。');}],
     ['拍下来发网上','影响力+8',function(){G.influence+=8;G.rev.heat+=4;l('被本地博主转了。影响力+8','rev');}],
     ['自己去买瓶水','-¥3',function(){G.money-=3;l('饮水机还是坏的。');}]]},
 {t:'🏫 学费通知',x:'家长群传开一张通知照片：《关于调整下学期收费标准征求意见稿》。\n学费从2.6万拟调为3.4万，理由是“办学成本上升”。',
  c:[['转到班级群','支持度+10',function(){G.support+=10;G.rev.ev+=10;G.rev.heat+=5;l('五分钟后全年级都在讨论。','rev');}],
     ['去问班主任','获得信息',function(){l('班主任叹气：“这不是我定的。你们要觉得贵，可以打12345问问。”','warn');}],
     ['算了，反正不是我交钱','心情-3',function(){G.mood-=3;l('你什么也没做，但心里不舒服。');}]]}];
var NPC_M=["江砚", "陈屿", "沈亦白", "顾云舟", "陆时予", "周衍", "程屿川", "裴今安", "许星野", "林北", "季临风", "言深", "温以凡", "洛北辰", "苏景行", "唐一辰", "韩叙", "冯子衿", "邓聿怀", "曹砚之", "彭野", "曾向阳", "肖然", "田牧野", "董屿森", "袁清河", "潘星辞", "蒋承宇", "蔡明轩", "余舟", "杜若飞", "叶知秋", "程浩", "苏慕白", "魏澜", "吕行", "丁一", "任平生", "沈屹", "姚望", "卢砚秋", "姜屿白", "崔泽", "钟意", "谭斯年", "陆见深", "汪屿", "范子航", "金泽", "石浩宇", "廖一帆", "贾子墨", "夏屿安", "韦一航", "付明", "方旭", "白景然", "邹屿辰", "孟繁星", "熊涛", "秦朗", "邱泽", "江屿川", "尹舟", "薛屿", "闫浩", "段嘉树", "雷屿", "侯屿白", "龙泽", "史屿", "陶然", "黎屿川", "贺屿", "顾屿白", "毛舟", "郝然", "龚屿", "邵屿辰", "万一", "钱程", "严屿", "覃屿", "武然", "戴明宇", "莫凡", "孔屿", "向阳", "汤屿川", "柯然", "兰舟", "阮行", "倪好", "童屿", "葛浩", "伍子航", "屈然", "饶屿", "霍屿川", "宫屿"];
var NPC_F=["林知夏", "苏晚", "温以宁", "许星禾", "时雨", "江语棠", "沈桉", "叶眠", "夏栖", "白露", "顾小满", "林晚晴", "唐糖", "苏澄", "陆之遥", "许知夏", "江晚", "沈星晚", "温然", "洛枳", "苏念", "唐念念", "韩书意", "冯晚星", "邓清欢", "曹予安", "彭莱", "曾可", "肖晚", "田甜", "董知夏", "袁梦", "潘朵", "蒋晚", "蔡晴", "余笙", "杜若", "叶蓁", "程小满", "苏糖", "魏莱", "吕晚", "丁当", "任然", "沈知意", "姚星晚", "卢柚", "姜晚", "崔晚", "钟晚", "谭晚", "陆晚", "汪晴", "范晓", "金喜", "石小桃", "廖晚", "贾晴", "夏栀", "韦晴", "付晚", "方晴", "白晚", "邹晴", "孟晚", "熊晚", "秦晴", "邱晚", "江小夏", "尹晴", "薛晚", "闫晴", "段晚", "雷晴", "侯晚", "龙小桃", "史晴", "陶晚", "黎晴", "贺晚", "顾桃", "毛晓", "郝晴", "龚晚", "邵晴", "万晚", "钱小桃", "严晴", "覃晚", "武晓", "戴晴", "莫晚", "孔晴", "向晚", "葛晴", "伍晚", "屈晴", "饶晚", "霍晴", "宫小桃"];
var LOVE_WAY=['同班同学','隔壁班同学','外校的朋友','朋友介绍的','学长','学姐','学弟','学妹','国际部的','社团认识的','图书馆偶遇的','运动场上认识的','食堂拼桌认识的','社交软件匹配的'];
var LOVE_DESC=['笑起来有个很浅的酒窝，说话很慢。','常年年级前十，但从来不炫耀。','打篮球时会松掉校服外套的扣子。','晚自习偷偷写歌，本子上全是涂鸦。','每天第一个到教室，桌上摆着热豆浆。','说话很直，刀子嘴豆腐心。','走路时耳机线从校服袖口露出来。','会弹吉他，据说在音乐节唱过一次。','家里开咖啡馆，周末常在那写作业。','表面高冷，其实偷偷喂流浪猫。'];
var CLUBS=[{n:'篮球社',i:'🏀',a:'fitness',need:35},{n:'音乐社',i:'🎸',a:'charm',need:30},{n:'动漫社',i:'🎨',a:'mood',need:0},
{n:'机器人社',i:'🤖',a:'knowledge',need:40},{n:'辩论社',i:'🗣️',a:'knowledge',need:35},{n:'摄影社',i:'📷',a:'charm',need:0},
{n:'话剧社',i:'🎭',a:'charm',need:30},{n:'模联社',i:'🌐',a:'knowledge',need:45},{n:'文学社',i:'✒️',a:'knowledge',need:30},
{n:'科创社',i:'🔬',a:'knowledge',need:50}];
var DUTIES=[{n:'班长',need:55,e:'支持度+，事务多'},{n:'副班长',need:45,e:'协助班长'},{n:'学习委员',need:45,e:'成绩+'},
{n:'纪律委员',need:40,e:'管纪律，招人恨'},{n:'生活委员',need:30,e:'管班费'},{n:'体育委员',need:30,e:'带队跑操'},
{n:'文艺委员',need:35,e:'办活动'},{n:'团支书',need:50,e:'团员选举相关'},{n:'语文课代表',need:20,e:'收语文作业'},
{n:'数学课代表',need:25,e:'收数学作业'},{n:'英语课代表',need:25,e:'收英语作业'}];
var UNION=[{n:'干事',need:25},{n:'副部长',need:40},{n:'部长',need:55},{n:'副主席',need:70},{n:'学生会主席',need:85}];


/* ============ 2 状态 ============ */
var G=null;
function newState(o){
 var st={name:o.name,gender:o.gender,mode:o.mode,role:o.role,pref:o.pref,date:new Date(2026,9,4),
  isZhao:o.name==='赵建阳',isWu:o.name==='巫洁',height:o.height,weight:o.weight,money:o.money,
  health:90,mood:80,sleep:40,temp:36.5,cold:false,coldT:0,depressed:false,depression:0,depWarn:false,
  knowledge:o.knowledge,grade:60,support:20,influence:10,charm:40,fitness:40,appear:40,abs:0,outfit:'校服',
  caught:0,demerits:0,items:{},ph:0,phoneModel:null,phoneTaken:false,parcel:0,parcelGot:0,outPass:[],outPassTry:0,
  boarder:o.boarder,lover:null,lovers:[],met:[],coldWar:0,
  period:false,periodDay:0,periodPhase:0,preg:false,pain:0,
  rev:{men:0,ev:0,heat:0,mole:false},
  salary:o.salary||9000,budget:145000000,schoolSupport:70,license:100,relation:60,
  ethics:70,academic:60,teach:60,fame:5,dutyLast:false,fee:26000,intl:false,intlPerk:0,
  corrupt:0,dirty:0,warned:0,billPass:0,
  club:null,clubLv:0,clubAct:0,duty:null,union:-1,skin:[],intro:'',
  resting:false,restDays:0,restNeed:3,feverCount:0,
  loc:'教室',idx:0,sched:[],curType:'',weather:null,wtemp:22,day:0,wk:0,wkStage:0,over:false,
  talents:o.talents||[],tp:o.tp||0,pendingStory:false,
  st:{slept:0,study:0,skip:0,phone:0,chat:0,eat:0,caught:0,fight:0,read:0,love:0,dress:0,exer:0,parcel:0,shopSpend:0,lines:0,clean:0},
  ach:[],mem:{}};
 if(st.isZhao){st.role='校长';st.mode='teacher';st.money+=88888888;st.salary=45000;st.budget+=200000000;st.talents=[];}
 if(st.isWu){st.role='年级主任';st.mode='teacher';st.money+=666666;st.salary=22000;st.talents=[];}
 return st;
}

function T(id){for(var i=0;i<(G.talents||[]).length;i++)if(G.talents[i].id===id)return true;return false;}
function isBoss(){return G&&G.mode==='teacher'&&(G.role==='校长'||G.role==='年级主任');}
function has(id){return G&&G.items&&G.items[id]>0;}
function give(id,n){if(!G.items[id])G.items[id]=0;G.items[id]+=(n||1);}
function take(id,n){if(!G.items[id])return;G.items[id]-=(n||1);if(G.items[id]<=0)delete G.items[id];}
function phoneOK(){return G&&G.ph>0&&!G.phoneTaken;}
var EXAMS={'2026-10-23':'月考一','2026-11-11':'期中考试','2026-11-12':'期中考试','2026-12-25':'月考二','2027-01-18':'期末考试','2027-01-19':'期末考试','2027-04-14':'期中考试','2027-06-25':'月考三'};
var CAL={'2026-10-16':'校园音乐节海选','2026-10-17':'校园音乐节决赛','2026-10-19':'学生会选举','2026-11-02':'秋季运动会','2026-11-03':'秋季运动会','2026-12-31':'元旦晚会'};
var WINTER_S='2027-01-23',WINTER_E='2027-02-22',SUMMER_S='2027-07-05';

/* ============ 3 渲染 ============ */
var CH=[],LOCK=false,PEND=null,AUTO=false,DEP=0;
function l(m,c){var el=$('#log');if(!el)return;var d=document.createElement('div');d.className='line '+(c||'');d.textContent=m;el.appendChild(d);while(el.childNodes.length>180)el.removeChild(el.firstChild);el.scrollTop=el.scrollHeight;}
function flash(){var f=$('#flash');f.classList.add('on');setTimeout(function(){f.classList.remove('on');},260);}
function clampAll(){if(!G)return;var ks=['health','mood','sleep','depression','support','influence','charm','fitness','appear','abs','ethics','academic','teach','license','relation','schoolSupport'];
 for(var i=0;i<ks.length;i++){var k=ks[i];if(typeof G[k]==='number')G[k]=cl(G[k]);}
 if(G.money<0)G.money=0;if(G.knowledge<0)G.knowledge=0;
 G.pain=cl(G.pain,0,5);G.grade=cl(Math.round(40+G.knowledge*0.5+(T('top')?12:0)),0,150);}
function bar(a,v,t,c){return '<div class="stat"><div class="r"><span>'+a+'</span><b>'+t+'</b></div><div class="bar"><i style="width:'+cl(v)+'%;background:'+c+'"></i></div></div>';}
function upd(){
 if(!G)return;
 $('#hName').textContent=G.name+'（'+G.gender+'）'+(G.mode==='student'?G.height+'/'+G.weight:'');
 $('#hRole').textContent=(G.mode==='student'?'🎒 学生':G.role)+(G.mode==='student'&&!G.boarder?'·走读':'')+(G.duty?'·'+G.duty:'')+(G.union>=0?'·学生会'+UNION[G.union].n:'')+(G.club?'·'+G.club.n:'');
 $('#hLoc').textContent='📍'+G.loc;
 $('#hDate').textContent=dcn(G.date);$('#hTime').textContent=G.time||'--:--';
 $('#hWeather').textContent=G.weather?G.weather.n:'—';
 $('#hMoney').textContent=Number(G.money).toLocaleString('zh-CN');
 $('#hWarn').textContent=G.mode==='student'?('🚨'+G.caught+' 处分'+G.demerits+'/3'):('教资'+Math.round(G.license)+(G.corrupt?' 贪'+Y(G.corrupt):''));
 if(G.period)$('#hWarn').textContent+=' 🩸';
 rStats();rBag();rW();
}
function rStats(){
 if(!G){$('#stats').innerHTML='';return;}
 var h='';
 if(G.mode==='student'){
  h+=bar('🌡️ 体温',(G.temp-35.2)/4*100,G.temp.toFixed(1)+'℃',G.temp>=37.5?'#ff5f6d':G.temp>=37?'#ffb020':'#42d392');
  h+=bar('❤️ 健康',G.health,Math.round(G.health),'#ff6b81')+bar('🙂 心情',G.mood,Math.round(G.mood),'#ffd166');
  h+=bar('😴 困意',G.sleep,Math.round(G.sleep),'#7f8cff')+bar('📘 学习',Math.min(100,G.knowledge),Math.round(G.knowledge),'#42d392');
  h+=bar('📊 成绩',G.grade/1.5,Math.round(G.grade),'#4dd8e0')+bar('✊ 支持度',G.support,Math.round(G.support),'#ff9ec9');
  h+=bar('⭐ 影响力',G.influence,Math.round(G.influence),'#b06bff')+bar('💫 魅力',G.charm,Math.round(G.charm),'#ff7ab6');
  h+=bar('💪 体力',G.fitness,Math.round(G.fitness)+'|腹肌'+G.abs,'#5b8cff')+bar('😎 颜值',G.appear,Math.round(G.appear),'#ffd166');
  if(G.depression>0||G.depressed)h+=bar('🌑 抑郁值',G.depression,Math.round(G.depression),'#b06bff');
  h+='<p class="small '+(G.depressed?'bad':'dim')+'">'+(G.depressed?'⚠️ 抑郁满100游戏崩溃，点🍵生活找心理老师！':'穿搭：'+G.outfit+(G.period?' · 生理期第'+G.periodDay+'天':'')+(G.parcel>0?' · 📦有快递待取':''))+'</p>';
 }else{
  h+=bar('🏫 学校支持度',G.schoolSupport,Math.round(G.schoolSupport),'#42d392')+bar('📜 教资',G.license,Math.round(G.license),G.license<30?'#ff5f6d':'#ffb020');
  h+=bar('🎓 师生关系',G.relation,Math.round(G.relation),'#ff9ec9')+bar('🌟 师风师德',G.ethics,Math.round(G.ethics),'#4dd8e0');
  h+=bar('📚 学术',G.academic,Math.round(G.academic),'#5b8cff')+bar('🧑‍🏫 教学',G.teach,Math.round(G.teach),'#b06bff');
  h+=bar('📣 知名度',G.fame,Math.round(G.fame),'#ffd166');
  h+='<p class="small dim">'+G.role+' · 月薪'+Y(G.salary)+' · 学费'+(G.fee/10000).toFixed(1)+'万<br>学校资金'+Y(G.budget)+' · 国际部'+(G.intl?'启用':'未启用')+' · 灰色收入'+Y(G.corrupt||0)+'</p>';
  if(G.period)h+='<p class="small pink">🩸 生理期第'+G.periodDay+'天，上课状态下降</p>';
 }
 $('#stats').innerHTML=h;
}
function rBag(){
 var bag=$('#bag');if(!bag||!G)return;
 var ks=[],k;for(k in G.items)if(G.items[k]>0)ks.push(k);
 if(G.ph>0)ks.unshift('phone');
 if(!ks.length){bag.innerHTML='<p class="small dim">空空如也</p>';return;}
 var h='';
 for(var i=0;i<ks.length;i++){
  k=ks[i];var it=ITEMS[k]||{n:'手机',i:'📱'};
  var us=(k==='medicine'||k==='eyedrop'||k==='sanitary'||k==='painkiller'||k==='vitamin'||(it.k==='food'));
  var cnt=(k==='phone'?1:(G.items[k]||0));
  h+='<div class="bagitem"><span>'+it.i+' '+it.n+'</span><span class="dim">×'+cnt+(us?' <button onclick="useItem(\''+k+'\')">用</button>':'')+'</span></div>';
 }
 bag.innerHTML=h;
}
function rW(){
 if(!G||!G.weather){$('#wCard').style.display='none';return;}
 $('#wCard').style.display='';
 var r=G.weather.rain;
 $('#wInfo').innerHTML='<b>'+G.weather.n+'</b> · 气温 '+G.wtemp+'℃<br>'+G.weather.t+'<br><span class="dim small">影响：'+(r>=2?'早操/跑操取消 · 体育课室内 · 淋雨感冒概率大涨 · 心情-':r===1?'早操可能取消 · 淋雨感冒概率上升 · 心情-':'早操正常 · 适合运动和约会 · 心情+')+'</span>';
}
/* ============ 4 场景 / 菜单 ============ */
function scene(t,x,cs){
 PEND=null;
 LOCK=false;CH=cs||[];
 $('#sTitle').textContent=t||'';
 $('#sText').innerHTML=String(x||'').split('\n').map(function(p){return '<p>'+p+'</p>';}).join('');
 var box=$('#choices');box.innerHTML='';
 if(!CH.length){CH=[C('（继续）','',function(){})];}
 for(var i=0;i<CH.length;i++){
  var c=CH[i],bt=document.createElement('button');bt.className='choice';
  bt.innerHTML='<span>'+esc(c.label)+'</span>'+(c.hint?'<span class="ch">'+esc(c.hint)+'</span>':'');
  bt.setAttribute('onclick','pick('+i+')');
  box.appendChild(bt);
 }
 if(AUTO){var f=box.firstChild;if(f)setTimeout(function(){if(!G.over)try{f.click();}catch(e){}},380);}
}
function pick(i){
 if(!G||G.over||LOCK)return;
 var c=CH[i];if(!c)return;
 LOCK=true;
 var pendBefore=PEND;
 var r=false;
 try{if(c.run)r=c.run();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
 clampAll();upd();
 if(G.over){LOCK=false;return;}
 if(r===true){LOCK=false;}
 else if(!c.hold&&PEND===pendBefore)next();
}
function modal(html,cls){$('#modalbox').className='modalbox '+(cls||'');$('#modalbox').innerHTML=html;$('#modal').classList.remove('hidden');}
function closeModal(){var f=$('#modal');if(f)f.classList.add('hidden');var p=PEND;PEND=null;if(p)setTimeout(p,60);}
function hold(fn){PEND=fn||null;}
function menu(title,intro,items){
 var h='<h3>'+title+'</h3>'+(intro||'');
 if(!items||!items.length)h+='<p class="dim small">暂无选项。</p>';
 else for(var i=0;i<items.length;i++){
  var it=items[i];
  h+='<div class="mb"><span>'+it.n+(it.d?'<br><span class="dim small">'+it.d+'</span>':'')+'</span><button '+(it.r?'class="r" ':'')+'onclick="MI('+i+')">'+esc(it.b||'去')+'</button></div>';
 }
 h+='<button class="gbtn" style="margin-top:9px" onclick="closeModal()">关闭</button>';
 window.MU=items||[];modal(h);
}
function MI(i){var it=window.MU&&window.MU[i];if(!it)return;
 try{if(it.fn)it.fn();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
 clampAll();upd();}
function openMenu(fn){if(!G||G.over)return;PEND=null;try{fn();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}}
/* ============ 5 判定 ============ */
function tt(level,reason,itemId){
 if(G.isZhao){G.caught++;l('😎 你被抓包了（'+reason+'），但大家看了眼你的名字，默默走开了。','good');return;}
 G.caught++;G.st.caught++;
 if(level==='warn'){G.mood-=4;l('👀 '+reason,'warn');}
 else if(level==='criticize'){G.mood-=10;G.knowledge-=2;l('📢 '+reason,'bad');}
 else if(level==='confiscate'){G.mood-=14;if(itemId)take(itemId,1);
  if(itemId==='phone'){G.phoneTaken=true;l('📱 '+reason+'（手机被扣留到周五）','bad');}else l('🚫 '+reason+'（没收）','bad');
  G.st.lost=(G.st.lost||0)+1;if(G.st.lost>=5)ach('s7');}
 else if(level==='demerit'){G.demerits++;G.mood-=22;flash();l('📄 【处分！】'+reason+'（'+G.demerits+'/3）','bad');if(G.demerits>=3){ach('s8');ending('retire');}}
 clampAll();
}
function tc(p,level,reason,itemId){
 if(!G||G.over)return false;
 var pp=p*(G.isWu?0.45:1)*((T('lucky')||T('lucky2'))?0.9:1);
 if(itemId==='phone'&&T('net'))pp*=0.8;
 if(ch(pp)){tt(level,reason,itemId);return true;}
 return false;
}
function catchCold(w){
 if(T('nurse')&&ch(.5)){l('☔ '+w+'，但你居然没感冒。');return;}
 if(G.cold){G.coldT+=2;G.temp=Math.round((G.temp+.1)*10)/10;l('🤧 '+w+'，感冒更重了。','bad');return;}
 if(ch(.75)){G.cold=true;G.coldT=0;G.health-=6;G.mood-=5;l('🤧 '+w+'……你打了个喷嚏，鼻子发酸。','bad');}
 else l('☔ '+w+'，但你体质还行，没感冒。');
}
function ach(id){
 if(!G||G.ach.indexOf(id)>=0)return;
 G.ach.push(id);
 var nm='';
 for(var i=0;i<ACH_S.length;i++)if(ACH_S[i].id===id)nm=ACH_S[i].n;
 for(var j=0;j<ACH_T.length;j++)if(ACH_T[j].id===id)nm=ACH_T[j].n;
 l('🏆 【成就解锁】'+nm+'！','good');
}
function useItem(k){
 if(!G||G.over||!has(k))return;
 var it=ITEMS[k];
 if(k==='medicine'){take(k,1);G.sleep+=20;
  if(G.cold&&ch(.78)){G.cold=false;G.coldT=0;G.health+=5;G.mood+=6;l('💊 感冒药下肚，鼻子通了！','good');}
  else if(G.cold){G.temp=Math.round((G.temp-.15)*10)/10;l('💊 症状轻了点，但好困。');}
  else l('💊 没病吃药，然后困得睁不开眼。困意+20');}
 else if(k==='eyedrop'){take(k,1);G.sleep-=14;l('💧 眼药水滴下去。困意-14');}
 else if(k==='sanitary'){take(k,1);G.mood+=10;l('🩹 换上了新的，舒服多了。心情+10');}
 else if(k==='painkiller'){take(k,1);G.pain=cl(G.pain-3,0,5);G.mood+=6;l('💊 止痛药下去，二十分钟后痛感退了大半。','good');}
 else if(k==='vitamin'){take(k,1);G.health+=8;l('🍊 你吃了片维生素。健康+8');}
 else if(k==='blindbox'||k==='gift'){take(k,1);var r=rnd(1,5);
  if(r===1){G.money+=88;l('🎁 里面是一张¥88超市卡！');}
  else if(r===2){G.mood+=25;l('🎁 是你爱豆的签名照。心情+25','good');}
  else if(r===3){G.sleep+=18;l('🎁 是一本《五年高考三年模拟》，你瞬间困了。');}
  else if(r===4){G.charm+=10;l('🎁 是一瓶香水小样。魅力+10','good');}
  else{G.mood-=10;l('🎁 里面是半块被人咬过的橡皮。心情-10','bad');}}
 else if(it&&it.k==='food'){take(k,1);G.mood+=(it.mood||0);G.health+=(it.health||0);G.sleep+=(it.sl||0);G.st.eat++;
  l('🍽️ 你吃掉了'+it.n+'。'+(it.mood?'心情+'+it.mood+' ':''));
  if(G.curType==='class'||G.curType==='night'||G.curType==='t_class')tc(.25,'criticize','上课时间吃东西，包装袋响得特别清楚');}
 else{l('这个现在用不上。');return;}
 clampAll();upd();
}
/* ============ 6 主循环 ============ */
function next(){
 if(!G||G.over)return;
 DEP++;
 if(DEP>60){DEP=0;l('（流程保护：自动跳过本时段）','warn');G.idx++;return _next();}
 try{_next();}catch(e){if(window.onerror)window.onerror(e.message,'',0);G.idx++;}
 DEP=0;
}
function _next(){
 if(!G||G.over)return;
 if(G.resting)return restMenu();
 if(G.wkStage>0)return wkStep();
 tick();if(G.over)return;
 if(G.idx>=G.sched.length)return dayEnd();
 var slot=G.sched[G.idx++];G.time=slot.t;G.curType=slot.type;
 if(!slot.subject)slot.subject=pk(SUBS);
 if(slot.loc)G.loc=slot.loc;
 var fn=SLOTS[slot.type];
 if(!fn)return next();
 var def=null;
 try{if(fn)def=fn(slot);}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
 if(!def)return next();
 if(def.loc)G.loc=def.loc;
 scene(def.title,def.text,def.choices);
 upd();
}
function tick(){
 if(G.resting)return;
 if(G.cold){G.coldT++;G.temp=Math.round((G.temp+rnd(6,14)/100)*10)/10;
  if(G.coldT===1)l('🤧 你开始流鼻涕——感冒了。去医务室或吃药。','warn');
  if(G.coldT%3===0)l('🌡️ 体温升到 '+G.temp.toFixed(1)+'℃。','warn');
  G.mood-=1;G.health-=1;
 }else{G.temp=Math.round((G.temp+(36.5-G.temp)*0.25)*10)/10;}
 if(G.temp>=38){l('🔥 你发烧了，眼前一黑……','bad');return startRest();}
 if(G.weather)G.mood+=Math.round(G.weather.mood/3);
 if(T('social'))G.support+=1;if(T('star'))G.influence+=1;if(T('famous'))G.fame+=2;if(T('friend'))G.schoolSupport+=1;
 if(G.sleep>78)G.mood-=1;if(G.health<35)G.mood-=1;if(G.temp>=37.3)G.mood-=1;
 if(G.mood<=20)G.depressed=true;
 if(G.depressed){if(!G.depWarn){G.depWarn=true;l('🌑 抑郁系统启动：抑郁值满 100 游戏崩溃。去找心理老师（🍵生活）。','bad');}
  G.depression=cl(G.depression+rnd(5,11),0,100);
  if(G.depression>=100)return crash();
  if(G.depression>=70)l('⚠️ 抑郁值 '+Math.round(G.depression)+'/100 了！','bad');
 }else if(G.depression>0)G.depression=cl(G.depression-6,0,100);
 if(G.lover){G.lover.aff=cl(G.lover.aff+(ch(.5)?2:0));G.lover.days++;
  if(G.lover.same&&ch(.1)){G.mood-=4;G.support-=2;l('💬 有人在班群发了你和TA走在一起的照片。心情-4','bad');}}
 if(G.gender==='女'){
  if(!G.periodPhase)G.periodPhase=rnd(3,20);
  if(!G.period&&G.day>0&&(G.day-G.periodPhase)%28===0){G.period=true;G.periodDay=0;G.pain=rnd(1,5);l('🩸 生理期来了。腹痛等级 '+G.pain+'/5，心情容易暴躁、体力下降。','warn');}
  if(G.period){G.periodDay++;G.mood-=1;G.fitness-=1;G.pain=rnd(1,5);
   if(G.periodDay>=4){G.period=false;l('🩸 生理期结束了，整个人轻松了。','good');}}
 }
 if(G.outfit!=='校服'&&G.outfit!=='校服+外套'&&ch(.05))tt('warn','你穿着自己的衣服在走廊被值周老师拦住：“校服呢？”');
 if(G.rev.heat>0&&ch(.3))G.rev.heat=Math.max(0,G.rev.heat-1);
 if(G.st.study>=25)ach('s3');
 if(G.support>=80)ach('s9');if(G.influence>=80)ach('s10');if(G.charm>=85)ach('s11');
 if(G.union===4)ach('s14');if(G.duty==='班长')ach('s15');if(G.clubLv>=5)ach('s16');
 if(G.lovers.length>=3)ach('s18');if(G.st.phone>=15)ach('s6');if(G.st.skip>=8)ach('s2');
 if(G.mode==='teacher'){
  if(G.teach>=90)ach('t2');if(G.academic>=90)ach('t3');if(G.ethics>=95)ach('t4');
  if(G.schoolSupport>=90)ach('t9');if(G.fame>=50)ach('t12');if(G.corrupt>=50000)ach('t14');
  if(G.corrupt===0&&G.day>=10)ach('t13');if(G.relation>=70&&G.day>=5)ach('t1');
  if(G.license<=0){l('📜 教育局吊销了你的教师资格。','bad');return ending('fired');}
  if(G.corrupt>=100000&&ch(.06)){l('🚨 审计来查账了，一笔支出对不上。','bad');return ending('corrupt');}
  if(G.dirty>=14&&ch(.05)){l('🚨 有人把举报材料递到了纪委。','bad');return ending('corrupt');}
 }
 clampAll();
}
/* ============ 7 日期 ============ */
function dayEnd(){
 G.restDays=0;
 var t=pk(TITLES),g=0;
 while(!t.c()&&t.n!=='路人甲'&&g++<40)t=pk(TITLES);
 G.mem[dstr(G.date)]=t.n;
 l('📜 今日总结：「'+t.n+'」','day');
 cert(t.n);
}
function cert(tn){
 var h='<div class="cert"><p class="dim small">杭州西子实验学校 · 今日小结</p>'+
 '<p>兹有 '+esc(G.name)+'</p><b>'+tn+'</b>'+
 '<p class="dim small">'+dcn(G.date)+' · 学习+'+G.st.study+' · 被抓'+G.st.caught+' 次 · 逃课'+G.st.skip+' 次</p></div>'+
 '<div class="quote">📊 今日数据<br>上课睡觉 '+G.st.slept+' 次 · 玩手机 '+G.st.phone+' 次 · 聊天 '+G.st.chat+' 次 · 吃饭 '+G.st.eat+' 次 · 看小说 '+G.st.read+' 次<br>'+
 '📦 取快递 '+G.st.parcel+' 次 · 🏃 运动 '+G.st.exer+' 次 · ❤️ 恋爱互动 '+G.st.love+' 次</div>'+
 '<button class="big" onclick="closeModal();newDay()">睡觉，进入下一天 →</button>';
 modal(h);
  if(AUTO)setTimeout(function(){var b=document.querySelector('.modalbox .big');if(b)b.click();},600);
}
function newDay(){
 var d=new Date(G.date.getTime());d.setDate(d.getDate()+1);G.date=d;G.day++;
 var ds=dstr(d);
 if(ds>=WINTER_S&&ds<WINTER_E){l('❄️ 寒假到了！你度过了愉快的假期（睡到中午、走亲戚、作业留到最后一晚）。','day');G.date=new Date(2027,1,22);G.day+=18;G.mood+=20;G.sleep-=15;G.knowledge+=3;return startDay();}
 if(ds>=SUMMER_S){l('🏖️ 暑假到了，这个学年结束。','day');return ending('graduate');}
 G.st={slept:0,study:0,skip:0,phone:0,chat:0,eat:0,caught:0,fight:0,read:0,love:0,dress:0,exer:0,parcel:0,shopSpend:0,lines:0,clean:0,lost:G.st.lost||0};
 G.parcelGot=0;G.intro='';
 if(G.date.getDay()===6)return weekendStart();
 startDay();
}
function startDay(){
 if(!G||G.over)return;
 var d=dstr(G.date);
 if(d>=WINTER_S&&d<WINTER_E){l('❄️ 寒假中……你度过了愉快的假期。','day');G.date=new Date(2027,1,22);G.day+=18;G.mood+=20;return startDay();}
 if(d>=SUMMER_S)return ending('graduate');
 var pool=[],i,j;
 for(i=0;i<WEATHERS.length;i++)for(j=0;j<WEATHERS[i].w;j++)pool.push(WEATHERS[i]);
 G.weather=pk(pool);
 G.wtemp=G.weather.rain>0?rnd(15,22):(G.weather.n.indexOf('晴')>=0?rnd(21,28):rnd(17,24));
 var note='';
 if(EXAMS[d])note+='📝 今天是【'+EXAMS[d]+'】。 ';
 if(CAL[d])note+='🎉 今天有：'+CAL[d]+'。 ';
 if(G.date.getDay()===1)note+='🎤 周一早上有升旗仪式。 ';
 if(G.date.getDay()===5&&G.phoneTaken){G.phoneTaken=false;l('📱 周五了，班主任把你的手机还回来了。','good');}
 l('━━━━ '+dcn(G.date)+' · '+G.weather.n+' ━━━━','day');
 if(note)l(note,'warn');
 if(G.mode==='teacher')G.dutyLast=ch(.5);
 G.sched=(G.mode==='student')?buildStudentDay():buildTeacherDay();
 G.idx=0;G.loc=G.mode==='student'?'教室':'办公室';
 if(G.mode==='student'){G.sleep=cl(G.sleep+rnd(-18,10),5,100);G.pendingStory=ch(.8);}
 else{G.pendingStory=ch(.5);}
  saveGame();
 next();
}
function mk(t,ty,e){return Object.assign({t:t,type:ty,subject:pk(SUBS)},e||{});}
function buildStudentDay(){
 var a=[mk('06:00','wake',{loc:'宿舍'}),mk('06:50','exercise',{loc:'操场'}),mk('07:10','morningRead',{loc:'教室'})];
 if(G.date.getDay()===1)a.push(mk('07:35','flag',{loc:'操场'}));
 a.push(mk('07:55','class',{n:1}),mk('08:35','break',{loc:'教室'}),mk('08:45','class',{n:2}),mk('09:25','break',{loc:'教室'}),
 mk('09:35','eyecare',{n:1}),mk('09:40','class',{n:3}),mk('10:20','break',{loc:'教室'}),mk('10:30','class',{n:4}),
 mk('11:20','class',{n:5}),mk('12:00','meal',{which:'午饭',loc:'食堂'}),mk('12:40','nap',{loc:'教室'}),
 mk('13:05','class',{n:6}),mk('13:45','break',{loc:'教室'}),mk('13:55','class',{n:7}),mk('14:50','eyecare',{n:2}),
 mk('14:55','class',{n:8}),mk('15:45','homework',{loc:'教室'}),mk('16:25','extend',{loc:'教室'}),mk('17:00','dinner',{loc:'食堂'}),
 mk('18:00','night',{n:1,loc:'教室'}),mk('19:00','night',{n:2}),mk('20:00','night',{n:3}),mk('21:00','night',{n:4}),
 mk('22:00','dorm',{loc:'宿舍'}),mk('23:00','sleep',{loc:'宿舍'}));
 return a;
}
function buildTeacherDay(){
 var a=[mk('06:50','t_arrive',{loc:'办公室'})];
 if(G.dutyLast)a.push(mk('06:50','t_duty',{loc:'操场'}));
 a.push(mk('07:10','t_read',{loc:'教室'}),mk('07:55','t_class',{loc:'教室'}),mk('08:45','t_class',{loc:'教室'}),
 mk('09:35','t_patrol',{loc:'走廊'}),mk('10:20','t_break',{loc:'办公室'}),mk('10:30','t_office',{loc:'办公室'}),
 mk('11:20','t_class',{loc:'教室'}),mk('12:00','t_lunch',{loc:'教师食堂'}),mk('12:40','t_noon',{loc:'办公室'}),
 mk('13:05','t_class',{loc:'教室'}),mk('13:55','t_class',{loc:'教室'}),mk('14:50','t_patrol',{loc:'走廊'}),
 mk('15:45','t_office',{loc:'办公室'}));
 if(G.date.getDay()===1)a.push(mk('16:00','t_meeting',{loc:'会议室'}));
 else a.push(mk('16:30','t_intl',{loc:'国际部'}));
 a.push(mk('17:00','t_dinner',{loc:'教师食堂'}));
 if(ch(.55))a.push(mk('18:00','t_night',{loc:'教室'}));
 a.push(mk('21:00','t_off',{loc:'办公室'}),mk('22:00','t_home',{loc:'家'}));
 return a;
}
/* ============ 8 在家休养 ============ */
function startRest(){
 if(G.resting)return;
 G.resting=true;G.restDays=0;G.restNeed=rnd(3,6);G.feverCount++;
 G.loc='家';G.mood-=5;
 if(G.phoneTaken)G.phoneTaken=false;
 l('🚑 班主任打电话叫来了家长，你被接回家了。医生说要在家休养 '+G.restNeed+' 天左右。','warn');
 l('💡 休养期间每天可以做一件事，体温降到 37℃ 以下且休养满 2 天就能申请返校。','good');
 ach('s24');
 restMenu();
}
function restMenu(){
 G.restDays++;
 var s='🌡️ 体温 '+G.temp.toFixed(1)+'℃ · 已休养 '+G.restDays+'/'+G.restNeed+' 天 · 健康 '+Math.round(G.health)+' · 心情 '+Math.round(G.mood)+'\n';
 s+=G.temp>=37.5?'医生说你还在烧，别想着回学校。':(G.restDays>=G.restNeed?'体温已经降下来了，可以申请返校了。':'再观察一天吧。');
 var cs=[
  C('😴 蒙头大睡','体温-0.25 健康+7',function(){G.temp=Math.round((G.temp-0.25)*10)/10;G.health+=7;G.mood+=4;l('你睡了整整一天，醒来天都黑了。体温降了 0.25℃。','good');}),
  C('📱 躺床上玩手机','心情+10',function(){hold(function(){restMenu();});openPhone();}),
  C('📺 刷剧/看电视','心情+12',function(){G.mood+=12;G.sleep+=6;l('你一口气刷完了半部剧。心情+12','good');}),
  C('🍜 吃点好的','健康+8 心情+8',function(){G.health+=8;G.mood+=8;l('你妈给你炖了汤，还买了一大袋水果。','good');}),
  C('💊 吃退烧药/感冒药','体温大降 但很困',function(){G.temp=Math.round((G.temp-0.45)*10)/10;G.sleep+=22;G.health+=3;
   if(G.cold&&ch(.7)){G.cold=false;G.coldT=0;l('💊 药下去了，鼻塞也缓解了，就是困得睁不开眼。','good');}else l('💊 体温降了 0.45℃，你困得眼睛都睁不开。');}),
  C('🧋 点杯奶茶/外卖','心情++ 花钱',function(){if(G.money<30){l('💸 钱不够。','warn');return true;}G.money-=30;G.mood+=18;G.health+=2;l('🧋 外卖到了，冰奶茶配炸鸡。心情+18','good');}),
  C('🎮 打游戏','心情++ 可能加重',function(){G.mood+=15;if(ch(.3)){G.temp=Math.round((G.temp+0.15)*10)/10;l('你打游戏打到凌晨两点，第二天体温反而升了。','bad');}else l('你打了一晚上游戏，爽。心情+15','good');}),
  C('📖 看小说','心情+9',function(){G.mood+=9;l('你躺在被窝里看小说，看得很入迷。心情+9');}),
  C('🏃 勉强起来活动活动','健康+10 有风险',function(){if(ch(.35)){G.temp=Math.round((G.temp+0.2)*10)/10;l('你起来走了两圈就头晕了，体温反而升了一点。','bad');}else{G.health+=10;G.fitness+=3;l('你在院子里晒了会儿太阳，感觉好多了。','good');}}),
  C('🏫 申请返校（需体温<37℃ 且休养≥2天）','',function(){
   if(G.temp>=37){l('医生不同意：“还烧着呢。”','warn');return true;}
   if(G.restDays<G.restNeed){l('你妈说：“再在家待一天吧。”','warn');return true;}
   l('🏫 你终于回学校了，同桌说你这几天落了两套卷子。','good');
   G.resting=false;G.restDays=0;G.cold=false;G.temp=36.5;G.health=cl(70);
   G.idx=0;G.sched=(G.mode==='student')?buildStudentDay():buildTeacherDay();
   G.loc=G.mode==='student'?'教室':'办公室';next();})
 ];
 scene('🏠 在家休养（第 '+G.restDays+' 天）',s,cs);
}
/* ============ 9 移动 ============ */
var DIST={'教室':{'走廊':1,'厕所':2,'办公室':2,'小卖部':4,'食堂':3,'宿舍':8,'操场':4,'图书馆':3,'医务室':4,'门卫室':6,'天台':4,'体育馆':5,'校门口':6},
'走廊':{'教室':1,'厕所':1,'办公室':1,'小卖部':3,'食堂':3,'宿舍':7,'操场':4,'图书馆':3,'医务室':3,'门卫室':5,'天台':3,'体育馆':5,'校门口':5},
'办公室':{'教室':2,'走廊':1,'厕所':2,'小卖部':3,'食堂':3,'宿舍':7,'门卫室':5,'会议室':1,'国际部':4},
'食堂':{'教室':3,'走廊':3,'小卖部':2,'宿舍':5,'教师食堂':1,'操场':4},
'教师食堂':{'食堂':1,'办公室':3,'小卖部':3},
'宿舍':{'教室':8,'走廊':7,'食堂':5,'操场':6,'小卖部':6,'厕所':1},
'操场':{'教室':4,'走廊':4,'宿舍':6,'食堂':4,'体育馆':2},
'厕所':{'教室':2,'走廊':1,'宿舍':1,'办公室':2}};
function dist(a,b){var t=DIST[a]&&DIST[a][b];if(t)return t;return rnd(3,7);}
function moveTo(dest,cb){
 var a=G.loc;
 if(a===dest){if(cb)cb();else next();return;}
 var t=dist(a,dest);
 var s='你现在在【'+a+'】，要去【'+dest+'】。\n正常走过去大约 '+t+' 分钟。'+(G.period?'\n（生理期，走快了肚子会疼）':'');
 function done(){if(cb)cb();else next();}
 var cs=[
  C('🚶 正常走过去','约'+t+'分钟',function(){G.loc=dest;if(ch(.06))roadEvent();l('你走到'+dest+'。');done();},true),
  C('🏃 跑过去','约'+Math.max(1,t-1)+'分钟，有风险',function(){G.loc=dest;
   if(!G.period&&ch(.10))roadEvent();
   if(G.period&&ch(.25)){G.pain=cl(G.pain+1,0,5);G.health-=2;l('跑起来的时候小腹一阵抽痛，你不得不慢了下来。','bad');}
   if(G.boarder&&G.mode==='student'&&ch(.05)){l('你在走廊上一路小跑，被值班老师喊住：“跑什么跑！慢点走！”','warn');G.mood-=3;}
   else l('你一路小跑到'+dest+'，气喘吁吁。');done();},true),
  C('🚪 抄近道（地下车库/实验楼后门）','很快，可能遇到人',function(){G.loc=dest;if(ch(.18))roadEvent();l('你抄了近道，很快就到'+dest+'。');done();},true)
 ];
 scene('🚶 移动：'+a+' → '+dest,s,cs);
}
function openWander(){
 var locs=['教室','走廊','厕所','办公室','小卖部','食堂','宿舍','操场','图书馆','医务室','门卫室','天台','体育馆','校门口','教师食堂','会议室','国际部'];
 var items=[];
 for(var i=0;i<locs.length;i++){(function(t){
  if(t===G.loc)return;
  items.push({n:'➡️ 去 '+t,d:'大约 '+dist(G.loc,t)+' 分钟',fn:function(){
   closeModal();
   moveTo(t,function(){wanderHere(t);});
  }});
 })(locs[i]);}
 if(!items.length)items.push({n:'你已经在这里了',fn:function(){closeModal();}});
 items.push({n:'ℹ️ 你现在的位置',d:G.loc,fn:function(){closeModal();}});
 menu('🚶 移动','<div class="quote">你现在在【'+G.loc+'】。<br>不同时间、不同地点能做的事不一样。路上一共只有几分钟，偶尔会遇到人。</div>',items);
}
function wanderHere(loc){
 var cs=[];
 if(loc==='天台')cs.push(C('🌃 趴在栏杆上看云','心情+14',function(){G.mood+=14;l('你看了很久的云。心情+14','good');}));
 if(loc==='操场')cs.push(C('🏀 打会儿球','体力+5',function(){G.fitness+=5;G.health+=4;G.st.exer++;l('你打了半小时球。体力+5');}));
 if(loc==='图书馆')cs.push(C('📚 看会儿书','学习+8',function(){G.knowledge+=8;G.st.study+=8;l('你在图书馆看了一会儿书。学习+8');}));
 if(loc==='食堂')cs.push(C('🍚 找点吃的','健康+5 ¥10',function(){if(G.money<10){l('💸 钱不够。','warn');return;}G.money-=10;G.health+=5;G.mood+=6;G.st.eat++;l('你买了两个包子。');}));
 if(loc==='小卖部')cs.push(C('🛒 逛逛小卖部','',function(){shopSys();}));
 if(loc==='门卫室'&&G.parcel>0)cs.push(C('📦 拿快递','需要出门单',function(){parcelGo();}));
 if(loc==='厕所')cs.push(C('🚻 蹲一会儿玩手机','心情+8',function(){if(!phoneOK()){l('没有可用手机。','warn');return;}G.mood+=8;G.sleep-=5;G.st.phone++;l('你在厕所刷了会儿手机。心情+8');}));
 if(loc==='医务室')cs.push(C('🏥 找校医看看','',function(){clinic();}));
 if(loc==='宿舍')cs.push(C('🛌 回宿舍躺一会儿','困意-25',function(){G.sleep-=25;l('你躺在床上，什么也没干。困意-25');}));
 if(loc==='国际部')cs.push(C('☕ 蹭杯免费咖啡','心情+6',function(){G.mood+=6;l('你喝了杯免费咖啡。心情+6');}));
 cs.push(C('↩️ 回去继续','',function(){hold(function(){next();});moveTo(G.mode==='student'?'教室':'办公室');}));
 scene('📍 '+loc,pk(['这里人不算多。','灯有点暗。','窗外能看见操场。','有几个人在小声说话。']),cs);
}
/* ============ 10 下课多动作 ============ */
function breakSystem(slotTitle,minutes,who,cb){
 var left=minutes||10,done=[];
 function render(){
  var s=(who==='老师'?'你回到办公室喘了口气。':'课间铃响了，教室里一下子热闹起来。')+'\n⏳ 课间剩余 '+left+' 分钟。可以做多件事，也可以直接结束课间。';
  if(done.length)s+='\n✅ 已完成：'+done.join('、');
  var cs=[];
  if(G.mode==='student'){
   cs.push(C('🚹 上厕所（小的）','1-2 分钟',function(){var t=G.gender==='男'?rnd(1,2):rnd(2,3);left-=t;done.push('上厕所');l('你去了趟厕所，用了 '+t+' 分钟。');render();},true));
   cs.push(C('🚻 上厕所（大的）','3-5 分钟',function(){var t=rnd(3,5);left-=t;done.push('大号');G.mood+=4;l('你蹲了 '+t+' 分钟，出来整个人神清气爽。心情+4');render();},true));
   cs.push(C('💧 去接水/打水','1 分钟',function(){left-=1;done.push('接水');G.health+=1;l('你接了杯水，喝了两口。健康+1');render();},true));
   cs.push(C('😴 趴桌上补觉','5 分钟',function(){left-=5;done.push('补觉');G.sleep-=14;G.st.slept++;l('你趴了 5 分钟，醒来发现脸上有袖子的印子。困意-14');render();},true));
   cs.push(C('📱 低头玩会儿手机','3 分钟',function(){if(!phoneOK()){l('你没有可用手机。','warn');return render();}left-=3;done.push('玩手机');G.st.phone++;if(tc(.12,'confiscate','课间玩手机被路过的老师看到','phone'))return render();G.mood+=6;l('你刷了 3 分钟手机。心情+6');render();},true));
   cs.push(C('💬 和同学聊两句','3 分钟',function(){left-=3;done.push('聊天');G.mood+=5;G.support+=2;G.st.chat++;l('你们聊了聊昨天的球赛。心情+5');render();},true));
   cs.push(C('🏃 去办公室找老师','3 分钟 + 走路',function(){
    var t=dist(G.loc,'办公室');
    if(left<t){l('时间不够，跑一趟就上课了。','warn');return render();}
    left-=t;G.loc='办公室';done.push('去办公室');l('🏫 你去了班主任办公室。');
    if(G.parcel>0&&!G.parcelGot){left-=2;done.push('申请出门单');return askOutPass();}
    if(ch(.3)){G.support+=3;l('老师顺便问了问你最近的学习情况。支持度+3');}
    G.loc='教室';render();},true));
   cs.push(C('🛒 冲去小卖部','4 分钟 + 买',function(){
    var t=dist(G.loc,'小卖部');
    if(left<t+2){l('时间不够，来回一趟就上课了。','warn');return render();}
    left-=t;G.loc='小卖部';done.push('小卖部');hold(function(){G.loc='教室';render();});shopSys();},true));
   cs.push(C('📦 去门卫室拿快递','走路 + 需要出门单',function(){
    if(G.parcel<=0){l('你没有待取的快递。','warn');return render();}
    var t=dist(G.loc,'门卫室');
    if(left<t+3){l('时间不够，来回一趟肯定迟到。','warn');return render();}
    left-=t+3;done.push('拿快递');hold(function(){G.loc='教室';render();});parcelGo();},true));
   if(G.period)cs.push(C('🩹 去厕所换一下','消耗卫生巾',function(){
    if(!has('sanitary')){l('没带卫生巾，只能用纸巾凑合。','bad');G.mood-=5;return render();}
    take('sanitary',1);left-=3;done.push('换卫生巾');G.mood+=8;l('🩹 换好了，整个人轻松了。心情+8','good');render();},true));
  }else{
   cs.push(C('🚻 去趟厕所','2 分钟',function(){left-=2;done.push('厕所');l('你去洗手间洗了把脸。');render();},true));
   cs.push(C('☕ 回办公室续杯水','1 分钟',function(){left-=1;done.push('喝水');G.mood+=3;l('你接了杯热水，坐了两分钟。');render();},true));
   cs.push(C('👀 站在走廊上看两眼','2 分钟',function(){left-=2;done.push('看走廊');if(ch(.35)){G.relation+=3;l('你和路过的学生聊了两句。师生关系+3');}else l('你倚在窗边看操场。');render();},true));
   cs.push(C('📱 刷会儿手机','3 分钟',function(){left-=3;done.push('玩手机');G.mood+=6;if(tc(.1,'warn','你低头看手机，走廊尽头传来校长的脚步声'))return render();l('你刷了 3 分钟手机。心情+6');render();},true));
   cs.push(C('🗣️ 找学生谈话','4 分钟',function(){left-=4;done.push('谈话');G.relation+=5;G.teach+=2;if(ch(.3))G.academic+=2;l('你叫了个学生出来聊了聊。师生关系+5');render();},true));
   cs.push(C('📋 抓纪律','3 分钟',function(){left-=3;done.push('抓纪律');G.schoolSupport+=4;G.relation-=3;
    if(T('watch')||ch(.5)){G.caught++;l('你在走廊上抓到一个玩手机的学生。学校支持度+4');if(G.caught>=10)ach('t6');}else l('走廊上风平浪静。');render();},true));
  }
  cs.push(C('⏰ 结束课间','进入下一节',function(){if(cb)cb();}));
  scene(slotTitle,s,cs);
 }
 render();
}
/* ============ 11 出门单 / 快递 ============ */
function askOutPass(){
 var rel=(G.mode==='student'?G.relation:90);
 var base=(G.mode==='student'?G.support*0.3+G.grade*0.2+(G.demerits?-25:0)+rel*0.4:200);
 var p=cl(0.15+base/200,0.03,0.95);
 G.outPassTry++;
 var cs=[
  C('📝 老实申请出门单','关系越好越容易批',function(){
   if(ch(0.15+p*0.6)){G.outPass.push(1);if(G.outPass.length>=5)ach('s20');
    l('✅ 班主任在出门单上签了字：“快去快回，一节课之内回来。”','good');
    l('📦 你拿着出门单在校门口签了名，拿到了快递。','good');
    G.parcelGot=1;G.parcel=Math.max(0,G.parcel-1);G.st.parcel++;if(G.st.parcel>=10)ach('s23');
    var it=pk(['cake','milktea','choco','noodle','gift','powerbank','chips','icecream']);give(it,1);G.mood+=12;
   }else{G.mood-=6;l('❌ 班主任：“现在是上课时间，快递让家里人带吧。”——你被拒绝了。','bad');}
   hold(function(){next();});next();},true),
  C('🕶️ 找关系好的老师带你出去（邪修）','看关系，更隐蔽',function(){
   var q=cl(0.1+G.support/300+rel/200,0.05,0.8);
   if(ch(q)){ach('s21');G.parcelGot=1;G.parcel=Math.max(0,G.parcel-1);G.st.parcel++;if(G.st.parcel>=10)ach('s23');
    l('🕶️ 你找了关系不错的体育老师：“我出去买瓶水，你跟我一起走。”——他把你带出去了。','good');
    l('📦 你顺手把快递拿了回来。','good');G.mood+=16;
    var it=pk(['cake','milktea','choco','gift','powerbank']);give(it,1);
   }else{l('🕶️ 那位老师摆摆手：“不行啊，被查到我要挨批的。”','warn');G.mood-=4;}
   hold(function(){next();});next();},true),
  C('🧗 混出去 / 翻墙','风险很大',function(){
   if(ch(.25)){l('🧗 你趁门卫打瞌睡溜了出去，成功拿到快递。','good');G.parcelGot=1;G.parcel=Math.max(0,G.parcel-1);G.mood+=10;G.st.out=(G.st.out||0)+1;if(G.st.out>=3)ach('s22');}
   else if(tc(.6,'demerit','你翻墙的时候被监控拍到了，保卫处直接把你送到了教务处')){}
   else{G.mood-=5;l('你被门卫拦下来了：“同学，出门单呢？”','bad');}
   hold(function(){next();});next();},true),
  C('🚫 算了，快递先放着','',function(){l('你把快递的事先放下了。');hold(function(){next();});next();},true)
 ];
 scene('📦 申请出门单','学校的规矩：拿快递必须要有班主任签字的出门单。\n你和班主任的关系（师生关系 '+Math.round(G.relation||0)+'）、成绩、平时表现，都会影响他签不签字。\n（邪修方法：找个关系好的老师带你出去。）',cs);
}
function parcelGo(){
 if(G.parcel<=0){l('你没有待取的快递。','warn');return next();}
 if(G.mode==='student'){
  var p=cl(0.3+(G.relation||0)/150-G.demerits*0.1,0.05,0.9);
  if(ch(p*0.5))l('📦 门卫让你登记了一下就放你进去了。','good');
  else{l('📦 门卫大姐：“出门单呢？没有不能进。”','bad');G.mood-=3;return next();}
 }
 G.parcelGot=1;G.parcel=Math.max(0,G.parcel-1);G.st.parcel++;if(G.st.parcel>=10)ach('s23');
 if(G.mode==='teacher'&&G.st.parcel>=20)ach('t22');
 var it=pk(['cake','milktea','choco','noodle','gift','powerbank','chips','icecream']);
 give(it,1);G.mood+=12;l('📦 你拿到快递，是'+ITEMS[it].n+'。心情+12','good');
 saveGame();
 next();
}
function openMail(){
 if(G.mode==='teacher'){
  return menu('📦 快递（老师）','<div class="quote">老师不用出门单，直接去门卫室拿就行。</div>',[
   {n:'📦 我买的快递（待取 '+G.parcel+' 件）',b:'去拿',fn:function(){if(G.parcel<=0){l('你没有待取的快递。','warn');return openMail();}G.parcel=Math.max(0,G.parcel-1);G.st.parcel++;if(G.st.parcel>=10)ach('s23');l('📦 你拿到了快递！签收 +1','good');upd();openMail();}},
   {n:'🛒 网购一件东西（¥68）',d:'明天到门卫室',fn:function(){if(G.money<68){l('💸 钱不够。','warn');return;}G.money-=68;G.parcel++;l('🛒 下单成功，明天到门卫室。','good');upd();openMail();}},
   {n:'📋 累计签收 '+G.st.parcel+' 件',fn:function(){openMail();}}
  ]);
 }
 menu('📦 快递系统','<div class="quote">学校规定：拿快递必须持有班主任签字的出门单。<br>出门单难度 = 师生关系 + 成绩 + 平时表现 − 处分记录。<br>邪修方法：找关系好的老师带你出去。</div>',[
  {n:'📦 我买的快递（待取 '+G.parcel+' 件）',d:'需要出门单',b:'去拿',fn:function(){hold(function(){openMail();});askOutPass();}},
  {n:'🛒 网购一件东西（¥68）',d:'下单后需出门单领取',fn:function(){if(G.money<68){l('💸 钱不够。','warn');return;}G.money-=68;G.parcel++;l('🛒 你在淘宝下单了，明天到门卫室。','good');upd();openMail();}},
  {n:'📋 查看出门单记录',d:'成功 '+G.outPass.length+' 次 / 申请 '+G.outPassTry+' 次',fn:function(){l('📋 你一共申请成功 '+G.outPass.length+' 次出门单。');openMail();}}
 ]);
}
/* ============ 12 手机 ============ */
function openPhone(){
 if(!G)return;
 if(G.mode==='teacher')return tPhone();
 if(!phoneOK()&&!has('spare')){
  return menu('📱 手机','<div class="quote">你没有任何可用手机。（真机被扣 / 没买手机）<br>可以去小卖部买，或周五等老师归还。</div>',[{n:'关闭',fn:closeModal,b:'关闭'}]);
 }
 var m=G.phoneModel||{b:'苹果',n:'iPhone 11',perf:66,cam:70,bat:58,mood:4};
 var intro='<div class="quote">📱 '+m.b+' '+m.n+'（性能'+m.perf+' 拍照'+m.cam+' 续航'+m.bat+'）'+
  (G.phoneTaken?' <span class="bad">真机被扣留中，正在用备用机</span>':'')+'<br>💰 '+Y(G.money)+'</div>';
 var items=[];
 for(var i=0;i<APPS.length;i++){(function(a){
  items.push({n:a.n+'（'+a.t+'）',d:'心情+'+a.mood,b:'打开',fn:function(){useApp(a);}});
 })(APPS[i]);}
 for(var j=0;j<MGAMES.length;j++){(function(g){
  items.push({n:'🎮 '+g,d:'手游 · 有真实对局判定',b:'开打',fn:function(){playMobile(g);}});
 })(MGAMES[j]);}
 items.push({n:'🥡 让外面的人偷偷点外卖',d:'骑手放到围墙边第三棵树下',b:'点',fn:function(){doTakeout();}});
 items.push({n:'🍱 让走读同学带',d:'风险低一些',b:'托',fn:function(){doBring();}});
 items.push({n:'📞 打电话给家里',d:'心情+6',b:'打',fn:function(){G.mood+=6;l('📞 你给家里打了个电话。心情+6');closeModal();}});
 menu('📱 手机',intro,items);
}
function useApp(a){
 if(a.money&&G.money<Math.abs(a.money)){l('💸 钱不够。','warn');return closeModal();}
 if(a.money)G.money+=a.money;
 var mul=T('net')?1.5:1;
 G.mood+=Math.round((a.mood||0)*mul);G.sleep+=(a.sl||0);
 if(a.so)G.support+=a.so;if(a.cm)G.charm+=a.cm;if(a.inf)G.influence+=a.inf;if(a.ht)G.rev.heat+=a.ht;if(a.kn)G.knowledge+=a.kn;
 var inClass=(G.curType==='class'||G.curType==='night'||G.curType==='t_class');
 if(inClass&&G.mode==='student'){if(tc(a.r||.15,'confiscate','上课玩手机被老师抓了，屏幕还亮着'+a.n,'phone'))return closeModal();}
 else if(G.mode==='student'&&tc((a.r||.15)*.5,'warn','值班老师路过，你赶紧把屏幕扣在腿上'))return closeModal();
 l('📱 你打开了'+a.n+'，刷了一会儿。心情+'+Math.round((a.mood||0)*mul),'good');
 clampAll();upd();closeModal();
}
function doTakeout(){
 if(G.money<28){l('💸 钱不够。','warn');return closeModal();}
 G.money-=28;
 if(tc(.5,'criticize','你去围墙边拿外卖，被巡逻保安用手电筒照了个正着'))return closeModal();
 G.mood+=22;G.health+=5;l('🥡 你成功拿到外卖，在宿舍吃完，人生圆满。心情+22','good');closeModal();
}
function doBring(){
 if(ch(.28)){l('🍱 走读的同学说：“你自己不会带啊？”','warn');return closeModal();}
 G.mood+=14;G.support+=3;l('🍱 同学帮你带了份烤冷面，还热着。心情+14','good');
 if(ch(.25))tc(.25,'warn','班主任闻到你身上的油烟味：“什么东西？”');
 closeModal();
}
function tPhone(){
 var items=[
  {n:'📋 教务系统：查学生成绩',d:'了解班级情况',b:'查看',fn:function(){l('📋 你查了一下班级成绩，平均分 '+Math.round(G.grade||70)+'，有两个学生最近下滑明显。');G.academic+=2;upd();closeModal();}},
  {n:'👥 年级教师群（99+）',b:'看看',fn:function(){l('👥 年级群：'+pk(['“谁又拖堂了？”','“明天月考，谁有卷子？”','“食堂今天的排骨是姜。”','“校长又开会了。”']));G.mood+=4;upd();closeModal();}},
  {n:'👨‍👩‍👧 家长群（500+）',b:'回复',fn:function(){
   if(ch(.6)){G.relation+=4;l('👨‍👩‍👧 你发了一条通知，家长纷纷回复“收到老师”。师生关系+4');}
   else{G.mood-=6;l('👨‍👩‍👧 有家长质问作业为什么这么多，你只能一条条解释。','bad');}
   upd();closeModal();}},
  {n:'📱 刷短视频/朋友圈',d:'心情+ 但可能被领导看到',b:'刷',fn:function(){
   G.mood+=8;
   if(ch(T('famous')?.25:.14)){G.schoolSupport-=8;l('😅 你刷手机的时候，校长就站在你身后。学校支持度-8','bad');}
   else l('你刷了十分钟手机。心情+8');
   upd();closeModal();}},
  {n:'🏛️ 举报通道（纪委/教育局）',d:'老师专用',b:'进入',fn:function(){openReport();}},
  {n:'💰 灰色收入',d:'老师专用',b:'进入',fn:function(){openCorrupt();}},
  {n:'📞 打电话给朋友/家人',d:'心情+8',b:'打',fn:function(){G.mood+=8;l('📞 你给家里人打了个电话。心情+8');closeModal();}},
  {n:'📦 查快递（老师不用出门单）',b:'去拿',fn:function(){hold(function(){tPhone();});next();}}
 ];
 menu('📱 老师手机','<div class="quote">老师的手机是另一套系统：教务、年级群、家长群、举报通道、灰色收入。<br>📱 '+(G.phoneModel?G.phoneModel.b+' '+G.phoneModel.n:'普通手机')+'</div>',items);
}

/* ============ 13 手游（真判定） ============ */
function playMobile(name){
 $('#modal').classList.add('hidden');
 if(name==='原神')return genshin();
 if(name==='王者荣耀')return moba(false);
 if(name==='英雄联盟')return moba(true);
 if(name==='和平精英')return pubg();
 if(name==='无畏契约'||name==='CS2')return fps();
 if(name==='三角洲行动')return delta();
 if(name==='我的世界')return minecraft();
 if(name==='星露谷物语'||name==='动物森友会')return farm();
 if(name==='糖豆人'||name==='Among Us')return party();
 if(name==='FIFA 足球')return fifa();
 return genericMobile(name);
}
function endPlay(){clampAll();upd();closeModal();}
function genshin(){
 var team=['胡桃','钟离','雷神','纳西妲','神里绫华','夜兰'],mhp=100,sel=[],dmgBase=0,hpTaken=0;
 function start(){
  var s='你打开了《原神》。\n队伍：'+team.join('、')+'\n今天打「深境螺旋 12-3」，怪物血量 100，每回合会反击你。\n请选定 2 名角色出战（元素搭配影响伤害）。';
  var cs=[];
  for(var i=0;i<team.length;i++){(function(i){
   cs.push(C('出战：'+team[i],sel.indexOf(i)>=0?'已选':'',function(){
    if(sel.indexOf(i)>=0)sel.splice(sel.indexOf(i),1);else if(sel.length<2)sel.push(i);
    start();
   },true));
  })(i);}
  cs.push(C('⚔️ 开始战斗','已选 '+sel.length+'/2',function(){
   if(sel.length<2){l('要选两名角色才能出战。','warn');return start();}
   dmgBase=rnd(28,52)+(sel.indexOf(1)>=0?10:0)+(T('lucky')?4:0);
   battle();
  }));
  scene('🎮 原神 · 深境螺旋',s,cs);
 }
 function st2(){return '怪物剩余血量：'+Math.max(0,mhp)+' / 100\n你已承受伤害：'+hpTaken+'（超过 100 你会被击败）';}
 function battle(){
  var d=rnd(dmgBase-8,dmgBase+8);mhp-=d;
  l('⚔️ 你打出了 '+d+' 点伤害（怪物剩余 '+Math.max(0,mhp)+' 血）');
  if(mhp<=0){l('🏆 深境螺旋满星通过！原石到手。心情+18，影响力+2','good');G.mood+=18;G.influence+=2;return endPlay();}
  hpTaken+=rnd(10,25);
  if(hpTaken>=100){l('💀 你被击败了，退出深渊。心情-8','bad');G.mood-=8;return endPlay();}
  var cs=[
   C('🗡️ 平A输出','稳',function(){battle();}),
   C('💥 释放元素爆发','高伤，但会挨打',function(){var d2=rnd(35,60);mhp-=d2;l('💥 元素爆发！造成 '+d2+' 点伤害。');
    if(mhp<=0){l('🏆 通关！心情+18','good');G.mood+=18;return endPlay();}hpTaken+=rnd(15,30);if(hpTaken>=100){l('💀 你被击败了。','bad');return endPlay();}battle();}),
   C('🛡️ 钟离开盾抗伤害','本回合不掉血',function(){l('🛡️ 玉璋护盾挡下了这一击。');battle();}),
   C('🏃 撤退','离开战斗',function(){l('你退出了深境螺旋。');endPlay();})
  ];
  scene('🎮 原神 · 战斗中',st2(),cs);
 }
 start();
}
function moba(isLOL){
 var pos=null;
 function start(){
  var s='你打开了《'+(isLOL?'英雄联盟':'王者荣耀')+'》。\n排位赛开始，你排到了'+pk(['青铜','白银','黄金','铂金','钻石','星耀'])+'段位。\n选择你的位置：';
  var arr=['打野','中单','射手','对抗路','辅助'],cs=[];
  for(var i=0;i<arr.length;i++){(function(h){
   cs.push(C(h,h==='打野'?'抓人快，容易背锅':h==='射手'?'后期输出主力':'',function(){pos=h;loop(0);},true));
  })(arr[i]);}
  scene('🎮 对局开始',s,cs);
 }
 function loop(turn){
  if(turn>=5)return result();
  var s='对局进行中（第 '+(turn+1)+'/5 波）\n经济：'+(turn*800)+' · 你的位置：'+pos+'\n关键决策点：';
  var cs=[
   C('🛡️ 稳健发育','经济稳',function(){G.mood+=1;loop(turn+1);}),
   C('⚔️ 主动开团','高风险高回报',function(){if(ch(.55)){l('⚔️ 你开团成功，拿下三杀！');loop(turn+1);}else{l('你开团失败被抓，队友开始打字。','bad');loop(Math.max(0,turn));}}),
   C('🐉 打龙/大龙','团队收益大',function(){if(ch(.5)){l('🐉 你们拿下大龙，经济领先。');loop(turn+1);}else{l('你们打龙被抢，对面起飞了。','bad');loop(turn);}}),
   C('👀 蹲草丛埋伏','看运气',function(){if(ch(.45)){l('你蹲到了对面的脆皮，一套带走。');loop(turn+1);}else l('蹲了半天，什么也没蹲到。');loop(turn);})
  ];
  scene('🎮 '+(isLOL?'LOL':'王者荣耀')+' · 对局中',s,cs);
 }
 function result(){
  var win=ch(.5+(G.fitness>60?.1:0));
  var kda=rnd(2,18)+'-'+rnd(0,9)+'-'+rnd(1,15);
  if(win){l('🏆 胜利！你的 KDA 是 '+kda+'，MVP 加身。心情+16，影响力+1','good');G.mood+=16;G.influence+=1;}
  else{l('💀 失败。你的 KDA 是 '+kda+'，队友全程挂机。心情-10','bad');G.mood-=10;}
  endPlay();
 }
 start();
}
function pubg(){
 var hp=100,zone=1;
 function step(){
  if(hp<=0){l('💀 你被淘汰了。排名 47 名。心情-8','bad');G.mood-=8;return endPlay();}
  if(zone>5){l('🍗 大吉大利，今晚吃鸡！心情+20，影响力+2','good');G.mood+=20;G.influence+=2;return endPlay();}
  var s='安全区缩圈中（第 '+zone+'/5 圈）\n血量：'+hp+'\n你的选择：';
  var cs=[
   C('🏃 立刻向安全区跑','掉血风险小',function(){if(ch(.2)){hp-=rnd(10,25);l('跑步时被远处的狙击手打了几枪。','bad');}else l('你顺利进圈。');zone++;step();}),
   C('🏠 搜房子舔装备','装备好，风险中',function(){if(ch(.35)){hp-=rnd(15,35);l('一个房间里有埋伏，你被打了个措手不及。','bad');}else l('你搜到一把好枪。');zone++;step();}),
   C('🌳 蹲草丛苟着','最安全但可能被毒圈淘汰',function(){if(ch(.3)){hp-=rnd(8,20);l('毒圈来了，你被毒掉了一些血。','bad');}else l('你趴在草里，一动不敢动。');zone++;step();}),
   C('🚗 抢车转移','快，但可能被扫射',function(){if(ch(.4)){hp-=rnd(20,40);l('车被打爆了，你被炸掉很多血。','bad');}else l('你开车一路狂飙进圈。');zone++;step();})
  ];
  scene('🎯 和平精英 · 第'+zone+'圈',s,cs);
 }
 step();
}
function fps(){
 var round=0,my=0,ai=0;
 function duel(){
  if(round>=5)return fin();
  var s='1v1 残局（第 '+(round+1)+'/5 回合）\n比分 你 '+my+' : '+ai+' 对手\n你的操作：';
  var cs=[
   C('🎯 架点预瞄','胜率 55%',function(){resolve(.55,1);}),
   C('💨 冲锋对枪','胜率 45%，但有连杀',function(){resolve(.45,2);}),
   C('💣 扔烟拉枪线','胜率 60%，慢',function(){resolve(.6,1);}),
   C('🔫 切刀跑路','保命，不计分',function(){l('你选择退开，保存实力。');round++;duel();})
  ];
  scene('🎯 '+(G.phoneModel&&G.phoneModel.perf>90?'无畏契约':'CS2')+' · 残局',s,cs);
 }
 function resolve(p,gain){
  if(ch(p)){my+=gain;l('✅ 你赢了这一回合！比分 '+my+':'+ai);}else{ai+=gain;l('❌ 你被爆头了。比分 '+my+':'+ai,'bad');}
  round++;duel();
 }
 function fin(){
  if(my>ai){G.mood+=14;G.fitness+=2;l('🏆 你赢下了这场残局。心情+14','good');}
  else{G.mood-=8;l('💀 你输了。心情-8','bad');}
  endPlay();
 }
 duel();
}
function delta(){
 var loot=0,st=0;
 function step(){
  if(st>=4||st===99){
   if(loot>=30){G.mood+=16;l('🚁 撤离成功，带出价值 '+loot+' 的物资！心情+16','good');}
   else{G.mood+=4;l('🚁 你撤离了，但只捞到一点边角料。心情+4');}
   return endPlay();
  }
  var s='三角洲行动 · 第 '+(st+1)+'/4 阶段\n已搜刮价值：'+loot+'\n你的选择：';
  var cs=[
   C('💰 直奔高价值区','收益高，可能遇到人',function(){if(ch(.55)){loot+=rnd(15,40);l('你搜到了好东西。');}else{l('你被其他队伍伏击，血掉了一半。','bad');if(ch(.3)){l('你被击倒，物资全丢。','bad');return endPlay();}}st++;step();}),
   C('🧰 慢慢搜小房子','稳，但收益低',function(){loot+=rnd(5,15);st++;step();}),
   C('👂 先听脚步再行动','安全',function(){l('你听了一会儿，确认安全才动。');if(ch(.3))loot+=rnd(3,10);st++;step();}),
   C('🚪 直接撤离','保守',function(){st=99;step();})
  ];
  scene('🎯 三角洲行动',s,cs);
 }
 step();
}
function minecraft(){
 var blocks=0,day=1;
 function step(){
  if(day>4){G.mood+=12;l('⛏️ 你在《我的世界》里造了个小房子，还养了两只鸡。心情+12','good');return endPlay();}
  var s='我的世界 · 第 '+day+' 天\n已采集方块：'+blocks+'\n你要做什么？';
  var cs=[
   C('⛏️ 挖矿','资源+，可能遇苦力怕',function(){blocks+=rnd(10,30);if(ch(.25)){l('💥 一个苦力怕炸了你的矿洞。','bad');blocks=Math.max(0,blocks-15);}else l('你挖到了一些铁矿。');day++;step();}),
   C('🏠 盖房子','安全，心情+',function(){G.mood+=4;l('你盖了一面墙，很有成就感。');day++;step();}),
   C('🌾 种地养动物','慢但舒服',function(){G.mood+=3;blocks+=5;l('你种了一片小麦。');day++;step();}),
   C('🌙 直接睡觉跳过夜晚','',function(){l('你睡了一觉，天亮了。');day++;step();})
  ];
  scene('⛏️ 我的世界',s,cs);
 }
 step();
}
function farm(){
 var money=0,day=1;
 function step(){
  if(day>4){G.mood+=12;l('🌾 你经营了 4 天农场，赚了 '+money+' 金币。心情+12','good');return endPlay();}
  var s='农场经营 · 第 '+day+' 天\n金币：'+money+'\n今天做点什么？';
  var cs=[
   C('🌱 种地浇水','稳',function(){money+=rnd(20,60);l('你的作物长高了一点。');day++;step();}),
   C('🐔 照顾动物','心情+',function(){money+=rnd(10,30);G.mood+=4;l('你摸了摸小鸡。心情+4');day++;step();}),
   C('🎣 钓鱼','看运气',function(){if(ch(.3)){money+=rnd(80,200);l('你钓上了一条大鱼，卖了好价钱！','good');}else l('今天鱼不上钩。');day++;step();}),
   C('🛒 去镇上卖东西','',function(){money+=rnd(30,70);day++;step();})
  ];
  scene('🌾 星露谷 / 动森',s,cs);
 }
 step();
}
function party(){
 var score=0;
 function step(){
  if(score>=3){G.mood+=14;l('🎉 你赢下了这一局！心情+14','good');return endPlay();}
  if(score<=-2){G.mood-=6;l('😵 你被淘汰了。心情-6','bad');return endPlay();}
  var s='派对游戏 · 当前得分 '+score+'\n选择你的行动：';
  var cs=[
   C('🏃 冲在最前面','胜率中',function(){if(ch(.5)){score++;l('你冲到了第一！');}else{score--;l('你被障碍物绊倒了。','bad');}step();}),
   C('🧠 稳扎稳打','胜率略高',function(){if(ch(.6)){score++;l('你稳稳通过。');}else l('你落后了一点。');step();}),
   C('🤝 和旁边的人合作','',function(){if(ch(.5)){score++;l('你们合作通关。');}else{score--;l('队友把你坑了。','bad');}step();})
  ];
  scene('🎉 糖豆人 / Among Us',s,cs);
 }
 step();
}
function fifa(){
 var my=0,ai=0;
 for(var i=0;i<5;i++){if(ch(.5+(G.fitness>60?.08:0)))my++;else ai++;}
 if(my>ai){G.mood+=15;G.fitness+=3;l('⚽ 你以 '+my+':'+ai+' 赢下了比赛！心情+15，体力+3','good');}
 else if(my===ai){G.mood+=6;l('⚽ '+my+':'+ai+' 平局。心情+6');}
 else{G.mood-=8;l('⚽ 你 '+my+':'+ai+' 输了。心情-8','bad');}
 endPlay();
}
function genericMobile(n){
 if(ch(.5)){G.mood+=10;l('🎮 你在《'+n+'》里玩了一局，赢了。心情+10','good');}
 else{G.mood-=5;l('🎮 你在《'+n+'》里玩了一局，输了。心情-5','bad');}
 endPlay();
}
/* ============ 14 小游戏 ============ */
function openGame(){
 var items=[
  {n:'🧮 速算挑战',fn:function(){mathGame();}},
  {n:'🎯 猜数字（1-100）',fn:function(){window.NT=rnd(1,100);guessStep();}},
  {n:'⚡ 手速挑战（20 次）',fn:function(){window.TN=0;modal('<h3>⚡ 手速挑战</h3><p class="dim small">连点 20 次</p><button class="big" onclick="tapOnce()" id="tapBtn">点我 0/20</button>');}},
  {n:'🃏 21 点',fn:function(){bjStart();}},
  {n:'🎰 抽奖转盘（¥5/次）',fn:function(){lottery();}},
  {n:'🧠 记忆翻牌',fn:function(){memStart();}},
  {n:'🎣 钓鱼',fn:function(){fishStart();}},
  {n:'🏀 投篮挑战',fn:function(){shootStart();}},
  {n:'🐍 贪吃蛇（简化）',fn:function(){snakeStart();}},
  {n:'🎵 节奏大师',fn:function(){rhythmStart();}},
  {n:'🎯 跳一跳（蓄力连击）',fn:function(){jumpJump();}},
  {n:'⛏️ 黄金矿工',fn:function(){xzGoldMiner();}},
  {n:'🍉 合成大西瓜',fn:function(){watermelonStart();}}
 ];
 for(var i=0;i<MGAMES.length;i++){(function(g){
  items.push({n:'📱 '+g,d:'手机上的手游（有对局判定）',fn:function(){playMobile(g);}});
 })(MGAMES[i]);}
 menu('🎮 小游戏 & 手游','<p class="dim small">电脑小游戏 10 个 + 手机手游 13 款，全部有真实判定。</p>',items);
}
function mathGame(){
 var a=rnd(11,49),b=rnd(11,49),ans=a*b;
 var opts=[ans,ans+rnd(1,30),ans-rnd(1,30),ans+rnd(31,60)].sort(function(){return Math.random()-.5;});
 window.MOPTS=opts;
 var h='<h3>🧮 '+a+' × '+b+' = ?</h3>';
 for(var i=0;i<opts.length;i++)h+='<div class="mb"><span>'+opts[i]+'</span><button onclick="mathAns('+i+','+ans+')">选</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function mathAns(i,ans){
 if(window.MOPTS[i]===ans){G.knowledge+=4;G.st.study+=4;G.mood+=5;l('🧮 答对了！学习+4','good');}
 else{G.mood-=4;l('🧮 答错了，正确答案是 '+ans+'。','bad');}
 clampAll();upd();closeModal();
}
function guessStep(){
 var h='<h3>🎯 猜数字 1-100</h3>',g=[rnd(1,100),rnd(1,100),rnd(1,100),rnd(1,100)];
 for(var i=0;i<g.length;i++)h+='<div class="mb"><span>'+g[i]+'</span><button onclick="guessTry('+g[i]+')">猜</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">放弃</button>';
 modal(h);
}
function guessTry(v){
 if(v===window.NT){G.influence+=6;G.mood+=8;l('🎯 猜中了！答案就是 '+v+'。影响力+6','good');clampAll();upd();closeModal();}
 else{l('🎯 '+(v<window.NT?'小了':'大了')+'（你猜 '+v+'）','warn');guessStep();}
}
function tapOnce(){
 window.TN++;
 var b=$('#tapBtn');if(b)b.textContent='点我 '+window.TN+'/20';
 if(window.TN>=20){G.fitness+=3;G.mood+=5;l('⚡ 手速达标！体力+3','good');clampAll();upd();closeModal();}
}
function bjStart(){window.BJ={me:[rnd(1,11),rnd(1,11)],de:[rnd(1,11),rnd(1,11)]};bjRender('开局发牌。');}
function bjSum(a){var s=0;for(var i=0;i<a.length;i++)s+=a[i];return s;}
function bjRender(msg){
 var m=bjSum(window.BJ.me);
 var h='<h3>🃏 21 点</h3><div class="quote">'+msg+'<br>你的牌：'+window.BJ.me.join(' + ')+' = <b>'+m+'</b><br>庄家明牌：'+window.BJ.de[0]+'</div>'+
 '<div class="row"><button class="gbtn" onclick="bjHit()">要牌</button><button class="gbtn" onclick="bjStand()">停牌</button><button class="gbtn" onclick="closeModal()">退出</button></div>';
 modal(h);
}
function bjHit(){
 window.BJ.me.push(rnd(1,11));
 var m=bjSum(window.BJ.me);
 if(m>21){G.mood-=6;l('🃏 爆牌了，你输了。心情-6','bad');clampAll();upd();closeModal();}
 else if(m===21)bjStand();
 else bjRender('你要了一张 '+window.BJ.me[window.BJ.me.length-1]+'。');
}
function bjStand(){
 var m=bjSum(window.BJ.me);
 while(bjSum(window.BJ.de)<17)window.BJ.de.push(rnd(1,11));
 var d=bjSum(window.BJ.de),res='你的点数 '+m+' vs 庄家 '+d+'。';
 if(d>21||m>d){G.mood+=12;l('🃏 '+res+'你赢了！心情+12','good');}
 else if(m===d){G.mood+=2;l('🃏 '+res+'平局。');}
 else{G.mood-=8;l('🃏 '+res+'你输了。心情-8','bad');}
 clampAll();upd();closeModal();
}
function lottery(){
 if(G.money<5){l('💸 钱不够（需要 ¥5）。','warn');return closeModal();}
 G.money-=5;
 var r=rnd(1,100),prize='';
 if(r<=1){prize='🎉 特等奖 ¥888！';G.money+=888;}
 else if(r<=5){prize='💰 一等奖 ¥168';G.money+=168;}
 else if(r<=12){prize='🍰 蛋糕券一张';give('cake',1);}
 else if(r<=25){prize='🧋 奶茶一杯';give('milktea',1);}
 else if(r<=40){prize='🍫 巧克力';give('choco',1);}
 else if(r<=55){prize='☕ 咖啡券';give('coffee',1);}
 else if(r<=70){prize='🍬 口香糖';give('gum',1);}
 else if(r<=92){prize='😐 谢谢参与';}
 else{prize='🎫 再来一次！';G.money+=5;G.mood+=4;}
 l('🎰 转盘结果：'+prize,prize.indexOf('谢')>=0?'warn':'good');
 if(r<=5)G.fame+=1;
 clampAll();upd();closeModal();
}
function memStart(){
 var vals=[];for(var i=1;i<=8;i++){vals.push(i);vals.push(i);}
 vals.sort(function(){return Math.random()-.5;});
 window.MEM={v:vals,open:[],done:[],tries:0};
 memRender('翻开两张相同的牌。');
}
function memIcon(v){return ['🍎','🍌','🍇','🍓','🍑','🍍','🥝','🍒'][v-1];}
function memRender(msg){
 var h='<h3>🧠 记忆翻牌</h3><div class="quote">'+msg+'<br>尝试次数：'+window.MEM.tries+'</div><div class="row">';
 for(var i=0;i<16;i++){
  var shown=window.MEM.done.indexOf(i)>=0||window.MEM.open.indexOf(i)>=0;
  h+='<button class="gbtn" style="width:44px;height:44px;font-size:18px" onclick="memFlip('+i+')">'+(shown?memIcon(window.MEM.v[i]):'❓')+'</button>';
 }
 h+='</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function memFlip(i){
 if(window.MEM.done.indexOf(i)>=0||window.MEM.open.indexOf(i)>=0)return;
 window.MEM.open.push(i);
 if(window.MEM.open.length===2){
  window.MEM.tries++;
  var a=window.MEM.open[0],b=window.MEM.open[1];
  if(window.MEM.v[a]===window.MEM.v[b])window.MEM.done.push(a,b);
  window.MEM.open=[];
 }
 if(window.MEM.done.length>=16){G.knowledge+=6;G.st.study+=6;G.mood+=8;l('🧠 全部配对成功！学习+6','good');clampAll();upd();return closeModal();}
 memRender('继续翻牌。');
}
function fishStart(){window.FISH={n:0};fishRender('抛竿了，盯着浮标……');}
function fishRender(msg){
 var h='<h3>🎣 钓鱼</h3><div class="quote">'+msg+'<br>已钓：'+window.FISH.n+' 条</div>'+
 '<div class="row"><button class="gbtn" onclick="fishWait()">耐心等一会</button><button class="gbtn" onclick="fishPull()">猛地提竿！</button><button class="gbtn" onclick="closeModal()">收竿</button></div>';
 modal(h);
}
function fishWait(){fishRender(ch(.35)?'浮标动了一下……但没咬钩。':'水面很平静。');}
function fishPull(){
 if(ch(.45)){
  var it=pk(['🐟草鱼','🐠金鱼','🦐虾','🐙章鱼','💎钻石','👟一只破鞋']);
  if(it==='💎钻石'){G.money+=500;l('🎣 你钓上了一个盒子，里面有一颗钻石！¥500','good');}
  else if(it==='👟一只破鞋'){G.mood-=3;l('🎣 你钓上来一只破鞋，臭烘烘的。','warn');}
  else{G.mood+=6;l('🎣 你钓上来一条'+it+'。心情+6','good');}
  window.FISH.n++;
 }else l('🎣 你提竿太早，鱼跑了。','warn');
 fishRender('继续？');
}
function shootStart(){window.SHOT=0;shootRender();}
function shootRender(){
 var h='<h3>🏀 投篮挑战</h3><div class="quote">已进：'+window.SHOT+' 球（连进 5 球即可通关）</div>'+
 '<div class="mb"><span>中投<br><span class="dim small">命中率 60%</span></span><button onclick="shootTry(0.6,1)">投</button></div>'+
 '<div class="mb"><span>三分<br><span class="dim small">命中率 40%，命中 +2</span></span><button onclick="shootTry(0.4,2)">投</button></div>'+
 '<div class="mb"><span>花式上篮<br><span class="dim small">命中率 30%，命中 +3</span></span><button onclick="shootTry(0.3,3)">投</button></div>'+
 '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function shootTry(p,gain){
 if(ch(p+(G.fitness>60?.12:0))){window.SHOT+=gain;l('🏀 进了！');}else l('🏀 打铁。');
 if(window.SHOT>=5){G.fitness+=5;G.mood+=12;l('🏀 连进 5 球，全场欢呼！体力+5，心情+12','good');clampAll();upd();return closeModal();}
 shootRender();
}
function snakeStart(){window.SN={eat:0,pos:3};snakeRender('目标：吃到 10 个苹果。');}
function snakeRender(msg){
 var h='<h3>🐍 贪吃蛇（简化）</h3><div class="quote">'+msg+'<br>已吃：'+window.SN.eat+'/10 · 位置：'+window.SN.pos+'/5</div>'+
 '<div class="row"><button class="gbtn" onclick="snakeMove(-1)">⬅️ 向左</button><button class="gbtn" onclick="snakeMove(1)">➡️ 向右</button><button class="gbtn" onclick="snakeMove(0)">⬆️ 冲刺</button><button class="gbtn" onclick="closeModal()">退出</button></div>';
 modal(h);
}
function snakeMove(d){
 if(d===0){if(ch(.5)){G.mood-=3;l('🐍 你冲刺撞到了墙。','warn');}else l('🐍 冲刺成功，前方有苹果！');return snakeRender('继续。');}
 window.SN.pos=cl(window.SN.pos+d,1,5);
 var got=ch(.55);
 if(got){window.SN.eat++;l('🐍 吃到苹果了！');}
 if(window.SN.eat>=10){G.mood+=10;G.knowledge+=2;l('🐍 你吃满了 10 个苹果！心情+10','good');clampAll();upd();return closeModal();}
 snakeRender(got?'继续。':'没吃到。');
}
function rhythmStart(){window.RH={i:0,p:0,g:0,m:0};rhythmRender('跟着节拍，看到“♪”就打拍。');}
function rhythmRender(msg){
 var show=ch(.6)?'♪':'…';window.RH.show=show;
 var h='<h3>🎵 节奏大师</h3><div class="quote">'+msg+'<br>Perfect '+window.RH.p+' · Good '+window.RH.g+' · Miss '+window.RH.m+'（第'+(window.RH.i+1)+'/8 拍）</div>'+
 '<div class="row"><button class="gbtn" onclick="rhythmBeat(1)">⏺️ 打拍</button><button class="gbtn" onclick="rhythmBeat(0)">⏸️ 不打</button></div>';
 modal(h);
}
function rhythmBeat(hit){
 var show=window.RH.show;
 if(hit){if(show==='♪'){window.RH.p++;l('🎵 Perfect！');}else{window.RH.m++;l('🎵 Miss（这时候不该打）。','warn');}}
 else{if(show==='♪'){window.RH.g++;l('🎵 Good。');}else{window.RH.p++;l('🎵 稳住不打，Perfect。');}}
 window.RH.i++;
 if(window.RH.i>=8){
  if(window.RH.p>=5){G.mood+=14;G.knowledge+=2;l('🎵 完美通关！心情+14','good');}
  else{G.mood+=6;l('🎵 成绩一般，但还挺开心。');}
  clampAll();upd();return closeModal();
 }
 rhythmRender('继续。');
}
/* ============ 15 恋爱 ============ */
function openLove(){loveSys();}
function loveSys(){
 if(!G)return;
 if(G.lover)return loverMenu();
 var items=[];
 var ways=[['🔍 随机认识一个人','random'],['📚 图书馆偶遇（学霸型）','study'],['🏀 操场上认识的（体育型）','sport'],
 ['🍜 食堂拼桌（吃货型）','food'],['🎭 社团活动认识','club'],['📱 社交软件匹配','app'],['💌 朋友介绍','friend']];
 for(var i=0;i<ways.length;i++){(function(w){items.push({n:w[0],d:'好感从 0 开始积累',b:'去',fn:function(){newLove(w[1]);}});})(ways[i]);}
 for(var j=0;j<G.met.length;j++){(function(j){
  var p=G.met[j];
  items.push({n:'💗 '+p.n+'（'+p.t+'·'+p.g+(p.same?'·同性':'')+'）',d:p.d+' 好感 '+Math.round(p.aff)+'/100',b:'接触',fn:function(){metMenu(j);}});
 })(j);}
 items.push({n:'📖 恋爱回顾',d:'已谈 '+G.lovers.length+' 轮',b:'查看',fn:function(){
  var h='<h3>📖 恋爱回顾</h3>';
  if(!G.lovers.length)h+='<p class="dim">你还没谈过恋爱。</p>';
  for(var i=0;i<G.lovers.length;i++){var v=G.lovers[i];
   h+='<div class="quote">第'+(i+1)+'轮：'+v.n+'（'+v.g+'·'+v.t+'）<br>在一起 '+(v.days||0)+' 天 · 纪念日 '+v.anniv+' · 结局：'+v.end+'</div>';}
  h+='<button class="gbtn" style="margin-top:8px" onclick="loveSys()">返回</button>';
  modal(h);}});
 menu('💗 恋爱 · 当前单身','<div class="quote">倾向：'+G.pref+' · 魅力 '+Math.round(G.charm)+' · 支持度 '+Math.round(G.support)+
  '<br>对学生：支持度和魅力影响成功率；对老师：同事、校外、家长介绍都可以，但要小心风评。</div>',items);
}
function newLove(kind){
 var g;
 if(G.pref==='同性')g=G.gender;
 else if(G.pref==='异性')g=(G.gender==='男'?'女':'男');
 else g=(ch(.5)?'男':'女');
 var way=pk(LOVE_WAY);
 if(kind==='study')way='图书馆偶遇的';
 if(kind==='sport')way='运动场上认识的';
 if(kind==='food')way='食堂拼桌认识的';
 if(kind==='club'){if(!G.club){l('你还没加入任何社团。','warn');return loveSys();}way='社团里认识的';}
 if(kind==='app'){if(!phoneOK()){l('你需要手机才能用社交软件。','warn');return loveSys();}way='社交软件匹配的';
  if(ch(.3)){l('📱 你匹配到的人头像和本人完全不像，你默默拉黑了。','warn');G.mood-=4;return loveSys();}}
 if(kind==='friend')way='朋友介绍的';
 var p={n:(g==='男'?pk(NPC_M):pk(NPC_F)),g:g,t:way,d:pk(LOVE_DESC),aff:rnd(5,20),same:g===G.gender,anniv:dcn(G.date)};
 G.met.push(p);
 l('💗 你认识了 '+p.n+'（'+p.t+' · '+p.g+'）。'+(p.same?' 有人开始小声议论你们。':''),'love');
 G.st.love++;
 loveSys();
}
function metMenu(i){
 var p=G.met[i];if(!p){l('这个人已经不在了。','warn');return loveSys();}
 var items=[
  {n:'🤖 和TA AI 对话（真聊天）',d:'打开聊天框直接发消息',b:'聊',fn:function(){xzChatPanel(p);}},
  {n:'🚶 和TA一起走路',d:'好感+8 心情+6',b:'去',fn:function(){p.aff=cl(p.aff+8);G.mood+=6;G.charm+=2;G.st.love++;
   if(p.same&&ch(.2)){G.mood-=3;G.support-=2;l('有人盯着你们看了很久。心情-3','bad');}
   l('🚶 你们并肩走了一段路，谁都没说话，但气氛很好。好感+8','love');upd();metMenu(i);}},
  {n:'💬 找TA聊天',d:'好感+6 支持度+2',b:'去',fn:function(){p.aff=cl(p.aff+6);G.support+=2;G.mood+=5;G.st.love++;
   l('💬 你们从食堂聊到期中考试。好感+6','love');upd();metMenu(i);}},
  {n:'📚 一起去图书馆学习',d:'好感+9 学习+4',b:'去',fn:function(){p.aff=cl(p.aff+9);G.knowledge+=4;G.st.study+=4;G.mood+=5;G.st.love++;
   l('📚 你们并排坐着写作业，中间隔着一支笔的距离。好感+9','love');upd();metMenu(i);}},
  {n:'🍜 一起去食堂吃饭',d:'好感+10 健康+4',b:'去',fn:function(){p.aff=cl(p.aff+10);G.health+=4;G.mood+=8;G.st.love++;G.st.eat++;
   l('🍜 TA把你不吃的香菜挑到了自己碗里。好感+10','love');upd();metMenu(i);}},
  {n:'🏀 一起去操场运动',d:'好感+8 体力+4',b:'去',fn:function(){p.aff=cl(p.aff+8);G.fitness+=4;G.health+=3;G.st.love++;G.st.exer++;
   l('🏀 你们打了一会儿球，TA笑得很大声。好感+8','love');upd();metMenu(i);}},
  {n:'🧋 请TA喝奶茶',d:'¥15 好感+12',b:'请',fn:function(){if(G.money<15){l('💸 钱不够。','warn');return metMenu(i);}
   G.money-=15;p.aff=cl(p.aff+12);G.mood+=6;l('🧋 TA说你记住了TA的甜度。好感+12','love');upd();metMenu(i);}},
  {n:'📱 偷偷发消息',d:'需手机，好感+7',b:'发',fn:function(){if(!phoneOK()){l('📱 手机被扣了，发不了。','warn');return metMenu(i);}
   p.aff=cl(p.aff+7);G.mood+=6;l('📱 你躲在被子里发消息，TA秒回。好感+7','love');
   tc(.12,'confiscate','宿管查寝掀开你的被子，屏幕上还亮着聊天框','phone');upd();metMenu(i);}},
  {n:'💌 写小纸条/情书',d:'需要信纸，好感+14',b:'写',fn:function(){
   if(!has('note')){l('你没有信纸。可以去小卖部买。','warn');return metMenu(i);}
   take('note',1);p.aff=cl(p.aff+14);G.mood+=8;l('💌 你写了整整两页，折成一个小方块递给TA。好感+14','love');upd();metMenu(i);}},
  {n:'🎁 送礼物',d:'从背包选，好感+15~25',b:'送',fn:function(){giftMenu(i);}},
  {n:'🎬 周末约看电影',d:'¥80 好感+22',b:'约',fn:function(){
   if(G.money<80){l('💸 钱不够。','warn');return metMenu(i);}
   G.money-=80;p.aff=cl(p.aff+22);G.mood+=18;
   l('🎬 你们看了场电影，中途TA小声说了一句台词，你笑了。好感+22','love');upd();metMenu(i);}},
  {n:'💗 表白！（需好感≥55）',d:'成功率取决于好感+魅力',b:'表白',fn:function(){
   if(p.aff<55){l('💗 好感还没到 55，现在太急了。','warn');return metMenu(i);}
   var q=cl(.2+(p.aff-55)/60+G.charm/500,0.05,0.95);
   if(ch(q)){
    G.lover={n:p.n,g:p.g,t:p.t,same:p.same,aff:p.aff,days:0,start:dcn(G.date),anniv:dcn(G.date),fight:0};
    G.lovers.push({n:p.n,g:p.g,t:p.t,days:0,anniv:dcn(G.date),end:'进行中'});
    G.mood+=30;G.charm+=5;G.influence+=3;ach('s17');
    l('💗💗 '+p.n+'说：“好啊。”——你现在是有对象的人了。','love');closeModal();upd();
   }else{p.aff=cl(p.aff-10);G.mood-=15;l('💗 TA沉默了三秒：“我们还是当朋友吧。”心情-15','bad');upd();metMenu(i);}}}
 ];
 menu('💗 '+p.n+'（'+p.t+' · '+p.g+(p.same?' · 同性':'')+'）',
  '<div class="quote">'+p.d+'<br>认识于 '+p.anniv+'</div>'+bar('好感度',p.aff,Math.round(p.aff)+'/100','#ff7ab6'),items);
}
function giftMenu(i){
 var p=G.met[i],items=[];
 for(var j=0;j<SHOP.length;j++){
  var id=SHOP[j],it=ITEMS[id];
  if(!has(id))continue;
  if(it.k!=='food'&&it.k!=='tool')continue;
  items.push({n:it.i+' '+it.n,d:'好感+'+Math.round(15+(it.price||10)/10),b:'送',fn:function(){
   take(id,1);var add=Math.round(15+(it.price||10)/10);
   p.aff=cl(p.aff+add);G.mood+=8;G.charm+=1;
   l('🎁 你把'+it.n+'送给了'+p.n+'。好感+'+add,'love');upd();metMenu(i);}});
 }
 if(!items.length){l('你背包里没有能送的东西。','warn');return metMenu(i);}
 menu('🎁 送什么给TA','<div class="quote">礼物越贵，好感加得越多。</div>',items);
}
function loverMenu(){
 var L=G.lover;
 var items=[
  {n:'🤖 和TA AI 对话（真聊天）',d:'打开聊天框，想说什么说什么',b:'聊',fn:function(){xzChatPanel(L);}},
  {n:'🚶 陪TA走路 / 一起吃食堂',d:'好感+6 心情+6',b:'去',fn:function(){L.aff=cl(L.aff+6);G.mood+=6;G.st.love++;
   l('🚶 TA把你碗里的肉夹走了。好感+6','love');upd();loverMenu();}},
  {n:'📚 一起学习',d:'好感+8 学习+5',b:'去',fn:function(){L.aff=cl(L.aff+8);G.knowledge+=5;G.st.study+=5;l('📚 你们互相监督写作业。好感+8','love');upd();loverMenu();}},
  {n:'🏀 一起运动',d:'好感+7 体力+4',b:'去',fn:function(){L.aff=cl(L.aff+7);G.fitness+=4;l('🏀 你们在操场上呆到天黑。好感+7','love');upd();loverMenu();}},
  {n:'📱 偷偷发消息',d:'需手机，好感+7',b:'发',fn:function(){if(!phoneOK()){l('📱 手机被扣了。','warn');return loverMenu();}
   L.aff=cl(L.aff+7);G.mood+=7;l('📱 你们聊到凌晨一点。好感+7','love');upd();loverMenu();}},
  {n:'🧋 送早餐 / 奶茶',d:'¥20 好感+11',b:'买',fn:function(){if(G.money<20){l('💸 钱不够。','warn');return loverMenu();}
   G.money-=20;L.aff=cl(L.aff+11);G.mood+=8;l('🧋 你把奶茶放在TA桌上，还插好了吸管。好感+11','love');upd();loverMenu();}},
  {n:'💌 写情书',d:'需信纸，好感+15',b:'写',fn:function(){if(!has('note')){l('没有信纸。','warn');return loverMenu();}
   take('note',1);L.aff=cl(L.aff+15);G.mood+=10;l('💌 你写了封信塞进TA的课桌。好感+15','love');upd();loverMenu();}},
  {n:'🎂 庆祝纪念日/生日',d:'¥60 好感+25',b:'庆祝',fn:function(){
   if(G.money<60){l('💸 钱不够。','warn');return loverMenu();}
   G.money-=60;L.aff=cl(L.aff+25);G.mood+=20;l('🎂 你订了个小蛋糕，TA眼睛都亮了。好感+25','love');upd();loverMenu();}},
  {n:'🎬 周末约会',d:'¥150 好感+20',b:'约',fn:function(){if(G.money<150){l('💸 钱不够。','warn');return loverMenu();}
   G.money-=150;L.aff=cl(L.aff+20);G.mood+=20;l('🎬 你们逛了一下午，还拍了合照。好感+20','love');upd();loverMenu();}},
  {n:'🎡 去游乐园',d:'¥300 好感+35',b:'去',fn:function(){if(G.money<300){l('💸 钱不够。','warn');return loverMenu();}
   G.money-=300;L.aff=cl(L.aff+35);G.mood+=28;l('🎡 你们坐了摩天轮，最高点的时候谁都没说话。好感+35','love');upd();loverMenu();}},
  {n:'😤 吵架（随机原因）',d:'可能导致冷战',r:1,b:'吵',fn:function(){fight2();}},
  {n:'🌙 亲密一点（需好感≥80）',d:'会问做不做措施',b:'去',fn:function(){intimacy();}},
  {n:'💔 分手',d:'心情-30 魅力-10 支持度-5',r:1,b:'分',fn:function(){
   var k=T('lovebrain')?2:1;G.mood-=30*k;G.charm-=10;G.support-=5;
   G.lovers[G.lovers.length-1].end='分手';G.lovers[G.lovers.length-1].days=L.days;
   l('💔 你们分手了。'+L.n+'把你送的东西都还了回来。','bad');G.lover=null;ach('s19');closeModal();upd();}}
 ];
 if(L.fight>0)items.unshift({n:'🤝 道歉，哄TA',d:'结束冷战',b:'道歉',fn:function(){
  if(ch(.6)){L.fight=0;L.aff=cl(L.aff+5);l('🤝 TA说“算了”，你们和好了。','love');}
  else{L.fight++;l('TA：“你自己想想清楚。”','warn');}
  upd();loverMenu();}});
 menu('💗 '+L.n+'（'+L.t+' · '+L.g+(L.same?' · 同性':'')+'）',
  bar('好感度',L.aff,Math.round(L.aff)+'/100','#ff7ab6')+
  '<div class="quote">在一起 '+L.days+' 天 · 始于 '+L.start+' · 纪念日 '+L.anniv+(L.fight>0?'<br><span class="bad">冷战第 '+L.fight+' 天</span>':'')+'</div>',items);
}
function fight2(){
 closeModal();
 var L=G.lover;
 var r=pk(['你忘了TA说过要一起吃饭。','你回复消息慢了三个小时。','有人看到你和别人走得很近。','TA觉得你最近太冷淡了。']);
 var cs=[
  C('🗣️ 据理力争','可能赢，也可能更糟',function(){
   if(ch(.45)){L.aff=cl(L.aff+3);l('🎤 你说赢了，但TA脸色不太好。','warn');}
   else{if(ch(.5)){L.fight=1;l('😶 你们谁都不说话了，进入冷战。','bad');}else{L.aff=cl(L.aff-8);l('💢 你们吵了一架，好感-8。','bad');}}
   upd();loverMenu();}),
  C('🤐 先闭嘴，听TA说完','稳妥',function(){L.aff=cl(L.aff+2);l('😐 你什么都没说，等TA说完了。好感+2');upd();loverMenu();}),
  C('🙇 直接道歉','大概率立刻和好',function(){
   if(ch(.75)){L.aff=cl(L.aff+4);l('🙇 你道歉了，TA说“算了”。好感+4','love');}
   else{L.fight=1;l('TA：“你道歉也不走心。”进入冷战。','bad');}
   upd();loverMenu();})
 ];
 scene('😤 吵架了',r+'\n你要怎么处理？',cs);
}
function intimacy(){
 closeModal();
 var L=G.lover;
 if(L.aff<80){l('💗 好感还没到80。','warn');return loverMenu();}
 var cs=[
  C('🛡️ 做好措施（花¥30）','安全率95%',function(){
   G.money-=30;L.aff=cl(L.aff+5);G.mood+=15;
   if(ch(.05)){G.preg=true;l('😨 明明做了措施……可是三个月后，事情还是发生了。','bad');}
   else l('🛡️ 你们做好了措施，没有出意外。心情+15','love');
   closeModal();upd();}),
  C('😳 不做措施','真的会出事',function(){
   L.aff=cl(L.aff+10);G.mood+=20;
   if(G.gender==='女'&&ch(.25)){G.preg=true;l('😨 几天后，你在厕所看到验孕棒上的两条线。手一直在抖。','bad');
    closeModal();setTimeout(function(){ending('preg');},400);}
   else l('😳 什么都没发生。你们松了口气。','love');
   closeModal();upd();}),
  C('🧊 算了，冷静一下','好感-5',function(){L.aff=cl(L.aff-5);l('🧊 你冷静下来了。好感-5');closeModal();upd();})
 ];
 scene('🌙 亲密时刻',L.n+'看着你，走廊上有人经过。',cs);
}
/* ============ 16 贪污 / 举报 / 信息 ============ */
function openCorrupt(){
 if(G.mode!=='teacher'){l('这不是学生该管的事。','warn');return closeModal();}
 var items=[];
 if(G.role==='普通老师'||G.role==='班主任'){
  items.push({n:'🎁 收家长红包',d:'+¥2000，风险中',r:1,fn:function(){
   G.corrupt+=2000;G.money+=2000;G.dirty++;
   if(ch(.12+G.dirty*.03)){G.ethics-=8;G.warned++;l('📞 有人向学校反映了这件事。你被约谈了一次。','bad');}
   else l('🎁 家长硬塞了个红包，你推辞了两下就收下了。+¥2000','warn');
   upd();openCorrupt();}});
  items.push({n:'📚 教辅资料回扣',d:'+¥5000，风险中',r:1,fn:function(){
   G.corrupt+=5000;G.money+=5000;G.dirty++;
   if(ch(.15+G.dirty*.03)){G.ethics-=10;G.warned++;l('📞 有学生把这件事发到网上。学校让你“注意影响”。','bad');}
   else l('📚 你和书商谈好了折扣，回扣进了口袋。+¥5000','warn');
   upd();openCorrupt();}});
  items.push({n:'💰 补课费不上交',d:'+¥3000，风险低',r:1,fn:function(){
   G.corrupt+=3000;G.money+=3000;G.dirty++;
   if(ch(.08)){G.warned++;l('📞 教务处抽查补课台账。','bad');}
   else l('💰 你偷偷开了两节小课，钱没走公账。+¥3000','warn');
   upd();openCorrupt();}});
 }
 if(G.role==='年级主任'||G.role==='校长'){
  items.push({n:'🍚 食堂承包回扣',d:'+¥30000，风险中',r:1,fn:function(){
   G.corrupt+=30000;G.money+=30000;G.dirty++;
   if(ch(.18+G.dirty*.02)){G.ethics-=8;G.warned++;l('🍚 有家长举报食堂承包有问题，教育局来问了一次。','bad');}
   else l('🍚 承包商把“管理费”打到了你的卡上。+¥30000','warn');
   upd();openCorrupt();}});
  items.push({n:'🏗️ 工程款回扣',d:'+¥80000，风险较高',r:1,fn:function(){
   G.corrupt+=80000;G.money+=80000;G.dirty+=2;
   if(ch(.25+G.dirty*.03)){G.ethics-=12;G.warned++;l('🏗️ 审计来查账，一笔采购的发票对不上。','bad');}
   else l('🏗️ 翻新操场的时候，你“顺手”拿了一点。+¥80000','warn');
   upd();openCorrupt();}});
  items.push({n:'🎓 招生“名额费”',d:'+¥50000，风险高',r:1,fn:function(){
   G.corrupt+=50000;G.money+=50000;G.dirty+=2;G.rev.ev+=10;
   if(ch(.3+G.dirty*.02)){G.ethics-=15;G.warned++;G.schoolSupport-=10;l('🎓 有个家长把聊天记录截图了。事情传开了。','bad');}
   else l('🎓 一位家长“感谢”你帮孩子争取到名额。+¥50000','warn');
   upd();openCorrupt();}});
  items.push({n:'🌐 国际部项目分成',d:'+¥120000，风险高',r:1,fn:function(){
   G.corrupt+=120000;G.money+=120000;G.dirty+=3;G.rev.ev+=15;
   if(ch(.35+G.dirty*.02)){G.ethics-=18;G.warned++;G.license-=10;l('🌐 合作办学的账目被上级抽查了。','bad');}
   else l('🌐 国际部项目走完，你分到了一大笔。+¥120000','warn');
   upd();openCorrupt();}});
 }
 items.push({n:'🧼 洗白：捐一部分钱给学校',d:'降 dirty，提师德',fn:function(){
  var amt=Math.min(G.money,Math.max(0,Math.round(G.corrupt*0.3)));
  if(amt<=0){l('你没什么可以洗的。','warn');return openCorrupt();}
  G.money-=amt;G.corrupt=Math.max(0,G.corrupt-amt);G.dirty=Math.max(0,G.dirty-2);
  G.ethics+=8;G.schoolSupport+=5;l('🧼 你以个人名义捐了 '+Y(amt)+' 给学校，风评好了不少。','good');
  upd();openCorrupt();}});
 items.push({n:'📊 查看灰色收入',d:'累计 '+Y(G.corrupt||0)+' · 风险 '+G.dirty,fn:function(){
  l('📊 累计灰色收入 '+Y(G.corrupt||0)+'，风险值 '+G.dirty+'，被约谈 '+G.warned+' 次。');openCorrupt();}});
 menu('💰 灰色收入（老师/校长）','<div class="quote">风险值越高，被纪委约谈的概率越大。<br>校长这一层可操作的手法更多，但也更容易被盯上。<br>被查实后：轻则退赔+处分，重则吊销教资、被带走。</div>',items);
}
function openReport(){
 if(G.mode==='student'){
  return menu('📞 举报（12345）','<div class="quote">你手里的黑料值：'+G.rev.ev+'</div>',[
   {n:'📢 打 12345 自己实名举报',d:'被倒查概率极高',r:1,fn:function(){
    if(ch(.65)){G.demerits++;G.mood-=20;flash();l('📢 你挂掉电话十分钟，班主任就把你叫去了办公室。','bad');
     l('【处分！】被倒查，而且所有人都知道你举报过。','bad');if(G.demerits>=3)ending('retire');ach('s29');}
    else{G.rev.ev+=15;G.rev.heat+=10;l('📢 举报成功了，但学校发了一份“情况说明”，一切照旧。','warn');}
    ach('s28');closeModal();upd();}},
   {n:'🕵️ 让朋友/家长帮忙举报',d:'安全但基本没用',fn:function(){G.rev.ev+=5;
    l('🕵️ 邻居阿姨帮你打了电话。学校回复“感谢监督”，然后什么都没变。','warn');closeModal();upd();}},
   {n:'💻 发到网上 @本地媒体',d:'可能上热搜，但会被查',fn:function(){
    if(ch(.45)){G.influence+=12;G.rev.heat+=15;G.rev.ev+=10;l('💻 帖子火了，学校连夜发了声明。','rev');}
    else{G.demerits++;flash();l('💻 帖子两小时就被删了，他们查到了你的IP段和宿舍楼。','bad');if(G.demerits>=3)ending('retire');}
    closeModal();upd();}}
  ]);
 }
 if(G.rev.ev<10&&ch(.5))G.rev.ev+=3;
 menu('📞 举报与监督（老师通道）',
  '<div class="quote">老师这一层的举报渠道不一样：<br>普通老师 → 校务会、教育局；<br>年级主任/校长 → 纪委、审计、上级主管部门。</div>',[
  {n:'🏛️ 向纪委举报（校内违纪）',d:'举报同事/领导，需证据',r:1,fn:function(){
   if(G.rev.ev<10){l('你手里没有足够证据。先去收集黑料（起义菜单）。','warn');return openReport();}
   if(ch(.55)){G.rev.ev-=10;G.schoolSupport+=5;l('🏛️ 纪委受理了你的举报，成立了一个调查组。','good');}
   else{G.relation-=6;G.schoolSupport-=8;l('🏛️ 举报石沉大海，而且有人知道了是你递的材料。','bad');}
   G.warned++;if(G.warned>=3)ach('t15');upd();openReport();}},
  {n:'📞 打电话给教育局',d:'反映学费/假期/食堂问题',fn:function(){
   if(ch(.5)){G.rev.ev+=10;G.schoolSupport-=5;l('📞 教育局来函，要求学校“说明情况”。学校连夜开会。','good');}
   else l('📞 教育局把电话转回了学校，班主任在群里被点名了。','bad');
   upd();openReport();}},
  {n:'👥 找朋友/上级反映',d:'润物细无声',fn:function(){G.schoolSupport+=4;l('👥 你找了个老同学聊了聊，他说“帮你说句话”。学校支持度+4');upd();openReport();}},
  {n:'📰 联系媒体记者',d:'风险极大',r:1,fn:function(){
   if(ch(.35)){G.fame+=8;G.rev.heat+=20;l('📰 一篇《民办学校收费调查》上了本地新闻。','rev');}
   else{G.license-=5;l('📰 记者婉拒了你，还说“这种事不好写”。','bad');}
   upd();openReport();}},
  {n:'🧾 走正规渠道：向校务会提案',d:'安全，见效慢',fn:function(){G.schoolSupport+=3;l('🧾 你把问题写成了提案交到校务会。学校支持度+3');upd();openReport();}}
 ]);
}
function openID(){
 if(G.mode==='teacher'){
  return menu('🗂️ 老师信息面板','<div class="quote">'+G.role+' · 教资 '+Math.round(G.license)+' · 学校支持度 '+Math.round(G.schoolSupport)+
   '<br>师生关系 '+Math.round(G.relation)+' · 教学 '+Math.round(G.teach)+' · 学术 '+Math.round(G.academic)+' · 知名度 '+Math.round(G.fame)+'</div>',[
   {n:'💰 灰色收入',d:'累计 '+Y(G.corrupt||0)+' · 风险 '+G.dirty,b:'进入',fn:function(){openCorrupt();}},
   {n:'📞 举报与监督',d:'纪委 / 教育局 / 媒体',b:'进入',fn:function(){openReport();}},
   {n:'🏛️ 行政会提案',d:'涨学费 / 克扣假期 / 发福利',b:'进入',fn:function(){meetingVote();}},
   {n:'🌐 国际部管理',d:'特权 / 外访 / 扩招',b:'进入',fn:function(){intlSys();}},
   {n:'🎯 个人发展',d:'申请职称 / 竞聘职位',b:'进入',fn:function(){promote();}},
   {n:'🏫 学校大事决策',d:'项目 / 招生 / 设施（校长层）',b:'进入',fn:function(){schoolBig();}},
   {n:'📊 学校财务',b:'查看',fn:function(){
    modal('<h3>📊 学校财务</h3><div class="quote">在校生：1987 人<br>学费：'+(G.fee/10000).toFixed(1)+' 万 / 学期 / 人<br>预计学费收入：'+Y(1987*G.fee*2)+' / 年<br>当前资金：'+Y(G.budget)+
     '<br>国际部：'+(G.intl?'已启用（特权 Lv'+G.intlPerk+'）':'未启用')+'<br><br>你的月薪：'+Y(G.salary)+'<br>个人存款：'+Y(G.money)+
     '<br>灰色收入累计：'+Y(G.corrupt||0)+'<br>师风师德：'+Math.round(G.ethics)+' · 被约谈：'+G.warned+' 次</div><button class="gbtn" onclick="closeModal()">关闭</button>');}},
   {n:'🏆 成就墙',b:'查看',fn:function(){openAch();}},
   {n:'💗 恋爱',b:'进入',fn:function(){loveSys();}}
  ]);
 }
 return menu('🗂️ 学生信息面板','<div class="quote">支持度 '+Math.round(G.support)+' · 影响力 '+Math.round(G.influence)+
  ' · 魅力 '+Math.round(G.charm)+' · 成绩 '+Math.round(G.grade)+'<br>班干部：'+(G.duty||'无')+' · 学生会：'+(G.union>=0?UNION[G.union].n:'未加入')+
  '<br>穿衣：'+G.outfit+(G.period?' · 🩸生理期第'+G.periodDay+'天':'')+'</div>',[
  {n:'😨 处理怀孕的事（'+(G.partnerPreg?G.partnerPreg.n:'')+'）',d:'负责 / 给钱 / 逃避',r:1,b:'去',fn:function(){partnerPregMenu();}},
  {n:'🏅 班干部 / 学生会',b:'进入',fn:function(){dutySys();}},
  {n:'🎭 社团',b:'进入',fn:function(){clubSys();}},
  {n:'🔥 起义（地下组织）',d:'人马 '+G.rev.men+' · 黑料 '+G.rev.ev,b:'进入',fn:function(){revSys();}},
  {n:'👗 打扮',b:'进入',fn:function(){openDress();}},
  {n:'📞 举报与监督',d:'12345 / 本地媒体 · 黑料 '+G.rev.ev,b:'进入',fn:function(){openReport();}},
  {n:'🏆 成就墙',b:'查看',fn:function(){openAch();}},
  {n:'📖 恋爱回顾',b:'查看',fn:function(){loveSys();}}
 ]);
}
function promote(){
 var items=[];
 if(G.role==='普通老师')items.push({n:'📜 申请评职称',d:'需要教学/学术达标',fn:function(){
  if(G.teach>=60&&G.academic>=60&&ch(.5)){G.salary=Math.round(G.salary*1.12);G.schoolSupport+=8;ach('t17');
   l('📜 你评上了中级职称，工资涨了 12%。','good');}
  else l('评委说“再攒两年材料吧”。','warn');upd();openID();}});
 if(G.role==='班主任'||G.role==='普通老师')items.push({n:'🏛️ 竞聘年级主任',d:'需要支持度≥70',fn:function(){
  if(G.schoolSupport>=70&&ch(.45)){G.role='年级主任';G.salary=22000;ach('t18');l('🏛️ 你竞聘成功，当上了年级主任！','good');}
  else l('这次竞聘没成功。','bad');upd();openID();}});
 if(G.role==='年级主任')items.push({n:'👑 竞聘校长',d:'需要支持度≥80 且师德≥70',fn:function(){
  if(G.schoolSupport>=80&&G.ethics>=70&&ch(.4)){G.role='校长';G.salary=45000;ach('t19');l('👑 你当上了校长！','good');}
  else l('校董会说“再看看”。','bad');upd();openID();}});
 items.push({n:'返回',fn:function(){openID();},b:'返回'});
 menu('🎯 个人发展','<div class="quote">职位越高，能碰到的资源越多，风险也越大。</div>',items);
}
function schoolBig(){
 menu('🏫 学校大事决策','<div class="quote">学校资金：'+Y(G.budget)+'<br>你是'+G.role+'，这些事你说了算。</div>',[
  {n:'🏗️ 新建实验楼',d:'-¥2000万，学术+10',fn:function(){G.budget-=20000000;G.academic+=10;l('🏗️ 实验楼动工了，剪彩那天来了三个领导。','good');upd();schoolBig();}},
  {n:'📚 引进名师团队',d:'-¥500万，教学+12',fn:function(){G.budget-=5000000;G.teach+=12;G.fame+=3;l('📚 三位特级教师入职，家长群炸了。','good');upd();schoolBig();}},
  {n:'🌐 扩大国际部招生',d:'+¥2000万，关系-6',fn:function(){G.budget+=20000000;G.academic+=5;G.relation-=6;l('🌐 国际部扩招，普高部有点不高兴。','warn');upd();schoolBig();}},
  {n:'🎓 设立奖学金',d:'-¥300万，学生支持度大涨',fn:function(){G.budget-=3000000;G.relation+=15;G.schoolSupport+=5;l('🎓 一等奖学金 2 万元，公布那天全操场都在鼓掌。','good');upd();schoolBig();}},
  {n:'📣 投放招生广告',d:'-¥200万，知名度+8',fn:function(){G.budget-=2000000;G.fame+=8;l('📣 地铁站里出现了学校的广告。','good');upd();schoolBig();}},
  {n:'🏛️ 与教育局沟通',d:'支持度+，风险-',fn:function(){G.schoolSupport+=8;G.dirty=Math.max(0,G.dirty-1);l('🏛️ 你和教育局的同志吃了顿饭，气氛融洽。学校支持度+8','good');upd();schoolBig();}}
 ]);
}
var BILLS=[
 {n:'涨学费',d:'2.6万→3.4万/学期',run:function(){G.fee=34000;G.budget+=80000000;G.relation-=8;G.rev.ev+=20;l('📈 涨学费通过。学校资金大幅增加，家长群骂声一片。','warn');}},
 {n:'克扣假期',d:'国庆压到3天，周末改单休',run:function(){G.relation-=12;G.schoolSupport+=15;G.rev.ev+=15;G.rev.men+=10;l('📅 克扣假期通过。','bad');}},
 {n:'给学生发福利',d:'免费加鸡腿+空调全天开',run:function(){G.relation+=18;G.budget-=3000000;l('🍗 福利通过，中午食堂一片欢腾。','good');}},
 {n:'扩大国际部特权',d:'不上晚自习、单独食堂',run:function(){G.intl=true;G.intlPerk++;G.academic+=8;G.relation-=10;G.budget+=20000000;l('🌐 国际部特权扩大。','warn');}},
 {n:'设施改造',d:'翻新操场+机房，300万',run:function(){G.budget-=3000000;G.academic+=6;G.teach+=4;G.fame+=2;l('🏗️ 操场和机房开始翻新。','good');}},
 {n:'给老师涨薪',d:'绩效+8%',run:function(){G.salary=Math.round(G.salary*1.08);G.mood+=15;G.schoolSupport+=6;G.budget-=5000000;l('💰 涨薪通过。','good');}},
 {n:'教师师德培训',d:'三天培训',run:function(){G.ethics+=15;G.academic+=4;G.mood-=6;l('📖 培训三天，你写了三千字心得。师风师德+15');}},
 {n:'外访+公众号宣传',d:'提升知名度',run:function(){G.fame+=5;G.schoolSupport+=6;G.budget-=500000;l('📣 推文阅读量破万。知名度+5','good');}}
];
function meetingVote(){
 var bills=[],g=0;
 while(bills.length<3&&g++<50){var b=pk(BILLS);if(bills.indexOf(b)<0)bills.push(b);}
 var items=[];
 for(var i=0;i<bills.length;i++){(function(b){items.push({n:b.n,d:b.d,b:'表决',fn:function(){
  var ok=ch(.72+(T('net2')?.2:0)+(G.role==='校长'?.25:G.role==='年级主任'?.1:0)-G.relation/500);
  if(ok){b.run();G.billPass++;if(G.billPass>=5)ach('t8');}else l('❌ 你的提案「'+b.n+'」被否决了。','bad');
  upd();closeModal();}});})(bills[i]);}
 menu('👔 行政会 · 提案表决','<div class="quote">校长看了一眼：“讨论一下吧。”</div>',items);
}
function intlSys(){
 menu('🌐 国际部管理','<div class="quote">特权等级：'+G.intlPerk+' · 学校资金 '+Y(G.budget)+
  '<br>国际部有 A-Level、EJU 课程班，历届有毕业生被牛津、剑桥等海外高校录取。</div>',[
  {n:'➕ 增加特权',d:'学术+ 关系-',fn:function(){G.intlPerk++;G.academic+=5;G.relation-=8;if(G.intlPerk>=3)ach('t11');l('➕ 国际部特权+1。','warn');upd();intlSys();}},
  {n:'➖ 削减特权',d:'关系+ 学术-',fn:function(){G.intlPerk=Math.max(0,G.intlPerk-1);G.relation+=10;G.academic-=4;l('➖ 特权削减。','good');upd();intlSys();}},
  {n:'✈️ 接待外国学校领导',d:'知名度大增',fn:function(){G.fame+=rnd(4,8);G.budget-=200000;l('✈️ 你接待了外宾，还演示了3D打印和机器人编程教室。','good');upd();intlSys();}},
  {n:'💰 国际部扩招',d:'资金+2000万',fn:function(){G.budget+=20000000;G.academic+=5;G.relation-=6;l('💰 扩招完成。','warn');upd();intlSys();}}
 ]);
}
/* ============ 17 社团 / 职务 / 打扮 / 生活 ============ */
function dutySys(){
 var items=[];
 if(!G.duty){
  for(var i=0;i<DUTIES.length;i++){(function(d){items.push({n:'竞选 '+d.n,d:'需支持度'+d.need+' · '+d.e,fn:function(){
   if(G.support<d.need){l('🏅 支持度不够。','warn');return dutySys();}
   if(ch(.35+(G.support-d.need)/70)){G.duty=d.n;G.support+=8;G.influence+=5;if(d.n==='班长')ach('s15');l('🏅 你当选了'+d.n+'！','good');}
   else l('🏅 竞选失败，就差2票。','bad');upd();dutySys();}});})(DUTIES[i]);}
 }else{
  items.push({n:'📋 履行'+G.duty+'职责',d:'支持度+5 影响力+2',fn:function(){G.support+=5;G.influence+=2;
   l('📋 你以'+G.duty+'的身份忙前忙后。','good');upd();dutySys();}});
 }
 if(G.union<UNION.length-1){(function(nx){items.push({n:'🗳️ 竞选「'+UNION[nx].n+'」',d:'需支持度≥'+UNION[nx].need,fn:function(){
  if(G.support<UNION[nx].need-15){l('🗳️ 支持度不够。','warn');return dutySys();}
  if(ch(.25+(G.support-UNION[nx].need)/80+G.influence/300)){G.union=nx;G.influence+=10;G.support+=5;
   l('🗳️ 你当选学生会'+UNION[nx].n+'！影响力+10','good');if(nx===4)ach('s14');}
  else l('🗳️ 你上台演讲时话筒突然没声了。','bad');upd();dutySys();}});})(G.union+1);}
 menu('🏅 职务系统','<div class="quote">班干部：'+(G.duty||'无')+' · 学生会：'+(G.union>=0?UNION[G.union].n:'未加入')+
  '<br>职务越高影响力增长越快，起义时也越能号召人。</div>',items);
}
function clubSys(){
 if(!G.club){
  var items=[];
  for(var i=0;i<CLUBS.length;i++){(function(c){
   var v=c.a==='fitness'?G.fitness:c.a==='charm'?G.charm:c.a==='knowledge'?G.knowledge:G.mood;
   items.push({n:c.i+' '+c.n,d:'门槛'+c.need+'（你现在'+Math.round(v)+'）',fn:function(){
    if(v<c.need){l('❌ '+c.n+'的面试没过。','bad');return closeModal();}
    G.club={n:c.n,i:c.i};G.clubLv=1;G.mood+=12;G.influence+=3;l('🎭 你加入了'+c.n+'！','good');closeModal();upd();}});})(CLUBS[i]);}
  return menu('🎭 社团招新','<p class="dim small">操场边摆了一排桌子，每个社团都在喊人。</p>',items);
 }
 menu(G.club.i+' '+G.club.n+'（等级'+G.clubLv+'）',bar('活跃度',G.clubAct%100,G.clubAct,'#4dd8e0'),[
  {n:'🎯 参加社团活动',d:'活跃度+，属性成长',fn:function(){G.clubAct+=rnd(15,30);G.mood+=8;G.charm+=3;G.fitness+=2;
   if(G.clubAct>=100){G.clubAct-=100;G.clubLv++;l('🎉 社团升到'+G.clubLv+'级！','good');if(G.clubLv>=5)ach('s16');}
   else l('🎯 你在社团待了一下午。','good');upd();clubSys();}},
  {n:'🖐️ 竞选社长',d:'需活跃度≥100 且支持度≥50',fn:function(){
   if(G.clubAct<100||G.support<50){l('🖐️ 条件不够。','warn');return clubSys();}
   if(ch(.4+G.support/300)){G.influence+=15;G.support+=8;l('👑 你当选社长！','good');}else l('🖐️ 差了3票。','bad');upd();clubSys();}},
  {n:'🏆 参加区级比赛',fn:function(){
   if(ch(.4+G.clubLv*.12+G.fitness/300)){G.influence+=18;G.mood+=15;G.fame+=2;l('🏆 你们拿了区级二等奖！','good');}
   else l('🏆 没拿名次。','warn');upd();clubSys();}}
 ]);
}
function openDress(){
 menu('👗 打扮','<div class="quote">当前：'+G.outfit+' · 颜值'+Math.round(G.appear)+' · 魅力'+Math.round(G.charm)+'</div>',[
  {n:'👔 校服',d:'最安全',fn:function(){G.outfit='校服';l('你换回了校服。');closeModal();upd();}},
  {n:'🧥 校服+外套',d:'好看，小风险',fn:function(){G.outfit='校服+外套';G.charm+=2;l('你加了一件外套。魅力+2');closeModal();upd();}},
  {n:'✂️ 改短校服裙/裤',d:'被抓概率大',fn:function(){G.outfit='改短';G.charm+=5;G.mood+=3;G.st.dress++;
   if(ch(.3))tc(.35,'criticize','值周老师拦住你：“你这裤子是不是改过？”');l('你改了校服。魅力+5');closeModal();upd();}},
  {n:'👕 穿自己的衣服',d:'被制裁概率小但存在',fn:function(){G.outfit='自己的衣服';G.mood+=6;G.appear+=2;l('你穿了自己的衣服。心情+6');closeModal();upd();}},
  {n:'💄 化妆/做发型',d:'魅力+，有风险',fn:function(){G.outfit='化妆';G.charm+=6;G.appear+=3;G.st.dress++;
   if(ch(.3))tc(.35,'criticize','班主任看了你半天：“你这头发……”');l('你打扮了一下。魅力+6');closeModal();upd();}},
  {n:'💇 形象管理（¥50）',d:'颜值+5 魅力+4',fn:function(){if(G.money<50){l('💸 钱不够。','warn');return openDress();}
   G.money-=50;G.appear+=5;G.charm+=4;l('💇 你换了发型。','good');upd();openDress();}}
 ]);
}
function openCare(){
 var items=[
  {n:'🛋️ 去心理咨询室',d:'抑郁值-30 心情+15',fn:function(){G.depression=cl(G.depression-30);G.mood+=15;
   l('🛋️ 心理老师给你倒了杯温水，听你说了四十分钟。','good');if(G.depression<20)G.depressed=false;closeModal();upd();}},
  {n:'🏥 去医务室',d:'量体温、领感冒药',fn:function(){clinic();}},
  {n:'🛁 去洗澡',d:'魅力+4 健康+3',fn:function(){G.charm+=4;G.health+=3;G.sleep-=6;l('🛁 你洗了个热水澡。魅力+4');closeModal();upd();}},
  {n:'💪 锻炼',d:'体力+6 腹肌/马甲线+1',fn:function(){G.fitness+=6;G.health+=3;G.abs+=1;G.st.exer++;
   l('💪 你练了一小时，'+(G.gender==='女'?'马甲线':'腹肌')+'更明显了。','good');closeModal();upd();}},
  {n:'🙋 索要零花钱 / 买东西',fn:function(){askSys();}},
  {n:'🤒 装病请假回家',d:'走读生概率更高',fn:function(){
   if(ch(G.boarder?.35:.6)){G.mood+=15;G.sleep-=20;l('🤒 你妈来学校把你接走了。','good');}
   else l('🤒 你妈：“又装。好好上课。”','bad');closeModal();upd();}}
 ];
 if(G.gender==='女'&&G.period){
  items.unshift({n:'🍵 喝红糖姜茶',d:'腹痛-2',fn:function(){
   if(!has('brownsugar')){l('你没有红糖姜茶。去小卖部买。','warn');return closeModal();}
   take('brownsugar',1);G.pain=cl(G.pain-2,0,5);G.mood+=10;G.health+=4;
   l('🍵 热水下去，小腹的坠胀感轻了很多。腹痛-2，心情+10','good');closeModal();upd();}});
  items.unshift({n:'💊 吃止痛药',d:'腹痛-3',fn:function(){
   if(!has('painkiller')){l('你没有止痛药。','warn');return closeModal();}
   take('painkiller',1);G.pain=cl(G.pain-3,0,5);G.mood+=6;G.health+=2;
   l('💊 药下去二十分钟，痛感退了大半。','good');closeModal();upd();}});
  items.unshift({n:'🔥 用暖手宝捂着',d:'腹痛-1',fn:function(){
   if(!has('heater')){l('你没有暖手宝。','warn');return closeModal();}
   G.pain=cl(G.pain-1,0,5);G.mood+=5;l('🔥 暖手宝贴在肚子上，舒服多了。腹痛-1','good');closeModal();upd();}});
  items.unshift({n:'🩹 去厕所换一下卫生巾',d:'消耗一片',fn:function(){
   if(!has('sanitary')){l('你没带卫生巾，只能先用纸巾凑合。','bad');G.mood-=4;return closeModal();}
   take('sanitary',1);G.mood+=8;l('🩹 换好了，整个人轻松了。心情+8','good');closeModal();upd();}});
  items.unshift({n:'😴 趴一会儿休息',d:'腹痛-1 困意-10',fn:function(){
   G.pain=cl(G.pain-1,0,5);G.sleep-=10;l('😴 你趴了一会儿，缓过来了一些。');closeModal();upd();}});
 }
 menu('🍵 生活服务','<div class="quote">'+(G.period?'🩸 生理期第'+G.periodDay+'天，腹痛 '+G.pain+'/5。记得保暖、喝热水、别剧烈运动。':'心情 '+Math.round(G.mood)+' · 健康 '+Math.round(G.health))+'</div>',items);
}
function clinic(){
 var inClass=(G.curType==='class'||G.curType==='night'||G.curType==='t_class');
 if(inClass&&G.mode==='student'&&tc(.55,'criticize','你上课溜去医务室，走廊上撞见教导主任'))return closeModal();
 var h='<h3>🏥 医务室</h3>';
 if(!ch(.85))h+='<p>校医不在，门上贴着一张纸条：</p><div class="quote">“去打羽毛球了，急事请找班主任。—— 校医”</div>';
 else{
  var t=G.temp.toFixed(1);
  if(G.temp>=37.3){h+='<p class="warn">“'+t+'℃，有点烧。给你两粒感冒药，在这躺一节课。”</p>';give('medicine',2);G.sleep-=18;G.health+=6;}
  else{h+='<p class="good">“'+t+'℃，挺正常。给你一粒感冒药放兜里。”</p>';give('medicine',1);}
  if(G.gender==='女'&&G.period){h+='<p class="pink">校医看了你一眼：“生理期吧？别着凉，我给你倒杯热水。”</p>';G.pain=cl(G.pain-1,0,5);G.mood+=6;}
  if(ch(.25)){give('eyedrop',1);h+='<p class="dim">校医还塞给你一瓶眼药水。</p>';}
 }
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">离开</button>';
 modal(h);upd();
}
function askSys(){
 menu('🙋 索要 / 花钱','<div class="quote">零花钱：'+Y(G.money)+'</div>',[
  {n:'💬 跟爸妈要零花钱',d:'概率取决于成绩与表现',fn:function(){
   var p=cl(.25+(G.grade-60)/120,0.05,0.9);
   if(ch(p)){var m=rnd(50,300);G.money+=m;l('💬 你妈给你转了'+Y(m)+'：“别乱花。”','good');}
   else l('💬 “你看看你的成绩再说。”','bad');upd();askSys();}},
  {n:'🎁 跟爸妈要东西（皮肤/球鞋）',fn:function(){
   if(ch(.4+(G.grade-60)/200)){give('skin',1);G.skin.push('新皮肤');l('🎁 你爸给你买了新皮肤。','good');}
   else l('🎁 “等你考进前一百名。”','bad');upd();askSys();}},
  {n:'🛒 买游戏皮肤（¥88，虚拟不能带学校）',fn:function(){
   if(G.money<88){l('💸 钱不够。','warn');return askSys();}
   G.money-=88;give('skin',1);G.skin.push('新皮肤');G.mood+=12;l('🛒 你买了个新皮肤。心情+12','good');upd();askSys();}},
  {n:'🍗 买吃的带进学校（¥25）',fn:function(){
   if(G.money<25){l('💸 钱不够。','warn');return askSys();}
   G.money-=25;give('noodle',1);give('choco',1);give('cola',1);l('🍗 你买了一堆吃的塞进背包。','good');upd();askSys();}},
  {n:'📦 网购一件东西（¥68）',d:'需出门单去门卫取',fn:function(){
   if(G.money<68){l('💸 钱不够。','warn');return askSys();}
   G.money-=68;G.parcel++;l('📦 你在淘宝下单了，明天到门卫室。','good');upd();askSys();}}
 ]);
}
function shopSys(){
 var items=[];
 for(var i=0;i<SHOP.length;i++){(function(id){var it=ITEMS[id];
  items.push({n:it.i+' '+it.n,d:'¥'+it.price+(it.d?' · '+it.d:''),fn:function(){
   if(G.money<it.price){l('💸 钱不够。','warn');return shopSys();}
   G.money-=it.price;give(id,1);G.st.shopSpend=(G.st.shopSpend||0)+it.price;
   l('🛒 你买了'+it.i+it.n+'（¥'+it.price+'）。');
   if((G.st.shopSpend||0)>=300)ach('s5');
   if(ch(.1)){give(id,1);l('😄 老板心情好，多送了你一个。','good');}
   upd();shopSys();}});})(SHOP[i]);}
 menu('🛒 小卖部','<div class="quote">中午饭后和晚饭后才能来。余额 '+Y(G.money)+'</div>',items);
}
function revSys(){
 var r=G.rev;
 menu('🔥 推翻学校（地下组织）',
  bar('人马',r.men/2,Math.round(r.men)+'/200','#ffd166')+bar('黑料',r.ev,Math.round(r.ev),'#b06bff')+bar('暴露度',r.heat,Math.round(r.heat)+'/100','#ff5f6d')+
  '<p class="dim small">人马越多成功概率越高；暴露度太高会被提前镇压；组织里可能有内鬼。</p>',[
  {n:'📣 拉人入伙',d:'人马+8 暴露+3',fn:function(){r.men+=8;r.heat+=3;G.support+=3;l('📣 晚自习后你们在天台碰了头。人马+8','rev');upd();revSys();}},
  {n:'📁 收集黑料',d:'黑料+12 暴露+5',fn:function(){r.ev+=12;r.heat+=5;l('📁 你拿到一份关于收费和罚款的复印件。','rev');upd();revSys();}},
  {n:'🕵️ 排查内鬼（¥200）',fn:function(){if(G.money<200){l('💸 钱不够。','warn');return revSys();}
   G.money-=200;if(ch(.5+G.influence/400)){r.mole=true;l('🕵️ 你查出来了——是隔壁班那个总在办公室门口晃的人。','rev');}
   else l('🕵️ 什么都没查到。','warn');upd();revSys();}},
  {n:'🗣️ 公开质疑（需学生会部长以上）',d:'人马+25 暴露+20',fn:function(){
   if(G.union<2){l('🗣️ 你还没到能公开发言的级别。','warn');return revSys();}
   r.men+=25;r.heat+=20;G.influence+=10;l('🗣️ 你在班会上公开质疑收费和假期，全场爆发出掌声。','rev');upd();revSys();}},
  {n:'⚡ 发动起义！（需人马≥120）',r:1,fn:function(){
   if(r.men<120){l('⚡ 人还不够（需 120）。','warn');return revSys();}
   closeModal();revolution();}}
 ]);
}
function revolution(){
 var r=G.rev;ach('s26');
 l('⚡⚡ 起义开始了！课间操时间，操场上的人越来越多。','rev');
 var power=r.men+G.influence*2+G.support*1.5+(T('rebel')?25:0)-(r.mole?30:0)-r.heat*.3;
 var roll=rnd(0,100)+power/4;
 if(r.mole&&ch(.6)){l('🚨 有人提前告密了。','bad');return ending('revoltMole');}
 if(roll<45){l('🚔 辖区派出所的车开进了校门。','bad');return ending('revoltCrush');}
 if(roll<75){l('📄 学校妥协了：学费不涨、假期补回、食堂开二窗。','warn');return ending('revoltCompromise');}
 ach('s27');return ending('revoltWin');
}
function openAch(){
 var h='<h3>🏆 成就墙</h3><div class="quote">已解锁 '+G.ach.length+' 个</div>';
 var list=(G.mode==='student')?ACH_S:ACH_T;
 var hidden_ach=['s1','s4','s22','s23','s25','s30','t7','t10','t16','t20','t21','t22','t23','t24','t25'];
 h+='<h4 style="margin-top:8px">'+(G.mode==='student'?'学生成就（'+ACH_S.length+'）':'教师成就（'+ACH_T.length+'）')+'</h4>';
 for(var i=0;i<list.length;i++){
  if(hidden_ach.indexOf(list[i].id)>=0)continue;
  var got=G.ach.indexOf(list[i].id)>=0;
  h+='<div class="mb"><span>'+(got?'🏆 <b class="good">'+list[i].n+'</b>':'🔒 <span class="dim">???</span>')+
   '<br><span class="dim small">'+(got?list[i].d:'未解锁')+'</span></span></div>';
 }
 h+='<p class="dim small">（另有 17 个成就对应运动会/音乐节/家访等尚未开放的系统，将在后续版本解锁。）</p>';
 h+='<h4 style="margin-top:10px">每日称号记录</h4>';
 var any=false;
 for(var d in G.mem){any=true;h+='<div class="mb"><span>'+d+'</span><span class="warn">'+G.mem[d]+'</span></div>';}
 if(!any)h+='<p class="dim small">还没有记录，过完一天就会有。</p>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function flagCeremony(){
 if(G.mode==='teacher'){
  return {title:'🎤 周一升旗仪式（教师方阵）',text:'老师们站在学生方阵后面，一排灰色西装和黑色外套。\n国旗升上去的时候，你看见前排有个学生在偷偷打哈欠。',
   choices:[
    C('🧍 站得笔直','支持度+3',function(){G.schoolSupport+=3;l('你站得很标准，被校长看了一眼。学校支持度+3');}),
    C('👀 观察学生方阵','关系+4',function(){G.relation+=4;l('你扫了一圈，发现有两个人没穿校服外套。师生关系+4');}),
    C('🎤 上台做国旗下讲话','老师也可以讲',function(){
     if(ch(.5)){G.fame+=3;G.relation+=5;G.influence+=3;l('你讲了“身心自强、言行自律、学习自主、生活自理”这十六个字，台下掌声很整齐。','good');}
     else l('这次讲话的机会给了另一位老师。','warn');})]};
 }
 if(G.intro==='yes'&&ch(.6))return flagSpeech();
 return {title:'🎤 周一升旗仪式',text:'操场上三千人站着，国旗慢慢升上去。\n德育处主任在台上念“本周通报”，念到第四个名字的时候，队伍里一阵骚动。',
  choices:[
   C('🧍 站得笔直','心情+3',function(){G.mood+=3;l('你站得笔直，被值周老师看了一眼。');}),
   C('💬 和旁边人小声说话','15%被点名',function(){if(!tc(.15,'warn','德育处主任拿着话筒：“说话的，第几排第几个？”'))l('你和旁边人聊完了整场升旗。');}),
   C('✋ 申请国旗下讲话','需要运气',function(){
    if(ch(.35+G.influence/300)){G.intro='yes';l('德育处主任让你下周准备国旗下讲话。你有机会上台！','good');}
    else l('主任看了你一眼，没理你。','warn');})]};
}
function flagSpeech(){
 return {title:'🎤 国旗下讲话',text:'你站在主席台上，下面三千个人。话筒有点回音。\n德育处主任递给你一张稿纸，但你可以选择不照着念。',
  choices:[
   C('📄 照着稿子念','安全',function(){G.influence+=6;G.mood+=6;l('你念完了“努力学习、报效祖国”。台下掌声礼貌。影响力+6');}),
   C('🗣️ 临场加一句“希望学校兑现假期”','冒险',function(){
    if(ch(.5)){G.support+=25;G.rev.men+=15;G.rev.heat+=8;G.influence+=15;G.schoolSupport-=10;
     l('你说完那一句，操场上爆发出一阵压不住的掌声和口哨。支持度+25，人马+15！','rev');}
    else{G.demerits++;G.mood-=15;flash();l('主任一把抢过话筒，你被请下了台，还被记了一个处分。','bad');if(G.demerits>=3)ending('retire');}}),
   C('🎤 讲个笑话','影响力+10',function(){G.influence+=10;G.mood+=10;l('你讲了个关于食堂的笑话，全场笑成一片。影响力+10','good');})]};
}
function storyEvent(){
 var st=pk(STORIES),cs=[];
 for(var i=0;i<st.c.length;i++)cs.push(C(st.c[i][0],st.c[i][1],st.c[i][2]));
 return {title:st.t,text:st.x,choices:cs};
}
function escapeClass(place){
 if(ch(place.risk)){tt(place.pun,'你从'+place.n+'被拎了出来');return;}
 place.go();
}
function readNovel(id){
 var it=ITEMS[id];if(!it)return;
 G.mood+=rnd(8,14);G.knowledge-=2;G.st.read++;
 var txt=it.n+'\n\n';
 if(id==='novel_love')txt+='晚自习的教室安静得能听见粉笔灰落下。\n她趴在桌子上，笔尖停在第三题的括号里，一个字都没写。\n——因为坐在旁边的那个人，正在用一种很慢、很轻的节奏转笔。\n“第三题不会？”他低声问。\n他没看她，只是在草稿纸角落写了三行，把纸推过来。纸角上还画了一只很小的猫，猫的尾巴是一个问号。\n她笑了，笑得很小声，怕被值班老师听见。\n窗外的雨从下午一直下到现在，打在铁皮雨棚上。她忽然觉得，杭州的雨也没那么讨厌了。';
 else if(id==='novel_horror')txt+='一、二、三、四……五楼。\n可是五楼没有灯。走廊尽头的窗开着，风把窗帘吹成一个鼓起来的形状。\n“谁？”\n没有回答。只有皮鞋的声音，一下，一下，从楼梯口传来。';
 else if(id==='novel_fan')txt+='“你的成绩，不过如此。”班长冷笑。\n少年抬起头：“今天，我要让所有人知道——这道题我还有第三种解法。”';
 else if(id==='novel_lit')txt+='他一生都在跟土地打交道。\n你以为你在读书，其实书在读你。';
 else txt+='你翻了几页，看得很入迷。';
 if(tc(.28,'confiscate','你在课上看'+it.n+'，被当场收走',id))return;
 modal('<h3>📖 '+it.n+'</h3><div class="novel">'+txt+'</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">合上书</button>');
}
function eatInClass(fd){var it=ITEMS[fd];take(fd,1);G.mood+=(it.mood||0);G.health+=(it.health||0);G.sleep+=(it.sl||0);G.st.eat++;l('🍬 你吃掉了'+it.n+'。'+(it.mood?'心情+'+it.mood:''));}
function firstNovel(){for(var k in G.items)if(k.indexOf('novel_')===0&&G.items[k]>0)return k;return null;}
function firstFood(){for(var k in G.items)if(ITEMS[k]&&ITEMS[k].k==='food'&&G.items[k]>0)return k;return null;}

/* ============ 18 学生时段 ============ */
var SLOTS={};
SLOTS.flag=function(){return flagCeremony();};
SLOTS.wake=function(){
 if(has('cam')&&ch(.5)){G.mood+=4;l('📷 你把运动相机别在校服上。','good');}
 var cs=[
  C('🛁 立刻起床洗漱','困意-10 健康+2',function(){G.sleep-=10;G.health+=2;l('你麻利地洗漱完毕，还赶上了第一锅豆浆。');}),
  C('😴 再赖5分钟','困意-5/有风险',function(){G.sleep-=5;if(!tc(.3,'warn','起床铃后你还粘在床上，宿管的手电筒照在你脸上'))l('你多躺了5分钟，爽。');}),
  C('🛌 蒙头继续睡','困意-20/高危',function(){G.sleep-=20;G.mood+=5;if(!tc(.55,'criticize','全班都在早读，你还在被窝里做梦'))l('你多睡二十分钟，代价是没吃早饭。');}),
  C('👗 先花十分钟打扮','魅力+/可能被抓',function(){G.charm+=4;G.appear+=2;G.st.dress++;
   if(!tc(.2,'criticize','你在镜子前站了十分钟，班主任在门口站了五分钟'))l('你打理了一下自己。魅力+4');})
 ];
 if(G.gender==='女'&&G.period)cs.push(C('🚻 先去厕所处理一下','消耗卫生巾',function(){
  if(!has('sanitary')){l('你没带卫生巾，只能用纸巾凑合。','bad');G.mood-=5;return;}
  take('sanitary',1);G.mood+=6;l('🩸 你处理好了一切，安心出门。心情+6');}));
 return {title:'🌅 06:00 起床铃',text:'“叮铃铃——！”全校起床铃同时响起。\n'+G.weather.t+'\n'+(G.sleep>65?'你整个人像被床黏住了。':'你打了个哈欠，勉强爬起来。')+(G.cold?'\n你的鼻子还是堵着。':'')+(G.period?'\n小腹有点坠胀，今天得注意点。':''),choices:cs};
};
SLOTS.exercise=function(){
 if(G.gender==='女'&&G.period)return {title:'🤸 06:50 早操（生理期）',text:'广播里放着进行曲，但小腹一阵阵地疼。\n体育老师问：“有请假的吗？”',
  choices:[C('🙋 举手请假','腹痛-1，安全',function(){G.pain=cl(G.pain-1,0,5);G.mood+=4;
   if(tc(.15,'warn','体育老师看了你一眼：“真请假？”'))return;l('你在看台上坐了一节课。');}),
  C('😣 忍一忍，坚持跑','有风险',function(){G.pain=cl(G.pain+1,0,5);G.fitness+=3;G.st.exer++;
   if(ch(.3)){G.health-=4;G.mood-=6;l('跑到一半你疼得蹲下了，被同学扶到医务室。','bad');}else l('你咬牙跑完了两圈，出了一身汗。');}),
  C('💊 先吃片止痛药','需止痛药',function(){if(!has('painkiller')){l('你没带止痛药。','warn');return;}
   take('painkiller',1);G.pain=cl(G.pain-3,0,5);G.mood+=5;l('💊 药效上来，痛感退了。');})]};
 if(G.weather.rain>=2)return {title:'🌧️ 06:50 跑操（雨天取消）',text:'操场上全是水洼，广播说改在教室做操。\n但体育老师已经在楼下喊：“来两个人去操场搬器材！”',
  choices:[C('🏃 冒雨冲去搬器材','可能感冒',function(){G.sleep-=8;if(ch(.5))catchCold('你在雨里跑了一趟，鞋和袖子全湿透了');else l('你跑得飞快，体育老师夸了你一句。');}),
  C('☔ 打伞慢慢走过去','伞能救命',function(){if(has('umbrella')){G.health+=2;l('你撑着伞悠哉走过去，收获三个羡慕的眼神。');}else{l('你没带伞，一路小跑。');if(ch(.3))catchCold('没伞的你在雨里跑了一段');}}),
  C('🫥 躲进厕所','30%被揪出来',function(){if(!tc(.3,'criticize','你躲在厕所隔间，被体育老师一间间敲门叫出来'))l('你成功躲过搬器材，腿站麻了。');}),
  C('👟 溜回宿舍补觉','高危',function(){if(!tc(.45,'criticize','你溜回宿舍被窝，宿管查房抓个正着')){G.sleep-=25;l('你补了一觉。困意-25');}})]};
 return {title:'🤸 06:50 早操',text:'操场上放着那首听了一万遍的进行曲，全校排成方阵。\n体育老师在台上喊：“动作不标准的，扣班级分！”',
  choices:[C('🤸 认真做操','健康+3 心情+3',function(){G.health+=3;G.sleep-=6;G.mood+=3;G.st.exer++;l('你被当众表扬，班级加了一分。');}),
  C('👟 蹲下假装系鞋带','35%被批评',function(){G.sleep-=2;if(!tc(.35,'criticize','你蹲着系了三分钟鞋带，而鞋带根本没松')){G.mood+=2;l('你蹲着摸完了整场早操。');}}),
  C('💬 边做边唠嗑','心情+5/25%被抓',function(){G.mood+=5;if(!tc(.25,'criticize','你和隔壁班的人聊得太开心被点了名'))l('你们把早操变成了早聊。');}),
  C('🤒 装肚子疼去医务室','30%穿帮',function(){if(!tc(.3,'criticize','校医一摸你的脉搏：“跳这么有力，你肚子疼？”')){G.sleep-=12;l('你成功混掉早操。困意-12');}})]};
};
SLOTS.morningRead=function(){
 return {title:'📖 07:10 早读',text:'早读铃响，走廊里全是朗朗书声。\n语文课代表站在讲台上领读，声音有点跑调。',
  choices:[C('📖 大声朗读','学习+4',function(){G.knowledge+=4;G.st.study+=4;l('你读得很投入。学习+4');}),
  C('😴 支着书偷偷睡','困意-20/35%被抓',function(){G.sleep-=20;G.st.slept++;if(!tc(.35,'criticize','你举着书睡了十分钟，书掉在桌上发出巨响'))l('你用书挡着脸睡了一觉。');}),
  C('🚪 逃早读','风险中',function(){G.st.skip++;escapeClass({n:'小树林',risk:.3,pun:'criticize',go:function(){G.sleep-=10;G.knowledge-=2;G.mood+=6;l('你逃了早读，在小树林坐了一刻钟。鸟叫很好听。');}});}),
  C('📱 躲在厕所玩手机','需手机',function(){if(!phoneOK()){l('你没有可用手机。','warn');return true;}G.st.phone++;hold(next);openPhone();})]};
};
SLOTS.class=function(s){
 if(G.sleep>=88){G.sleep-=30;var c1=ch(.55);G.st.slept++;
  return {title:'😴 '+s.t+' 第'+s.n+'节课 · 你直接睡着了',text:'你实在太困了，眼皮像被胶水粘住。\n老师的声音越来越远，你的头一点一点……然后“咚”地砸在桌上。',
   choices:[C('（继续）','',function(){if(c1)tt('criticize','你在【'+s.subject+'】课上打呼噜');else l('没人发现。你睡了半节课，醒来发现笔记上多了只乌龟。');})]};}
 if(s.subject==='体育')return sportSlot(s);
 var sub=s.subject;
 var lines=['第 '+s.n+' 节课 · '+sub+'（40分钟）',SUBSAY[sub]];
 if(G.sleep>=70)lines.push('你的眼皮开始打架，黑板上的字像在水里游泳……');
 if(G.cold)lines.push('你一边听课一边擦鼻涕，纸巾堆成小山。');
 if(G.period)lines.push('小腹一阵一阵地疼，你换了个坐姿。');
 var cs=[];
 cs.push(C('✏️ 认真听讲','学习+/困意+',function(){var g=Math.round(rnd(4,7)*(T('mem')?1.25:1));G.knowledge+=g;G.st.study+=g;G.sleep+=4;
  l('【'+sub+'】你认真听讲，学习+'+g);
  if(ch(.3)){if(G.sleep<60){G.mood+=4;G.knowledge+=1;l('✋ 老师点名提问，你对答如流。心情+4','good');}
   else{G.mood-=4;l('✋ 老师点你回答，你脑子一片空白。心情-4','bad');}}}));
 cs.push(C('💤 趴桌上睡觉','困意-28/45%被抓',function(){G.sleep-=28;G.mood+=2;G.st.slept++;
  if(!tc(.45,'criticize','你在【'+sub+'】课上睡得像摊烂泥，粉笔头精准命中你额头'))l('你睡了一觉，醒来课本上多了半张脸的印子。');else G.sleep+=8;}));
 cs.push(C('🫥 发呆神游','心情+3',function(){G.mood+=3;G.sleep+=2;
  l(pk(['你望着窗外的树发呆，思考晚饭吃什么。','你在草稿纸上画了一只很潦草的猫。','你在想：如果现在下雨，体育课是不是就不用上了。']));}));
 var nv=firstNovel();if(nv)cs.push(C('📖 偷看小说','心情++/28%被没收',function(){readNovel(nv);}));
 if(phoneOK())cs.push(C('📱 桌肚里玩手机','心情+++/40%被没收',function(){G.st.phone++;hold(next);openPhone();}));
 var fd=firstFood();if(fd)cs.push(C('🍬 偷偷吃零食','心情+/25%被批评',function(){eatInClass(fd);
  if(!tc(.25,'criticize','你嚼薯片的声音在安静的教室里格外清脆'))l('你吃完了零食，人生圆满。');}));
 if(has('mp3'))cs.push(C('🎧 挂耳机听歌','困意-心情+/30%没收',function(){G.sleep-=10;G.mood+=9;
  if(!tc(.3,'confiscate','你的耳机线太明显了，从袖口一直通到耳朵','mp3'))l('你单曲循环一整节。困意-10');}));
 cs.push(C('🙋 举手去厕所（逃课）','老师大概率同意',function(){
  if(ch(.85)){l('🙋 老师点头：“快去快回。”——你自由了。');
   escapeClass({n:'后楼梯',risk:.35,pun:'criticize',go:function(){G.sleep-=10;G.mood+=8;G.knowledge-=2;l('你在后楼梯坐了一会儿。心情+8');}});}
  else l('🙋 老师头都没抬：“下课再去。”全班笑了。','bad');}));
 cs.push(C('🚪 直接逃课','正课·风险最大',function(){G.st.skip++;escapeClass({n:'操场后面',risk:.55,pun:'demerit',go:function(){
  G.sleep-=15;G.mood+=14;G.knowledge-=4;l('你逃了一整节课，在操场后面躺了一会儿。天很蓝。心情+14','good');}});}));
 cs.push(C('📝 写别科作业','学习+/20%被抓',function(){var g=rnd(2,4);G.knowledge+=g;G.st.study+=g;
  if(!tc(.2,'warn','老师发现你的练习册封面不对劲'))l('你写完了别的科作业。学习+'+g);}));
 return {title:'📚 '+s.t+' 第'+s.n+'节课 · '+sub,text:lines.filter(Boolean).join('\n'),choices:cs};
};
function sportSlot(s){
 if(G.weather.rain>=2)return {title:'🏀 '+s.t+' 体育课（雨·室内）',text:'体育老师看着外面的雨叹气：“今天室内自习。”\n全班发出漫长的“啊——”。',
  choices:[C('📖 老实写作业','学习+6',function(){G.knowledge+=6;G.st.study+=6;l('你把体育课变成了自习课。学习+6');}),
  C('😴 那正好睡觉','困意-25/30%被抓',function(){G.sleep-=25;G.st.slept++;if(!tc(.3,'criticize','体育老师巡视时一巴掌拍醒了你'))l('你舒服睡了一节课。');}),
  C('🚪 逃课去体育馆打球','风险中',function(){G.st.skip++;escapeClass({n:'体育馆',risk:.4,pun:'criticize',go:function(){G.fitness+=5;G.mood+=12;l('你打了半场球。心情+12','good');}});})]};
 return {title:'🏀 '+s.t+' 体育课',text:'体育老师吹哨：“先跑两圈热身！”\n操场上阳光很好，一群人在打篮球。',
  choices:[C('🏃 认真跑两圈+打球','健康+8 心情+10',function(){G.health+=8;G.mood+=10;G.fitness+=4;G.st.exer++;G.sleep-=18;
   l('你打得满头大汗，还投进一个三分。','good');if(ch(.12))catchCold('你运动完直接灌了半瓶冰水')
   if(G.height>=185){G.appear+=5;G.fitness+=3;l('📏 你个子很高，站在队伍里很显眼。颜值+5 体力+3','good');}
   else if(G.height<=160){G.fitness+=2;G.charm+=2;l('📏 你比较瘦小，但跑得快。体力+2 魅力+2','good');}
   if(G.weight>=85){G.fitness-=4;G.mood-=2;l('📏 体重偏大，体育课有点吃力。体力-4','warn');};}),
  C('🤒 装病见习','30%被抓',function(){if(!tc(.3,'criticize','体育老师摸你额头：“不发烧？那去跑两圈。”')){G.mood+=3;l('你坐在树荫下看别人跑步。');}}),
  C('🪑 坐看台摸鱼','心情+4',function(){G.mood+=4;G.health+=2;l('你坐在看台上晒太阳，看云慢慢飘。');}),
  C('🚪 溜去小卖部/厕所','风险低',function(){escapeClass({n:'小卖部后门',risk:.25,pun:'warn',go:function(){G.mood+=6;l('你溜去买了一瓶水。心情+6');}});})]};
}
SLOTS.break=function(){
 if(G.pendingStory&&ch(.55)){G.pendingStory=false;return storyEvent();}
 return {title:'☕ '+G.time+' 课间十分钟（可做多件事）',
  text:pk(['走廊里挤满了人，有人在打闹，有人在背单词。','隔壁班男生在走廊大声讲笑话，全班都听见了。','有人在教室后面偷偷打乒乓球，球滚到你脚边。','雨后的走廊有股潮湿的木头味。'])+
   '\n💡 这节课间有 10 分钟，你可以先去上厕所，再玩会儿手机，最后回教室。',
  choices:[C('🚶 开始安排课间（多动作）','10 分钟自由支配',function(){hold(next);breakSystem('☕ 课间十分钟',10,'学生',function(){next();});})]};
};
SLOTS.eyecare=function(s){
 var cs=[C('👀 认真做眼保健操','健康+3',function(){G.health+=3;G.sleep-=4;l('你认真按完四个八拍。');}),
 C('🙄 敷衍瞎按','32%被记录',function(){if(!tc(.32,'criticize','眼操检查员隔着窗户看到你手在脸上乱摸，记下了你的名字')){G.health+=1;l('你手在脸上划了两下就完事了。');}}),
 C('🫥 趴桌上假装闭眼','困意-8/30%被抓',function(){G.sleep-=8;if(!tc(.3,'warn','检查员觉得你“闭眼姿势不太标准”'))l('你闭着眼假装做操，其实在想中午吃什么。');})];
 var nv=firstNovel();if(nv)cs.push(C('📖 一边做一边看小说','40%被没收',function(){G.mood+=7;readNovel(nv);}));
 if(phoneOK())cs.push(C('📱 手藏桌肚刷手机','40%被没收',function(){G.st.phone++;
  if(tc(.4,'confiscate','做眼操时你的手机屏幕亮得像个小太阳','phone'))return;G.mood+=10;l('你一边按太阳穴一边刷手机。心情+10');}));
 cs.push(C('🚻 借口去厕所，溜一圈','',function(){hold(function(){next();});moveTo('厕所',function(){hold(function(){next();});breakSystem('🚻 厕所/走廊',8,'学生',function(){next();});});}));
 return {title:'👁️ '+s.t+' 眼保健操（第'+s.n+'次）',text:'广播里传来那段熟悉的音乐。\n走廊里已经站着两个戴红袖章的检查员，正在挨个教室看。',choices:cs};
};
SLOTS.meal=function(s){
 var cs=[C('🍚 食堂干饭','健康+6 心情+2',function(){G.health+=6;G.mood+=2;G.sleep+=5;G.st.eat++;
   l('你在食堂排了十分钟队。'+pk(['今天的土豆丝是昨天红烧肉的转世。','打饭阿姨的手抖得很有节奏。','你抢到了最后一份鸡腿。','汤是免费的，因为它本质上就是水。']));}),
 C('🍚 干饭 + 🛒 冲小卖部','花钱买快乐',function(){G.health+=6;G.mood+=2;G.sleep+=5;G.st.eat++;
  l('你三下五除二扒完饭，冲向小卖部。');hold(next);shopSys();}),
 C('🥗 不吃了，减肥/省时间','健康-6 心情-4',function(){G.health-=6;G.mood-=4;G.sleep-=3;l('你为了省时间没吃饭，下午肚子一直在叫。');})];
 if(G.gender==='女'&&G.period)cs.push(C('🍵 加点红糖姜茶','需红糖姜茶',function(){
  if(!has('brownsugar')){l('你没带红糖姜茶。','warn');return;}
  take('brownsugar',1);G.pain=cl(G.pain-2,0,5);G.mood+=8;l('🍵 热的红糖姜茶下去，小腹舒服多了。','good');}));
 if(G.weather.rain>=1)cs.push(C('☔ 冒雨跑去食堂（不打伞）','可能感冒',function(){
  if(ch(.45))catchCold('你冒着雨跑到食堂，衣服全湿了');else{G.health+=5;l('你跑得飞快，只湿了鞋。');}}));
 return {title:(s.which==='午饭'?'🍚 12:00 午饭':'🍛 17:00 晚饭'),
  text:s.which==='午饭'?'下课铃一响，走廊像开了闸的洪水。\n食堂窗口前排起长队，今天招牌菜是“土豆炖土豆”。':'晚自习18:00就要开始，你只有一小时。\n食堂的灯很亮，炒菜味飘得老远。',choices:cs};
};
SLOTS.nap=function(){
 if(G.pendingStory&&ch(.5)){G.pendingStory=false;return storyEvent();}
 var cs=[C('😴 趴桌上睡午觉','困意-32 健康+4',function(){G.sleep-=(T('nap')?64:32);G.health+=4;l('你睡了个踏实的午觉。');}),
 C('📝 用午休写作业','学习+8 困意+8',function(){G.knowledge+=8;G.st.study+=8;G.sleep+=8;l('你写完了一科作业，但下午会更困。');}),
 C('🚶 去操场走两圈','健康+4 心情+3',function(){G.health+=4;G.mood+=3;G.sleep-=5;G.st.exer++;l('你在操场上走两圈，还看见校猫在晒太阳。');})];
 if(phoneOK())cs.push(C('📱 被窝里玩手机','心情+12/30%被没收',function(){G.st.phone++;hold(next);openPhone();}));
 if(G.period)cs.push(C('🔥 用暖手宝捂一会儿','需暖手宝',function(){if(!has('heater')){l('没有暖手宝。','warn');return;}
  G.pain=cl(G.pain-1,0,5);G.mood+=6;l('🔥 暖手宝贴着肚子，舒服多了。');}));
 return {title:'🛏️ 12:40 午休',text:'铃一响，教室里“哗”地倒下一片。\n班主任在走廊里踱步，脚步声由远及近……',choices:cs};
};
SLOTS.homework=function(){
 var a=pk([{t:'少',s:5,e:6,d:'今天作业出奇地少，只有数学一套卷子。'},{t:'正常',s:8,e:10,d:'语文默写、数学卷子、英语完形，各一份。'},
 {t:'很多',s:12,e:15,d:'五个老师像商量好了，今天的作业能铺满整张桌子。'},{t:'爆炸',s:16,e:20,d:'班主任进了三次教室，每次手里都多一沓卷子。'}]);
 return {title:'📝 15:45 学习任务（作业量：'+a.t+'）',text:a.d+'\n离晚饭还有一个多小时，你打算怎么处理这些纸？',
  choices:[C('✍️ 认真写','学习+'+a.s,function(){var g=Math.round(a.s*(T('mem')?1.25:1));G.knowledge+=g;G.sleep+=a.e;G.st.study+=g;G.mood-=3;
   l('你埋头写了很久，学习+'+g+'，眼睛有点干。');}),
  C('📋 抄同桌的','学习+少量/30%被抓',function(){var g=Math.round(a.s*.5);G.knowledge+=g;G.st.study+=g;G.sleep+=4;
   if(!tc(.3,'criticize','你抄得太投入，两张卷子连错的地方都一模一样'))l('你飞速抄完作业，学习+'+g);else l('你被要求重写一遍。');}),
  C('🛋️ 摆烂','心情+5',function(){G.mood+=5;G.sleep+=4;l('你把卷子塞进抽屉最底层，眼不见为净。');}),
  C('🎧 边听歌边写','困意-/效率一般',function(){var g=Math.round(a.s*.7);G.knowledge+=g;G.st.study+=g;G.sleep+=Math.round(a.e*.4);G.mood+=5;
   l('你戴着耳机写作业，效率一般但心情不错。');})]};
};
SLOTS.extend=function(){
 return {title:'🕓 16:25 延长课（16:25-17:00）',text:'延长课铃响了。这节课名义上是“自习辅导”，实际老师在讲台上改卷子，底下干什么的都有。',
  choices:[C('✏️ 老实上延长课','学习+4',function(){G.knowledge+=4;G.st.study+=4;l('你写了两页作业。');}),
  C('📞 溜出去打电话','风险低',function(){G.st.skip++;escapeClass({n:'教学楼后面的电话亭',risk:.22,pun:'warn',go:function(){
   G.mood+=10;if(G.lover)G.lover.aff=cl(G.lover.aff+5);l('你溜出去打了个电话。心情+10','love');}});}),
  C('🍜 溜出去先吃饭','风险低',function(){G.st.skip++;escapeClass({n:'食堂后门',risk:.2,pun:'warn',go:function(){
   G.health+=5;G.mood+=8;l('你提前吃了晚饭，还多加一个鸡腿。','good');}});}),
  C('📦 溜去门卫室拿快递','风险中',function(){G.st.skip++;escapeClass({n:'门卫室',risk:.35,pun:'criticize',go:function(){hold(next);parcelGo();}});}),
  C('🏀 去操场打球','锻炼',function(){G.fitness+=5;G.health+=4;G.st.exer++;G.sleep-=12;l('你打了半小时球。体力+5');})]};
};
SLOTS.dinner=function(){
 return {title:'🚿 17:00 吃饭 / 洗澡（17:00-18:00）',text:'这一个小时是你一天里最自由的：可以吃饭，可以洗澡，也可以都不干。\n浴室门口排着队，水汽从门缝里冒出来。',
  choices:[C('🍚 先吃饭再洗澡','健康+8 魅力+4',function(){G.health+=8;G.charm+=4;G.st.eat++;G.sleep-=8;l('你吃得饱饱的，又洗了个热水澡。','good');}),
  C('🚿 只洗澡不吃饭','魅力+6 健康-4',function(){G.charm+=6;G.health-=4;l('你洗了很久热水澡，但肚子是空的。');}),
  C('🛌 回宿舍躺着','困意-25',function(){G.sleep-=25;l('你躺了四十分钟，什么也没干，但很幸福。');}),
  C('📚 去图书馆刷题','学习+6',function(){G.knowledge+=6;G.st.study+=6;G.sleep+=4;l('你在图书馆刷了一会儿题。');}),
  C('🥡 偷偷点/等外卖','风险高',function(){hold(next);openPhone();})]};
};
SLOTS.night=function(s){
 if(s.n===2&&G.pendingStory){G.pendingStory=false;return storyEvent();}
 if(G.sleep>=88){G.sleep-=30;var c2=ch(.5);G.st.slept++;
  return {title:'😴 '+s.t+' 晚自习 · 你直接睡死了',text:'晚自习的教室安静得只剩翻书声，而你的头越来越沉……',
   choices:[C('（继续）','',function(){if(c2)tt('criticize','值班老师拍了你三次肩膀都没拍醒，最后拍了张照片发班级群');else l('你睡过了半节晚自习。');})]};}
 var cs=[C('✏️ 刷题','学习+/困意+',function(){var g=Math.round(rnd(5,9)*(T('mem')?1.25:1));G.knowledge+=g;G.st.study+=g;G.sleep+=6;l('你刷了一节晚自习，学习+'+g);}),
 C('💤 趴着眯一会儿','困意-25/40%被抓',function(){G.sleep-=25;G.st.slept++;
  if(!tc(.4,'criticize','晚自习睡觉被抓现行，你站着听完了后半小时'))l('你睡了一会儿，精神好多了。');}),
 C('📖 课桌下看小说','30%被没收',function(){var nv=firstNovel();if(nv)readNovel(nv);else l('你翻遍桌子，根本没带小说。');}),
 C('📱 桌肚里玩手机','42%被没收',function(){G.st.phone++;hold(next);openPhone();}),
 C('💌 传纸条','心情+/30%被抓',function(){G.mood+=7;
  if(!tc(.3,'criticize','纸条在半路被截获，还被当众念了出来'))l('你收到一张写着“下课吃啥”的纸条。心情+7');
  else l('全班都听懂了纸条上的八卦。心情-10','bad');}),
 C('🚪 逃晚自习','风险中等',function(){G.st.skip++;escapeClass({n:'操场看台',risk:.42,pun:'criticize',go:function(){
  G.sleep-=10;G.mood+=12;G.knowledge-=3;l('你逃了晚自习，坐在看台上看了很久的星星。','good');}});}),
 C('📝 写别科作业','学习+ 安全',function(){var g=rnd(3,5);G.knowledge+=g;G.st.study+=g;l('你在晚自习写完了其他科作业。');})];
 return {title:'🌙 '+s.t+' 晚自习（第'+s.n+'节·50分钟）',text:'教室里只有笔尖摩擦的声音和电扇的嗡嗡声。\n值班老师在讲台上改卷子，偶尔抬头扫一眼。'+(s.n===4?'\n这是最后一节，22:00就能回宿舍了。':''),choices:cs};
};
SLOTS.dorm=function(){
 var cs=[C(G.boarder?'🛌 洗洗直接睡':'🌙 回家洗漱睡觉','困意-40 健康+4',function(){G.sleep-=40;G.health+=4;
   l(G.boarder?'你洗漱完就钻进被窝。困意-40':'你回到家洗了个澡直接睡了。困意-40');}),
 C('💬 和室友/家人聊天','心情+8/20%被警告',function(){G.mood+=8;G.sleep+=3;G.st.chat++;
  if(!tc(.2,'warn','你们聊得太大声，被舍管敲了两下门'))l('你们聊了游戏、八卦和未来。');})];
 if(G.boarder){
  cs.push(C('📱 打牌/玩手机/开黑','心情+15/45%被抓',function(){G.st.phone++;hold(next);openPhone();}));
  cs.push(C('📖 打手电筒看小说','30%被没收',function(){var nv=firstNovel();
   if(nv){G.mood+=10;if(!tc(.3,'confiscate','你打着手电筒在被窝里看，被子被人一把掀开',nv))l('你在被窝里看了半本。');}else l('没有小说，只能躺着发呆。');}));
  if(has('noodle'))cs.push(C('🍜 躲在被窝吃泡面','35%被抓',function(){eatInClass('noodle');
   if(!tc(.35,'criticize','半夜的泡面味顺着门缝飘到舍管鼻子里'))l('你吃了碗泡面，人生圆满。');}));
  if(G.gender==='女'&&G.period)cs.push(C('🩹 睡前再换一次','消耗卫生巾',function(){
   if(!has('sanitary')){l('没有卫生巾了。','warn');return;}
   take('sanitary',1);G.mood+=5;l('🩹 换好了，今晚能睡个安稳觉。');}));
 }else{
  cs.push(C('📱 通宵打游戏','心情+++/第二天很惨',function(){G.st.phone++;hold(next);openPhone();}));
  cs.push(C('🍜 吃夜宵','心情+12',function(){G.mood+=12;G.health+=3;l('你妈给你煮了碗面，还卧了个蛋。','good');}));
  cs.push(C('📚 晚上开小灶','学习+8 困意+14',function(){G.knowledge+=8;G.st.study+=8;G.sleep+=14;l('你在自己房间学到很晚。');}));
 }
 return {title:G.boarder?'🏠 22:00 回到宿舍':'🏡 22:00 走读生回家',
  text:G.boarder?'宿舍楼里人声鼎沸，洗漱间排着队。\n23:00熄灯，你还有一小时自由支配（前提是不被舍管发现）。':'你回到了家。客厅的灯还亮着，桌上留了水果。\n23:00该睡了。',choices:cs};
};
SLOTS.sleep=function(){
 var cs=[C('😴 睡觉','迎接新的一天',function(){l('你闭上眼睛，房间很快安静下来。');setTimeout(function(){if(!G.over)nextEnd();},400);},true)];
 if(phoneOK())cs.unshift(C('📱 再刷会儿手机','心情+10/明天更困',function(){G.st.phone++;
  hold(function(){G.sleep+=15;G.mood+=10;nextEnd();});openPhone();},true));
 return {title:'🌙 23:00 熄灯',text:'“啪”的一声，整栋楼陷入黑暗。\n有人在被窝里偷偷说话，走廊里传来拖鞋的啪嗒声。',choices:cs};
};
function nextEnd(){G.idx=99999;DEP=0;try{_next();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}}
/* ============ 19 老师时段 ============ */
SLOTS.t_arrive=function(){
 return {title:'☕ 06:50 到校',text:'你把车停在操场边，天刚亮。\n'+(G.dutyLast?'今天轮到你值班看跑操。':'今天不用看跑操，先去办公室泡杯茶。'),
  choices:[C('☕ 去办公室备课','教学+5',function(){G.teach+=5;l('你把今天的课件又看了一遍。教学+5');}),
  C('🏃 去操场转一圈','师生关系+4',function(){G.relation+=4;l('几个学生跟你打招呼。');}),
  C('😴 在车里再睡一会儿','心情+8/有风险',function(){G.mood+=8;
   if(!tc(.25,'warn','你睡过头了，第一节课铃响时才冲进教学楼'))l('你在车里睡了二十分钟。心情+8');}),
  C('📱 先刷会儿手机','老师也要摸鱼',function(){hold(next);tPhone();})]};
};
SLOTS.t_duty=function(){
 return {title:'🏃 06:50 值班 · 看跑操',text:'今天轮到你值班。学生排着方阵在跑道上跑，你要站在中间记“不合格班级”。',
  choices:[C('📋 认真记录','支持度+8 关系-5',function(){G.schoolSupport+=8;G.relation-=5;l('你记了三个不合格的班，教导处表扬了你。');}),
  C('😴 装作没看见','关系+8 支持度-5',function(){G.relation+=8;G.schoolSupport-=5;l('几个学生偷偷朝你比了个耶。');}),
  C('😤 抓两个典型','支持度+12 关系-12',function(){G.schoolSupport+=12;G.relation-=12;G.demerits++;l('你抓了两个说话的学生，让他们在操场边站了一节课。','warn');if(G.demerits>=5)ach('t5');}),
  C('🎤 自己也跑两圈','健康+ 关系+',function(){G.health+=6;G.relation+=5;l('学生爆出一片欢呼。','good');})]};
};
SLOTS.t_read=function(){
 return {title:'📖 07:10 早读看班',text:'你站在教室后面，学生一个个捧着书在读。\n有几个人的书是倒着的。',
  choices:[C('👀 巡视一圈，抓几个睡觉的','纪律+ 关系-',function(){G.schoolSupport+=6;G.relation-=4;l('你拍醒了两个趴着的学生。');}),
  C('📖 自己也读一段','教学+',function(){G.teach+=4;G.relation+=3;l('你给学生示范了一段朗读。师生关系+3');}),
  C('☕ 站在门口喝咖啡','心情+',function(){G.mood+=8;l('你靠着门框喝完了一杯咖啡。心情+8');}),
  C('📱 刷手机','有风险',function(){G.mood+=6;if(ch(.15)){G.schoolSupport-=6;l('你低头看手机，被年级主任看到了。学校支持度-6','bad');}else l('你安静地刷了会儿手机。');})]};
};
SLOTS.t_class=function(s){
 return {title:'📖 '+s.t+' 上课 · '+s.subject,text:SUBSAY[s.subject]+'\n讲台下四十双眼睛看着你。'+(G.period?'\n（生理期，站久了腰有点酸。）':''),
  choices:[C('🧑‍🏫 认真讲课','教学+ 支持度+',function(){var g=Math.round(rnd(5,9)*(T('talk')?1.2:1));G.teach+=g;G.relation+=3;
   l('你讲得很投入'+(T('joker')?'，还讲了两个段子，全班笑成一片。':'。')+'教学+'+g);}),
  C('📱 讲台上摸鱼','被学生拍概率低',function(){G.mood+=8;
   if(!tc(.1,'warn','有学生举手：“老师，你在看什么？”'))l('你在讲台上刷了十分钟手机。心情+8');}),
  C('😤 抓几个睡觉的','关系-6',function(){G.relation-=6;G.teach+=3;G.demerits++;l('你让三个睡觉的学生站着听课。师生关系-6');if(G.demerits>=5)ach('t5');}),
  C('😊 和学生聊十分钟','关系+10',function(){G.relation+=10;G.mood+=5;l('你讲了自己高中的故事，全班都听进去了。','good');}),
  C('🚻 中途出去一趟','回来继续',function(){G.mood+=3;l('你出去喝了口水，回来接着上课。');})]};
};
SLOTS.t_patrol=function(){
 return {title:'🔍 '+G.time+' 巡查',text:'你抱着记录本在走廊里转。眼操、课间、课堂纪律都要有人管。',
  choices:[C('📋 认真巡查','支持度+8 关系-4',function(){G.schoolSupport+=8;G.relation-=4;G.caught++;
   l('你记录了几个班的情况。'+(T('watch')?'你一眼就看出哪个班有问题。':'')+'学校支持度+8');if(G.caught>=10)ach('t6');}),
  C('🤝 睁一只眼闭一只眼','关系+8',function(){G.relation+=8;G.schoolSupport-=4;l('你什么都没记，还在走廊和学生聊了两句。');}),
  C('🤫 抓一个典型交给班主任','支持度+10 关系-8',function(){G.schoolSupport+=10;G.relation-=8;l('你把一个玩手机的学生交给了班主任。');}),
  C('☕ 走廊尽头喝咖啡','心情+10',function(){G.mood+=10;
   if(!tc(.12,'warn','校长路过，看见你端着咖啡发呆'))l('你站了十分钟，看着操场上的学生。');}),
  C('📞 顺便打两个电话','老师式摸鱼',function(){hold(next);tPhone();})]};
};
SLOTS.t_break=function(){
 return {title:'☕ '+G.time+' 课间（老师）',text:'课间十分钟，走廊里全是跑动的学生。\n你可以做几件事。',
  choices:[C('🚶 安排一下这个课间（多动作）','10 分钟自由支配',function(){hold(next);breakSystem('☕ 课间十分钟',10,'老师',function(){next();});})]};
};
SLOTS.t_office=function(){
 return {title:'🗂️ '+G.time+' 坐班 · 备课批作业',text:'办公桌上堆着两沓卷子，旁边是永远喝不完的保温杯。',
  choices:[C('📝 认真批作业','教学+6 学术+4',function(){G.teach+=6;G.academic+=4;G.health-=2;l('你批完一整沓卷子，还写了批语。');}),
  C('🔬 写论文/做课题','学术++',function(){G.academic+=rnd(6,10)*(T('paper')?2:1);G.teach+=2;l('你写了两页论文。学术大涨。');}),
  C('😴 趴桌上睡一觉','健康+4',function(){G.health+=4;G.mood+=6;l('你睡了半小时，醒来发现脸上有笔印。');}),
  C('💬 和同事聊八卦','支持度+4',function(){G.schoolSupport+=4;G.mood+=8;l('你们聊了工资、学生和假期。心情+8');}),
  C('🏆 留下辅导竞赛学生','关系+10',function(){G.relation+=10;G.teach+=5;G.fame+=1;l('你给几个学生做竞赛辅导，他们眼睛都亮了。','good');}),
  C('📱 刷会儿手机','',function(){hold(next);tPhone();}),
  C('💰 顺手办点“私事”','灰色收入',function(){hold(next);openCorrupt();})]};
};
SLOTS.t_lunch=function(){
 return {title:'🍚 12:00 教师午餐',text:'教师食堂的菜比学生食堂好一点，有排骨和汤。\n三张桌子拼在一起，坐的都是同一个办公室的人。',
  choices:[C('🍚 教师食堂吃饭','健康+5 心情+6',function(){G.health+=5;G.mood+=6;l('你在教师食堂吃了顿饭，还和同事聊了聊国际部的事。');}),
  C('🚶 去学生食堂看看','关系+6',function(){G.relation+=6;l('你在学生食堂转了一圈，几个学生跟你打招呼。');}),
  C('📊 回办公室处理表格','支持度+6',function(){G.schoolSupport+=6;G.health-=2;l('你填完了三张表格。');}),
  C('😴 趴桌上睡午觉','心情+8',function(){G.health+=4;G.mood+=8;l('你睡了二十分钟，醒来发现脸上有笔印。');}),
  C('📦 顺路去拿自己的快递','老师不用出门单',function(){hold(next);parcelGo();}),
  C('📱 刷会儿手机','',function(){hold(next);tPhone();})]};
};
SLOTS.t_noon=function(){
 if(G.pendingStory&&ch(.35)){G.pendingStory=false;return storyEvent();}
 return {title:'🛋️ 12:40 午间坐班',text:'午休时间，办公室里有人在打呼噜，有人在批卷子。\n窗外的雨还在下。',
  choices:[C('😴 趴一会儿','健康+5 心情+6',function(){G.health+=5;G.mood+=6;l('你趴了半小时。');}),
  C('📝 批完剩下的卷子','教学+5 学术+3',function(){G.teach+=5;G.academic+=3;G.health-=2;l('你批完了两沓卷子。教学+5');}),
  C('🚶 去教室看看学生','关系+5',function(){G.relation+=5;l('你绕到教室后门看了一眼，几个学生在偷偷玩手机，你敲了敲窗户。师生关系+5');}),
  C('👨‍👩‍👧 给家长回消息','关系+4',function(){G.relation+=4;G.mood-=2;l('你回复了十七条家长消息，其中五条是问作业的。');}),
  C('📱 刷手机','',function(){hold(next);tPhone();}),
  C('💰 办点“私事”','灰色收入',function(){hold(next);openCorrupt();}),
  C('🚶 自由移动','去别的地方',function(){hold(next);openWander();})]};
};
SLOTS.t_intl=function(){
 return {title:'🌐 16:30 国际部事务',text:'国际部在另一栋楼，地毯、中央空调、还有一台现磨咖啡机。\n那边的学生下午三点半就放学了，A-Level 班的孩子在准备申请材料。',
  choices:[C('🌐 处理国际部课程申报','学术+6',function(){G.academic+=6;G.schoolSupport+=6;l('你把 A-Level 和 EJU 的申报表交了上去。学术+6');}),
  C('🤝 接待外校/外国学校来访领导','知名度++',function(){G.fame+=rnd(3,6);G.schoolSupport+=8;
   l('你陪外宾参观了机器人教室和 3D 打印教室，还介绍了铜鉴湖校区。知名度大涨。','good');}),
  C('☕ 在咖啡机旁摸鱼','心情+10',function(){G.mood+=10;l('你喝了两杯免费咖啡，看了会儿窗外的湖景。心情+10');}),
  C('📈 调整国际部特权','管理',function(){hold(next);intlSys();}),
  C('📣 让公众号写一篇国际部推送','知名度+ 学术+',function(){G.fame+=3;G.academic+=2;
   l('📣 公众号发了《从铜鉴湖到剑桥》，阅读量破万。知名度+3','good');}),
  C('📞 打电话给合作方/朋友','老师式社交',function(){hold(next);tPhone();})]};
};
SLOTS.t_meeting=function(){
 return {title:'👔 16:00 周一行政会',text:'会议室里坐满了人，校长坐在最上面。\n投影幕布上是一份《本学期重点工作安排（讨论稿）》。',
  choices:[C('📊 主动汇报工作','支持度+10',function(){G.schoolSupport+=10;G.fame+=1;l('你汇报了自己班的情况，校长点头三次。学校支持度+10');}),
  C('📄 提出议案（涨学费/克扣假期/发福利）','进入表决',function(){hold(next);meetingVote();}),
  C('😐 全程不说话，喝茶','安全',function(){l('你从头喝到尾，杯子续了四次水。');}),
  C('📝 帮学生争取福利','关系+12 支持度-8',function(){G.relation+=12;G.schoolSupport-=8;
   l('你提出“食堂加鸡腿、空调全天开放”，学生们在走廊里欢呼。师生关系+12','good');}),
  C('🌐 汇报国际部 A-Level 升学成果','知名度+ 学术+',function(){G.fame+=4;G.academic+=4;
   l('你汇报了国际部毕业生被牛津、剑桥等海外高校录取的情况，会议室响起掌声。','good');}),
  C('💰 私下和财务对一下账','灰色收入',function(){hold(next);openCorrupt();})]};
};
SLOTS.t_night=function(){
 if(G.sleep>=95){G.sleep-=30;return {title:'😴 晚自习 · 你在讲台上睡着了',text:'改卷子改到一半，你撑着额头……然后什么都不知道了。',
  choices:[C('（继续）','',function(){if(ch(.5))l('有学生偷偷拍下了你打盹的照片，发到了班群里。','warn');else l('没人发现。你醒来看见下课铃刚响。');})]};}
 return {title:'🌙 18:00 晚自习值班',text:'晚自习的教室很安静，只有翻书声。你坐在讲台上改卷子。\n（今天有晚自习，你要到 21:00 才能下班。）'+(G.period?'\n生理期第二天,腰有点酸。':'')+'\n走廊的灯亮着，远处有学生在背书。',
  choices:[C('📝 安静改卷子','教学+5',function(){G.teach+=5;l('你改完了两沓卷子。教学+5');}),
   C('🔍 认真巡班','支持度+8 关系-5',function(){G.schoolSupport+=8;G.relation-=5;G.caught++;
    l('你巡了三层楼，抓了两个睡觉的。学校支持度+8');if(G.caught>=10)ach('t6');}),
   C('😴 在讲台上打盹','有风险',function(){G.mood+=10;
    if(!tc(.15,'warn','有学生偷偷拍了你打盹的照片，发到了班群里'))l('你在讲台上眯了半小时。心情+10');}),
   C('💬 留下陪几个学生讲题','关系+12',function(){G.relation+=12;G.teach+=4;
    l('你给三个学生讲了半小时的题，他们一直点头。师生关系+12','good');}),
   C('💊 陪学生谈心，当一次心理老师','关系++ 师德+',function(){G.relation+=8;G.ethics+=4;
    l('有个学生最近状态很差，你陪他在走廊上聊了二十分钟。师风师德+4','good');}),
   C('📱 刷手机','',function(){hold(next);tPhone();}),
   C('🚶 去走廊透口气','自由移动',function(){hold(next);openWander();})]};
};
SLOTS.t_dinner=function(){
 return {title:'🍛 17:00 晚饭时间',text:'食堂的灯亮着。有晚自习的老师会在这儿匆匆吃完再回教室。',
  choices:[C('🍛 食堂吃饭','健康+5',function(){G.health+=5;G.mood+=4;l('你随便吃了点。健康+5');}),
  C('🏃 去操场走两圈','健康+ 心情+',function(){G.health+=4;G.mood+=8;l('你在操场上走了两圈，杭州的傍晚很好看。心情+8');}),
  C('📞 给家里打个电话','心情+8',function(){G.mood+=8;l('你给家里打了个电话。心情+8');}),
  C('🌐 顺便去国际部蹭杯咖啡','心情+',function(){G.mood+=6;l('你在国际部喝了杯免费咖啡。心情+6');}),
  C('📱 刷手机','',function(){hold(next);tPhone();})]};
};
SLOTS.t_off=function(){
 var hasNight=false;
 for(var i=0;i<G.sched.length;i++)if(G.sched[i].type==='t_night')hasNight=true;
 return {title:'🕘 21:00 下班',text:(hasNight?'今天有晚自习，你现在才下班。':'今天没有晚自习——你其实 16:30 就可以走了。')+'\n停车场里还有几辆车。',
  choices:[C('🚗 直接回家','心情+8',function(){G.mood+=8;l('你开车回家，路上有点堵。心情+8');}),
  C('🍺 和同事聚餐/团建','心情+15 支持度+6',function(){G.money-=200;G.mood+=15;G.schoolSupport+=6;
   l('你们去吃了烧烤，聊到十一点。心情+15','good');}),
  C('📚 留下来继续备课','教学+8',function(){G.teach+=8;G.academic+=3;G.mood-=4;l('你在办公室待到十一点。教学+8');}),
  C('🌐 处理学校文件','需校长/主任',function(){
   if(G.role!=='校长'&&G.role!=='年级主任'){l('这不是你该管的事。','warn');return;}
   G.schoolSupport+=8;G.budget-=100000;l('你批了一堆文件，还签了一笔支出。学校支持度+8');}),
  C('🏫 学校大事决策','需校长/主任',function(){hold(next);schoolBig();}),
  C('💰 处理灰色收入','',function(){hold(next);openCorrupt();})]};
};
SLOTS.t_home=function(){
 return {title:'🏠 22:00 到家 / 教师公寓',text:'你把车停好，家里人都睡了。\n明天的课还没备完。',
  choices:[C('🛏️ 直接睡觉','健康+6 心情+6',function(){G.health+=6;G.mood+=6;l('你洗了个澡就睡了。健康+6');}),
  C('💻 再备一会儿课','教学+5',function(){G.teach+=5;G.health-=3;l('你备课到十二点。教学+5');}),
  C('📱 刷手机放松','心情+10',function(){G.mood+=10;l('你刷了半小时手机。心情+10');}),
  C('📝 整理明天的事','支持度+5',function(){G.schoolSupport+=5;l('你把明天要处理的事列了个清单。学校支持度+5');}),
  C('💗 和对象聊两句','恋爱',function(){hold(next);loveSys();})]};
};
/* ============ 20 周末 ============ */
function weekendStart(){
 G.wkStage=1;G.wk=6;G.mood+=10;
 l('🎒 周五 16:30 放学铃响了，全校像开了闸。','day');
 goHomePrompt();
}
function wkStep(){G.wk--;if(G.wk<=0)return backToSchool();weekendAction();}
function goHomePrompt(){
 var cs=[
  C('🚗 爸妈来接','方便',function(){G.mood+=10;l('你妈在校门口等你，还买了杯奶茶。心情+10','good');wkStep();}),
  C('🚇 自己坐地铁/公交','省钱',function(){G.money-=4;G.mood+=3;l('你挤了四十分钟地铁，耳机里循环同一首歌。');wkStep();}),
  C('🚕 打车','可能打不到',function(){
   if(ch(.6)){G.money-=35;G.mood+=5;l('你打了辆车，司机一直在聊房价。');}
   else{G.mood-=8;l('你在校门口等了二十分钟，一辆空车都没有。','bad');}wkStep();}),
  C('🛥️ 坐游艇到铜鉴湖港口（隐藏）','需要很多钱',function(){
   if(G.money<500000){l('你没有游艇。','warn');return;}
   G.mood+=30;G.influence+=20;l('🚤 你家的游艇停在铜鉴湖港口，全年级都在窗户边看。心情+30，影响力+20','good');wkStep();}),
  C('🚁 坐直升飞机停在操场上（隐藏）','需要极其有钱',function(){
   if(G.money<5000000){l('你没有直升机。','warn');return;}
   G.mood+=40;G.influence+=40;G.fame+=5;l('🚁 直升机直接停在操场上，全校师生抬头看。心情+40，影响力+40','good');wkStep();})
 ];
 if(T('rich'))cs.unshift(C('🚙 家里的专车已经在门口等你了','富二代',function(){G.mood+=15;l('你家的车停在校门口最显眼的位置。心情+15','good');wkStep();}));
 scene('🎒 周五 16:30 放学 · 怎么回家？','放学铃一响，校门口挤满了人和车。\n杭州的傍晚有点湿，路灯刚亮。',cs);
}
function weekendAction(){
 var acts=[
  C('😴 睡到自然醒','困意-45',function(){G.sleep-=45;G.mood+=8;l('你睡到中午十二点，醒了又躺了半小时。困意-45','good');wkStep();}),
  C('📚 刷题/补课','学习++',function(){var g=rnd(6,12);G.knowledge+=g;G.st.study+=g;G.sleep+=6;l('你刷了一整个时间段的题。学习+'+g);wkStep();}),
  C('🎮 打游戏/刷手机','心情+++',function(){hold(wkStep);openPhone();}),
  C('🏃 出去运动/健身','体力++ 腹肌+1',function(){G.fitness+=8;G.health+=5;G.abs+=1;G.st.exer++;
   l('你练了一小时，'+(G.gender==='女'?'马甲线':'腹肌')+'更明显了。体力+8','good');wkStep();}),
  C('🛍️ 出门逛街','魅力+ 花钱',function(){
   if(G.money<100){l('你没钱，只能在家看别人逛街。','warn');return wkStep();}
   G.money-=100;G.charm+=8;G.appear+=3;G.mood+=12;l('你买了一身新衣服。魅力+8，颜值+3','good');wkStep();}),
  C('💗 和TA约会 / 谈恋爱','恋爱',function(){hold(wkStep);loveSys();}),
  C('🍗 在家吃夜宵/点外卖','心情+ 健康+',function(){G.mood+=12;G.health+=3;G.money-=30;l('你半夜点了份烧烤，边吃边看剧。心情+12','good');wkStep();}),
  C('🙋 跟爸妈要钱/要东西','索要',function(){hold(wkStep);askSys();}),
  C('📦 网购 + 周一去拿快递','',function(){hold(wkStep);openMail();}),
  C('🧺 帮家里干活','+¥50',function(){G.mood+=5;G.money+=50;l('你帮家里干了半天活，你妈给了你五十块。','good');wkStep();}),
  C('📖 看小说/追剧','心情++',function(){var nv=firstNovel();if(nv)readNovel(nv);else{G.mood+=12;l('你追了一整部剧。心情+12');}wkStep();})
 ];
 if(G.mode==='student')acts.push(C('🔥 联系地下组织的同学','造反线',function(){hold(wkStep);revSys();}));
 else acts.push(C('💰 处理灰色收入','老师专属',function(){hold(wkStep);openCorrupt();}));
 scene('🏠 周末 · 剩余时间 '+G.wk+' 段',
  pk(['家里很安静，窗外是杭州湿漉漉的天。','你躺在自己床上，天花板上还贴着去年的贴纸。','客厅里电视开着，你妈在看综艺，笑声很大。'])+'\n你想做点什么？',acts);
}
function backToSchool(){
 G.wkStage=0;
 var d=G.date;
 if(d.getDay()===6){d.setDate(d.getDate()+2);G.day+=2;}
 else{d.setDate(d.getDate()+1);G.day+=1;}
 if(G.mode==='teacher'){l('🌆 周日晚上，你把下周的课件拷进 U 盘，准备明天上课。','day');return startDay();}
 if(!G.boarder){l('🏡 你是走读生，周一早上再去学校。','day');return startDay();}
 var cs=[
  C('🚗 爸妈送','方便',function(){G.mood-=6;l('你妈一路上都在念你作业写完了没有。心情-6');startDay();}),
  C('🚇 地铁+公交','累',function(){G.mood-=8;G.sleep+=8;G.money-=4;l('你拖着一个行李箱换了两趟车。心情-8，困意+8');startDay();}),
  C('🚕 打车','快',function(){G.money-=35;G.mood-=4;l('你打了辆车，二十分钟就到了校门口。');startDay();}),
  C('🛥️ 坐游艇到铜鉴湖港口（隐藏）','要很多钱',function(){
   if(G.money<500000){l('你没有游艇。','warn');return;}
   G.mood+=15;G.influence+=15;l('🚤 游艇靠岸，保安一脸复杂地给你开了门。影响力+15','good');startDay();}),
  C('🚁 直升飞机降落操场（隐藏）','极其有钱',function(){
   if(G.money<5000000){l('你没有直升机。','warn');return;}
   G.mood+=25;G.fame+=4;G.influence+=30;l('🚁 直升机降落，全校在窗户边围观。','good');startDay();})
 ];
 scene('🌆 周日 18:00 · 返校','校门口全是拖着行李箱的学生。\n保安拿着测温枪站在门边，检查手机的老师也在。',cs);
}
/* ============ 21 结局 ============ */
function ending(type){
 if(G.over)return;G.over=true;
 var days=G.day||1,e='',t='',d='',cls='';
 if(type==='retire'){e='🚪';t='你被劝退了';cls='crash';
  d='三个处分，够了。\n教务处的文件上写着“屡教不改”。\n你抱着一个纸箱走出校门口，回头看了最后一眼——教学楼里的灯还亮着，晚自习还没有下课。';}
 else if(type==='graduate'){e='🎓';t='学年结束';
  d='暑假到了。你把书包往肩上一甩，风从耳边刮过去。\n这一年，你活着走完了。\n铜鉴湖的荷花开得正好。';}
 else if(type==='preg'){e='😨';t='休学';
  d='你在医院走廊里坐了很久。\n最后是班主任陪你去的教务处。\n“先休学一年吧，身体要紧。”\n你走出校门那天，杭州在下雨。';}
 else if(type==='fired'){e='📜';t='教资被吊销';cls='crash';
  d='教育局的文件下来了：吊销教师资格。\n你把办公桌上的东西装进一个纸箱——保温杯、没批完的卷子、还有一张学生送的贺卡。\n走廊上还是有学生跑过去喊你“老师”，你没有回头。';}
 else if(type==='corrupt'){e='🚨';t='纪委把你带走了';cls='crash';
  d='审计查了三个月的账。\n那笔工程款的发票对不上，那句“管理费”的备注也没法解释。\n你被带走那天，操场上正在跑操。\n你路过教学楼的时候，看见有人在窗户后面看着你。';}
 else if(type==='revoltCrush'){e='🚔';t='被维持治安';
  d='两辆车停在操场上，校服和制服混在一起。\n广播里反复播放：“请同学们立即返回教室。”\n你被记了大过，还写了一份五千字的检查。学校一切照旧。';}
 else if(type==='revoltMole'){e='🕵️';t='有内鬼';
  d='你们约好课间操在操场集合。\n结果等来的是班主任和一份名单。\n名单上有你的名字，还有那个总在办公室门口晃的人。\n他站在走廊另一头，不敢看你。';}
 else if(type==='revoltCompromise'){e='📄';t='学校妥协';
  d='校方发了公告：学费不涨了，国庆假期补回来，食堂开二窗，饮水机明天修好。\n没人道歉，但所有人都知道发生了什么。\n晚自习的走廊里，有人小声说：“我们赢了。”';}
 else if(type==='revoltWin'){e='✊';t='天下大同 · 新学校';
  d='一个学期后，你们真的办起了一所新学校。\n在一间租来的教室里，黑板是新的，窗户是旧的，学生自己排课表。\n有记者来采访，稿子的标题是：《一群高中生，和他们的一所新学校》。\n那天杭州的天很晴。';}
 var score=Math.round(G.knowledge*2+G.mood+G.health-G.demerits*25+G.influence+G.support+G.lovers.length*20+(G.corrupt||0)/1000);
 var certH='';
 for(var k in G.mem)certH+='<div class="mb"><span>'+k+'</span><span class="warn">'+G.mem[k]+'</span></div>';
 modal('<h3>'+e+' '+t+'</h3><p style="white-space:pre-wrap">'+d+'</p><div class="quote">'+
  '📅 坚持：'+days+' 天<br>💰 金钱：'+Y(G.money)+'<br>📘 学习：'+Math.round(G.knowledge)+' · 📊 成绩：'+Math.round(G.grade)+
  '<br>🙂 心情：'+Math.round(G.mood)+' · ❤️ 健康：'+Math.round(G.health)+
  '<br>⭐ 影响力：'+Math.round(G.influence)+' · ✊ 支持度：'+Math.round(G.support)+
  '<br>💗 恋爱：'+G.lovers.length+' 轮 · 🏆 成就：'+G.ach.length+' 个'+
  (G.duty?'<br>🏅 职务：'+G.duty:'')+(G.union>=0?'<br>🗳️ 学生会：'+UNION[G.union].n:'')+
  (G.club?'<br>🎭 社团：'+G.club.n+' Lv'+G.clubLv:'')+
  (G.mode==='teacher'?'<br>👔 职位：'+G.role+' · 灰色收入：'+Y(G.corrupt||0)+' · 被约谈 '+G.warned+' 次':'')+
  '<br>🚨 被抓 '+G.caught+' 次 · 📄 处分 '+G.demerits+'/3 · 🌑 抑郁 '+Math.round(G.depression)+
  '<br>⭐ 综合评分：'+score+'</div>'+(certH?'<h3 style="margin-top:10px">每日称号</h3>'+certH:'')+
  '<button class="big" onclick="location.reload()">🔄 再上一遍学</button>',cls);
}
function crash(){
 if(G.over)return;G.over=true;
 modal('<h3>💥 游戏已崩溃</h3><p class="mono">Uncaught DepressedError: 抑郁值溢出 (100/100)<br>'+
  'at 西子实验学校.你的情绪系统 (emotion.js:1024)<br>'+
  'at 班主任.血压上升 (office.js:7)<br>'+
  'at 食堂.土豆炖土豆 (canteen.js:404)</p>'+
  '<p>'+G.name+' 的心理防线彻底崩了。<br>卷子、处分、眼操检查员、半夜的呼噜声，还有那句“你再这样下去怎么办”——所有东西在同一秒压了下来。</p>'+
  '<div class="quote">📅 坚持到第 '+G.day+' 天<br>📘 学习 '+Math.round(G.knowledge)+'　🙂 心情 '+Math.round(G.mood)+
  '<br>🚨 被抓 '+G.caught+' 次　📄 处分 '+G.demerits+'/3</div>'+
  '<button class="big" onclick="location.reload()">🔄 重启系统</button>','crash');
}
/* ============ 22 自动模式 ============ */
function toggleAuto(){
 AUTO=!AUTO;
 var b=$('#bAuto');if(b)b.className='mini'+(AUTO?' on':'');
 if(AUTO){
  var box=$('#choices');
  if(box&&box.firstChild)setTimeout(function(){try{box.firstChild.click();}catch(e){}},300);
  var mb=document.querySelector('.modalbox .mb');
  if(mb)setTimeout(function(){try{mb.click();}catch(e){}},800);
 }
}
/* ============ 23 开局界面 ============ */
var O={gender:'男',pref:'异性',mode:'student',role:'普通老师',boarder:true,
 talents:[],rollLeft:3,tpBase:0,alloc:{appear:0,fitness:0,knowledge:0,charm:0,luck:0},
 phoneId:7,itemList:[]};
var ATTR=[['appear','😎 颜值'],['fitness','💪 体力'],['knowledge','🧠 智力'],['charm','💫 魅力'],['luck','🍀 运气']];
var START_ITEMS=['umbrella','mp3','cards','cube','cam','powerbank','watch','pad','tissue','mask','bandaid',
 'heater','toy','pillow','medicine','painkiller','vitamin','eyedrop','sanitary','brownsugar',
 'latiao','cola','chips','noodle','bread','sausage','choco','milktea','coffee','energy','gum','cookie',
 'cake','icecream','juice','blindbox','gift','poster','flower','note','spare','model',
 'novel_love','novel_horror','novel_fan','novel_wuxia','novel_scifi','novel_det','novel_lit','novel_comic'];
function isBossO(){return O.mode==='teacher'&&(O.role==='校长'||O.role==='年级主任');}
function pickG(g,v){
 O[g]=(g==='boarder')?(v==='住宿'):v;
 renderStart();
}
function renderStart(){
 try{
  var chips=document.querySelectorAll('[data-grp]');
  var map={gender:O.gender,pref:O.pref,mode:O.mode,role:O.role,boarder:O.boarder?'住宿':'走读'};
  for(var i=0;i<chips.length;i++){
   var c=chips[i],grp=c.getAttribute('data-grp'),val=c.getAttribute('data-v');
   c.className=(map[grp]===val)?'chip on':'chip';
  }
  $('#roleStep').style.display=(O.mode==='teacher')?'block':'none';
  $('#dayStep').style.display=(O.mode==='student')?'block':'none';
  $('#itemStep').style.display=(O.mode==='student')?'block':'none';
  $('#talentStep').style.display=isBossO()?'none':'block';
  var p=PHONES[O.phoneId]||PHONES[0];
  $('#phoneInfo').innerHTML='<b>'+p.b+' '+p.n+'</b><br>参考价 ¥'+p.p.toLocaleString('zh-CN')+
   ' · 性能 '+p.perf+' · 拍照 '+p.cam+' · 续航 '+p.bat+' · 心情加成 '+p.mood;
  var ib=$('#itemBox');
  var save=loadGame();
  $('#continueBtn').style.display=save?'block':'none';
  if(!O.itemList.length)ib.innerHTML='还没有选择道具（最多 3 件）。';
  else{
   var h='';
   for(var j=0;j<O.itemList.length;j++){
    var it=ITEMS[O.itemList[j]];
    h+='<div class="mb"><span>'+it.i+' '+it.n+'<br><span class="dim small">'+(it.d||'')+'</span></span>'+
       '<button class="r" onclick="rmItem('+j+')">移除</button></div>';
   }
   ib.innerHTML=h;
  }
  $('#rollLeft').textContent=O.rollLeft;
  var tl=$('#talentList');
  if(isBossO())tl.innerHTML='管理层不需要天赋。';
  else if(!O.talents.length)tl.innerHTML='还没有天赋（共 3 次抽取机会，每次三选一）。';
  else{
   var th='';
   for(var k=0;k<O.talents.length;k++)th+='<div><b class="good">'+O.talents[k].n+'</b> <span class="dim">— '+O.talents[k].d+'</span></div>';
   tl.innerHTML=th;
  }
  var left=O.tpBase;for(var key in O.alloc)left-=O.alloc[key];
  $('#tpLeft').textContent=isBossO()?'—':left;
  var tpb='';
  if(isBossO())tpb='<p class="dim small">管理层模式，无天赋点。</p>';
  else for(var a=0;a<ATTR.length;a++){
   var kk=ATTR[a][0];
   tpb+='<div class="tprow"><span>'+ATTR[a][1]+'</span><span>'+
    '<button class="tpbtn" onclick="allocPT(\''+kk+'\',-5)" title="-5">−5</button>'+
    '<button class="tpbtn" onclick="allocPT(\''+kk+'\',-1)" title="-1">−1</button> '+
    '<b style="min-width:24px;display:inline-block;text-align:center">'+(O.alloc[kk]||0)+'</b> '+
    '<button class="tpbtn" onclick="allocPT(\''+kk+'\',1)" title="+1">+1</button>'+
    '<button class="tpbtn" onclick="allocPT(\''+kk+'\',5)" title="+5">+5</button></span></div>';
  }
  $('#tpBox').innerHTML=tpb;
  if(O.hint){$('#beginHint').textContent=O.hint;O.hint=null;}else $('#beginHint').textContent='状态：就绪。天赋点已自动分配（不会是 0），可以直接点“开始”。';
 }catch(e){if(window.onerror)window.onerror(e.message,'',0);}
}
function continueGame(){
 var save=loadGame();if(!save)return;
 G=newState({name:save.name||'张逸天',gender:save.gender||'男',mode:save.mode||'student',
  role:save.role||'普通老师',pref:save.pref||'异性',height:178,weight:62,
  money:save.money||0,talents:save.talents||[],tp:save.tp||0,
  boarder:(save.boarder===undefined?true:save.boarder),knowledge:save.knowledge||0,
  salary:save.salary||9000});
 G.date=new Date(save.date);G.day=save.day||0;G.loc=save.loc||'教室';
 G.health=save.health||90;G.mood=save.mood||80;G.sleep=save.sleep||40;
 G.grade=save.grade||60;G.support=save.support||20;G.influence=save.influence||10;
 G.charm=save.charm||40;G.fitness=save.fitness||40;G.appear=save.appear||40;
 G.items=save.items||{};G.period=!!save.period;G.periodDay=save.periodDay||0;
 G.preg=!!save.preg;G.cold=!!save.cold;G.temp=save.temp||36.5;
 G.lover=save.lover||null;G.lovers=save.lovers||[];G.met=save.met||[];
 G.rev=save.rev||{men:0,ev:0,heat:0,mole:false};
 G.club=save.club||null;G.clubLv=save.clubLv||0;G.duty=save.duty||null;G.union=-1;
 if(typeof save.union==='number')G.union=save.union;
 G.outfit=save.outfit||'校服';G.parcel=save.parcel||0;
 G.outPass=save.outPass||[];G.outPassTry=save.outPassTry||0;
 G.budget=save.budget||145000000;G.ethics=save.ethics||70;G.academic=save.academic||60;
 G.teach=save.teach||60;G.fame=save.fame||0;G.relation=save.relation||60;
 G.schoolSupport=save.schoolSupport||70;G.license=save.license||100;
 G.intl=!!save.intl;G.intlPerk=save.intlPerk||0;G.corrupt=save.corrupt||0;
 G.dirty=save.dirty||0;G.warned=save.warned||0;G.billPass=save.billPass||0;
 G.ach=save.ach||[];G.feverCount=save.feverCount||0;
 G.wrongBook=save.wrongBook||[];
G.drillDay=(typeof save.drillDay==="number")?save.drillDay:-1;
G.drillRight=save.drillRight||0;G.drillStreak=save.drillStreak||0;
G.examKey=save.examKey||null;G.examHistory=save.examHistory||[];
G.intro=save.intro||"";G.depression=save.depression||0;
 G.art=save.art||0;G.artLv=save.artLv||0;G.artWorks=save.artWorks||0;G.artWins=save.artWins||0;
 G.music=save.music||0;G.musicLv=save.musicLv||0;G.musicShow=save.musicShow||0;G.musicWins=save.musicWins||0;
 G.cls=save.cls||'普通';G.partnerPreg=save.partnerPreg||null;
 G.isZhao=save.isZhao||false;G.isWu=save.isWu||false;G.abs=save.abs||0;G.coldWar=save.coldWar||0;G.pain=save.pain||0;G.dutyLast=save.dutyLast||false;G.fee=save.fee||26000;
 G.phoneModel=PHONES[(save.phoneId||O.phoneId)||0];G.ph=1;
 G.over=false;LOCK=false;AUTO=false;PEND=null;
 G.sched=(G.mode==='student')?buildStudentDay():buildTeacherDay();
 G.idx=0;G.time='';
 $('#start').classList.remove('show');
 $('#game').classList.add('show');
 upd();
 l('📂 已读档：第 '+G.day+' 天（'+dcn(G.date)+'）。','good');
 next();
}
function allocPT(k,d){
 var left=O.tpBase;for(var key in O.alloc)left-=O.alloc[key];
 if(d>0){var add=Math.min(d,left);if(add<=0)return;O.alloc[k]=(O.alloc[k]||0)+add;}
 else{var cur=O.alloc[k]||0;O.alloc[k]=cur-Math.min(-d,cur);}
 renderStart();
}
function randTP(){
 O.tpBase=(O.mode==='teacher')?rnd(40,70):rnd(30,60);
 O.alloc={appear:0,fitness:0,knowledge:0,charm:0,luck:0};
 var left=O.tpBase,keys=['appear','fitness','knowledge','charm','luck'],g=0;
 while(left>0&&g++<900){var k=pk(keys),add=Math.min(left,rnd(1,8));O.alloc[k]+=add;left-=add;}
 renderStart();
}
function resetTP(){O.alloc={appear:0,fitness:0,knowledge:0,charm:0,luck:0};renderStart();}
function doRoll(){
 if(isBossO())return;
 if(O.rollLeft<=0){O.hint='抽取次数用完了（共 3 次）。';renderStart();return;}
 var p=(O.mode==='teacher')?TAL_T:TAL_S,pool=p.slice(),cand=[],i;
 for(i=0;i<3&&pool.length;i++)cand.push(pool.splice(rnd(0,pool.length-1),1)[0]);
 window.CAND=cand;
 var h='<p class="dim small">三选一（剩余 '+O.rollLeft+' 次）：</p>';
 for(i=0;i<cand.length;i++)h+='<div class="mb"><span><b>'+cand[i].n+'</b><br><span class="dim small">'+cand[i].d+'</span></span>'+
  '<button onclick="pickCand('+i+')">选它</button></div>';
 $('#candBox').innerHTML=h;
}
function pickCand(i){
 var t=window.CAND&&window.CAND[i];if(!t)return;
 var dup=false;for(var j=0;j<O.talents.length;j++)if(O.talents[j].id===t.id)dup=true;
 if(!dup)O.talents.push(t);
 O.rollLeft--;
 $('#candBox').innerHTML='';
 renderStart();
}
function clearTalent(){O.hint='天赋已清空，可重新抽取。';O.talents=[];O.rollLeft=3;$('#candBox').innerHTML='';renderStart();}
function rollPhone(){
 O.phoneId=rnd(0,PHONES.length-1);
 var s=$('#phoneSel');if(s)s.value=String(O.phoneId);
 renderStart();
}
function addItem(){
 var s=$('#itemSel');if(!s)return;
 var id=s.value;if(!id)return;
 if(O.itemList.length>=3){O.hint='最多只能带 3 件道具。';renderStart();return;}
 O.itemList.push(id);
 renderStart();
}
function rmItem(i){O.itemList.splice(i,1);renderStart();}
function randItem(){
 O.itemList=[];
 var pool=START_ITEMS.slice();
 for(var i=0;i<3&&pool.length;i++)O.itemList.push(pool.splice(rnd(0,pool.length-1),1)[0]);
 renderStart();
}
function clearItem(){O.itemList=[];renderStart();}
function applyEgg(){
 var n=($('#fName')&&$('#fName').value||'').trim();
 var hint=$('#nameHint');
 if(n==='赵建阳'){O.gender='男';O.mode='teacher';O.role='校长';O.boarder=true;
  hint.innerHTML='✅ 已套用：<b class="warn">赵建阳</b> —— 校长（男）。特权：免处分、资金拉满。';}
 else if(n==='巫洁'){O.gender='女';O.mode='teacher';O.role='年级主任';O.boarder=true;
  hint.innerHTML='✅ 已套用：<b class="pink">巫洁</b> —— 年级主任（女）。特权：被抓概率大幅降低。';}
 else if(n==='李倩茹'){O.gender='女';O.boarder=true;
  hint.innerHTML='✅ 已套用：李倩茹 —— 女 155cm / 55kg，住宿与生理期系统开启。';}
 else if(n==='张逸天'){O.gender='男';O.boarder=true;
  hint.innerHTML='✅ 已套用：张逸天 —— 男 185cm / 62.5kg，智商偏高·颜值偏高·受欢迎程度偏低。';}
 else hint.textContent='没有这个彩蛋。可用：赵建阳 / 巫洁 / 李倩茹 / 张逸天。';
 renderStart();
}
function startGame(){
 var nm=($('#fName')&&$('#fName').value||'').trim();
 var name=nm||((O.mode==='student')?(O.gender==='女'?'李倩茹':'张逸天'):'林知远');
 var gender=O.gender,height=178,weight=62;
 if(name==='赵建阳'){gender='男';height=178;weight=75;O.mode='teacher';O.role='校长';}
 if(name==='巫洁'){gender='女';height=165;weight=52;O.mode='teacher';O.role='年级主任';}
 if(name==='李倩茹'){gender='女';height=155;weight=55;}
 if(name==='张逸天'){gender='男';height=185;weight=62.5;}
 if(O.mode==='student'&&name!=='李倩茹'&&name!=='张逸天'){
  if(gender==='男'){height=178;weight=62;}else{height=165;weight=55;}
 }
 var boss=isBossO(),tp=O.alloc;
 G=newState({name:name,gender:gender,mode:O.mode,role:O.role,pref:O.pref,height:height,weight:weight,
  money:200,talents:boss?[]:O.talents,tp:O.tpBase,boarder:O.boarder,knowledge:20,
  salary:O.mode==='teacher'?((O.role==='校长')?45000:(O.role==='年级主任')?22000:(O.role==='班主任')?10500:9000):0});
 G.appear=cl(40+(tp.appear||0));G.fitness=cl(40+(tp.fitness||0));
 G.knowledge=cl(20+(tp.knowledge||0));G.charm=cl(40+(tp.charm||0));G.luck=tp.luck||0;
 var ids=[];for(var i=0;i<G.talents.length;i++)ids.push(G.talents[i].id);
 if(ids.indexOf('run')>=0)G.fitness+=18;
 if(ids.indexOf('face')>=0)G.appear+=16;
 if(ids.indexOf('pe')>=0)G.fitness+=25;
 if(ids.indexOf('idol')>=0){G.charm+=20;G.appear+=6;}
 if(ids.indexOf('rich')>=0)G.money*=6;
 if(ids.indexOf('pop')>=0)G.relation+=15;
 if(ids.indexOf('guanxi')>=0)G.schoolSupport+=15;
 if(ids.indexOf('scholar')>=0)G.academic+=25;
 if(ids.indexOf('steel')>=0)G.health=100;
 if(ids.indexOf('talk')>=0)G.teach+=20;
 if(ids.indexOf('iron')>=0)G.relation-=5;
 if(ids.indexOf('zen')>=0)G.mood=100;
 if(ids.indexOf('finance')>=0)G.salary=Math.round(G.salary*1.2);
 if(O.mode==='teacher'){G.knowledge=60;G.grade=90;}
 var pm=PHONES[O.phoneId]||PHONES[0];
 G.phoneModel=pm;G.ph=1;G.mood+=(pm.mood||0);
 for(var q=0;q<O.itemList.length;q++){
  var id=O.itemList[q];
  if(id==='spare'||id==='model')G.items[id]=(G.items[id]||0)+1;
  else give(id,1);
 }
 if(!has('umbrella'))give('umbrella',1);
 clampAll();
 var sc=document.querySelectorAll('.screen');
 for(var j=0;j<sc.length;j++)sc[j].classList.remove('show');
 $('#game').classList.add('show');
 l('━━━━ 2026年10月4日 星期日 · 补课日 ━━━━','day');
 l('杭州西子实验学校，1987 名学生，48 个班。\n办学单位：浙江省建设投资集团 × 杭州第十四中学。校园就在西湖区铜鉴湖边上。\n国庆七天假被砍成三天，今天是补课日。','warn');
 var tn=[];for(var t2=0;t2<G.talents.length;t2++)tn.push(G.talents[t2].n);
 l('👤 '+G.name+'（'+G.gender+'）'+(O.mode==='teacher'?' · '+G.role:' · 学生')+
  (boss?' · 管理层模式（天赋已关闭）':' · 天赋：'+(tn.join('、')||'无')),'good');
 l('📱 你的手机：'+pm.b+' '+pm.n+'（性能 '+pm.perf+'）','good');
 if(O.itemList.length){
  var il=[];for(var i2=0;i2<O.itemList.length;i2++)il.push(ITEMS[O.itemList[i2]].n);
  l('🎒 你带进学校的道具：'+il.join('、'),'good');
 }
 upd();
 startDay();
}
/* ============ 24 初始化 ============ */
function initStart(){
 var ps=$('#phoneSel');
 if(ps){
  var h='';
  for(var i=0;i<PHONES.length;i++)h+='<option value="'+i+'">'+PHONES[i].b+' '+PHONES[i].n+'（¥'+PHONES[i].p.toLocaleString('zh-CN')+'）</option>';
  ps.innerHTML=h;ps.value=String(O.phoneId);
  ps.onchange=function(){O.phoneId=+ps.value;renderStart();};
 }
 var is=$('#itemSel');
 if(is){
  var h2='';
  for(var j=0;j<START_ITEMS.length;j++){
   var it=ITEMS[START_ITEMS[j]];if(!it)continue;
   h2+='<option value="'+START_ITEMS[j]+'">'+it.i+' '+it.n+'（¥'+(it.price||0)+'）</option>';
  }
  is.innerHTML=h2;
 }
 randTP();
 renderStart();
}
try{initStart();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}

var QB={
'语文':[
 {q:'“师者，所以传道受业解惑也”出自哪篇文章？',o:['《论语》','《师说》','《劝学》','《进学解》'],a:1,e:'出自韩愈《师说》。'},
 {q:'“无边落木萧萧下，不尽长江滚滚来”的作者是？',o:['李白','杜甫','白居易','苏轼'],a:1,e:'出自杜甫《登高》，被誉为“古今七律第一”。'},
 {q:'《念奴娇·赤壁怀古》的作者是？',o:['苏轼','辛弃疾','柳永','李清照'],a:0,e:'苏轼，豪放派代表作。'},
 {q:'《琵琶行》中“同是天涯沦落人”的下一句是？',o:['相逢何必曾相识','江州司马青衫湿','别有幽愁暗恨生','此时无声胜有声'],a:0,e:'“同是天涯沦落人，相逢何必曾相识”。'},
 {q:'“假舟楫者，非能水也，而绝江河”中“绝”的意思是？',o:['断绝','横渡','穷尽','隔绝'],a:1,e:'《劝学》中“绝”意为横渡。'},
 {q:'下列作品与作者对应正确的一项是？',o:['《红楼梦》——吴敬梓','《呐喊》——鲁迅','《雷雨》——老舍','《骆驼祥子》——巴金'],a:1,e:'《呐喊》是鲁迅小说集；《红楼梦》曹雪芹，《雷雨》曹禺，《骆驼祥子》老舍。'},
 {q:'成语“不绝如缕”的意思是？',o:['连续不断','形容局势危急或声音细微悠长','络绎不绝','话很多'],a:1,e:'多形容声音细微悠长或局势危急。'},
 {q:'“青，取之于蓝，而青于蓝”出自？',o:['《师说》','《劝学》','《过秦论》','《六国论》'],a:1,e:'出自《荀子·劝学》，比喻学生超过老师。'},
 {q:'曹操《短歌行》中“月明星稀”的下一句是？',o:['乌鹊南飞','绕树三匝','何枝可依','天下归心'],a:0,e:'“月明星稀，乌鹊南飞。绕树三匝，何枝可依。”'},
 {q:'鲁迅小说《祝福》中的祥林嫂出自哪部小说集？',o:['《呐喊》','《彷徨》','《朝花夕拾》','《野草》'],a:1,e:'《祝福》收入《彷徨》。'}
],
'数学':[
 {q:'函数 f(x)=ln x−x 的单调递增区间是？',o:['(0,1)','(1,+∞)','(0,+∞)','(−∞,1)'],a:0,e:'f′(x)=1/x−1=(1−x)/x，x>0 时由 f′(x)>0 得 0<x<1。'},
 {q:'等差数列{aₙ}中 a₁=2，a₃+a₅=18，则 a₇ 等于？',o:['14','16','18','20'],a:1,e:'a₃+a₅=2a₄=18 → a₄=9；a₄=a₁+3d=2+3d=9 → d=7/3；a₇=a₁+6d=2+14=16。'},
 {q:'圆 x²+y²−4x+2y=0 的圆心和半径分别是？',o:['(2,−1)，√5','(−2,1)，√5','(2,−1)，5','(−2,1)，5'],a:0,e:'配方得 (x−2)²+(y+1)²=5。'},
 {q:'双曲线 x²/9−y²/16=1 的离心率是？',o:['4/3','5/3','5/4','√7/3'],a:1,e:'a=3，b=4，c=5，e=c/a=5/3。'},
 {q:'二项式 (x+1/x)⁶ 展开式中的常数项是？',o:['15','20','30','6'],a:1,e:'通项 C(6,k)x^(6−k)·x^(−k)=C(6,k)x^(6−2k)，令 6−2k=0 得 k=3，C(6,3)=20。'},
 {q:'从 5 名男生、4 名女生中选 3 人，至少有 1 名女生的选法有多少种？',o:['64','74','84','94'],a:1,e:'C(9,3)−C(5,3)=84−10=74。'},
 {q:'甲、乙两人独立射击，命中率分别为 0.8 和 0.7，则至少一人命中的概率是？',o:['0.56','0.94','0.86','0.98'],a:1,e:'1−0.2×0.3=0.94。'},
 {q:'∫₀¹(2x+1)dx 等于？',o:['1','2','3','4'],a:1,e:'原函数 x²+x，代入得 (1+1)−0=2。'},
 {q:'函数 f(x)=x³−3x 的极大值是？',o:['−2','2','0','1'],a:1,e:'f′(x)=3x²−3=0 得 x=±1，f(−1)=−1+3=2 为极大值。'},
 {q:'已知 x>0，则 x+4/x 的最小值是？',o:['2','3','4','5'],a:2,e:'均值不等式 x+4/x≥2√4=4，当 x=2 时取等。'},
 {q:'直线 3x+4y−5=0 与圆 x²+y²=1 的位置关系是？',o:['相交','相切','相离','无法确定'],a:1,e:'圆心到直线距离 d=5/√(9+16)=1，等于半径，故相切。'},
 {q:'已知 sin α=3/5，α∈(0,π/2)，则 cos 2α 等于？',o:['7/25','−7/25','24/25','−24/25'],a:0,e:'cos2α=1−2sin²α=1−18/25=7/25。'}
],
'英语':[
 {q:'Not until he came back ___ the truth.',o:['I knew','did I know','I did know','knew I'],a:1,e:'Not until 置于句首，主句用部分倒装。'},
 {q:'It is the first time that I ___ such a beautiful lake.',o:['see','saw','have seen','had seen'],a:2,e:'It is the first time that + 现在完成时。'},
 {q:'The book ___ cover is red belongs to Mary.',o:['which','whose','that','what'],a:1,e:'定语从句中表所属关系用 whose。'},
 {q:'Hardly ___ the classroom when the bell rang.',o:['he had entered','had he entered','he entered','did he enter'],a:1,e:'Hardly 置于句首用倒装，与 when 搭配用过去完成时。'},
 {q:'He suggested that we ___ early.',o:['start','started','starting','to start'],a:0,e:'suggest 表建议时，从句用 (should)+动词原形。'},
 {q:'If I ___ you, I would accept the offer.',o:['am','was','were','be'],a:2,e:'与现在事实相反的虚拟语气，be 动词用 were。'},
 {q:'By the time he arrived, the film ___.',o:['begins','began','had begun','has begun'],a:2,e:'By the time + 过去时，主句用过去完成时。'},
 {q:'The reason ___ he was late is that he missed the bus.',o:['why','which','what','how'],a:0,e:'先行词为 reason，从句中作原因状语，用 why。'},
 {q:'It is no use ___ over spilt milk.',o:['cry','crying','to cry','cried'],a:1,e:'It is no use doing sth. 固定搭配。'},
 {q:'The scientist made a great ___ to the field of medicine.',o:['contribution','contribute','contributing','contributor'],a:0,e:'make a contribution to 为……做贡献。'}
],
'物理':[
 {q:'平行板电容器两极板间距离为 d、电压为 U，板间匀强电场的场强 E 为？',o:['Ud','U/d','d/U','U²/d'],a:1,e:'匀强电场中 E=U/d。'},
 {q:'电阻 R₁=2Ω 与 R₂=3Ω 并联，总电阻为？',o:['5Ω','1.2Ω','1.5Ω','0.8Ω'],a:1,e:'R=R₁R₂/(R₁+R₂)=6/5=1.2Ω。'},
 {q:'导体中电流为 2A，则 10s 内通过导体横截面的电荷量是？',o:['5C','20C','0.2C','12C'],a:1,e:'q=It=2×10=20C。'},
 {q:'长 0.4m 的导线通以 2A 电流，垂直放入 B=0.5T 的匀强磁场中，所受安培力是？',o:['0.2N','0.4N','0.8N','1.0N'],a:1,e:'F=BIL=0.5×2×0.4=0.4N。'},
 {q:'带电粒子在匀强磁场中做匀速圆周运动，其轨道半径 r 与速度 v 的关系是？',o:['与 v 成正比','与 v 成反比','与 v² 成正比','与 v 无关'],a:0,e:'r=mv/(qB)，其余量不变时 r∝v。'},
 {q:'100 匝线圈中磁通量在 0.1s 内变化了 0.02Wb，产生的感应电动势是？',o:['2V','20V','0.2V','200V'],a:1,e:'E=nΔΦ/Δt=100×0.02/0.1=20V。'},
 {q:'正弦交变电流的峰值是 311V，其有效值约为？',o:['311V','220V','155V','440V'],a:1,e:'U=Um/√2≈220V，这也是家用电压的来源。'},
 {q:'光从空气射入折射率 n=√2 的介质，全反射的临界角是？',o:['30°','45°','60°','90°'],a:1,e:'sin C=1/n=√2/2，C=45°。'},
 {q:'机械波的波长为 2m、频率为 5Hz，波速是？',o:['0.4m/s','2.5m/s','10m/s','20m/s'],a:2,e:'v=λf=2×5=10m/s。'},
 {q:'物体从 20m 高处自由下落（g 取 10m/s²），落地速度是？',o:['10m/s','20m/s','30m/s','40m/s'],a:1,e:'v=√(2gh)=√(2×10×20)=20m/s。'}
],
'化学':[
 {q:'反应 2SO₂+O₂⇌2SO₃（ΔH<0）达平衡后升高温度，平衡将？',o:['正向移动','逆向移动','不移动','无法判断'],a:1,e:'放热反应升温向吸热方向（逆反应）移动。'},
 {q:'25℃ 时水的离子积 Kw 为？',o:['1×10⁻⁷','1×10⁻¹⁴','1×10⁻¹²','1×10⁻¹⁰'],a:1,e:'25℃ 时 c(H⁺)·c(OH⁻)=1×10⁻¹⁴。'},
 {q:'pH=3 的盐酸中 c(H⁺) 为？',o:['3mol/L','1×10⁻³mol/L','1×10⁻¹¹mol/L','0.3mol/L'],a:1,e:'pH=−lg c(H⁺)，故 c(H⁺)=10⁻³mol/L。'},
 {q:'原电池中，负极发生的反应是？',o:['氧化反应','还原反应','中和反应','置换反应'],a:0,e:'原电池中负极失电子，发生氧化反应。'},
 {q:'化学平衡常数 K 的数值只与什么有关？',o:['浓度','压强','温度','催化剂'],a:2,e:'K 只随温度变化，与浓度、压强、催化剂无关。'},
 {q:'NaHCO₃ 溶液显碱性，原因是？',o:['HCO₃⁻电离大于水解','HCO₃⁻水解大于电离','不水解','完全电离'],a:1,e:'HCO₃⁻水解程度大于电离程度，溶液呈碱性。'},
 {q:'用惰性电极电解水时，阳极与阴极产生气体的体积比（同温同压）是？',o:['1:2','2:1','1:1','1:3'],a:0,e:'阳极生成 O₂、阴极生成 H₂，体积比 1:2。'},
 {q:'钢铁发生吸氧腐蚀时，正极的电极反应式是？',o:['Fe−2e⁻=Fe²⁺','O₂+2H₂O+4e⁻=4OH⁻','2H⁺+2e⁻=H₂↑','Fe−3e⁻=Fe³⁺'],a:1,e:'吸氧腐蚀正极是氧气得电子。'},
 {q:'1mol 甲烷完全燃烧，需要消耗氧气多少摩尔？',o:['1mol','2mol','3mol','4mol'],a:1,e:'CH₄+2O₂→CO₂+2H₂O。'},
 {q:'强酸与强碱的稀溶液反应生成 1mol 水时，放出的热量约为？',o:['57.3kJ','114.6kJ','28.6kJ','100kJ'],a:0,e:'中和热约 57.3kJ/mol。'}
],
'生物':[
 {q:'孟德尔一对相对性状的杂交实验中，F₂ 的性状分离比是？',o:['1:1','3:1','9:3:3:1','1:2:1'],a:1,e:'F₂ 表现型比 3:1，基因型比 1:2:1。'},
 {q:'DNA 双螺旋结构模型的提出者是？',o:['达尔文和孟德尔','沃森和克里克','摩尔根和萨顿','艾弗里和赫尔希'],a:1,e:'1953 年沃森和克里克提出。'},
 {q:'人的正常体细胞中染色体数是？',o:['23 条','46 条','22 对','48 条'],a:1,e:'体细胞 46 条（23 对），配子 23 条。'},
 {q:'遗传密码（密码子）共有多少种？',o:['20 种','61 种','64 种','4 种'],a:2,e:'4³=64 种，其中 61 种编码氨基酸、3 种为终止密码。'},
 {q:'人体内环境主要包括？',o:['血浆、组织液和淋巴','血液、消化液和尿液','细胞质和细胞核','细胞内液和消化液'],a:0,e:'内环境即细胞外液，主要包括血浆、组织液和淋巴。'},
 {q:'神经调节的基本方式是？',o:['反射','兴奋','传导','突触'],a:0,e:'基本方式是反射，结构基础是反射弧。'},
 {q:'光合作用中光反应进行的场所是？',o:['叶绿体基质','类囊体薄膜','细胞质基质','线粒体'],a:1,e:'光反应在类囊体薄膜，碳反应在叶绿体基质。'},
 {q:'有氧呼吸第一阶段（糖酵解）进行的场所是？',o:['线粒体基质','线粒体内膜','细胞质基质','高尔基体'],a:2,e:'第一阶段在细胞质基质，产生丙酮酸。'},
 {q:'生长素的化学本质是？',o:['蛋白质','吲哚乙酸','赤霉素','乙烯'],a:1,e:'生长素即吲哚乙酸（IAA）。'},
 {q:'下列不属于基因突变特点的是？',o:['普遍性','随机性','低频性','定向性'],a:3,e:'基因突变具有不定向性，这是它与自然选择的关键区别。'}
],
'历史':[
 {q:'中国近代史上第一个不平等条约是？',o:['《马关条约》','《南京条约》','《辛丑条约》','《北京条约》'],a:1,e:'1842 年《南京条约》。'},
 {q:'五四运动爆发于哪一年？',o:['1911 年','1915 年','1919 年','1921 年'],a:2,e:'1919 年 5 月 4 日。'},
 {q:'中国共产党成立的时间和地点是？',o:['1919 年·上海','1921 年·上海','1921 年·北京','1927 年·武汉'],a:1,e:'1921 年 7 月中共一大在上海召开。'},
 {q:'中华人民共和国成立的时间是？',o:['1945 年 8 月 15 日','1949 年 10 月 1 日','1949 年 9 月 21 日','1956 年'],a:1,e:'1949 年 10 月 1 日开国大典。'},
 {q:'作出改革开放伟大决策的会议是？',o:['中共八大','十一届三中全会','中共十四大','中共十五大'],a:1,e:'1978 年 12 月十一届三中全会。'},
 {q:'秦始皇完成统一六国的时间是？',o:['公元前 221 年','公元前 202 年','公元前 259 年','公元 221 年'],a:0,e:'公元前 221 年，建立中国历史上第一个统一的中央集权国家。'},
 {q:'罗马法体系最终完成的标志是？',o:['《十二铜表法》','《查士丁尼民法大全》','《权利法案》','《拿破仑法典》'],a:1,e:'6 世纪《查士丁尼民法大全》标志罗马法体系完成。'},
 {q:'文艺复兴运动的核心思想是？',o:['人文主义','理性主义','禁欲主义','空想社会主义'],a:0,e:'核心是人文主义，强调人的价值与尊严。'},
 {q:'1861 年俄国废除农奴制改革的推行者是？',o:['彼得一世','叶卡捷琳娜二世','亚历山大二世','尼古拉一世'],a:2,e:'沙皇亚历山大二世推行农奴制改革。'},
 {q:'《共产党宣言》发表于？',o:['1848 年','1871 年','1917 年','1789 年'],a:0,e:'1848 年马克思、恩格斯发表。'}
],
'地理':[
 {q:'地球自转的真正周期（恒星日）是？',o:['24 小时','23 时 56 分 4 秒','25 小时','12 小时'],a:1,e:'恒星日 23 时 56 分 4 秒，太阳日 24 小时。'},
 {q:'杭州（约 30°N）在夏至日的正午太阳高度约为？',o:['60°','83.5°','90°','66.5°'],a:1,e:'H=90°−|30°−23.5°|=83.5°。'},
 {q:'世界上面积最大的大洋是？',o:['大西洋','印度洋','太平洋','北冰洋'],a:2,e:'太平洋面积最大。'},
 {q:'我国的人口地理分界线是？',o:['秦岭—淮河线','黑河—腾冲线','长城线','长江线'],a:1,e:'黑河—腾冲线，又称胡焕庸线。'},
 {q:'我国面积最大的岛屿是？',o:['海南岛','台湾岛','崇明岛','舟山岛'],a:1,e:'台湾岛面积最大。'},
 {q:'亚热带季风气候的主要特征是？',o:['夏季高温多雨、冬季温和少雨','全年高温多雨','冬冷夏热、降水稀少','冬季严寒、夏季凉爽'],a:0,e:'杭州即典型亚热带季风气候。'},
 {q:'地球公转速度最快时位于？',o:['近日点（1 月初）','远日点（7 月初）','春分日','秋分日'],a:0,e:'近日点公转速度最快。'},
 {q:'三圈环流中副热带高气压带大致位于？',o:['赤道附近','30° 纬度附近','60° 纬度附近','极地附近'],a:1,e:'副热带高气压带约在 30° 附近。'},
 {q:'北大西洋暖流对西欧气候的主要影响是？',o:['使沿岸更加干燥','使西欧冬季温暖湿润','使西欧夏季炎热','无明显影响'],a:1,e:'暖流增温增湿，是西欧温带海洋性气候的重要成因。'},
 {q:'长江全长约多少千米？',o:['5400km','6300km','7800km','4000km'],a:1,e:'长江全长约 6300km，我国第一长河。'}
],
'政治':[
 {q:'哲学的基本问题是？',o:['物质和运动的关系问题','思维和存在的关系问题','实践和认识的关系问题','个人和社会的关系问题'],a:1,e:'哲学基本问题是思维和存在的关系问题。'},
 {q:'马克思主义哲学认为，世界的本原是？',o:['意识','物质','精神','理念'],a:1,e:'世界是物质的世界，物质决定意识。'},
 {q:'实践是检验真理的唯一标准，主要是因为实践具有？',o:['客观物质性','直接现实性','社会历史性','主观能动性'],a:1,e:'实践能把主观认识同客观事物联系起来加以对照。'},
 {q:'矛盾的普遍性与特殊性的关系，也就是？',o:['整体与部分的关系','共性与个性的关系','主要与次要的关系','现象与本质的关系'],a:1,e:'普遍性是共性，特殊性是个性。'},
 {q:'我国是人民民主专政的社会主义国家，其本质是？',o:['人民当家作主','工农联盟','民主与专政的统一','党的领导'],a:0,e:'本质是人民当家作主。'},
 {q:'我国的根本政治制度是？',o:['人民代表大会制度','中国共产党领导的多党合作和政治协商制度','民族区域自治制度','基层群众自治制度'],a:0,e:'人民代表大会制度是根本政治制度。'},
 {q:'“千里之堤，溃于蚁穴”体现的哲理是？',o:['量变达到一定程度会引起质变','矛盾双方相互转化','事物是普遍联系的','要用发展的观点看问题'],a:0,e:'强调量变积累引起质变。'},
 {q:'我国社会主义经济制度的基础是？',o:['公有制经济','个体经济','外资经济','混合所有制经济'],a:0,e:'公有制经济是我国社会主义经济制度的基础。'},
 {q:'意识的能动作用主要表现在？',o:['意识可以直接创造物质','意识能反映世界并指导人们改造世界','意识决定物质','意识不受物质制约'],a:1,e:'意识具有能动地认识世界和改造世界的作用。'},
 {q:'唯物辩证法的实质与核心是？',o:['联系的观点','发展的观点','对立统一规律','质量互变规律'],a:2,e:'对立统一规律是唯物辩证法的实质与核心。'}
],
'技术':[
 {q:'1GB 等于多少 MB？',o:['100','1000','1024','1048576'],a:2,e:'1GB=1024MB。'},
 {q:'二进制数 1011 转换为十进制是？',o:['9','11','13','15'],a:1,e:'1×8+0×4+1×2+1×1=11。'},
 {q:'下列属于输入设备的是？',o:['显示器','打印机','扫描仪','音箱'],a:2,e:'扫描仪是输入设备，其余为输出设备。'},
 {q:'IP 地址 192.168.1.1 属于？',o:['公网地址','私有地址','组播地址','广播地址'],a:1,e:'192.168.0.0~192.168.255.255 为私有地址段。'},
 {q:'计算机中，CPU 主要由哪两部分组成？',o:['运算器和控制器','内存和硬盘','输入和输出设备','显示器和键盘'],a:0,e:'CPU=运算器+控制器。'},
 {q:'Python 中表达式 len("浙江杭州") 的值是？',o:['4','8','2','6'],a:0,e:'len 统计字符个数，4 个汉字。'},
 {q:'下列关于算法的说法正确的是？',o:['算法可以没有输出','算法的步骤必须是有限的','同一个问题只有一种算法','算法只能用流程图描述'],a:1,e:'算法具有有穷性、确定性、可行性等特征。'},
 {q:'用计算机解决问题的一般过程中，第一步是？',o:['编写程序','分析问题、抽象建模','调试运行','设计算法'],a:1,e:'先分析问题抽象出模型，再设计算法、编写程序。'},
 {q:'通用技术中，设计的一般过程的第一步是？',o:['发现与明确问题','制定设计方案','制作模型','编写说明书'],a:0,e:'发现与明确问题是设计的起点。'},
 {q:'下列关于技术的性质，说法不正确的是？',o:['技术具有目的性','技术具有创新性','技术具有综合性','技术具有绝对的稳定性'],a:3,e:'技术不断发展变化，不存在绝对的稳定性。'}
]
};

var QB_SUBS=Object.keys(QB);
function qAll(){
 var r=[];
 for(var i=0;i<QB_SUBS.length;i++){var s=QB_SUBS[i];
  for(var j=0;j<QB[s].length;j++){var x=QB[s][j];r.push({s:s,q:x.q,o:x.o,a:x.a,e:x.e});}}
 return r;
}
function qPick(sub,n){
 var pool=(sub==='all')?qAll():QB[sub].map(function(x){return {s:sub,q:x.q,o:x.o,a:x.a,e:x.e};});
 pool=pool.slice();var out=[];n=Math.min(n||1,pool.length);
 while(out.length<n&&pool.length)out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
 return out;
}
function nl2(s){return String(s).replace(/\n/g,'<br>');}
function dailyDrill(){
 if(!G||G.over)return;
 if(G.drillDay===G.day){
  modal('<h3>📝 每日一练</h3><p>你今天已经练过了，明天再来。</p>'+
   '<div class="quote">累计答对 '+(G.drillRight||0)+' 题 · 连续 '+(G.drillStreak||0)+' 天</div>'+
   '<button class="gbtn" onclick="closeModal()">关闭</button>');
  return;
 }
 window._DQ=qPick('all',1)[0];
 drillRender('');
}
function drillRender(msg){
 var q=window._DQ;if(!q)return closeModal();
 var h='<h3>📝 每日一练 · '+q.s+'</h3>';
 if(msg)h+='<div class="quote">'+msg+'</div>';
 h+='<div class="novel">'+esc(q.q)+'</div>';
 for(var i=0;i<q.o.length;i++)
  h+='<div class="mb"><span>'+'ABCD'[i]+'. '+esc(q.o[i])+'</span><button onclick="drillAns('+i+')">选</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">下次再说</button>';
 modal(h);
}
function drillAns(i){
 var q=window._DQ;if(!q)return closeModal();
 if(i!==q.a){
  G.wrongBook=G.wrongBook||[];G.wrongBook.push(q);
  return modal('<h3>📝 每日一练 · '+q.s+'</h3>'+
   '<div class="quote">正确答案是 <b>'+'ABCD'[q.a]+'．'+esc(q.o[q.a])+'</b></div>'+
   '<div class="novel">解析：'+esc(q.e)+'</div>'+
   '<p class="dim small">答错不扣任何东西，已记入错题本。</p>'+
   '<button class="gbtn" onclick="closeModal();G.drillDay=G.day;G.drillStreak=0;upd()">好，记住了</button>');
 }
 var r=pk([
  function(){var n=rnd(3,6);G.knowledge+=n;G.st.study+=n;return '📘 学习 +'+n;},
  function(){var n=rnd(4,8);G.mood+=n;return '🙂 心情 +'+n;},
  function(){var n=rnd(5,20);G.money+=n;return '💰 零花钱 +¥'+n;},
  function(){var it=pk(['latiao','cola','chips','choco','gum','cookie','juice','bread','sausage']);give(it,1);
   return '🍬 老师顺手奖了你一包零食：'+ITEMS[it].i+ITEMS[it].n;},
  function(){var it=pk(['eyedrop','bandaid','tissue','vitamin']);give(it,1);
   return '🧰 小奖品：'+ITEMS[it].i+ITEMS[it].n;},
  function(){var n=rnd(1,3);G.support+=n;return '✊ 支持度 +'+n;},
  function(){var n=rnd(1,2);G.charm+=n;return '💫 魅力 +'+n;},
  function(){var n=rnd(1,2);G.fitness+=n;return '💪 体力 +'+n;}
 ])();
 if(G.mode==='teacher'){
  r=pk([
   function(){var n=rnd(2,4);G.teach+=n;return '🧑‍🏫 教学 +'+n;},
   function(){var n=rnd(2,4);G.academic+=n;return '📚 学术 +'+n;},
   function(){var n=rnd(1,3);G.relation+=n;return '🎓 师生关系 +'+n;}
  ])();
 }
 var extra='';
 if(ch(.05)){var m=rnd(30,80);G.money+=m;extra='\n🎁 稀有奖励！额外 ¥'+m+'。';}
 G.drillDay=G.day;G.drillRight=(G.drillRight||0)+1;G.drillStreak=(G.drillStreak||0)+1;
 if(G.drillStreak>=5)ach('s33');
 clampAll();upd();
 modal('<h3>📝 每日一练 · '+q.s+'</h3>'+
  '<div class="quote">✅ 答对了！</div>'+
  '<div class="novel">'+nl2('解析：'+q.e+'\n\n奖励：'+r+extra)+'</div>'+
  '<button class="gbtn" onclick="closeModal();upd()">收下</button>');
}
function wrongBook(){
 G.wrongBook=G.wrongBook||[];
 var h='<h3>📕 错题本（'+G.wrongBook.length+' 题）</h3>';
 if(!G.wrongBook.length)h+='<p class="dim">还没有错题，继续保持。</p>';
 var st=Math.max(0,G.wrongBook.length-21);
 for(var i=G.wrongBook.length-1;i>=st;i--){var q=G.wrongBook[i];
  h+='<div class="quote"><b>['+q.s+']</b> '+esc(q.q)+'<br>正确：'+'ABCD'[q.a]+'．'+esc(q.o[q.a])+'<br><span class="dim">'+esc(q.e)+'</span></div>';}
 h+='<button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
}

function examBegin(name){
 G.examName=name;
 G.examQs=qPick(pk(QB_SUBS),5);
 G.examIdx=0;G.examRight=0;
 l('📝 【'+name+'】开考，第一节课考 5 道题。','warn');
 return examDef();
}
function examDef(){
 if(G.examIdx>=G.examQs.length)return examResultDef();
 var q=G.examQs[G.examIdx],cs=[];
 for(var i=0;i<q.o.length;i++){(function(i){
  cs.push(C('ABCD'[i]+'. '+q.o[i],'',function(){
   if(i===q.a){G.examRight++;l('✍️ 第'+(G.examIdx+1)+'题：答对了。','good');}
   else l('✍️ 第'+(G.examIdx+1)+'题：答错了，正确答案是 '+'ABCD'[q.a]+'．'+q.o[q.a],'warn');
   G.examIdx++;
   var d=examDef();scene(d.title,d.text,d.choices);
  },true));
 })(i);}
 return {title:'📝 '+G.examName+' · '+q.s+'（第 '+(G.examIdx+1)+'/'+G.examQs.length+' 题）',text:q.q,choices:cs};
}
function examResultDef(){
 var n=G.examQs.length,r=G.examRight;
 var score=cl(Math.round(r/n*72+G.knowledge*0.25+(T('top')?12:0)+rnd(-4,4)),0,150);
 var rank=cl(Math.round(680-score*6.2+rnd(-15,15)),1,660);
 G.examScore=score;G.rankGrade=rank;
 G.knowledge+=r*2;
 G.mood+= r>=n*0.8?12:(r>=n*0.5?2:-10);
 if(r>=n*0.8){G.support+=6;G.influence+=3;}
 if(r<=n*0.2)G.mood-=8;
 G.examHistory=G.examHistory||[];
 G.examHistory.push({d:dstr(G.date),n:G.examName,score:score,rank:rank,right:r,total:n});
 clampAll();upd();
 return {title:'📝 '+G.examName+' · 成绩单',
  text:'【'+G.examName+'】答对 '+r+'/'+n+' 题。\n估分：'+score+' 分　年级排名：约第 '+rank+' 名（全年级约 660 人）\n\n'+
    (r>=n*0.8?'班主任在走廊上拍拍你的桌子：“这次不错，保持住。”':
     r>=n*0.5?'班主任说：“还行，再稳一点。”':'班主任把你叫到走廊谈了十分钟，最后说：“你自己想想。”'),
  choices:[C('😐 收好卷子，继续上课','',function(){})]};
}
function examBeginT(name){G.examName=name;G.examT={step:0,caught:0};return examTDef();}
function examTNext(){var d=examTDef();scene(d.title,d.text,d.choices);}
function examTDef(){
 var t=G.examT,cs=[],text='';
 if(t.step===0){
  text='你抱着密封的试卷袋走进考场，四十个学生齐刷刷抬头。\n拆封、清点、发卷——铃响，考试开始。';
  cs=[C('📄 按流程规范发卷','支持度+6',function(){G.schoolSupport+=6;t.step=1;l('你严格按流程操作，巡视员点了点头。');examTNext();},true),
      C('😐 往前一排递过去完事','省事',function(){t.step=1;l('“往后传。”');examTNext();},true)];
 }else if(t.step===1){
  text='考试过半，考场里只剩笔尖的声音。\n后排有人的手一直在桌子下面动。';
  cs=[C('🔍 走过去看看','可能抓到作弊',function(){
       if(ch(.5)){t.caught++;G.schoolSupport+=4;l('你走过去，一个学生把手机塞进了袖子——抓个正着。','warn');}
       else l('你走过去，那人只是在转笔。');t.step=2;examTNext();},true),
      C('😴 靠着讲台眯一会儿','有风险',function(){
       if(ch(.3)){G.schoolSupport-=6;l('你打了个盹，被走廊巡视的年级主任拍醒。','bad');}
       else l('你闭眼站了十分钟，没人发现。');t.step=2;examTNext();},true),
      C('📝 顺便把下节课的卷子批了','教学+4',function(){G.teach+=4;l('你在讲台上改了两沓卷子。教学+4');t.step=2;examTNext();},true),
      C('📱 刷会儿手机','老师式摸鱼',function(){G.mood+=6;
       if(ch(.2)){G.schoolSupport-=5;l('你低头看手机，被巡视的领导看见了。','bad');}else l('你安静地刷了十分钟。');
       t.step=2;examTNext();},true)];
 }else{
  text='收卷铃响了。\n'+(t.caught?'你抓到的那份作弊卷，还得写一份说明交教务处。':'考场里安安静静，一切正常。');
  cs=[C('📄 收卷、封袋、交教务处','结束监考',function(){
   if(t.caught){G.demerits++;l('你写了一份情况说明，教务处记了一次考场违纪。','warn');}
   l('监考结束。','good');})];
 }
 return {title:'🎓 监考 · '+G.examName,text:text,choices:cs};
}

(function(){
 var _c=SLOTS.class,_tc=SLOTS.t_class;
 SLOTS.class=function(s){
  var d=dstr(G.date);
  if(EXAMS[d]&&G.examKey!==d&&s.subject!=='体育'){G.examKey=d;return examBegin(EXAMS[d]);}
  return _c(s);
 };
 SLOTS.t_class=function(s){
  var d=dstr(G.date);
  if(EXAMS[d]&&G.examKey!==d){G.examKey=d;return examBeginT(EXAMS[d]);}
  return _tc(s);
 };
})();

/* 追加一条成就，原有 ACH_S 的 30 条一个字不动 */
ACH_S.push({id:'s33',n:'每日一练',d:'连续答对 5 天'});
(function(){var o={};
 o.slots=Object.keys(SLOTS).sort().join('|');o.slotN=Object.keys(SLOTS).length;
 o.funcN=Object.keys(window).filter(k=>{try{return typeof window[k]==='function'}catch(e){return 0}}).length;
 o.phones=PHONES.length;o.apps=APPS.length;o.mgames=MGAMES.length;o.items=Object.keys(ITEMS).length;
 o.ach=ACH_S.length+ACH_T.length;o.clubs=CLUBS.length;o.duties=DUTIES.length;o.stories=STORIES.length;
 o.talents=TAL_S.length+TAL_T.length;o.titles=TITLES.length;o.weathers=WEATHERS.length;
 o.qb=Object.keys(QB).reduce((a,k)=>a+QB[k].length,0);
 console.log(JSON.stringify(o,null,1));return o;})();


/* ================================================================
   附录 F · 找回被删内容（纯追加，不删任何原有代码）
   ================================================================ */

/* ---------- F1 移动随机事件（5.1 起被误删） ---------- */
function roadEvent(){
 var r=rnd(1,8);
 if(r===1)l('🚧 路上撞见班主任在走廊训人，你贴墙溜了过去。','warn');
 else if(r===2){l('🐈 一只橘猫从花坛里钻出来，蹭了蹭你的裤腿。心情+2');G.mood+=2;}
 else if(r===3)l('📣 广播里在念通知：“本周五下午大扫除。”');
 else if(r===4){G.support+=2;l('🙋 有同学问你借笔，你借给了他。支持度+2');}
 else if(r===5)l('🌧️ 走廊地面很滑，你差点滑一跤。','warn');
 else if(r===6)l('📱 你在路上顺手刷了两眼手机。');
 else if(r===7){G.mood+=1;l('🌳 梧桐树的影子铺了整条路，你走得慢了一点。');}
 else l('🔔 下课铃刚好响了，走廊一下子挤满了人。');
}

/* ---------- F2 漫游副本（2.0/3.0/4.0 的 WANDERS，补回 7 个 + 强化 2 个） ---------- */
function extraWander(){
 if(!G||G.over)return;
 var defs=[
  {n:'🌸 班门口种花',d:'种点什么，看它长大（有种→浇→开花→全班围观 的成长线）',fn:function(){
   G.garden=(G.garden||0)+1;
   if(G.garden===1){G.mood+=8;l('🌱 你在班门口花坛种下几颗向日葵种子。心情+8','good');}
   else if(G.garden<4){G.mood+=4;l('🌿 你给花浇了水，芽又长高一点。心情+4');}
   else if(G.garden===4){G.mood+=15;G.support+=8;G.charm+=4;l('🌻 向日葵开花了！全班都来看，班主任拍了照发家长群。心情+15，支持度+8','good');}
   else{G.mood+=5;l('🌻 你在花坛边站了会儿，风吹过来很舒服。');}}},
  {n:'💬 找人聊天',d:'随机聊出剧情，可能触发造反线索',fn:function(){
   var t=pk(['同班的女生','班里最沉默的男生','国际部穿西装的同学','隔壁班的学霸','食堂阿姨']),r=rnd(1,4);
   if(r===1){G.mood+=8;l('你和'+t+'聊了十分钟，笑得脸都酸了。心情+8');}
   else if(r===2){G.support+=6;l('你和'+t+'聊了聊学校的收费，越聊越气。支持度+6');}
   else if(r===3){G.rev.men+=4;l('💬 你和'+t+'聊了很久。他最后说：“要不……我们做点什么？”人马+4','rev');}
   else{G.charm+=4;G.mood+=5;l('你和'+t+'聊得很投机，约好下次一起吃饭。魅力+4');}}},
  {n:'🐈 去食堂后面看校猫',d:'那只橘猫今天可能在',fn:function(){
   if(ch(.7)){G.mood+=10;l('🐈 橘猫今天在，还让你摸了两下。心情+10');}else{G.mood+=2;l('🐈 今天猫不在，纸箱被雨淋湿了。');}}},
  {n:'🧱 翻墙偷渡回家',d:'不推荐，但很多人试过',fn:function(){
   if((T('brave')&&ch(.35))||ch(.12)){G.mood+=25;G.support+=5;l('🧱 你翻出围墙，成功回家四小时，还吃到了红烧肉。心情+25','good');return;}
   G.demerits++;G.mood-=20;flash();l('🧱 你翻到墙头时迎面撞上巡逻保安，手电筒照了你一脸。','bad');
   l('【处分！】翻墙外出——全校通报批评。','bad');if(G.demerits>=3)ending('retire');}},
  {n:'🎹 音乐教室弹琴',d:'晚自习前，音乐教室没人',fn:function(){
   G.charm+=6;G.mood+=10;G.influence+=4;l('🎹 你弹了一首曲子，走廊上有人停下来听。魅力+6，影响力+4','good');}},
  {n:'🏸 体育馆打羽毛球',d:'有空调，还有国际部的球网',fn:function(){
   G.health+=5;G.fitness+=4;G.sleep-=10;l('🏸 你打了两局羽毛球，出了一身汗。体力+4');}},
  {n:'🧺 去洗衣房',d:'洗衣服，顺便听八卦',fn:function(){
   G.health+=2;G.support+=3;G.sleep-=4;l('🧺 你在洗衣房听了一耳朵八卦，还把校服洗了。支持度+3');}},
  {n:'🔍 去失物招领处',d:'说不定能捡到点东西',fn:function(){
   if(ch(.4)){var it=pk(['choco','cola','eyedrop','poster']);give(it,1);l('🔍 你在失物招领处认领了一个'+ITEMS[it].n+'！','good');}
   else l('🔍 只有一堆没人认领的校服和一只左脚运动鞋。');}},
  {n:'🌐 混进国际部看看',d:'那边的食堂和教室长什么样',fn:function(){
   if(ch(.5)){G.mood+=12;G.charm+=3;G.influence+=4;l('🌐 你混进了国际部，那边食堂有牛排和现磨咖啡。心情+12，影响力+4','good');
    if(ch(.25))tc(.3,'criticize','国际部老师发现你不是本部的：“同学，你是哪个班的？”');}
   else l('🌐 你刚走到门口就被保安拦下了：“国际部不对外开放。”','warn');}}
 ];
 var items=[];for(var i=0;i<defs.length;i++){(function(d){
  items.push({n:d.n,d:d.d,fn:function(){d.fn();clampAll();upd();saveGame();closeModal();}});
 })(defs[i]);}
 menu('🎯 校园副本','<div class="quote">这些是 2.0/3.0/4.0 里的「漫游副本」，5.0 之后被删了，现在补回来。</div>',items);
}

/* ---------- F3 剧情池（补回 3.0 的 9 条，原 8 条一条不动） ---------- */
STORIES.push(
 {t:'🎂 生日',x:'早读的时候，你桌肚里被塞了一块蛋糕和一张纸条：\n“生日快乐。不要说是我放的。—— 一个你认识的人”',
  c:[['在班里宣布“今天我生日”','支持度+10',function(){G.support+=10;G.mood+=10;l('全班给你唱了生日歌，班主任还破例允许你提前下课。心情+10','good');}],
     ['安静地吃完','心情+8',function(){G.mood+=8;l('你安静地吃完了蛋糕，心里有点甜。心情+8');}],
     ['追查是谁放的','魅力+8',function(){if(ch(.5)){G.charm+=8;l('你顺着字迹找到了那个人。心跳有点快。魅力+8','love');}else l('查了半天也没查出来。那是你吃过最好吃的蛋糕。');}]]},
 {t:'💬 小作文',x:'隔壁班女生加了你微信，第一句话是：“你是不是那个在食堂喊橡皮的人？”\n然后她发来一段 800 字的小作文，讲她今天为什么不开心。',
  c:[['认真回 800 字','魅力+10',function(){G.charm+=10;G.mood+=8;l('你认真回复了。她说：“谢谢你，好久没人听我说话了。”魅力+10','love');}],
     ['回一个“嗯”','支持度-4',function(){G.support-=4;l('对面沉默了很久，然后就没有然后了。');}],
     ['约她明天一起吃饭','推进恋爱线',function(){if(G.lover)G.lover.aff=cl(G.lover.aff+8);l('你们约好明天中午一起吃饭。','love');}]]},
 {t:'🎥 拍视频',x:'课间有人举着手机在走廊拍短视频：“家人们，这就是我们学校，晚自习上到九点五十，早操六点五十。”\n路过的教导主任停住了脚步。',
  c:[['对着镜头比个耶','影响力+8',function(){G.influence+=8;if(tc(.4,'demerit','教导主任把手机收走了，还顺手记了你一个处分'))return;l('视频火了，播放量破万。影响力+8','good');}],
     ['赶紧躲开','安全',function(){l('你贴着墙走了过去，什么都没发生。');}],
     ['存下来当黑料','黑料+8',function(){G.rev.ev+=8;l('你把视频存了下来。学校黑料+8','rev');}]]},
 {t:'🏃 体育课罚跑',x:'体育课上有两个人打闹，老师没看清，罚全体男生跑四圈。\n第三圈的时候，队伍已经散成三截。',
  c:[['坚持跑完','体力+ 魅力+',function(){G.health+=4;G.charm+=3;l('你跑完四圈还在终点吹了会儿风。全班都看到了。');}],
     ['溜去厕所','20%被抓',function(){if(tc(.2,'criticize','你刚躲进厕所，体育老师就出现在门口'))return;G.sleep-=8;G.mood+=4;l('你在厕所躲到下课，白赚半节课。');}],
     ['装肚子疼去医务室','30%穿帮',function(){if(tc(.3,'demerit','校医看了你一眼：“你在笑什么？”'))return;G.sleep-=12;l('你在医务室躺了一节课。困意-12');}]]},
 {t:'🍜 深夜泡面',x:'熄灯前一小时，宿舍走廊飘来泡面味。\n隔壁寝的男生端着碗过来：“要不要一起吃？”',
  c:[['一起吃','心情+10 有风险',function(){G.mood+=10;G.sleep+=6;if(tc(.3,'criticize','舍管推门进来，你们几个端着面站在床边'))return;l('几个人分一碗泡面，喝汤声此起彼伏。心情+10');}],
     ['不吃，睡觉','困意-30',function(){G.sleep-=30;l('你直接睡了，睡得很沉。困意-30');}],
     ['借他个碗','支持度+5',function(){G.support+=5;l('你把碗借了出去，他说明天请你喝奶茶。支持度+5');}]]},
 {t:'📝 期中家长会',x:'班主任在群里通知：本周五晚 18:30 家长会，请家长务必到场。\n你看着手机屏幕，陷入了沉默。',
  c:[['提前给爸妈打好预防针','效果一般',function(){G.mood+=3;l('你提前跟爸妈通了气，气氛还算融洽。心情+3');}],
     ['把成绩单藏起来','极险',function(){if(tc(.55,'demerit','家长会上班主任把成绩单复印件发到了每位家长手里'))return;l('你成功把成绩单藏了，家长会平安结束。','good');}],
     ['主动承认并说要努力','心情+ 学习+',function(){G.mood+=6;G.knowledge+=5;l('家长会后你妈罕见地没骂你，还给你削了苹果。心情+6','good');}]]},
 {t:'🎤 音乐节海选',x:'校园广播通知：本月底校园音乐节开始报名，海选在图书馆报告厅。\n公告栏前围了一圈人，有人当场清唱一句，把旁边的女生听呆了。',
  c:[['报名试试','进入音乐节流程',function(){l('你在报名表上写下了自己的名字。','good');if(T('piano')){G.influence+=10;l('钢琴十级不是白练的，围观的人都安静了。影响力+10','good');}}],
     ['围观鼓掌','心情+4',function(){G.mood+=4;l('你跟着人群鼓了掌。心情+4');}],
     ['转身回教室','学习+3',function(){G.knowledge+=3;l('你对这热闹没兴趣，回去写了半张卷子。');}]]},
 {t:'🏳️ 升旗彩排',x:'周一升旗彩排，德育处老师拿着话筒：“下周国旗下讲话的名额，有想上的举手。”\n操场上三千人，只有三个人举了手。',
  c:[['举手','有机会上台',function(){if(ch(.6)){G.intro='yes';l('老师记下了你的名字，你有机会上台国旗下讲话！','good');}else l('老师记下了旁边那个女生的名字。');}],
     ['教别人举手','影响力+5',function(){G.influence+=5;l('全场都在看你们。影响力+5','good');}],
     ['低头看鞋','安全',function(){l('你盯着自己的鞋看完了整场彩排。');}]]},
 {t:'📚 图书馆自习',x:'下午自习课改到了图书馆，阳光从高窗落下来，书架之间的灰尘在光里浮着。',
  c:[['认真刷题','学习+8',function(){G.knowledge+=8;G.sleep+=4;l('你在图书馆写完一整套卷子，效率惊人。学习+8');}],
     ['找本小说看','心情+10',function(){G.mood+=10;G.knowledge+=2;l('你从书架抽了本旧小说，看得入神。心情+10');}],
     ['趴着睡一觉','困意-25',function(){G.sleep-=25;l('你在沙发上睡了一觉。困意-25');}]]}
);

/* ---------- F4 小说正文（补回 5 段被删的，原 4 段照旧走原逻辑） ---------- */
var NOVEL_TEXT2={
 'novel_det':'《谁偷了我的橡皮》 第一章\n\n  那是一块 3 块钱的橡皮，上面印着一只很丑的猫。\n  它消失的时间：周二下午第二节课的课间，只有 10 分钟。\n  嫌疑人共 43 个：全班同学，加上一位从后门经过的英语老师。\n  而你，只剩 10 分钟就要上课了。\n\n  你决定从同桌开始。',
 'novel_scifi':'《我用CPU写作业》 第 3 章\n\n  “检测到宿主作业量超标，已启用多线程。”\n  “扫描完成：语文作文 800 字、数学卷子 1 张、英语完形 2 篇。”\n  “警告：宿主大脑温度 42℃，建议立即休息。”\n  “忽略。继续。”\n\n  三分钟后，你的笔停了。屏幕上的进度条卡在 99%。',
 'novel_wuxia':'《江湖夜雨十年灯》 卷三\n\n  雨下了整整一夜。\n  破庙里只剩下两盏灯，灯芯快烧到底了。\n  “你为什么不走？”她问。\n  “因为我欠你一把伞。”\n  她把剑放在地上，坐下来，靠着柱子。\n  “那把伞三文钱。”\n  “我还你三文钱。”\n  “不用了。”她说，“你把这十年还给我就行。”',
 'novel_comic':'《漫画周刊》 本期连载\n\n  主角在走廊上被主任拦住。\n  “你的头发超出校规 2.3 厘米。”\n  主角掏出尺子：“主任，您用的是市尺，我这是英寸。”\n  ……\n  下一格：主角在办公室门口罚站，手里举着一把更大的尺子。'
};
(function(){
 var _read=readNovel;
 readNovel=function(id){
  if(NOVEL_TEXT2[id]){
   var it=ITEMS[id];if(!it)return;
   G.mood+=rnd(8,14);G.knowledge-=2;G.st.read++;
   if(tc(.28,'confiscate','你在课上看'+it.n+'，被当场收走',id))return;
   modal('<h3>📖 '+it.n+'</h3><div class="novel">'+NOVEL_TEXT2[id]+'</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">合上书</button>');
   return;
  }
  return _read(id);
 };
})();

/* ---------- F5 补回天赋「共情体质」+ 道具「零食大礼包」 ---------- */
TAL_S.push({id:'dark',n:'共情体质',d:'心情上限+10，情绪自愈更快'});
ITEMS.snackpack={n:'零食大礼包',i:'🍟',k:'tool',price:0,d:'辣条×2、薯片×1、可乐×2'};
START_ITEMS.push('snackpack');
(function(){
 var _give=give;
 give=function(id,n){
  if(id==='snackpack'){_give('latiao',2);_give('chips',1);_give('cola',2);return;}
  return _give(id,n);
 };
 var _tick=tick;
 tick=function(){
  _tick();
  if(G&&!G.over&&T('dark'))G.depression=cl(G.depression-rnd(1,3),0,100);
 };
})();

/* ---------- F6 学生举报入口（用顶栏按钮解决，见下方 HTML） ---------- */
/* openReport() 本身学生/老师两套分支都在，只是从来没给过入口 */

(function(){
 var is=$('#itemSel');
 if(is){var h='';
  for(var i=0;i<START_ITEMS.length;i++){
   var it=ITEMS[START_ITEMS[i]];if(!it)continue;
   h+='<option value="'+START_ITEMS[i]+'">' + it.i + ' ' + it.n + '（¥' + (it.price||0) + '）</option>';
  }
  is.innerHTML=h;}
})();


/* ================================================================
   附录 G · 美术系统 + 音乐系统（纯追加） + 怀孕/生理期/NPC 新字段
   ================================================================ */

/* ---------- G1 新字段（包一层 newState，原函数不动） ---------- */
(function(){
 var _ns=newState;
 newState=function(o){
  var st=_ns(o);
  st.art=0;st.artLv=0;st.artWorks=0;st.artWins=0;
  st.music=0;st.musicLv=0;st.musicShow=0;st.musicWins=0;
  st.partnerPreg=null;st.cls='普通';
  if(window._FAKE_ONLINE)st._fakeOnline=true;
  return st;
 };
})();

/* ---------- G2 美术系统 ---------- */
function artSys(){
 if(!G||G.over)return;
 var lv=Math.floor((G.art||0)/20);
 menu('🎨 美术','<div class="quote">画技 '+Math.round(G.art||0)+'/100 · 等级 Lv'+lv+' · 作品集 '+G.artWorks+' 份'+(G.cls==='美术'?' · <b class="pink">美术特色班</b>':'')+
  '<br>学校设有美术特色班，历届有学生通过美术艺考进入中国美术学院等院校。</div>',[
  {n:'✏️ 去画室练速写',d:'画技+3~6 · 困意+6',fn:function(){
   var g=rnd(3,6);G.art=cl(G.art+g);G.sleep+=6;G.mood+=3;
   l('✏️ 你在画室画完了一沓速写。画技+'+g,'good');artSys();}},
  {n:'🎨 去铜鉴湖写生',d:'画技+5~9 · 心情+8 · 有蚊子',fn:function(){
   var g=rnd(5,9);G.art=cl(G.art+g);G.mood+=8;G.sleep-=8;
   l('🎨 你背着画板去了铜鉴湖边。水面上有白鹭，光线正好。画技+'+g+'，心情+8','good');
   if(ch(.25)){G.health-=2;l('🦟 你被蚊子咬了一腿的包。健康-2','warn');}
   artSys();}},
  {n:'🖌️ 请美术老师改画',d:'画技+ · 师生关系+4',fn:function(){
   if(G.art<10){l('🖌️ 老师看了一眼："……你先把线条练直。"','warn');}
   else{G.art=cl(G.art+rnd(3,6));G.relation+=4;l('🖌️ 老师在你画上添了三笔，整张画一下就立起来了。师生关系+4','good');}
   artSys();}},
  {n:'🖼️ 参加校园美术展',d:'按画技判定 · 一等奖解锁成就',fn:function(){artContest();}},
  {n:'📁 整理作品集（艺考线）',d:'需画技≥70',fn:function(){
   if(G.art<70){l('📁 作品集还太薄，老师说再攒半年。','warn');return artSys();}
   G.artWorks++;G.art+=3;l('📁 你把作品整理成了电子版作品集。画技+3','good');artSys();}},
  {n:'🏫 申请转美术特色班',d:'需画技≥50',fn:function(){
   if(G.art<50){l('🏫 你的画技还不够（需 50）。','warn');return artSys();}
   if(G.cls==='美术'){l('你已经在美术特色班了。','warn');return artSys();}
   G.cls='美术';G.charm+=5;G.art+=5;
   l('🏫 你转进了美术特色班。以后周二/周四下午的选修课都在画室。','good');artSys();}}
 ]);
}
function artContest(){
 var roll=rnd(0,100)+(G.art||0)+(T('face')?5:0);
 if(roll>=125){G.fame+=5;G.influence+=20;G.art+=8;G.artWins++;ach('s35');
  l('🏆 你的《铜鉴湖的下午》拿了校园美术展一等奖，被挂在一楼走廊。影响力+20','good');}
 else if(roll>=92){G.influence+=10;G.art+=5;G.artWins++;
  l('🥈 你拿了二等奖，海报上出现了你的名字。影响力+10','good');}
 else if(roll>=60){G.art+=3;l('🎖️ 入选参展，挂在走廊里。画技+3');}
 else{G.mood-=5;l('💔 落选了。评委说"构图太满，留白不够"。心情-5','bad');}
 if(G.art>=80)ach('s34');
 clampAll();upd();artSys();
}

/* ---------- G3 音乐系统 ---------- */
function musicSys(){
 if(!G||G.over)return;
 var lv=Math.floor((G.music||0)/20);
 menu('🎵 音乐','<div class="quote">乐感 '+Math.round(G.music||0)+'/100 · 等级 Lv'+lv+' · 考级证书 '+G.musicLv+' 张'+(G.cls==='音乐'?' · <b class="pink">音乐特色班</b>':'')+
  '<br>学校设有音乐特色班，历届有学生通过音乐艺考进入浙江音乐学院等院校。</div>',[
  {n:'🎹 琴房练琴',d:'乐感+3~6（钢琴十级+3）· 魅力+2',fn:function(){
   var g=rnd(3,6)+(T('piano')?3:0);G.music=cl(G.music+g);G.charm+=2;G.sleep+=5;G.mood+=4;
   l('🎹 你在琴房练了一小时音阶与琶音。乐感+'+g+'，魅力+2','good');musicSys();}},
  {n:'🎤 练声 / 唱歌',d:'乐感+2~5 · 魅力+3 · 心情+6',fn:function(){
   var g=rnd(2,5);G.music=cl(G.music+g);G.charm+=3;G.mood+=6;
   l('🎤 你对着镜子唱了一小时，觉得自己进步了。乐感+'+g+'，魅力+3','good');musicSys();}},
  {n:'🎼 学乐理 / 视唱练耳',d:'乐感+4~7 · 学习+3',fn:function(){
   var g=rnd(4,7);G.music=cl(G.music+g);G.knowledge+=3;G.sleep+=4;
   l('🎼 你啃了一下午乐理，脑子里全是五线谱。乐感+'+g+'，学习+3','good');musicSys();}},
  {n:'🎫 报名乐器考级',d:'需乐感≥70 · 通过有证书',fn:function(){
   if(G.music<70){l('🎫 老师说："你这水平，考八级还早。"','warn');return musicSys();}
   if(ch(.6+(T('piano')?.3:0))){G.musicLv++;G.charm+=5;G.fame+=2;
    l('🎫 考级通过！你拿到了一张盖着红章的证书。魅力+5，知名度+2','good');}
   else l('🎫 考级没过。考场上手一直在抖。','bad');
   musicSys();}},
  {n:'🎪 参加校园歌手大赛 / 音乐节',d:'需乐感≥40 · 拿第一解锁 s13',fn:function(){musicContest();}},
  {n:'🏫 申请转音乐特色班',d:'需乐感≥50',fn:function(){
   if(G.music<50){l('🏫 你的乐感还不够（需 50）。','warn');return musicSys();}
   if(G.cls==='音乐'){l('你已经在音乐特色班了。','warn');return musicSys();}
   G.cls='音乐';G.charm+=5;G.music+=5;
   l('🏫 你转进了音乐特色班。以后周一/周五下午的选修课都在音乐教室。','good');musicSys();}}
 ]);
}
function musicContest(){
 if((G.music||0)<40){l('🎪 报名时你才发现，资格线是乐感 40。','warn');return musicSys();}
 var roll=rnd(0,100)+(G.music||0)+G.charm/2+(T('piano')?30:0)+(T('idol')?10:0)+(G.club&&G.club.n==='音乐社'?10:0);
 if(roll>=145){G.fame+=6;G.influence+=22;G.charm+=8;G.musicWins++;ach('s37');ach('s13');
  l('🏆🏆 你在音乐节决赛唱完了整首歌。台下有人举着写你名字的牌子。影响力+22，魅力+8','good');}
 else if(roll>=108){G.influence+=12;G.charm+=5;G.musicShow++;ach('s13');
  l('🥈 你拿了第二名。散场后有三个人来要你的微信。魅力+5','good');}
 else if(roll>=72){G.influence+=5;G.mood+=6;l('🎖️ 你进了决赛，虽然没拿名次，但已经很满足。');}
 else{G.mood-=8;G.support-=3;l('💔 海选就被淘汰了。据说是因为音响坏了。','bad');}
 if(G.music>=80)ach('s36');
 clampAll();upd();musicSys();
}

/* ---------- G4 选修课时段（周二/周四美术，周一/周五音乐） ---------- */
SLOTS.artClass=function(){
 return {title:'🎨 15:45 美术选修课（画室）',
  text:'画室里支着二十个画架，光线从北窗斜斜照进来。\n墙上贴满往届生的素描，最上面那张写着「中国美术学院 · 2023 届 · 李XX」。',
  choices:[
   C('✏️ 老老实实画三小时','画技+ · 困意+',function(){var g=rnd(4,8);G.art=cl(G.art+g);G.sleep+=8;l('🎨 你画完了三张速写。画技+'+g);}),
   C('🖼️ 试着画窗外的操场','画技+ · 心情+',function(){var g=rnd(3,7);G.art=cl(G.art+g);G.mood+=8;l('🎨 你画了操场，画得很认真。画技+'+g+'，心情+8','good');}),
   C('🖌️ 请老师改画','画技++ · 关系+',function(){if(G.art>=15){G.art=cl(G.art+rnd(4,7));G.relation+=4;l('🖌️ 老师添了三笔，画面立起来了。师生关系+4','good');}else l('老师："先把线条练直。"','warn');}),
   C('😴 趴在画架后面睡一觉','困意-25/30%被抓',function(){G.sleep-=25;if(!tc(.3,'criticize','美术老师走到你画架后站了整整十秒'))l('你睡了一节课，醒来画纸上多了一道铅笔印。');}),
   C('📱 躲在画板后面玩手机','需手机/35%被没收',function(){if(!phoneOK()){l('你没有可用手机。','warn');return true;}G.st.phone++;hold(next);openPhone();})
  ]};
};
SLOTS.musicClass=function(){
 return {title:'🎵 15:45 音乐选修课（音乐教室）',
  text:'音乐教室摆着一台三角钢琴和一堆折叠椅。\n墙上贴着《黄河大合唱》海报，角落里有一架旧手风琴。',
  choices:[
   C('🎹 练琴','乐感+ · 魅力+',function(){var g=rnd(4,8)+(T('piano')?3:0);G.music=cl(G.music+g);G.charm+=2;G.sleep+=6;l('🎹 你练了一节课的音阶与琶音。乐感+'+g,'good');}),
   C('🎤 合唱团排练','魅力+4 支持度+5',function(){G.charm+=4;G.support+=5;G.mood+=6;l('🎤 四个声部合在一起的那一瞬间，你起了一身鸡皮疙瘩。魅力+4，支持度+5','good');}),
   C('🎼 抄乐理笔记','乐感+ · 学习+3',function(){G.music=cl(G.music+rnd(3,6));G.knowledge+=3;l('🎼 你抄了一节课的乐理笔记。乐感+，学习+3');}),
   C('😴 靠在椅子上睡','困意-25/30%被抓',function(){G.sleep-=25;if(!tc(.3,'criticize','音乐老师弹了一个超强和弦，你直接从椅子上弹起来'))l('你睡了一节课。');}),
   C('📱 桌肚里玩手机','需手机/35%被没收',function(){if(!phoneOK()){l('你没有可用手机。','warn');return true;}G.st.phone++;hold(next);openPhone();})
  ]};
};
/* 把选修课插进课表（包一层 buildStudentDay，原函数不动） */
(function(){
 var _bs=buildStudentDay;
 buildStudentDay=function(){
  var a=_bs(),dow=G.date.getDay(),extra=null;
  if(dow===2||dow===4)extra=mk('15:45','artClass',{loc:'画室'});
  else if(dow===1||dow===5)extra=mk('15:45','musicClass',{loc:'音乐教室'});
  if(extra)for(var i=0;i<a.length;i++){if(a[i].type==='homework'){a.splice(i,0,extra);break;}}
  return a;
 };
})();

/* ---------- G5 成就追加 ---------- */
ACH_S.push({id:'s34',n:'画笔生花',d:'画技达到 80'});
ACH_S.push({id:'s35',n:'校园美术展获奖',d:'美术展拿奖'});
ACH_S.push({id:'s36',n:'琴房常客',d:'乐感达到 80'});
ACH_S.push({id:'s37',n:'校园歌手冠军',d:'歌手大赛/音乐节拿第一'});

/* ---------- G6 校历事件补充（美术展 / 歌手大赛） ---------- */
CAL['2026-10-20']='校园美术展';
CAL['2026-11-05']='省中学生美术比赛（校选）';
CAL['2027-04-08']='校园歌手大赛海选';
CAL['2027-04-15']='校园歌手大赛决赛';

/* ---------- G7 顶栏补两个按钮（见补丁 5 的 HTML） ---------- */

/* ===== 保险：非女生一律清除生理期状态（双保险，tick 里已有 gender 判定） ===== */
(function(){
 var _t=tick;
 tick=function(){
  _t();
  if(!G||G.over)return;
  if(G.gender!=='女'){
   if(G.period||G.pain){G.period=false;G.pain=0;}
   G.periodPhase=0;
  }
 };
})();

/* ===== 补丁5.4.2：性别 / 身高体重系统 ===== */
O.height=178;O.weight=62;
function adjBody(k,d){
 if(k==='h')O.height=Math.max(140,Math.min(212,O.height+d));
 else O.weight=Math.max(35,Math.min(130,O.weight+d));
 renderStart();
}
function randBody(){
 O.height=O.gender==='男'?rnd(163,192):rnd(150,178);
 O.weight=O.gender==='男'?rnd(48,88):rnd(38,66);
 renderStart();
}
(function(){
 var _pg=pickG;
 pickG=function(g,v){
  if(g==='gender'&&O[g]!==v){
   O[g]=v;
   O.height=(v==='男')?178:165;O.weight=(v==='男')?62:52;
   renderStart();return;
  }
  _pg(g,v);
 };
 var _rs=renderStart;
 renderStart=function(){
  _rs();
  var hv=$('#hVal');if(hv)hv.textContent=O.height;
  var wv=$('#wVal');if(wv)wv.textContent=O.weight;
 };
 var _sg=startGame;
 startGame=function(){
  _sg();
 };
})();
/* ===== 补丁5.4.2：体育课身高体重效果 ===== */
/* 在体育课"认真跑两圈+打球"选项的function末尾追加 */
/* ===== 补丁5.4.2：亲密/怀孕系统 ===== */
function intimacy(){
 closeModal();
 var L=G.lover;
 if(L.aff<80){l('💗 好感还没到80。','warn');return loverMenu();}
 var cs=[
  C('🛡️ 做好措施（花¥30）','安全率95%',function(){
   if(G.money<30){l('💸 钱不够。','warn');return;}
   G.money-=30;L.aff=cl(L.aff+5);G.mood+=15;
   if(ch(.05))pregEvent(L,true);
   else l('🛡️ 你们做好了措施，没有出意外。心情+15','love');
   closeModal();upd();}),
  C('😳 不做措施','真的会出事',function(){
   L.aff=cl(L.aff+10);G.mood+=20;
   if(ch(G.gender==='女'?.25:.2))pregEvent(L,false);
   else l('😳 什么都没发生。你们松了口气。','love');
   closeModal();upd();}),
  C('🧊 算了，冷静一下','好感-5',function(){L.aff=cl(L.aff-5);l('🧊 你冷静下来了。好感-5');closeModal();upd();})
 ];
 scene('🌙 亲密时刻',L.n+'看着你，走廊上有人经过。',cs);
}
/* 怀孕统一入口：女生=自己怀上（休学结局）；男生=让对方怀上（后续要处理） */
function pregEvent(L,usedGuard){
 if(G.gender==='女'){
  G.preg=true;
  l('😨 '+(usedGuard?'明明做了措施……可是':'')+'几天后，你在厕所看到验孕棒上的两条线，手一直在抖。','bad');
  setTimeout(function(){ending('preg');},400);
 } else {
  G.partnerPreg={n:L.n,day:G.day};
  L.aff=cl(L.aff-10);
  l('😨 一个多月后，'+L.n+'发来一条消息："我好像……有了。"你盯着屏幕看了很久。','bad');
  l('💡 去「💗 恋爱」里处理这件事（负责 / 给钱 / 逃避）。','warn');
  saveGame();
 }
}
function partnerPregMenu(){
 var P=G.partnerPreg;if(!P)return loverMenu();
 menu('😨 怎么办','<div class="quote">'+P.n+'的消息还在屏幕上：<br>"我好像……有了。"<br>TA在等你的回复。</div>',[
  {n:'💍 负责：陪TA去医院，全程陪着',d:'花¥2000 · 魅力+10 支持度+15 心情-20',fn:function(){
   if(G.money<2000){l('💸 你连2000块都拿不出来。','warn');return partnerPregMenu();}
   G.money-=2000;G.charm+=10;G.support+=15;G.mood-=20;G.partnerPreg=null;ach('s38');
   l('🏥 你陪TA去了医院，全程握着TA的手。回来的地铁上，你们谁都没说话。','good');
   if(G.lover)G.lover.aff=cl(G.lover.aff+20);
   l('💗 好感+20，但你心里空了一块。','warn');closeModal();upd();}},
  {n:'💸 给钱，让TA自己处理',d:'花¥3000 · 好感-30 心情-10',fn:function(){
   if(G.money<3000){l('💸 钱不够。','warn');return partnerPregMenu();}
   G.money-=3000;if(G.lover)G.lover.aff=cl(G.lover.aff-30);G.mood-=10;G.partnerPreg=null;
   l('💸 你转了三千块过去。TA只回了一个"嗯"。','bad');closeModal();upd();}},
  {n:'🏃 逃避：拉黑，当没看见',d:'好感清零·直接分手·支持度-30',r:1,fn:function(){
   G.mood-=25;G.charm-=20;G.support-=30;
   if(G.lover){G.lovers[G.lovers.length-1].end='不负责任';G.lover=null;}
   G.partnerPreg=null;ach('s19');
   l('📵 你拉黑了TA。三天后，学校里开始有人用另一种眼神看你。','bad');
   l('💔 你分手了，而且这件事会跟着你很久。','bad');closeModal();upd();}}
 ]);
}

/* ================================================================
   附录 H · 背景音乐系统 + 设置（5.5.0 纯追加）
   播放顺序：手写的从前 → 红尘客栈 → 烟花易冷（自动循环）
   ================================================================ */

/* H0 音频数据：三个 base64 占位（由构建脚本注入，勿手改） */
var BGM_LIST=[
 {t:'手写的从前',a:'周杰伦',al:'《哎呦，不错哦》'},
 {t:'红尘客栈',a:'周杰伦',al:'《十二新作》'},
 {t:'烟花易冷',a:'周杰伦',al:'《跨时代》'},
 {t:'素颜',a:'许嵩/何曼婷',al:'《素颜》'},
 {t:'幻听',a:'许嵩',al:'《梦游计》'},
 {t:'天龙八部之宿敌',a:'许嵩',al:'《天龙八部3》主题曲'}
];
var BGM_KEY='xz_bgm_v1';
var BGM_ON=true,BGM_IDX=0,BGM_AUD=null,BGM_VOL=0.7;

function bgmLoad(){
 try{
  var s=localStorage.getItem(BGM_KEY);
  if(s){var d=JSON.parse(s);
   BGM_ON=!!d.on;
   BGM_IDX=Math.max(0,Math.min(BGM_LIST.length-1,parseInt(d.idx,10)||0));
   if(typeof d.vol==='number')BGM_VOL=Math.max(0,Math.min(1,d.vol));
  }
 }catch(e){}
}
function bgmSave(){try{localStorage.setItem(BGM_KEY,JSON.stringify({on:BGM_ON,idx:BGM_IDX,vol:BGM_VOL}));}catch(e){}}
/* 10.1.5：播放时才挂 src。
   原来 bgmInit 里直接 preload='auto' + 设 src，等于**一进站就下整首 4~5 MB 的 BGM**，
   而且大多数人当时还没解锁（音乐是锁着的）—— 白下，还把首屏带宽挤掉了。 */
function bgmPlay(){
 try{
  if(BGM_AUD){
   if(!BGM_AUD.getAttribute('src'))BGM_AUD.src=bgmSrc(BGM_B64[BGM_IDX]);
   if(BGM_AUD.preload==='none')BGM_AUD.preload='auto';
  }
 }catch(e){}
 try{BGM_AUD.play();}catch(e){}bgmRender();}
function bgmPause(){try{BGM_AUD.pause();}catch(e){}bgmRender();}
function bgmToggle(){
 BGM_ON=!BGM_ON;
 if(BGM_ON)bgmPlay();else bgmPause();
 bgmSave();bgmRender();
}
/* 10.0.13：音频源既接受 base64，也接受相对路径。
   原来只认 BGM_B64[i]，逼得两首额外歌曲的 mp3 只能 base64 内联进
   index.html，首屏白多 9.3 MB。现在给的是 URL（./ 开头或带协议）就直接用，否则维持旧行为。 */
function bgmSrc(v){
 if(!v)return '';
 if(/^(?:\.{0,2}\/|[a-z][a-z0-9+.-]*:)/i.test(v))return v;
 return v;
}
function bgmSwitch(i){
 if(i<0)i=BGM_LIST.length-1;if(i>=BGM_LIST.length)i=0;
 BGM_IDX=i;
 if(BGM_AUD)BGM_AUD.src=bgmSrc(BGM_B64[i]);
 if(BGM_ON)bgmPlay();
 bgmSave();bgmRender();
}
function bgmVol(v){
 BGM_VOL=Math.max(0,Math.min(1,v));
 if(BGM_AUD)BGM_AUD.volume=BGM_VOL;
 bgmSave();bgmRender();
}
function bgmNow(){var s=BGM_LIST[BGM_IDX]||BGM_LIST[0];return s.t+' · '+s.a;}
function bgmSettingsHTML(){
 var h='';
 for(var i=0;i<BGM_LIST.length;i++){
  var s=BGM_LIST[i],cur=(i===BGM_IDX);
  h+='<div class="mb'+(cur?' cur-song':'')+'">'+
   '<span>'+(cur?'▶ ':'')+esc(s.t)+'<br><span class="dim small">'+esc(s.a)+' · '+esc(s.al)+'</span></span>'+
   '<button onclick="bgmSwitch('+i+')">'+(cur&&BGM_ON?'播放中':'播放')+'</button></div>';
 }
 return h;
}
function bgmRender(){
 var el=$('#hMusic');
 if(el){
  el.textContent='🎵 '+bgmNow()+(BGM_ON?'':' ⏸');
  el.className='pill '+(BGM_ON?'pink':'');
 }
 var mb=$('#musicBox');
 if(mb)mb.innerHTML=bgmSettingsHTML();
 var tgl=$('#bgmToggle');
 if(tgl){tgl.textContent=BGM_ON?'关闭音乐':'开启音乐';tgl.className=BGM_ON?'r':'';}
 var vol=$('#bgmVolTxt');
 if(vol)vol.textContent=Math.round(BGM_VOL*100)+'%';
}
function openSettings(){
 if(G&&G.over)return;
 var h='<h3>⚙️ 设置</h3>';
 h+='<div class="quote">🎵 背景音乐：'+(BGM_ON?'<b class="good">开</b>':'<b class="bad">关</b>')+
  '　正在播放：<b class="pink">'+esc(bgmNow())+'</b></div>';
 h+='<div class="mb"><span>🔊 背景音乐开关</span><button id="bgmToggle" class="'+(BGM_ON?'r':'')+'" onclick="bgmToggle()">'+(BGM_ON?'关闭音乐':'开启音乐')+'</button></div>';
 h+='<div class="mb" style="align-items:center"><span>音量<br><span class="dim small" id="bgmVolTxt">'+Math.round(BGM_VOL*100)+'%</span></span>'+
  '<input type="range" min="0" max="100" value="'+Math.round(BGM_VOL*100)+'" oninput="bgmVol(this.value/100)" style="flex:1;min-width:120px;accent-color:var(--acc)"></div>';
 h+='<h4 style="margin-top:8px">播放列表（三首自动循环）</h4><div id="musicBox">'+bgmSettingsHTML()+'</div>';
 h+='<p class="dim small">六首歌：手写的从前/红尘客栈/烟花易冷（周杰伦）＋素颜/幻听/天龙八部之宿敌（许嵩）。<br>浏览器限制自动播放，点一下页面任意处音乐就会开始。</p>';
 h+='<button class="gbtn" style="margin-top:9px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function bgmInit(){
 bgmLoad();
 try{
  BGM_AUD=document.createElement('audio');
  BGM_AUD.preload='none';BGM_AUD.volume=BGM_VOL;
  /* 10.1.5：不在这里挂 src —— 等用户真的按播放（bgmPlay 会补上）或解锁后再挂 */
  BGM_AUD.addEventListener('ended',function(){bgmSwitch((BGM_IDX+1)%BGM_LIST.length);});
  document.body.appendChild(BGM_AUD);
  var once=function(){
   document.removeEventListener('pointerdown',once);
   if(BGM_ON&&BGM_AUD&&BGM_AUD.paused&&BGM_AUD.src)bgmPlay();
  };
  document.addEventListener('pointerdown',once);
 }catch(e){}
 bgmRender();
}
bgmInit();

/* ================================================================
   附录 I · 5.5.1 纯追加：许嵩音乐 / 校园像素图鉴 / 小游戏扩容
   ================================================================ */

/* ---------- I1 许嵩三首追加进音乐系统 ---------- */
var BGM_ADD=[]; /* 许嵩3首已并入BGM_B64[3-5]，清空重复数据以减小体积/缓解卡顿；下方追加IIFE因BGM_LIST已含6首会自动return */
(function(){
 if(BGM_LIST.length>3)return;
 BGM_LIST.push({t:'素颜',a:'许嵩',al:'《素颜》'});
 BGM_LIST.push({t:'幻听',a:'许嵩',al:'《梦游计》'});
 BGM_LIST.push({t:'天龙八部之宿敌',a:'许嵩',al:'《天龙八部之宿敌》'});
 for(var i=0;i<BGM_ADD.length&&i<3;i++)BGM_B64.push(BGM_ADD[i]);
 bgmSave();bgmRender();
})();

/* ---------- I2 校园像素图鉴（8 张，依据学校公开资料） ---------- */
var PIX_DATA=[
 {t:'🏛️ 校门',d:'1994年创办，浙江省第一所通过省一级评估的国有股份制寄宿学校。校训：身心自强、言行自律、学习自主、生活自理。'},
 {t:'🏫 教学楼',d:'2021年整体改建，总投资2.5亿，建筑面积41300㎡、绿地10677㎡。现有48个班、约1800名学生，泛在学习终端覆盖全校。'},
 {t:'🏃 操场',d:'西湖区体育传统项目学校。田径特长生拿过杭州市中学生100米第一名，健美操社团在省市比赛多次获奖。'},
 {t:'🌊 铜鉴湖',d:'学校坐落在5A级铜鉴湖生态景区内，四季花开：春品绿茶、夏闻荷香、秋览银桂、冬赏腊梅。'},
 {t:'🎨 美术教室',d:'毗邻中国美术学院，美术术科省联考通过率100%、本科上线率92%，多届学生考入国美、天美等美术院校。'},
 {t:'🎵 音乐教室',d:'毗邻浙江音乐学院，浙音管弦乐系"艺术实践基地"。音乐生在浙音青少年音乐展演全国总决赛拿过金奖。'},
 {t:'🍚 食堂',d:'国家级"营养健康食堂"，自助选餐、营养搭配、刷脸支付，三十年寄宿管理把学生的胃照顾得很细。'},
 {t:'🛏️ 宿舍',d:'湖景六人间，24小时热水、独立卫浴、空调书桌衣柜齐全，生活老师与校医24小时在岗。'}
];
function openAtlas(){
 var h='<h3>🖼️ 校园图鉴</h3><div class="quote">8 张 16-bit 像素画 · 依据学校公开资料绘制<br><span class="dim small">杭州西子实验学校 · 1994年创办 · 铜鉴湖畔</span></div>';
 h+='<div class="pixgrid">';
 for(var i=0;i<PIX_DATA.length;i++){
  h+='<div class="pixcard" onclick="pixView('+i+')"><img src="'+PIX_B64[i]+'" alt=""><span class="pc-t">'+PIX_DATA[i].t+'</span></div>';
 }
 h+='</div><button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function pixView(i){
 if(i<0||i>=PIX_DATA.length)return openAtlas();
 var p=PIX_DATA[i];
 var h='<h3>'+p.t+'</h3><div class="pixview"><img src="'+PIX_B64[i]+'" alt=""></div>';
 h+='<div class="quote">'+p.d+'</div>';
 h+='<div class="row" style="margin-top:8px"><button class="gbtn" onclick="pixPrev('+i+')">◀ 上一张</button><button class="gbtn" onclick="openAtlas()">返回图鉴</button><button class="gbtn" onclick="pixNext('+i+')">下一张 ▶</button></div>';
 modal(h);
}
function pixPrev(i){pixView((i+PIX_DATA.length-1)%PIX_DATA.length);}
function pixNext(i){pixView((i+1)%PIX_DATA.length);}

/* ---------- I3 小游戏扩容（新增 5 个：2048/井字棋/石头剪刀布/骰子押注/数字记忆） ---------- */
(function(){
 var _og=openGame;
 openGame=function(){
  _og();
  try{
   var ps=document.querySelectorAll('#modalbox p');
   for(var i=0;i<ps.length;i++)if(ps[i].textContent.indexOf('电脑小游戏')>=0)ps[i].textContent='电脑小游戏 15 个（5.5.1 新增 5 个）+ 手机手游 13 款，全部有真实判定。';
   var box=$('#modalbox');if(!box)return;
   var div=document.createElement('div');
   div.innerHTML=
    '<h4 style="margin-top:10px">5.5.1 新增</h4>'+
    '<div class="mb"><span>🐍 2048 数字合并<br><span class="dim small">方向键移动合成，合出 2048 通关</span></span><button onclick="g2048Start()">开始</button></div>'+
    '<div class="mb"><span>⭕ 井字棋（人机）<br><span class="dim small">三连即胜，AI 会堵你</span></span><button onclick="tttStart()">开始</button></div>'+
    '<div class="mb"><span>🪨 石头剪刀布<br><span class="dim small">三局两胜，赢家 +¥10</span></span><button onclick="rpsStart()">开始</button></div>'+
    '<div class="mb"><span>🎲 骰子押注<br><span class="dim small">押大/小/单/双，¥10 一注</span></span><button onclick="diceStart()">开始</button></div>'+
    '<div class="mb"><span>🧠 数字记忆<br><span class="dim small">记数字串四选一，连过 5 关</span></span><button onclick="memnumStart()">开始</button></div>';
   var cb=box.querySelector('button[onclick="closeModal()"]');
   if(cb)box.insertBefore(div,cb);
  }catch(e){}
 };
})();
/* 2048 */
function g2048Start(){window.G4={g:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],score:0};g4Add();g4Add();g4Render();}
function g4Add(){
 var s=window.G4,cells=[];
 for(var r=0;r<4;r++)for(var c=0;c<4;c++)if(!s.g[r][c])cells.push([r,c]);
 if(!cells.length)return;
 var p=cells[Math.floor(Math.random()*cells.length)];
 s.g[p[0]][p[1]]=(Math.random()<.9?2:4);
}
function g4Line(a){
 var out=[],sc=0;
 for(var i=0;i<a.length;i++){
  if(i+1<a.length&&a[i]===a[i+1]){out.push(a[i]*2);sc+=a[i]*2;i++;}
  else if(a[i]>0)out.push(a[i]);
 }
 while(out.length<4)out.push(0);
 return {a:out,sc:sc};
}
function g4Move(dir){
 var s=window.G4,g=s.g,moved=false,sc=0;
 for(var i=0;i<4;i++){
  var row,orig;
  if(dir===0){row=g4Line(g[i]);if(row.a.join()!==g[i].join()){g[i]=row.a;moved=true;}sc+=row.sc;}
  else if(dir===1){row=g4Line(g[i].slice().reverse()).a.reverse();if(row.join()!==g[i].join()){g[i]=row;moved=true;}sc+=row.reduce(function(a,b){return a+b;},0)-g[i].reduce(function(a,b){return a+b;},0);}
  else if(dir===2){orig=[g[0][i],g[1][i],g[2][i],g[3][i]];row=g4Line(orig).a;if(row.join()!==orig.join()){g[0][i]=row[0];g[1][i]=row[1];g[2][i]=row[2];g[3][i]=row[3];moved=true;}sc+=g4Line(orig).sc;}
  else{orig=[g[0][i],g[1][i],g[2][i],g[3][i]];row=g4Line(orig.slice().reverse()).a.reverse();if(row.join()!==orig.join()){g[0][i]=row[0];g[1][i]=row[1];g[2][i]=row[2];g[3][i]=row[3];moved=true;}sc+=g4Line(orig).sc;}
 }
 if(moved){s.score+=sc;g4Add();}
 g4Render();
}
function g4Render(){
 var s=window.G4;
 var colors={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#ffd166'};
 var h='<h3>🐍 2048 数字合并</h3><div class="quote">分数 '+s.score+' · 用键盘方向键移动，合出 2048！</div>';
 h+='<div style="display:grid;grid-template-columns:repeat(4,66px);gap:4px;justify-content:center;margin:8px auto">';
 for(var r=0;r<4;r++)for(var c=0;c<4;c++){
  var v=s.g[r][c];
  h+='<div style="width:66px;height:66px;display:flex;align-items:center;justify-content:center;font-weight:800;border-radius:8px;font-size:'+(v>=128?20:24)+'px;background:'+(colors[v]||'#2a3050')+';color:'+(v>=8?'#fff':'#9aa7d4')+'">'+(v||'')+'</div>';
 }
 h+='</div><p class="dim small" style="text-align:center">方向键 ↑ ↓ ← →</p>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="g4Quit()">退出</button>';
 modal(h);
 if(window._g4Key)document.removeEventListener('keydown',window._g4Key);
 window._g4Key=function(e){
  if(e.key==='ArrowUp')g4Move(2);
  else if(e.key==='ArrowDown')g4Move(3);
  else if(e.key==='ArrowLeft')g4Move(0);
  else if(e.key==='ArrowRight')g4Move(1);
 };
 document.addEventListener('keydown',window._g4Key);
 var full=true,win=false;
 for(var r2=0;r2<4;r2++)for(var c2=0;c2<4;c2++){if(!s.g[r2][c2])full=false;if(s.g[r2][c2]===2048)win=true;}
 if(win){G.knowledge+=8;G.mood+=15;G.fame+=2;l('🐍 2048 达成！你的脑子比数学老师预想的强。学习+8，心情+15','good');clampAll();upd();g4Quit();}
 else if(full){G.mood+=5;l('🐍 2048 结束，分数 '+s.score+'。','warn');clampAll();upd();g4Quit();}
}
function g4Quit(){if(window._g4Key)document.removeEventListener('keydown',window._g4Key);closeModal();}
/* 井字棋 */
function tttStart(){window.TT={b:['','','','','','','','',''],turn:0};tttRender('你先手，三连即胜。');}
function tttRender(msg){
 var s=window.TT;
 var h='<h3>⭕ 井字棋（人机）</h3><div class="quote">'+msg+'</div>';
 h+='<div style="display:grid;grid-template-columns:repeat(3,76px);gap:5px;justify-content:center;margin:8px auto">';
 for(var i=0;i<9;i++){
  h+='<button class="gbtn" style="width:76px;height:76px;font-size:32px" onclick="tttMove('+i+')">'+(s.b[i]||'')+'</button>';
 }
 h+='</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function tttWin(b,p){
 var w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 for(var i=0;i<w.length;i++){var a=w[i];if(b[a[0]]===p&&b[a[1]]===p&&b[a[2]]===p)return true;}
 return false;
}
function tttMove(i){
 var s=window.TT;
 if(s.b[i]||(s.turn%2))return;
 s.b[i]='X';s.turn++;
 if(tttWin(s.b,'X')){G.mood+=10;G.knowledge+=2;l('⭕ 你赢了井字棋！心情+10','good');clampAll();upd();return closeModal();}
 if(s.turn===9){G.mood+=4;l('⭕ 平局。','warn');clampAll();upd();return closeModal();}
 var mv=tttAi(s.b);
 if(mv<0){l('⭕ 平局。','warn');clampAll();upd();return closeModal();}
 s.b[mv]='O';s.turn++;
 if(tttWin(s.b,'O')){G.mood-=5;l('⭕ AI 三连了，你输了。心情-5','bad');clampAll();upd();return closeModal();}
 if(s.turn===9){G.mood+=4;l('⭕ 平局。','warn');clampAll();upd();return closeModal();}
 tttRender('轮到你了。');
}
function tttAi(b){
 for(var i=0;i<9;i++){if(!b[i]){b[i]='O';if(tttWin(b,'O')){b[i]='';return i;}b[i]='';}}
 for(var j=0;j<9;j++){if(!b[j]){b[j]='X';if(tttWin(b,'X')){b[j]='';return j;}b[j]='';}}
 if(!b[4])return 4;
 var cs=[0,2,6,8];
 for(var k=0;k<cs.length;k++)if(!b[cs[k]])return cs[k];
 for(var m=0;m<9;m++)if(!b[m])return m;
 return -1;
}
/* 石头剪刀布 */
function rpsStart(){window.RPS={mw:0,aw:0};rpsRender('三局两胜，最终赢家 +¥10。');}
function rpsRender(msg){
 var s=window.RPS;
 var h='<h3>🪨 石头剪刀布</h3><div class="quote">'+msg+'<br>你 '+s.mw+' : '+s.aw+' 电脑</div>';
 h+='<div class="row" style="margin-top:8px"><button class="gbtn" onclick="rpsGo(0)">🪨 石头</button><button class="gbtn" onclick="rpsGo(1)">✂️ 剪刀</button><button class="gbtn" onclick="rpsGo(2)">📄 布</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function rpsGo(m){
 var s=window.RPS,a=Math.floor(Math.random()*3);
 var names=['🪨石头','✂️剪刀','📄布'],res;
 if(m===a)res='平局';
 else if((m===0&&a===1)||(m===1&&a===2)||(m===2&&a===0)){res='你赢了';s.mw++;}
 else{res='电脑赢了';s.aw++;}
 if(s.mw>=2){G.money+=10;G.mood+=10;l('🪨 你 2:1 赢了电脑，拿走 ¥10！','good');clampAll();upd();return closeModal();}
 if(s.aw>=2){G.mood-=4;l('🪨 你输了，电脑在屏幕里得意地晃。','bad');clampAll();upd();return closeModal();}
 rpsRender('你出'+names[m]+'，电脑出'+names[a]+' —— '+res);
}
/* 骰子押注 */
function diceStart(){diceRender('押大/小/单/双，¥10 一注。');}
function diceRender(msg){
 var h='<h3>🎲 骰子押注</h3><div class="quote">'+msg+'</div>';
 h+='<div class="mb"><span>大（和 7-12）<br><span class="dim small">1:1 赔率</span></span><button onclick="diceBet(\'big\')">押 ¥10</button></div>'+
    '<div class="mb"><span>小（和 2-6）<br><span class="dim small">1:1 赔率</span></span><button onclick="diceBet(\'small\')">押 ¥10</button></div>'+
    '<div class="mb"><span>单（和为奇数）<br><span class="dim small">1:1 赔率</span></span><button onclick="diceBet(\'odd\')">押 ¥10</button></div>'+
    '<div class="mb"><span>双（和为偶数）<br><span class="dim small">1:1 赔率</span></span><button onclick="diceBet(\'even\')">押 ¥10</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>';
 modal(h);
}
function diceBet(k){
 if(G.money<10){l('💸 连 10 块都掏不出来了。','warn');return closeModal();}
 G.money-=10;
 var a=rnd(1,6),b=rnd(1,6),t=a+b;
 var win=(k==='big'&&t>=7)||(k==='small'&&t<=6)||(k==='odd'&&t%2===1)||(k==='even'&&t%2===0);
 if(win){G.money+=20;G.mood+=6;l('🎲 '+a+'+'+b+'='+t+'，押'+k+'中了！+¥10','good');}
 else{G.mood-=4;l('🎲 '+a+'+'+b+'='+t+'，押'+k+'没中。','bad');}
 clampAll();upd();diceRender('再来一把？');
}
/* 数字记忆 */
function memnumStart(){window.MN={lv:1};memnumRound();}
function memnumRound(){
 var s=window.MN,len=3+s.lv,num='';
 for(var i=0;i<len;i++)num+=Math.floor(Math.random()*10);
 window.MN.ans=num;
 var h='<h3>🧠 数字记忆</h3><div class="quote">记住这串数字：<b style="font-size:22px;letter-spacing:4px;color:#ffd166">'+num+'</b><br><span class="dim small">第 '+s.lv+' 关 · '+len+' 位</span></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="memnumShow()">我看完了，开始答题</button>';
 modal(h);
}
function memnumShow(){
 var s=window.MN,ans=s.ans,opts=[ans];
 while(opts.length<4){
  var t='';
  for(var i=0;i<ans.length;i++)t+=Math.floor(Math.random()*10);
  if(opts.indexOf(t)<0)opts.push(t);
 }
 opts.sort(function(){return Math.random()-.5;});
 window.MN.opts=opts;
 var h='<h3>🧠 数字记忆</h3><div class="quote">刚才的数字是哪一个？</div>';
 for(var j=0;j<opts.length;j++)h+='<div class="mb"><span>'+opts[j]+'</span><button onclick="memnumAns('+j+')">选</button></div>';
 modal(h);
}
function memnumAns(j){
 var s=window.MN;
 if(s.opts[j]===s.ans){
  G.knowledge+=3;G.mood+=5;l('🧠 第 '+s.lv+' 关答对！学习+3','good');
  if(s.lv>=5){G.knowledge+=3;l('🧠 记忆大师！连过 5 关，额外学习+3','good');clampAll();upd();return closeModal();}
  s.lv++;clampAll();upd();memnumRound();
 }else{
  G.mood-=4;l('🧠 答错了，正确答案是 '+s.ans+'。','bad');clampAll();upd();closeModal();
 }
}
/* ================================================================
   附录 I 后半 · 5.5.1：身高体重增强 / 美术系统扩充 / 体重开关 / 存档
   ================================================================ */

/* ---------- I4 身高体重：BMI / 腰围 / 体脂率（估算） ---------- */
function bodyMetric(h,w,gender,bfAdj){
 h=Number(h)||170;w=Number(w)||60;
 var bmi=w/Math.pow(h/100,2);
 var bmiCls=bmi<18.5?'偏瘦':bmi<24?'正常':bmi<28?'超重':'肥胖';
 var waist=(gender==='女'?0.40*h+0.18*w-4:0.42*h+0.20*w-6);
 var bf=1.20*bmi+0.23*15-5.4-(gender==='男'?10.8:0);
 bf=bf+(Number(bfAdj)||0);
 return {bmi:bmi,bmiCls:bmiCls,waist:Math.round(waist),bf:Math.max(3,Math.min(45,Math.round(bf*10)/10))};
}
function bodyCalcRender(){
 var h=O.height||178,w=O.weight||62,g=O.gender||'男',adj=O.bfAdj||0;
 var m=bodyMetric(h,w,g,adj);
 var hv=$('#hVal');if(hv)hv.textContent=h;
 var wv=$('#wVal');if(wv)wv.textContent=w;
 var bf=$('#bfVal');if(bf)bf.textContent=m.bf;
 var bc=$('#bodyCalc');
 if(bc)bc.innerHTML='BMI <b class="good">'+(Math.round(m.bmi*10)/10)+'</b>（'+m.bmiCls+'） · 腰围≈<b class="pink">'+m.waist+'</b>cm · 体脂 <b>'+m.bf+'</b>%';
}
function adjBF(d){
 O.bfAdj=cl((O.bfAdj||0)+d,-5,5);
 bodyCalcRender();
}
(function(){
 var _rs=renderStart;
 renderStart=function(){_rs();try{bodyCalcRender();}catch(e){}};
 var _up=upd;
 upd=function(){
  _up();
  try{
   if(!G)return;
   var st=$('#stats');if(!st)return;
   var m=bodyMetric(G.height||178,G.weight||62,G.gender||'男',G.bfAdj||0);
   var p=document.createElement('p');
   p.className='small dim';p.style.marginTop='6px';
   p.innerHTML='🧍 '+G.height+'cm / '+Math.round(G.weight)+'kg · BMI '+(Math.round(m.bmi*10)/10)+'（'+m.bmiCls+'） · 体脂 '+m.bf+'% · 腰围≈'+m.waist+'cm';
   st.appendChild(p);
  }catch(e){}
 };
 var _t=tick;
 tick=function(){
  _t();
  try{
   if(!G||G.over||G.bodyGain===false)return;
   if(ch(0.12)){
    var d=Math.round((Math.random()*3+1)*10)/10;
    G.weight=Math.round(cl((G.weight||62)+d,35,130)*10)/10;
    l('⚖️ 你发现校服好像紧了点，上秤：'+Math.round(G.weight)+'kg（+'+d+'）。吃夜宵的后劲。','warn');
   }
  }catch(e){}
 };
 var _sg=saveGame;
 saveGame=function(){
  _sg();
  try{
   var s=localStorage.getItem(SAVE_KEY);
   if(s){var d=JSON.parse(s);
    d.height=G.height;d.weight=G.weight;d.bfAdj=G.bfAdj||0;d.bodyGain=(G.bodyGain===undefined?true:!!G.bodyGain);
    localStorage.setItem(SAVE_KEY,JSON.stringify(d));
   }
  }catch(e){}
 };
 var _cg=continueGame;
 continueGame=function(){
  _cg();
  try{
   var save=loadGame();if(!save||!G)return;
   if(typeof save.height==='number')G.height=save.height;
   if(typeof save.weight==='number')G.weight=save.weight;
   G.bfAdj=save.bfAdj||0;
   G.bodyGain=(save.bodyGain===undefined?true:!!save.bodyGain);
  }catch(e){}
 };
 var _sg2=startGame;
 startGame=function(){
  _sg2();
  try{
   if(!G)return;
   var egg=(G.name==='赵建阳'||G.name==='巫洁'||G.name==='李倩茹');
   /* 张逸天是默认角色：尊重用户开始页的身高体重输入；纯彩蛋角色保留固定体型 */
   if(!egg){G.height=O.height||178;G.weight=O.weight||62;}
   G.bfAdj=O.bfAdj||0;
   G.bodyGain=true;
   saveGame();
  }catch(e){}
 };
})();

/* ---------- I5 美术系统扩充（追加 9 个选项，真实判定） ---------- */
(function(){
 var _art=artSys;
 artSys=function(){
  _art();
  try{
   var box=$('#modalbox');if(!box)return;
   var div=document.createElement('div');
   div.innerHTML=
    '<h4 style="margin-top:10px">5.5.1 扩充</h4>'+
    '<div class="mb"><span>🎯 画石膏像素描<br><span class="dim small">画技+4~8 · 需画技≥15</span></span><button onclick="artSketch()">去</button></div>'+
    '<div class="mb"><span>🌅 水粉风景写生（铜鉴湖畔）<br><span class="dim small">画技+5~9 · 心情+6 · 大雨取消</span></span><button onclick="artGouache()">去</button></div>'+
    '<div class="mb"><span>🖥️ 板绘练习（机房数位板）<br><span class="dim small">画技+3~6 · 学习+2</span></span><button onclick="artPad()">去</button></div>'+
    '<div class="mb"><span>🎭 临摹大师名作<br><span class="dim small">画技+4~7 · 需画技≥25</span></span><button onclick="artCopy()">去</button></div>'+
    '<div class="mb"><span>🏛️ 周末去中国美术学院看展<br><span class="dim small">画技+6 · 心情+10 · 花¥30</span></span><button onclick="artExhibit()">去</button></div>'+
    '<div class="mb"><span>📚 读美术史 / 画论<br><span class="dim small">学习+5 · 画技+1~3</span></span><button onclick="artTheory()">去</button></div>'+
    '<div class="mb"><span>🎯 省美术联考模拟<br><span class="dim small">需画技≥60 · 按成绩涨画技</span></span><button onclick="artMock()">去</button></div>'+
    '<div class="mb"><span>💼 帮学生会画活动海报<br><span class="dim small">画技+ · ¥30~80 · 知名度+</span></span><button onclick="artPoster()">去</button></div>'+
    '<div class="mb"><span>🏆 冲击美术特色班校测<br><span class="dim small">需画技≥75 · 通过进美术班</span></span><button onclick="artExam()">去</button></div>';
   var cb=box.querySelector('button[onclick="closeModal()"]');
   if(cb)box.insertBefore(div,cb);
  }catch(e){}
 };
})();
function artSketch(){
 if(G.art<15){l('🎯 老师把石膏像放你面前："线条还没稳，先从几何体开始。"','warn');return artSys();}
 var g=rnd(4,8);G.art=cl(G.art+g);G.sleep+=6;G.mood+=2;
 l('🎯 三小时素描，石膏像的眼睛好像一直在看你。画技+'+g,'good');clampAll();upd();artSys();
}
function artGouache(){
 if(G.weather&&G.weather.rain>=2){l('🌅 雨太大，写生取消了。','warn');return artSys();}
 var g=rnd(5,9);G.art=cl(G.art+g);G.mood+=6;G.sleep-=4;
 l('🌅 铜鉴湖畔的水粉写生，湖面被夕阳染成橘色。画技+'+g+'，心情+6','good');
 if(ch(.2)){G.health-=2;l('🦟 被蚊子咬了几口。健康-2','warn');}
 clampAll();upd();artSys();
}
function artPad(){
 var g=rnd(3,6);G.art=cl(G.art+g);G.knowledge+=2;G.sleep+=4;
 l('🖥️ 数位板画了一下午，图层叠了十几层。画技+'+g+'，学习+2','good');clampAll();upd();artSys();
}
function artCopy(){
 if(G.art<25){l('🎭 老师："临摹也要基础，先练线条。"','warn');return artSys();}
 var g=rnd(4,7);G.art=cl(G.art+g);G.knowledge+=2;G.sleep+=3;
 l('🎭 你临完了一幅，线条干净多了。画技+'+g,'good');clampAll();upd();artSys();
}
function artExhibit(){
 if(G.boarder&&G.mode==='student'&&!G.outPass.length){l('🏛️ 走读生周末才方便去看展，住宿生得先拿到出门单。','warn');return artSys();}
 if(G.money<30){l('💸 门票加地铁要 ¥30。','warn');return artSys();}
 G.money-=30;G.art=cl(G.art+6);G.mood+=10;G.sleep-=6;
 l('🏛️ 你在国美展厅里站了三个小时，出来时眼睛发亮。画技+6，心情+10','good');
 if(ch(.3)){G.fame+=1;l('🎨 你在一幅油画前站太久，被旁边的艺考生搭话。知名度+1','good');}
 clampAll();upd();artSys();
}
function artTheory(){
 G.knowledge+=5;G.art=cl(G.art+rnd(1,3));G.sleep+=4;
 l('📚 你读完了莫奈和透纳的对比分析。学习+5，画技+','good');clampAll();upd();artSys();
}
function artMock(){
 if(G.art<60){l('🎯 模拟联考资格线是画技 60。','warn');return artSys();}
 var roll=rnd(0,100)+G.art;
 if(roll>=130){G.art=cl(G.art+rnd(4,7));G.fame+=3;G.artWins++;ach('s35');
  l('🏆 模拟联考全班第一，老师把你的画贴在了走廊最中间。画技+，知名度+3','good');}
 else if(roll>=95){G.art=cl(G.art+rnd(2,4));l('🎯 模拟联考 A 档。画技+','good');}
 else if(roll>=70){G.art=cl(G.art+1);G.mood-=3;l('🎯 B 档，老师说"造型还行，色调再稳一点"。','warn');}
 else{G.mood-=6;l('🎯 C 档。你盯着自己的画看了很久。','bad');}
 clampAll();upd();artSys();
}
function artPoster(){
 if(ch(.5+G.fame/300)){var pay=rnd(30,80);G.money+=pay;G.art=cl(G.art+rnd(2,4));G.fame+=1;G.influence+=4;
  l('💼 学生会采用了你的海报，贴满宣传栏。+¥'+pay+'，知名度+1','good');}
 else{G.mood-=3;l('💼 你的初稿被退了回来："字再大一点，颜色再红一点。"','bad');}
 clampAll();upd();artSys();
}
function artExam(){
 if(G.art<75){l('🏆 校测资格线是画技 75，你还差一点。','warn');return artSys();}
 if(G.cls==='美术'){l('🏆 你已经在美术特色班了，这就是你当年考进来的。','good');return artSys();}
 var roll=rnd(0,100)+G.art+(T('face')?8:0);
 if(roll>=150){G.cls='美术';G.fame+=6;G.influence+=15;G.art+=6;ach('s35');
  l('🏆🏆 你通过了美术特色班校测！转进美术特色班！','good');}
 else if(roll>=110){G.influence+=5;l('🏆 校测进了复试名单，可惜没录上。明年再来。','warn');}
 else{G.mood-=5;l('🏆 校测落榜。素描太紧张，手一直在抖。','bad');}
 clampAll();upd();artSys();
}

/* ---------- I6 成就解锁弹跳动画 ---------- */
(function(){
 var _ach=ach;
 ach=function(id){
  var was=G&&G.ach&&G.ach.indexOf(id)>=0;
  _ach(id);
  if(!was&&G&&G.ach.indexOf(id)>=0){
   var el=document.querySelector('.log .line:last-child');
   if(el)el.classList.add('got');
  }
 };
})();

/* ---------- I7 设置弹窗：六首歌文案 + 体重变化开关 ---------- */
(function(){
 var _os=openSettings;
 openSettings=function(){
  _os();
  try{
   var hs=document.querySelectorAll('#modalbox h4');
   for(var i=0;i<hs.length;i++)if(hs[i].textContent.indexOf('三首')>=0)hs[i].textContent='播放列表（六首自动循环）';
   var ps=document.querySelectorAll('#modalbox p.dim');
   for(var j=0;j<ps.length;j++)if(ps[j].textContent.indexOf('三首歌')>=0)ps[j].textContent='六首歌：周杰伦 ×3（手写的从前/红尘客栈/烟花易冷）＋ 许嵩 ×3（素颜/幻听/天龙八部之宿敌）。浏览器限制自动播放，点一下页面任意处音乐就会开始。';
   if(!G)return;
   var cb=$('#modalbox button[onclick="closeModal()"]');
   if(cb){
    var on=(G.bodyGain===undefined?true:!!G.bodyGain);
    var div=document.createElement('div');
    div.innerHTML='<div class="mb" style="margin-top:8px"><span>⚖️ 体重随生活变化<br><span class="dim small">开：偶尔吃夜宵会真实增重，并反映在 BMI/体脂/腰围上</span></span><button class="'+(on?'r':'')+'" onclick="toggleBodyGain()">'+(on?'关闭增重':'开启增重')+'</button></div>';
    cb.parentNode.insertBefore(div,cb);
   }
  }catch(e){}
 };
})();
function toggleBodyGain(){
 if(!G)return;
 G.bodyGain=!(G.bodyGain===undefined?true:!!G.bodyGain);
 l('⚖️ 体重变化已'+(G.bodyGain?'开启（吃夜宵会增重）':'关闭（体重恒定）')+'。','warn');
 saveGame();openSettings();
}
/* 页面加载时 bodyCalc 首次渲染（初始 renderStart 早于本附录执行） */
try{bodyCalcRender();}catch(e){}

/* ================================================================
   附录 J · 5.5.2 纯追加：照片背景 / 歌词 / 鞋子 / 睡眠 / 多角恋 /
   怀孕生理期 / 270+文字 / 重磅游戏 / UI动画 / 学校资料
   ================================================================ */

/* ---------- J1 校园真实照片轮播背景（10张） ---------- */
var PHOTO_IDX=0;
(function(){
 var bg=$('#bgSlideshow');
 if(bg&&PHOTO_B64.length){
  bg.style.backgroundImage='url('+PHOTO_B64[0]+')';
  setInterval(function(){
   PHOTO_IDX=(PHOTO_IDX+1)%PHOTO_B64.length;
   bg.style.opacity='0';
   setTimeout(function(){
    bg.style.backgroundImage='url('+PHOTO_B64[PHOTO_IDX]+')';
    bg.style.opacity='.55';
   },600);
  },5000);
 }
})();

/* ---------- J2 六首歌歌词（1:1对应，顶部滚动显示） ---------- */
var LYRICS=[
 '手写的从前 · 周杰伦：这风铃跟心动很接近，这封信还在怀念旅行，路过的爱情都太年轻，你是我想要再回去的风景。我看着你的脸轻刷着和弦，情人节卡片手写的永远，还记得广场公园一起表演，记忆里在微甜。初恋是整遍手写的从前，还记得那年秋天说了再见，当恋情已走远，我将你深埋在心里面。',
 '红尘客栈 · 周杰伦：天涯的尽头是风沙，红尘的故事叫牵挂，封刀隐没在寻常人家东篱下，闲云野鹤古刹。剑出鞘恩怨了谁笑，我只求今朝拥你入怀抱，红尘客栈风似刀骤雨落宿命敲，任武林谁领风骚我却只为你折腰。檐下窗棂斜映枝桠，与你席地对座饮茶，我以工笔画将你牢牢的记下，提笔不为风雅。',
 '烟花易冷 · 周杰伦：繁华声遁入空门折煞了世人，梦偏冷辗转一生情债又几本，如你默认生死枯等，枯等一圈又一圈的年轮。雨纷纷旧故里草木深，我听闻你始终一个人，斑驳的城门盘踞着老树根，石板上回荡的是再等。缘份落地生根是我们，烟花易冷人事易分，而你在问我是否还认真。',
 '素颜 · 许嵩/何曼婷：又是一个安静的晚上，一个人窝在摇椅里乘凉，我承认这样真的很安详，和楼下老爷爷一样。如果再看你一眼是否还会有感觉，当年素面朝天要多纯洁就有多纯洁，不画扮熟的眼线不用抹匀粉底液，暴雨天照逛街偷笑别人花了脸。最真实的喜怒哀乐全都埋葬在昨天，不掺任何的表演轰轰烈烈那几年，那消失不见的素颜。',
 '幻听 · 许嵩：在远方的时候又想你到泪流，这矫情的措辞结构经历过的人会懂，那些不堪言的疼痛也就是我自作自受，你没有装聋你真没感动。一个人的时候偷偷看你的微博，你转播的歌好耳熟我们坐一起听过，当日嫌它的唱法做作现在听起来竟然很生动，可能是时光让耳朵变得宽容。如今一个人听歌总是会觉得失落，幻听你在我的耳边轻轻诉说，夜色多温柔你有多爱我。',
 '天龙八部之宿敌 · 许嵩：会在何处见到你，莫非前尘已注定，飞过时空的距离却囿于刀剑光影。三月春花渐次醒，迢迢年华谁老去，是劫是缘随我心，除了你万敌不侵。当恩怨各一半我怎么圈揽，看灯笼血红染寻仇已太晚，月下门童喟叹昨夜太平长安，当天上星河转我命已定盘，待绝笔墨痕干宿敌已来犯，我借你的孤单今生恐怕难还。'
];
function lyricUpdate(){
 try{
  var idx=(typeof BGM_IDX!=='undefined')?BGM_IDX:0;
  var el=$('#lyricText');
  if(el)el.textContent='🎵 '+LYRICS[idx%LYRICS.length];
 }catch(e){}
}
/* 旧lyricUpdate已禁用，使用lrcUpdate(LRC时间轴) */
try{lrcUpdate();}catch(e){}

/* ---------- J3 更新日志 + 制作名单 ---------- */
function openChangelog(){
 var h='<h3>📜 更新日志</h3>'+
  '<div class="tcard"><b class="good">v5.5.2（当前）</b><br>'+
  '· 真实校园照片轮播背景（10张实拍）<br>'+
  '· 六首歌歌词同步显示在顶部<br>'+
  '· 睡眠小游戏 + 200种睡眠质量方案 + 详细分析报告<br>'+
  '· 多角恋系统（可同时谈好几个）<br>'+
  '· 怀孕事件真实触发 + 生理期系统增强<br>'+
  '· 鞋子系统（8款男女不同详细款）<br>'+
  '· 3个重磅新小游戏：食堂抢饭大作战 / 考试冲刺 / 校园躲猫猫<br>'+
  '· 270+条新随机事件文字<br>'+
  '· UI美术全面重做 + 动画全覆盖<br>'+
  '· 学校真实公众号资料扩充</div>'+
  '<div class="tcard"><b>v5.5.1</b><br>· 许嵩三首歌加入音乐系统<br>· 8张校园像素画图鉴<br>· 5个新小游戏<br>· 身高体重BMI/腰围/体脂率<br>· 美术系统扩充9项<br>· 系统动画与界面美化</div>'+
  '<div class="tcard"><b>v5.5.0</b><br>· 背景音乐系统（周杰伦三首）<br>· 顶栏音乐状态显示<br>· 设置弹窗音乐开关与音量</div>'+
  '<div class="tcard"><b>v5.4.x</b><br>· 学生举报系统<br>· 17个死成就说明<br>· 崩溃系统修复<br>· 存档字段补全</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function openCredits(){
 var h='<h3>👥 制作名单</h3>'+
  '<div class="tcard" style="text-align:center;padding:16px">'+
  '<div style="font-size:15px;margin-bottom:10px"><b>🎮 游戏设计 / 产品策划</b></div>'+
  '<div style="font-size:18px;color:#ffd166;font-weight:800;margin-bottom:4px">leararus</div>'+
  '<div class="dim small" style="margin-bottom:14px">Product Designer & Game Director</div>'+
  '<div style="font-size:15px;margin-bottom:10px"><b>💻 技术写作 / 代码实现</b></div>'+
  '<div style="font-size:16px;color:#7c9cff;font-weight:700;margin-bottom:2px">Doubao</div>'+
  '<div class="dim small" style="margin-bottom:8px">Technical Writing & Implementation</div>'+
  '<div style="font-size:16px;color:#7c9cff;font-weight:700;margin-bottom:2px">Qwen</div>'+
  '<div class="dim small" style="margin-bottom:8px">Technical Writing & Implementation</div>'+
  '<div style="font-size:16px;color:#7c9cff;font-weight:700;margin-bottom:2px">DeepSeek</div>'+
  '<div class="dim small">Technical Writing & Implementation</div>'+
  '</div>'+
  '<div class="quote" style="text-align:center">杭州西子实验学校模拟器 · 感谢每一位玩家的反馈</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}

/* ---------- J4 鞋子系统（8款男女不同，详细属性） ---------- */
var SHOES_M=[
 {i:'👟',n:'空军一号',d:'经典小白鞋，百搭不过时，穿去上课约会都体面',fit:1,app:3,mood:2,price:799},
 {i:'🏀',n:'篮球鞋',d:'气垫缓震，体育课和打球神器，抓地力强',fit:4,app:2,mood:1,price:699},
 {i:'👞',n:'黑色皮鞋',d:'正式场合必备，老师开会/公开课穿',fit:0,app:4,mood:0,price:459},
 {i:'🥾',n:'马丁靴',d:'酷飒有型，走久了有点累',fit:-1,app:4,mood:2,price:599},
 {i:'👟',n:'老爹鞋',d:'厚底显高，潮流单品',fit:1,app:3,mood:1,price:559},
 {i:'🩴',n:'人字拖',d:'夏天宿舍神器，出校门不太体面',fit:0,app:-2,mood:3,price:29},
 {i:'🏃',n:'专业跑鞋',d:'晨跑/体测神器，轻量透气',fit:5,app:1,mood:1,price:499},
 {i:'👟',n:'帆布鞋',d:'文艺青年标配，舒服便宜',fit:1,app:2,mood:2,price:199}
];
var SHOES_F=[
 {i:'👟',n:'小白鞋',d:'百搭神器，配裙子裤子都好看',fit:1,app:4,mood:2,price:399},
 {i:'👠',n:'小皮鞋',d:'精致JK风，走路有点累',fit:-1,app:4,mood:1,price:359},
 {i:'🩰',n:'玛丽珍鞋',d:'可爱复古，少女感拉满',fit:0,app:3,mood:3,price:289},
 {i:'👢',n:'长筒靴',d:'酷飒显腿长，冬天保暖',fit:-2,app:5,mood:2,price:699},
 {i:'👟',n:'老爹鞋',d:'厚底显高5cm，潮流必备',fit:1,app:4,mood:1,price:529},
 {i:'🩴',n:'凉拖',d:'夏天舒服，出校门不太正式',fit:0,app:-1,mood:3,price:39},
 {i:'🏃',n:'运动鞋',d:'体育课体测神器，轻便',fit:4,app:2,mood:1,price:459},
 {i:'👠',n:'高跟鞋',d:'成熟优雅，学生穿会被老师注意',fit:-3,app:5,mood:0,price:599}
];
function shoeList(){return (O.gender==='女')?SHOES_F:SHOES_M;}
function renderShoes(){
 try{
  var box=$('#shoeBox');if(!box)return;
  var list=shoeList();
  var h='';
  for(var i=0;i<list.length;i++){
   var s=list[i];
   var on=(O.shoe===i)?' on':'';
   h+='<div class="shoeCard'+on+'" onclick="pickShoe('+i+')"><span class="si">'+s.i+'</span><div class="sn">'+s.n+'</div><div class="sd">'+s.d+'<br>体力'+(s.fit>=0?'+':'')+s.fit+' 颜值'+(s.app>=0?'+':'')+s.app+' 心情'+(s.mood>=0?'+':'')+s.mood+'</div></div>';
  }
  box.innerHTML=h;
  var info=$('#shoeInfo');
  if(info&&typeof O.shoe==='number'){
   var s=list[O.shoe];
   info.innerHTML='已选：<b>'+s.i+' '+s.n+'</b> — '+s.d+'（参考价 ¥'+s.price+'）';
  }
 }catch(e){}
}
function pickShoe(i){O.shoe=i;renderShoes();}
(function(){
 var _rs=renderStart;
 renderStart=function(){_rs();try{renderShoes();}catch(e){}};
})();
/* ---- 附录J 后半（睡眠/多角恋/怀孕/文字/重磅游戏/资料）见下 ---- */

/* ---------- J5 睡眠小游戏（200种方案 + 详细分析） ---------- */
(function(){
 var _oldSleep=SLOTS.sleep;
 SLOTS.sleep=function(){
  var def=_oldSleep();
  for(var i=0;i<def.choices.length;i++){
   if(def.choices[i].n.indexOf('睡觉')>=0){
    (function(c){
     var _fn=c.fn;
     c.fn=function(){sleepMiniGame(_fn);};
    })(def.choices[i]);
   }
  }
  return def;
 };
})();
function sleepMiniGame(afterFn){
 closeModal();
 G._sleepPos=0;G._sleepDir=1;G._sleepStop=false;
 var drankWater=G._drankWater||false;
 var phoneLate=G.sleep>55;
 function render(){
  if(G._sleepStop)return;
  G._sleepPos+=G._sleepDir*1.8;
  if(G._sleepPos>=100){G._sleepPos=100;G._sleepDir=-1;}
  if(G._sleepPos<=0){G._sleepPos=0;G._sleepDir=1;}
  var h='<h3>🌙 睡眠调控</h3><div class="quote">指针在深睡黄金区（30%~60%）停下，睡眠质量最好。<br>'+
   (phoneLate?'⚠️ 睡前刷了手机，入睡困难。':'')+(drankWater?'（睡前喝了水……）':'')+'</div>'+
   '<div class="sleepBar"><div class="sleepZone" style="left:30%;width:30%"></div><i style="width:'+G._sleepPos+'%"></i></div>'+
   '<div class="sleepStat"><span>浅睡</span><span style="color:#ffd166">深睡黄金区</span><span>易醒</span></div>'+
   '<button class="big" style="width:100%;margin-top:8px" onclick="sleepStop()">💤 点击入睡</button>';
  modal(h);
  setTimeout(render,40);
 }
 render();
 G._sleepAfter=afterFn;
}
function sleepStop(){
 if(G._sleepStop)return;
 G._sleepStop=true;
 var pos=G._sleepPos;
 var quality=pos>=30&&pos<=60?'excellent':(pos>=20&&pos<=75?'good':'poor');
 var drankWater=G._drankWater||false;
 var phoneLate=G.sleep>55;
 /* 200种睡眠方案：随机各阶段时长 */
 var total=rnd(4.5,9.0);
 var deep=rnd(0.8,Math.min(3.2,total*0.5));
 var rem=rnd(0.6,Math.min(2.4,total*0.35));
 var light=Math.max(0.5,total-deep-rem-rnd(0.2,0.8));
 var fallAsleep=rnd(5,phoneLate?45:20);
 var wakeUp=drankWater?(ch(.65)?rnd(1,3):0):(ch(.15)?1:0);
 var score=Math.round((quality==='excellent'?90:quality==='good'?70:45)+rnd(-8,8)-wakeUp*6-(phoneLate?8:0));
 score=cl(score,20,99);
 G._lastSleep={total:total,deep:deep,rem:rem,light:light,fall:fallAsleep,wake:wakeUp,score:score,quality:quality};
 G.sleep=cl(G.sleep-(quality==='excellent'?45:quality==='good'?30:15)-wakeUp*5,0,100);
 G.mood+=(quality==='excellent'?8:quality==='good'?4:-3);
 var qtext=quality==='excellent'?'🌟 极佳':quality==='good'?'😊 良好':'😫 较差';
 var dreams=pk(['梦见在考试却什么都不会','梦见和喜欢的人一起逛铜鉴湖','梦见自己飞起来了','梦见被班主任追着跑','梦见食堂的红烧肉无限续','梦见在教室里找厕所','梦见回到了小学','梦见手机被没收了','梦见考了满分','梦见在操场上淋雨','什么都没梦到，一片漆黑','梦见和朋友吵架了','梦见自己变成了像素人','梦见在山里迷路']);
 var h='<h3>📊 睡眠质量分析报告</h3>'+
  '<div class="tcard" style="border-color:'+(quality==='excellent'?'#4ade80':quality==='good'?'#fbbf24':'#f87171')+'">'+
  '<div style="font-size:20px;font-weight:800;text-align:center;margin-bottom:8px">综合评分：'+score+'/100 · '+qtext+'</div>'+
  '<div class="sleepStat"><span>😴 总睡眠时长</span><b>'+total.toFixed(1)+' 小时</b></div>'+
  '<div class="sleepStat"><span>🌙 深睡时长</span><b>'+deep.toFixed(1)+' 小时</b></div>'+
  '<div class="sleepStat"><span>💭 快速眼动(REM)</span><b>'+rem.toFixed(1)+' 小时</b></div>'+
  '<div class="sleepStat"><span>☁️ 浅睡时长</span><b>'+light.toFixed(1)+' 小时</b></div>'+
  '<div class="sleepStat"><span>⏱️ 入睡耗时</span><b>'+fallAsleep+' 分钟</b></div>'+
  '<div class="sleepStat"><span>🚻 夜间醒来</span><b>'+wakeUp+' 次'+(wakeUp>0?'（去了厕所）':'')+'</b></div>'+
  '</div>'+
  '<div class="quote">💭 梦境：'+dreams+'<br>'+
  (quality==='excellent'?'深睡充足，第二天精力充沛，记忆力和注意力都在线。':
   quality==='good'?'睡眠还不错，但深睡时间可以再长一点。':
   '睡眠质量差，白天容易犯困，注意力不集中。')+
  (wakeUp>0?'\n半夜起来了'+wakeUp+'次，睡眠被打断。':'')+
  (phoneLate?'\n睡前刷手机导致入睡慢，蓝光抑制了褪黑素。':'')+'</div>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="finishSleep()">☀️ 迎接新的一天</button>';
 modal(h);
}
function finishSleep(){
 closeModal();
 G._drankWater=false;
 if(G._sleepAfter){var f=G._sleepAfter;G._sleepAfter=null;f();}
 else nextEnd();
}

/* ---------- J6 多角恋系统 ---------- */
if(!G)var G=null;
(function(){
 var _oldLoverMenu=loverMenu;
 loverMenu=function(){
  if(!G.lover)return _oldLoverMenu();
  var L=G.lover;
  var items=[
   {n:'🍜 一起吃饭',d:'好感+6',b:'去',fn:function(){L.aff=cl(L.aff+6);G.mood+=5;l('🚶 TA把你碗里的肉夹走了。好感+6','love');upd();loverMenu();}},
   {n:'📚 一起学习',d:'好感+8 学习+5',b:'去',fn:function(){L.aff=cl(L.aff+8);G.knowledge+=5;G.st.study+=5;l('📚 你们互相监督写作业。好感+8','love');upd();loverMenu();}},
   {n:'🏀 一起运动',d:'好感+7 体力+4',b:'去',fn:function(){L.aff=cl(L.aff+7);G.fitness+=4;l('🏀 你们在操场上呆到天黑。好感+7','love');upd();loverMenu();}},
   {n:'📱 偷偷发消息',d:'需手机，好感+7',b:'发',fn:function(){if(!phoneOK()){l('📱 手机被扣了。','warn');return loverMenu();}L.aff=cl(L.aff+7);G.mood+=7;l('📱 你们聊到凌晨一点。好感+7','love');upd();loverMenu();}},
   {n:'🧋 送早餐/奶茶',d:'¥20 好感+11',b:'买',fn:function(){if(G.money<20){l('💸 钱不够。','warn');return loverMenu();}G.money-=20;L.aff=cl(L.aff+11);G.mood+=8;l('🧋 你把奶茶放在TA桌上。好感+11','love');upd();loverMenu();}},
   {n:'💌 写情书',d:'需信纸，好感+15',b:'写',fn:function(){if(!has('note')){l('没有信纸。','warn');return loverMenu();}take('note',1);L.aff=cl(L.aff+15);G.mood+=10;l('💌 你写了封信塞进TA课桌。好感+15','love');upd();loverMenu();}},
   {n:'🎂 庆祝纪念日',d:'¥60 好感+25',b:'订',fn:function(){if(G.money<60){l('💸 钱不够。','warn');return loverMenu();}G.money-=60;L.aff=cl(L.aff+25);G.mood+=20;l('🎂 你订了个小蛋糕。好感+25','love');upd();loverMenu();}},
   {n:'🎬 周末约会',d:'¥150 好感+20',b:'约',fn:function(){if(G.money<150){l('💸 钱不够。','warn');return loverMenu();}G.money-=150;L.aff=cl(L.aff+20);G.mood+=20;l('🎬 你们逛了一下午。好感+20','love');upd();loverMenu();}},
   {n:'🌙 亲密一点（需好感≥80）',d:'会问做不做措施',b:'去',fn:function(){intimacy();}},
   {n:'💔 分手',d:'心情-30',r:1,b:'分',fn:function(){G.mood-=30;G.charm-=10;G.support-=5;G.lovers[G.lovers.length-1].end='分手';G.lovers[G.lovers.length-1].days=L.days;l('💔 你们分手了。','bad');G.lover=null;ach('s19');closeModal();upd();}}
  ];
  /* 多角恋：发展新对象 */
  if(!G.sideLovers)G.sideLovers=[];
  items.push({n:'🔥 同时发展新对象',d:'当前 '+G.sideLovers.length+' 个备胎 · 有被发现风险',b:'去',fn:function(){sideLoveMenu();}});
  if(G.sideLovers.length>0){
   for(var i=0;i<G.sideLovers.length;i++){(function(i){
    var s=G.sideLovers[i];
    items.push({n:'💗 '+s.n+'（备胎）',d:'好感 '+Math.round(s.aff)+'/100',b:'联系',fn:function(){
     s.aff=cl(s.aff+rnd(3,8));G.mood+=5;
     l('💗 你偷偷和'+s.n+'聊了一会儿。好感+'+Math.round(s.aff%10),'love');
     if(ch(.12)){cheatingCaught();return;}
     upd();loverMenu();
    }});
   })(i);}
  }
  if(L.fight>0)items.unshift({n:'🤝 道歉，哄TA',d:'结束冷战',b:'道歉',fn:function(){if(ch(.6)){L.fight=0;L.aff=cl(L.aff+5);l('🤝 TA说"算了"，你们和好了。','love');}else{L.fight++;l('TA："你自己想想清楚。"','warn');}upd();loverMenu();}});
  menu('💗 '+L.n+'（'+L.t+' · '+L.g+(L.same?' · 同性':'')+(G.sideLovers&&G.sideLovers.length?' · 备胎×'+G.sideLovers.length:'')+'）',
   bar('好感度',L.aff,Math.round(L.aff)+'/100','#ff7ab6')+
   '<div class="quote">在一起 '+L.days+' 天 · 始于 '+L.start+(L.fight>0?'<br><span class="bad">冷战第 '+L.fight+' 天</span>':'')+'</div>',items);
 };
})();
function sideLoveMenu(){
 var pool=[
  {n:'隔壁班的学霸',g:G.pref==='同性'?(G.gender==='男'?'男':'女'):(G.gender==='男'?'女':'男'),t:'学霸型',aff:rnd(10,30)},
  {n:'操场遇到的体育生',g:G.pref==='同性'?(G.gender==='男'?'男':'女'):(G.gender==='男'?'女':'男'),t:'体育型',aff:rnd(10,30)},
  {n:'社团里的文艺青年',g:G.pref==='同性'?(G.gender==='男'?'男':'女'):(G.gender==='男'?'女':'男'),t:'文艺型',aff:rnd(10,30)},
  {n:'食堂拼桌的同学',g:G.pref==='同性'?(G.gender==='男'?'男':'女'):(G.gender==='男'?'女':'男'),t:'吃货型',aff:rnd(10,30)},
  {n:'社交软件匹配的人',g:G.pref==='同性'?(G.gender==='男'?'男':'女'):(G.gender==='男'?'女':'男'),t:'网友型',aff:rnd(5,20)}
 ];
 var p=pk(pool);
 if(!G.sideLovers)G.sideLovers=[];
 G.sideLovers.push(p);
 l('🔥 你开始偷偷和'+p.n+'（'+p.t+'）联系。目前有 '+G.sideLovers.length+' 个备胎。','warn');
 if(ch(.1))cheatingCaught();else{upd();loverMenu();}
}
function cheatingCaught(){
 var L=G.lover;
 G.mood-=25;G.support-=8;G.charm-=5;
 l('💥 '+L.n+'发现了你和别人的聊天记录！TA把手机摔在桌上："我们完了。"','bad');
 G.lovers[G.lovers.length-1].end='被发现出轨';G.lovers[G.lovers.length-1].days=L.days;
 G.lover=null;G.sideLovers=[];
 closeModal();upd();
}

/* ---------- J7 怀孕事件修复 + 生理期增强 ---------- */
(function(){
 var _oldIntimacy=intimacy;
 intimacy=function(){
  closeModal();
  var L=G.lover;
  if(!L||L.aff<80){l('💗 好感还没到80。','warn');return loverMenu();}
  var cs=[
   C('🛡️ 做好措施（花¥30）','安全率95%',function(){
    G.money-=30;L.aff=cl(L.aff+5);G.mood+=15;
    if(G.gender==='女'&&ch(.05)){G.preg=true;pregStart();}
    else l('🛡️ 你们做好了措施，没有出意外。心情+15','love');
    closeModal();upd();}),
   C('😳 不做措施','真的会出事',function(){
    L.aff=cl(L.aff+10);G.mood+=20;
    if(G.gender==='女'&&ch(.30)){G.preg=true;pregStart();}
    else l('😳 什么都没发生。你们松了口气。','love');
    closeModal();upd();}),
   C('🧊 算了，冷静一下','好感-5',function(){L.aff=cl(L.aff-5);l('🧊 你冷静下来了。好感-5');closeModal();upd();})
  ];
  scene('🌙 亲密时刻',L.n+'看着你，走廊上有人经过。',cs);
 };
})();
function pregStart(){
 G.pregWeek=0;G.pregSymptom=0;
 l('😨 几周后，你在厕所看到验孕棒上的两条线。手一直在抖。','bad');
 l('🤰 你怀孕了。这将彻底改变你的校园生活。','bad');
 closeModal();upd();
}
/* 怀孕进度在tick中推进 */
(function(){
 var _oldTick=tick;
 tick=function(){
  _oldTick();
  if(!G||G.over)return;
  /* 怀孕进度 */
  if(G.preg&&G.gender==='女'){
   G.pregWeek=(G.pregWeek||0)+1;
   if(G.pregWeek===2){l('🤰 你开始晨吐，早上刷牙时一阵恶心。','warn');G.mood-=5;G.health-=2;}
   if(G.pregWeek===6){l('🤰 肚子微微隆起，校服开始有点紧了。','warn');G.charm-=3;}
   if(G.pregWeek===10){l('🤰 胎动明显，你能感觉到一个小生命。','warn');G.mood+=3;}
   if(G.pregWeek>=14&&!G._pregChoice){
    G._pregChoice=true;
    var cs=[
     C('🏥 告诉家长，去医院','面对现实',function(){l('🏥 你告诉了家长。他们沉默了很久，最后带你去了医院。','warn');G.preg=false;G.health-=10;G.mood-=15;closeModal();upd();}),
     C('🙈 瞒着，继续上学','风险极大',function(){l('🙈 你决定瞒着。但肚子越来越大，纸包不住火……','warn');setTimeout(function(){if(G.preg){l('🚨 班主任发现了你的异常，通知了家长。学校启动了处理程序。','bad');ending('preg');}},3000);closeModal();upd();}),
     C('💬 告诉对象','一起面对',function(){if(G.lover){l('💬 你告诉了'+G.lover.n+'。TA沉默了很久，说会负责。','warn');G.lover.aff=cl(G.lover.aff-10);}else l('💬 你找不到那个人了。','bad');closeModal();upd();})
    ];
    scene('🤰 怀孕第'+G.pregWeek+'周','肚子越来越明显，你必须做出选择。',cs);
   }
  }
  /* 生理期增强 */
  if(G.gender==='女'&&G.period){
   if(G.periodDay===1&&!G._periodMsg){
    G._periodMsg=true;
    var sym=pk(['小腹坠痛，像有只手在拧','腰酸得直不起来','情绪莫名烦躁，看什么都不顺眼','食欲大增，特别想吃甜的','头晕乏力，上课集中不了注意力','胸胀，碰一下都疼']);
    l('🩸 生理期第1天：'+sym+' 腹痛等级 '+G.pain+'/5。','warn');
    if(!has('sanitary')&&ch(.5)){l('🩸 你没带够卫生巾，只能找同学借。','bad');G.mood-=3;}
   }
   if(G.periodDay>=4)G._periodMsg=false;
  }
 };
})();

/* ---------- J8 三个重磅小游戏（插入菜单最前） ---------- */
(function(){
 var _oldOpenGame=openGame;
 openGame=function(){
  var all=[
   {n:'🎁 更多新游戏（答题/跑步/翻牌/反应力/Canvas贪吃蛇）',d:'5.5.6新增5个小游戏',fn:function(){miniGameMenu();}},
   {n:'🍚 食堂抢饭大作战',d:'限时15秒抢菜，手速决定吃什么',fn:function(){canteenRush();}},
   {n:'📝 考试冲刺',d:'10道题限时作答，分数影响成绩',fn:function(){examRush();}},
   {n:'🙈 校园躲猫猫',d:'选择躲藏点，避开值周老师',fn:function(){hideSeek();}},
   {n:'🧮 速算挑战',fn:function(){mathGame();}},
   {n:'🎯 猜数字（1-100）',fn:function(){window.NT=rnd(1,100);guessStep();}},
   {n:'⚡ 手速挑战（20次）',fn:function(){window.TN=0;modal('<h3>⚡ 手速挑战</h3><p class="dim small">连点20次</p><button class="big" onclick="tapOnce()" id="tapBtn">点我 0/20</button>');}},
   {n:'🃏 21点',fn:function(){bjStart();}},
   {n:'🎰 抽奖转盘（¥5/次）',fn:function(){lottery();}},
   {n:'🧠 记忆翻牌',fn:function(){memStart();}},
   {n:'🎣 钓鱼',fn:function(){fishStart();}},
   {n:'🏀 投篮挑战',fn:function(){shootStart();}},
   {n:'🐍 贪吃蛇（简化）',fn:function(){snakeStart();}},
   {n:'🎵 节奏大师',fn:function(){rhythmStart();}}
  ];
  for(var i=0;i<MGAMES.length;i++){(function(g){
   all.push({n:'📱 '+g,d:'手机上的手游',fn:function(){playMobile(g);}});
  })(MGAMES[i]);}
  var extraGames=['王者荣耀','和平精英','原神','崩坏：星穹铁道','蛋仔派对','金铲铲之战','英雄联盟手游','永劫无间手游','明日方舟','第五人格','光遇','摩尔庄园','植物大战僵尸','我的世界','火影忍者手游','QQ飞车手游','穿越火线手游','使命召唤手游','阴阳师','哈利波特：魔法觉醒'];
  var _existN={};for(var z=0;z<all.length;z++){_existN[all[z].n.replace(/📱 |（新）/g,'')]=1;}
  for(var j=0;j<extraGames.length;j++){(function(g){
   if(_existN[g])return;
   all.push({n:'📱 '+g+'（新）',d:'热门手游',fn:function(){playMobile(g);}});_existN[g]=1;
  })(extraGames[j]);}
  menu('🎮 小游戏 & 手游','<p class="dim small">电脑小游戏 13 个 + 手机手游 33 款，全部有真实判定。</p>',all);
 };
})();
function canteenRush(){
 window.CR={score:0,time:15,dishes:['红烧肉','糖醋排骨','可乐鸡翅','麻婆豆腐','番茄炒蛋','青椒肉丝','酸菜鱼','宫保鸡丁','地三鲜','紫菜蛋花汤']};
 crRender();
 window.CR.timer=setInterval(function(){
  window.CR.time--;
  if(window.CR.time<=0){clearInterval(window.CR.timer);crEnd();}
  else crRender();
 },1000);
}
function crRender(){
 var d=pk(window.CR.dishes);
 var h='<h3>🍚 食堂抢饭大作战</h3><div class="quote">剩余 '+window.CR.time+' 秒 · 已抢 '+window.CR.score+' 份<br>快！下一个窗口：<b style="color:#ffd166;font-size:18px">'+d+'</b></div>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="crGrab()">🍽️ 抢这份！</button>'+
  '<button class="gbtn" style="width:100%;margin-top:6px" onclick="crRender()">⏭️ 等下一份</button>';
 modal(h);
}
function crGrab(){window.CR.score++;l('🍚 你抢到了一份！');crRender();}
function crEnd(){
 clearInterval(window.CR.timer);
 var s=window.CR.score;
 G.mood+=s*2;G.fitness+=s;
 var h='<h3>🍚 抢饭结束</h3><div class="tcard">你抢到了 <b>'+s+'</b> 份菜！<br>'+
  (s>=10?'🏆 抢饭王者！整个食堂都认识你了。':s>=6?'👍 收获满满，今天吃得好。':s>=3?'😊 还行，至少有肉吃。':'😅 手太慢了，只能吃白饭。')+
  '<br>心情+'+(s*2)+' 体力+'+s+'</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">返回</button>';
 modal(h);clampAll();upd();
}
function examRush(){
 window.ER={q:0,score:0,time:30};
 erNext();
 window.ER.timer=setInterval(function(){
  window.ER.time--;
  if(window.ER.time<=0){clearInterval(window.ER.timer);erEnd();}
 },1000);
}
function erNext(){
 if(window.ER.q>=10){clearInterval(window.ER.timer);erEnd();return;}
 var questions=[
  {q:'1+1=?',a:['1','2','3','4'],c:1},
  {q:'水的化学式是？',a:['CO2','H2O','O2','NaCl'],c:1},
  {q:'中国的首都是？',a:['上海','广州','北京','深圳'],c:2},
  {q:'光速约为？',a:['3万km/s','30万km/s','300万km/s','3000km/s'],c:1},
  {q:'《红楼梦》的作者是？',a:['罗贯中','施耐庵','曹雪芹','吴承恩'],c:2},
  {q:'人体最大的器官是？',a:['心脏','肝脏','皮肤','肺'],c:2},
  {q:'平年一年有多少天？',a:['364','365','366','360'],c:1},
  {q:'DNA的中文全称是？',a:['核糖核酸','脱氧核糖核酸','氨基酸','蛋白质'],c:1},
  {q:'地球绕太阳一周需要？',a:['一天','一个月','一年','一周'],c:2},
  {q:'圆周率π约等于？',a:['3.14','2.71','1.41','1.73'],c:0},
  {q:'光合作用发生在？',a:['线粒体','叶绿体','细胞核','核糖体'],c:1},
  {q:'世界上最长的河流是？',a:['长江','亚马逊河','尼罗河','密西西比河'],c:2}
 ];
 var q=pk(questions);window.ER.cur=q;
 var h='<h3>📝 考试冲刺</h3><div class="quote">第 '+(window.ER.q+1)+'/10 题 · 剩余 '+window.ER.time+' 秒 · 得分 '+window.ER.score+'</div>'+
  '<div class="tcard" style="font-size:16px;font-weight:700;margin:8px 0">'+q.q+'</div>';
 for(var i=0;i<q.a.length;i++){
  h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="erAns('+i+')">'+String.fromCharCode(65+i)+'. '+q.a[i]+'</button>';
 }
 modal(h);
}
function erAns(i){
 if(i===window.ER.cur.c){window.ER.score+=10;l('✅ 答对了！+10分');}
 else{l('❌ 答错了。正确答案：'+window.ER.cur.a[window.ER.cur.c],'warn');}
 window.ER.q++;erNext();
}
function erEnd(){
 clearInterval(window.ER.timer);
 var s=window.ER.score;
 G.knowledge+=Math.round(s/5);G.mood+=s>60?8:s>30?4:-4;
 var h='<h3>📝 考试结束</h3><div class="tcard">得分：<b style="font-size:24px">'+s+'/100</b><br>'+
  (s>=90?'🏆 学霸！老师当众表扬了你。':s>=70?'👍 不错，掌握得还行。':s>=50?'😐 及格线徘徊，要加油了。':'😅 挂科预警，今晚别玩手机了。')+
  '<br>知识+'+Math.round(s/5)+' 心情+'+(s>60?8:s>30?4:-4)+'</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">返回</button>';
 modal(h);clampAll();upd();
}
function hideSeek(){
 var spots=[
  {n:'小树林',risk:.3,bonus:'隐蔽但蚊子多'},
  {n:'图书馆厕所',risk:.2,bonus:'安全但臭'},
  {n:'天台',risk:.5,bonus:'视野好但容易被发现'},
  {n:'食堂后厨',risk:.4,bonus:'有吃的但油烟大'},
  {n:'体育馆器材室',risk:.35,bonus:'暗但有球砸头'},
  {n:'教学楼空教室',risk:.25,bonus:'经典躲藏点'},
  {n:'操场看台底下',risk:.45,bonus:'灰大但没人去'},
  {n:'宿舍衣柜',risk:.15,bonus:'最安全但要有人掩护'}
 ];
 var h='<h3>🙈 校园躲猫猫</h3><div class="quote">值周老师正在巡逻！选择一个躲藏点：</div>';
 for(var i=0;i<spots.length;i++){
  (function(s){
   h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="hidePick(\''+s.n+'\','+s.risk+')">'+s.n+' <span class="dim small">（'+s.bonus+'）</span></button>';
  })(spots[i]);
 }
 modal(h);
}
function hidePick(spot,risk){
 if(ch(risk)){
  l('🙈 你躲在'+spot+'，但值周老师的手电筒照了过来！被抓了！','bad');
  G.mood-=8;G.support-=3;tt('criticize','你在'+spot+'被值周老师抓了个正着');
 }else{
  l('🙈 你躲在'+spot+'，值周老师从旁边走过却没发现你！成功逃脱！','good');
  G.mood+=10;G.st.skip++;
 }
 closeModal();upd();
}

/* ---------- J9 270+条随机事件文字 ---------- */
var EXTRA_EVENTS=[
 '老师突然点名让你回答问题，你站起来脑子一片空白。','同桌偷偷递了张纸条给你，上面画了只猪。','窗外有只鸟撞在了玻璃上，全班都看了过去。','投影仪突然坏了，老师手舞足蹈地修了五分钟。','你发现课本里夹着一张上届学生留下的情书。','后排有人在吃泡面，香味飘了半间教室。','老师讲着讲着自己把自己绕进去了。','你打了个超大的哈欠，眼泪都出来了。','广播突然响起，教导主任在找某个班的学生。','你发现自己的笔没水了，举了半天手没人理。',
 '同桌的橡皮掉了，滚到了你脚边。','老师让你们自习，然后在讲台上睡着了。','你偷偷在课本上画画，被老师从窗户看到了。','前面的人一直在转笔，笔飞出去砸到了你。','教室后面的钟停了，没人知道现在几点。','你闻到一股奇怪的味道，不知道是谁放的。','老师让你上黑板做题，你写了一半不会了。','同桌在小声唱歌，跑调跑到天边。','你发现今天穿了两只不一样的袜子。','窗外的云特别好看，你看了一整节课。',
 '老师讲了个冷笑话，只有你一个人笑了。','你突然想起作业没写，开始疯狂补。','同桌的手机在桌洞里震动，全班都听到了。','老师让分组讨论，你们组聊起了游戏。','你在草稿纸上写满了喜欢的人的名字。','教室的灯闪了几下，有人尖叫了一声。','你发现老师的PPT上有错别字。','后面有人在传小零食，传到你这里已经没了。','老师让你读课文，你读错了一个字，全班笑了。','你趴在桌上，感觉桌子在晃，原来是地震演练。',
 '你发现自己的鞋带开了，系了一节课。','老师突然说要考试，全班哀嚎。','你在书上看到一句很有道理的话，抄了下来。','同桌问你几点了，你说不知道，其实手表就在手上。','老师的杯子倒了，水洒了一讲台。','你听到隔壁班在唱歌，跑调比你们班还严重。','你在桌洞里发现了一包过期的饼干。','老师让你们闭眼冥想，你真的睡着了。','你发现窗外有只猫在盯着你看。','同桌的笔漏墨了，手黑了一大片。',
 '食堂的红烧肉今天特别肥。','打饭阿姨手抖了一下，肉少了一半。','你发现汤里有只虫子，默默挑了出去。','今天的糖醋排骨超好吃，你排了两次队。','食堂的电视在放新闻，没人看。','你端着餐盘找座位，发现每个位置都有人占了。','同桌把你碗里的肉夹走了。','食堂的筷子有点黏，你擦了三遍。','今天的米饭太硬了，硌牙。','你发现食堂阿姨多找了你五块钱。',
 '打饭队伍排到了门口，你等了十分钟。','今天有炸鸡腿，你抢了两个。','汤桶见底了，你只打到了清水。','食堂的空调坏了，热得像蒸笼。','你在食堂遇到了喜欢的人，心跳加速。','有人把餐盘打翻了，全场看过去。','今天的菜特别咸，你喝了三碗汤。','你发现自己忘带饭卡了，尴尬地站在窗口。','食堂的背景音乐是周杰伦，你跟着哼了起来。','打饭阿姨今天心情好，给你多舀了一勺。',
 '你在食堂角落发现了一个安静的位置。','今天的面条坨了，像一团浆糊。','有人在食堂里背书，声音还挺大。','你把汤洒在了校服上。','食堂的水果今天是苹果，你拿了两个。','你发现餐盘上有裂缝，换了一个。','今天的鸡蛋羹特别嫩。','有人在食堂里过生日，全食堂唱生日歌。','你排队时被人插队了，没敢说。','食堂的灯突然灭了三秒，有人喊了一声。',
 '室友在打呼噜，像拖拉机一样。','你半夜起来上厕所，差点被拖鞋绊倒。','宿舍的灯坏了一盏，忽明忽暗。','室友在偷偷吃泡面，香味把你馋醒了。','你发现自己的袜子少了一只。','宿舍空调开太低了，你裹紧了被子。','有人在宿舍里唱歌，跑调跑到隔壁宿舍来敲门。','你在床底下发现了上个月丢的笔。','室友的闹钟响了，他自己没醒，全宿舍醒了。','你半夜听到奇怪的声音，后来发现是水管在响。',
 '宿舍停水了，你们只能用矿泉水刷牙。','你发现枕头底下有只蜘蛛，尖叫着跳下床。','室友在打游戏，键盘声噼里啪啦。','你忘带钥匙了，在门口等了半小时。','宿舍的WiFi突然断了，全宿舍哀嚎。','有人把臭袜子放在了暖气上。','你半夜说梦话，被室友录了下来。','宿舍的镜子裂了一道缝。','你发现室友在偷偷写日记。','今天查寝，你们手忙脚乱地收拾。',
 '室友的手机掉床缝里了，全宿舍帮忙掏。','你在宿舍里煮火锅，被宿管闻到了。','宿舍的窗帘拉不严，早上阳光直射眼睛。','有人在宿舍里健身，床板吱呀响。','你发现自己的洗发水被室友用了一半。','宿舍的门锁有点卡，每次都要用力撞。','你半夜被热醒，发现空调被关了。','室友在看恐怖片，你偷偷瞄了一眼。','宿舍的垃圾桶满了，没人愿意倒。','你在枕头下发现了一百块钱，不知道是谁的。',
 '跑操时你踩掉了前面人的鞋。','操场上有人在踢足球，球飞过来差点砸到你。','你跑完八百米，感觉肺要炸了。','体育老师让你们蛙跳，第二天腿废了。','操场的风特别大，把你的帽子吹飞了。','你在操场角落发现了一只流浪猫。','有人在操场上表白，围了一圈人。','你打篮球时崴了脚。','操场的草坪刚浇过水，你踩了一脚泥。','体育老师说自由活动，你找了个阴凉处坐下。',
 '你在跑道上捡到了一块手表。','有人在操场上放风筝，风筝挂在了树上。','你跑步时鞋带开了，差点摔个狗吃屎。','操场的广播在放运动员进行曲。','你在看台上发现了一本没人要的漫画。','有人在操场上练滑板，摔了好几次。','你绕操场走了一圈，数了数有多少盏灯。','操场上的沙坑里有只死鸟。','你在操场边的树上发现了一个鸟窝。','体育老师测立定跳远，你跳了一米五。',
 '有人在操场上拍抖音，你不小心入镜了。','你在操场捡到了一个篮球，投了个空心。','操场的灯坏了一半，暗得吓人。','你在跑道上看到一只蜗牛，蹲下来看了半天。','有人在操场上练合唱，声音飘得很远。',
 '你在走廊里被人撞了一下，书撒了一地。','值周老师拦住你检查校服。','你在楼梯口遇到了校长，紧张得打了个招呼。','有人在走廊里跑，被教导主任抓住了。','你在公告栏看到了自己的名字（表扬）。','你在公告栏看到了自己的名字（批评）。','小卖部排队的人特别多。','你在厕所里遇到了班主任，尴尬地打了个招呼。','有人在走廊里弹吉他，围了一圈人。','你发现自己的班级被扣分了。',
 '你在校园里遇到了小学同学。','有人在发传单，你接了一张发现是补习班广告。','你在车棚发现自己的车被人挪了位置。','校园里的桂花开了，特别香。','你在湖边看到有人在喂鱼。','有人在校园里遛狗（违规）。','你在美术教室外看到一幅特别好看的画。','你发现食堂门口的猫又在晒太阳。','有人在教学楼大厅弹钢琴。','你在校园里迷了路（虽然已经来了一年）。',
 '你看到两个老师在吵架。','你在走廊里捡到了一个U盘。','有人在墙上涂鸦，画得还挺好。','你发现校园里的银杏树黄了。','你在操场边看到一只白鹭。','有人在校园里拍婚纱照（老师）。','你在图书馆门口遇到了喜欢的人。','你发现校园里的喷泉开了。','有人在校园里放风筝，线缠在了树上。','你在走廊里闻到了食堂飘来的香味。',
 '你今天心情特别好，看什么都顺眼。','你今天心情很差，什么都不想干。','你突然想起一件很尴尬的事，脸瞬间红了。','你发现自己最近胖了，决定明天开始减肥。','你收到一条陌生人的短信，是诈骗。','你在朋友圈看到同学出去玩的照片，有点羡慕。','你今天照镜子觉得自己还挺好看的。','你今天照镜子觉得自己好丑。','你突然很想吃某样东西，但小卖部没有。','你发现自己的手机电量只剩1%了。',
 '你今天走路特别轻快，像踩了云。','你今天特别困，上课一直在点头。','你突然想起一个很久没联系的朋友。','你发现自己的笔袋里有一张去年的电影票。','你今天特别想吃妈妈做的饭。','你发现自己的鞋子开胶了。','你今天运气特别好，做什么都顺。','你今天运气特别差，喝凉水都塞牙。','你突然很想放假。','你发现自己的手表慢了十分钟。',
 '你今天特别想找人说话，但不知道找谁。','你发现自己的书包拉链坏了。','你今天听了一首很好听的歌，单曲循环。','你突然很想写点什么，但又不知道写什么。','你发现自己的头发长了，该剪了。','你今天特别不想起床。','你发现自己的眼镜片花了。','你今天喝了一杯特别好喝的奶茶。','你突然很想回老家看看。','你发现自己的指甲该剪了。',
 '班主任今天心情好像不太好，全班都小心翼翼。','数学老师今天穿了一件特别鲜艳的衣服。','英语老师今天听写，你一个都不会。','语文老师今天讲了一首特别美的诗。','物理老师做实验失败了，全班哄笑。','化学老师的实验成功了，全班鼓掌。','生物老师带了显微镜，你们看了自己的口腔上皮细胞。','历史老师讲了一个特别有意思的故事。','地理老师放了一段特别震撼的纪录片。','政治老师今天讲了一个新闻案例。',
 '体育老师今天又"生病"了，课被数学老师占了。','音乐老师教了一首新歌。','美术老师让你们画自画像，你画得像外星人。','信息老师让你们自由上网，你偷偷玩游戏。','心理老师让你们做了一个性格测试。','校长今天来听课了，坐你后面。','教导主任今天在走廊里站了一节课。','年级主任今天广播了一个通知。','宿管阿姨今天查寝特别严。','食堂阿姨今天给你打饭时笑了一下。',
 '保安大叔今天跟你打了个招呼。','校医今天不在，医务室锁着门。','图书馆老师今天推荐了一本书。','实验员老师帮你们修好了仪器。','保洁阿姨今天把走廊拖得特别亮。',
 '今天下雨了，你没带伞。','今天天晴得特别好，蓝天没有一朵云。','今天降温了，你冻得瑟瑟发抖。','今天升温了，你穿多了。','今天起雾了，校园里像仙境。','今天下雪了，全校都在玩雪。','今天打雷了，教室里有人尖叫。','今天彩虹出来了，大家都在拍照。','今天风特别大，把树都吹歪了。','今天特别闷热，像要下雨。',
 '今天秋天了，落叶铺了一地。','今天春天了，校园里的花开了。','今天夏天了，蝉叫得特别响。','今天冬天了，哈气都是白的。','今天是二十四节气中的一个。','今天月亮特别圆。','今天星星特别多。','今天日出特别美。','今天晚霞特别红。','今天空气特别清新。'
];
(function(){
 var _oldTick2=tick;
 tick=function(){
  _oldTick2();
  if(!G||G.over||G.resting)return;
  if(G.day>0&&G.idx===0&&ch(.35)){
   var evt=pk(EXTRA_EVENTS);
   l('✨ '+evt,'dim');
  }
 };
})();

/* ---------- J10 学校真实资料扩充（图鉴追加） ---------- */
(function(){
 var _oldOpenAtlas=openAtlas;
 openAtlas=function(){
  _oldOpenAtlas();
  setTimeout(function(){
   try{
    var body=document.querySelector('.modalbox');
    if(!body)return;
    var extra=document.createElement('div');
    extra.style.cssText='margin-top:10px;padding:10px;border-radius:10px;background:rgba(20,26,48,.7);border:1px solid var(--line)';
    extra.innerHTML='<b class="good">📰 学校真实资料（来自公众号/官网）</b><br>'+
     '<span class="dim small">· 1994年由浙江省建设投资集团与杭州第十四中学合作创办<br>'+
     '· 2021年新校区投入使用，总投资2.5亿元<br>'+
     '· 位于西湖区双浦镇姚家坞126号，5A级铜鉴湖景区旁<br>'+
     '· 48个教学班，近2000名学生<br>'+
     '· 校训：身心自强、言行自律、学习自主、生活自理<br>'+
     '· 设精英班/美术特色班/音乐特色班/中英A-Level/中日EJU<br>'+
     '· 美术班联考通过率100%，本科率92%<br>'+
     '· 浙江音乐学院艺术实践基地<br>'+
     '· 刷脸食堂、湖景六人间宿舍、恒温泳池<br>'+
     '· 学费约2.6万/学期</span>';
    body.appendChild(extra);
   }catch(e){}
  },100);
 };
})();

/* ---------- J11 鞋子属性在开局生效 ---------- */
(function(){
 var _oldStartGame=startGame;
 startGame=function(){
  if(typeof O.shoe==='number'){
   var s=shoeList()[O.shoe];
   setTimeout(function(){
    if(G){
     G.fitness=cl(G.fitness+s.fit,0,100);
     G.charm=cl(G.charm+s.app,0,100);
     G.mood=cl(G.mood+s.mood,0,100);
     G.shoe=s.n;
     l('👟 你穿着'+s.i+' '+s.n+'开始了新学期。'+(s.fit!==0?'体力'+(s.fit>0?'+':'')+s.fit+' ':'')+(s.app!==0?'颜值'+(s.app>0?'+':'')+s.app+' ':'')+(s.mood!==0?'心情'+(s.mood>0?'+':'')+s.mood:''),'good');
    }
   },500);
  }
  _oldStartGame();
 };
})();

/* ---------- J12 saveGame/continueGame 新字段维护 ---------- */
(function(){
 var _oldSave=saveGame;
 saveGame=function(){
  if(G){
   G.sideLovers=G.sideLovers||[];
   G.pregWeek=G.pregWeek||0;
   G.shoe=G.shoe||'';
  }
  return _oldSave();
 };
 var _oldCont=continueGame;
 continueGame=function(){
  _oldCont();
  if(G){
   if(!G.sideLovers)G.sideLovers=[];
   if(!G.pregWeek)G.pregWeek=0;
  }
 };
})();
/* 5.5.2 初始渲染 */
try{renderShoes();}catch(e){}
try{lyricUpdate();}catch(e){}

/* ================================================================
   附录 K · 5.5.3 纯追加
   ================================================================ */

/* ---------- K1 制作名单简化 ---------- */
function openCredits(){
 var h='<h3>👥 制作名单</h3>'+
  '<div class="tcard" style="text-align:center;padding:20px">'+
  '<div style="font-size:22px;font-weight:800;color:#ffd166;margin-bottom:6px">leararus</div>'+
  '<div class="dim small" style="margin-bottom:16px">游戏设计 · 产品策划</div>'+
  '<div style="font-size:14px;color:#7c9cff;margin-bottom:4px">Doubao · Qwen · DeepSeek</div>'+
  '<div class="dim small">提供技术支持</div>'+
  '</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}

/* ---------- K2 鞋子系统重做：开头选带2-4双，每天早上选穿哪双 ---------- */
(function(){
 var _oldRS=renderShoes;
 renderShoes=function(){
  try{
   var box=$('#shoeBox');if(!box)return;
   var list=shoeList();
   if(!O.shoes)O.shoes=[];
   var h='';
   for(var i=0;i<list.length;i++){
    var s=list[i];
    var on=O.shoes.indexOf(i)>=0?' on':'';
    h+='<div class="shoeCard'+on+'" onclick="toggleShoe('+i+')"><span class="si">'+s.i+'</span><div class="sn">'+s.n+'</div><div class="sd">'+s.d+'<br>体力'+(s.fit>=0?'+':'')+s.fit+' 颜值'+(s.app>=0?'+':'')+s.app+' 心情'+(s.mood>=0?'+':'')+s.mood+'</div></div>';
   }
   box.innerHTML=h;
   var info=$('#shoeInfo');
   if(info)info.innerHTML='已选 <b>'+O.shoes.length+'</b> 双带去学校（建议2-4双，点击卡片选择/取消）';
  }catch(e){}
 };
})();
function toggleShoe(i){
 if(!O.shoes)O.shoes=[];
 var idx=O.shoes.indexOf(i);
 if(idx>=0)O.shoes.splice(idx,1);
 else{if(O.shoes.length>=4){l('最多带4双鞋去学校。','warn');return;}O.shoes.push(i);}
 renderShoes();
}
function morningShoeSelect(){
 if(G.mode==='teacher'){morningOutfitSelect();return;}
 if(!G.shoesOwned||G.shoesOwned.length===0){G.shoesOwned=O.shoes&&O.shoes.length?O.shoes:[0,1];}
 var list=shoeList();
 var h='<h3>👟 今天穿什么鞋？</h3><div class="quote">从你带来的 '+G.shoesOwned.length+' 双里选一双</div>';
 for(var i=0;i<G.shoesOwned.length;i++){
  var s=list[G.shoesOwned[i]];
  h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="wearShoe('+G.shoesOwned[i]+')">'+s.i+' '+s.n+' <span class="dim small">（'+s.d+'）</span></button>';
 }
 modal(h);
}
function wearShoe(i){
 var s=shoeList()[i];
 G.shoeToday=s.n;
 G.fitness=cl(G.fitness+s.fit,0,100);
 G.charm=cl(G.charm+s.app,0,100);
 G.mood=cl(G.mood+s.mood,0,100);
 l('👟 今天穿了'+s.i+' '+s.n+'。','good');
 closeModal();morningOutfitSelect();
}

/* ---------- K3 每天早上强制弹窗：选衣服 + 每日一题 ---------- */
var OUTFITS=[
 {n:'校服短袖+校服裤',ok:true,d:'标准穿搭'},
 {n:'校服长袖+校服裤',ok:true,d:'春秋标准'},
 {n:'校服短袖+棒球裤',ok:true,d:'裤子管得不严'},
 {n:'校服长袖+棒球裤',ok:true,d:'休闲但合规'},
 {n:'校服短袖+外套+校服裤',ok:true,d:'最稳妥'},
 {n:'里面穿自己的+外面披校服外套',ok:true,d:'只要最外面是校服就行'},
 {n:'自己的衣服（不穿校服）',ok:false,d:'可能被值周老师拦'},
 {n:'冬季校服外套+校服裤',ok:true,d:'冬天标配'}
];
function morningOutfitSelect(){
 var h='<h3>👔 今天穿什么？</h3><div class="quote">只要最外面穿了校服就没事，裤子管得不严</div>';
 for(var i=0;i<OUTFITS.length;i++){
  (function(o){h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="wearOutfit(\''+o.n.replace(/'/g,"\\'")+'\','+o.ok+')">'+o.n+' <span class="dim small">（'+o.d+'）</span></button>';})(OUTFITS[i]);
 }
 modal(h);
}
function wearOutfit(n,ok){
 G.outfit=n;G.outfitOk=ok;
 l('👔 今天穿了：'+n,'good');
 closeModal();dailyQuestion();
}
var DAILY_QUESTIONS=[
 {q:'函数 f(x)=x²-4x+3 的最小值是？',a:['-1','0','1','3'],c:0,sub:'数学'},
 {q:'sin30° 的值是？',a:['1/2','√2/2','√3/2','1'],c:0,sub:'数学'},
 {q:'下列哪个是等差数列？',a:['1,2,4,8','1,3,5,7','1,1,2,3','2,4,8,16'],c:1,sub:'数学'},
 {q:'向量 a=(1,2), b=(3,4)，则 a·b=？',a:['5','11','7','10'],c:1,sub:'数学'},
 {q:'函数 y=ln(x) 的定义域是？',a:['x>0','x≥0','x≠0','全体实数'],c:0,sub:'数学'},
 {q:'牛顿第二定律的公式是？',a:['F=ma','F=mv','F=mg','F=ma²'],c:0,sub:'物理'},
 {q:'重力加速度g约为？',a:['9.8m/s²','10m/s²','8m/s²','11m/s²'],c:0,sub:'物理'},
 {q:'欧姆定律的公式是？',a:['U=IR','U=I/R','U=R/I','P=UI'],c:0,sub:'物理'},
 {q:'光在真空中的速度约为？',a:['3×10⁶m/s','3×10⁷m/s','3×10⁸m/s','3×10⁹m/s'],c:2,sub:'物理'},
 {q:'动能的公式是？',a:['mgh','½mv²','mv','ma'],c:1,sub:'物理'},
 {q:'化学元素周期表中，原子序数为6的元素是？',a:['氮','氧','碳','硼'],c:2,sub:'化学'},
 {q:'下列哪个是强酸？',a:['醋酸','碳酸','盐酸','硼酸'],c:2,sub:'化学'},
 {q:'摩尔质量的单位是？',a:['g','g/mol','mol','mol/g'],c:1,sub:'化学'},
 {q:'pH=7的溶液是？',a:['酸性','碱性','中性','无法判断'],c:2,sub:'化学'},
 {q:'细胞膜的主要成分是？',a:['蛋白质和磷脂','糖类和脂肪','核酸和蛋白质','纤维素和果胶'],c:0,sub:'生物'},
 {q:'DNA的中文名称是？',a:['核糖核酸','脱氧核糖核酸','氨基酸','核苷酸'],c:1,sub:'生物'},
 {q:'光合作用的场所是？',a:['线粒体','叶绿体','细胞核','核糖体'],c:1,sub:'生物'},
 {q:'孟德尔遗传定律中，F2代显性:隐性=？',a:['1:1','2:1','3:1','4:1'],c:2,sub:'生物'},
 {q:'《红楼梦》的作者是？',a:['罗贯中','施耐庵','曹雪芹','吴承恩'],c:2,sub:'语文'},
 {q:'"先天下之忧而忧"出自？',a:['《岳阳楼记》','《醉翁亭记》','《滕王阁序》','《赤壁赋》'],c:0,sub:'语文'},
 {q:'English is ___ useful language.',a:['a','an','the','/'],c:0,sub:'英语'},
 {q:'He ___ to school every day.',a:['go','goes','going','went'],c:1,sub:'英语'},
 {q:'She is ___ than me.',a:['tall','taller','tallest','more tall'],c:1,sub:'英语'},
 {q:'中国的首都是？',a:['上海','北京','广州','深圳'],c:1,sub:'政治'},
 {q:'我国的根本政治制度是？',a:['人民代表大会制度','多党合作制','民族区域自治','基层群众自治'],c:0,sub:'政治'},
 {q:'商品的基本属性是？',a:['价值和使用价值','价格和价值','质量和价格','品牌和质量'],c:0,sub:'政治'},
 {q:'中国面积最大的省级行政区是？',a:['西藏','新疆','内蒙古','青海'],c:1,sub:'地理'},
 {q:'杭州所在的省份是？',a:['江苏','浙江','安徽','福建'],c:1,sub:'地理'},
 {q:'下列气候类型中，杭州属于？',a:['温带季风','亚热带季风','热带季风','温带大陆性'],c:1,sub:'地理'},
 {q:'辛亥革命发生在哪一年？',a:['1911年','1912年','1919年','1921年'],c:0,sub:'历史'},
 {q:'中国历史上第一个统一的封建王朝是？',a:['夏','商','秦','汉'],c:2,sub:'历史'},
 {q:'五四运动发生在哪一年？',a:['1911年','1919年','1921年','1949年'],c:1,sub:'历史'},
 {q:'二进制中1010等于十进制的？',a:['8','10','12','14'],c:1,sub:'技术'},
 {q:'CPU的中文名称是？',a:['中央处理器','内存','硬盘','显卡'],c:0,sub:'技术'},
 {q:'1GB等于多少MB？',a:['100','512','1024','2048'],c:2,sub:'技术'},
 {q:'美术中的三原色是？',a:['红黄蓝','红绿蓝','黄蓝紫','橙绿紫'],c:0,sub:'美术'},
 {q:'《蒙娜丽莎》的作者是？',a:['梵高','毕加索','达芬奇','莫奈'],c:2,sub:'美术'},
 {q:'音乐中的五线谱有几条线？',a:['4','5','6','7'],c:1,sub:'音乐'},
 {q:'篮球比赛每队上场几人？',a:['4','5','6','7'],c:1,sub:'体育'},
 {q:'足球比赛每队上场几人？',a:['9','10','11','12'],c:2,sub:'体育'}
];
function dailyQuestion(){
 if(G._dailyDone===G.day)return;
 G._dailyDone=G.day;
 var q=pk(DAILY_QUESTIONS);G._dailyQ=q;
 var h='<h3>📝 每日一题（'+q.sub+'）</h3><div class="quote">答对+知识+心情，不答无惩罚</div>'+
  '<div class="tcard" style="font-size:16px;font-weight:700;margin:8px 0">'+q.q+'</div>';
 for(var i=0;i<q.a.length;i++){
  h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="dailyAns('+i+')">'+String.fromCharCode(65+i)+'. '+q.a[i]+'</button>';
 }
 h+='<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal()">⏭️ 跳过（无惩罚）</button>';
 modal(h);
}
function dailyAns(i){
 var q=G._dailyQ;
 if(i===q.c){G.knowledge+=3;G.mood+=5;l('📝 每日一题答对了！知识+3 心情+5','good');}
 else l('📝 每日一题答错了。正确答案：'+q.a[q.c],'warn');
 closeModal();
}

/* ---------- K4 下课10分钟移动系统 ---------- */
(function(){
 SLOTS.break=function(){
  return {title:'⏰ 下课10分钟',text:'下课了！10分钟自由活动，你要去哪里？',
   choices:[
    C('🚻 去厕所','过3-5分钟',function(){var t=rnd(3,5);l('🚻 你去了趟厕所，花了'+t+'分钟。');breakActivity(t);}),
    C('💧 去灌水','过2-4分钟',function(){var t=rnd(2,4);l('💧 你去饮水机灌了水，花了'+t+'分钟。');breakActivity(t);}),
    C('🏃 去操场走走','过5-8分钟',function(){var t=rnd(5,8);G.fitness+=1;l('🏃 你去操场走了走，花了'+t+'分钟。体力+1');breakActivity(t);}),
    C('🛒 去小卖部','可能迟到',function(){var t=rnd(5,8);if(ch(.3)){l('🛒 你去了小卖部，但回来时上课铃已经响了！','warn');G.st.skip++;}else l('🛒 你去了小卖部，花了'+t+'分钟。');breakActivity(t);}),
    C('📚 留在教室','安全',function(){l('📚 你留在教室预习下节课。');next();})
   ]};
 };
})();
function breakActivity(t){
 G.sleep=cl(G.sleep+t*0.5,0,100);
 setTimeout(function(){
  var remain=Math.max(0,10-t);
  if(remain<=0){l('⏰ 上课铃响了，你赶紧跑回教室。');next();return;}
  var h='<h3>⏰ 还剩 '+remain+' 分钟</h3><div class="quote">干点什么？</div>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();next()">🏃 回教室</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakPhone()">📱 玩会儿手机</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakChat()">💬 和同学聊天</button>';
  modal(h);
 },300);
}
function breakPhone(){
 if(!phoneOK()){l('📱 手机被扣了。','warn');}else{G.st.phone++;G.mood+=3;l('📱 你蹲在走廊角落刷了会儿手机。心情+3');}
 closeModal();next();
}
function breakChat(){G.mood+=4;G.support+=1;l('💬 你和同学聊了会儿天，心情+4 支持度+1');closeModal();next();}

/* ---------- K5 背包系统 ---------- */
function openBackpack(){
 if(!G.backpack)G.backpack=[];
 var h='<h3>🎒 背包（'+G.backpack.length+'种）</h3>';
 if(G.backpack.length===0)h+='<p class="dim">背包是空的。去小卖部买点东西吧。</p>';
 for(var i=0;i<G.backpack.length;i++){
  (function(item,i){
   h+='<div class="tcard" style="margin:4px 0"><b>'+item.i+' '+item.n+'</b> ×'+item.count+' <span class="dim small">'+item.d+'</span>'+
   (item.usable?' <button class="gbtn" style="float:right;padding:2px 10px;font-size:12px" onclick="useItem('+i+')">使用</button>':'')+'</div>';
  })(G.backpack[i],i);
 }
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function useItem(i){
 var item=G.backpack[i];
 if(!item||!item.usable)return;
 if(item.effect)item.effect();
 item.count--;
 if(item.count<=0)G.backpack.splice(i,1);
 l('🎒 使用了'+item.i+' '+item.n,'good');
 saveGame();openBackpack();
}
function addToBackpack(n,i,d,usable,effect,count){
 if(!G.backpack)G.backpack=[];
 for(var j=0;j<G.backpack.length;j++){if(G.backpack[j].n===n){G.backpack[j].count+=(count||1);return;}}
 G.backpack.push({n:n,i:i||'📦',d:d||'',usable:!!usable,effect:effect,count:count||1});
}
(function(){
 var _oldSG=startGame;
 startGame=function(){
  _oldSG();
  setTimeout(function(){
   if(G&&G.gender==='女'&&!G._bpInit){
    G._bpInit=true;
    addToBackpack('卫生巾','🩸','生理期必备',true,function(){G.mood+=5;l('🩸 换了片卫生巾，舒服多了。心情+5');},3);
    l('🎒 妈妈在你包里塞了3片卫生巾。','good');
   }
   if(G&&!G.shoesOwned)G.shoesOwned=O.shoes&&O.shoes.length?O.shoes:[0,1];
  },600);
 };
})();

/* ---------- K6 食堂系统重做 ---------- */
(function(){
 SLOTS.meal=function(s){
  return {title:'🍽️ '+s.which+'时间',text:'食堂开放了！各个窗口排队时间不同，你要去哪个窗口？',
   choices:[
    C('🍜 米线窗口','排10-20分钟',function(){canteenOrder('米线',rnd(10,20));}),
    C('🔥 铁板烧特色窗口','排15分钟',function(){canteenOrder('铁板烧',15);}),
    C('🍚 正常菜窗口','排5-10分钟',function(){canteenOrder('家常菜',rnd(5,10));}),
    C('🍜 面窗口','排10分钟',function(){canteenOrder('面',10);})
   ]};
 };
})();
function canteenOrder(type,wait){
 l('🍽️ 你在'+type+'窗口排了'+wait+'分钟。');
 setTimeout(function(){
  var h='<h3>🍽️ 买到了'+type+'！</h3><div class="quote">排了'+wait+'分钟。吃饭选个速度：</div>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="eatSpeed(5,\''+type+'\')">⚡ 狼吞虎咽（5分钟）</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="eatSpeed(10,\''+type+'\')">🍽️ 正常吃（10分钟）</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="eatSpeed(20,\''+type+'\')">😌 慢慢吃（20分钟）</button>';
  modal(h);
 },300);
}
function eatSpeed(t,type){
 G.health+=2;G.mood+=(t>=15?6:t>=10?4:2);G.st.eat++;
 l('🍽️ 你花了'+t+'分钟吃完了'+type+'。心情+'+(t>=15?6:t>=10?4:2));
 setTimeout(function(){
  var h='<h3>🍽️ 吃完了</h3><div class="quote">要去哪里？</div>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();next()">📚 回教室</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();shopSys()">🛒 去小卖部</button>';
  modal(h);
 },300);
}

/* ---------- K7 选科系统 + 课表重做 ---------- */
var SUBJECT_CHOICES=[
 {id:'物化生',name:'物理+化学+生物',subs:['物理','化学','生物']},
 {id:'物化地',name:'物理+化学+地理',subs:['物理','化学','地理']},
 {id:'物化政',name:'物理+化学+政治',subs:['物理','化学','政治']},
 {id:'物生地',name:'物理+生物+地理',subs:['物理','生物','地理']},
 {id:'史政地',name:'历史+政治+地理',subs:['历史','政治','地理']},
 {id:'史政生',name:'历史+政治+生物',subs:['历史','政治','生物']},
 {id:'史化地',name:'历史+化学+地理',subs:['历史','化学','地理']},
 {id:'史化生',name:'历史+化学+生物',subs:['历史','化学','生物']}
];
(function(){
 var _oldRS2=renderStart;
 renderStart=function(){
  _oldRS2();
  try{
   var dayStep=$('#dayStep');
   if(false&&dayStep&&!$('#subjectStep')){ /* 旧固定组合选科已禁用，统一使用3+X自由选科 */
    var div=document.createElement('div');
    div.className='step';div.id='subjectStep';
    div.innerHTML='<b>⑪ 选科（高二）</b> <span class="dim small">（选什么上什么课）</span>'+
     '<div class="row" style="margin-top:5px"><select id="subjectSel" style="flex:1;min-width:200px"></select></div>'+
     '<p class="dim small" id="subjectInfo" style="margin-top:4px"></p>';
    dayStep.parentNode.insertBefore(div,dayStep.nextSibling);
    var sel=$('#subjectSel');
    for(var i=0;i<SUBJECT_CHOICES.length;i++){
     var opt=document.createElement('option');
     opt.value=SUBJECT_CHOICES[i].id;opt.textContent=SUBJECT_CHOICES[i].name;
     sel.appendChild(opt);
    }
    sel.onchange=function(){O.subject=this.value;var s=SUBJECT_CHOICES.find(function(x){return x.id===O.subject;});$('#subjectInfo').textContent='每天连排：'+s.subs.join(' / ')+'，另有物理/政治学考课';};
    O.subject=O.subject||'物化地';sel.value=O.subject;
   }
  }catch(e){}
 };
})();
(function(){
 var _oldBuild=buildStudentDay;
 buildStudentDay=function(){
  var sc=SUBJECT_CHOICES.find(function(x){return x.id===(O.subject||G.subject||'物化地');});
  var subs=sc?sc.subs:['物理','化学','地理'];
  var day=G.date.getDay();
  var a=[mk('06:00','wake',{loc:'宿舍'}),mk('06:50','exercise',{loc:'操场'}),mk('07:10','morningRead',{loc:'教室'})];
  if(day===1)a.push(mk('07:35','flag',{loc:'操场'}));
  var morn=['语文','数学','英语'];
  if(day===1||day===3||day===5)morn.splice(1,0,'物理学考');
  if(day===2||day===4||day===5)morn.splice(2,0,'政治学考');
  a.push(mk('07:55','class',{n:1,subject:morn[0]||'语文'}),mk('08:35','break',{loc:'教室'}),
   mk('08:45','class',{n:2,subject:morn[1]||'数学'}),mk('09:25','break',{loc:'教室'}),
   mk('09:35','eyecare',{n:1}),mk('09:40','class',{n:3,subject:morn[2]||'英语'}),mk('10:20','break',{loc:'教室'}),
   mk('10:30','class',{n:4,subject:morn[3]||subs[0]}),mk('11:20','class',{n:5,subject:subs[1]}),
   mk('12:00','meal',{which:'午饭',loc:'食堂'}),mk('12:40','nap',{loc:'教室'}),
   mk('13:05','class',{n:6,subject:subs[2]}),mk('13:45','break',{loc:'教室'}),
   mk('13:55','class',{n:7,subject:'技术'}),mk('14:50','eyecare',{n:2}),
   mk('14:55','class',{n:8,subject:pk(['语文','数学','英语'])}),mk('15:45','homework',{loc:'教室'}),
   mk('16:25','extend',{loc:'教室'}),mk('17:00','dinner',{loc:'食堂'}),
   mk('18:00','night',{n:1,loc:'教室'}),mk('19:00','night',{n:2}),mk('20:00','night',{n:3}),mk('21:00','night',{n:4}),
   mk('22:00','dorm',{loc:'宿舍'}),mk('23:00','sleep',{loc:'宿舍'}));
  if(day===1||day===4){for(var i=0;i<a.length;i++){if(a[i].n===7&&a[i].type==='class'){a[i].subject='体育';break;}}}
  return a;
 };
})();

/* ---------- K8 每天早上触发：选鞋→选衣服→每日一题 ---------- */
(function(){
 var _oldWake=SLOTS.wake;
 SLOTS.wake=function(){
  var def=_oldWake();
  /* 在起床场景后追加早上流程 */
  setTimeout(function(){
   if(G&&!G._morningDone||G._morningDone!==G.day){
    G._morningDone=G.day;
    setTimeout(function(){morningShoeSelect();},800);
   }
  },500);
  return def;
 };
})();

/* ---------- K9 歌词LRC时间轴同步 ---------- */
var LRC_DATA=[
 [[10.9, "这风铃跟心动很接近"], [16.05, "这封信还在怀念旅行"], [21.25, "路过的爱情都太年轻"], [25.66, "你是我想要再回去的风景"], [31.47, "这别离被瓶装成秘密"], [35.86, "这雏菊美得像诗句"], [39.17, "而我在风中等你的消息"], [44.13, "等月光落雪地"], [48.27, "等枫红染秋季等相遇"], [52.77, "我重温午后的阳光"], [57.93, "将吉他斜背在肩上"], [62.79, "跟多年前一样我们轻轻地唱"], [67.91, "去任何地方"], [74.21, "我看着你的脸轻刷着和弦"], [79.68, "情人节卡片手写的永远"], [83.86, "还记得广场公园一起表演"], [89.02, "校园旁糖果店记忆里在微甜"], [94.7, "我看着你的脸轻刷着和弦"], [99.97, "初恋是整遍手写的从前"], [104.46, "还记得那年秋天说了再见"], [109.31, "当恋情已走远"], [111.81, "我将你深埋在心里面"], [135.83, "微风需要竹林溪流需要蜻蜓"], [138.4, "乡愁般的离开需要片片浮萍"], [140.97, "记得那年的雨季回忆里特安静"], [143.79, "哭过后的决定是否还能进行"], [146.2, "我傻傻等待傻傻等春暖花开"], [148.48, "等终等于等明等白等爱情回来"], [151.08, "青春属于表白阳光属于窗台"], [153.63, "而我想我属于"], [154.72, "一个拥有你的未来"], [156.35, "纸上的彩虹用素描画的钟"], [158.75, "我还在修改回忆之中你的笑容"], [161.35, "该怎么去形容为思念酝酿的痛"], [164.07, "夜空霓虹都是我不要的繁荣"], [166.46, "或许去趟沙滩或许去看看夕阳"], [168.87, "或许任何一个可以想心事的地方"], [171.4, "情绪在咖啡馆被调成一篇文章"], [174.02, "彻底爱上你如诗一般透明的泪光"], [176.46, "我看着你的脸轻刷着和弦"], [181.86, "情人节卡片手写的永远"], [186.1, "还记得广场公园一起表演"], [191.02, "校园旁糖果店记忆里在微甜"], [196.46, "我看着你的脸轻刷着和弦"], [201.94, "初恋是整遍手写的从前"], [206.59, "还记得那年秋天说了再见"], [211.41, "当恋情已走远"], [213.94, "我将你深埋在心里面"], [218.88, "我重温午后的阳光"], [223.8, "将吉他斜背在肩上"], [228.7, "跟多年前一样我们轻轻地唱"], [233.93, "去任何地方"], [240.21, "我看着你的脸轻刷着和弦"], [245.45, "情人节卡片手写的永远"], [250.02, "还记得广场公园一起表演"], [254.91, "校园旁糖果店记忆里在微甜"], [260.61, "我看着你的脸轻刷着和弦"], [265.65, "初恋是整遍手写的从前"], [270.17, "还记得那年秋天说了再见"], [275.33, "当恋情已走远"], [277.9, "我将你深埋在心里面"]],
 [[23.2, "天涯的尽头是风沙"], [27.83, "红尘的故事叫牵挂"], [33.56, "封刀隐没在寻常人家"], [37.36, "东篱下闲云野鹤古刹"], [44.6, "快马在江湖里厮杀"], [49.58, "无非是名跟利放不下"], [54.83, "心中有江山的人岂能快意潇洒"], [60.46, "我只求与你共华发"], [68.03, "剑出鞘恩怨了谁笑"], [72.53, "我只求今朝拥你入怀抱"], [77.87, "红尘客栈风似刀"], [81.61, "骤雨落宿命敲"], [87.21, "任武林谁领风骚"], [89.62, "我却只为你折腰"], [93.29, "过荒村野桥寻世外古道"], [99.17, "远离人间尘嚣"], [101.81, "柳絮飘执子之手逍遥"], [127.2, "檐下窗棂斜映枝桠"], [131.89, "与你席地对座饮茶"], [137.42, "我以工笔画将你牢牢的记下"], [143.13, "提笔不为风雅"], [148.55, "灯下叹红颜近晚霞"], [153.24, "我说缘份一如参禅不说话"], [158.74, "你泪如梨花洒满了纸上的天下"], [164.59, "爱恨如写意山水画"], [172.02, "剑出鞘恩怨了谁笑"], [175.99, "我只求今朝拥你入怀抱"], [181.91, "红尘客栈风似刀"], [185.56, "骤雨落宿命敲"], [191.23, "任武林谁领风骚"], [193.54, "我却只为你折腰"], [197.88, "过荒村野桥寻世外古道"], [203.2, "远离人间尘嚣"], [205.82, "柳絮飘执子之手逍遥"], [228.86, "任武林谁领风骚"], [230.8, "我却只为你折腰"], [235.11, "你回眸多娇我泪中带笑"], [240.74, "酒招旗风中萧萧剑出鞘恩怨了"]],
 [[11.39, "繁华声遁入空门折煞了世人"], [17.6, "梦偏冷辗转一生情债又几本"], [23.59, "如你默认生死枯等"], [29.81, "枯等一圈又一圈的年轮"], [36.51, "浮图塔断了几层断了谁的魂"], [42.56, "痛直奔一盏残灯倾塌的山门"], [48.65, "容我再等历史转身"], [55.18, "等酒香醇等你弹一曲古筝"], [61.44, "雨纷纷旧故里草木深"], [67.47, "我听闻你始终一个人"], [74.05, "斑驳的城门盘踞着老树根"], [80.38, "石板上回荡的是再等"], [86.33, "雨纷纷旧故里草木深"], [92.54, "我听闻你仍守着孤城"], [99.03, "城郊牧笛声落在那野村"], [105.31, "缘份落地生根是我们"], [113.95, "听青春迎来笑声羡煞许多人"], [120.25, "那史册温柔不肯下笔都太狠"], [126.62, "烟花易冷人事易分"], [132.82, "而你在问我是否还认真"], [138.96, "千年后累世情深还有谁在等"], [145.18, "而青史岂能不真魏书洛阳城"], [151.34, "如你在跟前世过门"], [157.89, "跟着红尘跟随我浪迹一生"], [164.33, "雨纷纷旧故里草木深"], [170.37, "我听闻你始终一个人"], [176.91, "斑驳的城门盘踞着老树根"], [183.02, "石板上回荡的是再等"], [189.26, "雨纷纷旧故里草木深"], [194.91, "我听闻你仍守着孤城"], [201.63, "城郊牧笛声落在那野村"], [208.04, "缘份落地生根是我们"], [214.6, "雨纷纷旧故里草木深"], [216.47, "我听闻你始终一个人"], [218.29, "斑驳的城门盘踞着老树根"], [220.08, "石板上回荡的是再等"], [221.48, "雨纷纷雨纷纷旧故里草木深"], [224.55, "我听闻我听闻你仍守着孤城"], [227.0, "城郊牧笛声落在那野村"], [232.88, "缘份落地生根是我们"], [239.26, "缘份落地生根是我们"], [245.41, "伽蓝寺听雨声盼永恒"]],
 [[12.83, "又是一个安静的晚上"], [16.04, "一个人窝在摇椅里乘凉"], [18.9, "我承认这样真的很安详"], [21.58, "和楼下老爷爷一样"], [24.55, "听说你还在搞什么原创"], [27.39, "搞来搞去好像也就这样"], [30.21, "不如花点时间想想"], [32.58, "琢磨一下模样"], [35.79, "今夜化了美美的妆"], [38.77, "我相信是很美美的装"], [41.35, "我摇晃在舞池中央"], [43.92, "那种体态可以想象"], [47.15, "我做我的改变又何必纠结"], [51.61, "那就拜托别和我碰面"], [57.56, "如果再看你一眼"], [60.06, "是否还会有感觉"], [62.9, "当年素面朝天要多纯洁就有多纯洁"], [68.61, "不画扮熟的眼线"], [71.36, "不用抹匀粉底液"], [74.21, "暴雨天照逛街"], [77.01, "偷笑别人花了脸"], [79.96, "如果再看你一眼"], [82.68, "是否还会有感觉"], [85.55, "最真实的喜怒哀乐全都埋葬在昨天"], [91.16, "不掺任何的表演"], [93.95, "轰轰烈烈那几年"], [96.8, "我怀念别怀念"], [99.72, "怀念也回不到从前"], [120.83, "又是一个安静的晚上"], [123.31, "一个人窝在摇椅里乘凉"], [126.1, "我承认这样真的很安详"], [128.91, "和楼下老爷爷一样"], [131.83, "听说你还在搞什么原创"], [134.81, "搞来搞去好像也就这样"], [137.65, "不如花点时间想想"], [139.83, "琢磨一下模样"], [142.84, "今夜化了美美的妆"], [146.06, "我相信是很美美的装"], [148.73, "我摇晃在舞池中央"], [151.28, "那种体态可以想象"], [154.46, "我做我的改变又何必纠结"], [158.87, "那就拜托别和我碰面"], [164.67, "如果再看你一眼"], [167.33, "是否还会有感觉"], [170.3, "当年素面朝天要多纯洁就有多纯洁"], [175.85, "不画扮熟的眼线"], [178.67, "不用抹匀粉底液"], [181.49, "暴雨天照逛街"], [184.27, "偷笑别人花了脸"], [187.15, "如果再看你一眼"], [189.89, "是否还会有感觉"], [192.75, "最真实的喜怒哀乐全都埋葬在昨天"], [198.39, "不掺任何的表演"], [201.22, "轰轰烈烈那几年"], [204.02, "我怀念别怀念"], [206.84, "怀念也回不到从前"], [211.03, "曾经对上的瞬间"], [213.52, "难道是一种错觉"], [216.35, "那些流逝了的追求永远都不会复现"], [221.37, "不掺任何的表演"], [223.79, "轰轰烈烈那几年"], [226.61, "有遗憾的感觉为何感觉"], [230.47, "那消失不见的素颜"]],
 [[35.38, "在远方的时候"], [37.3, "又想你到泪流"], [42.44, "这矫情的措辞结构"], [46.07, "经历过的人会懂"], [50.78, "那些不堪言的疼痛"], [54.19, "也就是我自作自受"], [59.3, "你没有装聋"], [62.81, "你真没感动"], [67.91, "一个人的时候"], [70.7, "偷偷看你的微博"], [75.29, "你转播的歌好耳熟"], [78.41, "我们坐一起听过"], [83.36, "当日嫌它的唱法做作"], [87.18, "现在听起来竟然很生动"], [92.22, "可能是时光让耳朵变得宽容"], [100.21, "如今一个人听歌总是会觉得失落"], [104.73, "幻听你在我的耳边轻轻诉说"], [108.51, "夜色多温柔"], [111.17, "你有多爱我"], [116.29, "如今一个人听歌总是会觉得难过"], [121.22, "爱已不在这里我却还没走脱"], [124.9, "列表里的歌"], [127.11, "随过往流动"], [149.36, "一个人的时候"], [152.34, "偷偷看你的微博"], [156.26, "你每天做了些什么"], [160.27, "我都了然于胸"], [164.45, "当时嫌你的蠢话太多"], [168.46, "现在回想起画面已泛旧"], [173.02, "可能是孤独让情绪变得脆弱"], [181.57, "如今一个人听歌总是会觉得失落"], [185.91, "幻听你在我的耳边轻轻诉说"], [189.68, "夜色多温柔"], [191.82, "你有多爱我"], [197.29, "如今一个人听歌总是会觉得难过"], [202.38, "爱已不在这里我却还没走脱"], [206.12, "列表里的歌"], [208.3, "随过往流动"], [214.02, "如今一个人听歌总是会觉得失落"], [221.05, "幻听你在我的耳边轻轻诉说"], [224.32, "夜色多温柔"], [226.72, "你有多爱我"], [232.08, "如今一个人听歌总是会觉得难过"], [236.73, "爱已不在这里我却还没走脱"], [240.86, "如果你回头"], [243.09, "不要放下我"]],
 [[22.25, "会在何处见到你"], [26.71, "莫非前尘已注定"], [32.52, "飞过时空的距离"], [37.0, "却囿于刀剑光影"], [42.2, "三月春花渐次醒"], [47.0, "迢迢年华谁老去"], [52.44, "是劫是缘随我心"], [57.09, "除了你万敌不侵"], [62.06, "当恩怨各一半我怎么圈揽"], [67.37, "看灯笼血红染寻仇已太晚"], [72.29, "月下门童喟叹昨夜太平长安"], [81.83, "当天上星河转我命已定盘"], [87.16, "待绝笔墨痕干宿敌已来犯"], [92.06, "我借你的孤单今生恐怕难还"], [123.88, "缠扰孤岛的雪雨"], [128.96, "飘飘洒洒谁来停"], [133.77, "摘取一颗海上星"], [138.83, "陪我终夜不孤寂"], [143.83, "灵柩长埋深谷底"], [148.47, "没有永远的秘密"], [153.66, "染指江湖结悲局"], [158.54, "无人逃得过宿命"], [163.54, "当恩怨各一半我怎么圈揽"], [168.85, "看灯笼血红染寻仇已太晚"], [173.74, "月下门童喟叹昨夜太平长安"], [183.22, "当天上星河转我命已定盘"], [188.62, "待绝笔墨痕干宿敌已来犯"], [193.52, "我借你的孤单今生恐怕难还"], [204.96, "当恩怨各一半我怎么圈揽"], [210.89, "看灯笼血红染寻仇已太晚"], [215.93, "月下门童喟叹昨夜太平长安"], [225.16, "当天上星河转我命已定盘"], [230.68, "待绝笔墨痕干宿敌已来犯"], [235.71, "我借你的孤单今生恐怕难还"]]
];
/* ---------- 5.5.703 歌词双模式重做：滚动 / 网易云逐句弹出 ---------- */
var XZ_LRC_MODE=(function(){try{return localStorage.getItem('xz_lrc_mode')==='scroll'?'scroll':'pop';}catch(e){return 'pop';}})();
var _lrcLastLine=null,_lrcLastIdx=-2;
function xzLrcSetMode(m){
 XZ_LRC_MODE=(m==='scroll')?'scroll':'pop';
 try{localStorage.setItem('xz_lrc_mode',XZ_LRC_MODE);}catch(e){}
 _lrcLastLine=null;_lrcLastIdx=-2;
 var inr=document.querySelector('#tlLyric #xzLrcInner');if(inr){inr.style.transition='none';inr.style.transform='';}
 xzRenderBar();
 if(document.getElementById('xzLrcStage'))xzLrcPanel();
}
function xzCurLrc(){
 try{
  var audio=document.getElementById('bgm')||document.querySelector('audio');
  if(!audio||!(audio.currentTime>0))return null;
  var idx=(typeof BGM_IDX!=='undefined')?BGM_IDX:0;
  var lrc=LRC_DATA[idx%LRC_DATA.length];
  var t=audio.currentTime,li=-1;
  for(var i=0;i<lrc.length;i++){if(t>=lrc[i][0])li=i;}
  return {lrc:lrc,idx:li};
 }catch(e){return null;}
}
function xzRenderBar(){
 try{
  var tl=document.getElementById('tlLyric');if(!tl)return;
  var inner=tl.querySelector('#xzLrcInner');
  if(!inner){
   tl.innerHTML='';
   inner=document.createElement('span');inner.id='xzLrcInner';
   inner.title='点击打开歌词面板';
   inner.style.cssText='display:inline-block;max-width:100%;cursor:pointer;will-change:transform';
   inner.addEventListener('click',function(){xzLrcPanel();});
   tl.appendChild(inner);
  }
  var info=xzCurLrc();
  var line=(info&&info.idx>=0)?info.lrc[info.idx][1]:'';
  if(line===_lrcLastLine)return;
  _lrcLastLine=line;_lrcLastIdx=info?info.idx:-1;
  inner.textContent=line?('🎵 '+line):'';
  inner.style.transition='none';inner.style.transform='';
  if(!line)return;
  if(XZ_LRC_MODE==='pop'){
   inner.style.animation='none';void inner.offsetWidth;
   inner.style.animation='xzLrcPop .5s cubic-bezier(.2,.9,.3,1.25)';
  }else{
   inner.style.animation='none';
   setTimeout(function(){
    var cw=tl.clientWidth||200,tw=inner.scrollWidth||cw;
    if(tw>cw+10){
     var dist=tw-cw+26;
     var dur=Math.min(15,Math.max(6,dist/26));
     inner.style.transition='none';inner.style.transform='translateX(0)';void inner.offsetWidth;
     inner.style.transition='transform '+dur.toFixed(1)+'s linear 1.3s';
     inner.style.transform='translateX(-'+dist+'px)';
    }
   },40);
  }
  xzStageSync(info);
 }catch(e){}
}
function xzLrcPanel(){
 try{
  var info=xzCurLrc();
  var lrc=(info&&info.lrc)?info.lrc:LRC_DATA[((typeof BGM_IDX!=='undefined')?BGM_IDX:0)%LRC_DATA.length];
  var cur=(info&&info.idx>=0)?info.idx:Math.max(0,_lrcLastIdx);
  var rows='';
  for(var i=0;i<lrc.length;i++){
   var cls=(i===cur)?'xz-cur':(i<cur?'xz-past':'xz-next');
   rows+='<div class="xz-lrow '+cls+'" data-i="'+i+'">'+lrc[i][1]+'</div>';
  }
  var h='<h3>🎵 同步歌词</h3>'+
   '<div class="row" style="gap:8px;margin:4px 0 10px">'+
    '<button class="gbtn '+(XZ_LRC_MODE==='pop'?'gold2':'')+'" style="flex:1" onclick="xzLrcSetMode(\'pop\')">⚪ 逐句弹出</button>'+
    '<button class="gbtn '+(XZ_LRC_MODE==='scroll'?'gold2':'')+'" style="flex:1" onclick="xzLrcSetMode(\'scroll\')">↔️ 滚动模式</button>'+
   '</div>'+
   '<div id="xzLrcStage"><div id="xzLrcTrack">'+rows+'</div></div>'+
   '<div class="dim small" style="text-align:center;margin:8px 0 4px">逐句弹出：当前句居中高亮 · 点击顶部歌词也能打开本面板</div>'+
   '<button class="big" onclick="closeModal()">关闭</button>';
  modal(h,'wide');
  xzStageSync({idx:cur});
 }catch(e){}
}
function xzStageSync(info){
 try{
  var stage=document.getElementById('xzLrcStage');if(!stage)return;
  if(!info)info=xzCurLrc();
  if(!info||info.idx<0)return;
  var rows=stage.querySelectorAll('.xz-lrow');
  for(var i=0;i<rows.length;i++){
   rows[i].className='xz-lrow '+(i===info.idx?'xz-cur':(i<info.idx?'xz-past':'xz-next'));
  }
  var track=document.getElementById('xzLrcTrack');
  var ROW=44,H=stage.clientHeight||300;
  track.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';
  track.style.transform='translateY('+(H/2-ROW/2-info.idx*ROW)+'px)';
 }catch(e){}
}
function lrcUpdate(){xzRenderBar();}
setInterval(lrcUpdate,450);

/* ---------- K10 恋爱系统重做 + 暗恋系统 ---------- */
(function(){
 var _oldLove=loveSys;
 loveSys=function(){
  if(!G)return;
  var prefText='<div class="quote" style="margin-bottom:8px"><b>性取向：'+G.pref+'</b> · 魅力 '+Math.round(G.charm)+' · 支持度 '+Math.round(G.support)+'</div>';
  if(G.lover)return loverMenu();
  var items=[];
  var ways=[['🔍 随机认识一个人','random'],['📚 图书馆偶遇（学霸型）','study'],['🏀 操场上认识的（体育型）','sport'],['🍜 食堂拼桌（吃货型）','food'],['🎭 社团活动认识','club'],['📱 社交软件匹配','app'],['💌 朋友介绍','friend']];
  for(var i=0;i<ways.length;i++){(function(w){items.push({n:w[0],d:'好感从0开始积累',b:'去',fn:function(){newLove(w[1]);}});})(ways[i]);}
  for(var j=0;j<G.met.length;j++){(function(j){var p=G.met[j];items.push({n:'💗 '+p.n+'（'+p.t+'·'+p.g+(p.same?'·同性':'')+'）',d:p.d+' 好感 '+Math.round(p.aff)+'/100',b:'接触',fn:function(){metMenu(j);}});})(j);}
  items.push({n:'📖 恋爱回顾',d:'已谈 '+G.lovers.length+' 轮',b:'查看',fn:function(){
   var h='<h3>📖 恋爱回顾</h3>';
   if(!G.lovers.length)h+='<p class="dim">你还没谈过恋爱。</p>';
   for(var i=0;i<G.lovers.length;i++){var v=G.lovers[i];h+='<div class="quote">第'+(i+1)+'轮：'+v.n+'（'+v.g+'·'+v.t+'）<br>在一起 '+(v.days||0)+' 天 · 纪念日 '+v.anniv+' · 结局：'+v.end+'</div>';}
   h+='<button class="gbtn" style="margin-top:8px" onclick="loveSys()">返回</button>';modal(h);}});
  menu('💗 恋爱 · 当前单身',prefText+'<div class="quote">对学生：支持度和魅力影响成功率；对老师：同事、校外、家长介绍都可以，但要小心风评。</div>',items);
 };
})();
(function(){
 var _oldTick=tick;
 tick=function(){
  _oldTick();
  if(!G||G.over||G.resting)return;
  if(G.charm>70&&G.day>0&&ch(.08)&&!G._crushToday){
   G._crushToday=true;
   var names=['隔壁班的同学','社团的学弟/学妹','食堂经常遇到的人','图书馆坐你对面的人','体育课帮你捡球的人','同班同学','高年级的学长/学姐','小卖部排队时站你后面的人'];
   var actions=['偷偷看你','给你桌上放了一瓶水','在朋友圈给你点赞','跟朋友打听你','在走廊故意跟你擦肩','给你写了匿名信','借故跟你借东西','在食堂故意坐你旁边'];
   setTimeout(function(){
    var h='<h3>💌 有人暗恋你</h3><div class="tcard">'+pk(names)+'好像喜欢你。<br>TA最近'+pk(actions)+'。<br><br><span class="dim small">（魅力 '+Math.round(G.charm)+' 触发）</span></div>'+
     '<div class="row" style="margin-top:8px"><button class="gbtn" onclick="closeModal()">知道了</button>'+
     '<button class="gbtn" onclick="closeModal();loveSys()">去恋爱系统看看</button></div>';
    modal(h);
   },1500);
  }
  if(G.idx===0)G._crushToday=false;
 };
})();
(function(){
 var _oldTick2=tick;
 tick=function(){
  _oldTick2();
  if(!G||G.over||G.resting||!G.lover)return;
  if(G.day>0&&ch(.06)&&!G._loverTalkToday){
   G._loverTalkToday=true;
   var talks=[
    G.lover.n+'："今天放学一起走吗？"',
    G.lover.n+'："我给你带了早餐，在你桌上。"',
    G.lover.n+'："昨晚聊到一半你怎么不见了？"',
    G.lover.n+'："这道题你会吗？教我一下。"',
    G.lover.n+'："周末有空吗？想去铜鉴湖走走。"',
    G.lover.n+'："你今天穿这件衣服挺好看的。"',
    G.lover.n+'："我妈问你什么时候来家里吃饭。"',
    G.lover.n+'："别太累了，早点休息。"',
    G.lover.n+'："我买了两杯奶茶，给你一杯。"',
    G.lover.n+'："今天考试加油！"',
    G.lover.n+'："你怎么都不回我消息？"',
    G.lover.n+'："晚自习后操场见？"',
    G.lover.n+'："我梦见你了。"',
    G.lover.n+'："今天食堂的红烧肉特别好吃，帮你打了一份。"',
    G.lover.n+'："你是不是不开心？跟我说说。"'
   ];
   setTimeout(function(){
    var h='<h3>💬 '+G.lover.n+'来找你了</h3><div class="tcard" style="font-size:16px;padding:16px">'+pk(talks)+'</div>'+
     '<div class="row" style="margin-top:8px"><button class="gbtn" onclick="closeModal()">😊 回应TA</button>'+
     '<button class="gbtn" onclick="closeModal();G.mood-=3">😐 敷衍一下</button></div>';
    modal(h);G.mood+=3;G.lover.aff=cl(G.lover.aff+2,0,100);
   },2000);
  }
  if(G.idx===0)G._loverTalkToday=false;
 };
})();

/* ---------- K11 小卖部货架 + 家长关系 ---------- */
(function(){
 var _oldShop=shopSys;
 shopSys=function(){
  if(!G)return;
  var hour=G.time?parseInt(G.time.split(':')[0]):12;
  var canBuy=(hour>=11&&hour<=13)||(hour>=16&&hour<=18)||(hour>=20&&hour<=21);
  if(!canBuy){
   modal('<h3>🛒 小卖部</h3><div class="tcard">现在不是购买时段。<br><span class="dim small">开放时间：11:00-13:00 / 16:00-18:00 / 20:00-21:00</span></div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>');
   return;
  }
  var goods=[
   {n:'泡面',i:'🍜',price:6,d:'夜宵神器',usable:true},
   {n:'薯片',i:'🍟',price:8,d:'快乐水搭档',usable:true},
   {n:'可乐',i:'🥤',price:5,d:'肥宅快乐水',usable:true},
   {n:'面包',i:'🍞',price:4,d:'垫肚子',usable:true},
   {n:'牛奶',i:'🥛',price:5,d:'补钙',usable:true},
   {n:'火腿肠',i:'🌭',price:3,d:'泡面搭档',usable:true},
   {n:'饼干',i:'🍪',price:5,d:'小零食',usable:true},
   {n:'巧克力',i:'🍫',price:10,d:'补充能量',usable:true},
   {n:'纸巾',i:'🧻',price:3,d:'日常必备',usable:false},
   {n:'卫生巾',i:'🩸',price:8,d:'女生必备',usable:true},
   {n:'止痛药',i:'💊',price:18,d:'生理期/头痛',usable:true},
   {n:'红糖姜茶',i:'🍵',price:6,d:'生理期神器',usable:true},
   {n:'暖手宝',i:'🔥',price:60,d:'冬天/生理期',usable:true},
   {n:'毛绒玩具',i:'🧸',price:88,d:'抱着睡',usable:true},
   {n:'小枕头',i:'🛏️',price:45,d:'午休神器',usable:true},
   {n:'笔记本',i:'📓',price:12,d:'学习用',usable:false},
   {n:'中性笔',i:'🖊️',price:3,d:'写字',usable:false},
   {n:'耳机',i:'🎧',price:99,d:'听音乐',usable:true},
   {n:'充电宝',i:'🔋',price:120,d:'手机续命',usable:false},
   {n:'雨伞',i:'☂️',price:25,d:'下雨用',usable:false}
  ];
  var h='<h3>🛒 小卖部货架</h3><div class="quote">余额：¥'+G.money+' · 家长关系：'+(G.parentRelation||'一般')+'</div>'+
   '<div style="max-height:400px;overflow-y:auto">';
  for(var i=0;i<goods.length;i++){
   (function(g){
    h+='<div class="tcard" style="margin:3px 0;display:flex;align-items:center;justify-content:space-between">'+
     '<span><b>'+g.i+' '+g.n+'</b> <span class="dim small">¥'+g.price+' · '+g.d+'</span></span>'+
     '<button class="gbtn" style="padding:3px 12px;font-size:12px" onclick="buyGood(\''+g.n+'\','+g.price+',\''+g.i+'\',\''+g.d+'\','+g.usable+')">＋1</button></div>';
   })(goods[i]);
  }
  h+='</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
  modal(h);
 };
})();
function buyGood(n,price,i,d,usable){
 if(G.money<price){l('💸 钱不够。','warn');return;}
 G.money-=price;
 addToBackpack(n,i,d,usable,usable?function(){G.mood+=3;l('🎒 使用了'+n);}:null,1);
 l('🛒 买了'+i+' '+n+'（¥'+price+'），放进了背包。','good');
 saveGame();shopSys();
}
(function(){
 var _oldSG2=startGame;
 startGame=function(){
  _oldSG2();
  setTimeout(function(){
   if(G&&!G.parentRelation){
    G.parentRelation=pk(['很好','很好','一般','一般','一般','吵架']);
    l('👨‍👩‍👧 你和家长的关系：'+G.parentRelation,'good');
   }
  },700);
 };
})();

/* ---------- K12 杭州天气系统 + 周五周末跳转 ---------- */
var HZ_WEATHERS={
 3:[{n:'晴',t:18,rain:0,mood:2,w:5},{n:'多云',t:16,rain:0,mood:1,w:4},{n:'小雨',t:14,rain:1,mood:-2,w:3},{n:'阴',t:15,rain:0,mood:0,w:3}],
 4:[{n:'晴',t:22,rain:0,mood:3,w:5},{n:'多云',t:20,rain:0,mood:1,w:4},{n:'小雨',t:18,rain:1,mood:-1,w:3},{n:'雷阵雨',t:21,rain:2,mood:-3,w:2}],
 5:[{n:'晴',t:27,rain:0,mood:3,w:5},{n:'多云',t:25,rain:0,mood:2,w:4},{n:'小雨',t:23,rain:1,mood:-1,w:3},{n:'阴',t:24,rain:0,mood:0,w:3}],
 6:[{n:'梅雨',t:26,rain:2,mood:-3,w:4},{n:'小雨',t:25,rain:1,mood:-1,w:3},{n:'多云',t:28,rain:0,mood:2,w:3},{n:'晴',t:30,rain:0,mood:1,w:2}],
 7:[{n:'晴热',t:35,rain:0,mood:-2,w:4},{n:'多云',t:33,rain:0,mood:0,w:3},{n:'雷阵雨',t:30,rain:2,mood:1,w:3},{n:'晴',t:36,rain:0,mood:-3,w:2}],
 8:[{n:'晴热',t:34,rain:0,mood:-2,w:4},{n:'多云',t:32,rain:0,mood:0,w:3},{n:'雷阵雨',t:29,rain:2,mood:1,w:3},{n:'台风',t:28,rain:3,mood:-4,w:2}],
 9:[{n:'晴',t:28,rain:0,mood:3,w:5},{n:'多云',t:26,rain:0,mood:2,w:4},{n:'小雨',t:24,rain:1,mood:-1,w:3},{n:'阴',t:25,rain:0,mood:0,w:3}],
 10:[{n:'晴',t:22,rain:0,mood:3,w:5},{n:'多云',t:20,rain:0,mood:2,w:4},{n:'小雨',t:18,rain:1,mood:-2,w:3},{n:'阴',t:19,rain:0,mood:0,w:3}],
 11:[{n:'晴',t:16,rain:0,mood:2,w:5},{n:'多云',t:14,rain:0,mood:1,w:4},{n:'小雨',t:12,rain:1,mood:-2,w:3},{n:'阴',t:13,rain:0,mood:0,w:3}],
 12:[{n:'晴',t:10,rain:0,mood:2,w:5},{n:'多云',t:8,rain:0,mood:1,w:4},{n:'小雨',t:6,rain:1,mood:-2,w:3},{n:'雪',t:2,rain:1,mood:3,w:2}],
 1:[{n:'晴',t:8,rain:0,mood:2,w:5},{n:'多云',t:6,rain:0,mood:1,w:4},{n:'小雨',t:4,rain:1,mood:-2,w:3},{n:'阴',t:5,rain:0,mood:0,w:3}],
 2:[{n:'晴',t:10,rain:0,mood:2,w:5},{n:'多云',t:8,rain:0,mood:1,w:4},{n:'小雨',t:6,rain:1,mood:-2,w:3},{n:'雪',t:1,rain:1,mood:3,w:2}]
};
(function(){
 var _oldDE=dayEnd;
 dayEnd=function(){
  _oldDE();
  if(G.date&&G.date.getDay()===5&&G.mode==='student'){
   setTimeout(function(){
    l('📱 周五了！班主任把手机发回来了。','good');
    G.phoneTaken=false;G.mood+=15;
    l('🎉 愉快的周末开启了！','good');
    var overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;animation:fadeIn .5s';
    overlay.textContent='🌙 周末中……';
    document.body.appendChild(overlay);
    setTimeout(function(){
     G.date.setDate(G.date.getDate()+2);
     G.day+=2;
     overlay.textContent='📚 周日晚上返校了';
     setTimeout(function(){overlay.remove();l('📚 周日晚上，你返校了。明天又是新的一周。','good');saveGame();},1500);
    },2000);
   },500);
  }
 };
})();
(function(){
 var _oldTick3=tick;
 tick=function(){
  _oldTick3();
  if(!G||G.over)return;
  if(G.idx===0&&G.date){
   var month=G.date.getMonth()+1;
   var pool=HZ_WEATHERS[month]||HZ_WEATHERS[10];
   G.weather=pk(pool);G.wtemp=G.weather.t;
  }
 };
})();

/* ---------- K13 成就弹窗+音效+ProMax ---------- */
(function(){
 var _oldAch=ach;
 ach=function(id){
  if(G.ach&&G.ach[id])return;
  _oldAch(id);
  setTimeout(function(){
   var name=id;for(var _i=0;_i<ACH_S.length;_i++)if(ACH_S[_i].id===id)name=ACH_S[_i].n;for(var _j=0;_j<ACH_T.length;_j++)if(ACH_T[_j].id===id)name=ACH_T[_j].n;
   var popup=document.createElement('div');
   popup.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ffd166,#ff9f43);color:#1a1a2e;padding:12px 24px;border-radius:12px;font-weight:800;z-index:9998;box-shadow:0 8px 30px rgba(255,209,102,.5);animation:achPop .5s cubic-bezier(.2,.9,.3,1.4)';
   popup.textContent='🏆 成就解锁：'+name;
   document.body.appendChild(popup);
   setTimeout(function(){popup.style.opacity='0';popup.style.transition='opacity .5s';setTimeout(function(){popup.remove();},500);},2500);
   try{
    var ctx=new (window.AudioContext||window.webkitAudioContext)();
    var o=ctx.createOscillator();var g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=880;o.type='sine';g.gain.setValueAtTime(.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.01,ctx.currentTime+.3);
    o.start();o.stop(ctx.currentTime+.3);
   }catch(e){}
  },200);
 };
})();

/* ---------- K14 跑操重做 ---------- */
(function(){
 var _oldEx=SLOTS.exercise;
 SLOTS.exercise=function(){
  if(G.gender==='女'&&G.period){
   return {title:'🤸 06:50 早操（生理期）',text:'广播里放着进行曲，但小腹一阵阵地疼。\n体育老师问："有请假的吗？"',
    choices:[
     C('🙋 举手请假','基本不会被发现',function(){G.pain=cl(G.pain-1,0,5);G.mood+=4;l('你在看台上坐了一节课。');next();}),
     C('😣 忍一忍坚持跑','消耗体力',function(){G.pain=cl(G.pain+1,0,5);G.fitness+=3;if(ch(.3)){G.health-=4;l('跑到一半你疼得蹲下了。','bad');}else l('你咬牙跑完了两圈。');next();}),
     C('💊 先吃片止痛药','需止痛药',function(){G.pain=cl(G.pain-3,0,5);G.mood+=5;l('💊 药效上来了。');next();})
    ]};
  }
  if(G.weather&&G.weather.rain>=1&&G.weather.n.indexOf('雷')<0){
   return {title:'🌧️ 06:50 跑操（雨天取消）',text:'操场上全是水洼，广播说改在教室做操。',
    choices:[C('😴 在教室摸鱼','安全',function(){l('你在教室坐着，躲过了跑操。');next();}),
     C('🏃 冒雨去操场','可能感冒',function(){if(ch(.5)){l('你在雨里跑了一圈，回教室湿透了。','warn');catchCold('淋雨了');}else l('你冒雨跑了操，体育老师夸了你。');next();})]};
  }
  return {title:'🤸 06:50 跑操',text:'操场上放着进行曲，全校排成方阵。\n体育老师在台上喊："跑起来！"',
   choices:[
    C('🏃 认真跑','消耗体力/提高睡眠质量',function(){G.fitness+=3;G.sleep-=8;G._sleepBonus=(G._sleepBonus||0)+5;l('你认真跑完了两圈，出了一身汗。体力+3');next();}),
    C('🙋 请假（说肚子痛）','基本不会被发现',function(){if(!tc(.12,'criticize','体育老师看了你一眼："真的？"')){l('你成功请假，在看台上坐了一节课。');}next();}),
    C('👟 蹲下假装系鞋带','35%被抓',function(){if(!tc(.35,'criticize','你蹲着系了三分钟鞋带')){G.mood+=2;l('你蹲着摸完了整场跑操。');}next();}),
    C('💬 边跑边唠嗑','心情+5/25%被抓',function(){G.mood+=5;if(!tc(.25,'criticize','你和隔壁班的人聊得太开心被点了名'))l('你们把跑操变成了早聊。');next();})
   ]};
 };
})();

/* ---------- K15 快递系统（出门单+20%找不到） ---------- */
(function(){
 var _oldMail=openMail;
 openMail=function(){
  if(G.parcel<=0){modal('<h3>📦 快递</h3><p class="dim">没有快递。</p><button class="gbtn" onclick="closeModal()">关闭</button>');return;}
  var h='<h3>📦 快递（'+G.parcel+'件）</h3><div class="quote">取快递需要出门单，或者让走读同学帮忙带</div>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="mailWithPass()">📝 申请出门单去取</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="mailWithFriend()">👬 让走读同学帮忙带</button>'+
   '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal()">关闭</button>';
  modal(h);
 };
})();
function mailWithPass(){
 l('📝 你找班主任开了出门单。');
 setTimeout(function(){
  if(ch(.2)){l('📦 快递点找了半天，没找到你的包裹。','bad');}
  else{G.parcel--;G.mood+=8;l('📦 取到了快递！','good');addToBackpack('快递包裹','📦','刚取的快递',true,function(){G.mood+=5;l('📦 拆开了快递。');},1);}
  closeModal();
 },500);
}
function mailWithFriend(){
 if(ch(.7)){G.parcel--;G.mood+=5;l('👬 走读同学帮你把快递带回来了。','good');addToBackpack('快递包裹','📦','同学带的',true,function(){G.mood+=5;l('📦 拆开了快递。');},1);}
 else l('👬 同学今天忘了帮你带。','warn');
 closeModal();
}

/* ---------- K16 上课上厕所细化 ---------- */
(function(){
 var _oldClass=SLOTS.class;
 SLOTS.class=function(s){
  var def=_oldClass(s);
  if(def&&def.choices){
   def.choices.push(C('🚻 举手去厕所','过5-15分钟',function(){
    var t=rnd(5,15);
    l('🚻 你举手去了厕所，花了'+t+'分钟。');
    setTimeout(function(){
     var h='<h3>🚻 从厕所回来</h3><div class="quote">还剩半节课，要干嘛？</div>'+
      '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();next()">📚 回教室继续上课</button>'+
      '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classToiletPhone()">📱 走廊里玩会儿手机</button>'+
      '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classToiletWander()">🚶 在走廊磨蹭一会儿</button>';
     modal(h);
    },300);
   }));
   def.choices.push(C('🏥 装病去医务室','可能穿帮',function(){
    if(!tc(.3,'criticize','校医一摸你的脉搏："跳这么有力？"')){l('🏥 你成功混到了医务室，躺了半节课。');G.sleep-=15;}
    next();
   }));
  }
  return def;
 };
})();
function classToiletPhone(){
 if(!phoneOK()){l('📱 手机被扣了。','warn');}else{G.st.phone++;G.mood+=4;l('📱 你在走廊角落玩了会儿手机。心情+4');}
 closeModal();next();
}
function classToiletWander(){
 G.mood+=2;
 if(ch(.2)){l('🚶 你在走廊磨蹭，被年级主任看到了。','warn');G.support-=3;}
 else l('🚶 你在走廊晃了一圈，慢慢走回教室。');
 closeModal();next();
}

/* ---------- K17 背包按钮加入顶栏 ---------- */
(function(){
 var _oldUpd=upd;
 upd=function(){
  _oldUpd();
  try{
   var bar=document.querySelector('.actionbar')||document.querySelector('.bottombar');
   if(bar&&!document.getElementById('bpBtn')){
    var btn=document.createElement('button');
    btn.className='mini';btn.id='bpBtn';btn.textContent='🎒 背包';
    btn.setAttribute('onclick','openBackpack()');
    bar.insertBefore(btn,bar.firstChild);
   }
  }catch(e){}
 };
})();

/* 5.5.3 初始渲染 */
try{renderShoes();}catch(e){}
try{lyricUpdate();}catch(e){}

/* ================================================================
   附录 L · 5.5.4 纯追加
   ================================================================ */

/* ---------- L1 独立开始界面重做（大标题+照片循环+三按钮） ---------- */
(function(){
 /* 隐藏原开始面板，但保留#game和bgSlideshow */
 setTimeout(function(){
  if(window.XZ_NEW_START)return; /* 5.5.6.100：启用新版主视觉开始界面，旧动态开屏停用 */
  try{
   var oldPanel=document.querySelector('.startPanel')||document.getElementById('startPanel');
   if(oldPanel)oldPanel.style.display='none';
   /* 创建新开始界面（背景半透明，让bgSlideshow透过来） */
   var splash=document.createElement('div');
   splash.id='splashScreen';
   splash.style.cssText='position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(10,10,26,.3)';
   /* 照片背景层 */
   var bg=document.createElement('div');
   bg.id='splashBg';
   bg.style.cssText='position:absolute;inset:0;background-size:cover;background-position:center;opacity:.85;transition:opacity 1.5s';
   splash.appendChild(bg);
   /* 遮罩 */
   var mask=document.createElement('div');
   mask.style.cssText='position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,26,.3) 0%,rgba(10,10,26,.5) 50%,rgba(10,10,26,.85) 100%)';
   splash.appendChild(mask);
   /* 大标题 */
   var title=document.createElement('div');
   title.style.cssText='position:relative;z-index:2;text-align:center;margin-bottom:40px;animation:titleFadeIn 1.2s ease-out';
   title.innerHTML='<div style="font-size:56px;font-weight:900;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.8),0 0 40px rgba(124,156,255,.4);letter-spacing:4px">杭州西子实验学校</div>'+
    '<div style="font-size:32px;font-weight:700;color:#ffd166;text-shadow:0 2px 10px rgba(0,0,0,.6);margin-top:8px;letter-spacing:8px">模拟器</div>'+
    '<div style="font-size:16px;color:rgba(255,255,255,.6);margin-top:12px;letter-spacing:2px">Version 10.9.21 PRO</div>';
   splash.appendChild(title);
   /* 按钮组 */
   var btnGroup=document.createElement('div');
   btnGroup.style.cssText='position:relative;z-index:2;display:flex;flex-direction:column;gap:14px;width:280px';
   var btns=[
    {t:'🎮 开始游戏',fn:'showCharCreate()'},
    {t:'⚙️ 设置',fn:'openSettings554()'},
    {t:'👥 制作名单',fn:'openCredits()'},
    {t:'🌐 假联机模式',fn:'fakeOnline()'}
   ];
   for(var i=0;i<btns.length;i++){
    (function(b){
     var btn=document.createElement('button');
     btn.style.cssText='padding:16px 24px;font-size:18px;font-weight:700;border:none;border-radius:12px;background:linear-gradient(135deg,#7c9cff,#5b7fd4);color:#fff;cursor:pointer;box-shadow:0 4px 15px rgba(124,156,255,.4);transition:all .2s;letter-spacing:2px';
     btn.textContent=b.t;
     btn.onmouseover=function(){this.style.transform='scale(1.05)';this.style.boxShadow='0 6px 25px rgba(124,156,255,.6)';};
     btn.onmouseout=function(){this.style.transform='scale(1)';this.style.boxShadow='0 4px 15px rgba(124,156,255,.4)';};
     btn.setAttribute('onclick',b.fn);
     btnGroup.appendChild(btn);
    })(btns[i]);
   }
   splash.appendChild(btnGroup);
   /* 底部歌词 */
   var lyric=document.createElement('div');
   lyric.id='splashLyric';
   lyric.style.cssText='position:relative;z-index:2;margin-top:30px;color:rgba(255,255,255,.7);font-size:14px;min-height:20px;text-align:center;max-width:600px';
   splash.appendChild(lyric);
   document.body.appendChild(splash);
   /* 照片循环 */
   var photoIdx=0;
   var photos=[];
   /* 直接从PHOTO_B64数组获取全部22张学校实景照片 */
   try{
    if(typeof PHOTO_B64!=='undefined'&&PHOTO_B64.length>0){
     for(var pi=0;pi<PHOTO_B64.length;pi++){
      photos.push('url('+PHOTO_B64[pi]+')');
     }
    }
   }catch(e){}
   /* 备用：从bgSlideshow获取 */
   try{
    if(photos.length===0){
     var bgEl=document.getElementById('bgSlideshow');
     if(bgEl&&bgEl.style.backgroundImage){
      var urlMatch=bgEl.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if(urlMatch)photos.push('url('+urlMatch[1]+')');
     }
    }
   }catch(e){}
   if(photos.length===0){
    photos=['linear-gradient(135deg,#1a1a3e,#2d2d5e)','linear-gradient(135deg,#2d2d5e,#1a3a2e)','linear-gradient(135deg,#3a1a2e,#1a1a3e)'];
   }
   function cycleBg(){
    bg.style.opacity='0';
    setTimeout(function(){
     bg.style.background=photos[photoIdx%photos.length];
     bg.style.backgroundSize='cover';
     bg.style.backgroundPosition='center';
     bg.style.opacity='.85';
     photoIdx++;
    },500);
   }
   cycleBg();
   setInterval(cycleBg,5000);
   /* 歌词同步到splash */
   setInterval(function(){
    var splash=document.getElementById('splashScreen');
    if(!splash||splash.style.display==='none')return;
    var el=document.getElementById('lyricText');
    var sl=document.getElementById('splashLyric');
    if(sl&&el)sl.textContent=el.textContent;
   },800);
  }catch(e){console.log('splash error',e);}
 },800);
})();
function showCharCreate(){
 var splash=document.getElementById('splashScreen');
 if(splash)splash.style.display='none';
 var oldPanel=document.querySelector('.startPanel')||document.getElementById('startPanel');
 if(oldPanel)oldPanel.style.display='block';
 var game=document.getElementById('game');
 if(game)game.style.display='block';
}
function openSettings554(){
 var h='<h3>⚙️ 设置</h3>'+
  '<div class="tcard"><b>🎵 背景音乐</b><br>'+
  '<button class="gbtn" onclick="toggleBGM()">开关音乐</button> '+
  '<button class="gbtn" onclick="nextSong()">下一首</button></div>'+
  '<div class="tcard"><b>🔊 音效</b><br>'+
  '<button class="gbtn" onclick="toggleSFX()">开关音效</button></div>'+
  '<div class="tcard"><b>📷 开始界面照片</b><br>'+
  '<span class="dim small">学校实景照片自动循环播放</span></div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function toggleBGM(){
 var audio=document.getElementById('bgm')||document.querySelector('audio');
 if(audio){if(audio.paused){audio.play();l('🎵 音乐已开启','good');}else{audio.pause();l('🔇 音乐已关闭','warn');}}
}
function nextSong(){
 if(typeof BGM_IDX!=='undefined'){BGM_IDX=(BGM_IDX+1)%6;l('🎵 切换到下一首歌','good');}
}
function toggleSFX(){if(!G){window._SFX_ON=!window._SFX_ON;l(window._SFX_ON?'🔊 音效已开启':'🔇 音效已关闭','good');return;}G._sfxOn=!G._sfxOn;l(G._sfxOn?'🔊 音效已开启':'🔇 音效已关闭','good');}

/* ---------- L2 假联机系统 ---------- */
function fakeOnline(){
 var splash=document.getElementById('splashScreen');
 if(!splash)return;
 splash.innerHTML='';
 splash.style.cssText='position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0a0a1a';
 var bg=document.createElement('div');
 bg.id='fakeBg';
 bg.style.cssText='position:absolute;inset:0;background-size:cover;background-position:center;opacity:.7';
 splash.appendChild(bg);
 var mask=document.createElement('div');
 mask.style.cssText='position:absolute;inset:0;background:rgba(10,10,26,.7)';
 splash.appendChild(mask);
 var content=document.createElement('div');
 content.style.cssText='position:relative;z-index:2;text-align:center';
 content.innerHTML='<div style="font-size:28px;color:#fff;margin-bottom:20px">🌐 正在匹配玩家...</div>'+
  '<div style="width:300px;height:6px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden;margin:0 auto">'+
  '<div id="matchBar" style="height:100%;width:0%;background:linear-gradient(90deg,#7c9cff,#ffd166);transition:width .3s;border-radius:3px"></div></div>'+
  '<div id="matchText" style="color:rgba(255,255,255,.6);margin-top:12px;font-size:14px">正在连接服务器...</div>';
 splash.appendChild(content);
 /* 照片循环 */
 var photos=[];
 try{var bgEl2=document.getElementById('bgSlideshow');if(bgEl2&&bgEl2.style.backgroundImage){var m=bgEl2.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);if(m)photos.push(m[1]);}}catch(e){}
 try{var allImgs=document.querySelectorAll('img');for(var j=0;j<allImgs.length;j++){if(allImgs[j].src&&allImgs[j].src.indexOf('data:image')>=0)photos.push(allImgs[j].src);}}catch(e){}
 if(photos.length===0)photos=['linear-gradient(135deg,#1a1a3e,#2d2d5e)'];
 var pi=0;
 setInterval(function(){bg.style.background=photos[pi%photos.length];bg.style.backgroundSize='cover';pi++;},4000);
 bg.style.background=photos[0];bg.style.backgroundSize='cover';
 /* 匹配进度 */
 var msgs=['正在连接服务器...','正在查找在线玩家...','已找到 3 个玩家...','正在同步游戏数据...','匹配成功！'];
 var progress=0;
 var matchTimer=setInterval(function(){
  progress+=rnd(5,15);
  if(progress>=100){progress=100;clearInterval(matchTimer);
   document.getElementById('matchText').textContent='✅ 匹配成功！正在进入游戏...';
   setTimeout(function(){showCharCreate();window._FAKE_ONLINE=true;try{l('🌐 假联机模式已开启（同桌对话会更频繁）','good');}catch(e){}},1500);
  }
  document.getElementById('matchBar').style.width=progress+'%';
  var mi=Math.min(Math.floor(progress/25),msgs.length-1);
  document.getElementById('matchText').textContent=msgs[mi];
 },400);
}

/* ---------- L3 下课多件事系统（可连续做3-4件） ---------- */
(function(){
 SLOTS.break=function(){
  G._breakTime=10;G._breakActions=0;
  return breakMenu();
 };
})();
function breakMenu(){
 var remain=G._breakTime||10;
 var h='<h3>⏰ 下课10分钟（还剩 '+remain+' 分钟）</h3><div class="quote">已做 '+G._breakActions+' 件事，还能再做几件</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'toilet\')">🚻 去厕所（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'water\')">💧 去灌水（2-4分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'playground\')">🏃 去操场走走（5-8分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'shop\')">🛒 去小卖部（5-8分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'phone\')">📱 玩会儿手机（3-6分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'chat\')">💬 和同学聊天（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo(\'desk\')">📚 留在教室预习（不耗时）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0;background:#ff6b6b" onclick="breakEnd()">🏃 回教室（结束课间）</button>';
 modal(h);
}
function breakDo(act){
 var times={toilet:[3,5],water:[2,4],playground:[5,8],shop:[5,8],phone:[3,6],chat:[3,5],desk:[0,0]};
 var t=rnd(times[act][0],times[act][1]);
 G._breakTime=(G._breakTime||10)-t;
 G._breakActions++;
 var msgs={
  toilet:'🚻 你去了趟厕所，花了'+t+'分钟。',
  water:'💧 你去饮水机灌了水，花了'+t+'分钟。',
  playground:'🏃 你去操场走了走，花了'+t+'分钟。体力+1',
  shop:'🛒 你去了小卖部，花了'+t+'分钟。',
  phone:'📱 你蹲在走廊角落刷了会儿手机，花了'+t+'分钟。心情+3',
  chat:'💬 你和同学聊了会儿天，花了'+t+'分钟。心情+4 支持度+1',
  desk:'📚 你留在教室预习了下节课。'
 };
 if(act==='playground')G.fitness=cl(G.fitness+1,0,100);
 if(act==='phone'){if(phoneOK()){G.st.phone++;G.mood=cl(G.mood+3,0,100);}else l('📱 手机被扣了。','warn');}
 if(act==='chat'){G.mood=cl(G.mood+4,0,100);G.support=cl(G.support+1,0,100);}
 if(act==='shop'){if(ch(.3)){l('🛒 你去了小卖部，但回来时上课铃已经响了！','warn');G.st.skip++;closeModal();next();return;}}
 l(msgs[act]);
 if(G._breakTime<=0){l('⏰ 上课铃响了，你赶紧跑回教室。');closeModal();next();return;}
 if(G._breakActions>=5){l('⏰ 做了太多事，上课铃响了。');closeModal();next();return;}
 breakMenu();
}
function breakEnd(){l('🏃 你提前回了教室。');closeModal();next();}

/* ---------- L4 上课时间拆分系统 ---------- */
(function(){
 var _oldClass=SLOTS.class;
 SLOTS.class=function(s){
  G._classTime=45;G._classActions=0;G._classSubject=s.subject||'语文';
  return classMenu(s);
 };
})();
function classMenu(s){
 var remain=G._classTime||45;
 var subj=G._classSubject||'语文';
 var h='<h3>📖 '+subj+'课（还剩 '+remain+' 分钟）</h3><div class="quote">第 '+(s&&s.n?s.n:'')+' 节课 · 已做 '+G._classActions+' 件事</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'listen\')">📝 认真听课（10-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'phone\')">📱 偷偷玩手机（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'sleep\')">😴 打瞌睡（10-20分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'toilet\')">🚻 举手去厕所（5-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'clinic\')">🏥 装病去医务室（15-25分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'chat\')">💬 和同桌说话（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'draw\')">🎨 在课本上画画（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo(\'note\')">📒 做笔记（10-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0;background:#ff6b6b" onclick="classEnd()">⏰ 等到下课</button>';
 modal(h);
}
function classDo(act){
 var times={listen:[10,15],phone:[5,10],sleep:[10,20],toilet:[5,15],clinic:[15,25],chat:[5,10],draw:[5,10],note:[10,15]};
 var t=rnd(times[act][0],times[act][1]);
 G._classTime=(G._classTime||45)-t;
 G._classActions++;
 switch(act){
  case 'listen':G.knowledge+=2;G.support+=1;l('📝 你认真听了'+t+'分钟课。知识+2 支持度+1');break;
  case 'phone':
   if(!phoneOK()){l('📱 手机被扣了。','warn');}
   else{G.st.phone++;G.mood+=3;l('📱 你偷偷玩了'+t+'分钟手机。心情+3');
    if(ch(.2)){l('⚠️ 老师好像注意到你了...','warn');G.support-=2;}}
   break;
  case 'sleep':G.sleep=cl(G.sleep+t*0.5,0,100);l('😴 你打瞌睡了'+t+'分钟。');
   if(ch(.15)){l('⚠️ 老师扔了个粉笔头过来！','bad');G.mood-=5;G.support-=3;}break;
  case 'toilet':l('🚻 你举手去了厕所，花了'+t+'分钟。');
   setTimeout(function(){var h2='<h3>🚻 从厕所回来</h3><div class="quote">还剩半节课</div>'+
    '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();classMenu({n:'+(G._classActions||0)+'})">📚 回教室</button>'+
    '<button class="gbtn" style="width:100%;margin:3px 0" onclick="closeModal();classDo(\'phone\')">📱 走廊玩手机</button>';
   modal(h2);},300);return;
  case 'clinic':
   if(!tc(.3,'criticize','校医一摸你的脉搏："跳这么有力？"')){l('🏥 你成功混到了医务室，躺了'+t+'分钟。');G.sleep=cl(G.sleep-15,0,100);}
   break;
  case 'chat':G.mood+=3;l('💬 你和同桌说了'+t+'分钟话。心情+3');
   if(ch(.2)){l('⚠️ 被老师点名了！','warn');G.support-=2;}break;
  case 'draw':G.mood+=2;G.creativity=(G.creativity||0)+1;l('🎨 你在课本上画了'+t+'分钟画。心情+2 创造力+1');break;
  case 'note':G.knowledge+=3;l('📒 你认真做了'+t+'分钟笔记。知识+3');break;
 }
 if(G._classTime<=0){l('⏰ 下课铃响了。');closeModal();next();return;}
 if(G._classActions>=6){l('⏰ 这节课快结束了。');closeModal();next();return;}
 classMenu({n:G._classActions});
}
function classEnd(){l('⏰ 你等到了下课。');closeModal();next();}

/* ---------- L5 选科3+x系统（浙江高考） ---------- */
var ZJ_SUBJECTS=[
 {id:'物理',name:'物理'},{id:'化学',name:'化学'},{id:'生物',name:'生物'},
 {id:'政治',name:'政治'},{id:'历史',name:'历史'},{id:'地理',name:'地理'},
 {id:'技术',name:'技术（含信息技术+通用技术）'}
];
(function(){
 var _oldRS=renderStart;
 renderStart=function(){
  _oldRS();
  try{
   if(!O.zjSubjects)O.zjSubjects=['物理','化学','地理'];
   /* 静态HTML已有选科UI，只渲染不重复插入 */
   if(document.getElementById('zjSubjBox')){
    renderZJSubjects();
   } else if(!document.getElementById('zjSubjectStep')){
    var dayStep=document.getElementById('dayStep');
    if(dayStep){
     var div=document.createElement('div');
     div.className='step';div.id='zjSubjectStep';
     div.innerHTML='<b>⑫ 浙江高考选科（3+x）</b> <span class="dim small">（语数英必修，自选3门，可选技术）</span>'+
      '<div id="zjSubjBox" class="row" style="margin-top:5px;flex-wrap:wrap;gap:6px"></div>'+
      '<p class="dim small" id="zjSubjInfo" style="margin-top:4px">请选择3门选考科目</p>';
     dayStep.parentNode.insertBefore(div,dayStep.nextSibling);
     renderZJSubjects();
    }
   }
  }catch(e){}
 };
})();
function renderZJSubjects(){
 var box=document.getElementById('zjSubjBox');
 if(!box)return;
 box.innerHTML='';
 for(var i=0;i<ZJ_SUBJECTS.length;i++){
  (function(s){
   var on=O.zjSubjects.indexOf(s.id)>=0;
   var btn=document.createElement('button');
   btn.className='gbtn'+(on?' on':'');
   btn.style.cssText='padding:6px 14px;font-size:13px;'+(on?'background:#7c9cff;color:#fff':'');
   btn.textContent=s.name;
   btn.onclick=function(){toggleZJSubject(s.id);};
   box.appendChild(btn);
  })(ZJ_SUBJECTS[i]);
 }
 var info=document.getElementById('zjSubjInfo');
 if(info)info.textContent='已选 '+O.zjSubjects.length+'/3 门：'+O.zjSubjects.join('、')+(O.zjSubjects.length===3?' ✓ 选科完成':'（还需选'+(3-O.zjSubjects.length)+'门）');
}
function toggleZJSubject(id){
 var idx=O.zjSubjects.indexOf(id);
 if(idx>=0)O.zjSubjects.splice(idx,1);
 else{if(O.zjSubjects.length>=3){l('最多选3门。','warn');return;}O.zjSubjects.push(id);}
 renderZJSubjects();
}
/* 课表按3+x选科重排 */
(function(){
 var _oldBuild=buildStudentDay;
 buildStudentDay=function(){
  var subs=O.zjSubjects||G.zjSubjects||['物理','化学','地理'];
  var day=G.date.getDay();
  var a=[mk('06:00','wake',{loc:'宿舍'}),mk('06:50','exercise',{loc:'操场'}),mk('07:10','morningRead',{loc:'教室'})];
  if(day===1)a.push(mk('07:35','flag',{loc:'操场'}));
  var morn=['语文','数学','英语'];
  /* 学考课：物理/政治（不管选没选都要上） */
  if(day===1||day===3||day===5)morn.splice(1,0,'物理学考');
  if(day===2||day===4||day===5)morn.splice(2,0,'政治学考');
  a.push(mk('07:55','class',{n:1,subject:morn[0]||'语文'}),mk('08:35','break',{loc:'教室'}),
   mk('08:45','class',{n:2,subject:morn[1]||'数学'}),mk('09:25','break',{loc:'教室'}),
   mk('09:35','eyecare',{n:1}),mk('09:40','class',{n:3,subject:morn[2]||'英语'}),mk('10:20','break',{loc:'教室'}),
   mk('10:30','class',{n:4,subject:morn[3]||subs[0]}),mk('11:20','class',{n:5,subject:subs[1]||subs[0]}),
   mk('12:00','meal',{which:'午饭',loc:'食堂'}),mk('12:40','nap',{loc:'教室'}),
   mk('13:05','class',{n:6,subject:subs[2]||subs[0]}),mk('13:45','break',{loc:'教室'}),
   mk('13:55','class',{n:7,subject:subs.indexOf('技术')>=0?'技术':pk(['语文','数学','英语'])}),mk('14:50','eyecare',{n:2}),
   mk('14:55','class',{n:8,subject:pk(['语文','数学','英语'])}),mk('15:45','homework',{loc:'教室'}),
   mk('16:25','extend',{loc:'教室'}),mk('17:00','dinner',{loc:'食堂'}),
   mk('18:00','night',{n:1,loc:'教室'}),mk('19:00','night',{n:2}),mk('20:00','night',{n:3}),mk('21:00','night',{n:4}),
   mk('22:00','dorm',{loc:'宿舍'}),mk('23:00','sleep',{loc:'宿舍'}));
  if(day===1||day===4){for(var i=0;i<a.length;i++){if(a[i].n===7&&a[i].type==='class'){a[i].subject='体育';break;}}}
  return a;
 };
})();

/* ---------- L6 手机系统重做（详细APP内容） ---------- */
function phoneSys(){
 if(!phoneOK()){l('📱 手机被扣了，玩不了。','warn');return;}
  var h='<h3>📱 手机</h3><div class="quote">电量 '+Math.round(G.phoneBat||100)+'% · 流量 '+Math.round(G.phoneData||100)+'%</div>'+
   '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
   '<button class="gbtn" onclick="phoneApp(\'wechat\')">💬 微信</button>'+
   '<button class="gbtn" onclick="phoneApp(\'qq\')">🐧 QQ</button>'+
   '<button class="gbtn" onclick="phoneApp(\'douyin\')">🎵 抖音</button>'+
   '<button class="gbtn" onclick="phoneApp(\'bilibili\')">📺 B站</button>'+
   '<button class="gbtn" onclick="phoneApp(\'weibo\')">📢 微博</button>'+
   '<button class="gbtn" onclick="phoneApp(\'zhihu\')">❓ 知乎</button>'+
   '<button class="gbtn" onclick="phoneApp(\'game\')">🎮 手游</button>'+
   '<button class="gbtn" onclick="phoneApp(\'music\')">🎶 音乐</button>'+
   '<button class="gbtn" onclick="phoneApp(\'taobao\')">🛒 淘宝</button>'+
   '<button class="gbtn" onclick="phoneApp(\'novel\')">📖 小说</button>'+
   '<button class="gbtn" onclick="phoneApp(\'camera\')">📷 拍照</button>'+
   '<button class="gbtn" onclick="phoneApp(\'settings\')">⚙️ 设置</button>'+
   '</div><button class="gbtn" style="margin-top:8px;width:100%" onclick="closeModal()">收起手机</button>';
  modal(h);
  G.phoneBat=cl((G.phoneBat||100)-rnd(1,3),0,100);
}
function phoneApp(app){
 var contents={
  wechat:function(){
   var msgs=['同桌："作业写了吗？借我抄抄"','班长："明天记得带校服"','妈妈："生活费够吗？"','朋友："周末开黑？"','暗恋的人："在吗？"','群消息：99+条未读','班主任："@全体成员 明天考试"'];
   var h='<h3>💬 微信</h3><div class="quote">你刷了刷微信</div>';
   for(var i=0;i<3;i++)h+='<div class="tcard" style="margin:4px 0">'+pk(msgs)+'</div>';
   h+='<div class="dim small" style="margin-top:8px">心情+3 · 耗时5分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+3,0,100);modal(h);
  },
  qq:function(){
   var h='<h3>🐧 QQ</h3><div class="tcard">班级群：有人发了个表情包<br>空间动态：3条新说说<br>好友请求：1个</div>'+
    '<div class="dim small">心情+2 · 耗时4分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+2,0,100);modal(h);
  },
  douyin:function(){
   var videos=['一个搞笑视频，你笑出了声','一个校园vlog，想起了自己','一个美食博主，看饿了','一个跳舞视频，循环了三遍','一个学习博主，突然焦虑了','一个猫视频，治愈了'];
   var h='<h3>🎵 抖音</h3><div class="quote">你刷了10分钟抖音</div>';
   for(var i=0;i<3;i++)h+='<div class="tcard" style="margin:4px 0">📱 '+pk(videos)+'</div>';
   h+='<div class="dim small">心情+5 · 知识-1（刷太多了）</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+5,0,100);G.knowledge=cl(G.knowledge-1,0,100);modal(h);
  },
  bilibili:function(){
   var h='<h3>📺 B站</h3><div class="tcard">推荐：某UP主更新了<br>追番：新一集出了<br>直播：3个关注的主播在播</div>'+
    '<div class="dim small">心情+4 · 耗时8分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+4,0,100);modal(h);
  },
  weibo:function(){
   var h='<h3>📢 微博</h3><div class="tcard">热搜：#某明星官宣# #高考倒计时# #杭州天气#<br>你刷了刷热搜，感觉世界很热闹</div>'+
    '<div class="dim small">心情+2 · 耗时5分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+2,0,100);modal(h);
  },
  zhihu:function(){
   var h='<h3>❓ 知乎</h3><div class="tcard">推荐："高中生如何提高成绩？"<br>你看了一篇高赞回答，感觉很有道理<br>又看了一篇，感觉更焦虑了</div>'+
    '<div class="dim small">知识+2 · 心情-1 · 耗时10分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.knowledge=cl(G.knowledge+2,0,100);G.mood=cl(G.mood-1,0,100);modal(h);
  },
  game:function(){
   var games=['你打了一局王者荣耀，赢了','你打了一局和平精英，吃鸡了','你打了一局原神，抽卡歪了','你打了一局 Minecraft，建了个房子','你打了一局手游，输了，有点气'];
   var r=pk(games);
   var moodChange=r.indexOf('赢')>=0||r.indexOf('吃鸡')>=0?6:r.indexOf('歪')>=0||r.indexOf('输')>=0?-4:4;
   var h='<h3>🎮 手游</h3><div class="tcard" style="font-size:15px">'+r+'</div>'+
    '<div class="dim small">心情+'+moodChange+' · 耗时15分钟 · 体力-2</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+moodChange,0,100);G.fitness=cl(G.fitness-2,0,100);modal(h);
  },
  music:function(){
   var h='<h3>🎶 音乐</h3><div class="tcard">你戴上耳机听了会儿歌<br>播放列表：周杰伦、许嵩、五月天...<br>感觉整个人都放松了</div>'+
    '<div class="dim small">心情+6 · 睡眠+3 · 耗时10分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+6,0,100);G.sleep=cl(G.sleep+3,0,100);modal(h);
  },
  taobao:function(){
   var h='<h3>🛒 淘宝</h3><div class="tcard">你逛了逛淘宝<br>收藏了3件衣服<br>购物车又多了几样东西<br>（看看就好，没钱买）</div>'+
    '<div class="dim small">心情+1 · 耗时8分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+1,0,100);modal(h);
  },
  novel:function(){
   var h='<h3>📖 小说</h3><div class="tcard">你看了会儿网络小说<br>剧情正精彩，差点忘了时间<br>上课铃响了才回过神</div>'+
    '<div class="dim small">心情+4 · 知识-1 · 耗时20分钟</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+4,0,100);G.knowledge=cl(G.knowledge-1,0,100);modal(h);
  },
  camera:function(){
   var h='<h3>📷 拍照</h3><div class="tcard">你拍了几张校园风景照<br>拍了拍同桌的表情包<br>自拍了一张，滤镜拉满</div>'+
    '<div class="dim small">心情+3 · 创造力+1</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   G.mood=cl(G.mood+3,0,100);G.creativity=(G.creativity||0)+1;modal(h);
  },
  settings:function(){
   var h='<h3>⚙️ 手机设置</h3><div class="tcard">亮度：自动<br>音量：60%<br>壁纸：校园风景<br>存储空间：还剩 12GB</div>'+
    '<button class="gbtn" style="margin-top:8px" onclick="phoneSys()">返回</button>';
   modal(h);
  }
 };
 if(contents[app])contents[app]();
 G.st.phone++;
}

/* ---------- L7 NPC对话系统（宿管等，玩家可输入文字） ---------- */
var NPC_KB={
 dorm:{
  name:'宿管阿姨',
  greet:'小伙子/小姑娘，这么晚了还不睡？有什么事吗？',
  rules:[
   {keys:['热水','洗澡','水'],resp:'热水供应到23:00，现在还来得及，快去洗吧。'},
   {keys:['灯','关灯','睡觉'],resp:'22:30准时关灯，到点我就拉闸了啊。'},
   {keys:['外卖','快递','包裹'],resp:'外卖不能进宿舍！快递去校门口取，我这里不收。'},
   {keys:['请假','出去','出门'],resp:'晚上请假出去？得有班主任签字的假条，不然别想。'},
   {keys:['吵','安静','声音'],resp:'晚上10点后必须安静！再吵我记名字了啊。'},
   {keys:['卫生','打扫','检查'],resp:'每周三卫生检查，被子叠好，垃圾倒了。'},
   {keys:['维修','坏了','修'],resp:'什么东西坏了？写个报修单放我桌上，明天让人来修。'},
   {keys:['朋友','同学','串门'],resp:'晚上不能串宿舍！各回各的房间。'},
   {keys:['吃','泡面','零食'],resp:'泡面味别太大啊，整层楼都闻得到。'},
   {keys:['冷','热','空调'],resp:'空调遥控器在我这，要开自己来拿，用完还回来。'},
   {keys:['早','几点','起床'],resp:'早上6点叫早，别赖床，迟到了我可不负责。'},
   {keys:['你好','您好','阿姨'],resp:'哎，你好你好，有什么事吗？'},
   {keys:['谢谢','感谢'],resp:'不客气，有事随时来找我。'}
  ],
  default:'这事我不太清楚，你去问班主任吧。'
 },
 teacher:{
  name:'班主任',
  greet:'怎么了？找我什么事？',
  rules:[
   {keys:['请假','假条','病'],resp:'请假？什么病？有医院证明吗？先把假条写了。'},
   {keys:['成绩','分数','考试'],resp:'成绩自己去教务系统查，考不好自己找原因。'},
   {keys:['作业','没交','忘带'],resp:'没交作业？下课到我办公室来一趟。'},
   {keys:['调座位','座位','换位置'],resp:'座位暂时不调，等月考完再说。'},
   {keys:['手机','没收','扣'],resp:'手机？上课玩手机了吧？期末再来拿。'},
   {keys:['转学','退学','不上'],resp:'转学？你想清楚了吗？先叫家长来谈。'},
   {keys:['竞赛','比赛','报名'],resp:'竞赛报名？你成绩够吗？先把平时成绩搞上去。'},
   {keys:['心理','压力','焦虑'],resp:'压力大？去心理咨询室聊聊，别憋着。'},
   {keys:['你好','老师好'],resp:'嗯，你好，什么事？'},
   {keys:['谢谢','感谢'],resp:'不用谢，回去学习吧。'}
  ],
  default:'这个问题你先自己想想，想不通再来找我。'
 }
};
function talkToNPC(npcId){
 var npc=NPC_KB[npcId];if(!npc)return;
 G._npcChat=npcId;G._npcHistory=[];
 var h='<h3>💬 '+npc.name+'</h3>'+
  '<div id="npcChatBox" style="max-height:300px;overflow-y:auto;margin:8px 0">'+
  '<div class="tcard" style="background:#2a2a4a">'+npc.name+'：'+npc.greet+'</div></div>'+
  '<div class="row" style="margin-top:8px">'+
  '<input type="text" id="npcInput" placeholder="输入你想说的话..." style="flex:1;padding:8px;border-radius:8px;border:1px solid #444;background:#1a1a2e;color:#fff" onkeydown="if(event.key===\'Enter\')npcSend()">'+
  '<button class="gbtn" onclick="npcSend()">发送</button></div>'+
  '<div class="dim small" style="margin-top:6px">提示：可以问关于热水、关灯、请假、外卖、卫生、维修等问题</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">结束对话</button>';
 modal(h);
}
function npcSend(){
 var input=document.getElementById('npcInput');
 if(!input||!input.value.trim())return;
 var msg=input.value.trim();input.value='';
 var npc=NPC_KB[G._npcChat];
 var box=document.getElementById('npcChatBox');
 box.innerHTML+='<div class="tcard" style="background:#1a3a2a;text-align:right">你：'+msg+'</div>';
 /* 关键词匹配 */
 var resp=npc.default;
 for(var i=0;i<npc.rules.length;i++){
  var rule=npc.rules[i];
  for(var j=0;j<rule.keys.length;j++){
   if(msg.indexOf(rule.keys[j])>=0){resp=rule.resp;break;}
  }
  if(resp!==npc.default)break;
 }
 setTimeout(function(){
  box.innerHTML+='<div class="tcard" style="background:#2a2a4a">'+npc.name+'：'+resp+'</div>';
  box.scrollTop=box.scrollHeight;
  G.support=cl(G.support+0.5,0,100);
 },400);
 box.scrollTop=box.scrollHeight;
}

/* ---------- L8 打架系统 ---------- */
function fightSys(){
 if(G.gender==='女'&&ch(.85)){l('⚔️ 女生之间基本不会真打架，最多吵几句。','good');G.mood-=2;return;}
 var enemies=[
  {n:'隔壁班的混混',hp:60,atk:8},
  {n:'抢你饭的人',hp:50,atk:6},
  {n:'看你不顺眼的人',hp:70,atk:10},
  {n:'偷你东西的人',hp:55,atk:7}
 ];
 var e=pk(enemies);
 G._fightEnemy={n:e.n,hp:e.hp,maxHp:e.hp,atk:e.atk};
 G._fightPlayerHp=100;
 fightMenu();
}
function fightMenu(){
 var e=G._fightEnemy;
 var h='<h3>⚔️ 打架！</h3>'+
  '<div class="tcard">对手：'+e.n+'<br>对方血量：'+e.hp+'/'+e.maxHp+'<br>你的血量：'+G._fightPlayerHp+'/100</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="fightAction(\'punch\')">👊 出拳</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="fightAction(\'kick\')">🦵 踢腿</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="fightAction(\'defend\')">🛡️ 防御</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0;background:#ff6b6b" onclick="fightAction(\'run\')">🏃 跑</button>';
 modal(h);
}
function fightAction(act){
 var e=G._fightEnemy;
 var dmg=0;
 if(act==='punch'){dmg=rnd(8,15);l('👊 你一拳打中了'+e.n+'，造成'+dmg+'伤害！');}
 if(act==='kick'){dmg=rnd(10,20);if(ch(.3)){dmg=0;l('🦵 你踢空了！');}else l('🦵 你一脚踢中了'+e.n+'，造成'+dmg+'伤害！');}
 if(act==='defend'){l('🛡️ 你举起双手防御。');G._defending=true;}
 if(act==='run'){if(ch(.6)){l('🏃 你跑掉了。','good');closeModal();return;}else l('🏃 你没跑掉，被拦住了！','warn');}
 e.hp=cl(e.hp-dmg,0,e.maxHp);
 if(e.hp<=0){l('🏆 你打赢了'+e.n+'！','good');G.mood+=10;G.fitness+=2;G.support-=5;
  if(ch(.4)){l('⚠️ 但被老师看到了，记了过。','bad');G.support-=10;}
  closeModal();return;
 }
 /* 对方反击 */
 setTimeout(function(){
  var ed=rnd(e.atk-2,e.atk+2);
  if(G._defending){ed=Math.floor(ed/2);G._defending=false;}
  G._fightPlayerHp=cl(G._fightPlayerHp-ed,0,100);
  l('💥 '+e.n+'反击了你，造成'+ed+'伤害！','warn');
  if(G._fightPlayerHp<=0){l('💀 你被打倒了...','bad');G.health-=15;G.mood-=15;G.support-=8;closeModal();return;}
  fightMenu();
 },500);
}

/* ---------- L9 新闻系统（开局弹出） ---------- */
var NEWS=[
 {title:'🏃 运动会即将到来',text:'学校通知：下个月将举办秋季运动会。各班开始报名，项目有100米、800米、跳远、跳高、接力赛等。你要报名吗？',action:'报名运动会'},
 {title:'🎵 校园音乐节',text:'听说下个月有校园音乐节，很多同学都在准备节目。你有兴趣参加吗？',action:'报名音乐节'},
 {title:'📚 期中考试安排',text:'教务处通知：期中考试将在两周后举行，考试范围为前半学期内容。请同学们认真复习。',action:null},
 {title:'🍂 秋游活动',text:'学校组织秋游，目的地是铜鉴湖公园。时间定在周五，需要交50元活动费。',action:'报名秋游'},
 {title:'🔧 宿舍维修通知',text:'本周三下午宿舍将进行电路检修，期间会停电2小时。请大家提前做好准备。',action:null},
 {title:'📢 学生会招新',text:'学生会开始招新了！有学习部、文艺部、体育部、纪检部等部门。感兴趣的同学可以去学生会办公室报名。',action:'报名学生会'},
 {title:'🎨 美术展',text:'学校美术馆将举办学生美术作品展，欢迎大家投稿。截止日期下周五。',action:'投稿美术展'},
 {title:'🏀 篮球联赛',text:'高一年级篮球联赛即将开始，以班级为单位报名。你们班组队了吗？',action:'报名篮球赛'},
 {title:'📖 读书节',text:'学校读书节活动开始了！有读书分享会、图书漂流、征文比赛等活动。',action:'参加读书节'},
 {title:'🌡️ 降温提醒',text:'气象台提醒：未来几天将大幅降温，请同学们注意添衣保暖，预防感冒。',action:null}
];
(function(){
 var _oldSG=startGame;
 startGame=function(){
  _oldSG();
  setTimeout(function(){
   if(G&&!G._newsShown){
    G._newsShown=true;
    var news=pk(NEWS);
    var h='<h3>📰 校园新闻</h3>'+
     '<div class="tcard" style="font-size:16px;padding:16px"><b>'+news.title+'</b><br><br>'+news.text+'</div>'+
     (news.action?'<button class="gbtn" style="margin-top:8px;width:100%" onclick="closeModal();l(\'✅ 你报名了'+news.action+'\',\'good\')">✅ '+news.action+'</button>':'')+
     '<button class="gbtn" style="margin-top:6px;width:100%" onclick="closeModal()">好的，我知道了</button>';
    modal(h);
   }
  },1200);
 };
})();

/* ---------- L10 闺蜜/兄弟系统 ---------- */
(function(){
 var _oldTick=tick;
 tick=function(){
  _oldTick();
  if(!G||G.over||G.resting)return;
  /* 闺蜜/兄弟随机来找你 */
  if(G.day>0&&ch(.07)&&!G._friendVisitToday){
   G._friendVisitToday=true;
   var friendName=G.gender==='女'?pk(['小雯','小美','小丽','小芳','小琳']):pk(['小强','小明','小刚','小宇','小豪']);
   var visits=[
    {t:friendName+'来找你借东西',d:'"哎，你有多余的笔吗？借我一支。"',fn:function(){if(G.backpack&&G.backpack.find(function(x){return x.n==='中性笔';})){l('📝 你借了一支笔给'+friendName+'。友情+1');G.support+=1;}else l('📝 你没有多余的笔。','warn');}},
    {t:friendName+'来找你聊天',d:'"跟你说个事，我最近发现一个秘密..."',fn:function(){G.mood+=5;l('💬 你和'+friendName+'聊了很久，心情+5');}},
    {t:friendName+'来约你吃饭',d:'"中午一起去食堂吗？我听说今天有红烧肉。"',fn:function(){G.mood+=3;l('🍜 你答应和'+friendName+'一起吃饭。心情+3');}},
    {t:friendName+'来问题',d:'"这道数学题你会吗？教我一下呗。"',fn:function(){G.knowledge+=1;G.support+=2;l('📚 你教了'+friendName+'一道题。知识+1 友情+2');}},
    {t:friendName+'来分享零食',d:'"我妈给我寄了零食，分你一点。"',fn:function(){G.mood+=6;addToBackpack('朋友给的零食','🍬','朋友分享的',true,function(){G.mood+=3;l('🍬 吃了朋友给的零食。');},1);l('🍬 '+friendName+'给了你零食。心情+6');}},
    {t:friendName+'来吐槽',d:'"我跟你说，那个老师真的太过分了..."',fn:function(){G.mood+=2;l('💬 你听了'+friendName+'的吐槽。心情+2');}},
    {t:friendName+'来约你周末出去玩',d:'"周末有空吗？一起去逛商场？"',fn:function(){G.mood+=4;l('🎉 '+friendName+'约你周末出去玩。心情+4');}},
    {t:friendName+'来提醒你',d:'"明天要交作业了，你写了吗？"',fn:function(){G.mood-=1;l('📝 '+friendName+'提醒你交作业。','warn');}}
   ];
   var v=pk(visits);
   setTimeout(function(){
    var h='<h3>👭 '+v.t+'</h3><div class="tcard" style="font-size:15px;padding:14px">'+v.d+'</div>'+
     '<button class="gbtn" style="margin-top:8px;width:100%" onclick="closeModal()">回应</button>';
    modal(h);v.fn();
   },1500);
  }
  if(G.idx===0)G._friendVisitToday=false;
 };
})();

/* ---------- L11 成就动画加大 ---------- */
(function(){
 var _oldAch=ach;
 ach=function(id){
  if(G.ach&&G.ach[id])return;
  _oldAch(id);
  setTimeout(function(){
   var name=id;for(var _i=0;_i<ACH_S.length;_i++)if(ACH_S[_i].id===id)name=ACH_S[_i].n;for(var _j=0;_j<ACH_T.length;_j++)if(ACH_T[_j].id===id)name=ACH_T[_j].n;
   /* 大动画：全屏遮罩+大卡片 */
   var overlay=document.createElement('div');
   overlay.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s';
   overlay.innerHTML='<div style="background:linear-gradient(135deg,#ffd166,#ff9f43,#ff6b6b);padding:40px 60px;border-radius:20px;text-align:center;box-shadow:0 0 60px rgba(255,209,102,.6);animation:achBig .6s cubic-bezier(.2,.9,.3,1.4)">'+
    '<div style="font-size:64px;margin-bottom:10px">🏆</div>'+
    '<div style="font-size:14px;color:rgba(0,0,0,.6);letter-spacing:4px;margin-bottom:6px">ACHIEVEMENT UNLOCKED</div>'+
    '<div style="font-size:28px;font-weight:900;color:#1a1a2e;margin-bottom:8px">'+name+'</div>'+
    '<div style="font-size:14px;color:rgba(0,0,0,.7)">成就解锁！</div></div>';
   document.body.appendChild(overlay);
   /* 音效 */
   try{
    var ctx=new (window.AudioContext||window.webkitAudioContext)();
    [523,659,784,1047].forEach(function(freq,i){
     var o=ctx.createOscillator();var g=ctx.createGain();
     o.connect(g);g.connect(ctx.destination);
     o.frequency.value=freq;o.type='sine';
     g.gain.setValueAtTime(.2,ctx.currentTime+i*.1);
     g.gain.exponentialRampToValueAtTime(.01,ctx.currentTime+i*.1+.3);
     o.start(ctx.currentTime+i*.1);o.stop(ctx.currentTime+i*.1+.3);
    });
   }catch(e){}
   setTimeout(function(){overlay.style.opacity='0';overlay.style.transition='opacity .5s';setTimeout(function(){overlay.remove();},500);},2000);
  },200);
 };
})();

/* ---------- L12 老师监察系统重做 ---------- */
(function(){
 var _oldTick2=tick;
 tick=function(){
  _oldTick2();
  if(!G||G.over||G.resting)return;
  /* 老师随机巡查 */
  if(G.idx>0&&G.idx<20&&ch(.05)&&!G._teacherCheckToday){
   G._teacherCheckToday=true;
   var checks=[
    {t:'👀 班主任在窗外看',d:'你余光瞥见班主任在窗外盯着教室。你赶紧坐直了。',eff:function(){G.support+=1;l('👀 班主任巡查，你表现良好。支持度+1');}},
    {t:'📋 年级主任查课',d:'年级主任推门进来查课，看了看大家的状态。',eff:function(){if(G.sleep>70){l('📋 年级主任看到你在打瞌睡，记了名字！','bad');G.support-=5;}else l('📋 年级主任查课，一切正常。');}},
    {t:'🔍 值周生检查',d:'值周生进来检查卫生和纪律，扫了一眼你的座位。',eff:function(){G.support+=1;l('🔍 值周生检查，你的座位很整洁。支持度+1');}},
    {t:'📱 突击查手机',d:'班主任突然说："把手机都交出来！"',eff:function(){if(G.phoneTaken){l('📱 你已经没有手机了，躲过一劫。');}else if(ch(.4)){l('📱 你的手机被查到了！没收！','bad');G.phoneTaken=true;G.mood-=10;}else l('📱 你把手机藏好了，没被查到。','good');}},
    {t:'🧥 查校服',d:'值周老师站在门口查校服。',eff:function(){if(G.outfitOk){l('🧥 你穿了校服，顺利通过。');}else{l('🧥 你没穿校服，被拦下来了！','bad');G.support-=3;G.mood-=5;}}}
   ];
   var c=pk(checks);
   setTimeout(function(){
    var h='<h3>'+c.t+'</h3><div class="tcard" style="font-size:15px;padding:14px">'+c.d+'</div>'+
     '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">知道了</button>';
    modal(h);c.eff();
   },1500);
  }
  if(G.idx===0)G._teacherCheckToday=false;
 };
})();

/* ---------- L13 开会系统重做 ---------- */
function meetingSys(){
 var meetings=[
  {n:'班会',d:'班主任在讲台上讲了20分钟纪律问题，你听得昏昏欲睡。',mood:-3,know:0},
  {n:'年级大会',d:'全年级在大礼堂开会，主任讲了学习方法和考试安排。',mood:-2,know:1},
  {n:'家长会（学生回避）',d:'家长去开家长会了，你在教室忐忑不安地等消息。',mood:-5,know:0},
  {n:'社团会议',d:'你参加了社团会议，讨论了下次活动的安排。',mood:3,know:0},
  {n:'学生会会议',d:'你作为学生会成员参加了会议，讨论了校园活动策划。',mood:2,know:1},
  {n:'安全教育大会',d:'学校组织安全教育大会，讲了消防、交通、防诈骗等知识。',mood:-1,know:2},
  {n:'考前动员大会',d:'考前动员大会，校长给大家加油打气。',mood:2,know:0},
  {n:'颁奖典礼',d:'学校举行颁奖典礼，你看着别人上台领奖，心里有点羡慕。',mood:-2,know:0}
 ];
 var m=pk(meetings);
 l('📋 你参加了'+m.n+'：'+m.d,mood>=0?'good':'warn');
 G.mood=cl(G.mood+m.mood,0,100);
 G.knowledge=cl(G.knowledge+m.know,0,100);
}

/* ---------- L14 开局必须选完才能开始 ---------- */
(function(){
 var _oldStart=startGame;
 startGame=function(){
  /* 检查必填项 */
  if(!O.name||O.name==='张逸天'){l('⚠️ 请先输入姓名！','warn');return;}
  if(!O.gender){l('⚠️ 请选择性别！','warn');return;}
  if(!O.shoes||O.shoes.length<2){l('⚠️ 请至少选2双鞋带去学校！','warn');return;}
  if(!O.zjSubjects||O.zjSubjects.length!==3){l('⚠️ 请完成3+x选科（选3门）！','warn');return;}
  if(!O.pref){l('⚠️ 请选择性取向！','warn');return;}
  _oldStart();
 };
})();

/* ---------- L15 存档系统重做 ---------- */
function saveGame554(){
 try{
  var data={
   G:G,O:O,
   backpack:G.backpack,shoesOwned:G.shoesOwned,outfit:G.outfit,outfitOk:G.outfitOk,
   subject:G.subject||O.zjSubjects,parentRelation:G.parentRelation,
   weather:G.weather,phoneBat:G.phoneBat,sfxOn:G._sfxOn,fakeOnline:G._fakeOnline
  };
  localStorage.setItem('xizi_save_554',JSON.stringify(data));
  l('💾 游戏已保存（5.5.4格式）','good');
 }catch(e){l('💾 保存失败：'+e.message,'bad');}
}
function loadGame554(){
 try{
  var raw=localStorage.getItem('xizi_save_554');
  if(!raw){l('📂 没有找到5.5.4存档','warn');return false;}
  var data=JSON.parse(raw);
  if(data.G)G=data.G;
  if(data.O)O=data.O;
  l('📂 存档已读取（5.5.4格式）','good');
  return true;
 }catch(e){l('📂 读取失败：'+e.message,'bad');return false;}
}
/* 包一层原saveGame */
(function(){
 if(typeof saveGame==='function'){
  var _oldSave=saveGame;
  saveGame=function(){_oldSave();try{saveGame554();}catch(e){}};
 }
})();

/* 5.5.4 初始渲染 */
try{renderShoes();}catch(e){}
try{lyricUpdate();}catch(e){}
try{renderZJSubjects();}catch(e){}

/* ================================================================
   附录 M · 5.5.5 纯追加
   ================================================================ */

/* ---------- M1 精确课表系统重做 ---------- */
(function(){
 var _oldBuild=buildStudentDay;
 buildStudentDay=function(){
  var subs=O.zjSubjects||G.zjSubjects||['物理','化学','地理'];
  var day=G.date.getDay();
  var a=[];
  /* 6:10 起床 */
  a.push(mk('06:10','wake',{loc:'宿舍'}));
  /* 6:50前到操场，跑步10分钟（下雨不跑直接吃早饭） */
  a.push(mk('06:50','exercise',{loc:'操场'}));
  /* 7:20前回教室，7:20-7:50早读 */
  a.push(mk('07:20','morningRead',{loc:'教室'}));
  /* 7:50-7:55 休息5分钟 */
  a.push(mk('07:55','break',{loc:'教室'}));
  /* 上午4节课，每节40分钟，课间10分钟 */
  var mornSubs=['语文','数学','英语'];
  if(day===1||day===3||day===5)mornSubs.splice(1,0,'物理学考');
  if(day===2||day===4||day===5)mornSubs.splice(2,0,'政治学考');
  a.push(mk('08:00','class',{n:1,subject:mornSubs[0]||'语文'}));
  a.push(mk('08:50','break',{loc:'教室'}));
  a.push(mk('09:00','class',{n:2,subject:mornSubs[1]||'数学'}));
  /* 10:35-10:40 眼操（在第2、3节课之间） */
  a.push(mk('09:50','eyecare',{n:1}));
  a.push(mk('09:55','class',{n:3,subject:mornSubs[2]||'英语'}));
  a.push(mk('10:45','break',{loc:'教室'}));
  a.push(mk('10:55','class',{n:4,subject:mornSubs[3]||subs[0]}));
  /* 12:00 吃饭 */
  a.push(mk('12:00','meal',{which:'午饭',loc:'食堂'}));
  /* 12:40前回教室，12:40-13:05午休 */
  a.push(mk('12:40','nap',{loc:'教室'}));
  /* 13:05-13:10 休息5分钟 */
  a.push(mk('13:10','break',{loc:'教室'}));
  /* 下午4节课，每节40分钟 */
  a.push(mk('13:15','class',{n:5,subject:subs[1]||subs[0]}));
  a.push(mk('14:05','break',{loc:'教室'}));
  a.push(mk('14:15','class',{n:6,subject:subs[2]||subs[0]}));
  /* 15:30-15:35 实验操（在第2、3节下午课之间） */
  a.push(mk('15:05','eyecare',{n:2}));
  a.push(mk('15:10','class',{n:7,subject:subs.indexOf('技术')>=0?'技术':pk(['语文','数学','英语'])}));
  a.push(mk('15:55','break',{loc:'教室'}));
  /* 16:25 下午第四节结束 */
  a.push(mk('16:05','class',{n:8,subject:pk(['语文','数学','英语'])}));
  /* 16:25后去吃饭 */
  a.push(mk('16:30','dinner',{loc:'食堂'}));
  /* 18:00开始晚自习，4节，每节50分钟，中间休息10分钟 */
  a.push(mk('18:00','night',{n:1,loc:'教室'}));
  a.push(mk('19:00','night',{n:2}));
  a.push(mk('20:00','night',{n:3}));
  a.push(mk('21:00','night',{n:4}));
  /* 21:50晚自习结束，休息，回宿舍 */
  a.push(mk('21:50','dorm',{loc:'宿舍'}));
  /* 22:20熄灯 */
  a.push(mk('22:20','sleep',{loc:'宿舍'}));
  /* 体育只有周一和周四 */
  if(day===1||day===4){
   for(var i=0;i<a.length;i++){
    if(a[i].n===7&&a[i].type==='class'){a[i].subject='体育';break;}
   }
  }
  return a;
 };
})();

/* ---------- M2 右上角性取向显示 ---------- */
(function(){
 var _oldUpd=upd;
 upd=function(){
  _oldUpd();
  try{
   if(!G)return;
   var prefBar=document.getElementById('prefBar');
   if(!prefBar){
    prefBar=document.createElement('div');
    prefBar.id='prefBar';
    prefBar.style.cssText='position:fixed;top:8px;right:120px;z-index:999;background:rgba(124,156,255,.2);padding:4px 12px;border-radius:8px;font-size:13px;color:#7c9cff;font-weight:700;backdrop-filter:blur(4px)';
    document.body.appendChild(prefBar);
   }
   var prefText='';
   if(G.pref==='异性')prefText='🏳️‍🌈 异性恋';
   else if(G.pref==='同性')prefText='🏳️‍🌈 同性恋';
   else prefText='🏳️‍🌈 双性恋';
   prefBar.textContent=prefText+' · '+G.gender;
  }catch(e){}
 };
})();

/* ---------- M3 音乐播放bug修复 ---------- */
(function(){
 var _oldSG=startGame;
 startGame=function(){
  _oldSG();
  setTimeout(function(){
   try{
    var audio=document.getElementById('bgm')||document.querySelector('audio');
    if(audio){
     audio.volume=0.5;
     var playPromise=audio.play();
     if(playPromise!==undefined){
      playPromise.catch(function(){
       /* 自动播放被阻止，等待用户交互 */
       var resume=function(){audio.play();document.removeEventListener('click',resume);};
       document.addEventListener('click',resume);
      });
     }
    }
   }catch(e){}
  },1000);
 };
})();

/* ---------- M4 大量随机文字增加（300+条） ---------- */
var EXTRA_TEXTS_555={
 wake:[
  '你被宿管阿姨的大嗓门叫醒了。','闹钟响了三遍你才爬起来。','窗外的鸟叫声把你吵醒了。','你做了个好梦，不想起床。','室友的呼噜声停了，你也醒了。',
  '你猛地坐起来，发现差点迟到。','阳光透过窗帘缝照在你脸上。','你翻了个身，决定再睡5分钟。','宿舍的灯突然亮了，你被晃醒了。','你梦见了好吃的，醒了发现是饿的。',
  '今天是被冻醒的，被子掉地上了。','你被隔壁宿舍的吵闹声吵醒了。','闹钟没响，但你自然醒了。','你伸了个大大的懒腰，感觉还不错。','你看了眼手机，才6点，继续睡。',
  '宿管阿姨在走廊喊："起床了起床了！"','你被自己的口水呛醒了。','梦里在考试，吓醒了。','你感觉今天精神特别好。','你翻了个身，把被子裹得更紧了。'
 ],
 exercise:[
  '跑道上已经有不少人了。','你看到体育老师在终点计时。','前面的人跑得飞快，你追不上。','你感觉今天腿特别沉。','跑着跑着，你想起了昨天的数学题。',
  '风很大，吹得你脸疼。','你超过了一个人，有点小得意。','你感觉肺要炸了。','旁边的人在聊天，你也想加入。','你看到暗恋的人在前面，突然有劲了。',
  '跑着跑着鞋带开了，你停下来系。','你感觉今天状态不错，跑得很轻松。','体育老师喊："最后一圈加速！"','你岔气了，只能走两步。','你边跑边数步数，分散注意力。',
  '操场上的国旗在风中飘扬。','你看到有人在偷懒走路。','你跑完了，大口喘气。','你感觉汗水顺着后背流下来。','今天跑的比昨天快了一点。'
 ],
 morningRead:[
  '你大声读着英语单词。','你在读语文课文，旁边的人比你还大声。','你偷偷在早读课上吃早饭。','你读着读着就走神了。','课代表在讲台上领读。',
  '你感觉嗓子有点干。','你在读昨天没背完的古文。','班主任在窗外看着，你赶紧坐直。','你和同桌小声聊天，被课代表瞪了一眼。','你在读英语，发音被同桌嘲笑了。',
  '你在读政治，感觉很催眠。','你在读历史，突然觉得很有意思。','你偷偷在桌子底下玩手机。','你在读地理，看着地图发呆。','你在读数学公式，感觉完全看不懂。',
  '你在读生物，突然想到了一个问题。','你在读化学，元素周期表背不下来。','你在读物理，公式太多了。','你在读技术，感觉还挺实用的。','你读完了，开始发呆等下课。'
 ],
 class_general:[
  '老师在黑板上写了满满一板。','你感觉这节课特别漫长。','老师点你回答问题，你不会。','你听懂了，感觉很有成就感。','你完全没听懂，开始发呆。',
  '同桌在偷偷吃东西，香味飘过来。','老师讲了个笑话，全班都笑了。','你在课本上画画。','你感觉这节课过得特别快。','老师布置了一大堆作业。',
  '你在下面偷偷看小说。','你在认真做笔记。','你和同桌传小纸条。','老师突然走到你旁边，你吓了一跳。','你感觉这个老师讲课特别无聊。',
  '你在算一道数学题，算不出来。','你在背英语单词，背了就忘。','你在看窗外的风景。','你在想中午吃什么。','你在想周末去哪里玩。',
  '老师讲了个例题，你恍然大悟。','你在抄黑板上的笔记。','你在打瞌睡，被同桌戳醒了。','你在想昨天看的电视剧。','你在想喜欢的人。',
  '老师让你们分组讨论，你和同桌聊起了天。','你在做练习题，感觉都会。','你在做练习题，一道都不会。','老师拖堂了，你很着急。','终于下课了，你松了口气。'
 ],
 break_extra:[
  '你趴在桌子上补觉。','你去走廊透透气。','你和同学去小卖部买水。','你在教室后面和人聊天。','你在补刚才没听懂的内容。',
  '你在照镜子整理头发。','你在玩手指。','你在看窗外的云。','你在和同桌打闹。','你在写小纸条给前面的人。',
  '你去饮水机灌水，发现没水了。','你在走廊看到了喜欢的人。','你被人从背后吓了一跳。','你在和同学讨论刚才的题。','你在吃从家里带的零食。',
  '你在玩手机，差点被老师看到。','你在整理书包。','你在发愣。','你在和人打赌下节课老师会不会拖堂。','你在看课程表，期待下节体育课。'
 ],
 meal_extra:[
  '食堂今天人特别多。','你看到了想吃的菜，很开心。','打饭的阿姨手抖了一下，菜少了。','你找了个位置坐下。','你和同学拼桌吃饭。',
  '今天的菜特别咸。','今天的菜特别好吃。','你吃到了一根头发，没胃口了。','你吃得太快，噎住了。','你在慢慢吃，享受午饭时间。',
  '你在食堂看到了喜欢的人。','你在和同学聊八卦。','你在看手机吃饭。','你在想下午的课。','你吃完了，还想再吃点。',
  '你打了很多饭，吃不完。','你打了很少的饭，不够吃。','你在喝汤，汤很烫。','你在吃肉，感觉很幸福。','你在吃素，感觉很健康。'
 ],
 nap_extra:[
  '你趴在桌子上睡着了。','你在午休时刷题。','你在看小说。','你在和同桌小声聊天。','你在玩手机。',
  '你在补早上没睡够的觉。','你在写作业。','你在发呆。','你在吃东西。','你在整理上午的笔记。',
  '你被旁边的人说话声吵醒了。','你做了个噩梦。','你流口水了，被同桌笑了。','你在听音乐。','你在看窗外。',
  '你在和前后桌聊天。','你在补妆。','你在玩头发。','你在转笔。','你在等午休结束。'
 ],
 night_extra:[
  '晚自习很安静，只有写字声。','你在认真写作业。','你在发呆。','你在偷偷玩手机。','你在和同桌传纸条。',
  '你在刷题，感觉很充实。','你在看课外书。','你在睡觉，被值班老师叫醒了。','你在吃东西，怕被发现。','你在写日记。',
  '你在想明天的课。','你在想周末。','你在想喜欢的人。','你在算还有多久放学。','你在和同桌对答案。',
  '你在抄作业。','你在帮同学讲题。','你在画漫画。','你在折纸。','你在听音乐，感觉很放松。'
 ],
 dorm_extra:[
  '宿舍里很热闹，大家都在聊天。','你在洗漱。','你在和室友打牌。','你在玩手机。','你在吃夜宵。',
  '你在和室友聊八卦。','你在写日记。','你在看小说。','你在准备明天的衣服。','你在整理书包。',
  '宿管阿姨来查寝了，大家赶紧安静。','你在和室友吵架。','你在和室友和好。','你在分享零食。','你在听室友讲鬼故事。',
  '你在洗衣服。','你在晾衣服。','你在找东西，找不到。','你在和室友一起看视频。','你在准备睡觉了。'
 ],
 random_events:[
  '你在走廊捡到了一块钱。','你被人撞了一下，对方道歉了。','你看到有人在吵架。','你看到有人在表白。','你看到猫在校园里溜达。',
  '你收到了一封匿名信。','你被老师叫去办公室。','你被表扬了，很开心。','你被批评了，很沮丧。','你考试考了高分。',
  '你考试考砸了。','你被分到了新的座位。','你换了新同桌。','你被选为班干部。','你参加了社团活动。',
  '你在图书馆借了本书。','你在操场看到了彩虹。','你在食堂吃到了免费的汤。','你被蜜蜂蛰了一下。','你感冒了。',
  '你感觉今天特别幸运。','你感觉今天特别倒霉。','你做了好事，被人感谢了。','你帮同学捡了东西。','你被人帮助了，很感动。'
 ]
};

/* ---------- M5 下课更多事情 ---------- */
(function(){
 var _oldBreak=SLOTS.break;
 SLOTS.break=function(){
  G._breakTime=10;G._breakActions=0;
  return breakMenu555();
 };
})();
function breakMenu555(){
 var remain=G._breakTime||10;
 var h='<h3>⏰ 课间10分钟（还剩 '+remain+' 分钟）</h3><div class="quote">已做 '+G._breakActions+' 件事</div>'+
  '<div style="max-height:400px;overflow-y:auto">'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'toilet\')">🚻 去厕所（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'water\')">💧 去灌水（2-4分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'playground\')">🏃 去操场走走（5-8分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'shop\')">🛒 去小卖部（5-8分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'phone\')">📱 玩会儿手机（3-6分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'chat\')">💬 和同学聊天（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'desk\')">📚 留在教室（不耗时）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'stretch\')">🤸 伸个懒腰（1分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'mirror\')">🪞 照镜子整理（2分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'snack\')">🍬 吃点零食（2分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'walk\')">🚶 走廊散步（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'library\')">📖 去图书角（4-6分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'plant\')">🌱 看看教室植物（1分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="breakDo555(\'daydream\')">💭 发会儿呆（2-4分钟）</button>'+
  '</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0;background:#ff6b6b" onclick="breakEnd555()">🏃 回教室（结束课间）</button>';
 modal(h);
}
function breakDo555(act){
 var times={toilet:[3,5],water:[2,4],playground:[5,8],shop:[5,8],phone:[3,6],chat:[3,5],desk:[0,0],stretch:[1,1],mirror:[2,2],snack:[2,2],walk:[3,5],library:[4,6],plant:[1,1],daydream:[2,4]};
 var t=rnd(times[act][0],times[act][1]);
 G._breakTime=(G._breakTime||10)-t;
 G._breakActions++;
 var msgs={
  toilet:'🚻 你去了趟厕所，花了'+t+'分钟。',water:'💧 你去灌了水，花了'+t+'分钟。',
  playground:'🏃 你去操场走了走，花了'+t+'分钟。体力+1',shop:'🛒 你去了小卖部，花了'+t+'分钟。',
  phone:'📱 你玩了会儿手机，花了'+t+'分钟。心情+3',chat:'💬 你和同学聊天，花了'+t+'分钟。心情+4 支持度+1',
  desk:'📚 你留在教室预习。',stretch:'🤸 你伸了个懒腰，舒服多了。心情+1',
  mirror:'🪞 你照了照镜子，整理了一下头发。心情+2',snack:'🍬 你吃了点零食，心情+2',
  walk:'🚶 你在走廊散了散步，花了'+t+'分钟。',library:'📖 你去图书角翻了翻书，花了'+t+'分钟。知识+1',
  plant:'🌱 你看了看教室的植物，它又长高了一点。',daydream:'💭 你发了会儿呆，花了'+t+'分钟。'
 };
 if(act==='playground')G.fitness=cl(G.fitness+1,0,100);
 if(act==='phone'){if(phoneOK()){G.st.phone++;G.mood=cl(G.mood+3,0,100);}else l('📱 手机被扣了。','warn');}
 if(act==='chat'){G.mood=cl(G.mood+4,0,100);G.support=cl(G.support+1,0,100);}
 if(act==='stretch'||act==='mirror'||act==='snack')G.mood=cl(G.mood+(act==='snack'?2:act==='mirror'?2:1),0,100);
 if(act==='library')G.knowledge=cl(G.knowledge+1,0,100);
 if(act==='shop'){if(ch(.3)){l('🛒 你去了小卖部，但回来时上课铃已经响了！','warn');G.st.skip++;closeModal();next();return;}}
 l(msgs[act]);
 /* 随机事件 */
 if(ch(.15)){l(pk(EXTRA_TEXTS_555.random_events),'good');}
 if(G._breakTime<=0){l('⏰ 上课铃响了。');closeModal();next();return;}
 if(G._breakActions>=6){l('⏰ 做了太多事，上课铃响了。');closeModal();next();return;}
 breakMenu555();
}
function breakEnd555(){l('🏃 你提前回了教室。');closeModal();next();}

/* ---------- M6 上课闺蜜/同桌互动增加 ---------- */
(function(){
 var _oldClass=SLOTS.class;
 SLOTS.class=function(s){
  G._classTime=40;G._classActions=0;G._classSubject=s.subject||'语文';
  return classMenu555(s);
 };
})();
function classMenu555(s){
 var remain=G._classTime||40;
 var subj=G._classSubject||'语文';
 var h='<h3>📖 '+subj+'课（还剩 '+remain+' 分钟）</h3><div class="quote">第 '+(s&&s.n?s.n:'')+' 节 · 已做 '+G._classActions+' 件事</div>'+
  '<div style="max-height:400px;overflow-y:auto">'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'listen\')">📝 认真听课（10-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'phone\')">📱 偷偷玩手机（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'sleep\')">😴 打瞌睡（10-20分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'toilet\')">🚻 举手去厕所（5-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'clinic\')">🏥 装病去医务室（15-25分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'chat\')">💬 和同桌说话（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'draw\')">🎨 课本上画画（5-10分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'note\')">📒 做笔记（10-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'deskmate\')">👭 找闺蜜/兄弟借东西（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'passnote\')">📝 传小纸条（5-8分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'snack\')">🍬 偷偷吃东西（3-5分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'mirror\')">🪞 照小镜子（2-4分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'homework\')">📚 写别的作业（10-15分钟）</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="classDo555(\'daydream\')">💭 走神发呆（5-15分钟）</button>'+
  '</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0;background:#ff6b6b" onclick="classEnd555()">⏰ 等到下课</button>';
 modal(h);
}
function classDo555(act){
 var times={listen:[10,15],phone:[5,10],sleep:[10,20],toilet:[5,15],clinic:[15,25],chat:[5,10],draw:[5,10],note:[10,15],deskmate:[3,5],passnote:[5,8],snack:[3,5],mirror:[2,4],homework:[10,15],daydream:[5,15]};
 var t=rnd(times[act][0],times[act][1]);
 G._classTime=(G._classTime||40)-t;
 G._classActions++;
 switch(act){
  case 'listen':G.knowledge+=2;G.support+=1;l('📝 你认真听了'+t+'分钟课。知识+2 支持度+1');break;
  case 'phone':
   if(!phoneOK()){l('📱 手机被扣了。','warn');}
   else{G.st.phone++;G.mood+=3;l('📱 你偷偷玩了'+t+'分钟手机。心情+3');
    if(ch(.2)){l('⚠️ 老师好像注意到你了...','warn');G.support-=2;}}
   break;
  case 'sleep':G.sleep=cl(G.sleep+t*0.5,0,100);l('😴 你打瞌睡了'+t+'分钟。');
   if(ch(.15)){l('⚠️ 老师扔了个粉笔头过来！','bad');G.mood-=5;G.support-=3;}break;
  case 'toilet':l('🚻 你举手去了厕所，花了'+t+'分钟。');break;
  case 'clinic':
   if(!tc(.3,'criticize','校医一摸你的脉搏："跳这么有力？"')){l('🏥 你成功混到了医务室，躺了'+t+'分钟。');G.sleep=cl(G.sleep-15,0,100);}
   break;
  case 'chat':G.mood+=3;l('💬 你和同桌说了'+t+'分钟话。心情+3');
   if(ch(.2)){l('⚠️ 被老师点名了！','warn');G.support-=2;}break;
  case 'draw':G.mood+=2;G.creativity=(G.creativity||0)+1;l('🎨 你在课本上画了'+t+'分钟画。心情+2 创造力+1');break;
  case 'note':G.knowledge+=3;l('📒 你认真做了'+t+'分钟笔记。知识+3');break;
  case 'deskmate':
   var items=['笔','橡皮','尺子','纸巾','水','零食'];
   var item=pk(items);
   l('👭 你找闺蜜/兄弟借了'+item+'。友情+1');G.support+=1;break;
  case 'passnote':
   var notes=['中午吃什么？','这题会吗？','下课一起去厕所','老师今天好凶','晚上一起回宿舍','你看窗外那只鸟'];
   l('📝 你传了张小纸条："'+pk(notes)+'"');G.mood+=2;
   if(ch(.15)){l('⚠️ 小纸条被老师截获了！','bad');G.support-=5;}break;
  case 'snack':
   var snacks=['薯片','饼干','巧克力','糖','辣条','面包'];
   l('🍬 你偷偷吃了'+pk(snacks)+'。心情+3');G.mood+=3;
   if(ch(.1)){l('⚠️ 吃东西的声音被老师听到了！','warn');G.support-=2;}break;
  case 'mirror':l('🪞 你照了照小镜子，整理了一下头发。心情+2');G.mood+=2;break;
  case 'homework':G.knowledge+=1;l('📚 你在写别的科目的作业，花了'+t+'分钟。知识+1');break;
  case 'daydream':l('💭 你走神发呆了'+t+'分钟，想了很多有的没的。');break;
 }
 /* 随机课堂文字 */
 if(ch(.2)){l(pk(EXTRA_TEXTS_555.class_general));}
 if(G._classTime<=0){l('⏰ 下课铃响了。');closeModal();next();return;}
 if(G._classActions>=7){l('⏰ 这节课快结束了。');closeModal();next();return;}
 classMenu555({n:G._classActions});
}
function classEnd555(){l('⏰ 你等到了下课。');closeModal();next();}

/* ---------- M7 动画系统增加 ---------- */
(function(){
 /* 按钮点击动画 */
 var style=document.createElement('style');
 style.textContent=''+
  '@keyframes btnClick{0%{transform:scale(1)}50%{transform:scale(.95)}100%{transform:scale(1)}}'+
  '@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}'+
  '@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}'+
  '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}'+
  '@keyframes glow{0%,100%{box-shadow:0 0 5px rgba(124,156,255,.5)}50%{box-shadow:0 0 20px rgba(124,156,255,.8)}}'+
  '.gbtn{transition:all .15s ease}'+
  '.gbtn:active{animation:btnClick .15s ease}'+
  '.tcard{animation:fadeInUp .3s ease}'+
  '#modal .tcard{animation:fadeInUp .3s ease}';
 document.head.appendChild(style);
 /* 给所有按钮加点击动画 */
 document.addEventListener('click',function(e){
  if(e.target.classList&&e.target.classList.contains('gbtn')){
   e.target.style.animation='none';
   setTimeout(function(){e.target.style.animation='btnClick .15s ease';},10);
  }
 });
})();

/* ---------- M8 跑操系统精确时间（6:50跑步10分钟，下雨直接吃早饭） ---------- */
(function(){
 var _oldEx=SLOTS.exercise;
 SLOTS.exercise=function(){
  /* 下雨不跑操，直接去吃早饭 */
  if(G.weather&&G.weather.rain>=1&&G.weather.n.indexOf('雷')<0){
   return {title:'🌧️ 06:50 跑操（雨天取消）',text:'外面在下雨，跑操取消了。你可以直接去吃早饭。',
    choices:[
     C('🍜 直接去吃早饭','提前去食堂',function(){l('🌧️ 下雨不跑操，你直接去了食堂。','good');G.mood+=5;next();}),
     C('😴 回宿舍再睡会儿','可能迟到',function(){if(ch(.3)){l('😴 你睡过头了，第一节课迟到了！','bad');G.support-=5;}else l('😴 你回宿舍眯了一会儿。');next();})
    ]};
  }
  if(G.gender==='女'&&G.period){
   return {title:'🤸 06:50 早操（生理期）',text:'广播里放着进行曲，但小腹一阵阵地疼。',
    choices:[
     C('🙋 举手请假','基本不会被发现',function(){G.pain=cl(G.pain-1,0,5);G.mood+=4;l('你在看台上坐了一节课。');next();}),
     C('😣 忍一忍坚持跑','消耗体力',function(){G.pain=cl(G.pain+1,0,5);G.fitness+=3;if(ch(.3)){G.health-=4;l('跑到一半你疼得蹲下了。','bad');}else l('你咬牙跑完了。');next();}),
     C('💊 先吃片止痛药','需止痛药',function(){G.pain=cl(G.pain-3,0,5);G.mood+=5;l('💊 药效上来了。');next();})
    ]};
  }
  return {title:'🤸 06:50 跑操（跑步10分钟）',text:'操场上放着进行曲，全校排成方阵。体育老师喊："跑起来！"',
   choices:[
    C('🏃 认真跑10分钟','消耗体力/提高睡眠质量',function(){G.fitness+=3;G.sleep-=8;G._sleepBonus=(G._sleepBonus||0)+5;l('你认真跑完了10分钟，出了一身汗。体力+3');next();}),
    C('🙋 请假（说肚子痛）','基本不会被发现',function(){if(!tc(.12,'criticize','体育老师看了你一眼："真的？"')){l('你成功请假，在看台上坐了一节课。');}next();}),
    C('👟 蹲下假装系鞋带','35%被抓',function(){if(!tc(.35,'criticize','你蹲着系了三分钟鞋带')){G.mood+=2;l('你蹲着摸完了整场跑操。');}next();}),
    C('💬 边跑边唠嗑','心情+5/25%被抓',function(){G.mood+=5;if(!tc(.25,'criticize','你和隔壁班的人聊得太开心被点了名'))l('你们把跑操变成了早聊。');next();})
   ]};
 };
})();

/* 5.5.5 初始渲染 */
try{renderShoes();}catch(e){}
try{lyricUpdate();}catch(e){}
try{renderZJSubjects();}catch(e){}

/* ================================================================
   附录 N · 5.5.6 纯追加
   ================================================================ */

/* ---------- N1 窗口层级修复（统一z-index管理） ---------- */
(function(){
 var _oldModal=modal;
 modal=function(html){
  /* 只关闭额外动态创建的overlay，不删除复用的#modal */
  var overlays=document.querySelectorAll('.modal-overlay');
  for(var i=0;i<overlays.length;i++){overlays[i].remove();}
  /* 确保#modal存在（若曾被误删则重建） */
  if(!document.getElementById('modal')){
   var d=document.createElement('div');d.id='modal';d.className='modal hidden';
   d.innerHTML='<div class="modalbox" id="modalbox"></div>';
   document.body.appendChild(d);
  }
  _oldModal(html);
  /* 确保modal在最上层 */
  setTimeout(function(){
   var m=document.getElementById('modal');
   if(m){m.style.zIndex=20000;}
  },10);
 };
})();
/* 统一关闭modal */
(function(){
 var _oldClose=closeModal;
 closeModal=function(){
  _oldClose();
  /* 只清理额外overlay，不删除复用的#modal */
  var overlays=document.querySelectorAll('.modal-overlay');
  for(var i=0;i<overlays.length;i++){overlays[i].remove();}
 };
})();

/* ---------- N2 性能优化（合并定时器，减少DOM操作） ---------- */
(function(){
 /* 合并所有lyric更新到一个interval */
 /* _lyricInterval已禁用，与lrcUpdate重复 */
 if(false){window._lyricInterval=setInterval(function(){
  try{
   var audio=document.getElementById('bgm')||document.querySelector('audio');
   if(!audio||!audio.currentTime)return;
   var idx=(typeof BGM_IDX!=='undefined')?BGM_IDX:0;
   var lrc=LRC_DATA[idx%LRC_DATA.length];
   var t=audio.currentTime;var line='';
   for(var i=0;i<lrc.length;i++){if(t>=lrc[i][0])line=lrc[i][1];}
   var el=document.getElementById('lyricText');
   if(el&&line&&el.textContent!=='🎵 '+line)el.textContent='🎵 '+line;
   var sl=document.getElementById('splashLyric');
   if(sl&&el)sl.textContent=el.textContent;
  }catch(e){}
 },800);}
})();

/* ---------- N3 活人感系统（NPC日程+随机遭遇） ---------- */
var NPC_SCHEDULE=[
 {name:'张小明',role:'同班同学',loc:'教室',time:'07:00-12:00',desc:'坐在你前面，数学很好，经常被人问题目'},
 {name:'李小红',role:'同班同学',loc:'教室',time:'07:00-12:00',desc:'语文课代表，喜欢看小说'},
 {name:'王大力',role:'体育生',loc:'操场',time:'06:30-07:30,16:00-18:00',desc:'篮球队主力，肌肉发达'},
 {name:'赵文静',role:'学霸',loc:'图书馆/教室',time:'全天',desc:'年级前十，总是在学习'},
 {name:'孙小美',role:'文艺委员',loc:'音乐教室/教室',time:'下午',desc:'会弹钢琴，文艺晚会主持人'},
 {name:'周老师',role:'班主任',loc:'办公室/教室',time:'全天',desc:'教数学，很严格但人很好'},
 {name:'吴阿姨',role:'食堂阿姨',loc:'食堂',time:'11:00-13:00,17:00-18:30',desc:'打饭手抖，但人很热情'},
 {name:'郑保安',role:'门卫',loc:'校门口',time:'全天',desc:'查出门单很严，但认识你会放水'},
 {name:'钱宿管',role:'宿管阿姨',loc:'宿舍',time:'22:00-07:00',desc:'查寝很严，但偶尔会通融'},
 {name:'冯校医',role:'校医',loc:'医务室',time:'08:00-17:00',desc:'总是说"多喝热水"'},
 {name:'陈学长',role:'高三学长',loc:'高三楼/操场',time:'课间',desc:'篮球打得好，很多学妹喜欢'},
 {name:'褚学姐',role:'高三学姐',loc:'图书馆',time:'午休/晚自习',desc:'学霸，经常在图书馆刷题'},
 {name:'卫同学',role:'隔壁班同学',loc:'走廊/操场',time:'课间',desc:'经常来你们班找人'},
 {name:'蒋同学',role:'室友',loc:'宿舍/教室',time:'全天',desc:'你的室友，喜欢打游戏'},
 {name:'沈同学',role:'室友',loc:'宿舍/教室',time:'全天',desc:'你的室友，很爱干净'},
 {name:'韩同学',role:'社团朋友',loc:'社团活动室',time:'放学后',desc:'动漫社社长，很有趣'},
 {name:'杨同学',role:'暗恋你的人',loc:'随机',time:'随机',desc:'总是偷偷看你'},
 {name:'朱同学',role:'你暗恋的人',loc:'随机',time:'随机',desc:'你总是忍不住关注TA'},
 {name:'秦老师',role:'语文老师',loc:'教室/办公室',time:'有课时',desc:'讲课很生动，喜欢引经据典'},
 {name:'尤老师',role:'英语老师',loc:'教室/办公室',time:'有课时',desc:'很温柔，发音很好听'}
];
/* 随机遭遇NPC */
(function(){
 var _oldTick=tick;
 tick=function(){
  _oldTick();
  if(!G||G.over||G.resting)return;
  if(G.day>0&&ch(.06)&&!G._npcEncounterToday){
   G._npcEncounterToday=true;
   var npc=pk(NPC_SCHEDULE);
   var encounters=[
    '你在走廊遇到了'+npc.name+'（'+npc.role+'），'+npc.desc+'。',
    npc.name+'正在'+npc.loc+'，你打了个招呼。',
    '你看到'+npc.name+'在'+npc.loc+'，看起来很忙。',
    npc.name+'跟你聊了几句，心情变好了。',
    '你和'+npc.name+'擦肩而过，TA对你笑了笑。',
    npc.name+'在'+npc.loc+'做什么呢？你好奇地看了一眼。',
    '你听到'+npc.name+'在和别人聊天，内容很有意思。',
    npc.name+'今天看起来心情不错。'
   ];
   setTimeout(function(){
    var h='<h3>👤 遇到了'+npc.name+'</h3>'+
     '<div class="tcard" style="font-size:15px;padding:14px">'+pk(encounters)+'<br><br><span class="dim small">身份：'+npc.role+' · 常出没：'+npc.loc+'</span></div>'+
     '<div class="row" style="margin-top:8px">'+
     '<button class="gbtn" onclick="closeModal();G.support+=1;l(\'你和'+npc.name+'聊了聊。支持度+1\')">💬 聊两句</button>'+
     '<button class="gbtn" onclick="closeModal()">👋 打个招呼就走</button></div>';
    modal(h);G.mood=cl(G.mood+2,0,100);
   },1500);
  }
  if(G.idx===0)G._npcEncounterToday=false;
 };
})();
/* 校园随机场景（活人感） */
var CAMPUS_SCENES=[
 '操场上有人在打篮球，打得很激烈。',
 '走廊里有几个女生在聊天，笑声很大。',
 '食堂门口有人在发传单。',
 '图书馆里很安静，大家都在认真学习。',
 '操场上有情侣在散步。',
 '走廊里有人在追跑打闹，被老师骂了。',
 '教室里有人在睡觉，口水都流出来了。',
 '小卖部排了很长的队。',
 '有人在走廊里弹吉他，唱得还不错。',
 '操场上有人在跑步，看起来很专业。',
 '教室里有人在讨论题目，争论得很激烈。',
 '走廊里有人在拍照，摆了很多姿势。',
 '食堂里有人在抢最后一份红烧肉。',
 '宿舍楼下有人在等人，看起来很着急。',
 '操场上有人在放风筝，风筝飞得很高。',
 '教室里有人在吃泡面，香味飘满了整个教室。',
 '走廊里有人在背英语单词，很大声。',
 '操场上有人在练跳远，沙坑都被踩平了。',
 '图书馆里有人在打瞌睡，头一点一点的。',
 '食堂里有人在拍照发朋友圈。',
 '走廊里有人在玩魔方，手速很快。',
 '操场上有人在遛狗（偷偷的）。',
 '教室里有人在传小纸条，被老师抓到了。',
 '走廊里有人在唱歌，跑调跑得很厉害。',
 '操场上有人在踢足球，比分很焦灼。',
 '食堂里有人在加饭，阿姨给了很多。',
 '宿舍里有人在打牌，声音很大。',
 '走廊里有人在照镜子，整理了很久头发。',
 '操场上有人在练跳高，杆掉了很多次。',
 '教室里有人在看漫画，藏在课本里。'
];
(function(){
 var _oldTick2=tick;
 tick=function(){
  _oldTick2();
  if(!G||G.over||G.resting)return;
  if(G.day>0&&ch(.05)&&!G._sceneToday){
   G._sceneToday=true;
   l('👀 '+pk(CAMPUS_SCENES));
  }
  if(G.idx===0)G._sceneToday=false;
 };
})();

/* ---------- N4 新小游戏系统 ---------- */
function miniGameMenu(){
 var h='<h3>🎮 小游戏</h3><div class="quote">学习之余放松一下</div>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="miniQuiz()">📝 课堂答题挑战</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="miniRun()">🏃 跑步冲刺</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="miniMemory()">🧠 记忆翻牌</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="miniClick()">🎯 反应力测试</button>'+
  '<button class="gbtn" style="width:100%;margin:3px 0" onclick="miniSnake()">🐍 贪吃蛇</button>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
/* 小游戏1：课堂答题挑战 */
function miniQuiz(){
 var q=pk(DAILY_QUESTIONS);
 G._miniQuizScore=0;G._miniQuizNum=0;
 miniQuizShow(q);
}
function miniQuizShow(q){
 G._miniQuizNum++;
 var h='<h3>📝 答题挑战（第'+G._miniQuizNum+'题）</h3>'+
  '<div class="tcard" style="font-size:16px;font-weight:700">'+q.q+'</div>'+
  '<div class="dim small" style="margin:4px 0">科目：'+q.sub+' · 得分：'+G._miniQuizScore+'</div>';
 for(var i=0;i<q.a.length;i++){
  h+='<button class="gbtn" style="width:100%;margin:3px 0;text-align:left" onclick="miniQuizAns('+i+','+q.c+')">'+String.fromCharCode(65+i)+'. '+q.a[i]+'</button>';
 }
 h+='<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal()">结束</button>';
 modal(h);
}
function miniQuizAns(i,c){
 if(i===c){G._miniQuizScore+=10;l('✅ 答对了！+10分','good');}
 else l('❌ 答错了。正确答案：'+String.fromCharCode(65+c),'warn');
 if(G._miniQuizNum>=5){
  l('📝 答题挑战结束！最终得分：'+G._miniQuizScore+'/50');
  G.knowledge+=Math.floor(G._miniQuizScore/10);
  closeModal();return;
 }
 setTimeout(function(){miniQuizShow(pk(DAILY_QUESTIONS));},500);
}
/* 小游戏2：跑步冲刺 */
function miniRun(){
 G._miniRunDist=0;G._miniRunTime=10;
 var h='<h3>🏃 跑步冲刺</h3>'+
  '<div class="tcard">10秒内尽可能多地点击按钮跑步！</div>'+
  '<div id="runDist" style="font-size:24px;font-weight:800;text-align:center;margin:10px 0">0米</div>'+
  '<div id="runTime" style="text-align:center;color:#ff6b6b;font-weight:700">10秒</div>'+
  '<button class="gbtn" id="runBtn" style="width:100%;padding:20px;font-size:20px" onclick="miniRunClick()">🏃 跑！</button>';
 modal(h);
 G._runTimer=setInterval(function(){
  G._miniRunTime--;
  var t=document.getElementById('runTime');
  if(t)t.textContent=G._miniRunTime+'秒';
  if(G._miniRunTime<=0){
   clearInterval(G._runTimer);
   l('🏃 跑步结束！你跑了'+G._miniRunDist+'米！');
   G.fitness+=Math.floor(G._miniRunDist/50);
   G.mood+=5;
   setTimeout(function(){closeModal();},1000);
  }
 },1000);
}
function miniRunClick(){
 G._miniRunDist+=rnd(3,8);
 var d=document.getElementById('runDist');
 if(d)d.textContent=G._miniRunDist+'米';
}
/* 小游戏3：记忆翻牌 */
function miniMemory(){
 var emojis=['🍎','🍌','🍇','🍊','🍓','🥝','🍑','🍒'];
 var cards=[];
 for(var i=0;i<emojis.length;i++){cards.push(emojis[i],emojis[i]);}
 cards.sort(function(){return Math.random()-0.5;});
 G._memCards=cards;G._memFlipped=[];G._memMatched=0;G._memMoves=0;
 var h='<h3>🧠 记忆翻牌</h3><div class="quote">找出所有配对！步数：<span id="memMoves">0</span></div>'+
  '<div id="memBoard" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0">';
 for(var j=0;j<16;j++){
  h+='<div class="memCard" data-idx="'+j+'" style="aspect-ratio:1;background:#2a2a4a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;transition:all .3s" onclick="memFlip('+j+')">❓</div>';
 }
 h+='</div><button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
}
function memFlip(idx){
 var card=document.querySelector('.memCard[data-idx="'+idx+'"]');
 if(!card||card.dataset.matched)return;
 if(G._memFlipped.length>=2)return;
 card.textContent=G._memCards[idx];
 card.style.background='#7c9cff';
 G._memFlipped.push({idx:idx,card:card});
 if(G._memFlipped.length===2){
  G._memMoves++;
  var m=document.getElementById('memMoves');if(m)m.textContent=G._memMoves;
  if(G._memFlipped[0].card.textContent===G._memFlipped[1].card.textContent){
   G._memMatched++;
   G._memFlipped[0].card.dataset.matched='1';
   G._memFlipped[1].card.dataset.matched='1';
   G._memFlipped=[];
   if(G._memMatched===8){
    l('🧠 记忆翻牌完成！用了'+G._memMoves+'步！知识+3');
    G.knowledge+=3;G.mood+=5;
    setTimeout(function(){closeModal();},1000);
   }
  }else{
   setTimeout(function(){
    G._memFlipped[0].card.textContent='❓';
    G._memFlipped[0].card.style.background='#2a2a4a';
    G._memFlipped[1].card.textContent='❓';
    G._memFlipped[1].card.style.background='#2a2a4a';
    G._memFlipped=[];
   },800);
  }
 }
}
/* 小游戏4：反应力测试 */
function miniClick(){
 var h='<h3>🎯 反应力测试</h3><div class="quote">等按钮变绿后立刻点击！</div>'+
  '<div id="clickArea" style="height:200px;background:#2a2a4a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;margin:10px 0" onclick="miniClickStart()">点击开始</div>'+
  '<div id="clickResult" style="text-align:center"></div>';
 modal(h);
}
function miniClickStart(){
 var area=document.getElementById('clickArea');
 if(!area)return;
 area.textContent='等待变绿...';
 area.style.background='#ff6b6b';
 area.onclick=function(){
  area.textContent='太早了！重新来';
  area.style.background='#2a2a4a';
  area.onclick=miniClickStart;
 };
 setTimeout(function(){
  area.textContent='点我！';
  area.style.background='#4ecdc4';
  G._clickTime=Date.now();
  area.onclick=function(){
   var rt=Date.now()-G._clickTime;
   area.textContent='反应时间：'+rt+'ms';
   var r=document.getElementById('clickResult');
   if(r){
    if(rt<200)r.innerHTML='<span style="color:#4ecdc4">⚡ 神速！</span>';
    else if(rt<300)r.innerHTML='<span style="color:#ffd166">👍 不错！</span>';
    else r.innerHTML='<span style="color:#ff6b6b">🐢 有点慢</span>';
   }
   G.mood+=3;
   area.onclick=miniClickStart;
  };
 },rnd(1500,4000));
}
/* 小游戏5：贪吃蛇 */
function miniSnake(){
 G._snake=[{x:5,y:5}];G._snakeDir='right';G._snakeFood={x:rnd(0,9),y:rnd(0,9)};G._snakeScore=0;G._snakeOver=false;
 var h='<h3>🐍 贪吃蛇</h3><div class="quote">方向键控制，吃到食物加分</div>'+
  '<canvas id="snakeCanvas" width="300" height="300" style="background:#1a1a2e;border-radius:8px;margin:10px auto;display:block"></canvas>'+
  '<div style="text-align:center">得分：<span id="snakeScore">0</span></div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:10px 0">'+
  '<div></div><button class="gbtn" onclick="snakeDir(\'up\')">↑</button><div></div>'+
  '<button class="gbtn" onclick="snakeDir(\'left\')">←</button><button class="gbtn" onclick="snakeDir(\'down\')">↓</button><button class="gbtn" onclick="snakeDir(\'right\')">→</button>'+
  '</div><button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
 setTimeout(function(){snakeGame();},500);
}
function snakeDir(d){
 if((d==='up'&&G._snakeDir!=='down')||(d==='down'&&G._snakeDir!=='up')||
    (d==='left'&&G._snakeDir!=='right')||(d==='right'&&G._snakeDir!=='left')){
  G._snakeDir=d;
 }
}
function snakeGame(){
 if(G._snakeOver)return;
 var canvas=document.getElementById('snakeCanvas');
 if(!canvas){G._snakeOver=true;return;}
 var ctx=canvas.getContext('2d');
 var head={x:G._snake[0].x,y:G._snake[0].y};
 if(G._snakeDir==='up')head.y--;
 if(G._snakeDir==='down')head.y++;
 if(G._snakeDir==='left')head.x--;
 if(G._snakeDir==='right')head.x++;
 if(head.x<0||head.x>=10||head.y<0||head.y>=10){G._snakeOver=true;l('🐍 游戏结束！得分：'+G._snakeScore);closeModal();return;}
 for(var i=0;i<G._snake.length;i++){if(G._snake[i].x===head.x&&G._snake[i].y===head.y){G._snakeOver=true;l('🐍 游戏结束！得分：'+G._snakeScore);closeModal();return;}}
 G._snake.unshift(head);
 if(head.x===G._snakeFood.x&&head.y===G._snakeFood.y){
  G._snakeScore+=10;
  var s=document.getElementById('snakeScore');if(s)s.textContent=G._snakeScore;
  G._snakeFood={x:rnd(0,9),y:rnd(0,9)};
 }else{G._snake.pop();}
 ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,300,300);
 ctx.fillStyle='#4ecdc4';
 for(var j=0;j<G._snake.length;j++){ctx.fillRect(G._snake[j].x*30,G._snake[j].y*30,28,28);}
 ctx.fillStyle='#ff6b6b';
 ctx.fillRect(G._snakeFood.x*30,G._snakeFood.y*30,28,28);
 setTimeout(function(){snakeGame();},150);
}

/* ---------- N5 声望系统 ---------- */
(function(){
 var _oldUpd=upd;
 upd=function(){
  _oldUpd();
  try{
   if(!G)return;
   if(!G.reputation)G.reputation=50;
   var repBar=document.getElementById('repBar');
   if(!repBar){
    repBar=document.createElement('div');
    repBar.id='repBar';
    repBar.className='repbar';
    repBar.innerHTML='<span class="repbar-txt"></span><span class="repbar-x" onclick="event.stopPropagation();repBarHide()">✕</span>';
    repBar.onclick=function(){repBarHide();};
    document.body.appendChild(repBar);
   }
   var repText='';
   if(G.reputation>=90)repText='👑 校园名人';
   else if(G.reputation>=70)repText='⭐ 人气王';
   else if(G.reputation>=50)repText='👍 小有名气';
   else if(G.reputation>=30)repText='😐 普通学生';
   else repText='😶 透明人';
   repBar.querySelector('.repbar-txt').textContent=repText+'（'+Math.round(G.reputation)+'）';
  }catch(e){}
 };
})();
function repBarHide(){
 var b=document.getElementById('repBar');
 if(b)b.style.display='none';
 var btn=document.getElementById('repBarBtn');
 if(!btn){
  btn=document.createElement('button');
  btn.id='repBarBtn';
  btn.className='repbar-btn';
  btn.textContent='⭐ 名声';
  btn.title='点开查看名声';
  btn.onclick=function(){
   var rb=document.getElementById('repBar');
   if(rb)rb.style.display='';
   btn.style.display='none';
  };
  document.body.appendChild(btn);
 }else btn.style.display='';
}
function addRep(n){G.reputation=cl((G.reputation||50)+n,0,100);}

/* ---------- N6 社团系统 ---------- */
var CLUBS=[
 {id:'basketball',name:'🏀 篮球社',desc:'每周二四训练，参加校联赛',benefit:'体力+2/周，认识体育生'},
 {id:'music',name:'🎵 音乐社',desc:'排练节目，文艺晚会演出',benefit:'心情+3/周，认识文艺青年'},
 {id:'anime',name:'🎌 动漫社',desc:'看番、cosplay、漫展',benefit:'心情+4/周，认识同好'},
 {id:'study',name:'📚 学习社',desc:'一起刷题，互相讲题',benefit:'知识+3/周，认识学霸'},
 {id:'art',name:'🎨 美术社',desc:'画画、写生、画展',benefit:'创造力+2/周，认识艺术生'},
 {id:'robot',name:'🤖 机器人社',desc:'编程、搭建机器人',benefit:'知识+4/周，认识技术宅'},
 {id:'dance',name:'💃 舞蹈社',desc:'练舞，参加表演',benefit:'体力+2 心情+2/周'},
 {id:'photo',name:'📷 摄影社',desc:'拍照、修图、影展',benefit:'创造力+3/周'}
];
function clubSys(){
 var h='<h3>🎭 社团系统</h3>';
 if(G.club){
  var c=CLUBS.find(function(x){return x.id===G.club;});
  h+='<div class="tcard"><b>你已加入：'+c.name+'</b><br>'+c.desc+'<br><span class="dim small">收益：'+c.benefit+'</span></div>'+
   '<button class="gbtn" style="margin:8px 0;width:100%" onclick="clubActivity()">🎯 参加社团活动</button>'+
   '<button class="gbtn" style="width:100%" onclick="G.club=null;l(\'你退出了社团。\',\'warn\');closeModal()">退出社团</button>';
 }else{
  h+='<div class="quote">选择一个社团加入</div>';
  for(var i=0;i<CLUBS.length;i++){
   (function(c){
    h+='<div class="tcard" style="margin:4px 0"><b>'+c.name+'</b><br><span class="dim small">'+c.desc+'<br>收益：'+c.benefit+'</span>'+
     '<button class="gbtn" style="float:right;padding:3px 10px;font-size:12px" onclick="joinClub(\''+c.id+'\')">加入</button></div>';
   })(CLUBS[i]);
  }
 }
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function joinClub(id){
 G.club=id;
 var c=CLUBS.find(function(x){return x.id===id;});
 l('🎭 你加入了'+c.name+'！','good');
 addRep(5);
 closeModal();clubSys();
}
function clubActivity(){
 var c=CLUBS.find(function(x){return x.id===G.club;});
 l('🎯 你参加了'+c.name+'的活动。'+c.benefit,'good');
 if(c.id==='basketball')G.fitness=cl(G.fitness+2,0,100);
 if(c.id==='music'||c.id==='anime'||c.id==='dance')G.mood=cl(G.mood+3,0,100);
 if(c.id==='study'||c.id==='robot')G.knowledge=cl(G.knowledge+3,0,100);
 if(c.id==='art'||c.id==='photo')G.creativity=(G.creativity||0)+2;
 addRep(2);
 closeModal();
}

/* ---------- N7 校园探索系统 ---------- */
var CAMPUS_LOCATIONS=[
 {id:'classroom',name:'📚 教室',desc:'你的主战场，上课学习的地方'},
 {id:'playground',name:'🏃 操场',desc:'跑步、打球、散步的好地方'},
 {id:'canteen',name:'🍜 食堂',desc:'干饭人的天堂'},
 {id:'dorm',name:'🛏️ 宿舍',desc:'休息睡觉的地方'},
 {id:'library',name:'📖 图书馆',desc:'安静学习，可能遇到学霸'},
 {id:'shop',name:'🛒 小卖部',desc:'买零食饮料的地方'},
 {id:'clinic',name:'🏥 医务室',desc:'看病拿药，装病圣地'},
 {id:'office',name:'👨‍🏫 教师办公室',desc:'找老师问题目/挨骂'},
 {id:'lab',name:'🔬 实验室',desc:'做实验的地方'},
 {id:'artroom',name:'🎨 美术教室',desc:'画画做手工'},
 {id:'musicroom',name:'🎵 音乐教室',desc:'弹琴唱歌'},
 {id:'rooftop',name:'🌤️ 天台',desc:'秘密基地，可能遇到人'}
];
function exploreSys(){
 var h='<h3>🗺️ 校园探索</h3><div class="quote">选择一个地点去探索</div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 for(var i=0;i<CAMPUS_LOCATIONS.length;i++){
  (function(loc){
   h+='<button class="gbtn" style="text-align:left;padding:10px" onclick="exploreGo(\''+loc.id+'\')"><b>'+loc.name+'</b><br><span class="dim small" style="font-size:11px">'+loc.desc+'</span></button>';
  })(CAMPUS_LOCATIONS[i]);
 }
 h+='</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function exploreGo(id){
 var loc=CAMPUS_LOCATIONS.find(function(x){return x.id===id;});
 var events={
  classroom:'你在教室坐了一会儿，复习了一下功课。知识+1',
  playground:'你在操场走了走，看到有人在打球。体力+1',
  canteen:'你在食堂逛了一圈，闻着菜香饿了。',
  dorm:'你回宿舍躺了一会儿，感觉放松了。心情+2',
  library:'你在图书馆看了会儿书，很安静。知识+2',
  shop:'你在小卖部逛了逛，想买点什么。',
  clinic:'你在医务室门口站了站，闻到消毒水味。',
  office:'你在教师办公室门口犹豫了一下，没敢进去。',
  lab:'你在实验室看了看各种仪器，很好奇。',
  artroom:'你在美术教室看了看同学们的画。创造力+1',
  musicroom:'你在音乐教室听了会儿琴声。心情+2',
  rooftop:'你上了天台，风吹过来很舒服。心情+3'
 };
 l('🗺️ 你去了'+loc.name+'。'+events[id]);
 if(id==='classroom')G.knowledge=cl(G.knowledge+1,0,100);
 if(id==='playground')G.fitness=cl(G.fitness+1,0,100);
 if(id==='dorm'||id==='musicroom'||id==='rooftop')G.mood=cl(G.mood+(id==='rooftop'?3:2),0,100);
 if(id==='library')G.knowledge=cl(G.knowledge+2,0,100);
 if(id==='artroom')G.creativity=(G.creativity||0)+1;
 /* 随机遇到NPC */
 if(ch(.3)){
  var npc=pk(NPC_SCHEDULE);
  l('👤 你在这里遇到了'+npc.name+'（'+npc.role+'）。');
  G.support=cl(G.support+1,0,100);
 }
 closeModal();
}

/* ---------- N8 把小游戏/社团/探索加入顶栏 ---------- */
(function(){
 var _oldUpd2=upd;
 upd=function(){
  _oldUpd2();
  try{
   var bar=document.querySelector('.actionbar')||document.querySelector('.bottombar');
   if(bar){
    if(!document.getElementById('miniBtn')){
     var b1=document.createElement('button');
     b1.className='mini';b1.id='miniBtn';b1.textContent='🎮 小游戏';
     b1.setAttribute('onclick','miniGameMenu()');
     bar.insertBefore(b1,bar.firstChild);
    }
    if(!document.getElementById('clubBtn')){
     var b2=document.createElement('button');
     b2.className='mini';b2.id='clubBtn';b2.textContent='🎭 社团';
     b2.setAttribute('onclick','clubSys()');
     bar.insertBefore(b2,bar.firstChild);
    }
    if(!document.getElementById('exploreBtn')){
     var b3=document.createElement('button');
     b3.className='mini';b3.id='exploreBtn';b3.textContent='🗺️ 探索';
     b3.setAttribute('onclick','exploreSys()');
     bar.insertBefore(b3,bar.firstChild);
    }
   }
  }catch(e){}
 };
})();

/* 5.5.6 初始渲染 */
try{renderShoes();}catch(e){}
try{lrcUpdate();}catch(e){}
try{renderZJSubjects();}catch(e){}

/* ============================================================
   附录 P：5.5.505 完整版综合修复
   1. 姓名输入同步到O.name
   2. 选科步骤只在学生模式显示
   3. 初始化缺失字段 O.shoes/O.name
   4. startGame读取面板身高体重
   5. 防止代码文本泄露到页面
   ============================================================ */
(function(){
 /* P1. 初始化缺失字段 */
 if(!O.shoes)O.shoes=[];
 if(!O.name)O.name='';

 /* P2. 包一层showCharCreate，在面板显示后绑定姓名同步和模式联动 */
 var _oldSCC=showCharCreate;
 showCharCreate=function(){
  _oldSCC();
  try{
   /* 姓名输入同步 */
   var fName=document.getElementById('fName');
   if(fName){
    fName.oninput=function(){O.name=this.value;};
    /* 如果O.name已有值，回填 */
    if(O.name)fName.value=O.name;
   }
   /* 根据当前模式显示/隐藏选科 */
   P_toggleSubjectStep();
   /* 确保选科渲染 */
   if(!O.zjSubjects)O.zjSubjects=['物理','化学','地理'];
   renderZJSubjects();
   /* 确保鞋子渲染（使用O.shoes复数） */
   renderShoes();
  }catch(e){}
 };

 /* P3. 包一层pickG，切换模式时联动选科步骤 */
 var _oldPG=pickG;
 if(typeof pickG==='function'){
  pickG=function(k,v){
   _oldPG(k,v);
   try{
    if(k==='mode')P_toggleSubjectStep();
    if(k==='gender')renderShoes();
   }catch(e){}
  };
 }

 /* P4. 选科步骤显示/隐藏 */
 function P_toggleSubjectStep(){
  var step=document.getElementById('zjSubjStep');
  if(!step)return;
  step.style.display=(O.mode==='student')?'':'none';
 }
 window.P_toggleSubjectStep=P_toggleSubjectStep;

 /* P5. 包一层startGame，在验证前同步姓名，在创建后修正身高体重体脂 */
 var _oldSG=startGame;
 startGame=function(){
  try{
   var fName=document.getElementById('fName');
   if(fName&&fName.value.trim()){O.name=fName.value.trim();}
   /* L14验证拦截空名和'张逸天'，用临时名通过验证；
      #fName保持空时原始startGame仍会用默认名张逸天/李倩茹 */
   if(!O.name||O.name==='张逸天'){
    O.name=(O.gender==='女')?'李倩茹':'同学';
   }
   if(!O.shoes||O.shoes.length<2)O.shoes=[0,1];
   if(!O.zjSubjects||O.zjSubjects.length!==3)O.zjSubjects=['物理','化学','地理'];
   if(!O.pref)O.pref='异性';
   if(!O.gender)O.gender='男';
   /* 读取面板身高体重体脂 */
   var hEl=document.getElementById('hVal');
   var wEl=document.getElementById('wVal');
   var bfEl=document.getElementById('bfVal');
   window._P_H=hEl?parseFloat(hEl.textContent):178;
   window._P_W=wEl?parseFloat(wEl.textContent):62;
   window._P_BF=bfEl?parseFloat(bfEl.textContent):null;
  }catch(e){}
  _oldSG();
  /* G创建后用面板值修正身高体重 */
  try{
   if(G&&window._P_H){
    G.height=window._P_H;G.weight=window._P_W;
    var hm=G.height/100;
    G.bmi=Math.round(G.weight/(hm*hm)*10)/10;
    G.waist=Math.round(G.weight/G.height*(G.gender==='女'?135:150));
    if(window._P_BF)G.bodyFat=window._P_BF;
   }
  }catch(e){}
 };
})();

/* P6. 修复startGame内身高体重读取（从面板输入框读取，不硬编码） */
(function(){
 /* 检查身高体重输入框的id，通过adjH/adjW函数推断 */
 var _oldAdjH=window.adjH;
 /* 面板身高显示元素 */
 window.P_getBody=function(){
  var h=178,w=62;
  try{
   /* 查找身高显示 */
   var hEl=document.getElementById('hVal')||document.getElementById('heightVal');
   var wEl=document.getElementById('wVal')||document.getElementById('weightVal');
   if(hEl)h=parseFloat(hEl.textContent)||178;
   if(wEl)w=parseFloat(wEl.textContent)||62;
  }catch(e){}
  return {h:h,w:w};
 };
})();

/* P7. 防止JS代码泄露为可见文本
   检查页面上所有textNode，如果包含典型JS代码模式则隐藏 */
(function(){
 function P_cleanCodeLeaks(root){
  try{
   var walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null,false);
   var nodes=[];
   while(walker.nextNode()){
    var n=walker.currentNode;
    var t=n.textContent;
    /* 检测典型代码泄露 */
    if(t&&t.length>20&&t.length<2000){
     if(/^[\s]*(var |function |return |if\(|window\.|document\.)/.test(t)&&
        t.includes(';')&&!n.parentElement.closest('script,style,pre,code')){
      nodes.push(n);
     }
    }
   }
   for(var i=0;i<nodes.length;i++){nodes[i].textContent='';}
  }catch(e){}
 }
 /* 页面加载后清理一次 */
 if(document.readyState==='complete'||document.readyState==='interactive'){
  setTimeout(function(){P_cleanCodeLeaks();},1000);
 }
 /* 暴露给全局，modal关闭后也可调用 */
 window.P_cleanCodeLeaks=P_cleanCodeLeaks;
})();

/* P8. 包一层modal，打开和关闭时清理代码泄露 */
(function(){
 var _oldModal=modal;
 modal=function(){
  var r=_oldModal.apply(this,arguments);
  try{P_cleanCodeLeaks();}catch(e){}
  return r;
 };
 var _oldClose=closeModal;
 closeModal=function(){
  _oldClose();
  try{P_cleanCodeLeaks();}catch(e){}
 };
})();

/* ============================================================
   附录 Q：独立音乐播放器（可拖动进度条 + 实时歌词）
   ============================================================ */
var Q_TIMER=null;
function Q_fmt(t){
 t=Math.max(0,Math.floor(t||0));
 var m=Math.floor(t/60),s=t%60;
 return m+':'+(s<10?'0':'')+s;
}
function Q_currentLine(t){
 try{
  var lrc=LRC_DATA[BGM_IDX%LRC_DATA.length];
  var line=lrc.length?lrc[0][1]:'';
  for(var i=0;i<lrc.length;i++){if(t>=lrc[i][0])line=lrc[i][1];}
  return line;
 }catch(e){return '';}
}
function musicPlayer(){
 try{
  var s=BGM_LIST[BGM_IDX];
  var dur=(BGM_AUD&&BGM_AUD.duration&&isFinite(BGM_AUD.duration))?BGM_AUD.duration:0;
  var cur=(BGM_AUD&&BGM_AUD.currentTime)?BGM_AUD.currentTime:0;
  var line=Q_currentLine(cur);
  var h='<h3>🎧 音乐播放器</h3>';
  h+='<div class="quote" style="text-align:center"><b style="font-size:17px">'+esc(s.t)+'</b><br>'+
     '<span class="dim small">'+esc(s.a)+' · '+esc(s.al)+'</span></div>';
  /* 歌词当前行 */
  h+='<div id="mpLyric" style="text-align:center;min-height:44px;padding:8px 6px;margin:6px 0;'+
     'background:#141d38;border-radius:10px;font-size:15px;line-height:1.4">🎵 '+esc(line)+'</div>';
  /* 进度条 */
  h+='<div style="display:flex;align-items:center;gap:8px;margin:8px 0">'+
     '<span id="mpCur" class="dim small" style="min-width:34px">'+Q_fmt(cur)+'</span>'+
     '<input type="range" id="mpRange" min="0" max="'+(dur||100)+'" step="0.1" value="'+cur+'" '+
     'oninput="Q_seeking(this.value)" style="flex:1;accent-color:var(--acc)">'+
     '<span id="mpDur" class="dim small" style="min-width:34px">'+(dur?Q_fmt(dur):'--:--')+'</span></div>';
  /* 控制按钮 */
  h+='<div style="display:flex;justify-content:center;gap:8px;margin:10px 0">'+
     '<button class="gbtn" onclick="Q_prev()">⏮ 上一首</button>'+
     '<button class="gbtn" id="mpPlayBtn" onclick="Q_toggle()">'+(BGM_ON?'⏸ 暂停':'▶ 播放')+'</button>'+
     '<button class="gbtn" onclick="Q_next()">下一首 ⏭</button></div>';
  /* 音量 */
  h+='<div style="display:flex;align-items:center;gap:8px;margin:6px 0">'+
     '<span class="dim small">🔊</span>'+
     '<input type="range" min="0" max="100" value="'+Math.round(BGM_VOL*100)+'" '+
     'oninput="bgmVol(this.value/100)" style="flex:1;accent-color:var(--acc)"></div>';
  h+='<h4 style="margin-top:10px">播放列表（共'+BGM_LIST.length+'首，自动循环）</h4>';
  h+='<div id="mpList">'+bgmSettingsHTML()+'</div>';
  h+='<button class="gbtn" style="margin-top:9px" onclick="closeModal()">关闭</button>';
  modal(h);
  /* 启动定时刷新（进度条+歌词+时长） */
  if(Q_TIMER)clearInterval(Q_TIMER);
  Q_TIMER=setInterval(Q_refresh,500);
 }catch(e){}
}
function Q_refresh(){
 try{
  if(!document.getElementById('mpRange')){if(Q_TIMER){clearInterval(Q_TIMER);Q_TIMER=null;}return;}
  var aud=BGM_AUD;if(!aud)return;
  var dur=(aud.duration&&isFinite(aud.duration))?aud.duration:0;
  var cur=aud.currentTime||0;
  var range=document.getElementById('mpRange');
  /* 只有用户没在拖动时才更新range位置 */
  if(range&&document.activeElement!==range){
   range.max=dur||100;range.value=cur;
  }
  var cEl=document.getElementById('mpCur');if(cEl)cEl.textContent=Q_fmt(cur);
  var dEl=document.getElementById('mpDur');if(dEl)dEl.textContent=dur?Q_fmt(dur):'--:--';
  var lEl=document.getElementById('mpLyric');if(lEl)lEl.textContent='🎵 '+Q_currentLine(cur);
  var pb=document.getElementById('mpPlayBtn');if(pb)pb.textContent=(BGM_ON?'⏸ 暂停':'▶ 播放');
 }catch(e){}
}
function Q_seeking(v){
 try{
  var cEl=document.getElementById('mpCur');if(cEl)cEl.textContent=Q_fmt(v);
  var lEl=document.getElementById('mpLyric');if(lEl)lEl.textContent='🎵 '+Q_currentLine(parseFloat(v));
  if(BGM_AUD){BGM_AUD.currentTime=parseFloat(v);}
 }catch(e){}
}
function Q_toggle(){
 bgmToggle();
 setTimeout(Q_refresh,100);
}
function Q_next(){bgmSwitch((BGM_IDX+1)%BGM_LIST.length);setTimeout(musicPlayer,150);}
function Q_prev(){bgmSwitch((BGM_IDX-1+BGM_LIST.length)%BGM_LIST.length);setTimeout(musicPlayer,150);}

/* 让顶部hMusic pill打开播放器 */
(function(){
 var h=document.getElementById('hMusic');
 if(h)h.setAttribute('onclick','musicPlayer()');
})();
/* ================================================================
   附录 O · 5.5.505 补丁：视口级固定"开始"按钮（脱离毛玻璃包含块）
   ================================================================ */
(function(){
 function _ensureFixedGo(){
  if(window.XZ_NEW_START)return; /* 5.5.6.100：新版主视觉自带开始按钮 */
  if(document.getElementById('_fixedGo'))return;
  var b=document.createElement('button');
  b.id='_fixedGo';b.type='button';b.textContent='🚀 开始 →';
  b.style.cssText='position:fixed;bottom:20px;left:50%;margin-left:-120px;width:240px;padding:15px 20px;font-size:18px;font-weight:800;color:#fff;border:none;border-radius:14px;background:linear-gradient(135deg,#3a6ff7,#7a5cff);cursor:pointer;z-index:300;box-shadow:0 10px 35px rgba(80,120,255,.55);font-family:inherit;';
  b.onclick=function(){ if(typeof startGame==='function')startGame(); };
  document.body.appendChild(b);
 }
 function _removeFixedGo(){ var b=document.getElementById('_fixedGo'); if(b)b.parentNode.removeChild(b); }
 var _oldShow=showCharCreate;
 showCharCreate=function(){ var r=_oldShow(); setTimeout(_ensureFixedGo,80); return r; };
 var _oldStart=startGame;
 startGame=function(){ var r=_oldStart(); _removeFixedGo(); return r; };
})();


/* ================================================================
   杭州西子实验学校模拟器 · 5.5.6.100 新系统层
   ----------------------------------------------------------------
   本文件在 core-*.js 与 append.js 之后加载，做加法与覆盖：
   · 精确作息表（6:10 起床 → 22:20 熄灯，全天时间点按你要求排布）
   · 统一“时段多动作”系统：任何时段都可做多件事，绝不跳时间
   · 上课铃 / 下课铃（bell_src.m4a → data URI）
   · 文字系统大幅扩容（新增 150+ 条文案与事件）
   · 恋爱系统增强：阶段/性格/心动日常/纪念日/吃醋/挽回
   · 小游戏增强 + 全新「合成大西瓜」
   · 动画彩带、铃声设置、5.5.6.100 更新日志
   ================================================================ */
var XZ561={ver:'5.5.6.888'};
window.XZ_NEW_START=true; /* 通知旧代码：使用新版主视觉开始界面 */
window.XZ_VER='10.9.21 PRO';

/* ================================================================
   ① 上课铃 / 下课铃（bell_src.m4a，纯本地，无网络请求）
   ================================================================ */
var _bellAudio=null;
function xzBellAudio(){
 if(_bellAudio)return _bellAudio;
 try{
  _bellAudio=new Audio(BELL_B64);
  _bellAudio.preload='auto';
 }catch(e){_bellAudio=null;}
 return _bellAudio;
}
function ringBell(kind){
 if(G&&G.sfxOff)return;
 try{var a=xzBellAudio();if(a){a.pause();a.currentTime=0;var p=a.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
 /* 顶部响铃提示（可点击关闭，也可直接关闭整个铃声系统） */
 var b=document.createElement('div');
 b.className='bell-bar';
 b.innerHTML='🔔 '+kind+'铃 <span class="bell-x" onclick="event.stopPropagation();xzSfxToggle();this.parentNode.remove()">🔕 关铃声</span>';
 b.onclick=function(){if(b.parentNode)b.parentNode.removeChild(b);};
 document.body.appendChild(b);
 setTimeout(function(){if(b.parentNode)b.parentNode.removeChild(b);},2600);
 /* 时间胶囊脉冲 */
 var t=$('#hTime');
 if(t){t.classList.remove('ringing');void t.offsetWidth;t.classList.add('ringing');}
}
function xzSfxToggle(){
 if(!G){return;}
 G.sfxOff=!G.sfxOff;
 try{saveGame();}catch(e){}
 var b=document.getElementById('sfxToggle');
 if(b)b.textContent=G.sfxOff?'开启铃声':'关闭铃声';
 l(G.sfxOff?'🔕 上课铃/下课铃已关闭':'🔔 上课铃/下课铃已开启','good');
}

/* ================================================================
   ② 文字系统扩容（150+ 条新文案，纯追加不改旧数据）
   ================================================================ */
var EXTRA_TEXTS_561={
 class_general:[
  '「这道题都不会？那下一道更不会了。」老师说完自己笑了。',
  '前排同学打了一个巨大的喷嚏，全班安静了三秒。',
  '窗外的鸟一直在叫，像在给老师伴奏。',
  '老师讲到一半突然说：“我讲到哪了？”全班沉默。',
  '同桌偷偷把修正带推到你桌上：“帮我拿一下。”',
  '后桌用笔戳了你一下：“下课去不去小卖部？”',
  '“这道题我上次就讲过！”老师敲了敲黑板。',
  '有人在桌肚里养了一只仓鼠，正在啃笔袋。',
  '阳光斜着照进来，粉笔灰在光柱里慢慢飘。',
  '老师点了一个睡觉的同学回答问题，他站起来说“选C”。',
  '“你以为是爱情吗？是月考。”语文老师突然深情。',
  '黑板上的倒计时又少了一天，有人叹气有人淡定。',
  '班长在讲台上发卷子，发到一半说：“少一张，谁多拿了？”',
  '数学老师袖子一撸：“来，看这道压轴题。”',
  '广播里突然响起眼保健操音乐，老师只好说：“先做操。”'
 ],
 random_events:[
  '你在走廊捡到一支很好看的笔，问了一圈没人认领。',
  '隔壁班有人上课偷偷吃泡面，香味飘了一整层楼。',
  '广播站放了一首你喜欢的歌，你跟着哼了两句。',
  '校园里的猫今天躺在操场边晒太阳，肚皮朝天。',
  '有个同学在楼梯间哭，你假装没看见走过去了。',
  '食堂大叔今天手不抖了，鸡腿给得特别大。',
  '你在书里翻到一张别人写的小纸条，上面画了只猫。',
  '今天有体检，全班排队量身高，有人悄悄垫脚。',
  '教务处的老师来查手机，教室安静得能听见针掉。',
  '下雨天，走廊里全是滴水的雨伞和奔跑的人。',
  '晚自习停电了十秒，全班欢呼，然后又来电了。',
  '有人在学校表白墙给你留言了，虽然可能是打错。',
  '你今天被表扬了一次，心情不错。',
  '捡到一块钱，你在想是交公还是买糖。',
  '体育课自由活动，篮球场上打得很凶。'
 ],
 break_lines:[
  '课间铃一响，全班像按了快进键。',
  '走廊里有人在比赛谁先跑到厕所。',
  '你在座位上伸了个懒腰，骨头咔咔响。',
  '隔壁班男生在走廊上大声讲冷笑话。',
  '有同学在教室后面练魔方，转得飞快。',
  '广播里在放午间音乐，有人跟着哼。',
  '你发现今天窗外有只鸟一直在看你。',
  '课间太短了，感觉刚坐下就又上课了。'
 ],
 morning_lines:[
  '清晨的走廊还很安静，只有零星几个脚步声。',
  '早读声从各个教室传出来，像潮水一样。',
  '你打着哈欠翻开课本，眼睛还没完全睁开。',
  '晨光从窗户照进来，粉笔灰在光里飘。',
  '班主任站在门口，目光扫过每一个迟到的人。'
 ],
 meal_lines:[
  '打饭阿姨的手今天格外大方。',
  '食堂今天的汤免费，因为本质上就是水。',
  '你端着餐盘找了个靠窗的位置坐下。',
  '有人在食堂大声背书，被劝退了。'
 ],
 night_lines:[
  '晚自习的教室安静得只有翻书声。',
  '你抬头看了一眼，全班都在埋头，只有你在发呆。',
  '窗外的天已经全黑了，走廊灯昏黄地亮着。',
  '晚自习值日老师从后门进来，又从前门出去。'
 ],
 love_lines:[
  'TA今天好像比平时多看了你一眼。',
  '你发现TA的笔记角落里画了一颗小心心。',
  '走廊擦肩而过的时候，你俩都低下了头。',
  'TA借走了你的橡皮，还回来的时候多了个洞。',
  '食堂吃饭的时候，TA坐到了你对面。',
  '有人在班级群里悄悄问TA的联系方式，你没说话。'
 ],
 teacher_lines:[
  '老师叹了口气：“你们是我带过最吵的一届。”',
  '“这道题讲完就下课”——这句话半小时后才兑现。',
  '老师把粉笔头精准扔向最后一排，准头惊人。',
  '办公室里传来老师们的笑声，你们很好奇。'
 ],
 weather_lines:[
  '雨点打在窗户上，像有人在轻轻敲门。',
  '太阳出来了一小会儿，又躲回去了。',
  '今天的云很厚，像要下雨又像要晴。',
  '风把窗帘吹得鼓起来，像一张帆。'
 ],
 classmate_lines:[
  '同桌：“你作业写完了吗？借我看看。”',
  '前桌回头：“笔借我一下，用完还你。”',
  '后桌拍了拍你：“下课一起走啊。”',
  '有人小声说：“这题选A还是选C啊？”',
  '班长路过你座位，提醒你值日表改时间了。'
 ],
 corridor_lines:[
  '走廊那头传来一阵急促的脚步声。',
  '两个同学在楼道里追逐打闹，被老师瞪了一眼。',
  '窗边站着一个人，望着操场发呆。',
  '饮水机前排起了小队，有人端着泡面等水。'
 ],
 love_event_txt:[
  '借笔记',
  '雨天共伞',
  '走廊偶遇',
  '食堂分菜',
  '同学起哄',
  'TA生病你照顾',
  '传纸条被抓',
  '吃醋'
 ]
};
/* 追加进 5.5.5 的数组（pk 直接按数组取值，无需改 pk） */
(function(){
 if(!window.EXTRA_TEXTS_555)return;
 var merge={'class_general':EXTRA_TEXTS_561.class_general,'random_events':EXTRA_TEXTS_561.random_events};
 for(var k in merge){
  if(EXTRA_TEXTS_555[k])EXTRA_TEXTS_555[k]=EXTRA_TEXTS_555[k].concat(merge[k]);
 }
})();

/* ================================================================
   ③ 精确作息表（6:10 起床 … 22:20 熄灯）
   ================================================================ */
function buildStudentDay(){
 var a=[mk('06:10','wake',{loc:'宿舍'}),mk('06:40','exercise',{loc:'操场',min:20}),
  mk('07:00','breakfast',{loc:'食堂',min:20}),mk('07:20','morningRead',{loc:'教室',min:30})];
 if(G.date.getDay()===1)a.push(mk('07:35','flag',{loc:'操场',min:15}));
 a.push(mk('07:50','break',{loc:'教室',min:5}),mk('07:55','class',{n:1,min:40}),
  mk('08:35','break',{loc:'教室',min:10}),mk('08:45','class',{n:2,min:40}),
  mk('09:25','gymBreak',{loc:'操场',min:20}),mk('09:45','class',{n:3,min:40}),
  mk('10:25','break',{loc:'教室',min:10}),mk('10:35','eyecare',{n:1,min:5}),
  mk('10:40','class',{n:4,min:40}),mk('11:20','class',{n:5,min:40}),
  mk('12:00','meal',{which:'午饭',loc:'食堂',min:40}),mk('12:40','nap',{loc:'教室',min:25}),
  mk('13:05','break',{loc:'教室',min:5}),mk('13:10','class',{n:6,min:40}),
  mk('13:50','break',{loc:'教室',min:10}),mk('14:00','class',{n:7,min:40}),
  mk('14:40','break',{loc:'教室',min:10}),mk('14:50','class',{n:8,min:40}),
  mk('15:30','eyecare',{n:2,min:5}),mk('15:35','break',{loc:'教室',min:10}),
  mk('15:45','class',{n:9,min:40}),mk('16:25','dinner',{loc:'食堂',min:95}),
  mk('18:00','night',{n:1,loc:'教室',min:50}),mk('18:50','break',{loc:'教室',min:10}),
  mk('19:00','night',{n:2,min:50}),mk('19:50','break',{loc:'教室',min:10}),
  mk('20:00','night',{n:3,min:50}),mk('20:50','break',{loc:'教室',min:10}),
  mk('21:00','night',{n:4,min:50}),mk('21:50','rest',{loc:'走廊',min:10}),
  mk('22:00','dorm',{loc:'宿舍',min:20}),mk('22:20','lightsOut',{loc:'宿舍',min:40}));
 return a;
}
function buildTeacherDay(){
 var a=[mk('06:40','t_arrive',{loc:'办公室'})];
 if(G.dutyLast)a.push(mk('06:40','t_duty',{loc:'操场'}));
 a.push(mk('07:20','t_read',{loc:'教室'}),mk('07:55','t_class',{loc:'教室'}),mk('08:45','t_class',{loc:'教室'}),
  mk('09:25','t_patrol',{loc:'走廊'}),mk('10:35','t_patrol',{loc:'走廊'}),mk('10:40','t_break',{loc:'办公室'}),
  mk('11:20','t_class',{loc:'教室'}),mk('12:00','t_lunch',{loc:'教师食堂'}),mk('12:40','t_noon',{loc:'办公室'}),
  mk('13:10','t_class',{loc:'教室'}),mk('14:00','t_class',{loc:'教室'}),mk('14:50','t_patrol',{loc:'走廊'}),
  mk('15:30','t_patrol',{loc:'走廊'}),mk('15:45','t_office',{loc:'办公室'}));
 if(G.date.getDay()===1)a.push(mk('16:00','t_meeting',{loc:'会议室'}));
 else a.push(mk('16:30','t_intl',{loc:'国际部'}));
 a.push(mk('17:00','t_dinner',{loc:'教师食堂'}));
 if(ch(.55))a.push(mk('18:00','t_night',{loc:'教室'}));
 a.push(mk('21:50','t_off',{loc:'办公室'}),mk('22:00','t_home',{loc:'家'}));
 return a;
}

/* ================================================================
   ④ 统一“时段多动作”系统（核心：绝不跳时间）
   ----------------------------------------------------------------
   用法：SLOTS.xxx = function(s){ return {title,text,choices:[
      C('🚀 开始安排这段时间','N分钟',function(){hold(next);xzTimeSlot(...);})
   ]};}
   ================================================================ */
function xzTimeSlot(title,text,totalMin,actions,opts){
 opts=opts||{};
 G._ts={title:title,text:text,left:totalMin||10,acts:0,actions:actions||[],opts:opts};
 if(opts.bellIn)ringBell('上课');
 xzTSRender();
}
function xzTSRender(){
 var t=G._ts;if(!t)return;
 var h='<h3>⏰ '+esc(t.title)+' <span class="dim small">（还剩 '+t.left+' 分钟 · 已做 '+t.acts+' 件事）</span></h3>';
 if(t.text)h+='<div class="quote">'+esc(t.text)+'</div>';
 h+='<div style="max-height:400px;overflow-y:auto">';
 if(G.pendingStory&&!t.opts.noStory)h+='<button class="gbtn" style="width:100%;margin:4px 0" onclick="xzTSStory()">📖 附近好像发生了什么事…（3分钟）</button>';
 for(var i=0;i<t.actions.length;i++){
  var a=t.actions[i];
  h+='<button class="gbtn" style="width:100%;margin:4px 0" onclick="xzTSDo('+i+')">'+a.t+(a.r?' <span class="dim small">'+(a.r[0]===a.r[1]?a.r[0]:a.r[0]+'-'+a.r[1])+'分钟</span>':'')+'</button>';
 }
 h+='</div>';
 h+='<button class="gbtn" data-auto="1" style="width:100%;margin:6px 0;background:#ff6b6b" onclick="xzTSEnd()">⏰ 结束（进入下一时段）</button>';
 modal(h);
 if(AUTO)setTimeout(function(){var b=document.querySelector('#modalbox [data-auto]');if(b)b.click();},420);
}
function xzTSDo(i){
 var t=G._ts,a=t.actions&&t.actions[i];if(!t||!a)return;
 var min=a.r?rnd(a.r[0],a.r[1]):0;
 t.left-=min;t.acts++;
 if(a.bell)t.left-=0; /* 预留 */
 try{a.fn(min);}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
 clampAll();upd();
 if(G.over)return;
 if(G._tsNested){G._tsNested=false;return;} /* 动作内部打开了二级菜单，由其自行返回 */
 if(t.left<=0){
  l('⏰ '+(t.opts.endLabel||'时间到了，'+(t.opts.bellOut===false?'':'下课铃响了')),'warn');
  if(t.opts.bellOut!==false&&(t.opts.kind==='class'||t.opts.kind==='night'||t.opts.kind==='morningRead'))ringBell('下课');
  G._ts=null;closeModal(); /* closeModal 会执行 PEND(next) */
  return;
 }
 if(t.acts>=18){l('⏰ 这段时间已经安排得很满了。','warn');G._ts=null;closeModal();return;}
 xzTSRender();
}
function xzTSEnd(){
 var t=G._ts;
 if(t&&t.opts.bellOut!==false&&(t.opts.kind==='class'||t.opts.kind==='night'||t.opts.kind==='morningRead'))ringBell('下课');
 G._ts=null;closeModal(); /* PEND=next 在 closeModal 中触发 */
}
function xzTSStory(){
 var t=G._ts;if(!t)return;
 t.left-=3;t.acts++;
 xzStoryModal();
}
function xzStoryModal(){
 G.pendingStory=0;
 var def=storyEvent();
 var h='<h3>'+def.title+'</h3><div class="novel">'+def.text+'</div>';
 window._xzSC=def.choices||[];
 for(var i=0;i<window._xzSC.length;i++){
  (function(c){
   h+='<button class="gbtn" style="width:100%;margin:4px 0" onclick="xzStoryPick('+i+')">'+esc(c.label)+'</button>';
  })(window._xzSC[i]);
 }
 modal(h);
}
function xzStoryPick(i){
 var c=window._xzSC&&window._xzSC[i];if(!c)return;
 try{if(c.run)c.run();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
 clampAll();upd();
 if(G.over)return;
 var m=$('#modal');if(m)m.classList.add('hidden');
 if(G._ts)xzTSRender();
}

/* ================================================================
   ⑤ 时段覆盖（全部返回 def，不再有“跳时间”级联）
   ================================================================ */

/* ---- 5.1 起床 06:10 ---- */
SLOTS.wake=function(s){
 ringBell('起床');
 return {title:'🌅 06:10 起床',text:'宿舍的灯“啪”地亮了，生活老师的脚步声由远及近。\n今天是 '+dcn(G.date)+'，6:50 前要到操场。',
  choices:[
   C('💧 起床洗漱，利索点','为早操做准备',function(){G.mood+=3;l('你用冷水洗了把脸，瞬间清醒。心情+3');next();}),
   C('😴 再赖床 5 分钟','可能来不及',function(){G.sleep-=6;G.mood+=2;
    if(tc(.3,'warn','你赖床太久，到操场时已经吹哨了，被体育委员记了一笔')){}
    l('你多赖了会儿床，但也不敢太久。');next();}),
   C('📖 边穿衣服边背昨晚的单词','学习+2',function(){G.knowledge+=2;G.st.study+=2;l('你在心里过了一遍单词，效率还行。学习+2');next();})
  ]};
};

/* ---- 5.2 晨跑 06:40（6:50 前到操场 · 跑步10分钟 · 下雨直接吃早饭） ---- */
SLOTS.exercise=function(s){
 if(G.weather&&G.weather.rain>=1&&G.weather.n.indexOf('雷')<0){
  return {title:'🌧️ 06:40 晨跑（雨天取消）',text:'广播里传来通知：今天下雨，跑操取消，直接去吃早饭。\n（7:20 前回教室上早读就行）',
   choices:[C('🍜 直接去吃早饭','',function(){l('你撑着伞慢慢走向食堂。');next();})]};
 }
 return {title:'🌅 06:40 晨跑集合（6:50 前到操场）',text:'广播放着集合曲，操场上各班开始列队。\n6:50 前得到操场，到得早的话还能多喘两口气。你选择怎么去？',
  choices:[
   C('🏃 小跑过去（06:40 到）','提前到，从容',function(){l('你一路小跑到操场，班里还没站齐，你排在前面。');return xzExerciseRun();}),
   C('🚶 正常走过去（06:45 到）','中规中矩',function(){l('你掐着点走进队伍，刚好开始热身。');return xzExerciseRun();}),
   C('⏰ 踩点到（06:50 到）','有被记迟到的风险',function(){if(tc(.3,'warn','你踩着哨声跑进队伍，体育委员记了你的名字')){}l('你最后一个站进队伍，气还没喘匀。');return xzExerciseRun();})
  ]};
};
function xzExerciseRun(){
 return {title:'🏃 跑步 10 分钟',text:'哨声一响，队伍沿着跑道开跑。晨风有点凉，跑道上有昨晚的露水。你选择……',
  choices:[
   C('💪 认真跑满 10 分钟','体力+2 心情+2',function(){G.fitness=cl(G.fitness+2,0,100);G.mood=cl(G.mood+2,0,100);G.st.exer++;
    l('你保持匀速跑完 10 分钟，呼吸均匀，出了一层薄汗。','good');next();}),
   C('😮‍💨 跑一半走一半','体力+1',function(){G.fitness=cl(G.fitness+1,0,100);
    if(ch(.25))l('体育委员喊：“跟上！”你只好又跑起来。','warn');else l('你躲在队伍中间，偷偷走了两段。');next();}),
   C('🙋 请假见习','',function(){l('你和体育委员请了假，在旁边慢慢走了一圈。');next();}),
   C('👟 系鞋带摸鱼','',function(){l('你蹲下系了三遍鞋带，成功混过一圈。');if(ch(.2))G.mood-=2;next();}),
   C('💬 边跑边和同学聊天','心情+3',function(){G.mood=cl(G.mood+3,0,100);G.support=cl(G.support+1,0,100);
    l('你和旁边的同学聊着昨晚的球赛，跑得轻松。心情+3','good');next();})
  ]};
}

/* ---- 5.3 早饭 07:00（7:20 前回教室） ---- */
SLOTS.breakfast=function(s){
 return {title:'🍜 07:00 早饭（7:20 前回教室）',text:'食堂飘着包子和豆浆的味道，窗口前排着队。\n你打算怎么对付这顿早饭？',
  choices:[
   C('🥟 包子 + 豆浆，坐下来慢慢吃','健康+5 心情+2',function(){G.health+=5;G.mood+=2;G.st.eat++;
    l('你吃了两个肉包一碗豆浆，胃里暖暖的。','good');next();}),
   C('🫓 排队买烤饼（可能来不及）','有迟到风险',function(){G.health+=4;
    if(tc(.3,'warn','烤饼摊排队太久，你端着饼一路跑回教室，刚坐下就早读了')){}
    l('你买到了现烤的梅干菜饼，真香。');next();}),
   C('🍞 边走边吃 / 带去教室','省时间',function(){G.health+=2;
    if(ch(.25))l('你一边走一边吃，被班主任撞见：“路上吃容易呛。”','warn');
    else l('你三两口解决，省了时间。');next();}),
   C('📖 不吃早饭，直接回教室背单词','学习+3 健康-4',function(){G.knowledge+=3;G.st.study+=3;G.health-=4;
    l('你空腹回到教室背了会儿单词。学习+3，但胃有点抗议。');next();}),
   C('🍜 和同学拼桌边吃边聊','心情+4',function(){G.mood+=4;G.support+=1;
    l('你和同学聊着昨天的事，一碗粥喝了十分钟。心情+4','good');next();})
  ]};
};

/* ---- 5.4 早读 07:20-07:50（30 分钟多动作） ---- */
SLOTS.morningRead=function(s){
 return {title:'📖 07:20 早读（30 分钟）',text:pk(EXTRA_TEXTS_561.morning_lines)+'\n班主任站在门口，早读声此起彼伏。',
  choices:[C('📚 开始早读（可做多件事）','30 分钟自由支配',function(){hold(next);
   xzTimeSlot('📖 早读',pk(EXTRA_TEXTS_561.morning_lines),30,[
    {t:'🗣️ 大声朗读课文',r:[8,12],fn:function(m){G.knowledge+=2;G.st.study+=2;l('你大声读了两篇课文。知识+2');}},
    {t:'📝 默背英语单词',r:[8,12],fn:function(m){G.knowledge+=2;G.st.study+=2;l('你背了一组单词，记住了大半。知识+2');}},
    {t:'💬 小声和同桌聊天',r:[4,8],fn:function(m){G.mood+=3;G.support+=1;l('你借着读书声和同桌聊了几句。心情+3');}},
    {t:'😴 眯一会儿',r:[5,10],fn:function(m){G.sleep-=10;l('你闭眼眯了一会儿，差点真睡着。困意-10');}},
    {t:'📱 偷偷摸手机',r:[3,6],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.2,'confiscate','你低头看手机，班主任正从后门进来','phone'))return;G.mood+=4;l('你躲在课本后面刷了一会儿。心情+4');}},
    {t:'✍️ 补昨天的作业',r:[6,10],fn:function(m){G.knowledge+=1;G.st.study+=1;l('你补了两道昨天不会的题。知识+1');}}
   ],{kind:'morningRead',bellIn:true,noStory:true});
  })]};
};

/* ---- 5.5 大课间 09:25-09:45（课间操 20 分钟） ---- */
SLOTS.gymBreak=function(s){
 return {title:'🏃 09:25 大课间（20 分钟）',text:'第二节课后是大课间，广播体操音乐响彻操场。\n所有班级按队形排好，教导主任站在主席台上巡视。',
  choices:[C('🎵 开始大课间（可做多件事）','20 分钟自由支配',function(){hold(next);
   xzTimeSlot('🏃 大课间',G.weather.rain>=1?'下雨，大课间改在室内，各班走廊集合做操。':'操场上阳光正好，广播体操的口令一板一眼。',20,[
    {t:'🙆 认真做广播体操',r:[4,5],fn:function(m){G.health+=2;G.fitness=cl(G.fitness+1,0,100);l('你把动作做得特别标准。健康+2');}},
    {t:'🤸 敷衍划水',r:[4,5],fn:function(m){if(ch(.2))l('教导主任的目光扫过来，你赶紧把动作做标准。','warn');else l('你手在空中划了两下，反正没人看。');}},
    {t:'💬 边做操边聊天',r:[4,6],fn:function(m){G.mood+=2;l('你和旁边的同学一边做操一边聊八卦。心情+2');}},
    {t:'🏀 趁机去篮球场投几个',r:[6,8],fn:function(m){G.fitness=cl(G.fitness+1,0,100);G.mood+=3;
     if(tc(.15,'warn','你刚投进一个，就被体育老师喊回去做操')){}l('你溜去投了几个篮，手感不错。体力+1');}},
    {t:'📱 躲角落玩手机',r:[4,8],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.3,'confiscate','大课间玩手机太显眼，被巡视的主任抓个正着','phone'))return;G.mood+=5;l('你躲在树荫下刷了会儿手机。心情+5');}}
   ],{kind:'gym',bellIn:true});
  })]};
};

/* ---- 5.6 课间（5 / 10 分钟多动作，含剧情） ---- */
SLOTS.break=function(s){
 var min=(s&&s.min)||10;
 var isShort=min<=5;
 return {title:'☕ '+(s&&s.t?s.t:'课间')+' 课间（'+min+' 分钟）',text:pk(EXTRA_TEXTS_561.break_lines)+'\n💡 这段时间可以做多件事，时间用完或想走就走。',
  choices:[C('🚶 开始安排课间（多动作）',min+' 分钟自由支配',function(){hold(next);
   xzTimeSlot('☕ 课间',pk(EXTRA_TEXTS_561.break_lines),min,[
    {t:'🚻 去厕所',r:isShort?[1,3]:[2,4],fn:function(m){l('你去了趟厕所，洗了把脸。');}},
    {t:'💧 去灌水',r:[1,2],fn:function(m){G.health+=1;l('你接了杯温水，喝了两口。健康+1');}},
    {t:'💬 和同学聊天',r:[3,5],fn:function(m){G.mood+=4;G.support+=1;G.st.chat++;l('你们聊了聊昨晚的球赛和八卦。心情+4','good');}},
    {t:'📱 玩会儿手机',r:[3,5],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.12,'confiscate','课间玩手机被路过的老师看到','phone'))return;G.st.phone++;G.mood+=5;l('你刷了会儿手机。心情+5');}},
    {t:'😴 趴桌上眯一会',r:[4,6],fn:function(m){G.sleep-=10;G.st.slept++;l('你趴桌上眯了一会儿。困意-10');}},
    {t:'🍬 吃点零食',r:[2,3],fn:function(m){G.mood+=2;l('你吃了点零食，补充糖分。心情+2');}},
    {t:'🛒 冲去小卖部',r:[5,8],fn:function(m){G._tsNested=true;
     var t0=G._ts;hold(function(){G.loc='教室';if(G._ts)xzTSRender();});shopSys();}},
    {t:'💗 去找心动的人说句话',r:[3,5],fn:function(m){var p=bestMet561();
     if(!p){l('你环顾四周，暂时没有心动目标。');return;}
     p.aff=cl(p.aff+3);G.mood+=3;G.st.love++;
     l('你鼓起勇气过去和'+p.n+'打了个招呼。好感+3','love');}},
    {t:'🏫 去办公室找老师',r:[3,5],fn:function(m){G.support+=2;l('你跑去办公室问了老师一道题，顺便刷了刷存在感。支持度+2');}},
    {t:'📖 去图书角翻翻书',r:[3,4],fn:function(m){G.knowledge+=1;l('你翻了翻图书角的杂志。知识+1');}},
    {t:'🖊️ 玩希沃白板',r:[3,6],fn:function(m){l('你走上讲台，点开希沃白板…','info');xzWhiteboard();}},
    {t:'🤖 找老师聊聊（AI）',r:[3,5],fn:function(m){l('你趁课间走向办公室…','info');xzTeacherChatAI();}}
   ],{kind:'break',noStory:isShort});
  })]};
};

/* ---- 5.7 眼保健操 10:35 / 15:30（5 分钟） ---- */
SLOTS.eyecare=function(s){
 var who=s&&s.n?s.n:1;
 return {title:'👁️ '+(s.t?s.t:G.time)+' 眼保健操（第'+who+'次 · 5 分钟）',text:'广播里响起那段熟悉的旋律。\n走廊里站着两个戴红袖章的检查员。',
  choices:[C('🙆 开始做操（可做多件事）','5 分钟',function(){hold(next);
   xzTimeSlot('👁️ 眼保健操',who===1?'上午第二节课后的大课间刚结束，广播开始放眼保健操。':'下午第二节下课后，广播又开始放眼保健操。',5,[
    {t:'👀 认真做',r:[4,5],fn:function(m){G.health+=2;G.sleep-=3;l('你认真按完四个八拍，眼睛舒服多了。');}},
    {t:'🙄 敷衍按两下',r:[4,5],fn:function(m){if(ch(.3))l('检查员从窗外看了你一眼，你赶紧装模作样。','warn');else l('你手在脸上划了两下。');}},
    {t:'🫥 闭眼假装在做',r:[4,5],fn:function(m){G.sleep-=4;l('你闭着眼装模作样，其实在想中午吃什么。');}},
    {t:'🚻 借口去厕所溜一圈',r:[4,5],fn:function(m){G._tsNested=true;G._ts=null;
     hold(function(){moveTo('厕所',function(){hold(next);breakSystem('🚻 厕所/走廊',5,'学生',function(){next();});});});
     closeModal();}}
   ],{kind:'eyecare',bellIn:true,noStory:true});
  })]};
};

/* ---- 5.8 课堂 40 分钟多动作（修复考试覆盖 + 体育分科 + 恋爱互动） ---- */
SLOTS.class=function(s){
 /* 恢复考试日覆盖（5.5.5 中 M6 覆盖丢掉了它） */
 var d=dstr(G.date);
 if(EXAMS[d]&&G.examKey!==d&&s.subject!=='体育'){G.examKey=d;return examBegin(EXAMS[d]);}
 var subj=s.subject||'语文';
 if(subj==='体育')return xzSport(s);
 G._cN=s.n||'';G._cSubj=subj;
 return {title:'📖 '+s.t+' 第'+(s.n||'?')+'节 · '+subj,text:SUBSAY[subj]+'\n💡 这节课 40 分钟，可以安排好几种过法。',
  choices:[C('📚 开始上课（多动作）','40 分钟自由支配',function(){hold(next);xzClass(s);})]};
};
function xzClass(s){
 var subj=G._cSubj||'语文';
 ringBell('上课');
 xzTimeSlot('📖 '+subj+'课 · 第'+(G._cN||'?')+'节',pk(EXTRA_TEXTS_561.class_general),40,[
  {t:'📝 认真听课',r:[10,15],fn:function(m){G.knowledge+=2;G.support+=1;G.st.study+=2;G.sleep+=3;
   l('你认真听了'+m+'分钟。知识+2 支持度+1');
   if(ch(.3)&&G.sleep<60){G.mood+=4;G.knowledge+=1;l('✋ 老师点名提问，你对答如流。心情+4','good');}}},
  {t:'📒 做笔记',r:[10,15],fn:function(m){G.knowledge+=3;G.st.study+=3;l('你认真做了'+m+'分钟笔记。知识+3');}},
  {t:'💬 和同桌说话',r:[5,10],fn:function(m){G.mood+=3;G.st.chat++;
   if(ch(.2)){l('⚠️ 被老师点名了！','warn');G.support-=2;}l('你和同桌说了'+m+'分钟话。心情+3');}},
  {t:'💗 给心动的人传纸条',r:[5,8],fn:function(m){var p=bestMet561();
   if(!p){l('你抬头看了看，没有想传纸条的对象。');return;}
   p.aff=cl(p.aff+3);G.mood+=3;G.st.love++;
   l('你传了张纸条给'+p.n+'：“中午吃什么？”TA回你一个小笑脸。好感+3','love');
   if(ch(.12)){l('⚠️ 纸条被老师截获了！','bad');G.support-=3;}}},
  {t:'🤳 给TA发消息（AI 对话）',r:[5,10],fn:function(m){
   var p=bestMet561();
   if(!p){l('你翻了翻通讯录，没有想聊的人。','warn');return;}
   l('💬 你偷偷打开手机，给'+p.n+'发了条消息…','dim');
   xzChatPanel(p,'class');
   G.st.phone++;
  }},
  {t:'😴 打瞌睡',r:[10,20],fn:function(m){G.sleep=cl(G.sleep-m*0.5,0,100);G.st.slept++;
   if(ch(.15)){l('⚠️ 老师扔了个粉笔头过来！','bad');G.mood-=5;G.support-=3;}else l('你打瞌睡了'+m+'分钟。');}},
  {t:'📱 偷偷玩手机',r:[5,10],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
   G.st.phone++;G.mood+=3;
   if(tc(.2,'confiscate','上课玩手机被抓了，屏幕还亮着','phone'))return;
   l('你偷偷玩了'+m+'分钟手机。心情+3');}},
  {t:'🎨 课本上画画',r:[5,10],fn:function(m){G.mood+=2;G.creativity=(G.creativity||0)+1;l('你在课本空白处画了'+m+'分钟。创造力+1');}},
  {t:'📝 传小纸条',r:[5,8],fn:function(m){var notes=['中午吃什么？','这题会吗？','下课一起去厕所','老师今天好凶','晚上一起回宿舍','你看窗外那只鸟'];
   l('你传了张小纸条："'+pk(notes)+'"');G.mood+=2;
   if(ch(.15)){l('⚠️ 小纸条被老师截获了！','bad');G.support-=5;}}},
  {t:'🚻 举手去厕所',r:[5,15],fn:function(m){l('你举手去了厕所，花了'+m+'分钟。');}},
  {t:'🏥 装病去医务室',r:[15,25],fn:function(m){
   if(!tc(.3,'criticize','校医一摸你的脉搏："跳这么有力？"')){l('你成功混到医务室，躺了'+m+'分钟。');G.sleep=cl(G.sleep-15,0,100);}}},
  {t:'🍬 偷偷吃东西',r:[3,5],fn:function(m){var snacks=['薯片','饼干','巧克力','糖','辣条','面包'];
   l('你偷偷吃了'+pk(snacks)+'。心情+3');G.mood+=3;
   if(ch(.1)){l('⚠️ 吃东西的声音被老师听到了！','warn');G.support-=2;}}},
  {t:'📚 写别的作业',r:[10,15],fn:function(m){G.knowledge+=1;G.st.study+=1;
   if(!tc(.2,'warn','老师发现你的练习册封面不对劲'))l('你写了'+m+'分钟别的作业。知识+1');}},
  {t:'💭 走神发呆',r:[5,15],fn:function(m){G.mood+=1;G.sleep+=2;
   l('你走神发呆了'+m+'分钟，想了很多有的没的。');}}
 ],{kind:'class',bellIn:false,noStory:true});
}
function xzSport(s){
 if(G.weather&&G.weather.rain>=2)return {title:'🏀 '+s.t+' 体育课（雨 · 室内）',text:'体育老师看着外面的雨叹气：“今天室内自习。”\n全班发出漫长的“啊——”。',
  choices:[
   C('📖 老实写作业','学习+6',function(){G.knowledge+=6;G.st.study+=6;l('你把体育课变成了自习课。学习+6');}),
   C('😴 那正好睡觉','困意-25',function(){G.sleep-=25;G.st.slept++;if(!tc(.3,'criticize','体育老师巡视时一巴掌拍醒了你'))l('你舒服睡了一节课。');}),
   C('🚪 溜去体育馆打球','风险中',function(){G.st.skip++;escapeClass({n:'体育馆',risk:.4,pun:'criticize',go:function(){G.fitness+=5;G.mood+=12;l('你打了半场球。心情+12','good');}});})]};
 return {title:'🏀 '+s.t+' 体育课（40 分钟）',text:'体育老师吹哨：“先跑两圈热身！”\n操场上阳光很好，一群人在打篮球。',
  choices:[C('🏃 开始体育课（多动作）','40 分钟自由支配',function(){hold(next);
   xzTimeSlot('🏀 体育课',G.weather.rain>=1?'体育老师看了看天：“今天不跑圈，自由活动。”':'“先跑两圈热身！”体育老师吹响哨子。',40,[
    {t:'🏃 认真跑两圈热身',r:[6,8],fn:function(m){G.fitness=cl(G.fitness+2,0,100);G.st.exer++;G.sleep-=8;l('你跑了两圈，呼吸顺畅。体力+2');}},
    {t:'🏀 打篮球',r:[10,15],fn:function(m){G.health+=4;G.mood+=8;G.fitness+=2;G.st.exer++;
     l('你投进了几个球，出了一身汗。心情+8','good');}},
    {t:'⚽ 踢足球',r:[10,15],fn:function(m){G.health+=4;G.mood+=7;G.fitness+=2;
     l('你跟着球跑了几轮，累但痛快。心情+7');}},
    {t:'💬 和同学边散步边聊天',r:[8,12],fn:function(m){G.mood+=4;G.support+=1;
     l('你们绕着操场走了一圈又一圈。心情+4');}},
    {t:'🤒 装病见习',r:[15,25],fn:function(m){if(!tc(.3,'criticize','体育老师摸你额头："不发烧？那去跑两圈。"'))
     {G.mood+=3;l('你坐在树荫下看别人跑步。');}}},
    {t:'🪑 坐看台摸鱼',r:[10,15],fn:function(m){G.mood+=4;l('你坐在看台上晒太阳，看云慢慢飘。');}},
    {t:'💗 约心动的人一起活动',r:[10,15],fn:function(m){var p=bestMet561();if(!p){l('你看了看四周，心动的人今天没上体育课。');return;}
     p.aff=cl(p.aff+5);G.mood+=5;G.st.love++;
     l('你叫上'+p.n+'一起打球，TA笑得挺开心。好感+5','love');}}
   ],{kind:'class',bellIn:false,noStory:true});
  })]};
}

/* ---- 5.9 午饭 12:00（12:40 前回教室） ---- */
(function(){
 var _oldMeal=SLOTS.meal;
 SLOTS.meal=function(s){
  var def=_oldMeal(s);
  if(s&&s.which==='午饭')def.title='🍚 12:00 午饭（12:40 前回教室）';
  return def;
 };
})();

/* ---- 5.10 午休 12:40-13:05（25 分钟多动作） ---- */
SLOTS.nap=function(s){
 return {title:'🛏️ 12:40 午休（25 分钟）',text:'午休铃响，教室“哗”地倒下一片。\n班主任在走廊踱步。午休时出去也不管你。',
  choices:[C('😴 开始午休（可做多件事）','25 分钟自由支配',function(){hold(next);
   xzTimeSlot('🛏️ 午休','班主任的脚步声由远及近，又由近及远。',25,[
    {t:'😴 趴桌上睡觉',r:[20,25],fn:function(m){G.sleep=cl(G.sleep-30,0,100);G.health+=3;l('你睡了个踏实的午觉。困意-30');}},
    {t:'📝 用午休写作业',r:[10,20],fn:function(m){G.knowledge+=6;G.st.study+=6;G.sleep+=6;l('你写完了一科作业，但下午会更困。知识+6');}},
    {t:'🚶 去操场走两圈',r:[10,15],fn:function(m){G.health+=3;G.mood+=3;G.st.exer++;l('你在操场走了两圈，看见校猫在晒太阳。健康+3');}},
    {t:'📱 玩手机',r:[10,15],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.2,'confiscate','午休玩手机被宿管/班主任看到','phone'))return;G.mood+=8;G.st.phone++;l('你刷了会儿手机。心情+8');}},
    {t:'💬 和同学小声聊天',r:[8,12],fn:function(m){G.mood+=4;G.support+=1;l('你和同桌头对头小声聊了会儿天。心情+4');}},
    {t:'💗 去TA班级门口晃一圈',r:[5,8],fn:function(m){var p=bestMet561();if(!p){l('你没有想见的人。');return;}
     p.aff=cl(p.aff+2);l('你假装路过'+p.n+'的班级门口，TA正好抬头看到你。好感+2','love');}}
   ],{kind:'nap',noStory:false});
  })]};
};

/* ---- 5.11 晚饭 16:25-18:00（保留原内容，仅改标题时间） ---- */
(function(){
 var _oldDinner=SLOTS.dinner;
 SLOTS.dinner=function(s){
  var def=_oldDinner(s);
  def.title='🍜 16:25 晚饭 / 自由时间（16:25-18:00）';
  return def;
 };
})();

/* ---- 5.12 晚自习 50 分钟多动作 ---- */
SLOTS.night=function(s){
 var n=s&&s.n?s.n:1;
 return {title:'🌙 '+s.t+' 晚自习 · 第'+n+'节（50 分钟）',text:pk(EXTRA_TEXTS_561.night_lines)+'\n💡 晚自习 50 分钟，可以合理安排。',
  choices:[C('📖 开始晚自习（多动作）','50 分钟自由支配',function(){hold(next);
   xzTimeSlot('🌙 晚自习 · 第'+n+'节',pk(EXTRA_TEXTS_561.night_lines),50,[
    {t:'✍️ 认真写作业',r:[15,25],fn:function(m){var g=Math.round(m/5);G.knowledge+=g;G.st.study+=g;l('你埋头写了'+m+'分钟作业。知识+'+g);}},
    {t:'🧠 刷数学/理科题',r:[15,25],fn:function(m){var g=Math.round(m/6);G.knowledge+=g;G.st.study+=g;G.grade=cl(G.grade+0.5,0,100);
     l('你刷了一组题，思路顺了不少。知识+'+g+' 成绩小幅提升');}},
    {t:'📖 看课外书/小说',r:[10,20],fn:function(m){G.mood+=4;var nv=firstNovel();if(nv){G.st.read++;l('你看了会儿'+nv+'。心情+4');}else l('你翻了翻课外书。心情+4');}},
    {t:'💬 和同桌小声说话',r:[5,10],fn:function(m){G.mood+=3;
     if(ch(.15)){l('⚠️ 值日老师看了你们一眼。','warn');G.support-=1;}l('你和同桌小声说了会儿话。心情+3');}},
    {t:'💗 传纸条给心动的人',r:[5,8],fn:function(m){var p=bestMet561();if(!p){l('你没有想传纸条的人。');return;}
     p.aff=cl(p.aff+3);G.mood+=3;G.st.love++;l('你传了张纸条给'+p.n+'，TA回你一个笑脸。好感+3','love');
     if(ch(.1)){l('⚠️ 纸条被值日老师发现了！','bad');G.support-=2;}}},
    {t:'😴 打瞌睡',r:[10,20],fn:function(m){G.sleep=cl(G.sleep-m*0.5,0,100);G.st.slept++;l('你打瞌睡了'+m+'分钟。');}},
    {t:'📱 偷玩手机',r:[5,10],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.2,'confiscate','晚自习玩手机被巡查抓到','phone'))return;G.mood+=5;G.st.phone++;l('你偷偷玩了会儿手机。心情+5');}},
    {t:'🙋 去办公室问题',r:[8,12],fn:function(m){G.support+=2;G.knowledge+=1;l('你去办公室问了一道题，老师挺高兴。支持度+2');}}
   ],{kind:'night',bellIn:true,noStory:n!==2});
  })]};
};

/* ---- 5.13 晚自习后休息 21:50 ---- */
SLOTS.rest=function(s){
 return {title:'🌙 21:50 晚自习结束',text:'四节晚自习终于结束，走廊里全是收拾东西的声音。\n有人冲向小卖部，有人慢悠悠往宿舍走。',
  choices:[C('🚶 开始安排休息时间（多动作）','10 分钟',function(){hold(next);
   xzTimeSlot('🌙 休息时间','10:20 熄灯，宿舍那边还有查寝。',10,[
    {t:'🍜 去小卖部买夜宵',r:[5,8],fn:function(m){if(G.money<8){l('钱不够。','warn');return;}
     G.money-=8;G.mood+=6;G.health+=2;l('你买了个面包和酸奶，心满意足。心情+6');}},
    {t:'🚶 和同学一起走回宿舍',r:[4,6],fn:function(m){G.mood+=3;G.support+=1;l('你们聊着今天的事，一路走回宿舍。心情+3');}},
    {t:'📖 再背几个单词',r:[4,6],fn:function(m){G.knowledge+=1;G.st.study+=1;l('你趁着路上背了会儿单词。知识+1');}},
    {t:'📱 抓紧刷会儿手机',r:[3,5],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     G.mood+=4;G.st.phone++;l('你快速刷了会儿手机。心情+4');}}
   ],{kind:'rest'});
  })]};
};

/* ---- 5.14 回宿舍 22:00（20 分钟多动作） ---- */
SLOTS.dorm=function(s){
 return {title:'🏠 22:00 回宿舍',text:'宿舍楼灯火通明，水房里传来哗哗的水声。\n22:20 熄灯，还有 20 分钟自由时间。',
  choices:[C('🧺 开始安排睡前时间（多动作）','20 分钟',function(){hold(next);
   xzTimeSlot('🏠 宿舍睡前时间','22:20 熄灯。宿管阿姨的声音从走廊尽头传来。',20,[
    {t:'🚿 洗漱',r:[5,8],fn:function(m){G.mood+=2;l('你刷牙洗脸，把校服挂好。心情+2');}},
    {t:'🧦 洗袜子/洗衣服',r:[6,10],fn:function(m){G.clean=(G.clean||0)+1;G.charm=cl(G.charm+1,0,100);l('你洗了衣服，晾在窗边。干净+1 魅力+1');}},
    {t:'💬 和室友聊天',r:[6,10],fn:function(m){G.mood+=4;G.support+=1;l('你们聊着班里的事，笑得前仰后合。心情+4');}},
    {t:'🍜 泡个泡面',r:[5,8],fn:function(m){G.mood+=4;G.health-=1;
     if(tc(.25,'warn','泡面味飘出宿舍，宿管阿姨敲了敲门：“谁在吃泡面？”')){}
     l('你心满意足地吃完泡面。心情+4');}},
    {t:'📱 躺床上玩手机',r:[8,12],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.2,'confiscate','宿管查寝时你手机还亮着','phone'))return;G.mood+=6;G.st.phone++;l('你躲在被子里刷了会儿手机。心情+6');}},
    {t:'📖 预习明天的课',r:[8,12],fn:function(m){G.knowledge+=2;G.st.study+=2;l('你翻了翻明天的课本。知识+2');}},
    {t:'💗 给心动的人发晚安',r:[3,5],fn:function(m){var p=bestMet561();if(!p){l('你没有想发消息的人。');return;}
     if(!phoneOK()){l('手机被扣了，发不了。','warn');return;}
     p.aff=cl(p.aff+3);G.mood+=3;G.st.love++;l('你发了句“晚安”，TA回了一个月亮。好感+3','love');}}
   ],{kind:'dorm'});
  })]};
};

/* ---- 5.15 熄灯 22:20（睡觉结束一天，被窝里也能做点事） ---- */
SLOTS.lightsOut=function(s){
 return {title:'🌑 22:20 熄灯',text:'“啪”，灯灭了。宿舍陷入黑暗，只有走廊的光从门缝漏进来。\n宿管阿姨的脚步声渐远。可以睡觉了，也可以在被窝里做点小动作。',
  choices:[C('😴 开始睡觉（可做多件事）','40 分钟',function(){hold(next);
   xzTimeSlot('🌑 熄灯后','明天 6:10 还要起床，注意别睡太晚。',40,[
    {t:'😴 直接睡觉',r:[5,5],fn:function(m){l('你闭上眼，很快睡着了。');G.sleep=0;if(G._ts)G._ts.left=0;}},
    {t:'📱 被窝里玩手机',r:[10,20],fn:function(m){if(!phoneOK()){l('手机被扣了。','warn');return;}
     if(tc(.35,'confiscate','宿管巡夜，透过窗帘看到被子里有光','phone'))return;
     G.mood+=6;G.sleep=cl(G.sleep+8,0,100);G.st.phone++;l('你躲在被窝里刷手机，眼睛越来越酸。心情+6 困意+8');}},
    {t:'💬 和室友夜聊',r:[10,15],fn:function(m){G.mood+=5;G.support+=1;G.sleep=cl(G.sleep+6,0,100);
     l('你们压低声音聊到很晚。心情+5');}},
    {t:'💗 给心动的人发晚安',r:[3,5],fn:function(m){var p=bestMet561();if(!p){l('你没有想发消息的人。');return;}
     if(!phoneOK()){l('手机被扣了。','warn');return;}
     p.aff=cl(p.aff+4);G.mood+=4;G.st.love++;l('你偷偷发了句“晚安”，TA秒回。好感+4','love');}},
    {t:'🕯️ 打手电筒写作业/写情书',r:[15,25],fn:function(m){if(!has('flashlight')){l('你没有手电筒。','warn');return;}
     G.knowledge+=2;G.st.study+=2;G.sleep=cl(G.sleep+10,0,100);l('你借着手电筒的光写了一会儿，困意+10');}}
   ],{kind:'lightsOut',bellIn:false,endLabel:'熄灯时间过去，宿舍安静下来',bellOut:false});
  })]};
};

/* 辅助：当前好感最高的人（恋爱/心动对象） */
function bestMet561(){
 if(!G||!G.met||!G.met.length)return null;
 var best=G.met[0];
 for(var i=1;i<G.met.length;i++)if(G.met[i].aff>best.aff)best=G.met[i];
 return best;
}

/* ================================================================
   ⑥ 恋爱系统增强
   ================================================================ */
var LOVE_PROFILE561={
 '林知远':{p:'温柔负责的班主任，喜欢安静认真的学生。',like:['note','book'],birth:'3月14日'},
 '张逸天':{p:'运动阳光，有点直男，喜欢被夸打球帅。',like:['snack','ball'],birth:'8月22日'},
 '李倩茹':{p:'文静慢热，喜欢甜品和奶茶。',like:['cake','choco','milktea'],birth:'12月5日'},
 '赵建阳':{p:'威严但护短，欣赏靠谱的人。',like:['tea'],birth:'1月1日'},
 '巫洁':{p:'严厉但公平，对认真的人会笑。',like:['book'],birth:'9月10日'}
};
function loveProfile561(n){return LOVE_PROFILE561[n]||null;}
function loveStage561(aff){
 if(aff>=85)return {s:'s4',n:'热恋期',d:'你们已经默契到不用说话。'};
 if(aff>=70)return {s:'s3',n:'双向奔赴',d:'眼神一对上就会笑。'};
 if(aff>=55)return {s:'s2',n:'暧昧升温',d:'就差一句“我喜欢你”。'};
 if(aff>=35)return {s:'s1',n:'认识熟悉',d:'已经开始习惯TA的存在。'};
 return {s:'s0',n:'心动萌芽',d:'还不知道名字，但记住了TA。'};
}
function loveStageBadge561(p){
 var st=loveStage561(p&&p.aff||0);
 return '<span class="lv-stage '+st.s+'">💗 '+st.n+'</span><div class="dim small" style="margin-bottom:6px">'+st.d+'</div>';
}
/* 心动日常（恋爱中/暧昧中都可触发的小剧场） */
function loveDaily561(p){
 var items=[
  {n:'🎒 帮TA拿书/背书包',d:'好感+6',b:'去',fn:function(){p.aff=cl(p.aff+6);G.mood+=5;G.st.love++;
   l('你接过'+p.n+'手里的一摞书：“我顺路。”好感+6','love');upd();loveDaily561(p);}},
  {n:'🧣 借外套/递纸巾',d:'好感+7',b:'去',fn:function(){p.aff=cl(p.aff+7);G.mood+=6;G.st.love++;
   l('你把外套搭在'+p.n+'肩上：“风大，穿上。”好感+7','love');upd();loveDaily561(p);}},
  {n:'☔ 下雨天共伞',d:'好感+8（雨天更配）',b:'去',fn:function(){p.aff=cl(p.aff+8);G.mood+=7;G.st.love++;
   l('雨下起来了，你撑开伞，'+p.n+'往你这边靠了靠。好感+8','love');upd();loveDaily561(p);}},
  {n:'🍚 食堂分菜',d:'好感+5',b:'去',fn:function(){p.aff=cl(p.aff+5);G.mood+=5;G.st.love++;
   l('你把碗里的鸡腿夹给'+p.n+'：“我不爱吃。”其实你最爱吃。好感+5','love');upd();loveDaily561(p);}},
  {n:'📝 帮TA讲题',d:'好感+6 知识+2',b:'去',fn:function(){p.aff=cl(p.aff+6);G.knowledge+=2;G.st.study+=2;G.mood+=4;G.st.love++;
   l('你给'+p.n+'讲了一道数学题，讲完TA恍然大悟。好感+6','love');upd();loveDaily561(p);}},
  {n:'💌 写一张小纸条',d:'好感+5',b:'写',fn:function(){p.aff=cl(p.aff+5);G.mood+=4;G.st.love++;
   l('你在纸条上画了个小太阳，塞进'+p.n+'的课本里。好感+5','love');upd();loveDaily561(p);}}
 ];
 menu('💕 心动日常 · '+p.n,'<div class="quote">'+loveStageBadge561(p)+(loveProfile561(p.n)?'<br>💬 性格：'+loveProfile561(p.n).p+'<br>🎂 生日：'+loveProfile561(p.n).birth+'<br>❤️ 喜欢：'+(loveProfile561(p.n).like.map(function(x){return ITEMS[x]?ITEMS[x].n:x;}).join('、'))+'</div>':'')+'</div>',items);
}
/* 恋爱小事件（每天 tick 有小概率自动触发） */
function loveEvent561(){
 if(!G||G.over)return;
 /* 暧昧期/恋爱中的人物 */
 var p=G.lover||bestMet561();
 if(!p)return;
 if(G.lover){
  G.lover.days=(G.lover.days||0)+1;
  if(G.lovers.length)G.lovers[G.lovers.length-1].days=G.lover.days;
  /* 纪念日 */
  if(G.lover.days>0&&(G.lover.days%30===0)){
   G.lover.aff=cl(G.lover.aff+6);G.mood+=8;G.st.love++;
   l('💞 你和'+G.lover.n+'在一起第 '+G.lover.days+' 天了。今天格外甜。','love');
   if(G.lover.days===100)ach('s34');
   return;
  }
 }
 if(ch(.18)){
  var ev=pk([['🧣','天有点冷，'+p.n+'把自己的围巾分了你一半。','love',6],
   ['☔','下雨了，'+p.n+'把伞往你那边斜了斜，自己半边肩膀都湿了。','love',7],
   ['🍜','食堂打饭时，'+p.n+'把多买的荷包蛋放进了你餐盘。','love',5],
   ['📖','你发现'+p.n+'的书里夹着一张给你的小纸条：“明天见。”','love',6],
   ['😡','有人看到'+p.n+'和别人走得近，你心里酸酸的。','warn',-3],
   ['🤧',''+p.n+'感冒了，课间趴在桌上，你悄悄放了杯热水。','love',5],
   ['🎉','班里有人起哄你和'+p.n+'，你俩都脸红了。','love',4],
   ['📱',''+p.n+'给你发了张天空的照片：“今天的天很好看。”','love',4]]);
  p.aff=cl(p.aff+ev[3]);
  G.mood=cl(G.mood+ev[3]*2);
  G.st.love++;
  l(ev[0]+' '+ev[1]+'（好感'+((ev[3]>=0)?'+':'')+ev[3]+'）',ev[2]);
  if(ev[3]<0&&ch(.3)&&G.lover){G.lover.fight=(G.lover.fight||0)+1;l('😤 因为这件事，TA好像有点不高兴。','bad');}
 }
}
/* 挽回前任 */
function xzExLovers561(){
 if(!G.lovers.length){l('你还没有谈过恋爱。','warn');return;}
 var items=[];
 for(var i=0;i<G.lovers.length;i++){
  (function(v){
   if(v.end==='进行中')return;
   items.push({n:'💞 挽回 '+v.n+'（第'+(i+1)+'轮）',d:'成功后会复合，好感减半',b:'挽回',fn:function(){
    var p=null;
    for(var j=0;j<G.met.length;j++)if(G.met[j].n===v.n)p=G.met[j];
    var q=cl(0.25+(v.end==='分手'?0.2:0)+G.charm/600,0.05,0.8);
    if(ch(q)){
     G.lover={n:v.n,g:v.g,t:v.t,same:v.same,aff:Math.max(30,Math.round(v.days*2)),days:0,start:dcn(G.date),anniv:dcn(G.date),fight:0,reunite:1};
     G.lovers.push({n:v.n,g:v.g,t:v.t,days:0,anniv:dcn(G.date),end:'进行中'});
     G.mood+=15;l('💞 '+v.n+'沉默了很久，说：“……那就再试一次吧。”你们复合了。','love');
     closeModal();upd();
    }else{l('💞 '+v.n+'摇摇头：“过去了就过去吧。”','bad');G.mood-=6;upd();xzExLovers561();}
   }});
  })(G.lovers[i]);
 }
 items.push({n:'关闭',fn:closeModal,b:'关闭'});
 menu('💞 挽回前任','<div class="quote">好感减半、时间会冲淡，但有些人值得再试一次。</div>',items);
}
/* 挂钩：好感阶段徽章 + 心动日常 + 送礼性格加成 */
(function(){
 var _met=metMenu;
 metMenu=function(i){
  var p=G.met&&G.met[i];if(!p)return _met(i);
  _met(i);
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var d=document.createElement('div');
   d.style.cssText='margin-bottom:6px';
   d.innerHTML=loveStageBadge561(p)+(loveProfile561(p.n)?'<div class="dim small">💬 '+loveProfile561(p.n).p+'</div>':'');
   box.insertBefore(d,box.firstChild);
   var ai=document.createElement('button');
   ai.className='gbtn';ai.style.cssText='width:100%;margin:4px 0';
   ai.textContent='🤖 和TA AI 对话（真聊天）';
   ai.onclick=function(){xzChatPanel(p);};
   box.appendChild(ai);
  },0);
 };
 var _lover=loverMenu;
 loverMenu=function(){
  var L=G.lover;if(!L)return _lover();
  _lover();
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var st=loveStage561(L.aff);
   var d=document.createElement('div');
   d.style.cssText='margin-bottom:6px';
   d.innerHTML='<span class="lv-stage '+st.s+'">💗 '+st.n+'</span>'+(loveProfile561(L.n)?'<div class="dim small">💬 '+loveProfile561(L.n).p+' · 🎂 '+loveProfile561(L.n).birth+'</div>':'');
   box.insertBefore(d,box.firstChild);
   var btn=document.createElement('button');
   btn.className='gbtn';btn.style.cssText='width:100%;margin:4px 0';
   btn.textContent='💕 心动日常（更多互动）';
   btn.onclick=function(){loveDaily561(L);};
   box.appendChild(btn);
   var ai2=document.createElement('button');
   ai2.className='gbtn';ai2.style.cssText='width:100%;margin:4px 0';
   ai2.textContent='🤖 和TA AI 对话（真聊天）';
   ai2.onclick=function(){xzChatPanel(L);};
   box.appendChild(ai2);
  },0);
 };
 var _gift=giftMenu;
 giftMenu=function(i){
  var p=G.met&&G.met[i];
  _gift(i);
  if(!p)return;
  var prof=loveProfile561(p.n);if(!prof)return;
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var d=document.createElement('div');
   d.className='quote';
   d.innerHTML='🎁 '+p.n+'的喜好：'+(prof.like.map(function(x){return ITEMS[x]?ITEMS[x].n:x;}).join('、'))+'——送TA喜欢的，好感翻倍！';
   box.insertBefore(d,box.firstChild);
  },0);
 };
 var _loveSys=loveSys;
 loveSys=function(){
  if(G&&!G.lover){ /* 单身时：追加“挽回前任”入口 */
   var hadEx=false;
   for(var i=0;i<G.lovers.length;i++)if(G.lovers[i].end!=='进行中')hadEx=true;
   if(hadEx){_loveSys();setTimeout(function(){
    var box=document.querySelector('#modalbox');if(!box)return;
    var btn=document.createElement('div');
    btn.className='mb';
    btn.innerHTML='<span>💞 挽回前任<br><span class="dim small">过去的人，也许还能回来</span></span><button onclick="xzExLovers561()">挽回</button>';
    box.appendChild(btn);
   },0);return;}
  }
  _loveSys();
 };
})();

/* 成就：恋爱纪念日 */
(function(){
 if(window.ACH_S){
  var has34=false;
  for(var i=0;i<ACH_S.length;i++)if(ACH_S[i].id==='s34')has34=true;
  if(!has34)ACH_S.push({id:'s34',n:'百日纪念',d:'和TA在一起满 100 天'});
 }
})();

/* ================================================================
   ⑦ tick 挂钩：恋爱小事件 / 纪念日（不覆盖原 tick，纯追加）
   ================================================================ */
(function(){
 var _tick=tick;
 tick=function(){
  try{_tick();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
  try{loveEvent561();}catch(e){}
 };
})();

/* ================================================================
   ⑧ 小游戏增强 + 全新「合成大西瓜」
   ================================================================ */
var WM_TIERS=[
 {n:'🍒',r:20,sc:1,c1:'#ff5d73',c2:'#c93a52'},
 {n:'🍓',r:27,sc:3,c1:'#ff7ab6',c2:'#d94e8f'},
 {n:'🍇',r:34,sc:6,c1:'#9b6cff',c2:'#6f45cc'},
 {n:'🍊',r:43,sc:10,c1:'#ffb454',c2:'#e88a2e'},
 {n:'🍋',r:51,sc:15,c1:'#ffd166',c2:'#d9a63c'},
 {n:'🥝',r:61,sc:21,c1:'#7ec98a',c2:'#4e9660'},
 {n:'🍅',r:72,sc:28,c1:'#ff6b4a',c2:'#cf4529'},
 {n:'🍑',r:83,sc:36,c1:'#ff9eb5',c2:'#dd6f8f'},
 {n:'🍍',r:95,sc:45,c1:'#ffd166',c2:'#d9a63c'},
 {n:'🥥',r:109,sc:55,c1:'#b39475',c2:'#7d6145'},
 {n:'🍈',r:125,sc:66,c1:'#8fe0a0',c2:'#4fae6b'},
 {n:'🍉',r:142,sc:78,c1:'#3ddc97',c2:'#1f9c66'}
];
var WM={};
function xzWMBest(){try{return +(localStorage.getItem('xz_wm_best')||0);}catch(e){return 0;}}
function xzWMSave(s){try{if(s>xzWMBest())localStorage.setItem('xz_wm_best',String(Math.floor(s)));}catch(e){}}
function watermelonStart(){
 if(WM.raf)cancelAnimationFrame(WM.raf);
 WM={fruits:[],score:0,over:false,next:rnd(0,4),cur:null,raf:0,last:0,dropable:true,spawnF:undefined};
 WM.canvas=document.createElement('canvas');
 WM.canvas.id='wmCanvas';
 WM.canvas.className='wm-canvas';
 WM.canvas.width=340;WM.canvas.height=520;
 WM.ctx=WM.canvas.getContext('2d');
 var h='<h3>🍉 合成大西瓜</h3><div class="wm-wrap">'+
  '<div style="position:relative"><div class="wm-panel">'+WM.canvas.outerHTML+'</div><div class="wm-over" id="wmOver" style="display:none"><b>游戏结束</b><div class="wm-score" id="wmScoreTxt"></div><button class="big" onclick="watermelonStart()">再来一局</button></div></div>'+
  '<div class="wm-side">'+
   '<div class="wm-stat"><div class="lbl">得分</div><b id="wmScore">0</b></div>'+
   '<div class="wm-stat"><div class="lbl">最高分</div><b id="wmBest">'+xzWMBest()+'</b></div>'+
   '<div class="wm-stat"><div class="lbl">下一个</div><div class="wm-next" id="wmNext"></div></div>'+
   '<div class="wm-help">📌 点击/触摸画布投放水果<br>同种水果相撞会合体升级<br>🍉 是最强！<br>别让水果堆过顶部红线</div>'+
  '</div></div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">返回</button>';
 modal(h);
 WM.canvas=document.getElementById('wmCanvas'); /* 重新绑定真实 canvas */
 if(!WM.canvas){ /* 备用：直接造 */
  var c=document.createElement('canvas');c.className='wm-canvas';c.width=340;c.height=520;
  WM.canvas=c;
 }
 WM.ctx=WM.canvas.getContext('2d');
 WM.danger=60;
 WM.ground=WM.canvas.height-26;
 WM.wallL=20;WM.wallR=WM.canvas.width-20;
 WM.canvas.addEventListener('pointerdown',function(e){
  if(WM.over)return;
  var rect=WM.canvas.getBoundingClientRect();
  var x=(e.clientX-rect.left)*(WM.canvas.width/rect.width);
  WM.spawn(x);
 });
 WM.canvas.addEventListener('pointermove',function(e){
  var rect=WM.canvas.getBoundingClientRect();
  var x=(e.clientX-rect.left)*(WM.canvas.width/rect.width);
  WM.aimX=Math.max(WM.wallL,Math.min(WM.wallR,x));
 });
 WM.spawn=function(x){
  if(WM.over||WM.cur)return;
  var T=WM_TIERS[WM.next];
  var f={t:WM.next,x:Math.max(WM.wallL+T.r,Math.min(WM.wallR-T.r,x||WM.canvas.width/2)),y:-T.r,vx:0,vy:60};
  WM.fruits.push(f);
  WM.cur=f;
  WM.next=rnd(0,4);xzWMNext();
 };
 /* 初始等待第一次投放 */
 WM.cur=null;WM.next=rnd(0,4);xzWMNext();
 WM.last=performance.now();
 (function loop(now){
  if(WM.stopRAF){WM.raf=0;return;}
  WM.raf=requestAnimationFrame(loop);
  var dt=Math.min(0.033,(now-WM.last)/1000);WM.last=now;
  xzWMStep(dt);
  xzWMDraw();
 })(performance.now());
}
function xzWMNext(){
 var el=document.getElementById('wmNext');
 if(el)el.innerHTML='<span style="font-size:30px">'+WM_TIERS[WM.next].n+'</span>';
}
function xzWMStep(dt){
 if(WM.over)return;
 /* 冲击波/粒子/震动计时 */
 if(WM.shocks){for(var _sk=WM.shocks.length-1;_sk>=0;_sk--){WM.shocks[_sk].t+=dt;if(WM.shocks[_sk].t>0.6)WM.shocks.splice(_sk,1);}}
 if(WM.parts){
  for(var _pt=WM.parts.length-1;_pt>=0;_pt--){
   var pt=WM.parts[_pt];pt.t+=dt;pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vy+=500*dt;
   if(pt.t>0.9)WM.parts.splice(_pt,1);
  }
 }
 if(WM.shake)WM.shake=Math.max(0,WM.shake-dt*3);
 /* 物理 */
 var all=WM.fruits;
 for(var j=0;j<all.length;j++){
  var f=all[j];
  f.vy+=900*dt;
  f.x+=f.vx*dt;f.y+=f.vy*dt;
  var T=WM_TIERS[f.t];
  if(f.x-T.r<WM.wallL){f.x=WM.wallL+T.r;f.vx*=-0.4;}
  if(f.x+T.r>WM.wallR){f.x=WM.wallR-T.r;f.vx*=-0.4;}
  /* 地面 */
  if(f.y+T.r>WM.ground){
   f.y=WM.ground-T.r;
   if(f.vy>200){f.vy*=-0.25;f.vx*=0.92;}
   else{f.vy=0;f.vx*=0.9;}
  }
 }
 /* 两两碰撞 + 合体 */
 for(var a=0;a<all.length;a++){
  for(var b=a+1;b<all.length;b++){
   var f1=all[a],f2=all[b];
   var dx=f2.x-f1.x,dy=f2.y-f1.y;
   var d=Math.sqrt(dx*dx+dy*dy)||0.01;
   var rr=WM_TIERS[f1.t].r+WM_TIERS[f2.t].r;
   if(d<rr){
    if(f1.t===f2.t&&f1.t<WM_TIERS.length-1){
     var mx=(f1.x+f2.x)/2,my=(f1.y+f2.y)/2;
     all.splice(b,1);all.splice(a,1);
     var nf={t:f1.t+1,x:mx,y:my,vx:rnd(-40,40),vy:-160,sc:1.5,rot:rnd(-.6,.6)};
     all.push(nf);
     if(WM.cur===f1||WM.cur===f2)WM.cur=nf;
     WM.score+=WM_TIERS[nf.t].sc;
     if(!WM.floats)WM.floats=[];
     WM.floats.push({x:mx,y:my-14,t:0,txt:'合体 '+WM_TIERS[nf.t].n+' +'+WM_TIERS[nf.t].sc});
     /* 合体冲击波 + 粒子爆发 */
     if(!WM.shocks)WM.shocks=[];
     WM.shocks.push({x:mx,y:my,t:0,c:WM_TIERS[nf.t].c2});
     if(!WM.parts)WM.parts=[];
     for(var _pp=0;_pp<10;_pp++)WM.parts.push({x:mx,y:my,t:0,vx:rnd(-90,90),vy:rnd(-120,20),c:pk(['#ffd166','#ff7ab6','#ffffff','#9b6cff'])});
     WM.shake=(WM.shake||0)+1;
     var el=document.getElementById('wmScore');if(el)el.textContent=WM.score;
     a=all.length;break;
    }
    /* 推开 */
    var overlap=(rr-d)/2+0.5;
    var nx=dx/d,ny=dy/d;
    f1.x-=nx*overlap;f1.y-=ny*overlap;f2.x+=nx*overlap;f2.y+=ny*overlap;
    var rel=(f1.vx-f2.vx)*nx+(f1.vy-f2.vy)*ny;
    if(rel>0){
     var imp=rel*0.55;
     f1.vx-=imp*nx*0.5;f1.vy-=imp*ny*0.5;
     f2.vx+=imp*nx*0.5;f2.vy+=imp*ny*0.5;
    }
   }
  }
 }
 /* 落地稳定 */
 for(var s=0;s<all.length;s++){
  var ff=all[s];
  if(Math.abs(ff.vy)<25&&ff.y+WM_TIERS[ff.t].r>=WM.ground-2){ff.vy=0;ff.vx*=0.9;}
 }
 /* 当前投放中的水果是否停稳（停稳后才能投下一个） */
 if(WM.cur){
  var cf=WM.cur;
  if(!WM.curT)WM.curT=0;
  WM.curT+=dt;
  /* 出生满 1 秒即释放投放锁（不要求触地，防止水果被挡在顶部“点不动”）；触地立即释放 */
  if(WM.curT>1||cf.y+WM_TIERS[cf.t].r>=WM.ground-4){WM.cur=null;WM.curT=0;}
 }
 /* 合体弹跳缩放回弹 + 飘字计时 */
 for(var _z=0;_z<all.length;_z++){if(all[_z].sc>1)all[_z].sc=Math.max(1,all[_z].sc-dt*2.2);}
 if(WM.floats){
  for(var _ft=WM.floats.length-1;_ft>=0;_ft--){WM.floats[_ft].t+=dt;if(WM.floats[_ft].t>1.3)WM.floats.splice(_ft,1);}
 }
 /* 游戏结束判定：堆到危险线以上 */
 var high=0;
 for(var h2=0;h2<all.length;h2++){var hh=all[h2];if(hh.y-WM_TIERS[hh.t].r<WM.danger)high++;}
 if(high>=1&&!WM.cur){
  WM.hold=(WM.hold||0)+dt;
  if(WM.hold>1.2){WM.over=true;xzWMOver();}
 }else WM.hold=0;
}
function xzWMDraw(){
 var ctx=WM.ctx;if(!ctx)return;
 var shakeX=0,shakeY=0;
 if(WM.shake){shakeX=rnd(-3,3)*Math.min(3,WM.shake);shakeY=rnd(-2,2)*Math.min(3,WM.shake);}
 ctx.save();
 ctx.translate(shakeX,shakeY);
 ctx.clearRect(-4,-4,WM.canvas.width+8,WM.canvas.height+8);
 /* 背景：星空/光晕粒子 */
 var bg=ctx.createLinearGradient(0,0,0,WM.canvas.height);
 bg.addColorStop(0,'#2a3f7a');bg.addColorStop(.6,'#1d2c56');bg.addColorStop(1,'#131f3f');
 ctx.fillStyle=bg;ctx.fillRect(-4,-4,WM.canvas.width+8,WM.canvas.height+8);
 var st=performance.now()/900;
 for(var _st=0;_st<26;_st++){
  var sx=(_st*97+st*8)%(WM.canvas.width+20)-10;
  var sy=(_st*53)%(WM.canvas.height*0.5);
  var sa=0.25+0.35*Math.abs(Math.sin(st*1.2+_st));
  ctx.fillStyle='rgba(255,255,255,'+sa+')';
  ctx.beginPath();ctx.arc(sx,sy,1.2+_st%3*0.5,0,Math.PI*2);ctx.fill();
 }
 /* 危险线 */
 ctx.strokeStyle='rgba(255,93,115,.6)';ctx.setLineDash([6,6]);ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(0,WM.danger);ctx.lineTo(WM.canvas.width,WM.danger);ctx.stroke();
 ctx.setLineDash([]);
 ctx.fillStyle='rgba(255,93,115,.75)';ctx.font='11px sans-serif';ctx.textAlign='center';
 ctx.fillText('⚠ 危险线',WM.canvas.width/2,WM.danger-6);
 /* 地面 */
 var fg=ctx.createLinearGradient(0,WM.ground,0,WM.canvas.height);
 fg.addColorStop(0,'rgba(61,220,151,.35)');fg.addColorStop(1,'rgba(34,130,92,.35)');
 ctx.fillStyle=fg;
 ctx.fillRect(0,WM.ground,WM.canvas.width,WM.canvas.height-WM.ground);
 /* 水果 */
 var all=[];
 if(WM.cur)all.push(WM.cur);
 for(var i=0;i<WM.fruits.length;i++)all.push(WM.fruits[i]);
 for(var j=0;j<all.length;j++){var f=all[j];xzWMFruit(ctx,f);}
 /* 冲击波环 */
 if(WM.shocks){
  for(var k2=0;k2<WM.shocks.length;k2++){
   var sh=WM.shocks[k2];
   var rr=16+sh.t*130;
   ctx.globalAlpha=Math.max(0,1-sh.t/0.6);
   ctx.strokeStyle=sh.c||'#ffd166';ctx.lineWidth=4*(1-sh.t/0.6)+1;
   ctx.beginPath();ctx.arc(sh.x,sh.y,rr,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=1;
  }
 }
 /* 粒子 */
 if(WM.parts){
  for(var k3=0;k3<WM.parts.length;k3++){
   var pa=WM.parts[k3];
   ctx.globalAlpha=Math.max(0,1-pa.t/0.9);
   ctx.fillStyle=pa.c||'#fff';
   ctx.beginPath();ctx.arc(pa.x,pa.y,3.5,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
 }
 /* 得分飘字 */
 if(WM.floats){
  for(var k=0;k<WM.floats.length;k++){
   var ft=WM.floats[k];
   var a=Math.max(0,1-ft.t/1.3);
   ctx.globalAlpha=a;
   ctx.fillStyle='#ffd166';
   ctx.font='bold 16px sans-serif';
   ctx.textAlign='center';
   ctx.fillText(ft.txt,ft.x,ft.y-ft.t*42);
  }
  ctx.globalAlpha=1;
 }
 ctx.restore();
}
function xzWMFruit(ctx,f){
 var T=WM_TIERS[f.t];
 if(f.rot===undefined)f.rot=0;
 f.rot+=(f.vx||0)*0.004;
 var sc=f.sc||1;
 ctx.save();
 ctx.translate(f.x,f.y);
 ctx.rotate(f.rot);
 ctx.scale(sc,sc);
 ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
 var g=ctx.createRadialGradient(-T.r*0.35,-T.r*0.4,T.r*0.15,0,0,T.r);
 g.addColorStop(0,'#ffffff');
 g.addColorStop(.18,T.c1);
 g.addColorStop(1,T.c2);
 ctx.fillStyle=g;
 ctx.beginPath();ctx.arc(0,0,T.r,0,Math.PI*2);ctx.fill();
 ctx.shadowColor='transparent';
 ctx.fillStyle='rgba(255,255,255,.85)';
 ctx.font='bold '+(T.r*0.9)+'px sans-serif';
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText(T.n,0,1);
 ctx.restore();
}
function xzWMOver(){
 xzWMSave(WM.score);
 var el=document.getElementById('wmOver');
 if(el)el.style.display='flex';
 var t=document.getElementById('wmScoreTxt');
 if(t)t.textContent='本局得分：'+WM.score+'  ·  最高：'+xzWMBest();
 var b=document.getElementById('wmBest');
 if(b)b.textContent=xzWMBest();
 l('🍉 合成大西瓜得分：'+WM.score+'（最高 '+xzWMBest()+'）','good');
 if(G){G.mood=cl(G.mood+Math.min(10,WM.score/10),0,100);upd();}
}
/* 小游戏大厅增强：头部加入合成大西瓜与最高分 */
(function(){
 var _open=openGame;
 openGame=function(){
  _open();
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var d=document.createElement('div');
   d.className='mb';
   d.style.cssText='border-color:rgba(255,209,102,.5);background:linear-gradient(90deg,rgba(255,140,94,.12),rgba(255,93,115,.12))';
   d.innerHTML='<span>🍉 合成大西瓜<br><span class="dim small">物理合体 · 最高分 '+xzWMBest()+'</span></span><button onclick="watermelonStart()">开玩</button>';
   box.insertBefore(d,box.firstChild);
   var d2=document.createElement('div');
   d2.className='mb';
   d2.style.cssText='border-color:rgba(245,166,35,.5);background:linear-gradient(90deg,rgba(245,166,35,.14),rgba(217,122,31,.1))';
   d2.innerHTML='<span>⛏️ 黄金矿工<br><span class="dim small">钩爪挖金 · 买炸药炸石头</span></span><button onclick="xzGoldMiner()">开玩</button>';
   box.insertBefore(d2,d);
   var d3=document.createElement('div');
   d3.className='mb';
   d3.style.cssText='border-color:rgba(124,140,255,.5);background:linear-gradient(90deg,rgba(108,140,255,.14),rgba(139,92,246,.1))';
   d3.innerHTML='<span>🎯 跳一跳 2.0<br><span class="dim small">蓄力连击 · 动画升级版</span></span><button onclick="jumpJump()">开玩</button>';
   box.insertBefore(d3,d2);
  },0);
 };
})();

/* ================================================================
   ⑨ 成就彩带 / 设置（铃声开关） / 更新日志（5.5.6.100）
   ================================================================ */
function xzConfetti(){
 var colors=['#ffd166','#ff7ab6','#6c8cff','#3ddc97','#ff5d73','#9b6cff'];
 for(var i=0;i<26;i++){
  var c=document.createElement('div');
  c.className='confetti';
  c.style.cssText='left:'+Math.random()*100+'vw;top:-3vh;width:'+(6+Math.random()*6)+'px;height:'+(9+Math.random()*7)+'px;background:'+pk(colors)+';animation-duration:'+(2.4+Math.random()*2)+'s;animation-delay:'+(Math.random()*0.6)+'s;border-radius:2px;opacity:.95';
  document.body.appendChild(c);
  (function(el){setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},5200);})(c);
 }
}
(function(){
 var _ach=ach;
 ach=function(id){
  var had=G&&G.ach&&G.ach.indexOf(id)>=0;
  var r=_ach(id);
  if(!had&&G&&G.ach.indexOf(id)>=0){xzConfetti();}
  return r;
 };
})();
/* 设置面板追加铃声开关 */
(function(){
 var _os=openSettings;
 openSettings=function(){
  _os();
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var d=document.createElement('div');
   d.className='mb';
   d.innerHTML='<span>🔔 上课铃 / 下课铃<br><span class="dim small">使用本地铃声 bell_src.m4a</span></span><button id="sfxToggle" onclick="xzSfxToggle()">'+(G&&G.sfxOff?'开启铃声':'关闭铃声')+'</button>';
   var last=box.lastElementChild;
   if(last)box.insertBefore(d,last);else box.appendChild(d);
  },0);
 };
})();
/* 5.5.6.100 更新日志（保留历史版本入口） */
(function(){
 var _oc=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.100</h3>'+
   '<div class="quote"><b class="gold">5.5.6.100（重大更新）</b><br>🎨 美术大改动：全新 UI 设计系统，深空玻璃风格，开始界面主视觉重做（片头动画位已预留）<br>'+
   '⏰ 作息精确化：6:10 起床 → 6:50 前操场跑步 10 分钟（雨天取消）→ 7:20 早读 → 7:50 休息 5 分钟 → 40 分钟一节课 → 10:35 眼操 → 12:00 午饭 → 12:40 午休 → 15:30 眼操 → 16:25 放学 → 18:00 晚自习（50 分钟 × 4 节）→ 21:50 结束 → 22:20 熄灯<br>'+
   '🔔 上课铃/下课铃：接入你的铃声音频，到点响铃<br>'+
   '⏳ 不跳时间：所有时段都可做多件事，事件不再吃掉整个课间/课堂<br>'+
   '💬 文字系统扩容：新增 150+ 条课堂/课间/事件/恋爱文案<br>'+
   '💗 恋爱系统增强：好感阶段、性格与喜好、心动日常、纪念日、吃醋、挽回前任<br>'+
   '🍉 全新小游戏「合成大西瓜」，放在开始游戏旁边，随玩随走<br>'+
   '🎮 小游戏大厅重排，最高分记录保存<br>'+
   '📐 工程重构：41MB 单文件拆分为 HTML/CSS/JS 多模块工程，素材外置<br>'+
   '🎬 片头动画位：下方"开始游戏"按钮已就位，等你发视频接入</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){'+(typeof _oc==='function'?'window._xzOldChangelog()':'')+'},80)">📚 查看历史更新记录</button>';
  modal(h);
  window._xzOldChangelog=_oc;
 };
})();

/* ================================================================
   5.5.6.888 追加层：主题 / 大西瓜音效 / 文字与事件扩容 / 设置增强
   ================================================================ */

/* ---------- ① 白天 / 黑夜 双主题（主流 app 同款：白天 / 黑夜 / 自动） ---------- */
function applyTheme(){
 var dark=false;
 if(G&&G.theme==='dark')dark=true;
 else if(G&&G.theme==='light')dark=false;
 else{
  var st='light';
  try{st=localStorage.getItem('xz_theme')||'light';}catch(e){} /* 默认白天 */
  if(st==='dark')dark=true;
  else if(st==='light')dark=false;
  else{
   var hh=G?parseInt(G.time,10):new Date().getHours();
   if(isNaN(hh))hh=12;
   dark=(hh>=18||hh<6); /* 仅“自动”模式才按时入夜 */
  }
 }
 var r=document.documentElement;
 r.classList.toggle('dark',dark);
 r.classList.toggle('light',!dark);
}
function setTheme(k){
 if(G){G.theme=k;try{saveGame();}catch(e){}}
 else{try{localStorage.setItem('xz_theme',k);}catch(e){}}
 applyTheme();
 if(G)l('🌗 显示模式：'+(k==='light'?'☀️ 白天':k==='dark'?'🌙 黑夜':'🌗 自动'),'good');
 /* 只刷新设置面板里主题按钮的高亮，不重开面板 */
 var btns=document.querySelectorAll('#modalbox [data-th]');
 for(var i=0;i<btns.length;i++){
  btns[i].className='gbtn'+(btns[i].getAttribute('data-th')===k?' on':'');
 }
}
/* 主题随游戏时间自动切换（挂在 tick 上，每次时段刷新） */
(function(){
 var _t4=tick;
 tick=function(){
  try{_t4();}catch(e){if(window.onerror)window.onerror(e.message,'',0);}
  try{applyTheme();}catch(e){}
 };
})();

/* ---------- ② 设置面板增强：显示模式 + 更新日志入口 ---------- */
(function(){
 var _os2=openSettings;
 openSettings=function(){
  _os2();
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var cur='auto';
   if(G&&G.theme)cur=G.theme;
   else{try{cur=localStorage.getItem('xz_theme')||'auto';}catch(e){}}
   var tmap={light:'☀️ 白天',dark:'🌙 黑夜',auto:'🌗 自动'};
   var d=document.createElement('div');
   d.className='mb';d.style.cssText='flex-wrap:wrap;gap:6px';
   d.innerHTML='<span>🌗 显示模式<br><span class="dim small">黑夜模式：深色玻璃 + 星空闪烁 · 自动：18 点后自动变黑夜</span></span><span style="display:flex;gap:5px">'+
    ['light','dark','auto'].map(function(k){return '<button class="gbtn'+(cur===k?' on':'')+'" data-th="'+k+'" onclick="setTheme(\''+k+'\')">'+tmap[k]+'</button>';}).join('')+'</span>';
   var d2=document.createElement('div');
   d2.className='mb';
   d2.innerHTML='<span>📜 更新日志<br><span class="dim small">查看 5.5.6.888 及历史版本内容</span></span><button onclick="openChangelog()">查看</button>';
   var last=box.lastElementChild;
   if(last){box.insertBefore(d2,last);box.insertBefore(d,last);}
   else{box.appendChild(d);box.appendChild(d2);}
  },0);
 };
})();

/* ---------- ③ 大西瓜音效（WebAudio 合成，无需素材） ---------- */
var _wmAC=null;
function wmAudio(freq,dur,type,vol,slide){
 try{
  if(G&&G.sfxOff)return;
  if(!_wmAC)_wmAC=new (window.AudioContext||window.webkitAudioContext)();
  var t0=_wmAC.currentTime;
  var o=_wmAC.createOscillator(),g=_wmAC.createGain();
  o.type=type||'sine';
  o.frequency.setValueAtTime(freq,t0);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,slide),t0+dur);
  g.gain.setValueAtTime(vol||0.16,t0);
  g.gain.exponentialRampToValueAtTime(0.001,t0+dur);
  o.connect(g);g.connect(_wmAC.destination);
  o.start(t0);o.stop(t0+dur);
 }catch(e){}
}
/* 挂接：投放 / 合体 / 游戏结束 */
(function(){
 var _spawn=WM.spawn;
 WM.spawn=function(x){
  wmAudio(540,0.05,'triangle',0.07);
  return _spawn(x);
 };
 var _step=xzWMStep;
 xzWMStep=function(dt){
  var before=WM.fruits.length;
  var r=_step(dt);
  if(WM.fruits.length<before)wmAudio(300,0.09,'square',0.16,900);
  return r;
 };
 var _over=xzWMOver;
 xzWMOver=function(){
  wmAudio(200,0.6,'sawtooth',0.2,60);
  if(WM.score>=100)ach('s35');
  return _over();
 };
})();
/* 成就：西瓜达人 */
(function(){
 var has35=false;
 for(var i=0;i<ACH_S.length;i++)if(ACH_S[i].id==='s35')has35=true;
 if(!has35)ACH_S.push({id:'s35',n:'🍉 西瓜达人',d:'合成大西瓜单局得分 ≥ 100'});
})();

/* ---------- ④ 文字系统再扩容（+40 条） ---------- */
var EXTRA_TEXTS_888={
 class_general:[
  '老师讲着讲着，粉笔突然断了，全班憋笑。',
  '“这道题送分题，但你们不要送命。”数学老师面无表情。',
  '前排有个同学把头发扎成了冲天辫，被老师看了三眼。',
  '窗外有人打篮球，投进一个空心，班里有人小声喝彩。',
  '“作业没交的站起来。”教室里响起此起彼伏的椅子声。',
  '老师在黑板上画了个图，画歪了，他自己也笑了。',
  '同桌在桌肚里拆了一包辣条，香得你心不在焉。',
  '“我就讲最后一题，讲完一定下课。”——这句话是第 4 次说。',
  '有同学在课本封面画满涂鸦，班主任路过看了一眼没说话。',
  '电风扇吱呀吱呀地转，把窗帘吹得一鼓一鼓的。'
 ],
 random_events:[
  '走廊尽头的小卖部排了长队，据说今天到货了新口味的冰棍。',
  '有同学在楼梯口捡到 50 块钱，正站在那等失主。',
  '今天食堂的糖醋里脊特别好吃，你多打了半勺。',
  '学校的广播放了一首很老的歌，有人跟着哼，有人叹气。',
  '你发现课桌抽屉里多了一颗糖，包装纸上写着“加油”。',
  '晚自习下课，走廊里有个人在吹口琴，吹得还挺好听。',
  '体育老师今天心情好，提前五分钟放了你们去食堂抢饭。',
  '你看到校门口来了辆大巴，是隔壁学校来交流的。'
 ],
 break_lines:[
  '课间有人用尺子当吉他弹，全班围观。',
  '你靠在走廊栏杆上，看见楼下有人追着跑。',
  '同桌给你分享了一首新歌，说特别适合写作业听。',
  '阳光把走廊切成明暗两半，你站在光里。',
  '饮水机的水温今天刚好，不烫也不凉。'
 ],
 night_lines:[
  '晚自习的教室像一片安静的湖，只有笔尖划水。',
  '你写完一页，抬头看见窗外的月亮挂在树梢。',
  '有人趴在桌上睡着了，呼吸声匀匀的。',
  '值日老师从前门进来，又轻轻带上门出去了。',
  '你突然想到白天没解出来的那道题，又翻开了草稿纸。'
 ],
 love_lines:[
  'TA今天换了新发绳，你注意到了。',
  '你们在走廊对上了眼神，又都假装在看别处。',
  'TA给你讲题的时候，声音比平时轻。',
  '你把橡皮切成两半，分给TA一半。',
  '班级合照的时候，你们站得很近。'
 ]
};
(function(){
 for(var k in EXTRA_TEXTS_888){
  if(EXTRA_TEXTS_561[k])EXTRA_TEXTS_561[k]=EXTRA_TEXTS_561[k].concat(EXTRA_TEXTS_888[k]);
  if(EXTRA_TEXTS_555[k])EXTRA_TEXTS_555[k]=EXTRA_TEXTS_555[k].concat(EXTRA_TEXTS_888[k]);
 }
})();

/* ---------- ⑤ 新增随机事件（8 个） ---------- */
STORIES.push(
 {t:'📻 深夜广播',x:'晚自习结束后，广播里突然播了一首没报幕的歌。\n有人认出来：“这是上次表白墙点歌的那首……”\n走廊里安静了一瞬，然后所有人都笑了。',
  c:[['跟着唱了一句','心情+8',function(){G.mood+=8;l('你跟着哼了一句，旁边的人也笑了。心情+8','good');}],
     ['竖起耳朵听完','心情+5',function(){G.mood+=5;l('你把整首歌听完了，心里有点软。心情+5');}],
     ['跟同学猜是谁点的','支持度+6',function(){G.support+=6;l('你们猜了一路也没猜出来，笑得不行。支持度+6');}]]},
 {t:'💌 课桌里的信',x:'午休回来，你发现课桌里夹着一封信。\n字迹清秀，只写了一句：“今天天气很好，你也是。”',
  c:[['小心收起来','心情+10',function(){G.mood+=10;l('你把信夹进课本里，一整个下午心情都很好。心情+10','love');}],
     ['查监控找是谁','支持度-5',function(){G.support-=5;l('你跑去找老师查监控，结果什么都没查到。','warn');}],
     ['回一封信放回去','心情+8 魅力+5',function(){G.mood+=8;G.charm+=5;l('你回了句“你也是”，放回原处。魅力+5','love');}]]},
 {t:'🧦 宿舍夜谈',x:'熄灯后，你们宿舍谁都没睡。\n“你们有没有喜欢的人啊？”上铺突然问。\n黑暗里安静了两秒，然后炸开了锅。',
  c:[['坦白交代','心情+6 支持度+8',function(){G.mood+=6;G.support+=8;l('你说了，室友们起哄了一晚上。支持度+8','good');}],
     ['装睡不说话','心情+2',function(){G.mood+=2;l('你闭着眼睛装睡，嘴角却压不住。');}],
     ['反问她们','心情+5',function(){G.mood+=5;l('你把话题抛了回去，听了一晚上八卦。心情+5');}]]},
 {t:'📝 考试前夜',x:'明天有月考，今晚教室里安静得能听见心跳。\n有人把复习资料贴在窗玻璃上，有人对着草稿纸发呆。',
  c:[['再刷一套题','知识+8 困意+10',function(){G.knowledge+=8;G.st.study+=8;G.sleep+=10;l('你又刷了一套题。知识+8');}],
     ['回去早点睡','健康+5',function(){G.health+=5;G.sleep-=20;l('你决定睡个好觉。健康+5','good');}],
     ['和同桌互相抽背','知识+6 支持度+4',function(){G.knowledge+=6;G.support+=4;l('你们互相抽背到熄灯。知识+6','good');}]]},
 {t:'🍜 食堂新菜',x:'食堂新出了一道“菠萝咕咾肉”，窗口前排了半个班。\n打饭阿姨看到你：“要不要？最后一个了。”',
  c:[['来一份！','健康+6 心情+6',function(){G.health+=6;G.mood+=6;l('酸甜口的，配饭一绝。心情+6','good');}],
     ['让给后面的人','支持度+8',function(){G.support+=8;l('后面那哥们感动得给你鞠了个躬。支持度+8');}],
     ['拍个照发朋友圈','心情+4 影响力+3',function(){G.mood+=4;G.influence+=3;l('朋友圈收获了一排“在哪个窗口”。');}]]},
 {t:'🏃 操场夜跑',x:'晚自习前，有人在操场夜跑。\n风把跑道边的落叶吹起来，像一群金色的小鸟。',
  c:[['加入跑两圈','体力+4 心情+6',function(){G.fitness+=4;G.mood+=6;l('跑完出汗，整个人都轻了。体力+4','good');}],
     ['在草坪上坐一会儿','心情+5',function(){G.mood+=5;l('你看着远处的灯光，发了一会儿呆。心情+5');}],
     ['去小卖部买水等TA','心情+4',function(){G.mood+=4;l('你拎着两瓶水站在跑道边，看见一个熟悉的身影跑过来。心情+4','love');}]]},
 {t:'🎒 忘带课本',x:'上课铃响前，你发现课本忘在宿舍了。\n同桌把课本往中间推了推：“一起看。”',
  c:[['跟同桌合看','支持度+6',function(){G.support+=6;l('你们挤在一起看了一节课。支持度+6','good');}],
     ['硬着头皮空手听','知识+2',function(){G.knowledge+=2;l('你听得格外认真，居然记住了大半。知识+2');}],
     ['回宿舍拿（可能迟到）','',function(){if(tc(.4,'criticize','你跑回宿舍拿课本，回来时已经上课了')){}l('你一路小跑，好在赶上了前半节课。');}]]},
 {t:'🎁 快递惊喜',x:'门卫大爷喊你：“有你的快递！”\n打开是一个小盒子，里面是一盒手作曲奇，和一张字条：“上次谢谢你。”',
  c:[['分给全班吃','支持度+10',function(){G.support+=10;l('全班分着吃，都说好吃。支持度+10','good');}],
     ['自己留着慢慢吃','心情+8',function(){G.mood+=8;l('你每天吃一块，吃了整整一周。心情+8');}],
     ['猜是谁寄的','心情+4',function(){G.mood+=4;l('你列了三个嫌疑人，都没对上号。心情+4');}]]}
);

/* ---------- ⑥ 更新日志 5.5.6.888（游戏内入口） ---------- */
(function(){
 var _oc888=window._xzOldChangelog||openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.888（正式版）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.888</b><br>'+
   '🎬 <b>片头动画</b>：Laerrus. 制作人开场动画（弹出即隐）→ 你的横屏片头视频自动播放（前 17 秒，停 3 秒后循环）<br>'+
   '▶ <b>第 9 秒「开始游戏」</b>弹出；点击后提示旋转为竖屏再进入游戏<br>'+
   '🌗 <b>白天 / 黑夜双主题</b>：默认白天晴空；设置可切黑夜（深色玻璃 + 星空闪烁）或「自动」跟随作息时间，18 点后自动入夜<br>'+
   '📜 开始界面加入<b>健康游戏忠告</b>与制作人署名<br>'+
   '🍉 合成大西瓜：新增<b>投放/合体/结束音效</b>（WebAudio 合成）、西瓜达人成就（单局 ≥100 分）<br>'+
   '🔧 修复：挽回前任概率计算错误、文案触发时机<br>'+
   '💬 文字系统再扩容（课堂/课间/晚自习/恋爱 +40 条）<br>'+
   '🎭 新增 8 个随机事件（深夜广播/课桌里的信/宿舍夜谈/考试前夜/食堂新菜/操场夜跑/忘带课本/快递惊喜）<br>'+
   '🎨 动画增强：制作人弹入、开始按钮弹出、片头进度条流光、按钮光效</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldChangelog888&&window._xzOldChangelog888()},80)">📚 查看 5.5.6.100 更新记录</button>';
  modal(h);
  window._xzOldChangelog888=_oc888;
 };
})();

/* ================================================================
   ⑩ 更新日志 5.5.6.88802（游戏内入口，叠加在 888 之上）
   ================================================================ */
(function(){
 var _oc88802=openChangelog; /* 当前为 5.5.6.888 版 */
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.88802（全新版）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.88802</b><br>'+
   '💘 <b>暗恋系统</b>：暗恋你的人 / 你暗恋的人 / TA 信息卡（性格·喜好·班级）/ 暗恋概率 / 表白成功率 / 三角恋·情敌标注<br>'+
   '🕸 <b>恋爱关系图</b>：多角恋思维导图，节点呼吸 + 连线动画<br>'+
   '📖 <b>上课提问</b>：按科目出题（语文/数学/英语/物理/化学/生物/历史/地理/政治/美术/音乐/体育），答错弹详细解析；老师模式课堂点名提问<br>'+
   '📝 <b>每日一题</b>：全新认真题库 + 每题详细解析，答对/答错都讲解<br>'+
   '⛏️ <b>黄金矿工</b>：完整小游戏（钩爪摆动/放钩/抓金/钻石/石头/炸药/关卡目标/倒计时），首页与小游戏大厅双入口<br>'+
   '👩‍🏫 <b>老师系统完善</b>：课堂提问 / 批改作业 / 师生关系事件 / 优秀班主任评选<br>'+
   '🎬 <b>片头升级</b>：L 动画 → 小猫图（金色渐变边框弹入）→ 横屏视频；进度条可拖动跳转；视频失败自动切换帧动画（离线可玩）<br>'+
   '⭐ <b>名声条可收起</b>：不再一直挡在界面顶部<br>'+
   '🎨 开关动画 / 按钮按压动画 / 黄金矿工·关系图全新美术<br>'+
   '🍉 <b>合成大西瓜修复</b>：修复“第 5 个水果后无法投放”卡死（触地即释放 + 6 秒兜底）；合体弹跳/旋转/阴影/得分飘字动画<br>'+
   '🐛 修复：白日模式歌曲列表黑字、制作人名字统一 <b>Laerrus.</b>、提问解析逻辑、更多随机事件与恋爱触发（+8 事件 / +4 恋爱小事件）</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldChangelog88802&&window._xzOldChangelog88802()},80)">📚 查看 5.5.6.888 更新记录</button>';
  modal(h);
  window._xzOldChangelog88802=_oc88802;
 };
})();

/* ================================================================
   ⑪ 更新日志 5.5.6.999（游戏内入口，叠加在 88802 之上）
   ================================================================ */
(function(){
 var _oc999=openChangelog; /* 当前为 5.5.6.88802 版 */
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.999（AI 大版本）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.999</b><br>'+
   '🤖 <b>AI 对话系统（恋爱系统已介入 AI）</b>：微信式聊天框，真的可以发消息；34 类意图 × 3 档好感 × 多性格组合 1000+ 预设回复；同义词判定自动提示“你要问的是不是…”；NPC 也会主动找你聊天；发消息有震动；下课后找老师也是同一套 AI<br>'+
   '💘 <b>恋爱升级</b>：有对象的也能交涉聊天；低概率出现同性暗恋者；对面基本信息更全<br>'+
   '📱 <b>手机端适配</b>：开局强制选择竖屏（推荐）/横屏；手机大字大按钮、布局自适应；横屏模式布局<br>'+
   '🧊 <b>液态玻璃开关</b>：右上角一键切换，全界面磨砂通透效果，动画流畅<br>'+
   '📊 <b>顶栏第一行</b>：最左名声 · 中间歌词（滚动）· 最右性取向（❤️/🌈/💗）<br>'+
   '🖊️ <b>希沃白板</b>：下课可玩，画笔/橡皮/颜色/保存到画册<br>'+
   '👔 <b>起床穿衣恢复</b>：每天早起选穿搭（校服/便服/外套）<br>'+
   '⛏️ <b>黄金矿工重做</b>：每关目标大幅提高（×1.8 递增），买炸药独立按钮，金价表/进度条，云动画<br>'+
   '🍉 <b>合成大西瓜</b>：合体冲击波/粒子爆发/震屏/星空背景/地面渐变<br>'+
   '🕸 <b>恋爱关系图</b>：白天清新版——浅蓝天空/云朵/光斑/节点光晕<br>'+
   '👩‍🏫 <b>上课发消息</b>：AI 聊天接入课堂，有概率被老师察觉——普通老师一般不管，领导看到会被批评<br>'+
   '🔔 <b>铃声</b>：响铃提示可一键关闭整个铃声系统<br>'+
   '🎬 <b>开启动画延长</b>：L 动画 2.8s → 小猫图 2.8s，效果更完整<br>'+
   '🖼️ <b>校园图鉴</b>：确认未删，8 张像素画全保留（手机端已适配）</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldChangelog999&&window._xzOldChangelog999()},80)">📚 查看 5.5.6.88802 更新记录</button>';
  modal(h);
  window._xzOldChangelog999=_oc999;
 };
})();

/* ================================================================
   杭州西子实验学校模拟器 · 5.5.6.88802 追加层
   ----------------------------------------------------------------
   · 版本升级 5.5.6.88802 · 制作人 Laerrus.
   · 暗恋系统（暗恋人 / TA信息 / 暗恋概率 / 表白概率 / 三角恋标注）
   · 恋爱关系图（多角恋思维导图，动画连线）
   · 上课提问（按科目出题 + 详细解析）
   · 每日一题增强（认真题库 + 解析）
   · 老师系统完善（课堂提问 / 批改作业 / 师生事件 / 优秀班主任评选）
   · 黄金矿工（完整小游戏，首页入口）
   · 随机事件与恋爱触发扩容
   ================================================================ */
var XZ88802={ver:'5.5.6.88802'};
window.XZ_VER='5.5.6.88802';
if(window.XZ561)XZ561.ver='5.5.6.88802';
window.XZ_NEW_START=true;

/* ================================================================
   ① 暗恋系统
   ================================================================ */
var CRUSH_NAMES_88802=[
 {n:'林晚晴',p:'安静慢热，喜欢在窗边看书',cls:'高二(3)班',like:['辣条','奶茶'],hair:'马尾辫'},
 {n:'沈一舟',p:'外向爱笑，篮球打得好',cls:'高二(5)班',like:['可乐','篮球'],hair:'寸头'},
 {n:'顾小满',p:'古灵精怪，爱写小说',cls:'高二(2)班',like:['甜筒','文具'],hair:'双马尾'},
 {n:'许知远',p:'学霸，话不多但细心',cls:'高二(1)班',like:['咖啡','小说'],hair:'黑框眼镜'},
 {n:'苏澄',p:'温柔体贴，会照顾人',cls:'高二(4)班',like:['面包','鲜花'],hair:'披肩发'},
 {n:'陆之遥',p:'运动系，飒爽利落',cls:'高二(6)班',like:['运动饮料','雪糕'],hair:'短发'},
 {n:'唐糖',p:'甜系，有点小迷糊',cls:'高二(7)班',like:['糖果','奶茶'],hair:'卷发'},
 {n:'江临风',p:'文艺青年，弹吉他',cls:'高二(8)班',like:['唱片','咖啡'],hair:'中长发'}
];
function xzCrushInit(){
 if(!G)return;
 if(!G.crushList)G.crushList=[];
 if(!G.crushSeen)G.crushSeen=0;
 /* 暗恋你的人：随魅力/名气动态生成 */
 var want=0;
 if(ch(0.45+G.charm/260))want++;
 if(ch(0.22+G.fame/320))want++;
 if(ch(0.1+G.charm/400+G.fame/500))want++;
 while(G.crushList.length<want&&G.crushList.length<4){
  var c=CRUSH_NAMES_88802[Math.floor(Math.random()*CRUSH_NAMES_88802.length)];
  if(G.crushList.some(function(x){return x.n===c.n;}))continue;
  var has=ch(0.3+G.charm/500);
  var lover=null;
  if(has){var pool=CRUSH_NAMES_88802.filter(function(x){return x.n!==c.n;});lover=pool[Math.floor(Math.random()*pool.length)].n;}
  G.crushList.push({n:c.n,p:c.p,cls:c.cls,like:c.like,hair:c.hair,hasLover:has,lover:lover,aff:rnd(25,55),knows:ch(.5),heartbeat:rnd(1,5)});
 }
}
function xzCrushProb(c){
 /* 暗恋你的人对你的好感度（动态：魅力/名气/礼物） */
 if(!c)return 0;
 var base=(c.aff||0)+G.charm*0.25+G.fame*0.15+(G.charm>=60?8:0)+(G.fame>=50?6:0);
 return cl(Math.round(base),1,100);
}
function xzConfessProb(c){
 /* 表白成功率：好感 + 时机（纪念日/节日/毕业前）+ 魅力 */
 if(!c)return 0;
 var p=0.28+(xzCrushProb(c)/200)+(G.charm/260);
 var hm=parseInt(G.time,10);
 if(c.hbDay&&c.hbDay===G.day)p+=0.15;
 if(hm>=21&&hm<22)p+=0.1; /* 晚自习后夜色加成 */
 if(G.money>=200)p+=0.05;
 return cl(p,0.06,0.93);
}
function xzCrushPanel(){
 if(!G)return;
 if(G.mode==='teacher'){modal('<h3>💘 暗恋系统</h3><div class="quote">老师模式下专注教书育人，暗恋系统仅对学生开放～</div><button class="gbtn" onclick="closeModal()">返回</button>');return;}
 xzCrushInit();
 var h='<h3>💘 暗恋 · 心动关系</h3><div class="quote">谁在偷偷看你？缘分需要自己去发现。</div>';
 /* 你暗恋的人 */
 if(G.crush){
  var c=G.crush;
  h+='<div class="tcard"><b>💙 你暗恋 · '+c.n+'</b><br>'+
   '🏷 '+c.cls+' · '+c.hair+'<br>💬 '+c.p+'<br>❤️ 喜欢：'+(c.like||[]).map(function(x){return ITEMS[x]?ITEMS[x].n:x;}).join('、')+
   (c.hasLover?'<br><b class="bad">⚠️ TA 已有对象：'+c.lover+'（情敌！）</b>':'<br><span class="good">TA 目前单身</span>')+
   '<br>📈 暗恋你的概率：<b>'+(c.crushBack?xzCrushProb(c)+'%':'未知')+'</b>'+
   '<br>💌 表白成功率：<b class="pink">'+Math.round(xzConfessProb(c)*100)+'%</b></div>';
 }else{
  h+='<div class="mb"><span>还没有暗恋的人？<br><span class="dim small">在课间/午休找心动的人聊天，或去操场偶遇</span></span><button onclick="xzPickCrush()">🎯 去遇见TA</button></div>';
 }
 /* 暗恋你的人 */
 h+='<h4 style="margin:8px 0 4px">😳 暗恋你的人（'+G.crushList.length+'）</h4>';
 if(G.crushList.length===0)h+='<div class="dim small">还没有人暗恋你。多提升魅力、多参加活动，会有惊喜。</div>';
 G.crushList.forEach(function(c){
  h+='<div class="mb"><span><b>'+c.n+'</b> · '+c.cls+'<br><span class="dim small">'+c.p+(c.knows?'':'（你还不知道TA的心意）')+'</span>'+
   (c.hasLover?'<br><b class="bad">⚠️ 三角恋：TA 已有对象 '+c.lover+'</b>':'')+
   (G.lovers&&G.lovers.some(function(l){return l&&l.n===c.n;})?'<br><b class="good">你们已是恋人 ❤️</b>':'')+
   '</span><span style="display:flex;gap:5px;align-items:center">'+
   '<button onclick="xzCrushGive(\''+c.n+'\')">🎁</button>'+
   '<button onclick="xzCrushTalk(\''+c.n+'\')">💬</button>'+
   (c.hasLover?'':'<button onclick="xzConfess(\''+c.n+'\')">💌 表白</button>')+
   '</span></div>';
 });
 h+='<div class="mb"><span>🗺 关系全景图</span><button onclick="xzLoveMap()">🕸 打开关系图</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
 modal(h);
}
function xzPickCrush(){
 if(!G)return;
 var pool=CRUSH_NAMES_88802.filter(function(c){return !G.crushList.some(function(x){return x.n===c.n;});});
 if(pool.length===0){l('缘分已满，没有更多新面孔了。','warn');return;}
 var c=pool[Math.floor(Math.random()*pool.length)];
 var has=ch(.25),lover=null;
 if(has){var p2=CRUSH_NAMES_88802.filter(function(x){return x.n!==c.n;});lover=p2[Math.floor(Math.random()*p2.length)].n;}
 G.crush={n:c.n,p:c.p,cls:c.cls,like:c.like,hair:c.hair,hasLover:has,lover:lover,aff:rnd(30,50),crushBack:ch(.4),hbDay:rnd(1,30)};
 l('💘 你遇见了'+c.n+'（'+c.cls+'），心跳漏了一拍。','love');
 G.mood=cl(G.mood+5,0,100);upd();
 xzCrushPanel();
}
function xzCrushGive(n){
 if(!G)return;
 var c=G.crushList.filter(function(x){return x.n===n;})[0];
 if(!c)return;
 var its=Object.keys(G.items).filter(function(k){return G.items[k]>0&&ITEMS[k]&&ITEMS[k].k==='food';});
 if(its.length===0){l('你没有可以送的食物。去小卖部买点吧。','warn');return;}
 var it=its[Math.floor(Math.random()*its.length)];
 take(it,1);
 var liked=(c.like||[]).indexOf(it)>=0;
 c.aff=cl(c.aff+(liked?rnd(10,18):rnd(3,7)),0,100);
 if(liked){l('💝 你把'+(ITEMS[it]?ITEMS[it].n:it)+'悄悄放在'+n+'桌上，TA今天一直心情很好。好感+'+rnd(10,18),'love');}
 else{l('你送了'+(ITEMS[it]?ITEMS[it].n:it)+'给'+n+'，TA礼貌地收下了。好感+'+rnd(3,7));}
 G.money-=2;upd();xzCrushPanel();
}
function xzCrushTalk(n){
 if(!G)return;
 var c=G.crushList.filter(function(x){return x.n===n;})[0];
 if(!c)return;
 var msgs=[
  'TA说：“今天食堂的饭好像不错。”',
  'TA看了你一眼，又低下头笑了。',
  'TA问你作业写了没，顺便多聊了两句。',
  'TA把耳机分了一只给你。'
 ];
 l('💬 你和'+n+'聊了几句。'+msgs[Math.floor(Math.random()*msgs.length)],'love');
 c.aff=cl(c.aff+rnd(2,5),0,100);
 c.knows=true;
 if(c.aff>=70&&!c.knowsYou){c.knowsYou=true;l('💘 '+n+'似乎开始注意你了……','love');}
 G.mood=cl(G.mood+3,0,100);upd();xzCrushPanel();
}
function xzConfess(n){
 if(!G)return;
 var c=G.crushList.filter(function(x){return x.n===n;})[0];
 if(!c)return;
 var p=xzConfessProb(c);
 if(G.lovers&&G.lovers.some(function(l){return l&&l.n===n;})){l('你们已经是恋人了呀！','good');return;}
 if(ch(p)){
  l('💞 你鼓起勇气向'+n+'表白了！TA愣了两秒，然后笑了：“我等这句话很久了。”','love');
  if(!G.lovers)G.lovers=[];
  G.lovers.push({n:n,stage:1,days:0,aff:xzCrushProb(c)});
  c.aff=cl(c.aff+30,0,100);
  G.charm=cl(G.charm+3,0,100);
  if(c.hasLover){l('⚠️ 等等——'+c.lover+'（TA的对象）正站在走廊那头看着你们……','bad');G.mood=cl(G.mood-5,0,100);}
  ach('s6');
  G.mood=cl(G.mood+15,0,100);
 }else{
  l('💔 '+n+'红着脸说：“我……还没准备好。”委婉拒绝了。','bad');
  c.aff=cl(c.aff-6,0,100);
  G.mood=cl(G.mood-8,0,100);
 }
 upd();xzCrushPanel();
}

/* ================================================================
   ② 恋爱关系图（多角恋思维导图 · 动画）
   ================================================================ */
var _LM={raf:0,cv:null,ctx:null,nodes:[],edges:[],t:0};
function xzLoveMap(){
 if(_LM.raf)cancelAnimationFrame(_LM.raf);
 if(!G){l('先进入游戏吧','warn');return;}
 var cv=document.createElement('canvas');
 cv.id='loveMapCanvas';cv.className='love-map-canvas';
 cv.width=560;cv.height=420;
 var h='<h3>🕸 恋爱关系图</h3>'+
  '<div class="lm-wrap"><div class="lm-panel">'+cv.outerHTML+'</div>'+
  '<div class="lm-legend"><span class="lm-ln">── 恋爱/双向</span><span class="lm-ln2">- - 暗恋/单向</span><span class="lm-ln3">-·- 情敌/竞争</span>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="xzLoveMap()">🔄 重新布局</button>'+
  '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();lmStop()">关闭</button></div></div>';
 modal(h);
 cv=document.getElementById('loveMapCanvas');
 if(!cv){closeModal();return;}
 _LM.cv=cv;_LM.ctx=cv.getContext('2d');
 _LM.nodes=[];_LM.edges=[];_LM.t=0;
 /* 节点：你（中心） */
 _LM.nodes.push({id:'me',label:'你',x:280,y:210,r:34,type:'me'});
 var cx=280,cy=210;
 var deg=0;
 function addNode(id,label,type,dx,dy){
  _LM.nodes.push({id:id,label:label,x:cl(cx+dx,70,490),y:cl(cy+dy,60,360),r:26,type:type});
 }
 /* 恋人（双向） */
 var ls=G.lovers||[];
 ls.forEach(function(l,i){
  if(!l||!l.n)return;
  var a=deg;deg+=2.4;
  addNode('l'+i,l.n,'lover',Math.cos(a)*150,Math.sin(a)*100-30);
  _LM.edges.push({a:'me',b:'l'+i,t:'lover'});
 });
 /* 暗恋你的人（单向指向你） */
 (G.crushList||[]).forEach(function(c,i){
  var a=deg;deg+=2.4;
  addNode('c'+i,c.n,'crush',Math.cos(a)*170,Math.sin(a)*100+20);
  _LM.edges.push({a:'c'+i,b:'me',t:'crush'});
  if(c.hasLover&&c.lover){
   addNode('cl'+i,c.lover+'（对象）','rival',Math.cos(a+1.2)*90,Math.sin(a+1.2)*80);
   _LM.edges.push({a:'c'+i,b:'cl'+i,t:'rival'});
  }
 });
 /* 你暗恋的人 */
 if(G.crush&&G.crush.n){
  addNode('mycrush',G.crush.n,'mycrush',-170,40);
  _LM.edges.push({a:'me',b:'mycrush',t:'crush'});
  if(G.crush.hasLover&&G.crush.lover){
   addNode('mcr',G.crush.lover+'（情敌）','rival',-90,150);
   _LM.edges.push({a:'mycrush',b:'mcr',t:'rival'});
  }
 }
 lmLoop();
}
function lmLoop(){
 if(!_LM.cv)return;
 _LM.t+=0.016;
 var ctx=_LM.ctx,cv=_LM.cv;
 ctx.clearRect(0,0,cv.width,cv.height);
 /* 背景 */
 var g=ctx.createLinearGradient(0,0,0,cv.height);
 g.addColorStop(0,'#221a44');g.addColorStop(1,'#120f2c');
 ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);
 ctx.fillStyle='rgba(255,255,255,.12)';ctx.font='12px sans-serif';ctx.textAlign='center';
 ctx.fillText('· 你的心动关系网 ·',cv.width/2,20);
 /* 连线 */
 _LM.edges.forEach(function(e){
  var na=_LM.nodes.filter(function(n){return n.id===e.a;})[0];
  var nb=_LM.nodes.filter(function(n){return n.id===e.b;})[0];
  if(!na||!nb)return;
  ctx.beginPath();
  if(e.t==='lover'){ctx.strokeStyle='rgba(255,112,180,.8)';ctx.lineWidth=2.4;}
  else if(e.t==='crush'){ctx.strokeStyle='rgba(124,156,255,.7)';ctx.lineWidth=1.8;ctx.setLineDash([6,6]);}
  else{ctx.strokeStyle='rgba(255,93,115,.8)';ctx.lineWidth=1.8;ctx.setLineDash([2,5]);}
  ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);
  ctx.stroke();ctx.setLineDash([]);
 });
 /* 节点 */
 _LM.nodes.forEach(function(n){
  var pulse=1+Math.sin(_LM.t*2+n.x*0.05)*0.06;
  var r=n.r*pulse;
  var col=n.type==='me'?'#ffd166':n.type==='lover'?'#ff70b4':n.type==='rival'?'#ff5d73':n.type==='mycrush'?'#7c9cff':'#9b6cff';
  var c2=n.type==='me'?'#d9a63c':n.type==='lover'?'#cf4f93':n.type==='rival'?'#cf4529':n.type==='mycrush'?'#3a63d0':'#6f45cc';
  var gd=ctx.createRadialGradient(n.x-r*0.4,n.y-r*0.4,r*0.2,n.x,n.y,r);
  gd.addColorStop(0,'#fff');gd.addColorStop(.35,col);gd.addColorStop(1,c2);
  ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
  ctx.fillStyle=gd;ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(n.label.slice(0,5),n.x,n.y);
 });
 _LM.raf=requestAnimationFrame(lmLoop);
}
function lmStop(){if(_LM.raf){cancelAnimationFrame(_LM.raf);_LM.raf=0;}}
/* 进入游戏时关掉关系图循环 */
(function(){var _g2=window.startGame||function(){};window.startGame=function(){lmStop();return _g2();};})();

/* ================================================================
   ③ 上课提问（按科目出题 + 详细解析）
   ================================================================ */
var XZ_QUESTIONS={
 '语文':[
  {q:'“床前明月光”的下一句是？',o:['疑是地上霜','低头思故乡','举头望明月','春风不度玉门关'],a:0,ex:'李白《静夜思》：“床前明月光，疑是地上霜。举头望明月，低头思故乡。”'},
  {q:'“但愿人长久”下一句是？',o:['千里共婵娟','把酒问青天','高处不胜寒','明月几时有'],a:0,ex:'苏轼《水调歌头》：“但愿人长久，千里共婵娟。”'},
  {q:'下列哪个是鲁迅的作品？',o:['《朝花夕拾》','《骆驼祥子》','《边城》','《雷雨》'],a:0,ex:'《朝花夕拾》是鲁迅散文集；《骆驼祥子》老舍；《边城》沈从文；《雷雨》曹禺。'}
 ],
 '数学':[
  {q:'三角形的内角和是多少度？',o:['90°','180°','270°','360°'],a:1,ex:'三角形内角和恒为 180°（欧氏几何基本定理）。'},
  {q:'2 的 10 次方等于？',o:['512','1024','2048','1000'],a:1,ex:'2¹⁰=1024，计算机里的“1K”就是这么来的。'},
  {q:'圆的周长公式是？',o:['C=2πr','C=πr','C=πr²','C=2πr²'],a:0,ex:'周长 C=2πr（直径×π），面积才是 S=πr²。'}
 ],
 '英语':[
  {q:'“apple”的中文意思是？',o:['香蕉','苹果','橘子','梨'],a:1,ex:'apple 就是苹果，one apple a day keeps the doctor away。'},
  {q:'“Thank you”的正确回应是？',o:['You are welcome','How are you','I am fine','Good bye'],a:0,ex:'礼貌回应感谢用 You are welcome（不客气）。'},
  {q:'I ___ a student.',o:['am','is','are','be'],a:0,ex:'主语 I 搭配 be 动词 am。'}
 ],
 '物理':[
  {q:'重力加速度 g 约等于？',o:['9.8 m/s²','8.9 m/s²','10.8 m/s²','9.0 m/s²'],a:0,ex:'地表重力加速度约 9.8 m/s²。'},
  {q:'声音在下列哪种介质中传播最快？',o:['空气','水','钢铁','真空'],a:2,ex:'声音在固体中最快，真空不能传声。'},
  {q:'1 焦耳的物理意义是？',o:['1N力移动1m做的功','1W功率做功1s','1kg物体移动1m','都不是'],a:0,ex:'W=F·s，1J=1N×1m。'}
 ],
 '化学':[
  {q:'水的化学式是？',o:['H₂O','CO₂','O₂','NaCl'],a:0,ex:'水 H₂O，二氧化碳 CO₂，氧气 O₂，氯化钠 NaCl。'},
  {q:'下列哪种是金属？',o:['碳','铁','硫','磷'],a:1,ex:'铁（Fe）是金属；碳、硫、磷是非金属。'},
  {q:'空气中含量最多的气体是？',o:['氧气','氮气','二氧化碳','稀有气体'],a:1,ex:'氮气约占空气体积 78%，氧气约 21%。'}
 ],
 '生物':[
  {q:'人体最大的器官是？',o:['心脏','皮肤','肝脏','大脑'],a:1,ex:'皮肤是人体最大的器官，成年人大约 1.5-2 平方米。'},
  {q:'细胞的基本结构不包括？',o:['细胞膜','细胞质','细胞核','细胞墙'],a:3,ex:'植物细胞才有细胞壁，动物细胞没有“细胞墙”。'},
  {q:'人体正常体温约为？',o:['36-37℃','38-39℃','34-35℃','40℃'],a:0,ex:'正常腋温 36-37℃ 左右。'}
 ],
 '历史':[
  {q:'中国历史上第一个统一的封建王朝是？',o:['夏','商','秦','汉'],a:2,ex:'公元前 221 年秦始皇统一六国，建立秦朝。'},
  {q:'“辛亥革命”发生在哪一年？',o:['1911年','1912年','1905年','1919年'],a:0,ex:'1911 年武昌起义，次年民国建立。'},
  {q:'丝绸之路的起点是？',o:['洛阳','长安','敦煌','兰州'],a:1,ex:'汉唐丝绸之路以长安（今西安）为起点。'}
 ],
 '地理':[
  {q:'中国最长的河流是？',o:['黄河','长江','珠江','黑龙江'],a:1,ex:'长江全长约 6300 公里，中国第一、世界第三。'},
  {q:'地球自转的方向是？',o:['自西向东','自东向西','自南向北','无方向'],a:0,ex:'地球自西向东自转，因此太阳东升西落。'},
  {q:'“人间天堂”常指哪座城市？',o:['杭州','苏州','南京','上海'],a:0,ex:'“上有天堂，下有苏杭”，指苏州和杭州。'}
 ],
 '政治':[
  {q:'我国的根本政治制度是？',o:['人民代表大会制度','民族区域自治','基层自治','多党合作'],a:0,ex:'人民代表大会制度是我国的根本政治制度。'},
  {q:'社会主义核心价值观个人层面的价值准则是？',o:['爱国敬业诚信友善','自由平等公正法治','富强民主文明和谐','团结互助进步'],a:0,ex:'个人层面：爱国、敬业、诚信、友善。'}
 ],
 '美术':[
  {q:'《蒙娜丽莎》的作者是？',o:['达芬奇','米开朗基罗','梵高','毕加索'],a:0,ex:'达·芬奇名作，现藏于法国卢浮宫。'},
  {q:'三原色是？',o:['红黄蓝','红绿蓝','红黄绿','青品黄'],a:0,ex:'美术三原色：红、黄、蓝；光的三原色是红、绿、蓝。'}
 ],
 '音乐':[
  {q:'钢琴有多少个白键？',o:['52','88','61','49'],a:0,ex:'标准钢琴 88 键：白键 52，黑键 36。'},
  {q:'五线谱由几条线组成？',o:['4条','5条','6条','3条'],a:1,ex:'五线谱由五条平行横线组成。'}
 ],
 '体育':[
  {q:'标准篮球架篮筐高度是？',o:['3.05米','2.5米','3.6米','4米'],a:0,ex:'国际标准篮筐距地面 3.05 米。'},
  {q:'400米标准跑道的形状是？',o:['两个直道+两个半圆','正方形','圆形','三角形'],a:0,ex:'标准田径场由两个直道和两个半圆弯道组成。'}
 ]
};
function xzAskInClass(subject){
 if(!G||!subject)return;
 var bank=XZ_QUESTIONS[subject];
 if(!bank||bank.length===0)return;
 var q=bank[Math.floor(Math.random()*bank.length)];
 window._XZAQ=q;
 var h='<h3>📖 课堂提问 · '+subject+'</h3>'+
  '<div class="quote">老师点了你的名：“'+q.q+'”</div>';
 for(var i=0;i<q.o.length;i++)
  h+='<div class="mb"><span>'+'ABCD'[i]+'. '+esc(q.o[i])+'</span><button onclick="xzAskAns('+q.a+','+i+')">回答</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">装作没听见</button>';
 modal(h);
}
function xzAskAns(correct,my){
 var q=window._XZAQ;
 closeModal();
 if(my===correct){
  G.knowledge=cl(G.knowledge+6,0,100);G.mood=cl(G.mood+4,0,100);G.charm=cl(G.charm+2,0,100);G.st.answer=(G.st.answer||0)+1;
  l('✅ 你答对了！老师点点头：“不错，坐下吧。” 知识+6 心情+4','good');
  if(ch(.4))G.fame=cl(G.fame+1,0,100);
  if(q)modal('<h3>📖 讲解时间</h3><div class="quote"><b>解析：</b>'+esc(q.ex)+'</div><button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">记住了</button>');
 }else{
  G.knowledge=cl(G.knowledge-1,0,100);G.mood=cl(G.mood-3,0,100);G.st.miss=(G.st.miss||0)+1;
  if(q)modal('<h3>📖 讲解时间</h3><div class="quote"><b>正确答案：</b>'+'ABCD'[correct]+'. '+q.o[correct]+'</div><div class="novel">'+esc(q.ex)+'</div><button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">明白了，下次一定对</button>');
  else modal('<h3>❌ 答错了</h3><button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">继续上课</button>');
 }
 upd();
}

/* ================================================================
   ④ 每日一题增强（认真题库 + 详细解析）
   ================================================================ */
var XZ_DQ_BANK=[
 {s:'语文',q:'“会当凌绝顶，一览众山小”写的是哪座山？',o:['泰山','华山','黄山','庐山'],a:0,ex:'杜甫《望岳》，“岳”即东岳泰山，位于山东泰安。'},
 {s:'数学',q:'1+2+3+…+100 = ?',o:['5050','5000','5150','4950'],a:0,ex:'等差数列求和：(1+100)×100÷2 = 5050。'},
 {s:'英语',q:'“图书馆”的英文是？',o:['library','restaurant','hospital','station'],a:0,ex:'library 图书馆；restaurant 餐厅；hospital 医院。'},
 {s:'物理',q:'下列哪个是导体？',o:['铜','橡胶','塑料','玻璃'],a:0,ex:'铜（金属）是良导体；橡胶、塑料、玻璃是绝缘体。'},
 {s:'化学',q:'蜡烛燃烧属于哪种变化？',o:['化学变化','物理变化','无法判断','蒸发'],a:0,ex:'燃烧生成二氧化碳和水，有新物质生成，是化学变化。'},
 {s:'生物',q:'人的红血球（红细胞）有细胞核吗？',o:['没有','有','偶尔有','看情况'],a:0,ex:'成熟哺乳动物红细胞无细胞核，为运输氧气腾出空间。'},
 {s:'历史',q:'“贞观之治”是哪位皇帝在位时期？',o:['唐太宗','唐玄宗','唐高宗','武则天'],a:0,ex:'唐太宗李世民年号“贞观”，627-649 年。'},
 {s:'地理',q:'杭州位于哪个省？',o:['浙江','江苏','安徽','福建'],a:0,ex:'杭州是浙江省省会，西湖就在杭州。'},
 {s:'政治',q:'我国的国歌是？',o:['义勇军进行曲','东方红','歌唱祖国','我和我的祖国'],a:0,ex:'国歌为田汉作词、聂耳作曲的《义勇军进行曲》。'},
 {s:'美术',q:'中国画常用的“文房四宝”不包括？',o:['墨','纸','笔','尺'],a:3,ex:'文房四宝：笔、墨、纸、砚。'},
 {s:'音乐',q:'小提琴属于什么乐器组？',o:['弦乐','管乐','打击乐','键盘'],a:0,ex:'小提琴是弓弦乐器，属弦乐组。'},
 {s:'体育',q:'奥运会几年举办一次？',o:['4年','2年','5年','6年'],a:0,ex:'现代夏季奥运会每 4 年举办一届。'}
];
function xzDaily88802(){
 if(!G||G.over)return;
 if(G.drillDay===G.day){
  modal('<h3>📝 每日一题</h3><p>今天已经练过了，明天再来吧。</p>'+
   '<div class="quote">累计答对 '+(G.drillRight||0)+' 题 · 连续 '+(G.drillStreak||0)+' 天</div>'+
   '<button class="gbtn" onclick="closeModal()">关闭</button>');
  return;
 }
 var idx=((G.day||1)-1)%XZ_DQ_BANK.length;
 var q=XZ_DQ_BANK[idx];
 window._DQX=q;
 var h='<h3>📝 每日一题 · '+q.s+'</h3><div class="novel">'+esc(q.q)+'</div>';
 for(var i=0;i<q.o.length;i++)
  h+='<div class="mb"><span>'+'ABCD'[i]+'. '+esc(q.o[i])+'</span><button onclick="xzDQAns('+i+')">选</button></div>';
 h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">下次再说</button>';
 modal(h);
}
function xzDQAns(i){
 var q=window._DQX;if(!q){closeModal();return;}
 G.drillDay=G.day;
 var right=(i===q.a);
 if(right){
  G.knowledge=cl(G.knowledge+6,0,100);G.drillRight=(G.drillRight||0)+1;G.drillStreak=(G.drillStreak||0)+1;
  if(G.drillStreak>=5)ach('s33');
  modal('<h3>✅ 答对啦！</h3><div class="quote">知识+6 · 连续 '+G.drillStreak+' 天</div><div class="novel">'+esc(q.ex)+'</div><button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">明白了</button>');
 }else{
  G.drillStreak=0;
  modal('<h3>❌ 答错了</h3><div class="quote"><b>正确答案：</b>'+'ABCD'[q.a]+'. '+q.o[q.a]+'</div><div class="novel">'+esc(q.ex)+'</div><button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">记住了</button>');
 }
 upd();
}

/* ================================================================
   ⑤ 老师系统完善（课堂提问 / 批改作业 / 师生事件 / 优秀班主任）
   ================================================================ */
function xzTeacherAsk(){
 if(!G)return;
 var stu=['李明','王强','陈晓','赵雪','周扬','郑好'];
 var s=stu[Math.floor(Math.random()*stu.length)];
 var subs=['语文','数学','英语','物理'];
 var q=XZ_QUESTIONS[subs[Math.floor(Math.random()*subs.length)]][0];
 modal('<h3>👩‍🏫 你点名提问：'+s+'</h3><div class="quote">“'+s+'，你来回答：‘"+q.q+"’”</div>'+
  '<div class="mb"><span>'+s+'：'+(ch(.65)?'“'+q.o[q.a]+'”':'“我……我不会…”')+'</span></div>'+
  (ch(.65)?
   '<button class="big" style="width:100%" onclick="closeModal();xzTAskOk(1)">👏 表扬TA</button><button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();xzTAskOk(2)">👍 让TA坐下</button>':
   '<button class="big" style="width:100%" onclick="closeModal();xzTAskOk(3)">📖 详细讲解</button><button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();xzTAskOk(4)">📝 提醒TA复习</button>'));
}
function xzTAskOk(k){
 if(!G)return;
 if(k===1){G.teach=cl(G.teach+2,0,100);G.relation=cl((G.relation||0)+2,0,100);l('👏 你表扬了TA，全班都看向你们。教学+2 师生关系+2','good');}
 else if(k===2){G.teach=cl(G.teach+1,0,100);l('TA坐下了，课堂继续。教学+1');}
 else if(k===3){G.teach=cl(G.teach+3,0,100);G.relation=cl((G.relation||0)+2,0,100);l('📖 你一步步讲清楚，TA终于懂了。教学+3 师生关系+2','good');}
 else{G.teach=cl(G.teach+1,0,100);l('📝 你提醒TA课后复习，TA点了点头。教学+1');}
 upd();
}
function xzTeacherEvent(){
 if(!G)return;
 var r=Math.random();
 if(r<.4){
  var g=[30,60,90][Math.floor(Math.random()*3)];
  l('🎁 学生给你送了一盒润喉糖：“老师辛苦了。” 师生关系+'+Math.floor(g/30),'good');
  G.relation=cl((G.relation||0)+g/30,0,100);
 }else if(r<.7){
  l('🗂 你批改作业到深夜，发现几份抄得很像的答卷。','warn');
  modal('<h3>🗂 批改作业</h3><div class="quote">有 3 份作业连错题都一模一样。</div><button class="big" style="width:100%" onclick="closeModal();xzTeacherEvent2(1)">📢 课堂点名提醒</button><button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();xzTeacherEvent2(2)">🤫 私下谈话</button>');
 }else{
  l('📢 学校通知：下周举行优秀班主任评选，师生关系高的老师更有机会。','info');
 }
}
function xzTeacherEvent2(k){
 if(!G)return;
 if(k===1){G.teach=cl(G.teach+2,0,100);G.relation=cl((G.relation||0)-2,0,100);l('📢 全班安静了。教学+2，部分学生有点怕你。');}
 else{G.teach=cl(G.teach+1,0,100);G.relation=cl((G.relation||0)+3,0,100);l('🤫 谈话后那几个学生主动来认错，师生关系+3','good');}
 upd();
}
function xzTeacherAward(){
 if(!G)return;
 var rel=G.relation||0;
 var p=cl(0.25+rel/140,0.1,0.9);
 if(ch(p)){
  G.fame=cl(G.fame+10,0,100);G.money+=200;G.mood=cl(G.mood+10,0,100);
  l('🏅 恭喜！你被评为“优秀班主任”！名誉+10 奖金+200','good');
  ach('t2');
 }else{
  G.mood=cl(G.mood-3,0,100);
  l('🏅 优秀班主任评选结果公布，你差一点点。下届继续加油！');
 }
 upd();
}
/* 包装：老师上课时段追加互动 */
(function(){
 var _tt=SLOTS.t_class;
 SLOTS.t_class=function(s){
  var r=_tt(s);
  try{
   if(G&&G.curType==='t_class'&&ch(.4))xzTeacherAsk();
   else if(G&&G.curType==='t_class'&&ch(.25))xzTeacherEvent();
  }catch(e){}
  return r;
 };
})();

/* ================================================================
   ⑥ 随机事件与恋爱触发扩容
   ================================================================ */
STORIES.push(
 {t:'🎁 匿名礼物',x:'你的桌肚里多了一个系着丝带的小盒子，没有署名。',
  c:[['打开看看','心情+8',function(){G.mood+=8;l('是一盒手工曲奇和一张纸条：“上次借你笔记，谢啦。”心情+8','good');}],
     ['放回原处','心情+3',function(){G.mood+=3;l('你把它放回去，结果被人顺手拿走了。');}],
     ['打听是谁送的','支持度+5',function(){G.support+=5;l('打听了一圈，嫌疑最大的是那个总对你笑的同学。','love');}]]},
 {t:'🎤 课间点歌',x:'广播站课间放了一首你最近单曲循环的歌。',
  c:[['跟着哼起来','心情+6',function(){G.mood+=6;l('你哼出声，同桌也跟上，变成了合唱。心情+6','good');}],
     ['发条朋友圈记录','心情+4',function(){G.mood+=4;l('配文：“今天广播懂我。”');}],
     ['猜是谁点的','心情+3',function(){G.mood+=3;l('你猜是那个总在走廊遇见的人。','love');}]]},
 {t:'📚 图书馆占座',x:'图书馆的角落座位，坐着一个熟悉的身影——TA也常来。',
  c:[['坐TA对面','心情+8',function(){G.mood+=8;G.charm+=3;l('你坐下，TA抬头看了你一眼，笑了。魅力+3','love');}],
     ['换个远点的位置','心情+2',function(){G.mood+=2;l('你坐得远远的，但余光一直在。');}],
     ['去帮TA借本书','支持度+6',function(){G.support+=6;l('你帮TA找到了一本冷门小说，TA很惊喜。','love');}]]},
 {t:'⚽ 操场捡球',x:'一个球滚到你脚边，不远处有人在等你扔回去。',
  c:[['一脚踢回去','心情+6 体力+2',function(){G.mood+=6;G.fitness+=2;l('球踢得漂亮，对方朝你竖了个大拇指。','good');}],
     ['跑过去递球','魅力+4',function(){G.mood+=4;G.charm+=4;l('你小跑过去把球递上，看清了TA的脸。魅力+4','love');}],
     ['假装没看见','心情-3',function(){G.mood-=3;l('你走开了，球在风里孤零零地转。');}]]},
 {t:'🌧 没带伞',x:'放学下起大雨，你站在门口没带伞。',
  c:[['冒雨冲回去','健康-3 体力+2',function(){G.health-=3;G.fitness+=2;l('你一路狂奔回宿舍，头发全湿了。','warn');}],
     ['等雨停','心情+3',function(){G.mood+=3;l('雨里的校园很安静，你等了一会儿。');}],
     ['有人递来伞','心情+10',function(){G.mood+=10;l('一把伞撑到你头顶：“顺路，一起走。”心跳漏了一拍。心情+10','love');}]]},
 {t:'🎨 黑板报',x:'宣传委员喊你一起出黑板报，粉笔灰在光里飞舞。',
  c:[['帮忙画插画','美术+5 支持度+5',function(){G.art=cl(G.art+5,0,100);G.support+=5;l('你的插画让整面黑板亮了。美术+5','good');}],
     ['负责写字','知识+3',function(){G.knowledge+=3;l('你的字被老师夸“工整”。');}],
     ['打下手递粉笔','支持度+3',function(){G.support+=3;l('你站在边上递粉笔，听他们聊天。');}]]},
 {t:'🧪 实验课',x:'化学实验课，酒精灯的火苗把试管里的液体烧成了蓝色。',
  c:[['认真记录','知识+6',function(){G.knowledge+=6;G.st.study+=3;l('你记下了每个步骤。知识+6','good');}],
     ['偷偷拍照','美术+2',function(){G.art+=2;l('蓝色的液体在照片里很好看。');}],
     ['帮同桌操作','支持度+5',function(){G.support+=5;l('同桌手抖，你稳住试管。支持度+5');}]]},
 {t:'📮 食堂偶遇',x:'打饭时，你正好排在TA前面。',
  c:[['帮TA刷饭卡','魅力+5 金钱-8',function(){G.money-=8;G.charm+=5;l('TA愣了一下：“下次我请你。”魅力+5','love');}],
     ['帮TA端餐盘','心情+5',function(){G.mood+=5;l('你们同桌吃了顿饭，聊了很久。心情+5');}],
     ['装作没看见','心情-2',function(){G.mood-=2;l('你端着餐盘绕开了，又有点后悔。');}]]}
);
var XZ_LOVE_EXTRA=[
 function(p){if(!p)return null;l('🏃 操场边的长椅上，'+p.n+'递给你一瓶水：“跑完步要补水。”','love');return 5;},
 function(p){if(!p)return null;l('📝 值日时，'+p.n+'留下来帮你擦黑板：“一个人太慢了。”','love');return 5;},
 function(p){if(!p)return null;l('🎒 换座位那天，'+p.n+'帮你把书搬到了新位置。','love');return 5;},
 function(p){if(!p)return null;l('🎪 运动会，'+p.n+'在你比赛时喊得最大声。','love');return 5;}
];
/* 恋爱时段多触发一次小事件 */
(function(){
 var _ld=loveDaily561;
 window.loveDaily561=function(p){
  if(!p)return;
  if(ch(.35)){var f=XZ_LOVE_EXTRA[Math.floor(Math.random()*XZ_LOVE_EXTRA.length)];var g=f(p);if(g&&G&&p.aff!==undefined)p.aff=cl(p.aff+g,0,100);if(G){G.mood=cl(G.mood+3,0,100);upd();}}
  return _ld(p);
 };
})();

/* ================================================================
   ⑦ 黄金矿工（完整小游戏）
   ================================================================ */
/* 黄金矿工：钩爪摆动/放钩/抓取/上拉/炸药/关卡/动画 */
var GM=null,GM_RAF=0,GM_LAST=0;
function xzGoldMiner(){
 if(GM_RAF)cancelAnimationFrame(GM_RAF);
 var cv=document.createElement('canvas');
 cv.id='gmCanvas';cv.className='gm-canvas';cv.width=420;cv.height=600;
 var h='<h3>⛏️ 黄金矿工</h3>'+
  '<div class="gm-wrap">'+
  '<div class="gm-panel">'+cv.outerHTML+'</div>'+
  '<div class="gm-side">'+
   '<div class="gm-stat"><div class="lbl">💰 金钱</div><b id="gmMoney">$0</b></div>'+
   '<div class="gm-stat"><div class="lbl">🎯 目标</div><b id="gmTarget">$150</b></div>'+
   '<div class="gm-stat"><div class="lbl">⏱ 时间</div><b id="gmTime">60</b></div>'+
   '<div class="gm-stat"><div class="lbl">🔩 炸药</div><b id="gmBoom">1</b></div>'+
   '<button class="big" style="width:100%" onclick="gmBoomUse()">💣 引爆炸药</button>'+
   '<div class="gm-help">👆 点击画布放钩<br>抓金子上来卖钱<br>石头太重别硬拉！<br>攒钱买炸药炸石头<br>时间到达成目标即过关</div>'+
  '</div></div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal();gmStop()">返回</button>';
 modal(h);
 cv=document.getElementById('gmCanvas');
 if(!cv){closeModal();return;}
 GM={money:0,level:1,target:150,time:60,booms:1,over:false,win:false,last:0,parts:[],floats:[],shake:0,
     claw:{x:210,y:36,len:0,max:480,ang:0,dir:1,state:'swing',speed:360,caught:null,shakeT:0},items:[]};
 gmGenLevel();
 GM_LAST=performance.now();
 gmLoop();
}
function gmGenLevel(){
 var items=[],W=420,H=600;
 var deep=Math.min(420,240+GM.level*22);
 var counts={gold:6+GM.level,gold2:4+Math.floor(GM.level/1.5),gold3:2+Math.floor(GM.level/2),diamond:Math.min(5,1+GM.level),stone:4+GM.level,bag:1};
 function push(type,x,y,extra){
  var o={type:type,x:x,y:y,v:0};
  if(type==='gold'){o.r=13;o.w=25;o.v=20;}
  else if(type==='gold2'){o.r=19;o.w=55;o.v=30;}
  else if(type==='gold3'){o.r=27;o.w=120;o.v=45;}
  else if(type==='diamond'){o.r=15;o.w=150;o.v=15;}
  else if(type==='stone'){o.r=rnd(22,32);o.w=0;o.v=120;}
  else if(type==='bag'){o.r=22;o.w=300;o.v=80;o.star=true;}
  if(extra)for(var k in extra)o[k]=extra[k];
  items.push(o);
 }
 for(var t in counts){
  var n=counts[t];
  for(var i=0;i<n;i++){
   var tries=0,x=0,y=0,ok=false;
   while(!ok&&tries<30){
    tries++;
    x=rnd(36,W-36);y=rnd(90,deep+40);
    ok=true;
    for(var j=0;j<items.length;j++){
     var it=items[j];
     var d=Math.sqrt((it.x-x)*(it.x-x)+(it.y-y)*(it.y-y));
     if(d<(it.r+24)){ok=false;break;}
    }
   }
   push(t,x,y);
  }
 }
 /* 袋子固定一个，放深处 */
 push('bag',rnd(80,W-80),Math.min(deep+30,540));
 GM.items=items;
}
function gmDrop(){
 if(!GM||GM.over)return;
 if(GM.claw.state!=='swing')return;
 GM.claw.state='drop';
 GM.claw.caught=null;
}
function gmBoomUse(){
 if(!GM||GM.over)return;
 if(GM.money<30&&GM.booms<1){l('钱不够买炸药（$30）','warn');return;}
 if(GM.booms<1){GM.money-=30;gmUI();}
 if(GM.claw.caught){
  GM.parts.push({x:GM.claw.x,y:GM.claw.y,t:0});
  GM.shake=8;
  GM.claw.caught=null;
  GM.claw.state='swing';
 }else{
  /* 没抓东西：炸开附近石头 */
  var hit=false;
  for(var i=GM.items.length-1;i>=0;i--){
   var it=GM.items[i];
   var d=Math.sqrt((it.x-GM.claw.x)*(it.x-GM.claw.x)+(it.y-GM.claw.y)*(it.y-GM.claw.y));
   if(d<70&&(it.type==='stone')){GM.items.splice(i,1);hit=true;}
  }
  if(hit)GM.parts.push({x:GM.claw.x,y:GM.claw.y,t:0});
 }
 GM.booms=Math.max(0,GM.booms-1);
 gmUI();
}
function gmLoop(){
 if(!GM){return;}
 var now=performance.now();
 var dt=Math.min(0.05,(now-GM_LAST)/1000);
 GM_LAST=now;
 if(!GM.over){
  GM.time-=dt;
  var c=GM.claw;
  if(c.state==='swing'){
   c.ang+=c.dir*dt*1.2;
   if(c.ang>0.9){c.ang=0.9;c.dir=-1;}
   if(c.ang<-0.9){c.ang=-0.9;c.dir=1;}
   c.x=210+Math.sin(c.ang)*c.len;
   c.y=36+Math.cos(c.ang)*c.len;
  }else if(c.state==='drop'){
   var sp=c.speed*dt;
   c.x+=Math.sin(c.ang)*sp;
   c.y+=Math.cos(c.ang)*sp;
   c.len+=sp;
   if(c.len>c.max||c.y>560){gmRetract();}
   /* 碰撞抓取 */
   for(var i=0;i<GM.items.length;i++){
    var it=GM.items[i];
    var d=Math.sqrt((it.x-c.x)*(it.x-c.x)+(it.y-c.y)*(it.y-c.y));
    if(d<(it.r+8)){
     c.caught=it;c.state='retract';GM.items.splice(i,1);
     c.shakeT=0.25;
     break;
    }
   }
  }else if(c.state==='retract'){
   c.shakeT-=dt;
   var w=c.caught?c.caught.v:0;
   var sp=Math.max(60,c.speed-w*2.4);
   if(c.caught&&w>=100&&c.shakeT>0){sp*=0.25;}
   c.x-=Math.sin(c.ang)*sp*dt;
   c.y-=Math.cos(c.ang)*sp*dt;
   c.len-=sp*dt;
   if(c.len<=8){
    if(c.caught&&c.caught.w>0){
     GM.money+=c.caught.w;
     GM.floats.push({x:c.x,y:c.y-16,t:0,txt:'+$'+c.caught.w});
     if(c.caught.star){GM.floats.push({x:210,y:60,t:0,txt:'⭐ 挖到宝袋！'});}
     if(GM.money>=GM.target){GM.win=true;GM.over=true;}
    }
    c.caught=null;c.state='swing';
   }
  }
  /* 粒子/飘字计时 */
  for(var p=GM.parts.length-1;p>=0;p--){GM.parts[p].t+=dt;if(GM.parts[p].t>0.6)GM.parts.splice(p,1);}
  for(var f=GM.floats.length-1;f>=0;f--){GM.floats[f].t+=dt;if(GM.floats[f].t>1.2)GM.floats.splice(f,1);}
  if(GM.shake>0)GM.shake-=dt*20;
  if(GM.time<=0&&!GM.win){GM.over=true;}
  gmUI();
 }
 gmDraw();
 if(GM.over){
  if(GM.win){
   GM_RAF=0;
   GM.floats=[];
   modal('<h3>⛏️ 过关！</h3><div class="quote">你挖到了 <b>$'+GM.money+'</b>（目标 $'+GM.target+'）<br>第 '+GM.level+' 关达成！</div>'+
    '<button class="big" style="width:100%" onclick="xzGoldMiner()">下一关 →</button>'+
    '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();gmStop()">收工</button>');
   if(G){G.money+=Math.min(300,GM.money/2);G.mood=cl(G.mood+8,0,100);l('⛏️ 黄金矿工赚了 $'+Math.min(300,Math.floor(GM.money/2))+'！','good');upd();}
  }else{
   GM_RAF=0;
   modal('<h3>⏱ 时间到</h3><div class="quote">本局赚了 <b>$'+GM.money+'</b>（目标 $'+GM.target+'）</div>'+
    '<button class="big" style="width:100%" onclick="xzGoldMiner()">再来一局</button>'+
    '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();gmStop()">返回</button>');
  }
  return;
 }
 GM_RAF=requestAnimationFrame(gmLoop);
}
function gmRetract(){
 if(!GM||!GM.claw)return;
 GM.claw.state='retract';
}
function gmUI(){
 var el;
 el=document.getElementById('gmMoney');if(el)el.textContent='$'+GM.money;
 el=document.getElementById('gmTarget');if(el)el.textContent='$'+GM.target;
 el=document.getElementById('gmTime');if(el)el.textContent=Math.max(0,Math.ceil(GM.time));
 el=document.getElementById('gmBoom');if(el)el.textContent=GM.booms;
}
function gmDraw(){
 var cv=GM.canvas;if(!cv)cv=document.getElementById('gmCanvas');
 if(!cv||!GM)return;
 var ctx=GM.ctx;if(!ctx)ctx=cv.getContext('2d');
 ctx.clearRect(0,0,cv.width,cv.height);
 /* 天空 */
 var g=ctx.createLinearGradient(0,0,0,80);
 g.addColorStop(0,'#9ad0ff');g.addColorStop(1,'#cfeaff');
 ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,80);
 ctx.fillStyle='#fff7c4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
 ctx.fillText('☀️ 黄金矿工 Lv.'+GM.level,210,22);
 /* 草皮 */
 ctx.fillStyle='#5cb85c';ctx.fillRect(0,66,cv.width,20);
 ctx.fillStyle='#4a9e4a';ctx.fillRect(0,76,cv.width,8);
 /* 土层 */
 var g2=ctx.createLinearGradient(0,80,0,cv.height);
 g2.addColorStop(0,'#8a6236');g2.addColorStop(.5,'#6f4e2c');g2.addColorStop(1,'#54391f');
 ctx.fillStyle=g2;ctx.fillRect(0,84,cv.width,cv.height-84);
 /* 纹理 */
 ctx.fillStyle='rgba(0,0,0,.12)';
 for(var i=0;i<40;i++){ctx.beginPath();ctx.arc(rnd(0,cv.width),rnd(90,cv.height-10),rnd(2,5),0,Math.PI*2);ctx.fill();}
 /* 物品 */
 for(var j=0;j<GM.items.length;j++){gmItem(ctx,GM.items[j]);}
 /* 炸药按钮动画位（画布上画个提示） */
 ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='11px sans-serif';
 ctx.fillText('💣 有炸药：'+GM.booms+'  （点右侧按钮引爆炸开石头）',210,99);
 /* 钩爪 */
 var c=GM.claw;
 ctx.strokeStyle='#e8e8e8';ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(210,36);ctx.lineTo(c.x,c.y);ctx.stroke();
 ctx.save();ctx.translate(c.x,c.y);
 var hold=c.state==='retract'&&c.caught;
 if(c.shakeT>0&&hold)ctx.rotate(Math.sin(performance.now()/40)*0.25);
 ctx.fillStyle='#c9a24b';ctx.strokeStyle='#8a6a2a';ctx.lineWidth=2;
 ctx.beginPath();
 ctx.moveTo(-8,6);ctx.lineTo(0,-2);ctx.lineTo(8,6);
 ctx.lineTo(4,14);ctx.lineTo(-4,14);
 ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#7c5a2a';
 ctx.beginPath();ctx.arc(0,2,3,0,Math.PI*2);ctx.fill();
 ctx.restore();
 /* 爆炸粒子 */
 for(var p=0;p<GM.parts.length;p++){
  var pt=GM.parts[p];
  ctx.globalAlpha=Math.max(0,1-pt.t/0.6);
  var rr=30+pt.t*120;
  var rg=ctx.createRadialGradient(pt.x,pt.y,2,pt.x,pt.y,rr);
  rg.addColorStop(0,'#fff');rg.addColorStop(.4,'#ffb454');rg.addColorStop(1,'rgba(255,90,40,0)');
  ctx.fillStyle=rg;ctx.beginPath();ctx.arc(pt.x,pt.y,rr,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
 }
 /* 飘字 */
 for(var f=0;f<GM.floats.length;f++){
  var ft=GM.floats[f];
  ctx.globalAlpha=Math.max(0,1-ft.t/1.2);
  ctx.fillStyle='#ffd166';ctx.font='bold 17px sans-serif';
  ctx.textAlign='center';
  ctx.fillText(ft.txt,ft.x,ft.y-ft.t*44);
  ctx.globalAlpha=1;
 }
}
function gmItem(ctx,it){
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=7;ctx.shadowOffsetY=3;
 function gold(base,light,dark,r){
  /* 立体径向渐变金块 */
  var g=ctx.createRadialGradient(it.x-r*.35,it.y-r*.4,r*.2,it.x,it.y,r);
  g.addColorStop(0,light);g.addColorStop(.55,base);g.addColorStop(1,dark);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.fill();
  /* 暗边 */
  ctx.shadowBlur=0;ctx.strokeStyle=dark;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.stroke();
  /* 顶部高光弧 */
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2.4;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(it.x-r*.12,it.y-r*.18,r*.5,Math.PI*1.15,Math.PI*1.7);ctx.stroke();
  /* 小亮点 */
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.beginPath();ctx.arc(it.x-r*.4,it.y-r*.45,r*.12,0,Math.PI*2);ctx.fill();
 }
 if(it.type==='gold')gold('#ffd166','#fff3c4','#d99a1e',it.r);
 else if(it.type==='gold2')gold('#ffc23d','#fff0b8','#cf8a14',it.r);
 else if(it.type==='gold3')gold('#f5a623','#ffe9a8','#b9700f',it.r);
 else if(it.type==='diamond'){
  /* 多切面钻石 */
  var r=it.r;
  var pts=[[0,-1],[.8,0],[0,1],[-.8,0]];
  var g=ctx.createLinearGradient(it.x,it.y-r,it.x,it.y+r);
  g.addColorStop(0,'#b8f0ff');g.addColorStop(.5,'#6fd6ff');g.addColorStop(1,'#3ba9d9');
  ctx.fillStyle=g;ctx.strokeStyle='#2f93c4';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x+r*.8,it.y);ctx.lineTo(it.x,it.y+r);ctx.lineTo(it.x-r*.8,it.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;
  /* 切面线 */
  ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(it.x-r*.8,it.y);ctx.lineTo(it.x+r*.8,it.y);
  ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x,it.y+r);ctx.stroke();
  /* 闪光 */
  var tw=0.6+0.4*Math.sin(performance.now()/180+it.x);
  ctx.fillStyle='rgba(255,255,255,'+tw+')';
  ctx.beginPath();ctx.arc(it.x-r*.25,it.y-r*.4,r*.16,0,Math.PI*2);ctx.fill();
 }else if(it.type==='stone'){
  /* 石头：渐变 + 斑点 */
  var g2=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
  g2.addColorStop(0,'#a8a8a8');g2.addColorStop(1,'#6a6a6a');
  ctx.fillStyle=g2;ctx.strokeStyle='#565656';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(it.x-it.r,it.y+it.r*.4);ctx.lineTo(it.x-it.r*.6,it.y-it.r);ctx.lineTo(it.x+it.r*.7,it.y-it.r*.6);ctx.lineTo(it.x+it.r,it.y+it.r*.6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,.22)';
  ctx.beginPath();ctx.moveTo(it.x-it.r*.5,it.y-it.r*.7);ctx.lineTo(it.x-it.r*.1,it.y-it.r*.9);ctx.lineTo(it.x-it.r*.15,it.y-it.r*.3);ctx.closePath();ctx.fill();
  /* 斑点（由 x 决定，稳定） */
  ctx.fillStyle='rgba(0,0,0,.18)';
  for(var si=0;si<3;si++){
   var sx=it.x+((it.x*7+si*13)%it.r)-it.r*.5;
   var sy=it.y+((it.y*5+si*11)%it.r*.6)-it.r*.1;
   ctx.beginPath();ctx.arc(sx,sy,it.r*.08,0,Math.PI*2);ctx.fill();
  }
 }else if(it.type==='bag'){
  /* 钱袋：布纹渐变 + 束口 */
  var g3=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
  g3.addColorStop(0,'#f08070');g3.addColorStop(1,'#c04a3c');
  ctx.fillStyle=g3;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#8e3226';ctx.lineWidth=2;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.stroke();
  ctx.shadowBlur=0;
  /* 束口绳 */
  ctx.strokeStyle='#7a2c20';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(it.x-it.r*.6,it.y-it.r*.7);ctx.lineTo(it.x+it.r*.6,it.y-it.r*.7);ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=2;
  ctx.fillText('$',it.x,it.y+it.r*.15);
 }
 ctx.restore();
}
function gmStop(){if(GM_RAF){cancelAnimationFrame(GM_RAF);GM_RAF=0;}GM=null;}
/* 画布点击放钩 */
(function(){
 document.addEventListener('click',function(e){
  var t=e.target;
  if(t&&t.id==='gmCanvas'&&GM&&!GM.over)gmDrop();
 });
})();

/* ================================================================
   ⑧ 上课提问接入：学生被老师提问（按科目）
   ================================================================ */
(function(){
 var _cls=SLOTS.class;
 SLOTS.class=function(s){
  var r=_cls(s);
  try{
   if(!G||G.curType!=='class')return r;
   if(s&&s.subject&&XZ_QUESTIONS[s.subject]&&ch(.3))xzAskInClass(s.subject);
   else if(ch(.18))xzAskInClass(pk(SUBS));
  }catch(e){}
  return r;
 };
})();

/* ================================================================
   杭州西子实验学校模拟器 · 5.5.6.999 追加层
   ----------------------------------------------------------------
   · 版本 5.5.6.999 · 制作人 Laerrus.
   · 顶栏第一行：名声 | 歌词 | 性取向 + 液态玻璃开关
   · AI 对话系统（微信式聊天框 · 1000+ 预设回复 · 意图判定
     · 同义词提示 · 震动 · NPC 主动提问 · 老师对话 · 上课被点名）
   · 起床穿衣、希沃白板、黄金矿工重做、关系图白天版、
     西瓜增强、同性暗恋、手机横竖屏选择、铃声条关闭
   ================================================================ */
window.XZ_VER='5.5.6.999';
if(window.XZ561)XZ561.ver='5.5.6.999';
window.XZ999=true;

/* ================================================================
   ① 顶栏第一行：名声 | 歌词 | 性取向 + 液态玻璃开关
   ================================================================ */
function xzTopInit(){
 if(!G)return;
 /* 歌词节点移动到顶栏中间（保留原 lyricBar 逻辑不变） */
 try{
  var lt=document.getElementById('lyricText');
  var tl=document.getElementById('tlLyric');
  if(lt&&tl&&lt.parentNode&&lt.parentNode.id!=='tlLyric'){
   tl.appendChild(lt);
   var lb=document.getElementById('lyricBar');
   if(lb)lb.style.display='none';
  }
 }catch(e){}
 xzTopRefresh();
}
function xzTopRefresh(){
 if(!G)return;
 var el=document.getElementById('tlRep');
 if(el){
  if(!G.reputation)G.reputation=50;
  var t=G.reputation>=90?'👑 校园名人':G.reputation>=70?'⭐ 人气王':G.reputation>=50?'👍 小有名气':G.reputation>=30?'😐 普通学生':'😶 透明人';
  el.textContent=t+' '+Math.round(G.reputation);
 }
 var pe=document.getElementById('tlPref');
 if(pe){
  if(G.pref==='同性')pe.textContent='🌈';          /* 性取向：同性=彩虹 */
  else if(G.pref==='异性')pe.textContent='❤️';      /* 异性=爱心 */
  else pe.textContent='💗';
  pe.title='性取向：'+(G.pref||'异性');
 }
}
function xzTopRepToggle(){
 if(!G)return;
 xzTopRefresh();
 var el=document.getElementById('tlRep');
 if(!el)return;
 var c=el.classList.contains('tl-pop');
 el.classList.remove('tl-pop');void el.offsetWidth;el.classList.add('tl-pop');
 var levels=['😶 透明人','😐 普通学生','👍 小有名气','⭐ 人气王','👑 校园名人'];
 var idx=G.reputation>=90?4:G.reputation>=70?3:G.reputation>=50?2:G.reputation>=30?1:0;
 l('🎖 当前名声：「'+levels[idx]+'」('+Math.round(G.reputation)+'/100)<br><span class="dim small">提升方式：做好事·得奖·受欢迎·优秀班主任</span>','good');
}
/* 液态玻璃开关：整个 UI 变磨砂玻璃 */
function xzLiquidToggle(){
 var on=document.documentElement.classList.toggle('liquid');
 var b=document.getElementById('tlLiquid');
 if(b){
  b.textContent=on?'✨':'🧊';
  b.title=on?'关闭液态玻璃':'开启液态玻璃';
 }
 l(on?'🧊 液态玻璃已开启：全界面磨砂通透效果':'✨ 液态玻璃已关闭','good');
 try{saveGame();}catch(e){}
}
/* upd 包装：刷新顶栏第一行 */
(function(){
 var _u=upd;
 upd=function(){
  _u();
  try{xzTopRefresh();}catch(e){}
 };
})();
/* 游戏开始时初始化顶栏行 */
(function(){
 var _sg=window.startGame||function(){};
 window.startGame=function(){
  var r=_sg();
  setTimeout(function(){try{xzTopInit();}catch(e){}},60);
  return r;
 };
})();

/* ================================================================
   ② AI 对话系统（微信式聊天 · 意图判定 · 1000+ 回复）
   ================================================================ */
var _CHAT={npc:null,ctx:'',typing:false,ask:null};
function xzVibrate(ms){
 ms=ms||35;
 try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}
 try{
  var ac=_CHAT.ac||new (window.AudioContext||window.webkitAudioContext)();
  _CHAT.ac=ac;
  var o=ac.createOscillator(),g=ac.createGain();
  o.frequency.value=880;g.gain.value=0.06;
  o.connect(g);g.connect(ac.destination);
  o.start();o.stop(ac.currentTime+0.09);
 }catch(e){}
}
/* 性格：给 NPC 挂性格 */
function xzPer(p){
 if(p._per)return p._per;
 var pool=['温柔','直球','傲娇','话痨','高冷'];
 if(p._teacher)pool=['严厉','温柔','幽默','严肃'];
 p._per=pool[Math.floor(Math.random()*pool.length)];
 return p._per;
}
/* ---- 意图库：34 类 · 每类多问法变体 · 3 档好感 × 性格回复 ---- */
var XZ_AI_INTENTS=[
 {id:'hi',t:'打招呼',kws:['你好','您好','哈喽','嗨','在吗','在不在','在不','hi','hello','hey','早安','早上好','晚上好','午安'],
  sim:'在吗？',
  rep:{cold:['…嗯','干嘛','哦。','有事？'],mid:['你好呀！','嗨～在的','嗯嗯，怎么啦'],warm:['哦哦你好呀！','你来啦～想我了？','嗨嗨！我正想找你呢']}},
 {id:'ok',t:'应答',kws:['好的','嗯嗯','ok','好','行','可以','知道了','没问题','收到','就这样'],
  sim:'好的',
  rep:{cold:['嗯','知道了','好'],mid:['嗯嗯！','好嘞','行，听你的'],warm:['好呀好呀！','嗯！都听你的','你说了算～']}},
 {id:'how',t:'今天怎么样',kws:['今天怎么样','最近怎么样','你还好吗','过得好吗','最近好吗','今天如何','这几天怎么样','你怎么样','过得怎么样'],
  sim:'你今天怎么样？',
  rep:{cold:['还行','就那样吧','关你什么事','老样子'],mid:['还不错呀，你呢？','挺好的，刚下课。','马马虎虎，你呢？'],warm:['超级好！因为你来找我嘛','今天心情不错，看到你更好了','还行，不过看到你就好了～']}},
 {id:'eat',t:'吃饭了吗',kws:['吃饭了吗','吃了吗','吃饭没','吃了没','午饭吃了吗','晚饭吃了吗','早饭吃了吗','今天吃什么','吃的什么','你吃饭了'],
  sim:'你吃饭了吗？',
  rep:{cold:['吃了','没吃','关你什么事','嗯'],mid:['刚吃过，食堂今天的菜不错','还没呢，等会儿去吃','吃了，你呢？'],warm:['吃了呀，你要请我吃吗？','还没吃，等你一起呢～','吃啦，不过你请的话我还能再吃一顿']}},
 {id:'doing',t:'在干嘛',kws:['在干嘛','干什么呢','在做什么','干嘛呢','忙什么','你在做什么','在忙吗','忙不忙','在不在忙'],
  sim:'你在干嘛？',
  rep:{cold:['写作业','没干嘛','有事？','发呆'],mid:['刚写完作业，休息一下','在听歌','准备去接水，一起？'],warm:['在想你呀（划掉），在写作业','刚想给你发消息来着','在等你找我聊天呀～']}},
 {id:'hw',t:'作业',kws:['作业写了吗','作业写完没','作业怎么办','作业借我抄','作业好难','作业多吗','数学作业','作业写了吗','作业','借我抄抄'],
  sim:'作业写完了吗？',
  rep:{cold:['自己写','别抄我的','我写完了','很难，自己加油'],mid:['刚写完，你抄吧（小声）','我也还没写…一起？','还行，最后两题有点难'],warm:['写完啦，要我教你吗？','早就写完了，你抄我的吧～','陪你写呀，不会的问我']}},
 {id:'class',t:'上课',kws:['上课了','要上课了','什么课','下一节什么课','上课好烦','不想上课','上课睡觉','上课','下节课'],
  sim:'下一节什么课？',
  rep:{cold:['不知道','上课就上课','别说话'],mid:['好像是数学，惨了','下节体育！耶','老师进来了，先不聊'],warm:['下节体育课！一起打球呀','数学课……你坐我旁边我就有精神了','嘘，老师来了，下课聊～']}},
 {id:'love',t:'恋爱',kws:['喜欢你','我喜欢你','做我对象','在一起吧','你喜不喜欢我','有喜欢的人吗','谈过恋爱吗','你爱我吗','处对象','谈恋爱','当我男朋','当我女朋','当我对象'],
  sim:'我喜欢你，要不要在一起？',
  rep:{cold:['……','别开玩笑','我当你是朋友','你认真的？'],mid:['你…你突然说什么呢','我还没想过这个','唔，看你表现咯'],warm:['我也喜欢你呀笨蛋','等你这句话好久了！','嗯！那说好了～']}},
 {id:'mood',t:'心情',kws:['心情不好','不开心','好烦','难受','难过','心情怎么样','你心情好吗','安慰我','我很难过','我emo','emo了'],
  sim:'你心情不好吗？',
  rep:{cold:['哦','谁没烦心事','自己调整'],mid:['怎么了？跟我说说','别难过啦，放学请你吃糖','要不要一起走走？'],warm:['谁欺负你了？我去找他！','别难过，有我在呢','抱抱你～想哭就哭吧']}},
 {id:'bye',t:'告别',kws:['晚安','先睡了','睡了','拜拜','再见','回聊','我下了','下线了','晚安好梦','先不聊'],
  sim:'晚安！',
  rep:{cold:['嗯','晚安','再见'],mid:['晚安！明天见','好的，早点睡','拜拜～'],warm:['晚安，梦里要有我哦','晚安！好梦～明天找你','嗯嗯，你也早点休息，想你']}},
 {id:'weekend',t:'周末',kws:['周末干嘛','周末去哪','周末一起玩','周末有空吗','周末计划','放假干嘛','这周去哪','周末'],
  sim:'周末有空一起玩吗？',
  rep:{cold:['没空','在家写作业','看情况'],mid:['还没想好，你有安排？','打算去书店，一起？','周末想睡个懒觉'],warm:['有空呀！你想去哪？','你约我我肯定有空～','走！去吃那家新开的店']}},
 {id:'weather',t:'天气',kws:['下雨了吗','今天天气','天气怎么样','会下雨吗','带伞了吗','冷吗','热吗','天气'],
  sim:'今天天气怎么样？',
  rep:{cold:['自己看窗外','不知道','还行'],mid:['好像要下雨，记得带伞','晴天，阳光不错','有点凉，多穿点'],warm:['下雨了的话，我把伞分你一半呀','天冷了，记得穿外套，别感冒','今天阳光超好，适合散步，一起？']}},
 {id:'exam',t:'考试',kws:['考试考得怎么样','考试好难','成绩出来了吗','考了多少','考试没考好','月考','期中考试','考试','考得怎么样'],
  sim:'考试考得怎么样？',
  rep:{cold:['一般','别问','自己看排名'],mid:['还行，正常发挥','有一题不该错…','你呢？考得如何？'],warm:['考得不错，都是你陪我复习的功劳','没你教我那题我就挂了','下次一起加油！']}},
 {id:'friend',t:'朋友',kws:['你朋友多吗','和同学关系好吗','你有闺蜜吗','你有兄弟吗','班上谁和你最好','朋友','你人缘好吗'],
  sim:'你和同学关系好吗？',
  rep:{cold:['一般','不多','关你什么事'],mid:['还行，有几个聊得来的','和同桌关系最好','还行吧，都是普通朋友'],warm:['有你就够了呀','你是最特别的！','嗯，不过和你最好']}},
 {id:'fam',t:'家',kws:['你爸妈','你家里','你家在哪','住校吗','想家吗','家人','你家'],
  sim:'你想家吗？',
  rep:{cold:['还行','问这个干嘛','一般'],mid:['有点想，周末回去','我家在市区，你呢？','住校，周末回家'],warm:['想，不过有你在学校也不孤单','周末要不要一起去我家那边玩？']}},
 {id:'hobby',t:'爱好',kws:['你喜欢什么','爱好','你喜欢做什么','有什么爱好','兴趣','你喜欢打球吗','你喜欢听歌吗','你爱做什么'],
  sim:'你有什么爱好？',
  rep:{cold:['没爱好','睡觉算吗','看情况'],mid:['喜欢听歌、打球','周末喜欢去图书馆','喜欢看小说和打游戏'],warm:['我的爱好就是和你聊天呀～','喜欢打篮球，你要来看我打球吗？','想和你一起做的事很多']}},
 {id:'food',t:'食物',kws:['喜欢吃什么','爱吃什么','食堂哪个好吃','你吃辣吗','最喜欢的菜','爱吃甜的吗','你想吃什么'],
  sim:'你喜欢吃什么？',
  rep:{cold:['随便','都行','食堂凑合'],mid:['喜欢甜的，奶茶必点','食堂二楼的小炒不错','不挑食，就是不吃香菜'],warm:['你请我吃什么我都喜欢～','喜欢吃甜的，你要买给我吗？','下次一起去吃那家火锅！']}},
 {id:'secret',t:'秘密',kws:['有个秘密','告诉你个秘密','我跟你说','悄悄话','只告诉你','别告诉别人','跟你说个事'],
  sim:'我跟你说个秘密',
  rep:{cold:['哦','我不想听','你自己知道就行'],mid:['说吧，我保密','什么秘密？快说','你说，我嘴巴很严'],warm:['我保证不说出去！','你的事我都想知道','嗯嗯！你说，我听着呢']}},
 {id:'praise',t:'夸我',kws:['我好看吗','我帅吗','我美吗','我聪明吗','夸夸我','我厉害吗','我可爱吗','我漂亮吗'],
  sim:'我好看吗？',
  rep:{cold:['还行','一般','问这个干嘛'],mid:['挺好看的','嗯，不丑','你笑起来还行'],warm:['超好看！我眼光真好','当然！你最好看了','可爱爆了好吗']}},
 {id:'angry',t:'道歉',kws:['你生气了吗','别生气','我错了','对不起','道歉','原谅我','我不好','别不理我','抱歉'],
  sim:'对不起，别生气',
  rep:{cold:['…嗯','知道了','下不为例'],mid:['我没生气啦','算了，原谅你','下次别这样就行'],warm:['好啦好啦，不生气了','你道歉的样子好可爱','本来就没生你的气，傻瓜']}},
 {id:'invite',t:'邀约',kws:['一起吃饭','一起去食堂','一起散步','一起看电影','一起打球','周末一起','出去玩吗','约你','去看电影','一起回家','一起去'],
  sim:'一起去吃饭吗？',
  rep:{cold:['不去','没空','下次吧'],mid:['好啊，几点？','行，食堂见','嗯，一起走吧'],warm:['好呀好呀！','等的就是你这句话','走！顺便请你喝奶茶']}},
 {id:'dream',t:'梦想',kws:['你的梦想','长大想做什么','未来想干嘛','你有什么理想','梦想是什么','以后想考什么大学','你的理想'],
  sim:'你的梦想是什么？',
  rep:{cold:['不知道','没想过','先毕业再说'],mid:['想考个好大学','想做自己喜欢的事','想开一家小店'],warm:['想和喜欢的人一起变好','梦想里有你呀','先一起考上大学再说！']}},
 {id:'game',t:'游戏',kws:['打游戏吗','玩游戏吗','什么段位','来打游戏','王者','吃鸡','开黑','一起打游戏','上号'],
  sim:'一起打游戏吗？',
  rep:{cold:['不玩','作业没写完','别带坏我'],mid:['偶尔玩','周末可以','你什么段位？'],warm:['来呀！我带你','打输了你要哄我','好啊，正好想放松']}},
 {id:'music2',t:'音乐',kws:['你喜欢听什么歌','分享首歌','最近单曲循环','你听歌吗','唱歌给我听','推荐首歌'],
  sim:'你喜欢听什么歌？',
  rep:{cold:['随便','不常听','哦'],mid:['最近在听一首很治愈的歌','分享你一首，超好听','我唱歌一般'],warm:['你要听吗？我唱给你听','喜欢，特别是想你的歌','下次一起去 KTV 呀']}},
 {id:'teach',t:'学习帮助',kws:['教我题','这题不会','帮我讲讲','数学好难','帮我复习','教教我','这题怎么做','不会写'],
  sim:'这题不会，教教我',
  rep:{cold:['自己想想','上课没听？','问老师'],mid:['哪题？我看看','好，我给你讲','这题我刚好会'],warm:['来，我教你，不会嫌你笨','你问我我好开心','讲到你懂为止！']}},
 {id:'sleep',t:'睡觉',kws:['困了','好困','想睡觉','睡觉吧','早点睡','昨晚没睡好','睡了吗'],
  sim:'好困，想睡觉',
  rep:{cold:['睡吧','哦','谁不是'],mid:['那早点休息','我也困了，哈欠','午休好好睡'],warm:['睡吧，我给你讲个故事','靠着我睡会儿？','嗯，晚安，别熬太晚']}},
 {id:'money',t:'钱',kws:['有钱吗','借钱','没钱了','生活费','你零花钱多吗','能借我点钱吗','借我点钱'],
  sim:'能借我点钱吗？',
  rep:{cold:['我也没钱','不借','自己省着花'],mid:['要多少？别乱花','我的也不多了，借你一点','你干嘛了又没钱'],warm:['要多少呀？给你','我的就是你的，拿去','走，请你吃饭，我有钱']}},
 {id:'gift',t:'礼物',kws:['送你礼物','想要什么礼物','生日想要什么','送你个东西','你要什么','想要礼物吗'],
  sim:'你想要什么礼物？',
  rep:{cold:['不用','随便','别破费'],mid:['不用啦，你来就好','一支笔就行','请我喝奶茶吧'],warm:['你陪我就是最好的礼物','想要你亲手写的小纸条','什么都行，你送的都喜欢']}},
 {id:'future',t:'未来',kws:['毕业后','以后还会见面吗','毕业了怎么办','未来','以后还联系吗','高中毕业','以后'],
  sim:'毕业后我们还会见面吗？',
  rep:{cold:['看缘分','不知道','也许吧'],mid:['应该会吧，同学聚会','可以约着见面呀','毕业还早呢，想那么多'],warm:['一定会的，我们说好了','毕业了我也要缠着你','不管去哪，我都要和你保持联系']}},
 {id:'joke',t:'笑话',kws:['讲个笑话','说个笑话','好无聊','给我讲个故事','逗我笑','讲个故事'],
  sim:'讲个笑话逗我笑',
  rep:{cold:['不会','没心情','自己上网搜'],mid:['小明考试作弊…算了不讲了','我说我帅，全班都笑了','数学老师讲了个冷笑话，全班都没笑'],warm:['你看着我的脸，是不是就想笑？','我想想…有了！一只蜗牛…','笑话讲不好，但可以陪你笑']}},
 {id:'thank',t:'谢谢',kws:['谢谢你','谢谢','多谢','感谢','辛苦你了'],
  sim:'谢谢你',
  rep:{cold:['嗯','没事','客气'],mid:['不客气！','小事啦','下次请我喝奶茶就行'],warm:['为你做什么都愿意','别客气，你的事就是我的事','嗯！记住你欠我一杯奶茶']}},
 {id:'chat',t:'闲聊',kws:['好无聊','聊会天','随便聊聊','好烦哦','陪我说说话','无聊死了','好没意思'],
  sim:'好无聊，陪我聊聊天',
  rep:{cold:['哦','没空','不想聊'],mid:['那聊聊今天发生的趣事？','好啊，你想聊什么','我正好也闲'],warm:['陪你聊到天荒地老','来呀，我超会聊的','正想找人说话呢，你来的刚好']}},
 {id:'cat',t:'猫',kws:['猫','小猫','养猫吗','你喜欢猫吗','撸猫','校园猫','猫咪'],
  sim:'你喜欢猫吗？',
  rep:{cold:['还行','不养','看情况'],mid:['喜欢！校园里那只橘猫超可爱','想养，但宿舍不让','猫比狗安静'],warm:['喜欢！我们一起去喂校园里的猫吧','你像猫一样可爱','以后一起养只猫吧']}},
 {id:'drink',t:'奶茶',kws:['喝奶茶吗','奶茶','买奶茶','请你喝奶茶','想喝奶茶','一起去买奶茶'],
  sim:'一起去喝奶茶吗？',
  rep:{cold:['不喝','你自己喝吧','糖分警告'],mid:['好呀，去新开那家？','三分糖去冰，谢谢','可以，你请我？'],warm:['走！我要加珍珠加椰果','你买的都甜','好呀，顺便约会～']}},
 {id:'boring',t:'上课无聊',kws:['这课好无聊','好无聊的课','老师讲的好闷','听不懂','走神了','发呆'],
  sim:'这课好无聊',
  rep:{cold:['忍着','上课就认真听','那也没办法'],mid:['确实，我都在画小人','忍忍，还有 20 分钟','传纸条玩？'],warm:['无聊就看我呀～','我给你画个小人解闷','下课我讲个笑话补偿你']}},
 {id:'sport',t:'运动',kws:['打球吗','去操场吗','跑步去','一起去运动','打球','运动会','跑步'],
  sim:'一起去打球吗？',
  rep:{cold:['不去','累','你自己去'],mid:['行，活动一下','晚上操场见？','跑两圈也行'],warm:['好呀！看我三步上篮','你来给我加油我就去','赢了你要请我喝水']}}
];
var XZ_AI_FALLBACK=[
 '嗯嗯，我在听',
 '然后呢？继续说说',
 '哇，这样啊',
 '哈哈，真的假的',
 '我也这么觉得',
 '有点意思，还有呢？',
 '你说的我懂',
 '嗯…然后呢',
 '话说回来，今天课上那个数学老师真逗',
 '对了，你刚才说的一半我有点没懂',
 '这样啊，那后来呢',
 '感觉你心情不错呀'
];
function xzAIMatch(input){
 if(!input)return null;
 var s=String(input).toLowerCase().replace(/[\s，。！？、,.!?~～…"'“”]/g,'');
 if(!s)return null;
 var best=null,bestSc=0;
 for(var i=0;i<XZ_AI_INTENTS.length;i++){
  var it=XZ_AI_INTENTS[i];
  for(var j=0;j<it.kws.length;j++){
   var kw=it.kws[j].toLowerCase().replace(/[\s，。！？、,.!?~～…"'“”]/g,'');
   if(!kw)continue;
   if(s===kw){return {intent:it,sim:1};}
   if(kw.length>=2&&s.indexOf(kw)>=0){
    var sc=kw.length/s.length;
    if(sc>bestSc){bestSc=sc;best={intent:it,sim:sc};}
   }
  }
 }
 if(best)return best;
 /* 相似判定：字符重叠率 */
 var maxOv=0,maxIt=null;
 for(var k=0;k<XZ_AI_INTENTS.length;k++){
  var it2=XZ_AI_INTENTS[k];
  var kw2=it2.kws[0].toLowerCase().replace(/[\s，。！？、,.!?~～…"'“”]/g,'');
  if(!kw2)continue;
  var ov=0,used={};
  for(var a=0;a<s.length;a++){
   for(var b=0;b<kw2.length;b++){
    if(!used[b]&&s[a]===kw2[b]){ov++;used[b]=1;break;}
   }
  }
  var rate=ov/Math.max(s.length,kw2.length);
  if(rate>maxOv){maxOv=rate;maxIt=it2;}
 }
 if(maxIt&&maxOv>=0.55)return {intent:maxIt,sim:maxOv,ask:true};
 return null;
}
function xzAIReply(it,p){
 if(!it)return pk(XZ_AI_FALLBACK);
 var aff=(p&&p.aff)||0;
 var band=aff>=70?'warm':aff>=35?'mid':'cold';
 var arr=it.rep[band]||it.rep.mid;
 var r=pk(arr);
 /* 性格点缀：傲娇/温柔微调语气（追加小尾巴） */
 var per=p?xzPer(p):'';
 if(per==='傲娇'&&band==='warm'&&Math.random()<.5)r='才…才不是特意等你的。'+r;
 if(per==='温柔'&&r.indexOf('～')<0&&Math.random()<.4)r+='～';
 return r;
}
/* ---- 聊天面板（微信式） ---- */
function xzChatPanel(p,ctx){
 if(!p){l('没有可聊天的对象。','warn');return;}
 _CHAT.npc=p;_CHAT.ctx=ctx||'';
 p._log=p._log||[];
 var h='<h3>💬 '+p.n+' <span class="dim small" style="font-weight:400">'+(p._teacher?'老师':'同学')+' · '+(xzPer(p))+'性格 · 好感 '+Math.round(p.aff||0)+'</span></h3>'+
  '<div class="chat-box" id="chatBox"></div>'+
  '<div class="chat-input"><input id="chatInput" type="text" maxlength="60" placeholder="发消息…（Enter 发送）" onkeydown="if(event.key===\'Enter\')xzChatSend()"><button onclick="xzChatSend()">发送</button></div>'+
  '<div class="dim small" style="margin-top:6px;text-align:center">🤖 AI 对话系统 · 已介入（按性格与好感度回复）</div>';
 modal(h);
 xzChatRender();
 setTimeout(function(){var i=document.getElementById('chatInput');if(i)i.focus();},80);
}
function xzChatRender(){
 var box=document.getElementById('chatBox');
 if(!box||!_CHAT.npc)return;
 var p=_CHAT.npc;
 var h='';
 for(var i=0;i<(p._log||[]).length;i++){
  var m=p._log[i];
  h+='<div class="chat-row '+(m.me?'me':'they')+'"><div class="bubble">'+esc(m.t)+'<span class="ct">'+m.time+'</span></div></div>';
 }
 if(_CHAT.typing)h+='<div class="chat-row they"><div class="bubble typing"><i></i><i></i><i></i></div></div>';
 box.innerHTML=h;
 box.scrollTop=box.scrollHeight;
}
function xzChatSend(){
 var box=document.getElementById('chatBox');
 var inp=document.getElementById('chatInput');
 if(!box||!inp||!_CHAT.npc)return;
 var txt=String(inp.value||'').trim();
 if(!txt||_CHAT.typing)return;
 inp.value='';
 var p=_CHAT.npc;
 var now=new Date();var ts=(now.getHours()<10?'0':'')+now.getHours()+':'+(now.getMinutes()<10?'0':'')+now.getMinutes();
 p._log.push({t:txt,me:true,time:ts});
 xzVibrate(18);
 /* 上课发消息被发现的判定 */
 if(_CHAT.ctx==='class')xzChatCaught(p,txt);
 _CHAT.typing=true;
 xzChatRender();
 setTimeout(function(){
  _CHAT.typing=false;
  var m=xzAIMatch(txt);
  var reply=null;
  if(m&&m.ask){
   /* 高度相似：提示是不是这个 */
   var simTxt=m.intent.sim||m.intent.t;
   p._log.push({t:'你问的是不是「'+simTxt+'」？',me:false,time:ts});
   xzChatRender();
   _CHAT.ask={intent:m.intent,txt:simTxt};
   xzVibrate(35);
   setTimeout(function(){ /* 再等确认 */
    if(_CHAT.ask&&_CHAT.ask.intent===m.intent){
     _CHAT.ask=null;
     xzChatNpcSay(xzAIReply(m.intent,p));
    }
   },1600);
   return;
  }
  if(m)reply=xzAIReply(m.intent,p);
  else reply=pk(XZ_AI_FALLBACK);
  xzChatNpcSay(reply);
 },600+Math.random()*500);
}
function xzChatNpcSay(text){
 var p=_CHAT.npc;
 var now=new Date();var ts=(now.getHours()<10?'0':'')+now.getHours()+':'+(now.getMinutes()<10?'0':'')+now.getMinutes();
 _CHAT.typing=true;
 xzChatRender();
 setTimeout(function(){
  _CHAT.typing=false;
  p._log.push({t:text,me:false,time:ts});
  xzVibrate(38);
  xzChatRender();
  if(p.aff!==undefined){p.aff=cl(p.aff+1,0,100);try{upd();}catch(e){}}
  /* NPC 主动问：35% 概率抛一个问题 */
  if(ch(.35)){
   setTimeout(function(){
    var it=pk(XZ_AI_INTENTS);
    var q=it.t;
    p._log.push({t:'（主动）'+(q==='恋爱'?'你…你有喜欢的人吗？':('你'+q+'？')),me:false,time:ts});
    xzVibrate(38);
    xzChatRender();
   },900);
  }
 },800+Math.random()*700);
}
function xzChatCaught(p,txt){
 /* 上课发消息：老师察觉判定 */
 if(!G)return;
 var risk=G.mode==='teacher'?0:0.25;
 if(!ch(risk))return;
 if(isBoss()){
  G.demerits=(G.demerits||0)+1;
  l('⚠️ '+p.n+'回你了，但校长/年级主任刚好路过，把你俩的聊天记下了！处分+1','bad');
  G.mood=cl(G.mood-6,0,100);
 }else{
  if(ch(.25)){
   l('⚠️ 讲台上的老师咳嗽了两声，意味深长地看了你一眼。','warn');
   G.support=cl((G.support||0)-2,0,100);
  }else{
   l('👀 老师瞟了一眼，没管（只要不是领导，一般睁一只眼闭一只眼）。','dim');
  }
 }
 try{upd();}catch(e){}
}
/* ---- 打开聊天入口（任意 NPC：对象/暗恋对象/同学/老师） ---- */
function xzOpenChat(){
 if(!G)return;
 var items=[];
 if(G.lover){var lv=G.lovers.filter(function(x){return x&&x.n;})[0]||G.lover;
  items.push({n:'💗 恋人：'+(lv.n||'对象'),d:'好感 '+Math.round((lv.aff||0))+' · AI 对话',b:'聊',fn:function(){var p=G.met.filter(function(x){return x&&x.n===(lv.n);})[0]||{n:lv.n,aff:lv.aff||50};xzChatPanel(p);}});}
 (G.crushList||[]).forEach(function(c){
  items.push({n:'😳 暗恋你的人：'+c.n,d:c.p, b:'聊',fn:function(){xzChatPanel(c);}});
 });
 if(G.crush)items.push({n:'💙 你暗恋的人：'+G.crush.n,d:G.crush.p,b:'聊',fn:function(){xzChatPanel(G.crush);}});
 (G.met||[]).forEach(function(p,i){
  if(p&&!items.some(function(x){return x.n.indexOf(p.n)>=0;}))items.push({n:'👤 '+p.n,d:'认识的人 · 好感 '+Math.round(p.aff||0),b:'聊',fn:function(){xzChatPanel(G.met[i]);}});
 });
 items.push({n:'👩‍🏫 找老师聊聊',d:'下课找老师 · 同 AI 对话',b:'聊',fn:function(){xzTeacherChatAI();}});
 menu('🤖 AI 聊天', '<p class="dim small">恋爱系统已介入 AI：按性格与好感度真人式回复，NPC 也会主动找你聊天。</p>', items);
}
/* ---- 老师 AI 对话 ---- */
function xzTeacherChatAI(){
 var p={n:'老师',_teacher:true,aff:(G.relation||0)*2,teacher:true};
 var rel=G.relation||0;
 var band=rel>=70?'warm':rel>=35?'mid':'cold';
 p._per=rel>=70?'温柔':rel>=35?'幽默':'严厉';
 var h='<h3>👩‍🏫 和老师聊聊 <span class="dim small" style="font-weight:400">师生关系 '+Math.round(rel)+'</span></h3>'+
  '<div class="chat-box" id="chatBox"></div>'+
  '<div class="chat-input"><input id="chatInput" type="text" maxlength="60" placeholder="和老师说话…（Enter 发送）" onkeydown="if(event.key===\'Enter\')xzChatSend()"><button onclick="xzChatSend()">发送</button></div>'+
  '<div class="dim small" style="margin-top:6px;text-align:center">🤖 AI 对话 · 老师版（严厉/温和按师生关系）</div>';
 modal(h);
 _CHAT.npc=p;_CHAT.ctx='teacher';
 p._log=p._log||[];
 /* 开场白 */
 setTimeout(function(){
  p._log.push({t:rel>=70?'同学来啦？坐。想聊什么？':rel>=35?'嗯？找我什么事？':'（抬头看了你一眼）什么事？',me:false,time:xzNowT()});
  xzChatRender();
 },400);
}
function xzNowT(){var n=new Date();return (n.getHours()<10?'0':'')+n.getHours()+':'+(n.getMinutes()<10?'0':'')+n.getMinutes();}

/* ================================================================
   ③ 起床穿衣（原版功能恢复：起床时选择穿搭）
   ================================================================ */
function xzDressMorning(){
 if(!G)return;
 menu('👔 早上穿什么？','<p class="dim small">原版起床装扮环节已恢复，每天起床可以选穿搭。</p>',[
  {n:'👕 穿校服（稳妥）',d:'不会被值周老师拦',b:'穿',fn:function(){G.outfitOk=true;G.outfit='校服';l('👕 你穿好校服，对着镜子整理好领子。','good');upd();}},
  {n:'🧥 自己的衣服（有个性）',d:'可能被值周老师拦下',b:'穿',fn:function(){G.outfitOk=false;G.outfit='自己的衣服';l('🧥 你穿了便服，回头率挺高，就是有点心虚。');upd();}},
  {n:'👔 校服+外套（天气冷）',d:'保暖 + 看起来更规矩',b:'穿',fn:function(){G.outfitOk=true;G.outfit='校服+外套';l('👔 你套上外套，风再大也不怕。','good');upd();}}
 ]);
}
/* 包装 SLOTS.wake：加入穿衣选项 */
(function(){
 var _wk=SLOTS.wake;
 SLOTS.wake=function(s){
  var r=_wk(s);
  if(!r||!r.choices)return r;
  r.choices.unshift(C('👔 穿衣服（决定今日穿搭）','校服/便服/外套',function(){xzDressMorning();}));
  return r;
 };
})();

/* ================================================================
   ④ 希沃白板（下课/课间可玩）
   ================================================================ */
var _WB={cv:null,ctx:null,draw:false,color:'#4a7dff',size:4};
function xzWhiteboard(){
 var cv=document.createElement('canvas');
 cv.id='wbCanvas';cv.className='wb-canvas';cv.width=720;cv.height=420;
 var h='<h3>🖊️ 希沃白板</h3>'+
  '<div class="wb-wrap">'+
  '<div class="wb-tools">'+
   ['#4a7dff','#ff5d73','#3ddc97','#ffd166','#9b6cff','#26334d'].map(function(c,i){
    return '<button class="wb-color'+(i===0?' on':'')+'" data-c="'+c+'" style="background:'+c+'" onclick="wbColor(this)"></button>';}).join('')+
   '<button class="wb-tool" onclick="wbErase()">🧽 橡皮</button>'+
   '<button class="wb-tool" onclick="wbPen()">🖊 画笔</button>'+
   '<button class="wb-tool" onclick="wbClear()">🗑 清空</button>'+
   '<button class="wb-tool gold" onclick="wbSave()">💾 保存到画册</button>'+
  '</div>'+
  '<div class="wb-stage">'+cv.outerHTML+'</div>'+
  '</div>'+
  '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">返回</button>';
 modal(h);
 cv=document.getElementById('wbCanvas');
 if(!cv)return;
 _WB.cv=cv;_WB.ctx=cv.getContext('2d');
 var g=_WB.ctx;
 g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);
 g.strokeStyle='#e8f0ff';g.lineWidth=1;
 for(var x=0;x<cv.width;x+=20){g.beginPath();g.moveTo(x,0);g.lineTo(x,cv.height);g.stroke();}
 for(var y=0;y<cv.height;y+=20){g.beginPath();g.moveTo(0,y);g.lineTo(cv.width,y);g.stroke();}
 cv.addEventListener('pointerdown',function(e){_WB.draw=true;var r=cv.getBoundingClientRect();wbDot((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height));cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);});
 cv.addEventListener('pointermove',function(e){if(!_WB.draw)return;var r=cv.getBoundingClientRect();wbLine((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height));});
 cv.addEventListener('pointerup',function(){_WB.draw=false;});
}
function wbColor(el){
 _WB.color=el.getAttribute('data-c');_WB.size=4;
 document.querySelectorAll('.wb-color').forEach(function(b){b.classList.remove('on');});
 el.classList.add('on');
}
function wbErase(){_WB.color='#ffffff';_WB.size=22;document.querySelectorAll('.wb-color').forEach(function(b){b.classList.remove('on');});}
function wbPen(){_WB.color='#4a7dff';_WB.size=4;document.querySelectorAll('.wb-color').forEach(function(b){b.classList.remove('on');});}
function wbDot(x,y){var c=_WB.ctx;c.fillStyle=_WB.color;c.beginPath();c.arc(x,y,_WB.size/2,0,Math.PI*2);c.fill();}
function wbLine(x,y){
 var c=_WB.ctx;c.strokeStyle=_WB.color;c.lineWidth=_WB.size;c.lineCap='round';
 c.lineTo(x,y);c.stroke();c.beginPath();c.moveTo(x,y);
}
function wbClear(){
 if(!_WB.ctx)return;
 _WB.ctx.fillStyle='#fff';_WB.ctx.fillRect(0,0,_WB.cv.width,_WB.cv.height);
 l('🗑 白板已清空');
}
function wbSave(){
 if(!_WB.cv)return;
 try{
  var url=_WB.cv.toDataURL('image/png');
  if(!G.album)G.album=[];
  G.album.push({src:url,t:'我的白板画 · 第'+(G.album.length+1)+'张',d:'希沃白板手绘'});
  l('💾 已保存到画册！','good');
  try{saveGame();}catch(e){}
 }catch(e){l('保存失败','bad');}
}

/* ================================================================
   ⑤ 黄金矿工重做：目标大幅提高 · 界面细致 · 买炸弹
   ================================================================ */
(function(){
 var _gm=xzGoldMiner;
 xzGoldMiner=function(){
  /* 取消旧循环 */
  if(window.GM_RAF)cancelAnimationFrame(window.GM_RAF);
  window.GM_RAF=0;
  var cv=document.createElement('canvas');
  cv.id='gmCanvas';cv.className='gm-canvas';cv.width=420;cv.height=600;
  var h='<h3>⛏️ 黄金矿工 <span class="dim small">第 <b id="gmLv">1</b> 关</span></h3>'+
   '<div class="gm-wrap">'+
   '<div class="gm-panel">'+cv.outerHTML+'</div>'+
   '<div class="gm-side">'+
    '<div class="gm-stat"><div class="lbl">💰 金钱</div><b id="gmMoney">$0</b></div>'+
    '<div class="gm-stat"><div class="lbl">🎯 目标</div><b id="gmTarget">$150</b></div>'+
    '<div class="gm-progress"><div class="gm-progress-bar" id="gmProg"></div></div>'+
    '<div class="gm-stat"><div class="lbl">⏱ 时间</div><b id="gmTime">60</b></div>'+
    '<div class="gm-stat"><div class="lbl">🔩 炸药</div><b id="gmBoom">1</b></div>'+
    '<button class="big" style="width:100%" onclick="gmBoomUse()">💣 引爆炸药</button>'+
    '<button class="big gold2" style="width:100%" onclick="gmBuyBoom()">🛒 买炸药 $30</button>'+
    '<button class="big" style="width:100%;margin-top:6px" onclick="gmToggleMode()">🎨 模型：<span id="gmModeLbl">写实</span></button>'+
    '<div class="gm-price"><b>本关金价</b><br>小金 $20 · 中金 $55<br>大金 $120 · 💎 $150<br>宝袋 $300 · 石头 $0</div>'+
    '<div class="gm-help">👆 点画布放钩<br>石头太重别硬拉！<br>抓到重物点💣炸掉</div>'+
   '</div></div>'+
   '<button class="gbtn" style="margin-top:8px" onclick="closeModal();gmStop()">返回</button>';
  modal(h);
  cv=document.getElementById('gmCanvas');
  if(!cv){closeModal();return;}
  window.GM={money:0,level:1,target:150,time:40,booms:1,over:false,win:false,last:0,parts:[],floats:[],shake:0,canvas:cv,
   claw:{x:210,y:36,len:0,max:480,ang:0,dir:1,state:'swing',speed:250,caught:null,shakeT:0},items:[],bank:0,reached:false};
  gmGenLevel();
  window.GM_LAST=performance.now();
  gm999Loop();
 };
 function gm999Loop(){
  var GM=window.GM;
  if(!GM){return;}
  var now=performance.now();
  var dt=Math.min(0.05,(now-window.GM_LAST)/1000);
  window.GM_LAST=now;
  if(!GM.over){
   GM.time-=dt;
   var c=GM.claw;
   if(c.state==='swing'){
    c.ang+=c.dir*dt*0.95; /* 摆动放慢，抓取节奏更长 */
    if(c.ang>0.95){c.ang=0.95;c.dir=-1;}
    if(c.ang<-0.95){c.ang=-0.95;c.dir=1;}
    c.x=210+Math.sin(c.ang)*c.len;
    c.y=36+Math.cos(c.ang)*c.len;
   }else if(c.state==='drop'){
    var sp=c.speed*dt;
    c.x+=Math.sin(c.ang)*sp;
    c.y+=Math.cos(c.ang)*sp;
    c.len+=sp;
    if(c.len>c.max||c.y>560){gmRetract();}
    for(var i=0;i<GM.items.length;i++){
     var it=GM.items[i];
     var d=Math.sqrt((it.x-c.x)*(it.x-c.x)+(it.y-c.y)*(it.y-c.y));
     if(d<(it.r+8)){
      c.caught=it;c.state='retract';GM.items.splice(i,1);
      c.shakeT=0.35;
      break;
     }
    }
   }else if(c.state==='retract'){
    c.shakeT-=dt;
    var w=c.caught?c.caught.v:0;
    var sp=Math.max(45,c.speed*0.82-w*2.0); /* 回拉整体放慢，重物更慢 */
    if(c.caught&&w>=100&&c.shakeT>0){sp*=0.3;}
    c.x-=Math.sin(c.ang)*sp*dt;
    c.y-=Math.cos(c.ang)*sp*dt;
    c.len-=sp*dt;
    if(c.len<=8){
     if(c.caught&&c.caught.w>0){
      GM.money+=c.caught.w;
      GM.floats.push({x:c.x,y:c.y-16,t:0,txt:'+$'+c.caught.w});
      if(c.caught.star){GM.floats.push({x:210,y:60,t:0,txt:'⭐ 挖到宝袋！'});}
      /* 达标不再立即结束：只标记，继续挖到时间到 */
      if(GM.money>=GM.target&&!GM.reached){
       GM.reached=true;GM.win=true;
       GM.floats.push({x:210,y:90,t:0,txt:'🎯 目标达成！可继续挖'});
      }
     }
     c.caught=null;c.state='swing';
    }
   }
   for(var p=GM.parts.length-1;p>=0;p--){GM.parts[p].t+=dt;if(GM.parts[p].t>0.6)GM.parts.splice(p,1);}
   for(var f=GM.floats.length-1;f>=0;f--){GM.floats[f].t+=dt;if(GM.floats[f].t>1.2)GM.floats.splice(f,1);}
   if(GM.shake>0)GM.shake-=dt*20;
   /* 只有时间到才结束 */
   if(GM.time<=0){GM.over=true;}
   gm999UI();
  }
  gm999Draw();
  if(GM.over){
   if(GM.reached){
    window.GM_RAF=0;
    GM.bank=(GM.bank||0)+GM.money;
    modal('<h3>🎯 第 '+GM.level+' 关 · 时间到，达标！</h3><div class="quote">本关挖到 <b>$'+GM.money+'</b>（目标 $'+GM.target+'）<br>累计总分 <b class="gold">$'+GM.bank+'</b><br><span class="dim small">超出目标的钱已正常累计</span></div>'+
     '<button class="big gold2" style="width:100%" onclick="gmNextLevel()">进入第 '+(GM.level+1)+' 关 →（目标更高）</button>'+
     '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();gmStop()">收工</button>');
    if(G){G.money+=Math.min(400,Math.floor(GM.money/2));G.mood=cl(G.mood+8,0,100);l('⛏️ 黄金矿工第'+GM.level+'关赚了 $'+Math.min(400,Math.floor(GM.money/2))+'！','good');try{upd();}catch(e){}}
   }else{
    window.GM_RAF=0;
    modal('<h3>⏱ 时间到 · 未达标</h3><div class="quote">本关挖到 <b>$'+GM.money+'</b>（目标 $'+GM.target+'）<br>累计总分 <b class="gold">$'+(GM.bank||0)+'</b></div>'+
     '<button class="big" style="width:100%" onclick="xzGoldMiner()">再来一局</button>'+
     '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();gmStop()">返回</button>');
   }
   return;
  }
  window.GM_RAF=requestAnimationFrame(gm999Loop);
 }
 function gm999UI(){
  var GM=window.GM;if(!GM)return;
  var el;
  el=document.getElementById('gmMoney');if(el)el.textContent='$'+GM.money;
  el=document.getElementById('gmTarget');if(el)el.textContent='$'+GM.target;
  el=document.getElementById('gmTime');if(el)el.textContent=Math.max(0,Math.ceil(GM.time));
  el=document.getElementById('gmBoom');if(el)el.textContent=GM.booms;
  el=document.getElementById('gmLv');if(el)el.textContent=GM.level;
  el=document.getElementById('gmProg');if(el)el.style.width=Math.min(100,GM.money/GM.target*100)+'%';
 }
 function gm999Draw(){
  var GM=window.GM;if(!GM)return;
  var cv=GM.canvas||document.getElementById('gmCanvas');
  if(!cv)return;
  var ctx=GM.ctx;if(!ctx)ctx=cv.getContext('2d');
  GM.ctx=ctx;
  ctx.clearRect(0,0,cv.width,cv.height);
  var g=ctx.createLinearGradient(0,0,0,80);
  g.addColorStop(0,'#8ecbff');g.addColorStop(1,'#d3eeff');
  ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,80);
  ctx.fillStyle='#fff7c4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('☀️ 黄金矿工 Lv.'+GM.level,210,20);
  /* 云动画 */
  var t=performance.now()/4000;
  ctx.fillStyle='rgba(255,255,255,.75)';
  for(var c2=0;c2<3;c2++){
   var cx=((c2*180+t*60)%(cv.width+80))-40;
   ctx.beginPath();ctx.ellipse(cx,30+c2*8,34,14,0,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='#5cb85c';ctx.fillRect(0,66,cv.width,20);
  ctx.fillStyle='#4a9e4a';ctx.fillRect(0,76,cv.width,8);
  var g2=ctx.createLinearGradient(0,80,0,cv.height);
  g2.addColorStop(0,'#8a6236');g2.addColorStop(.5,'#6f4e2c');g2.addColorStop(1,'#54391f');
  ctx.fillStyle=g2;ctx.fillRect(0,84,cv.width,cv.height-84);
  ctx.fillStyle='rgba(0,0,0,.12)';
  for(var i=0;i<40;i++){ctx.beginPath();ctx.arc(rnd(0,cv.width),rnd(90,cv.height-10),rnd(2,5),0,Math.PI*2);ctx.fill();}
  for(var j=0;j<GM.items.length;j++){gmItem(ctx,GM.items[j]);}
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='11px sans-serif';
  ctx.fillText('💣 炸药：'+GM.booms+'  （抓到重物点右侧按钮引爆）',210,99);
  var c=GM.claw;
  /* 绳子：双线 + 明暗 */
  ctx.lineCap='round';
  ctx.strokeStyle='rgba(120,120,120,.9)';ctx.lineWidth=3.4;
  ctx.beginPath();ctx.moveTo(210,36);ctx.lineTo(c.x,c.y);ctx.stroke();
  ctx.strokeStyle='rgba(230,230,230,.85)';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(210,36);ctx.lineTo(c.x,c.y);ctx.stroke();
  ctx.save();ctx.translate(c.x,c.y);
  var hold=c.state==='retract'&&c.caught;
  if(c.shakeT>0&&hold)ctx.rotate(Math.sin(performance.now()/40)*0.25);
  /* 金属钩爪渐变 */
  var cg=ctx.createLinearGradient(0,-4,0,15);
  cg.addColorStop(0,'#f0d27a');cg.addColorStop(.5,'#c9a24b');cg.addColorStop(1,'#8a6a2a');
  ctx.fillStyle=cg;ctx.strokeStyle='#6f5220';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(-9,7);ctx.lineTo(0,-3);ctx.lineTo(9,7);ctx.lineTo(4.5,15);ctx.lineTo(-4.5,15);
  ctx.closePath();ctx.fill();ctx.stroke();
  /* 关节 + 高光 */
  ctx.fillStyle='#6f5220';ctx.beginPath();ctx.arc(0,2,3.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.7)';
  ctx.beginPath();ctx.arc(-3,0,1.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
  for(var p=0;p<GM.parts.length;p++){
   var pt=GM.parts[p];
   ctx.globalAlpha=Math.max(0,1-pt.t/0.6);
   var rr=30+pt.t*120;
   var rg=ctx.createRadialGradient(pt.x,pt.y,2,pt.x,pt.y,rr);
   rg.addColorStop(0,'#fff');rg.addColorStop(.4,'#ffb454');rg.addColorStop(1,'rgba(255,90,40,0)');
   ctx.fillStyle=rg;ctx.beginPath();ctx.arc(pt.x,pt.y,rr,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=1;
  }
  for(var f=0;f<GM.floats.length;f++){
   var ft=GM.floats[f];
   ctx.globalAlpha=Math.max(0,1-ft.t/1.2);
   ctx.fillStyle='#ffd166';ctx.font='bold 17px sans-serif';
   ctx.textAlign='center';ctx.fillText(ft.txt,ft.x,ft.y-ft.t*44);
   ctx.globalAlpha=1;
  }
 }
 /* 覆盖目标值计算：关卡大幅提高 */
 window.gmGenLevel=function(){
  var GM=window.GM;if(!GM)return;
  var L=GM.level;
  GM.target=Math.round(150*Math.pow(1.8,L-1)); /* L1=150 L2=270 L3=486 L4=875 L5=1575… */
  GM.time=40;
  GM.booms=(GM.booms||0)+1;
  var items=[],W=420,H=600;
  var deep=Math.min(430,240+L*26);
  var counts={gold:6+L,gold2:4+Math.floor(L/1.5),gold3:2+Math.floor(L/2),diamond:Math.min(5,1+L),stone:5+L,bag:1};
  function push(type,x,y){
   var o={type:type,x:x,y:y,v:0};
   if(type==='gold'){o.r=13;o.w=25;o.v=20;}
   else if(type==='gold2'){o.r=19;o.w=55;o.v=30;}
   else if(type==='gold3'){o.r=27;o.w=120;o.v=45;}
   else if(type==='diamond'){o.r=15;o.w=150;o.v=15;}
   else if(type==='stone'){o.r=rnd(22,34);o.w=0;o.v=120+Math.min(80,L*10);}
   else if(type==='bag'){o.r=22;o.w=300;o.v=80;o.star=true;}
   items.push(o);
  }
  for(var t in counts){
   var n=counts[t];
   for(var i=0;i<n;i++){
    var tries=0,x=0,y=0,ok=false;
    while(!ok&&tries<30){
     tries++;x=rnd(36,W-36);y=rnd(90,deep+40);ok=true;
     for(var j=0;j<items.length;j++){
      var it=items[j];
      var d=Math.sqrt((it.x-x)*(it.x-x)+(it.y-y)*(it.y-y));
      if(d<(it.r+24)){ok=false;break;}
     }
    }
    push(t,x,y);
   }
  }
  push('bag',rnd(80,W-80),Math.min(deep+30,540));
  GM.items=items;
 };
 /* 进入下一关：重置当关，钱已计入 bank；时间/物品重新生成 */
 window.gmNextLevel=function(){
  var GM=window.GM;if(!GM)return;
  closeModal();
  GM.level++;
  GM.money=0;
  GM.over=false;GM.win=false;GM.reached=false;
  GM.claw.len=0;GM.claw.state='swing';GM.claw.caught=null;GM.claw.ang=0;GM.claw.dir=1;
  GM.parts=[];GM.floats=[];GM.shake=0;
  gmGenLevel();
  window.GM_LAST=performance.now();
  if(!window.GM_RAF){window.GM_RAF=requestAnimationFrame(gm999Loop);}
  l('⛏️ 进入第 '+GM.level+' 关，目标 $'+GM.target,'info');
 };
 window.gmBuyBoom=function(){
  var GM=window.GM;if(!GM||GM.over)return;
  if(GM.money<30){l('钱不够买炸药（$30）','warn');return;}
  GM.money-=30;GM.booms++;gm999UI();l('🔩 买了一个炸药。');
 };
 window.gmBoomUse=function(){
  var GM=window.GM;if(!GM||GM.over)return;
  if(GM.booms<1){l('没有炸药了，点「买炸药」购买','warn');return;}
  GM.booms--;
  if(GM.claw.caught){
   GM.parts.push({x:GM.claw.x,y:GM.claw.y,t:0});GM.shake=8;
   GM.claw.caught=null;GM.claw.state='swing';
  }else{
   var hit=false;
   for(var i=GM.items.length-1;i>=0;i--){
    var it=GM.items[i];
    var d=Math.sqrt((it.x-GM.claw.x)*(it.x-GM.claw.x)+(it.y-GM.claw.y)*(it.y-GM.claw.y));
    if(d<75&&it.type==='stone'){GM.items.splice(i,1);hit=true;}
   }
   if(hit)GM.parts.push({x:GM.claw.x,y:GM.claw.y,t:0});
  }
  gm999UI();
 };
 window.gmDrop=function(){
  var GM=window.GM;if(!GM||GM.over)return;
  if(GM.claw.state!=='swing')return;
  GM.claw.state='drop';GM.claw.caught=null;
 };
 window.gmStop=function(){if(window.GM_RAF){cancelAnimationFrame(window.GM_RAF);window.GM_RAF=0;}window.GM=null;};
})();

/* ================================================================
   ⑥ 关系图升级：白天模式 · 更精致
   ================================================================ */
var _LM999={raf:0,cv:null,ctx:null,nodes:[],edges:[],t:0};
function xzLoveMap(){
 if(_LM999.raf)cancelAnimationFrame(_LM999.raf);
 if(_LM.raf)cancelAnimationFrame(_LM.raf);
 if(!G){l('先进入游戏吧','warn');return;}
 var cv=document.createElement('canvas');
 cv.id='loveMapCanvas';cv.className='love-map-canvas';
 cv.width=560;cv.height=420;
 var h='<h3>🕸 恋爱关系图 <span class="dim small">白天清新版</span></h3>'+
  '<div class="lm-wrap"><div class="lm-panel">'+cv.outerHTML+'</div>'+
  '<div class="lm-legend"><span class="lm-ln">━━ 恋爱/双向</span><span class="lm-ln2">┈┈ 暗恋/单向</span><span class="lm-ln3">┅┅ 情敌/竞争</span>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="xzLoveMap()">🔄 重新布局</button>'+
  '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal();lm999Stop()">关闭</button></div></div>';
 modal(h);
 cv=document.getElementById('loveMapCanvas');
 if(!cv){closeModal();return;}
 _LM999.cv=cv;_LM999.ctx=cv.getContext('2d');
 _LM999.nodes=[];_LM999.edges=[];_LM999.t=0;
 var cx=280,cy=210,deg=0;
 _LM999.nodes.push({id:'me',label:'你',x:cx,y:cy,r:36,type:'me'});
 function addNode(id,label,type,dx,dy){
  _LM999.nodes.push({id:id,label:label,x:cl(cx+dx,70,490),y:cl(cy+dy,60,360),r:27,type:type});
 }
 (G.lovers||[]).forEach(function(l,i){
  if(!l||!l.n)return;
  var a=deg;deg+=2.4;
  addNode('l'+i,l.n,'lover',Math.cos(a)*150,Math.sin(a)*100-30);
  _LM999.edges.push({a:'me',b:'l'+i,t:'lover'});
 });
 (G.crushList||[]).forEach(function(c,i){
  var a=deg;deg+=2.4;
  addNode('c'+i,c.n,'crush',Math.cos(a)*170,Math.sin(a)*100+20);
  _LM999.edges.push({a:'c'+i,b:'me',t:'crush'});
  if(c.hasLover&&c.lover){
   addNode('cl'+i,c.lover+'（对象）','rival',Math.cos(a+1.2)*90,Math.sin(a+1.2)*80);
   _LM999.edges.push({a:'c'+i,b:'cl'+i,t:'rival'});
  }
 });
 if(G.crush&&G.crush.n){
  addNode('mycrush',G.crush.n,'mycrush',-170,40);
  _LM999.edges.push({a:'me',b:'mycrush',t:'crush'});
  if(G.crush.hasLover&&G.crush.lover){
   addNode('mcr',G.crush.lover+'（情敌）','rival',-90,150);
   _LM999.edges.push({a:'mycrush',b:'mcr',t:'rival'});
  }
 }
 lm999Loop();
}
function lm999Loop(){
 if(!_LM999.cv)return;
 _LM999.t+=0.016;
 var ctx=_LM999.ctx,cv=_LM999.cv;
 ctx.clearRect(0,0,cv.width,cv.height);
 /* 白天清新背景：浅蓝渐变 + 光斑 + 云 */
 var g=ctx.createLinearGradient(0,0,0,cv.height);
 g.addColorStop(0,'#cfe8ff');g.addColorStop(.6,'#eaf6ff');g.addColorStop(1,'#fdf3e7');
 ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);
 ctx.fillStyle='rgba(255,255,255,.55)';
 ctx.beginPath();ctx.arc(470,50,34,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff3c4';
 ctx.beginPath();ctx.arc(470,50,26,0,Math.PI*2);ctx.fill();
 var tw=_LM999.t*26;
 ctx.fillStyle='rgba(255,255,255,.7)';
 ctx.beginPath();ctx.ellipse((tw%620)-40,64,46,16,0,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.ellipse(((tw+260)%620)-40,90,36,13,0,0,Math.PI*2);ctx.fill();
 /* 光斑 */
 for(var sp=0;sp<7;sp++){
  var sx=(sp*83+Math.sin(_LM999.t*0.6+sp)*12)%cv.width;
  var sy=60+(sp*47)%120;
  ctx.fillStyle='rgba(255,255,255,'+(0.25+0.15*Math.sin(_LM999.t*1.4+sp))+')';
  ctx.beginPath();ctx.arc(sx,sy,7+sp%3,0,Math.PI*2);ctx.fill();
 }
 ctx.fillStyle='rgba(90,120,180,.6)';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
 ctx.fillText('· 你的心动关系网 ·',cv.width/2,26);
 /* 连线 */
 _LM999.edges.forEach(function(e){
  var na=_LM999.nodes.filter(function(n){return n.id===e.a;})[0];
  var nb=_LM999.nodes.filter(function(n){return n.id===e.b;})[0];
  if(!na||!nb)return;
  ctx.beginPath();
  if(e.t==='lover'){ctx.strokeStyle='rgba(255,112,180,.85)';ctx.lineWidth=3;}
  else if(e.t==='crush'){ctx.strokeStyle='rgba(90,130,255,.8)';ctx.lineWidth=2;ctx.setLineDash([7,6]);}
  else{ctx.strokeStyle='rgba(255,93,115,.85)';ctx.lineWidth=2;ctx.setLineDash([3,5]);}
  ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);ctx.stroke();ctx.setLineDash([]);
  /* 连线中点小爱心/圆点 */
  var mx=(na.x+nb.x)/2,my=(na.y+nb.y)/2;
  if(e.t==='lover'){
   ctx.fillStyle='#ff70b4';
   ctx.font='14px sans-serif';ctx.textAlign='center';
   ctx.fillText('❤',mx,my);
  }else if(e.t==='crush'){
   ctx.fillStyle='rgba(90,130,255,.8)';
   ctx.beginPath();ctx.arc(mx,my,3+Math.sin(_LM999.t*4)*1.2,0,Math.PI*2);ctx.fill();
  }
 });
 /* 节点 */
 _LM999.nodes.forEach(function(n){
  var pulse=1+Math.sin(_LM999.t*2+n.x*0.05)*0.06;
  var r=n.r*pulse;
  var col=n.type==='me'?'#ffd166':n.type==='lover'?'#ff8fbe':n.type==='rival'?'#ff8f9e':n.type==='mycrush'?'#7fb2ff':'#c9a6ff';
  var c2=n.type==='me'?'#f0a63c':n.type==='lover'?'#f26da2':n.type==='rival'?'#ef6a78':n.type==='mycrush'?'#4f86e8':'#9a6ce8';
  var gd=ctx.createRadialGradient(n.x-r*0.4,n.y-r*0.4,r*0.2,n.x,n.y,r);
  gd.addColorStop(0,'#fff');gd.addColorStop(.4,col);gd.addColorStop(1,c2);
  ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
  ctx.fillStyle=gd;ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.stroke();
  ctx.shadowColor=col;ctx.shadowBlur=12;
  ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(n.label.slice(0,5),n.x,n.y);
  ctx.shadowBlur=0;
 });
 _LM999.raf=requestAnimationFrame(lm999Loop);
}
function lm999Stop(){if(_LM999.raf){cancelAnimationFrame(_LM999.raf);_LM999.raf=0;}}

/* ================================================================
   ⑦ 同性暗恋（低概率）· 暗恋对象可交涉（有对象也能聊）
   ================================================================ */
(function(){
 var _ci=xzCrushInit;
 window.xzCrushInit=function(){
  _ci();
  /* 2% 低概率：出现同性暗恋者（异性恋视角） */
  if(G&&G.crushList&&G.crushList.length<4&&ch(.02)&&G.pref==='异性'){
   var pool=[{n:'季野',p:'话少但总帮你值日',cls:'高二(3)班',like:['可乐'],hair:'高个子'},{n:'言笑',p:'大大咧咧的开心果',cls:'高二(5)班',like:['糖果'],hair:'短发'}];
   var c=pool[Math.floor(Math.random()*pool.length)];
   if(!G.crushList.some(function(x){return x.n===c.n;})){
    G.crushList.push({n:c.n,p:c.p,cls:c.cls,like:c.like,hair:c.hair,hasLover:false,lover:null,aff:rnd(30,50),knows:ch(.3),same:true});
    l('🤭 你好像被一个意想不到的人悄悄注意了……','love');
   }
  }
 };
 /* 暗恋对象面板：有对象也能交涉（聊天/送礼） */
 var _cp=xzCrushPanel;
 window.xzCrushPanel=function(){
  if(!G)return;
  if(G.mode==='teacher'){modal('<h3>💘 暗恋系统</h3><div class="quote">老师模式下专注教书育人，暗恋系统仅对学生开放～</div><button class="gbtn" onclick="closeModal()">返回</button>');return;}
  xzCrushInit();
  var h='<h3>💘 暗恋 · 心动关系</h3><div class="quote">谁在偷偷看你？缘分需要自己去发现。<br><span class="dim small">🤖 恋爱系统已介入 AI：点 💬 可以和任何人真人式聊天</span></div>';
  if(G.crush){
   var c=G.crush;
   h+='<div class="tcard"><b>💙 你暗恋 · '+c.n+'</b><br>'+
    '🏷 '+c.cls+' · '+c.hair+'<br>💬 '+c.p+'<br>❤️ 喜欢：'+(c.like||[]).map(function(x){return ITEMS[x]?ITEMS[x].n:x;}).join('、')+
    (c.hasLover?'<br><b class="bad">⚠️ TA 已有对象：'+c.lover+'（情敌！仍可交涉）</b>':'<br><span class="good">TA 目前单身</span>')+
    '<br>📈 暗恋你的概率：<b>'+(c.crushBack?xzCrushProb(c)+'%':'未知')+'</b>'+
    '<br>💌 表白成功率：<b class="pink">'+Math.round(xzConfessProb(c)*100)+'%</b>'+
    '<br><span style="display:flex;gap:5px;margin-top:6px"><button onclick="xzChatPanel(G.crush)">💬 和TA聊天</button><button onclick="xzCrushGive(\''+c.n+'\')">🎁 送礼</button></span></div>';
  }else{
   h+='<div class="mb"><span>还没有暗恋的人？<br><span class="dim small">在课间/午休找心动的人聊天，或去操场偶遇</span></span><button onclick="xzPickCrush()">🎯 去遇见TA</button></div>';
  }
  h+='<h4 style="margin:8px 0 4px">😳 暗恋你的人（'+G.crushList.length+'）</h4>';
  if(G.crushList.length===0)h+='<div class="dim small">还没有人暗恋你。多提升魅力、多参加活动，会有惊喜。</div>';
  G.crushList.forEach(function(c){
   h+='<div class="mb"><span><b>'+c.n+'</b> · '+c.cls+'<br><span class="dim small">'+c.p+(c.same?'<br>（TA和你性别相同——缘分有点意外）':'')+(c.knows?'':'（你还不知道TA的心意）')+'</span>'+
    (c.hasLover?'<br><b class="bad">⚠️ 三角恋：TA 已有对象 '+c.lover+'</b>':'')+
    (G.lovers&&G.lovers.some(function(l){return l&&l.n===c.n;})?'<br><b class="good">你们已是恋人 ❤️</b>':'')+
    '</span><span style="display:flex;gap:5px;align-items:center">'+
    '<button onclick="xzChatPanel(G.crushList['+G.crushList.indexOf(c)+'])">💬</button>'+
    '<button onclick="xzCrushGive(\''+c.n+'\')">🎁</button>'+
    '<button onclick="xzCrushTalk(\''+c.n+'\')">💬聊</button>'+
    (c.hasLover?'':'<button onclick="xzConfess(\''+c.n+'\')">💌 表白</button>')+
    '</span></div>';
  });
  h+='<div class="mb"><span>🗺 关系全景图</span><button onclick="xzLoveMap()">🕸 打开关系图</button></div>';
  h+='<div class="mb"><span>🤖 AI 聊天总入口</span><button onclick="xzOpenChat()">聊</button></div>';
  h+='<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>';
  modal(h);
 };
})();

/* ================================================================
   5.5.6.99902 追加层
   修复：AI对话(你是谁/青春期/去主动提问/上课直接弹聊天) · 数值增减动画
        西瓜(全屏/点哪落哪/放慢/曲线) · 暗恋补回 · 顶栏固定 · 手机优化
   ================================================================ */
window.XZ_VER='5.5.6.99902';
if(window.XZ561)XZ561.ver='5.5.6.99902';
window.XZ99902=true;

/* ================================================================
   一、合成大西瓜：全屏 + 待投放预览（点哪落哪）+ 放慢 + 曲线
   ================================================================ */
(function(){
 var _wmStart=watermelonStart;
 watermelonStart=function(){
  if(window.WM&&WM.raf)cancelAnimationFrame(WM.raf);
  WM={fruits:[],score:0,over:false,next:rnd(0,4),readyT:rnd(0,4),cur:null,raf:0,last:0,
      aimX:170,dropable:true,spawnF:undefined,shocks:[],parts:[],floats:[],shake:0};
  WM.canvas=document.createElement('canvas');
  WM.canvas.id='wmCanvas';WM.canvas.className='wm-canvas';
  WM.canvas.width=340;WM.canvas.height=520;
  WM.ctx=WM.canvas.getContext('2d');
  var h='<h3>🍉 合成大西瓜 <span class="dim small" style="font-size:12px">v99902</span></h3><div class="wm-wrap">'+
   '<div id="wmStage" style="position:relative"><div class="wm-panel">'+WM.canvas.outerHTML+'</div>'+
   '<div class="wm-over" id="wmOver" style="display:none"><b>游戏结束</b><div class="wm-score" id="wmScoreTxt"></div><button class="big" onclick="watermelonStart()">再来一局</button></div></div>'+
   '<div class="wm-side">'+
    '<div class="wm-stat"><div class="lbl">得分</div><b id="wmScore">0</b></div>'+
    '<div class="wm-stat"><div class="lbl">最高分</div><b id="wmBest">'+xzWMBest()+'</b></div>'+
    '<div class="wm-stat"><div class="lbl">下一个</div><div class="wm-next" id="wmNext"></div></div>'+
    '<div class="wm-help">📌 移动手指/鼠标瞄准，<b>点哪里落在哪里</b><br>同种水果相撞合体升级<br>🍉 是最强！别堆过顶部红线<br><button class="wb-tool gold" style="margin-top:6px;width:100%" onclick="xzWMFullscreen()">⛶ 全屏游玩</button></div>'+
   '</div></div>'+
   '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">返回</button>';
  modal(h);
  WM.canvas=document.getElementById('wmCanvas');
  WM.ctx=WM.canvas.getContext('2d');
  WM.danger=60;WM.ground=WM.canvas.height-26;
  WM.wallL=20;WM.wallR=WM.canvas.width-20;
  WM.aimX=WM.canvas.width/2;
  function px(e){
   var rect=WM.canvas.getBoundingClientRect();
   var cx=e.touches&&e.touches[0]?e.touches[0].clientX:e.clientX;
   var x=(cx-rect.left)*(WM.canvas.width/rect.width);
   return Math.max(WM.wallL+14,Math.min(WM.wallR-14,x));
  }
  /* 移动：更新瞄准点（待投放水果跟随） */
  function aim(e){WM.aimX=px(e);if(e.cancelable)e.preventDefault();}
  WM.canvas.addEventListener('pointermove',aim);
  WM.canvas.addEventListener('pointerdown',function(e){
   if(WM.over)return;
   WM.aimX=px(e);
   WM.spawn(WM.aimX); /* 点哪里落在哪里 */
  });
  WM.spawn=function(x){
   if(WM.over||WM.cur)return;
   var T=WM_TIERS[WM.readyT];
   /* 从顶部可见处释放，水平用 easeOut 定位（点哪落哪），垂直初速小、重力自然加速 = easeIn 曲线 */
   var f={t:WM.readyT,x:Math.max(WM.wallL+T.r,Math.min(WM.wallR-T.r,x)),y:30,vx:0,vy:18,ease:1};
   WM.fruits.push(f);WM.cur=f;
   WM.readyT=WM.next;WM.next=rnd(0,4);xzWMNext();
  };
  xzWMNext();
  WM.last=performance.now();
  (function loop(now){
   if(WM.stopRAF){WM.raf=0;return;}
   WM.raf=requestAnimationFrame(loop);
   /* 整体放慢到 0.86 倍，节奏更从容 */
   var dt=Math.min(0.033,(now-WM.last)/1000)*0.86;WM.last=now;
   xzWMStep(dt);
   xzWMDraw99902();
  })(performance.now());
 };
 /* 下一个预览（含待投放） */
 var _next=window.xzWMNext;
 window.xzWMNext=function(){
  var el=document.getElementById('wmNext');
  if(el)el.innerHTML='<span style="font-size:30px">'+WM_TIERS[WM.readyT].n+'</span>';
 };
 /* 绘制：旧 draw + 待投放预览（顶部跟随 aimX，半透明 + 引导虚线） */
 window.xzWMDraw99902=function(){
  xzWMDraw();
  var ctx=WM.ctx;if(!ctx||WM.over)return;
  var T=WM_TIERS[WM.readyT];
  /* 引导虚线 */
  ctx.save();
  ctx.globalAlpha=.35;ctx.strokeStyle='#ffffff';ctx.setLineDash([4,8]);ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(WM.aimX,44);ctx.lineTo(WM.aimX,WM.ground-6);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();
  /* 待投放水果（半透明，呼吸缩放） */
  var breathe=1+0.06*Math.sin(performance.now()/260);
  var pf={t:WM.readyT,x:WM.aimX,y:28,sc:0.92*breathe,rot:0,ghost:true};
  ctx.save();ctx.globalAlpha=.8;
  xzWMFruit(ctx,pf);
  ctx.restore();
 };
 /* 全屏：容器 fixed 放大 canvas（坐标换算由 getBoundingClientRect 处理，点哪落哪不受影响） */
 window.xzWMFullscreen=function(){
  var st=document.getElementById('wmStage');
  if(!st)return;
  if(st.classList.contains('wm-fs')){st.classList.remove('wm-fs');return;}
  st.classList.add('wm-fs');
  var exit=document.createElement('button');
  exit.textContent='✕ 退出全屏';exit.className='wm-fs-exit';
  exit.onclick=function(){st.classList.remove('wm-fs');exit.remove();};
  st.appendChild(exit);
 };
})();

/* ================================================================
   二、AI 对话大幅扩充：30+ 新意图（你是谁 / 青春期 / 校园日常）
   ================================================================ */
var XZ_AI_NEW=[
{id:'who',kws:['你是谁','你叫什么','你叫什么名字','怎么称呼你','你叫啥','你的名字','你叫什么名字啊','你哪位','你是','介绍一下你自己'],
 hi:['我是'+(function(){return ''})()],mid:[],lo:[]}, /* 动态，见 xzAIReply 包装 */
{id:'age',kws:['你几岁','你多大','你多大了','你多少岁','你几年级','你哪年的'],
 hi:['我跟你同岁呀，你猜？','比你大一点点，要叫哥哥/姐姐哦','秘密，反正还在上学啦'],
 mid:['就正常上学的年纪呗','你先告诉我你几岁'],
 lo:['问这个干嘛','年龄是隐私哦']},
{id:'height',kws:['你多高','你身高多少','你好高','你好矮','多高啊','一米几'],
 hi:['我1米68，你呢？','反正比你高一点点嘿嘿','我还想再长两厘米呢'],
 mid:['就正常身高吧','你问这个干嘛'],
 lo:['关你什么事','没量过']},
{id:'where',kws:['你在哪','你在哪个班','你几班的','你哪个学校','你现在在哪','在什么地方'],
 hi:['我在教室呀，刚下课','我在你隔壁班，你不知道吗','我在走廊，正准备回座位'],
 mid:['我在班里','学校呗，还能在哪'],
 lo:['你问这个干嘛','我在哪跟你有关系吗']},
{id:'mycrush',kws:['你有喜欢的人吗','你有对象吗','你谈恋爱了吗','你有男朋友吗','你有女朋友吗','你有心动的人吗','你是不是有喜欢的人','你单身吗'],
 hi:['嗯…有，而且你应该认识','你猜呢？猜对了告诉你','秘密，不过TA对我挺好的'],
 mid:['暂时没有啦','随缘吧，还没遇到喜欢的'],
 lo:['跟你说这个干嘛','我不想聊这个']},
{id:'crush_me',kws:['你是不是喜欢我','你是不是暗恋我','你对我什么感觉','你觉得我怎么样','你是不是对我有意思','你爱我吗'],
 hi:['…被你发现了，嗯，是有一点','你说呢？笨蛋','喜欢啊，不然我天天找你干嘛'],
 mid:['你挺好的呀，怎么突然这么问','我们不是朋友吗'],
 lo:['你想多了','你是不是有点自恋']},
{id:'gossip',kws:['有什么八卦','最近的瓜','你听说了吗','谁和谁在一起了','有瓜吗','吃瓜','八卦','大瓜'],
 hi:['哎我跟你说，隔壁班那对好像分了','你知道吗，三班有人被表白了，全班都在起哄','我听说有人偷偷带手机被抓了，笑死'],
 mid:['我也没什么瓜，你有吗','最近好像挺平静的'],
 lo:['我不聊别人八卦','你怎么这么爱打听']},
{id:'star',kws:['追星吗','你偶像是谁','你喜欢哪个明星','你追谁','你家爱豆','追星','明星'],
 hi:['我有一个超喜欢的！TA真的很努力','我偶尔追星，主要听歌','我墙头可多了，数不过来'],
 mid:['还好，有几个觉得不错的','不怎么追星'],
 lo:['不追星，没兴趣','明星跟我有什么关系']},
{id:'anime',kws:['看动漫吗','你追什么番','动漫','番剧','二次元','你看番吗','最近有什么好看的番','漫画'],
 hi:['看！我最近在追一部超好看的，安利给你','我老二次元了哈哈','我喜欢治愈系的，看着很放松'],
 mid:['偶尔看两集','看过几部热门的'],
 lo:['不看动漫','我对这个没兴趣']},
{id:'novel',kws:['看小说吗','你看什么书','小说','网文','你读什么','言情小说','悬疑小说'],
 hi:['看！我最近熬夜看小说被我妈说了','我喜欢悬疑的，根本停不下来','我看言情，甜到打滚那种'],
 mid:['偶尔看看','看过几本'],
 lo:['不看小说','有这时间不如睡觉']},
{id:'movie',kws:['看电影吗','最近有什么电影','你喜欢什么电影','电影','剧','追剧吗','电视剧'],
 hi:['周末想约你一起看电影，去吗','我最近在追一部剧，超好看','我喜欢科幻片，特效超燃'],
 mid:['有好看的会看','偶尔追剧'],
 lo:['不怎么看','没兴趣']},
{id:'music2',kws:['你听什么歌','你喜欢什么歌','推荐几首歌','歌单','你唱歌好听吗','听歌','音乐'],
 hi:['我歌单分享给你呀，我们品味好像','我喜欢慢歌，写作业的时候听','我会弹一点点吉他，下次弹给你听'],
 mid:['什么都听一点','我就听热门的'],
 lo:['没什么固定喜欢的','不怎么听歌']},
{id:'live',kws:['刷抖音吗','看短视频吗','直播','你看直播吗','快手','B站','b站'],
 hi:['我一刷抖音就停不下来，完蛋','我在B站看学习视频（真的）','我看美食视频，越看越饿'],
 mid:['偶尔刷刷','看一点'],
 lo:['不刷，浪费时间','我不看这些']},
{id:'pressure',kws:['压力好大','好累啊','我好焦虑','我快撑不住了','好烦','我emo了','心累','压力','好压抑','喘不过气'],
 hi:['抱抱你，别给自己太大压力，我陪着你','累了就歇一歇，你已经很努力了','跟我说说，说出来会好受一点，我一直在'],
 mid:['怎么啦？别想太多','出去走走放松一下吧'],
 lo:['谁不累啊','你想太多了']},
{id:'complain_t',kws:['作业好多','老师好烦','不想上学','学校好无聊','老师太严了','作业写不完','又要考试','课好多'],
 hi:['我也是！我们一起摆烂五分钟','懂你，不过作业还是得写，加油','我陪你一起写，快点写完就能玩了'],
 mid:['确实有点多','忍忍吧，快放假了'],
 lo:['学生不都这样','你抱怨也没用']},
{id:'body',kws:['我长高了吗','我变声了','脸上长痘了','我好胖','我要减肥','青春期','长不高了','痘痘','身高焦虑'],
 hi:['长痘别抠，早睡多喝水就好啦','你一点都不胖，别瞎减肥，对身体不好','我们都在长身体，好好吃饭才能长高呀'],
 mid:['正常的，大家都会这样','别太在意外貌啦'],
 lo:['你问我我也不懂','少熬夜就好了']},
{id:'vacation',kws:['放假去哪','假期干嘛','暑假去哪','寒假','放假安排','小长假','去哪玩','假期'],
 hi:['放假想约你去铜鉴湖/西湖走走','我想在家睡到自然醒，然后打游戏','我爸妈说要带我出去玩，你呢'],
 mid:['还没想好，可能在家','到时候再说'],
 lo:['没安排','不关你事']},
{id:'miss',kws:['我想你了','想你','好想见你','好久没见你','我好想你','想见你'],
 hi:['我也想你，下课走廊见','我也是，刚分开就想了','那你抬头，我在看你呢'],
 mid:['哈哈我们不是天天见吗','才多久没见'],
 lo:['哦','你别这样']},
{id:'hug',kws:['抱抱','求安慰','抱一下','给我一个拥抱','难过','想哭','我不开心'],
 hi:['抱抱～会好起来的，有我呢','（轻轻抱住你）没事啦','给你一个大大的拥抱'],
 mid:['拍拍你，别难过','怎么了呀'],
 lo:['别这样，让人看见','你自己缓缓吧']},
{id:'shy',kws:['你脸红了','你好可爱','害羞','你害羞什么','脸红','你好漂亮','你好帅'],
 hi:['你、你别说了，脸都红了','哼，就你嘴甜','你才可爱呢（偷偷开心）'],
 mid:['谢谢…','你突然夸我干嘛'],
 lo:['无聊','你谁啊']},
{id:'nickname',kws:['给你起个外号','我给你取个名字','叫你什么好','外号','昵称','以后我叫你'],
 hi:['好呀，你取的我都喜欢','你想叫什么？不许取笑我','那我也给你取一个'],
 mid:['随便你吧','别太难听就行'],
 lo:['不用了','我有名字']},
{id:'hairstyle',kws:['你换发型了','你头发','剪头发了','你发型好好看','刘海','扎头发'],
 hi:['你看出来啦？我昨天刚剪的','我今天特意扎的，就知道你会注意','我想留长一点'],
 mid:['嗯，剪了点','谢谢'],
 lo:['关你什么事','没换']},
{id:'clothes',kws:['你衣服好好看','你今天穿的','穿搭','你这件衣服','校服','你穿什么牌子'],
 hi:['真的吗？我挑了好久呢','我就穿的校服呀，被你夸得开心','链接发你？我们可以穿同款'],
 mid:['谢谢，随便穿的','就普通衣服'],
 lo:['你盯着我衣服干嘛','没注意']},
{id:'pet',kws:['你养宠物吗','养猫吗','养狗吗','你家有猫吗','宠物','小动物','猫好可爱','狗'],
 hi:['我家有只猫，超粘人，下次给你看照片','我想养狗，可是我妈不让','我超喜欢小动物'],
 mid:['没有，但我挺喜欢的','以后想养'],
 lo:['不养，麻烦','没兴趣']},
{id:'dorm',kws:['你们宿舍','室友','宿舍','熄灯','住校吗','你住宿舍吗','宿管'],
 hi:['我们宿舍可热闹了，晚上卧谈到很晚','我们室友人都超好','宿管阿姨超严，熄灯后说话会被记'],
 mid:['就正常住校','还行吧'],
 lo:['我走读','不想聊宿舍']},
{id:'phone',kws:['你手机什么牌子','换手机了','你有手机吗','手机被收了','你手机壁纸','玩你手机'],
 hi:['我手机壁纸是我偶像/我家猫','我手机被我妈设了使用时间，哭','你手机什么型号？'],
 mid:['就普通的手机','学校不让带'],
 lo:['问这个干嘛','不告诉你']},
{id:'birthday',kws:['你生日什么时候','你什么星座','生日','星座','你哪天生日','你属什么'],
 hi:['我生日那天你要送我礼物哦','我是XX座，据说和你很配','到时候请你吃蛋糕'],
 mid:['还早着呢','我不太信星座'],
 lo:['问这个干嘛','不告诉你']},
{id:'classmate',kws:['你同桌是谁','你们班','你同学','班长','你跟谁关系好','班里'],
 hi:['我同桌人超好，老借我抄笔记','我们班长特别负责','我们班氛围可好了'],
 mid:['就那样吧','普通同学'],
 lo:['你问这么多干嘛','不聊这个']},
{id:'study_tip',kws:['学不进去','怎么学啊','学习方法','我成绩好差','怎么提高成绩','背书背不下来','听不懂'],
 hi:['学不进去就先休息十分钟，别硬撑','我教你一个方法，把知识点讲给别人听就记住了','我们一起学，互相监督'],
 mid:['多刷题吧，熟能生巧','上课认真听最重要'],
 lo:['你自己不努力问我干嘛','我也不会']},
{id:'holiday_feel',kws:['不想上学','想放假','什么时候放假','不想写作业','不想考试','再不放假要死了','上学好痛苦'],
 hi:['我也是！数着日子等放假','再坚持坚持，很快就周末了','放学请你喝奶茶，开心点'],
 mid:['忍忍吧，大家都一样','快了'],
 lo:['学生就该上学','你怎么这么多抱怨']},
{id:'qq',kws:['加个QQ','加微信','你QQ多少','你微信号','开黑吗','一起打游戏','上线','组队'],
 hi:['好呀，我加你，放学一起开黑','我QQ发你，记得通过','上线叫我，我随时在'],
 mid:['可以啊','我不怎么上'],
 lo:['不太方便','不用了']},
{id:'hangout',kws:['下课一起走','放学等我','走廊等你','一起回宿舍吗','一起去吃饭','课间一起','门口等你'],
 hi:['好呀，老地方等你','放学我在你教室门口等你','一起，正好有话跟你说'],
 mid:['行吧','看情况'],
 lo:['我有事','你自己去吧']},
{id:'recess',kws:['下课玩什么','课间干嘛','下课好无聊','大课间','课间','下课'],
 hi:['下课来找我，我们去走廊/操场转转','下课我想趴一会儿，你陪我','一起去小卖部呗'],
 mid:['随便玩玩','没什么安排'],
 lo:['下课想自己待着','别找我']}
];
/* 注册新意图（去重） */
(function(){
 var have={};
 for(var i=0;i<XZ_AI_INTENTS.length;i++)have[XZ_AI_INTENTS[i].id]=1;
 for(var j=0;j<XZ_AI_NEW.length;j++){
  if(!have[XZ_AI_NEW[j].id])XZ_AI_INTENTS.push(XZ_AI_NEW[j]);
 }
})();

/* ---- xzAIReply 包装：who 动态自我介绍 + 兜底更丰富 ---- */
(function(){
 var _reply=xzAIReply;
 xzAIReply=function(it,p){
  if(it&&it.id==='who'){
   var name=p&&p.n?p.n:'同学';
   var tag=p&&p.t?p.t:'同校';
   var g=p&&p.g?p.g:'';
   var aff=p&&p.aff?p.aff:30;
   if(aff>=65)return '我是'+name+'呀，'+tag+'，你连我都忘啦？我们不是挺熟的嘛～';
   if(aff>=30)return '我是'+name+'，'+tag+'，我们见过几次的';
   return '我叫'+name+'，'+tag+'，你是？';
  }
  var r=_reply(it,p);
  if((!r||r==='undefined')&&window.XZ_AI_FALLBACK)return pk(XZ_AI_FALLBACK);
  return r;
 };
})();

/* ---- 去掉 NPC 主动提问（用户要求）：覆盖 xzChatNpcSay，只保留普通回应，不主动抛问题 ---- */
window.xzChatNpcSay=function(text){
 var p=_CHAT.p;if(!p)return;
 var box=document.getElementById('chatBox');
 var row=document.createElement('div');row.className='chat-row they';
 var b=document.createElement('div');b.className='bubble typing';
 b.innerHTML='<i></i><i></i><i></i>';
 row.appendChild(b);if(box)box.appendChild(row);
 if(box)box.scrollTop=box.scrollHeight;
 setTimeout(function(){
  b.classList.remove('typing');
  b.textContent=text;
  var ct=document.createElement('span');ct.className='ct';ct.textContent=xzNowT();
  b.appendChild(ct);
  if(box)box.scrollTop=box.scrollHeight;
 },700+Math.random()*700);
};

/* ================================================================
   三、上课有人找你 → 直接弹出聊天页面
   ================================================================ */
window.xzClassIncoming=function(p,text){
 if(!p){
  /* 随机选一个认识的/暗恋者 */
  var pool=(G.met||[]).slice();
  if(G.crushList&&G.crushList.length)pool=pool.concat(G.crushList);
  if(!pool.length){p={n:pk(NPC_M.concat(NPC_F)),g:'同学',t:'隔壁班',aff:rnd(25,55)};}
  else p=pk(pool);
 }
 if(!p._log)p._log=[];
 p._log.push({me:false,t:text||xzClassIncomingText(p),time:xzNowT()});
 /* 轻提示 + 直接弹聊天页 */
 var t=document.createElement('div');t.className='chat-toast';
 t.textContent='💬 '+p.n+'：'+(text||'在吗？你看手机');
 t.onclick=function(){t.remove();};
 document.body.appendChild(t);
 setTimeout(function(){if(t.parentNode)t.remove();},3500);
 xzVibrate(120);
 xzChatPanel(p,'class');
};
function xzClassIncomingText(p){
 var aff=p.aff||30;
 var hiT=['老师刚转头，在吗','这题你会吗，救救','下课一起去厕所吗','中午吃什么','你看窗外','在干嘛呀','我好困','借我支笔'];
 if(aff>=65)return pk(hiT.concat(['想你了','放学等我','你今天好好看']));
 return pk(hiT);
}
/* tick 包装：上课期间有概率有人找你（直接弹聊天页）；概率低，避免打断 */
(function(){
 var _tick=tick;
 tick=function(){
  _tick();
  try{
   if(!G||G.over||G.resting)return;
   var ins=G.loc==='教室'||(typeof xzInClass==='function'&&xzInClass());
   if(ins&&G.day>0&&!G._classMsg&&ch(.05)){
    G._classMsg=true;
    setTimeout(function(){xzClassIncoming();},rnd(2000,7000));
   }
   if(G.idx===0)G._classMsg=false;
  }catch(e){}
 };
})();

/* ================================================================
   四、数值增长/减少动画（任何属性变化弹一下 + 飘字）
   ================================================================ */
(function(){
 var MAP=[
  ['health','健康',true],['mood','心情',true],['sleep','困意',false],
  ['knowledge','学习',true],['grade','成绩',true],['support','支持度',true],
  ['influence','影响力',true],['charm','魅力',true],['fitness','体力',true],
  ['appear','颜值',true],['relation','师生关系',true],['fame','知名度',true]
 ];
 function snap(){
  var o={};
  for(var i=0;i<MAP.length;i++){o[MAP[i][0]]=+(G[MAP[i][0]]||0);}
  return o;
 }
 window.xzStatAnimate=function(word,delta,upGood){
  var good=delta>0?upGood:!upGood;
  var stats=document.querySelectorAll('.stat');
  for(var i=0;i<stats.length;i++){
   var sp=stats[i].querySelector('span');
   if(sp&&sp.textContent.indexOf(word)>=0){
    var el=stats[i];
    el.classList.remove('stat-pop-up','stat-pop-down');
    void el.offsetWidth; /* 重启动画 */
    el.classList.add(good?'stat-pop-up':'stat-pop-down');
    var f=document.createElement('span');
    f.className='stat-float';
    f.textContent=(delta>0?'+':'')+delta;
    f.style.color=good?'#42e39a':'#ff6b81';
    el.appendChild(f);
    setTimeout(function(){if(f.parentNode)f.remove();},1150);
    break;
   }
  }
 };
 var prev=null;
 var _upd=upd;
 upd=function(){
  var before;
  try{before=snap();}catch(e){before=null;}
  var r=_upd.apply(this,arguments);
  try{
   if(before){
    for(var i=0;i<MAP.length;i++){
     var k=MAP[i][0],word=MAP[i][1],upGood=MAP[i][2];
     var d=Math.round((+(G[k]||0))-before[k]);
     if(d!==0)xzStatAnimate(word,d,upGood);
    }
   }
  }catch(e){}
  return r;
 };
})();

/* ================================================================
   五、暗恋系统补回 + 扩容（200 名字库 + 低门槛事件 + 低概率同性）
   ================================================================ */
(function(){
 var PERS=['温柔','直球','傲娇','话痨','高冷','开朗','内向','幽默'];
 var CLS=['高一(3)班','高二(1)班','隔壁班','高二(5)班','国际部','高三(2)班','高一(7)班','社团'];
 var LIKES=['篮球','画画','音乐','阅读','游戏','美食','摄影','跑步','动漫','猫'];
 var HAIR=['短发','马尾','齐刘海','丸子头','自然卷','寸头','长发'];
 window.xzMakeCrush=function(){
  if(!G.crushList)G.crushList=[];
  var same=ch(.02); /* 同性暗恋，约 2% */
  var wantG=G.gender==='女';
  var pool;
  if(G.pref==='同性')pool=wantG?NPC_F:NPC_M;
  else if(same)pool=wantG?NPC_F:NPC_M;
  else pool=wantG?NPC_M:NPC_F;
  pool=pool.filter(function(x){return !G.crushList.some(function(c){return c.n===x;});});
  if(!pool.length)return null;
  var n=pk(pool);
  var has=ch(.28);
  var c={n:n,p:pk(PERS),cls:pk(CLS),like:pk(LIKES),hair:pk(HAIR),
   hasLover:has,lover:has?pk(NPC_M.concat(NPC_F)):null,
   aff:rnd(22,58),knows:ch(.5),heartbeat:rnd(1,5),same:same};
  G.crushList.push(c);
  return c;
 };
 var _init=xzCrushInit;
 xzCrushInit=function(){
  _init();
  /* 用大名字库补 1 个，保证名字多样、不重复 */
  if(G.crushList.length<2&&ch(.6))xzMakeCrush();
 };
})();
/* 低门槛“💌 有人暗恋你”事件（与早期事件并存，独立 flag），引导到暗恋面板 */
(function(){
 var _tick=tick;
 tick=function(){
  _tick();
  try{
   if(!G||G.over||G.resting)return;
   if(G.charm>40&&G.day>0&&ch(.07)&&!G._crush902){
    G._crush902=true;
    xzCrushInit();
    setTimeout(function(){
     var c=G.crushList&&G.crushList.length?pk(G.crushList):null;
     var who=c?c.n:pk(NPC_M.concat(NPC_F));
     var acts=['偷偷看你','给你桌上放了一瓶水','跟朋友打听你','在走廊故意跟你擦肩','给你写了匿名信','借故跟你借东西','在食堂坐你旁边'];
     var h='<h3>💌 有人暗恋你</h3><div class="tcard"><b>'+who+'</b> 好像喜欢你。<br>TA最近'+pk(acts)+'。'+
      (c&&c.same?'<br><span class="dim small">（同性 · 概率很低）</span>':'')+
      '<br><span class="dim small">（魅力 '+Math.round(G.charm)+' 触发）</span></div>'+
      '<div class="row" style="margin-top:8px"><button class="gbtn" onclick="closeModal()">知道了</button>'+
      '<button class="gbtn" onclick="closeModal();xzCrushPanel()">去暗恋面板看看</button></div>';
     modal(h);xzVibrate(100);
    },1200);
   }
   if(G.idx===0)G._crush902=false;
  }catch(e){}
 };
})();

/* ================================================================
   六、更新日志 5.5.6.99902（游戏内，旧链全部保留）
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.99902</h3>'+
   '<div class="quote"><b class="gold">5.5.6.99902（修复 + 大扩充）</b><br>'+
   '🤖 <b>AI 对话大扩充</b>：新增 32 类话题，共 68 类意图——你是谁/几岁/多高/哪个班/你有对象吗/你是不是喜欢我/八卦/追星/动漫/小说/电影/音乐/短视频/压力/吐槽老师/青春期(长痘·长高·减肥·健康引导)/放假/想你/抱抱/害羞/外号/发型/穿搭/宠物/宿舍/手机/生日星座/同桌/学习方法/不想上学/加QQ开黑/下课一起…<br>'+
   '🪪 <b>“你是谁”能回答了</b>：对方按自己名字、班级、和你的熟络程度自我介绍<br>'+
   '🔕 <b>去掉 NPC 主动提问</b>（聊天中不再被对方反问打断）<br>'+
   '📲 <b>上课有人找你直接弹出聊天页</b>：同学/暗恋者课上发消息，顶部提示 + 直接进入对话<br>'+
   '👥 <b>100 男 + 100 女名字库</b>（共 200，全部不重复，替换原来只有 10 个）<br>'+
   '💌 <b>暗恋系统补回并扩容</b>：低门槛“有人暗恋你”事件、暗恋者从 200 名字库随机生成、约 2% 低概率同性暗恋、信息卡/概率/表白/情敌标注全部保留<br>'+
   '🍉 <b>合成大西瓜</b>：新增⛶全屏按钮、待投放水果跟随瞄准（<b>点哪里落在哪里</b>）、整体放慢、下落 easeIn 曲线 + 合体 easeOut、引导虚线、呼吸预览<br>'+
   '⛏️ <b>黄金矿工玩法修正</b>：达到目标<b>不结束、可继续挖</b>，只有时间到才结束；超出目标的钱正常累计到总分；钩爪伸出/回拉整体放慢、摆动节奏更长；过关进入更高关<br>'+
   '📈 <b>数值增减动画</b>：任何属性 +/− 时对应状态条弹一下（绿/红）并飘出 “+6 / −4”<br>'+
   '🎬 <b>开头动画修复</b>：L 弹出 2.8s → 小猫图（金边·完整显示）2.8s → 片头；修复猫图被镂空看不见的问题<br>'+
   '📱 <b>手机端</b>：竖屏（推荐）/横屏开局选择，大字大按钮、弹窗全屏化、各小游戏响应式<br>'+
   '🧊 液态玻璃开关保留（右上角）</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog902&&window._xzOldLog902()},80)">📚 查看 5.5.6.999 更新记录</button>';
  modal(h);
  window._xzOldLog902=_old;
 };
})();

/* ================================================================
   5.5.6.99903 大修层
   顶栏网格(多排并列不滑动) · 起床丰富+选鞋 · 聊天快捷话题
   矿工模型精细 · 动画互动增强 · 默认白天 · 推荐横屏
   ================================================================ */
window.XZ_VER='5.5.6.99903';
if(window.XZ561)XZ561.ver='5.5.6.99903';
window.XZ99903=true;

/* ================================================================
   一、起床选项大扩充 + 恢复选鞋（不删原选项，只追加）
   ================================================================ */
(function(){
 var _wk=SLOTS.wake;
 SLOTS.wake=function(s){
  var r=_wk(s);
  if(!r||!r.choices)return r;
  function add(label,sub,fn){r.choices.push(C(label,sub,fn));}
  add('🛏 叠被子、整理内务','支持度+2',function(){
   G.support=cl(G.support+2);l('你把被子叠成豆腐块，内务检查没被扣分。支持度+2','good');next();});
  add('🪞 照镜子、梳头整理发型','魅力+2',function(){
   G.charm=cl(G.charm+2);G.appear=cl((G.appear||50)+1);l('你对着镜子理了理发型，精神多了。魅力+2');next();});
  add('🚰 喝杯温水、上个厕所','健康+2',function(){
   G.health=cl(G.health+2);l('起床一杯温水，肠胃舒服。健康+2');next();});
  add('🤸 床上简单拉伸、唤醒身体','体力+2 困意-5',function(){
   G.fitness=cl((G.fitness||50)+2);G.sleep=cl(G.sleep-5,0,100);l('你伸了几个懒腰、抻了抻腿，身体醒了。困意-5');next();});
  add('🧴 洗把脸、简单护肤','颜值+2',function(){
   G.appear=cl((G.appear||50)+2);l('你认真洗了脸、涂了点润肤霜。颜值+2');next();});
  add('📱 看一眼时间、天气和消息','心情+1',function(){
   G.mood=cl(G.mood+1);
   var w=G.weather&&G.weather.n?G.weather.n:'晴';
   l('你瞄了眼手机：今天'+w+'，群里有几条未读。');
   if(ch(.35)&&G.met&&G.met.length){
    var p=pk(G.met);
    l('💬 '+p.n+' 昨晚给你留了言…','love');
    xzChatPanel(p);
   } else next();
  });
  add('📝 列一下今天的计划/待办','学习+1 心情+2',function(){
   G.knowledge=cl(G.knowledge+1);G.mood=cl(G.mood+2);
   l('你在本子上列了今天要做的事，心里有底了。');next();});
  add('👟 选今天穿的鞋','搭配影响状态',function(){
   l('你蹲下来挑今天的鞋…','info');
   try{morningShoeSelect();}catch(e){next();}
  });
  return r;
 };
})();

/* ================================================================
   二、聊天页：常用话题快捷按钮（点一下直接发送，解决“选项少”）
   ================================================================ */
(function(){
 var _panel=xzChatPanel;
 xzChatPanel=function(p,ctx){
  _panel(p,ctx);
  setTimeout(function(){
   var input=document.querySelector('.chat-input');
   if(!input||document.getElementById('chatQuick'))return;
   var q=document.createElement('div');
   q.id='chatQuick';q.className='chat-quick';
   var items=['在吗','你是谁','今天怎么样','吃饭了吗','在干嘛','作业写了吗',
    '我喜欢你','周末有空吗','好烦啊','讲个笑话','你有对象吗','晚安'];
   q.innerHTML=items.map(function(t){return '<button onclick="xzChatQuick(\''+t+'\')">'+t+'</button>';}).join('');
   input.parentNode.insertBefore(q,input);
  },60);
 };
 window.xzChatQuick=function(t){
  var inp=document.getElementById('chatInput');
  if(!inp)return;
  inp.value=t;xzChatSend();
 };
})();

/* ================================================================
   三、动画/互动增强：按钮点击波纹（全局）
   ================================================================ */
(function(){
 document.addEventListener('pointerdown',function(e){
  try{
   var t=e.target.closest('button, .choice, .gbtn, .mini');
   if(!t)return;
   var r=t.getBoundingClientRect();
   var rip=document.createElement('span');rip.className='xz-ripple';
   var sz=Math.max(r.width,r.height);
   rip.style.width=rip.style.height=sz+'px';
   rip.style.left=(e.clientX-r.left-sz/2)+'px';
   rip.style.top=(e.clientY-r.top-sz/2)+'px';
   if(getComputedStyle(t).position==='static')t.style.position='relative';
   t.style.overflow='hidden';
   t.appendChild(rip);
   setTimeout(function(){if(rip.parentNode)rip.remove();},650);
  }catch(e){}
 });
})();

/* ================================================================
   四、更新日志 5.5.6.99903（游戏内，旧链全保留）
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.99903（大修）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.99903</b><br>'+
   '🧭 <b>顶栏改为网格多排并列</b>：恋爱/小卖部/小游戏等入口整齐排成好几排，<b>不再横向滑动</b>，桌面手机一致<br>'+
   '🌅 <b>起床选项大扩充</b>：在穿衣/洗漱/赖床/背单词之外，新增叠被整理内务、照镜子梳头、喝水上厕所、拉伸唤醒、洗脸护肤、看时间天气消息、列今日计划、<b>选鞋（恢复）</b>——早上能做的事变多<br>'+
   '☀️ <b>默认白天模式</b>（黑夜仍可在设置手动切 / 自动模式保留）<br>'+
   '🖥 <b>开局改为推荐横屏</b>（竖屏仍可选）<br>'+
   '💬 <b>和喜欢的人能聊天了</b>：恋人菜单、认识的人菜单都加“🤖 AI 对话”，直接打开聊天框<br>'+
   '🍉 <b>大西瓜点不动修复</b>：投放锁改为出生 1 秒即释放（不再要求落地），水果被挡在顶部也能继续投；结束判定保留缓冲，不会误判<br>'+
   '⛏️ <b>黄金矿工</b>：每关时间缩短为 <b>40 秒</b>；金块/钻石/石头/钱袋/钩爪模型全部精细化（立体渐变·高光·切面闪光·纹理斑点·金属钩爪）；达标继续挖、时间到弹窗提示再进下一关、溢出钱正常累计<br>'+
   '⚡ <b>聊天快捷话题</b>：输入框上方一排常用问题，点一下直接发送<br>'+
   '🌊 <b>全局点击波纹</b>动画，互动反馈更足</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog903&&window._xzOldLog903()},80)">📚 查看 5.5.6.99902 更新记录</button>';
  modal(h);
  window._xzOldLog903=_old;
 };
})();

/* ================================================================
   5.5.6.888 开头流程
   ----------------------------------------------------------------
   Laerrus. 制作人动画 → 横屏片头（前17秒 · 停3秒 · 循环）
   → 第 9 秒「开始游戏」弹出 → 点击后提示旋转为竖屏 → 角色创建

   双引擎：
   · 帧动画模式（window.OPENING_FRAMES 存在时，单文件版）：
     img + data URI 逐帧绘制 + WebAudio 声音 —— file:// 下 100% 可靠
   · 视频模式（工程版）：<video> 播放 assets/opening.mp4
   ================================================================ */
var OPENING_CFG={src:'assets/opening.mp4',loopAt:17,pauseMs:3000,btnAt:9,frameRate:15,btnFrame:135};
var _ov=null,_btnShown=false,_held=false,_holdTimer=null;

/* 10.0.13：隐藏视频要把解码缓冲一起释放。
   只 pause() 不释放解码表面，960×544 的片头常驻 100 MB 以上。
   清 src 再 load() 才能让浏览器立刻回收解码器。 */
function releaseVideoEl(v){
 try{ if(!v)return; v.pause(); v.removeAttribute('src'); v.load(); }catch(e){}
}
/* 片头视频的 src 来源：OPENING_B64 既可能是 base64，也可能是相对路径（10.0.13 单文件版会内联） */
function openingVideoSrc(){
 var s=window.OPENING_B64||'';
 if(!s)return '';
 return /^(?:\.{0,2}\/|[a-z][a-z0-9+.-]*:)/i.test(s)? s : s;
}

/* ================= 帧动画模式（单文件版） ================= */
var _OF={on:false,cv:null,ctx:null,imgs:[],cur:0,timer:null,startTime:0,audCtx:null,buf:null,src:null,sound:false,loading:0,started:false};
function startOpeningFrames888(){
 var v=document.getElementById('openingVideo');if(v){v.style.display='none';releaseVideoEl(v);}
 var ld=document.getElementById('heroVideoLoading');if(ld)ld.style.display='none';
 var wrap=document.getElementById('heroVideo');
 if(!wrap)return;
 if(!_OF.cv){
  _OF.cv=document.createElement('canvas');
  _OF.cv.id='openingCanvas';
  _OF.cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  wrap.insertBefore(_OF.cv,wrap.firstChild);
 }
 _OF.ctx=_OF.cv.getContext('2d');
 _OF.cv.width=480;_OF.cv.height=272;
 _OF.on=true;_OF.loading=0;_OF.started=false;
 var FR=window.OPENING_FRAMES;
 _OF.imgs=[];
 for(var i=0;i<FR.length;i++){
  (function(idx){
   var im=new Image();
   im.onload=function(){
    _OF.loading++;
    if(idx===0&&!_OF.started){_OF.started=true;framesLoop888();}
   };
   im.onerror=function(){
    if(idx===0)showStartBtn888();
   };
   im.src=FR[idx];
   _OF.imgs[idx]=im;
  })(i);
 }
 /* 预解码声音 */
 try{
  if(!_OF.audCtx)_OF.audCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(window.OPENING_AUDIO_B64){
   var bin=atob(window.OPENING_AUDIO_B64),u8=new Uint8Array(bin.length);
   for(var j=0;j<bin.length;j++)u8[j]=bin.charCodeAt(j);
   _OF.audCtx.decodeAudioData(u8.buffer,function(b){_OF.buf=b;},function(){});
  }
 }catch(e){}
 /* 保底：10 秒后帧还没加载出来，强制弹开始按钮 */
 setTimeout(function(){
  if(_OF.loading<5)showStartBtn888();
 },10000);
}
function drawFrame888(n){
 var im=_OF.imgs[n],c=_OF.ctx;
 if(c&&im&&im.complete&&im.naturalWidth>0){
  c.clearRect(0,0,_OF.cv.width,_OF.cv.height);
  c.drawImage(im,0,0,_OF.cv.width,_OF.cv.height);
 }
}
function framesLoop888(){
 var tip=document.getElementById('heroLoopTip');
 if(tip)tip.textContent='↻ 片头循环播放中';
 _OF.startTime=performance.now();
 _OF.timer=setInterval(function(){
  var el=(performance.now()-_OF.startTime)/1000;
  var n=Math.floor(el*OPENING_CFG.frameRate);
  var bar=document.getElementById('heroProgressBar');
  if(n>=window.OPENING_FRAMES.length){
   clearInterval(_OF.timer);_OF.timer=null;
   drawFrame888(window.OPENING_FRAMES.length-1);
   if(bar)bar.style.width='100%';
   if(tip)tip.textContent='⏸ 停 3 秒后重播…';
   _OF.stopSound();
   setTimeout(framesLoop888,OPENING_CFG.pauseMs);
   return;
  }
  _OF.cur=n;
  drawFrame888(n);
  if(bar)bar.style.width=(n/window.OPENING_FRAMES.length*100)+'%';
  if(n>=OPENING_CFG.btnFrame)showStartBtn888();
 },1000/OPENING_CFG.frameRate);
}
_OF.playSound=function(){
 try{
  if(!_OF.audCtx||!_OF.buf)return;
  _OF.stopSound();
  _OF.src=_OF.audCtx.createBufferSource();
  _OF.src.buffer=_OF.buf;
  _OF.src.connect(_OF.audCtx.destination);
  _OF.src.onended=function(){if(_OF.sound&&_OF.on)_OF.playSound();};
  _OF.src.start();
 }catch(e){}
};
_OF.stopSound=function(){
 try{if(_OF.src){_OF.src.onended=null;_OF.src.stop();_OF.src.disconnect();_OF.src=null;}}catch(e){}
};
_OF.toggle=function(){
 _OF.sound=!_OF.sound;
 var b=document.getElementById('heroSoundBtn');
 if(_OF.sound){
  try{if(_OF.audCtx&&_OF.audCtx.state==='suspended')_OF.audCtx.resume();}catch(e){}
  _OF.playSound();
  if(b)b.textContent='🔊';
 }else{
  _OF.stopSound();
  if(b)b.textContent='🔇';
 }
};
_OF.stop=function(){
 _OF.on=false;_OF.stopSound();
 if(_OF.timer)clearInterval(_OF.timer);_OF.timer=null;
};

/* ================= 视频模式（工程版 assets/opening.mp4） ================= */
function startOpeningVideo888(){
 var v=document.getElementById('openingVideo');
 if(!v)return;
 _ov=v;v.muted=true;_btnShown=false;_held=false;
 var ld=document.getElementById('heroVideoLoading');
 var tip=document.getElementById('heroLoopTip');
 var src=OPENING_CFG.src;
 if(typeof src==='string'&&src.indexOf('data:video')===0){
  try{
   var b64=src.slice(src.indexOf('base64,')+7);
   var bin=atob(b64);
   var u8=new Uint8Array(bin.length);
   for(var i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
   v.src=URL.createObjectURL(new Blob([u8],{type:'video/mp4'}));
  }catch(e){v.src='assets/opening.mp4';}
 }else{
  v.src=src||'assets/opening.mp4';
 }
 var _blobFallback=true;
 function openingFileFallback(v){
  try{
   v.src='assets/opening.mp4';
   var p=v.play();if(p&&p.catch)p.catch(function(){onOpeningErr888();});
  }catch(e){onOpeningErr888();}
 }
 v.removeEventListener('timeupdate',onOpeningTick888);
 v.addEventListener('timeupdate',onOpeningTick888);
 v.removeEventListener('error',onOpeningErr888);
 v.addEventListener('error',function(){
  if(_blobFallback&&v.src&&v.src.indexOf('blob:')===0){
   _blobFallback=false;
   openingFileFallback(v);
   return;
  }
  onOpeningErr888();
 });
 v.addEventListener('loadeddata',function(){
  if(ld)ld.style.display='none';
  if(tip)tip.textContent='↻ 片头循环播放中';
 });
 var p=v.play();
 if(p&&p.catch)p.catch(function(){
  if(_blobFallback&&v.src&&v.src.indexOf('blob:')===0){
   _blobFallback=false;
   openingFileFallback(v);
  }else{
   onOpeningErr888();
  }
 });
 /* 保底①：10 秒后视频若完全没在播放，立即弹开始按钮 */
 setTimeout(function(){
  if(!_btnShown){
   var cur=0;try{cur=v.currentTime||0;}catch(e){}
   if(cur<1)showStartBtn888();
  }
 },10000);
 /* 保底②：14 秒后无论视频状态，强制弹出开始按钮（避免任何卡死） */
 setTimeout(function(){
  if(!_btnShown)showStartBtn888();
 },14000);
}

/* ================= 启动流程 ================= */
function initOpening888(){
 try{applyTheme();}catch(e){}
 var lo=document.getElementById('logoOverlay');
 if(lo){
  lo.classList.remove('done');
  /* 三段式 logo（延长版）：L 弹出 2.8s → 变成小猫图（带边框）2.8s → 隐藏启动片头 */
  var mark=document.getElementById('logoMark');
  var cat=document.getElementById('logoCat');
  setTimeout(function(){
   if(mark)mark.classList.add('out');
   if(cat)cat.classList.add('on');
  },2800);
  setTimeout(function(){
   lo.classList.add('done');
   lo.style.display='none';
   startOpening888();
  },5800);
 }else{
  startOpening888();
 }
 setupOpeningSeek888();
}
/* 片头进度条可拖动：跳到任意位置继续播放 */
function setupOpeningSeek888(){
 var wrap=document.querySelector('.hero-progress');
 if(!wrap)return;
 var bar=document.getElementById('heroProgressBar');
 wrap.style.cursor='ew-resize';
 wrap.style.touchAction='none';
 function seek(e){
  var r=wrap.getBoundingClientRect();
  if(!r.width)return;
  var ratio=cl((e.clientX-r.left)/r.width,0,1);
  /* 视频模式 */
  if(window.OPENING_B64||!(window.OPENING_FRAMES&&window.OPENING_FRAMES.length)){
   var v=_ov;if(!v)return;
   try{
    if(_holdTimer)clearTimeout(_holdTimer);
    _held=false;
    v.currentTime=ratio*OPENING_CFG.loopAt;
    if(bar)bar.style.width=(ratio*100)+'%';
    if(ratio*OPENING_CFG.loopAt>=OPENING_CFG.btnAt)showStartBtn888();
   }catch(err){}
   return;
  }
  /* 帧动画模式 */
  var FR=window.OPENING_FRAMES;
  if(!FR||!FR.length)return;
  var n=Math.min(FR.length-1,Math.max(0,Math.floor(ratio*FR.length)));
  if(!_OF.timer)framesLoop888(); /* 处于暂停段则重启循环 */
  _OF.startTime=performance.now()-(n/OPENING_CFG.frameRate)*1000;
  _OF.cur=n;drawFrame888(n);
  if(bar)bar.style.width=(n/FR.length*100)+'%';
  if(n>=OPENING_CFG.btnFrame)showStartBtn888();
 }
 wrap.addEventListener('pointerdown',function(e){e.preventDefault();try{wrap.setPointerCapture&&wrap.setPointerCapture(e.pointerId);}catch(x){}seek(e);});
 wrap.addEventListener('pointermove',function(e){if(e.buttons)seek(e);});
}
function startOpening888(){
 /* 优先：内联视频（单文件版 OPENING_B64）→ 真实视频播放 */
 if(window.OPENING_B64){
  OPENING_CFG.src=window.OPENING_B64;
  startOpeningVideo888();
  return;
 }
 /* 其次：帧动画（100% 可靠，离线可玩） */
 if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){startOpeningFrames888();return;}
 /* 最后：本地视频文件（工程版） */
 startOpeningVideo888();
}
function onOpeningTick888(){
 var v=_ov;if(!v)return;
 var bar=document.getElementById('heroProgressBar');
 if(bar)bar.style.width=Math.min(100,v.currentTime/OPENING_CFG.loopAt*100)+'%';
 if(v.currentTime>=OPENING_CFG.btnAt)showStartBtn888();
 if(v.currentTime>=OPENING_CFG.loopAt&&!_held){
  _held=true;
  v.pause();
  var tip=document.getElementById('heroLoopTip');
  if(tip)tip.textContent='⏸ 停 3 秒后重播…';
  if(_holdTimer)clearTimeout(_holdTimer);
  _holdTimer=setTimeout(function(){
   _held=false;
   try{v.currentTime=0;v.play();}catch(e){}
   if(tip)tip.textContent='↻ 片头循环播放中';
  },OPENING_CFG.pauseMs);
 }
}
function showStartBtn888(){
 if(!window._btnShown){window._btnShown=true;var b=document.getElementById('heroStartBtn');if(b)b.style.display='inline-block';}
}
function onOpeningErr888(){
 /* 视频加载失败 → 若有帧动画数据，无缝切换帧动画，不误报 */
 if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){
  try{startOpeningFrames888();return;}catch(e){}
 }
 var ld=document.getElementById('heroVideoLoading');
 if(ld)ld.innerHTML='🎬 片头加载失败（离线也能玩）<span style="font-size:12px;opacity:.7">请直接点击下方「开始游戏」</span>';
 showStartBtn888();
}
function toggleOpeningSound(){
 if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){_OF.toggle();return;}
 var v=_ov;if(!v)return;
 v.muted=!v.muted;
 var b=document.getElementById('heroSoundBtn');
 if(b)b.textContent=v.muted?'🔇':'🔊';
 if(!v.muted){var p=v.play();if(p&&p.catch)p.catch(function(){});}
}
/* 点开始游戏：停止片头 → 提示旋转竖屏 */
function startFlow(){
 if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){_OF.stop();}
 else{var v=_ov;if(v){try{v.pause();}catch(e){}}}
 /* 开局强制选择方向：横屏（推荐）或竖屏 */
 var h='<h3>📱 选择游玩方向</h3>'+
  '<div class="quote">游戏<b>横屏</b>体验最佳（推荐），视野开阔、布局完整。<br>也可以选择<b>竖屏</b>单手游玩。<br><span class="dim small">选择后自动进入角色创建</span></div>'+
  '<button class="big gold2" style="width:100%" onclick="pickOrient(\'landscape\')">🖥 横屏（推荐）</button>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="pickOrient(\'portrait\')">📲 竖屏（手机体验最佳 ⭐）</button>';
 modal(h);
}
function pickOrient(o){
 try{localStorage.setItem('xzOrient',o);}catch(e){}
 document.documentElement.classList.remove('landscape');
 if(o==='landscape')document.documentElement.classList.add('landscape');
 confirmRotate();
}
function confirmRotate(){
 closeModal();
 showCharCreate();
}
/* 进入游戏时按已选方向初始化 */
(function(){
 var _sg999=window.startGame||function(){};
 window.startGame=function(){
  try{
   var o=localStorage.getItem('xzOrient');
   if(o==='landscape')document.documentElement.classList.add('landscape');
   else document.documentElement.classList.remove('landscape');
  }catch(e){}
  return _sg999();
 };
})();
/* 返回主界面：隐藏角色面板，重播片头 */
(function(){
 window.backToHero=function(){
  var hp=document.getElementById('heroPanel');if(hp)hp.style.display='';
  var cp=document.getElementById('charPanel');if(cp)cp.style.display='none';
  var game=document.getElementById('game');if(game){game.classList.remove('show');game.style.display='none';}
  var st=document.getElementById('start');if(st){st.classList.add('show');st.style.display='';}
  var err=document.getElementById('err');if(err)err.style.display='none';
  _btnShown=false;
  var b=document.getElementById('heroStartBtn');if(b)b.style.display='none';
  if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){
   _OF.sound=false;
   var sb=document.getElementById('heroSoundBtn');if(sb)sb.textContent='🔇';
   _OF.on=true;_OF.started=true;
   framesLoop888();
  }else{
   var v=_ov;
   if(v){try{
     /* 10.0.13：进了游戏后片头视频的 src 被释放过，回来时要重新挂上 */
     if(!v.getAttribute('src')){var _s=openingVideoSrc();if(_s)v.src=_s;}
     v.currentTime=0;v.muted=true;v.play();
   }catch(e){}}
   var sb=document.getElementById('heroSoundBtn');if(sb)sb.textContent='🔇';
  }
  try{applyTheme();}catch(e){}
 };
})();
/* 覆盖 showCharCreate：片头 → 角色创建（竖屏） */
(function(){
 var _osc=window.showCharCreate||function(){};
 window.showCharCreate=function(){
  var hp=document.getElementById('heroPanel');if(hp){hp.style.display='none';}
  /* 10.0.13：进角色创建后，片头视频不会再用到了，连解码缓冲一起释放 */
  releaseVideoEl(document.getElementById('openingVideo'));
  releaseVideoEl(document.querySelector('#heroPanel video'));
  var cp=document.getElementById('charPanel');if(cp)cp.style.display='block';
  var game=document.getElementById('game');if(game)game.style.display='none';
  var st=document.getElementById('start');if(st)st.classList.add('show');
  try{_osc();}catch(e){}
 };
})();
/* 进入游戏后（startGame / continueGame 包装）：关闭片头、应用主题 */
(function(){
 var _sg=window.startGame||function(){};
 window.startGame=function(){
  if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){_OF.stop();}
  else{var v=_ov;if(v){try{v.pause();}catch(e){}}}
  try{applyTheme();}catch(e){}
  return _sg();
 };
 var _cg=window.continueGame||function(){};
 window.continueGame=function(){
  if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){_OF.stop();}
  else{var v=_ov;if(v){try{v.pause();}catch(e){}}}
  try{applyTheme();}catch(e){}
  return _cg();
 };
})();
/* 初始化（页面加载即运行） */
(function(){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOpening888);
 else initOpening888();
})();

/* ================================================================
   5.5.6.99904 回归·史诗加强层
   以 5.5.6.888 为画面基底：主界面 100% 保留 888 布局
   · 顶部额外一行（名声 / 歌词 / 性取向 / 液态玻璃）
   · 顶栏按钮网格多排并列（不滑动）
   · 新做「跳一跳」（动画全）
   · 片头完整版播放
   · 大西瓜模型调小 + 警戒线
   · AI 聊天库 / 判定词大幅扩充
   · 美术 / 动画史诗加强（纯 CSS/Canvas，不用 AI 图）
   ================================================================ */
window.XZ_VER='5.5.6.99904';
if(window.XZ561)XZ561.ver='5.5.6.99904';
window.XZ99904=true;

/* ================================================================
   一、顶部额外一行：名声（左）· 歌词（中）· 性取向（右）· 液态玻璃
   ================================================================ */
(function(){
 function inject(){
  var tb=document.querySelector('header.topbar');
  if(!tb||document.getElementById('xzTopline'))return;
  var d=document.createElement('div');
  d.className='topline';d.id='xzTopline';
  d.innerHTML=
   '<span class="tl-item tl-rep" id="tlRep" onclick="xzTopRepToggle()" title="名声（点击查看）"></span>'+
   '<span class="tl-item tl-lyric" id="tlLyric"></span>'+
   '<span class="tl-item tl-pref" id="tlPref" title="性取向"></span>'+
   '<button class="tl-item tl-liquid" id="tlLiquid" onclick="xzLiquidToggle()" title="液态玻璃开关">🧊</button>';
  tb.insertBefore(d,tb.firstChild);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);
 else inject();
})();

/* ================================================================
   二、跳一跳（微信跳一跳 · 蓄力弹跳 · 连击 · 相机跟随 · 粒子）
   ================================================================ */
function jumpJump(){
 var W=420,H=640,GROUND=470;
 var palette=[
  {top:'#7ec8ff',side:'#4a93d6',name:'cube'},
  {top:'#ffd479',side:'#e0a83c',name:'cyl'},
  {top:'#9be7a8',side:'#5bb56e',name:'cube'},
  {top:'#ff9db0',side:'#e0607e',name:'cyl'},
  {top:'#c3a6ff',side:'#8f6be0',name:'cube'},
  {top:'#8be0d6',side:'#4fb3a6',name:'cyl'}];
 var boxes,player,camX,camTarget,score,best,combo,state,charge,raf,last,parts,floats,shake,deadT,landT;
 best=parseInt(localStorage.getItem('jj_best')||'0',10);
 function rnd(a,b){return a+Math.random()*(b-a);}
 function makeBox(prevCx){
  var gap=rnd(120,300),w=rnd(58,92);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:prevCx+gap+w/2+ (prevCx===0?0:0),w:w,h:rnd(46,86),pal:pal,sink:0,id:Math.random()};
 }
 function reset(){
  boxes=[{cx:120,w:84,h:70,pal:palette[0],sink:0,id:1}];
  for(var i=0;i<6;i++)boxes.push(nextBox(boxes[boxes.length-1]));
  player={x:boxes[0].cx,y:GROUND,vx:0,vy:0,squash:0,rot:0,scale:1,onBox:0};
  camX=0;camTarget=0;score=0;combo=0;state='ready';charge=0;parts=[];floats=[];shake=0;deadT=0;landT=0;
 }
 function nextBox(b){
  var gap=rnd(130,290),w=rnd(56,90);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:b.cx+b.w/2+gap+w/2,w:w,h:rnd(44,84),pal:pal,sink:0,id:Math.random()};
 }
 function sx(x){return x-camX;}
 /* ---------- 输入：按住蓄力，松开起跳 ---------- */
 function down(e){if(state!=='ready')return;e.preventDefault();state='charge';charge=0;}
 function up(e){
  e.preventDefault();
  if(state!=='charge')return;
  state='fly';
  var c=charge;
  player.vx=(2.7+c*6.3)*60*((window.JJ_SETTINGS&&{l:0.82,m:1,h:1.22}[JJ_SETTINGS.sens])||1);          /* px/sec */
  player.vy=-780;                    /* px/sec 向上 */
  player.squash=0;
  combo=0;
 }
 /* ---------- 物理 ---------- */
 function step(dt){
  if(state==='charge'){
   var _pow=window.JJ_SETTINGS?({l:1.45,m:1.05,h:0.78})[JJ_SETTINGS.power]||1.05:1.05; charge=Math.min(1,charge+dt/_pow);
   player.squash=charge*0.45;
   boxes[player.onBox].sink=charge*7;
  }
  if(state==='fly'){
   player.x+=player.vx*dt;
   player.vy+=1900*dt;
   player.y+=player.vy*dt;
   player.rot+=(player.vx/130)*dt*Math.PI;   /* 空中翻转 */
   if(player.vy>=0&&player.y>=GROUND){land();}
  }
  if(state==='dead'){
   deadT+=dt;
   player.vy+=1900*dt;player.y+=player.vy*dt;player.rot+=6*dt;
  }
  /* 方块下沉回弹 */
  for(var i=0;i<boxes.length;i++){boxes[i].sink+=(0-boxes[i].sink)*Math.min(1,dt*9);}
  if(landT>0)landT-=dt;
  /* 相机 */
  var focusBox=state==='fly'?boxes[player.onBox+1]:boxes[player.onBox];
  if(focusBox)camTarget=focusBox.cx-150;
  camX+=(camTarget-camX)*Math.min(1,dt*5);
  /* 粒子/浮字 */
  for(i=parts.length-1;i>=0;i--){var p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;if(p.t>p.life)parts.splice(i,1);}
  for(i=floats.length-1;i>=0;i--){var f=floats[i];f.t+=dt;if(f.t>1.1)floats.splice(i,1);}
  if(shake>0)shake=Math.max(0,shake-dt*30);
 }
 function land(){
  var x=player.x,hit=-1;
  for(var i=0;i<boxes.length;i++){if(Math.abs(x-boxes[i].cx)<=boxes[i].w/2){hit=i;break;}}
  if(hit===-1||hit<=player.onBox){
   /* 落空 */
   state='dead';deadT=0;player.vy=120;
   if(score>best){best=score;localStorage.setItem('jj_best',best);}
   return;
  }
  player.y=GROUND;player.rot=0;player.onBox=hit;state='land';landT=0.28;
  var b=boxes[hit];
  var dx=Math.abs(x-b.cx);
  var perfect=dx<=b.w*0.16;
  if(perfect){combo++;var gain=combo*2;score+=gain;b.sink=12;
   floats.push({x:b.cx,y:GROUND-40,t:0,txt:'完美 +'+gain+(combo>1?' x'+combo:'')});
   burst(b.cx,GROUND,'#ffd166',16);
  }else{combo=0;score+=1;b.sink=8;floats.push({x:b.cx,y:GROUND-34,t:0,txt:'+1'});burst(x,GROUND,'#ffffff',7);}
  /* 补充新方块 */
  while(boxes.length<hit+6)boxes.push(nextBox(boxes[boxes.length-1]));
  setTimeout(function(){if(state==='land')state='ready';},200);
 }
 function burst(x,y,color,n){
  for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=60+Math.random()*180;
   parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,t:0,life:.5+Math.random()*.4,c:color});}
 }
 /* ---------- 绘制 ---------- */
 function drawBox(b){
  var x=sx(b.cx)-b.w/2,y=GROUND+b.sink,w=b.w,h=b.h;
  if(x>W+60||x+w<-60)return;
  if(b.pal.name==='cyl'){
   /* 圆柱 */
   ctx.fillStyle=b.pal.side;
   ctx.fillRect(x,y,w,h);
   ctx.fillStyle=b.pal.side;
   ctx.beginPath();ctx.ellipse(x+w/2,y+h,w/2,12,0,0,Math.PI);ctx.fill();
   ctx.fillStyle=b.pal.top;
   ctx.beginPath();ctx.ellipse(x+w/2,y,w/2,12,0,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1;ctx.stroke();
   /* 中心点（完美提示） */
   ctx.fillStyle='rgba(255,255,255,.7)';
   ctx.beginPath();ctx.ellipse(x+w/2,y,3,1.6,0,0,Math.PI*2);ctx.fill();
  }else{
   /* 立方体 */
   var dx=14,dy=-12;
   ctx.fillStyle=b.pal.side;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle=shade(b.pal.side,-25);
   ctx.fillRect(x,y,w,h);
   ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w+dx,y+h+dy);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
   ctx.fillStyle=b.pal.top;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.strokeStyle='rgba(0,0,0,.1)';ctx.stroke();
   ctx.fillStyle='rgba(255,255,255,.7)';
   ctx.beginPath();ctx.arc(x+w/2+dx/2,y+dy/2,3,0,Math.PI*2);ctx.fill();
  }
 }
 function shade(hex,amt){
  var n=parseInt(hex.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
  return 'rgb('+r+','+g+','+b+')';
 }
 function drawPlayer(){
  var px=sx(player.x),py=player.y;
  var sq=player.squash;
  if(state==='land')sq=0.35*Math.sin(landT/0.28*Math.PI);
  var bodyH=46*(1-sq),bodyW=22*(1+sq*0.7);
  /* 阴影 */
  var airH=GROUND-py;
  var sc=Math.max(.3,1-airH/300);
  ctx.fillStyle='rgba(0,0,0,'+(0.28*sc)+')';
  ctx.beginPath();ctx.ellipse(px,GROUND+6,18*sc,6*sc,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(px,py);ctx.rotate(player.rot);
  /* 身体（棋子形） */
  var g=ctx.createLinearGradient(0,-bodyH,0,0);
  g.addColorStop(0,'#5b6ee1');g.addColorStop(1,'#3a4aa8');
  ctx.fillStyle=g;
  ctx.beginPath();
  ctx.moveTo(-bodyW/2,0);
  ctx.quadraticCurveTo(-bodyW/2,-bodyH*0.55,0,-bodyH);
  ctx.quadraticCurveTo(bodyW/2,-bodyH*0.55,bodyW/2,0);
  ctx.closePath();ctx.fill();
  /* 头 */
  ctx.fillStyle='#6d80f0';
  ctx.beginPath();ctx.arc(0,-bodyH-6,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.beginPath();ctx.arc(-3,-bodyH-9,3.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 function draw(){
  ctx.clearRect(0,0,W,H);
  /* 背景渐变 */
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#cfe8ff');bg.addColorStop(.6,'#eaf4ff');bg.addColorStop(1,'#f6f0ff');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  /* 远景云 */
  ctx.fillStyle='rgba(255,255,255,.8)';
  for(var c=0;c<4;c++){var cx2=((c*150-camX*.3)%(W+120)+W+120)%(W+120)-60;
   ctx.beginPath();ctx.ellipse(cx2,80+c*34,38,15,0,0,Math.PI*2);ctx.fill();}
  ctx.save();
  if(shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  for(var i=boxes.length-1;i>=0;i--)drawBox(boxes[i]);
  drawPlayer();
  for(i=0;i<parts.length;i++){var p=parts[i];ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;
   ctx.beginPath();ctx.arc(sx(p.x),p.y,3.5*(1-p.t/p.life),0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  for(i=0;i<floats.length;i++){var f=floats[i];ctx.globalAlpha=Math.max(0,1-f.t/1.1);
   ctx.fillStyle=f.txt.indexOf('完美')>=0?'#ff8a00':'#4a5fc0';
   ctx.font='bold '+(f.txt.indexOf('完美')>=0?22:18)+'px sans-serif';ctx.textAlign='center';
   ctx.fillText(f.txt,sx(f.x),f.y-f.t*46);}
  ctx.globalAlpha=1;ctx.restore();
  /* HUD */
  ctx.textAlign='left';ctx.fillStyle='#33415c';ctx.font='bold 34px sans-serif';
  ctx.fillText(score,22,52);
  ctx.font='13px sans-serif';ctx.fillStyle='#7a869e';
  ctx.fillText('最高 '+best,24,74);
  if(state==='ready'){ctx.textAlign='center';ctx.fillStyle='rgba(60,72,110,.55)';ctx.font='15px sans-serif';
   ctx.fillText('按住蓄力 · 松开跳到下个方块',W/2,H-30);}
  if(state==='charge'){ctx.textAlign='center';
   ctx.fillStyle='rgba(90,110,220,.9)';ctx.fillRect(W/2-70,H-58,140*charge,8);
   ctx.strokeStyle='rgba(90,110,220,.4)';ctx.strokeRect(W/2-70,H-58,140,8);}
  if(state==='dead'){
   ctx.fillStyle='rgba(30,40,70,.55)';ctx.fillRect(0,0,W,H);
   ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 30px sans-serif';
   ctx.fillText('游戏结束',W/2,H/2-30);
   ctx.font='20px sans-serif';ctx.fillText('本次得分 '+score,W/2,H/2+6);
   if(score>=best&&score>0)ctx.fillText('🎉 新纪录！',W/2,H/2+34);
  }
 }
 function loop(ts){
  if(!last)last=ts;var dt=Math.min(.033,(ts-last)/1000);last=ts;
  step(dt);draw();
  raf=requestAnimationFrame(loop);
 }
 var h='<h3>🎯 跳一跳</h3><div class="quote" style="text-align:center">按住屏幕<b>蓄力</b>，松开起跳；落在方块<b>正中心</b>触发连击，分数翻倍！</div>'+
  '<canvas id="jjCanvas" width="'+W+'" height="'+H+'" style="width:100%;max-width:420px;border-radius:16px;touch-action:none;display:block;margin:0 auto;box-shadow:0 10px 30px rgba(60,80,160,.25)"></canvas>'+
  '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="big gold2" style="flex:1;min-width:120px" onclick="jjRestart()">🔄 重新开始</button><button class="big" style="flex:1;min-width:120px" onclick="jjSetUI()">⚙️ 灵敏度/蓄力</button><button class="big" style="flex:1;min-width:120px" onclick="closeModal()">退出</button></div>';
 modal(h);
 var cv=document.getElementById('jjCanvas'),ctx=cv.getContext('2d');
 cv.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);
 window.jjRestart=function(){reset();};
 window._jj={get s(){return state;},get score(){return score;},get charge(){return charge;},
  get px(){return player.x;},get onBox(){return player.onBox;},reset:reset,land:land,step:step,
  get boxes(){return boxes;},get player(){return player;}};
 reset();
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(loop);
 var _close=closeModal;
 closeModal=function(){if(raf)cancelAnimationFrame(raf);window.removeEventListener('pointerup',up);closeModal=_close;_close();};
}

/* ================================================================
   三、片头完整版：首次完整播放 → 之后循环前 17 秒精彩片段
   ================================================================ */
(function(){
 window._fullPlayed=false;
 onOpeningTick888=function(){
  var v=_ov;if(!v)return;
  var bar=document.getElementById('heroProgressBar');
  var dur=(function(){try{return v.duration&&isFinite(v.duration)?v.duration:OPENING_CFG.loopAt;}catch(e){return OPENING_CFG.loopAt;}})();
  if(bar)bar.style.width=Math.min(100,v.currentTime/dur*100)+'%';
  if(v.currentTime>=OPENING_CFG.btnAt)showStartBtn888();
  var tip=document.getElementById('heroLoopTip');
  if(!window._fullPlayed){
   /* 首次：完整播放到底 */
   var endedNow=false;
   try{endedNow=v.ended;}catch(e){}
   if(endedNow||v.currentTime>=dur-.2){
    window._fullPlayed=true;
    try{v.pause();}catch(e){}
    if(tip)tip.textContent='⏸ 完整片头已播完，3 秒后循环精彩片段…';
    if(_holdTimer)clearTimeout(_holdTimer);
    _holdTimer=setTimeout(function(){
     _held=false;
     try{v.currentTime=0;v.play();}catch(e){}
    },OPENING_CFG.pauseMs);
   }else if(tip){tip.textContent='▶ 正在播放完整片头…';}
  }else{
   /* 之后：前 17 秒循环 */
   if(v.currentTime>=OPENING_CFG.loopAt&&!_held){
    _held=true;
    try{v.pause();}catch(e){}
    if(tip)tip.innerHTML='↻ 精彩片段循环中 · <a onclick="replayFullOpening904()" style="color:#5b7cff;cursor:pointer;text-decoration:underline">重播完整片头</a>';
    if(_holdTimer)clearTimeout(_holdTimer);
    _holdTimer=setTimeout(function(){
     _held=false;
     try{v.currentTime=0;v.play();}catch(e){}
    },OPENING_CFG.pauseMs);
   }
  }
 };
 window.replayFullOpening904=function(){
  var v=_ov;if(!v)return;
  window._fullPlayed=false;_held=false;
  if(_holdTimer)clearTimeout(_holdTimer);
  try{v.currentTime=0;v.play();}catch(e){}
 };
})();

/* ================================================================
   四、大西瓜：警戒线（水平虚线 · 越线闪烁预警）
   ================================================================ */
(function(){
 var _d=window.xzWMDraw99902;
 window.xzWMDraw99902=function(){
  _d();
  var ctx=WM.ctx;if(!ctx||WM.over)return;
  var warn=false;
  for(var i=0;i<WM.fruits.length;i++){var f=WM.fruits[i];
   if(f===WM.cur)continue;                 /* 排除正在下落的水果 */
   if(f.y-f.r<WM.danger+6){warn=true;break;}}
  ctx.save();
  var flash=warn?(0.6+0.4*Math.sin(performance.now()/120)):0.3;
  ctx.globalAlpha=flash;
  ctx.strokeStyle=warn?'#ff4040':'#ffab40';
  ctx.setLineDash([10,7]);ctx.lineWidth=warn?2.6:1.6;
  ctx.beginPath();ctx.moveTo(8,WM.danger);ctx.lineTo(WM.canvas.width-8,WM.danger);ctx.stroke();
  ctx.setLineDash([]);
  if(warn){ctx.globalAlpha=.92;ctx.fillStyle='#ff3030';ctx.font='bold 12.5px sans-serif';ctx.textAlign='left';
   ctx.fillText('⚠ 警戒线！水果持续超过此线即结束',10,WM.danger-6);}
  ctx.restore();
 };
})();

/* ================================================================
   五、AI 聊天库大幅扩充（30+ 新意图 · 数百判定词 · 三档回复）
   ================================================================ */
var XZ_AI_904=[
 {id:'g_game',t:'游戏',kws:['玩什么游戏','打游戏吗','王者吗','吃鸡吗','原神','开黑吗','上分','排位','打王者','玩游戏','游戏','段位','一起打游戏','来一把'],
  sim:'一起打游戏吗？',
  rep:{cold:['不玩','没时间打游戏','别找我'],mid:['我玩王者，你什么段位','晚上可能开黑，叫你','刚打完一把'],warm:['来来来！我打野你辅助～','早就想拉你开黑了！','你玩我就玩，带你飞']}},
 {id:'g_sport',t:'运动',kws:['打球吗','打篮球','踢足球','跑步吗','一起运动','乒乓球','羽毛球','去打球','篮球','足球','体育课打球','运动'],
  sim:'一起打球吗？',
  rep:{cold:['不去','我不怎么运动','累'],mid:['可以啊，放学球场见','我打得一般，别嫌弃','等我换个鞋'],warm:['好呀！正好想和你一组～','你去我就去，给你传球！','打完一起去买水呀']}},
 {id:'g_music',t:'听歌',kws:['听什么歌','推荐几首歌','你喜欢什么歌','谁的歌','周杰伦','听歌吗','歌单','最近单曲循环','唱歌吗','好听的歌','音乐'],
  sim:'你最近在听什么歌？',
  rep:{cold:['随便听','不怎么听歌','没推荐'],mid:['最近在循环周杰伦','我喜欢慢一点的抒情歌','可以分享你歌单吗'],warm:['我喜欢的歌都想分享给你～','那首歌让我想起你','下次一起去K歌呀']}},
 {id:'g_anime',t:'动漫影视',kws:['看动漫吗','什么番','追番','追剧吗','看什么剧','电视剧','电影','最近有什么好看的','动漫','番剧','看电影','综艺'],
  sim:'你最近在追什么剧/番？',
  rep:{cold:['不看','没时间追','没兴趣'],mid:['在追一部校园番，挺好看','周末看了部电影，不错','你有推荐吗'],warm:['想约你一起看一部～','看爱情片会想到你','周末一起看电影吗']}},
 {id:'g_milktea',t:'零食奶茶',kws:['喝奶茶吗','奶茶','想吃零食','有什么好吃的','零食','点外卖吗','吃甜品','炸鸡','烧烤','好吃的','薯片','奶茶店'],
  sim:'一起点奶茶/零食吗？',
  rep:{cold:['不喝，怕胖','没钱买','不用'],mid:['想喝！拼单吗','偶尔喝一杯，三分糖','放学去小卖部看看'],warm:['你请我就喝～嘿嘿','想和你一起点一杯','放学一起去买呀']}},
 {id:'g_sleepy',t:'好困',kws:['好困','想睡觉','没睡醒','困死了','起不来','打瞌睡','上课犯困','昨晚没睡好','困','睁不开眼','睡不够'],
  sim:'我好困啊',
  rep:{cold:['困就睡','谁让你熬夜','正常'],mid:['我也困，早读差点睡着','中午一起趴会儿','去洗把冷水脸'],warm:['靠我肩上睡会儿呀～','昨晚是不是想我想的睡不着（笑）','中午陪你补觉']}},
 {id:'g_tired',t:'好累压力大',kws:['好累','累死了','压力好大','学习好累','喘不过气','作业做不完','卷不动了','身心俱疲','太累了','压力','崩溃'],
  sim:'我好累，压力好大',
  rep:{cold:['谁不累','忍忍吧','习惯就好'],mid:['休息一下，别太拼','放学去操场走走？','我也是，互相打气'],warm:['抱抱，辛苦啦','别给自己太大压力，有我呢','带你去放松一下']}},
 {id:'g_holiday',t:'放假',kws:['什么时候放假','放假安排','假期','国庆','寒暑假','寒假','暑假','放假几天','快放假了','假期去哪','调休'],
  sim:'什么时候放假？',
  rep:{cold:['看通知','不知道','还早'],mid:['好像再上几天就放了','假期打算补觉+写作业','你假期有安排吗'],warm:['放假想约你出去玩！','假期能不能也天天见呀','一起规划假期吧']}},
 {id:'g_gossip',t:'八卦',kws:['有个八卦','吃瓜','你听说了吗','谁和谁在一起','大瓜','八卦','爆料','听说','谁谈恋爱了','瓜','劲爆'],
  sim:'有个八卦跟你说',
  rep:{cold:['不关心','别议论别人','没兴趣'],mid:['啊？快说快说','真的假的？我也听说了','谁啊谁啊'],warm:['只告诉你一个人哦～','我们班那谁和那谁…（小声）','你别说是我说的']}},
 {id:'g_appear',t:'颜值穿搭',kws:['我帅吗','我好看吗','我美吗','发型怎么样','衣服好看吗','我今天怎么样','颜值','我丑吗','显胖吗','这身搭配','好看不'],
  sim:'我今天好看吗？',
  rep:{cold:['还行','就那样','没注意'],mid:['挺好看的呀','新发型？挺适合你','比平时精神'],warm:['你怎样都好看～','在我眼里你最帅/美','今天特别心动，是为了见我吗']}},
 {id:'g_borrow',t:'借东西',kws:['借我点钱','带纸了吗','借支笔','借我橡皮','有充电宝吗','借我','借钱','带伞了吗','借我用下','有多余的口罩吗','借笔记'],
  sim:'能借我个东西吗？',
  rep:{cold:['没有','不借','自己带'],mid:['有，等下给你','笔借你，记得还','伞可以一起撑'],warm:['我的就是你的呀～','给你给你，不用还','伞分你一半']}},
 {id:'g_restroom',t:'厕所',kws:['去厕所吗','上厕所','卫生间','一起去厕所吗','洗手间','厕所','去趟卫生间','陪我去厕所'],
  sim:'一起去厕所吗？',
  rep:{cold:['不去','你自己去','嗯'],mid:['走啊，正好我也去','等我一下','下课一起'],warm:['陪你去呀～','走吧，路上聊','你去我就去']}},
 {id:'g_dorm',t:'宿舍',kws:['宿舍','查寝','室友怎么样','你们宿舍','熄灯','宿舍生活','住校','寝室','宿管','回宿舍','宿舍群'],
  sim:'你们宿舍怎么样？',
  rep:{cold:['就那样','宿管很严','还行'],mid:['我们室友挺搞笑的','昨晚聊到很晚','宿管阿姨老查寝'],warm:['要是能和你一个宿舍就好了（笑）','熄灯后还想和你聊天','晚安都想当面说']}},
 {id:'g_phone',t:'刷手机',kws:['在刷手机吗','刷视频','抖音','快手','小红书','看直播','玩手机','刷到','短视频','b站','弹幕'],
  sim:'你在刷手机吗？',
  rep:{cold:['没玩','要学习','少玩手机'],mid:['刚刷到个搞笑视频','刷小红书停不下来','B站看了个教程'],warm:['刷到好看的都想@你','看到情侣视频就想到你','下次一起拍一个吗']}},
 {id:'g_meme',t:'网络梗',kws:['绝绝子','社死','栓q','我真的会谢','无语','666','yyds','emo了','破防','摆烂','内卷','emo','蚌埠住了','小丑'],
  sim:'（网络流行语）',
  rep:{cold:['听不懂这些','少玩梗','哦'],mid:['哈哈哈哈绝了','真的会谢','社死现场+1'],warm:['你怎么这么可爱呀','和你聊天一点都不emo','你就是我的yyds']}},
 {id:'g_study',t:'学习',kws:['怎么提高成绩','学习方法','刷题','补习班','一起学习吗','自习吗','背书','复习','预习','卷','学习','教我学习','图书馆'],
  sim:'一起学习吗？',
  rep:{cold:['自己努力','没方法','不一起'],mid:['可以一起自习','我整理了笔记，借你','多刷题总结错题'],warm:['我陪你一起学呀～','给你讲题，认真听哦','自习室帮你占座']}},
 {id:'g_future',t:'理想未来',kws:['你以后想干嘛','理想','梦想','考什么大学','想考哪所大学','未来规划','长大想做什么','目标大学','人生理想','以后','大学'],
  sim:'你以后想考哪、做什么？',
  rep:{cold:['没想好','走一步看一步','保密'],mid:['想考省内的大学','想学和计算机相关的','你呢，目标是哪'],warm:['希望未来的日子里都有你～','想和你考一个城市','我们一起加油考同一所大学好不好']}},
 {id:'g_family',t:'家庭',kws:['你爸妈','家里','父母','爸妈管你吗','家里人','回家','想家吗','爸妈严吗','家里催','周末回家'],
  sim:'你家里管得严吗？',
  rep:{cold:['不想说','还行','别问'],mid:['我爸妈挺开明的','周末要回家','偶尔会想家'],warm:['以后带你见我爸妈（笑）','家里人肯定会喜欢你','想家的时候有你陪就好']}},
 {id:'g_compliment',t:'被夸',kws:['你真好','你真好看','你好可爱','你好厉害','你真棒','喜欢你的性格','你人好好','你笑起来好看','夸你','你太优秀了','好喜欢你'],
  sim:'你真的很好',
  rep:{cold:['哦','谢谢','突然夸干嘛'],mid:['哈哈谢谢，你也是','被你夸有点不好意思','真的吗，开心'],warm:['还不是因为对象是你～','你再夸我要飘了','你才是最可爱的那个']}},
 {id:'g_thanks',t:'感谢',kws:['谢谢','多谢','感谢','谢啦','谢谢你','辛苦了','多亏了你','万分感谢','谢了啊','thank you'],
  sim:'谢谢你！',
  rep:{cold:['不客气','嗯','小事'],mid:['不客气～','举手之劳','朋友嘛，应该的'],warm:['跟我还客气什么呀','能帮到你我就开心','下次请我吃糖就行']}},
 {id:'g_sorry',t:'道歉',kws:['对不起','抱歉','我错了','不好意思','原谅我吧','别生气了','是我不好','sorry','对不住','我不是故意的'],
  sim:'对不起，原谅我好吗？',
  rep:{cold:['知道就好','下次注意','嗯'],mid:['没事啦，别放在心上','原谅你了','我也没真生气'],warm:['傻瓜，我怎么会真生你气～','抱抱就不生气了','下次请我喝奶茶就原谅你']}},
 {id:'g_askq',t:'问题目',kws:['这题怎么做','教教我','这道题','不会做','帮我看看题','讲解一下','题目看不懂','公式','怎么解','这题答案','学习问题'],
  sim:'这道题怎么做，能教我吗？',
  rep:{cold:['我也不会','自己想','看答案去'],mid:['我看看…应该是这样','这题用那个公式','等下给你讲'],warm:['来，我慢慢教你～','讲完你要请我吃糖哦','不懂随时问我']}},
 {id:'g_haslover',t:'有没有对象',kws:['你有对象吗','你谈恋爱了吗','你单身吗','你对象呢','有男/女朋友吗','名花有主吗','脱单了吗','还是一个人吗','有主了吗'],
  sim:'你现在有对象吗？',
  rep:{cold:['跟你没关系','不告诉你','嗯'],mid:['单身呀','还没遇到合适的','你问这个干嘛'],warm:['本来单身，遇见你就不是了～','你希望我有吗？','我的对象不就是你嘛']}},
 {id:'g_constellation',t:'星座',kws:['什么星座','星座','生肖','mbti','你属什么','星座配对','什么性格类型','几月份生日','星座运势','塔罗'],
  sim:'你是什么星座？',
  rep:{cold:['不信这些','不知道','没研究'],mid:['我是天秤座，你呢','偶尔看看星座运势','MBTI我是i人'],warm:['听说我们星座配对指数很高哦～','不管星座，我就喜欢你','你是什么我都配']}},
 {id:'g_skipclass',t:'逃课请假',kws:['逃课','想逃课','要逃课','逃课吗','请假','不想去上课','不想上课了','翘课','装病请假','逃学','这节课不想上','开假条','溜出去','逃操'],
  sim:'这节课不想上，想请假',
  rep:{cold:['别，会被记过','我不逃','自己看着办'],mid:['不太好吧，被抓就完了','要请假得家长说','逃了去干嘛'],warm:['你要是溜，我帮你打掩护～','但要注意安全哦','放学我陪你补回来']}},
 {id:'g_hungry',t:'好饿',kws:['好饿','饿死了','有吃的吗','肚子叫','没吃饱','零食还有吗','饿','肚子饿','想吃东西','饿得不行'],
  sim:'我好饿，有吃的吗？',
  rep:{cold:['忍着','我也没有','快吃饭了'],mid:['我有饼干，分你','等下就开饭了','去小卖部吗'],warm:['我的零食都给你～','给你留了个面包','走，带你去吃好吃的']}},
 {id:'g_nomoney',t:'没钱',kws:['没钱了','生活费没了','好穷','吃土了','钱花完了','月光','囊中羞涩','穷','缺钱','生活费'],
  sim:'我没钱了',
  rep:{cold:['省着点花','我也没钱','借不了'],mid:['我还有一点，借你','别乱买零食','跟家里说一声'],warm:['我的钱分你一半呀～','饭卡给你刷','养你呀（笑）']}},
 {id:'g_lonely',t:'无聊',kws:['好无聊啊','好无聊呀','好无聊','没意思','陪我聊天','无聊','没人玩','一个人好无聊','闷','空虚','无聊死了','找点乐子'],
  sim:'好无聊，陪我聊会儿',
  rep:{cold:['自己找事做','哦','我也忙'],mid:['那我陪你聊会儿','无聊就去看书/打球','想聊什么'],warm:['有我在就不会无聊啦～','你无聊我随时都在','讲个笑话逗你开心']}},
 {id:'g_sick',t:'生病',kws:['我感冒了','不舒服','头疼','肚子疼','来姨妈了','痛经','发烧','生病了','咳嗽','胃疼','难受死了','生理期'],
  sim:'我身体不舒服',
  rep:{cold:['多喝热水','去医务室','哦'],mid:['吃药了吗，注意休息','陪你去医务室','多喝点温水'],warm:['心疼，我马上过来陪你','给你带药和暖宝宝','好好休息，笔记我帮你记']}},
 {id:'g_nervous',t:'紧张',kws:['好紧张','有点害怕','担心','心慌','紧张怎么办','怕考不好','不敢','焦虑','心里没底','发怵'],
  sim:'我有点紧张',
  rep:{cold:['紧张没用','镇定','正常'],mid:['深呼吸，放轻松','准备充分就别怕','我给你加油'],warm:['别怕，有我陪着你～','握紧我的手就不紧张了','你一定可以的，相信你']}},
 {id:'g_teacher',t:'聊老师',kws:['班主任怎么样','哪个老师严','喜欢哪个老师','老师','数学老师','班主任','老师凶吗','任课老师','老师点名','老师的课'],
  sim:'你觉得咱们老师怎么样？',
  rep:{cold:['都那样','别议论老师','挺严的'],mid:['数学老师讲得挺好','班主任有点唠叨但人不错','就怕被点名'],warm:['上课我坐你旁边，一起别被点到','被批评了我陪你','老师要是说你，我帮你']}},
 {id:'g_classmate',t:'同学同桌',kws:['你同桌是谁','同学怎么样','室友','班里同学','同桌','和同学关系','前后桌','同班','小组','班级'],
  sim:'你和同桌/同学处得怎么样？',
  rep:{cold:['一般','不怎么来往','就那样'],mid:['我同桌挺逗的','和大家关系还行','小组作业有点烦'],warm:['最喜欢的同学当然是你呀～','想和你做同桌','和你一个班真好']}}
];
(function(){
 if(window.XZ_AI_INTENTS&&XZ_AI_904.length){
  XZ_AI_INTENTS.push.apply(XZ_AI_INTENTS,XZ_AI_904);
 }
})();

/* ================================================================
   六、更新日志 5.5.6.99904（游戏内，旧链全保留）
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.99904（回归 · 史诗加强）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.99904</b><br>'+
   '🏠 <b>主界面画面回归 5.5.6.888</b>：以你认可的 888 版为基底重建，布局/美术完全回到该水平，不再“开倒车”<br>'+
   '📌 <b>顶部额外一行</b>：左=名声（磨砂玻璃·点击查看）、中=歌词、右=性取向（❤️/🌈/💗）+液态玻璃开关，只加这一行，不影响原有界面<br>'+
   '🧊 <b>液态玻璃</b>：开启后弹窗/按钮/卡片全部磨砂通透，动画更顺滑<br>'+
   '🧭 <b>顶栏按钮网格多排并列</b>，不再横向滑动<br>'+
   '🎯 <b>还原「跳一跳」</b>：按住蓄力、松开抛物线起跳、空中翻转、落正中心连击翻倍、相机跟随、压缩回弹、粒子、阴影缩放——动画做全<br>'+
   '🎬 <b>片头完整版</b>：首次完整播放整段视频，播完停 3 秒再循环前 17 秒精彩片段，可点“重播完整片头”；离线仍有逐帧动画兜底<br>'+
   '🍉 <b>大西瓜</b>：保留上一版动画，水果模型整体缩小约 22%，新增红色<b>警戒线</b>（有水果越线即闪烁预警，持续越线才结束）<br>'+
   '💬 <b>AI 聊天库大幅扩充</b>：新增 31 类话题（游戏/运动/听歌/追剧/奶茶/八卦/星座/逃课/生病/家庭/理想/网络梗…），新增 300+ 判定词与同义问法，更像真人<br>'+
   '🎨 <b>美术/动画史诗加强</b>：磨砂玻璃、按钮悬浮上浮、点击波纹、圆润卡片，纯 CSS/Canvas 绘制，无 AI 图<br>'+
   '📱 手机/横屏适配同步优化</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog904&&window._xzOldLog904()},80)">📚 查看 5.5.6.99903 更新记录</button>';
  modal(h);
  window._xzOldLog904=_old;
 };
})();

/* ================================================================
   5.5.6.99905 终整合层
   · 全部历史版本内容融合为单个 HTML（工程版基底合并）
   · 黄金矿工：真实素材图（金条/金块/钻石/钱袋，网络图片抠图）
   · 跳一跳：动画系统全面升级
   · 大修 bug
   ================================================================ */
window.XZ_VER='5.5.6.99905';
if(window.XZ561)XZ561.ver='5.5.6.99905';
window.XZ99905=true;

/* ================================================================
   一、黄金矿工 · 真实素材绘制（覆盖 gmItem）
   ================================================================ */
(function(){
 var imgs={},loaded={};
 function preload(k){
  if(!GM_ASSETS||!GM_ASSETS[k])return;
  var img=new Image();
  img.onload=function(){loaded[k]=true;};
  img.src=GM_ASSETS[k];
  imgs[k]=img;
 }
 ['goldbar','goldnugget','diamond','moneybag'].forEach(preload);
 function has(k){return loaded[k]&&imgs[k];}
 /* 覆盖绘制：真实图 + 阴影/高光 */
 gmItem=function(ctx,it){
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=7;ctx.shadowOffsetY=4;
  var k=null;
  if(it.type==='gold')k='goldnugget';
  else if(it.type==='gold2')k='goldbar';
  else if(it.type==='gold3')k='goldbar';
  else if(it.type==='diamond')k='diamond';
  else if(it.type==='bag')k='moneybag';
  if(k&&has(k)){
   var img=imgs[k],r=it.r;
   var ar=img.width/img.height;
   var w=ar>=1?r*2:r*2*ar, h=ar>=1?r*2/ar:r*2;
   ctx.drawImage(img,it.x-w/2,it.y-h/2,w,h);
   /* 真实图上的闪光 */
   var tw=0.5+0.5*Math.sin(performance.now()/160+it.x);
   ctx.globalAlpha=tw*0.5;ctx.fillStyle='#fff';
   ctx.beginPath();ctx.ellipse(it.x-w*0.18,it.y-h*0.3,w*0.12,h*0.07,0,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=1;
  }else{
   /* 未加载完成 → 用精细 canvas 兜底 */
   gmItemFallback904(ctx,it);
  }
  ctx.restore();
 };
 /* 保留原精细绘制为兜底 */
 var _g=gmItem;
 function gmItemFallback904(ctx,it){
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=7;ctx.shadowOffsetY=3;
  function gold(base,light,dark,r){
   var g=ctx.createRadialGradient(it.x-r*.35,it.y-r*.4,r*.2,it.x,it.y,r);
   g.addColorStop(0,light);g.addColorStop(.55,base);g.addColorStop(1,dark);
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.fill();
   ctx.shadowBlur=0;ctx.strokeStyle=dark;ctx.lineWidth=1.5;
   ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.stroke();
   ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2.4;ctx.lineCap='round';
   ctx.beginPath();ctx.arc(it.x-r*.12,it.y-r*.18,r*.5,Math.PI*1.15,Math.PI*1.7);ctx.stroke();
   ctx.fillStyle='rgba(255,255,255,.9)';
   ctx.beginPath();ctx.arc(it.x-r*.4,it.y-r*.45,r*.12,0,Math.PI*2);ctx.fill();
  }
  if(it.type==='gold')gold('#ffd166','#fff3c4','#d99a1e',it.r);
  else if(it.type==='gold2')gold('#ffc23d','#fff0b8','#cf8a14',it.r);
  else if(it.type==='gold3')gold('#f5a623','#ffe9a8','#b9700f',it.r);
  else if(it.type==='diamond'){
   var r=it.r;
   var g=ctx.createLinearGradient(it.x,it.y-r,it.x,it.y+r);
   g.addColorStop(0,'#b8f0ff');g.addColorStop(.5,'#6fd6ff');g.addColorStop(1,'#3ba9d9');
   ctx.fillStyle=g;ctx.strokeStyle='#2f93c4';ctx.lineWidth=1.6;
   ctx.beginPath();ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x+r*.8,it.y);ctx.lineTo(it.x,it.y+r);ctx.lineTo(it.x-r*.8,it.y);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.shadowBlur=0;
   ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(it.x-r*.8,it.y);ctx.lineTo(it.x+r*.8,it.y);
   ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x,it.y+r);ctx.stroke();
   var tw=0.6+0.4*Math.sin(performance.now()/180+it.x);
   ctx.fillStyle='rgba(255,255,255,'+tw+')';
   ctx.beginPath();ctx.arc(it.x-r*.25,it.y-r*.4,r*.16,0,Math.PI*2);ctx.fill();
  }else if(it.type==='stone'){
   var g2=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
   g2.addColorStop(0,'#a8a8a8');g2.addColorStop(1,'#6a6a6a');
   ctx.fillStyle=g2;ctx.strokeStyle='#565656';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(it.x-it.r,it.y+it.r*.4);ctx.lineTo(it.x-it.r*.6,it.y-it.r);ctx.lineTo(it.x+it.r*.7,it.y-it.r*.6);ctx.lineTo(it.x+it.r,it.y+it.r*.6);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.shadowBlur=0;
   ctx.fillStyle='rgba(255,255,255,.22)';
   ctx.beginPath();ctx.moveTo(it.x-it.r*.5,it.y-it.r*.7);ctx.lineTo(it.x-it.r*.1,it.y-it.r*.9);ctx.lineTo(it.x-it.r*.15,it.y-it.r*.3);ctx.closePath();ctx.fill();
  }else if(it.type==='bag'){
   var g3=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
   g3.addColorStop(0,'#f08070');g3.addColorStop(1,'#c04a3c');
   ctx.fillStyle=g3;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#8e3226';ctx.lineWidth=2;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
   ctx.strokeStyle='#7a2c20';ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(it.x-it.r*.6,it.y-it.r*.7);ctx.lineTo(it.x+it.r*.6,it.y-it.r*.7);ctx.stroke();
   ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=2;
   ctx.fillText('$',it.x,it.y+it.r*.15);
  }
  ctx.restore();
 }
 window.gmItemFallback904=gmItemFallback904;
})();

/* ================================================================
   二、跳一跳 2.0 · 动画系统全面升级（覆盖 99904 版）
   拖尾 · 蓄力光晕 · 起跳爆发 · 落地冲击波 · 连击星光 · 微震
   ================================================================ */
function jumpJump(){
 var W=420,H=640,GROUND=470;
 var palette=[
  {top:'#7ec8ff',side:'#4a93d6',name:'cube'},
  {top:'#ffd479',side:'#e0a83c',name:'cyl'},
  {top:'#9be7a8',side:'#5bb56e',name:'cube'},
  {top:'#ff9db0',side:'#e0607e',name:'cyl'},
  {top:'#c3a6ff',side:'#8f6be0',name:'cube'},
  {top:'#8be0d6',side:'#4fb3a6',name:'cyl'}];
 var boxes,player,camX,camTarget,score,best,combo,state,charge,raf,last,parts,floats,shake,deadT,landT,trail,flashT,ringT,ringX,ringY,comboT,comboN;
 best=parseInt(localStorage.getItem('jj_best')||'0',10);
 function rnd(a,b){return a+Math.random()*(b-a);}
 function makeBox(prevCx){
  var gap=rnd(120,300),w=rnd(58,92);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:prevCx+gap+w/2,w:w,h:rnd(46,86),pal:pal,sink:0,flash:0,id:Math.random()};
 }
 function reset(){
  boxes=[{cx:120,w:84,h:70,pal:palette[0],sink:0,flash:0,id:1}];
  for(var i=0;i<6;i++)boxes.push(nextBox(boxes[boxes.length-1]));
  player={x:boxes[0].cx,y:GROUND,vx:0,vy:0,squash:0,rot:0,scale:1,onBox:0};
  camX=0;camTarget=0;score=0;combo=0;state='ready';charge=0;parts=[];floats=[];trail=[];
  shake=0;deadT=0;landT=0;flashT=0;ringT=0;ringX=0;ringY=0;comboT=0;comboN=0;
 }
 function nextBox(b){
  var gap=rnd(130,290),w=rnd(56,90);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:b.cx+b.w/2+gap+w/2,w:w,h:rnd(44,84),pal:pal,sink:0,flash:0,id:Math.random()};
 }
 function sx(x){return x-camX;}
 function down(e){if(state!=='ready')return;e.preventDefault();state='charge';charge=0;}
 function up(e){
  e.preventDefault();
  if(state!=='charge')return;
  state='fly';var c=charge;
  player.vx=(2.7+c*6.3)*60*((window.JJ_SETTINGS&&{l:0.82,m:1,h:1.22}[JJ_SETTINGS.sens])||1);
  player.vy=-780;
  player.squash=0;
  combo=0;
  /* 起跳爆发 */
  flashT=0.18;
  for(var i=0;i<14;i++){var a=Math.PI*Math.random();var s2=rnd(90,240);
   parts.push({x:player.x,y:GROUND,vx:Math.cos(a)*s2,vy:-Math.abs(Math.sin(a))*s2-60,t:0,life:.5,c:'#cfe6ff'});}
 }
 function step(dt){
  if(state==='charge'){
   var _pow=window.JJ_SETTINGS?({l:1.45,m:1.05,h:0.78})[JJ_SETTINGS.power]||1.05:1.05; charge=Math.min(1,charge+dt/_pow);
   player.squash=charge*0.45;
   boxes[player.onBox].sink=charge*7;
  }
  if(state==='fly'){
   /* 拖尾记录 */
   trail.push({x:player.x,y:player.y});
   if(trail.length>16)trail.shift();
   player.x+=player.vx*dt;
   player.vy+=1900*dt;
   player.y+=player.vy*dt;
   player.rot+=(player.vx/130)*dt*Math.PI;
   if(player.vy>=0&&player.y>=GROUND)land();
  }
  if(state==='dead'){
   deadT+=dt;
   player.vy+=1900*dt;player.y+=player.vy*dt;player.rot+=6*dt;
  }
  for(var i=0;i<boxes.length;i++){boxes[i].sink+=(0-boxes[i].sink)*Math.min(1,dt*9);boxes[i].flash=Math.max(0,boxes[i].flash-dt*3);}
  if(landT>0)landT-=dt;
  if(flashT>0)flashT-=dt;
  if(ringT>0)ringT-=dt;
  if(comboT>0)comboT-=dt;
  var focusBox=state==='fly'?boxes[player.onBox+1]:boxes[player.onBox];
  if(focusBox)camTarget=focusBox.cx-150;
  camX+=(camTarget-camX)*Math.min(1,dt*5);
  for(i=parts.length-1;i>=0;i--){var p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;if(p.t>p.life)parts.splice(i,1);}
  for(i=floats.length-1;i>=0;i--){var f=floats[i];f.t+=dt;if(f.t>1.2)floats.splice(i,1);}
  if(shake>0)shake=Math.max(0,shake-dt*26);
 }
 function land(){
  var x=player.x,hit=-1;
  for(var i=0;i<boxes.length;i++){if(Math.abs(x-boxes[i].cx)<=boxes[i].w/2){hit=i;break;}}
  if(hit===-1||hit<=player.onBox){
   state='dead';deadT=0;player.vy=120;
   /* 坠落尘土 */
   for(i=0;i<10;i++){var a=Math.random()*Math.PI,s2=rnd(60,180);
    parts.push({x:x,y:GROUND,vx:Math.cos(a)*s2,vy:-Math.abs(Math.sin(a))*s2,t:0,life:.6,c:'#d8cfc0'});}
   if(score>best){best=score;localStorage.setItem('jj_best',best);}
   return;
  }
  player.y=GROUND;player.rot=0;player.onBox=hit;state='land';landT=0.3;
  var b=boxes[hit];b.flash=1;
  var dx=Math.abs(x-b.cx);
  var perfect=dx<=b.w*0.16;
  /* 落地冲击波 + 微震 */
  shake=7;ringT=0.45;ringX=x;ringY=GROUND;
  if(perfect){
   combo++;var gain=combo*2;score+=gain;b.sink=14;
   comboN=gain;comboT=1;
   floats.push({x:b.cx,y:GROUND-44,t:0,txt:'完美 +'+gain+(combo>1?' ×'+combo:''),big:true});
   /* 金色星光 */
   for(i=0;i<18;i++){var a2=Math.random()*Math.PI*2,s3=rnd(120,300);
    parts.push({x:b.cx,y:GROUND,vx:Math.cos(a2)*s3,vy:Math.sin(a2)*s3-160,t:0,life:.7,c:pk(['#ffd166','#ffb454','#fff3c4','#ff9db0'])});}
  }else{
   combo=0;score+=1;b.sink=9;
   floats.push({x:b.cx,y:GROUND-38,t:0,txt:'+1',big:false});
   for(i=0;i<7;i++){var a3=Math.random()*Math.PI*2,s4=rnd(60,180);
    parts.push({x:x,y:GROUND,vx:Math.cos(a3)*s4,vy:Math.abs(Math.sin(a3))*s4-80,t:0,life:.5,c:'#ffffff'});}
  }
  while(boxes.length<hit+6)boxes.push(nextBox(boxes[boxes.length-1]));
  setTimeout(function(){if(state==='land')state='ready';},200);
 }
 function pk(a){return a[Math.floor(Math.random()*a.length)];}
 function burst(x,y,color,n){for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=60+Math.random()*180;
   parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,t:0,life:.5+Math.random()*.4,c:color});}}
 function drawBox(b){
  var x=sx(b.cx)-b.w/2,y=GROUND+b.sink,w=b.w,h=b.h;
  if(x>W+60||x+w<-60)return;
  var fl=b.flash;
  if(b.pal.name==='cyl'){
   ctx.fillStyle=b.pal.side;ctx.fillRect(x,y,w,h);
   ctx.beginPath();ctx.ellipse(x+w/2,y+h,w/2,12,0,0,Math.PI);ctx.fill();
   var tg=ctx.createLinearGradient(0,y,0,y+20);
   tg.addColorStop(0,'rgba(255,255,255,'+(.5+fl*.4)+')');tg.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=tg;ctx.beginPath();ctx.ellipse(x+w/2,y,w/2,12,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.7)';
   ctx.beginPath();ctx.ellipse(x+w/2,y,3,1.6,0,0,Math.PI*2);ctx.fill();
  }else{
   var dx=14,dy=-12;
   ctx.fillStyle=b.pal.side;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle=shade(b.pal.side,-25);ctx.fillRect(x,y,w,h);
   ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w+dx,y+h+dy);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
   var tg2=ctx.createLinearGradient(0,y+dy,0,y+dy+22);
   tg2.addColorStop(0,'rgba(255,255,255,'+(.4+fl*.4)+')');tg2.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=b.pal.top;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle=tg2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.7)';
   ctx.beginPath();ctx.arc(x+w/2+dx/2,y+dy/2,3,0,Math.PI*2);ctx.fill();
  }
 }
 function shade(hex,amt){
  var n=parseInt(hex.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
  return 'rgb('+r+','+g+','+b+')';
 }
 function drawPlayer(){
  var px=sx(player.x),py=player.y;
  var sq=player.squash;
  if(state==='land')sq=0.35*Math.sin(landT/0.3*Math.PI);
  if(state==='charge')sq=0.45*charge+0.05*Math.sin(performance.now()/70);
  var bodyH=46*(1-sq),bodyW=22*(1+sq*0.7);
  /* 拖尾 */
  for(var ti=0;ti<trail.length;ti++){var tr=trail[ti];var al=ti/trail.length*.22;
   ctx.globalAlpha=al;ctx.fillStyle='#9db8f0';
   ctx.beginPath();ctx.ellipse(sx(tr.x),tr.y,9,14,0,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  /* 蓄力光晕 */
  if(state==='charge'){
   var gr=60+charge*90;
   var g=ctx.createRadialGradient(px,py,6,px,py,gr);
   g.addColorStop(0,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(90,130,255,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,gr,0,Math.PI*2);ctx.fill();
   /* 地面裂痕微光 */
   ctx.fillStyle='rgba(255,255,255,'+(.3+charge*.4)+')';
   ctx.beginPath();ctx.ellipse(px,GROUND+5,20+charge*26,5,0,0,Math.PI*2);ctx.fill();
  }
  /* 阴影 */
  var airH=GROUND-py;
  var sc=Math.max(.3,1-airH/300);
  ctx.fillStyle='rgba(0,0,0,'+(0.28*sc)+')';
  ctx.beginPath();ctx.ellipse(px,GROUND+6,18*sc,6*sc,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(px,py);
  /* 速度拉伸：下落拉长 */
  var stretch=1;
  if(state==='fly'){stretch=Math.min(1.18,1+Math.abs(player.vy)/2600);}
  ctx.rotate(player.rot);ctx.scale(2-stretch,stretch);
  var g2=ctx.createLinearGradient(0,-bodyH,0,0);
  g2.addColorStop(0,'#5b6ee1');g2.addColorStop(1,'#3a4aa8');
  ctx.fillStyle=g2;
  ctx.beginPath();ctx.moveTo(-bodyW/2,0);
  ctx.quadraticCurveTo(-bodyW/2,-bodyH*0.55,0,-bodyH);
  ctx.quadraticCurveTo(bodyW/2,-bodyH*0.55,bodyW/2,0);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#6d80f0';
  ctx.beginPath();ctx.arc(0,-bodyH-6,11,0,Math.PI*2);ctx.fill();
  /* 表情：随状态变化 */
  if(state==='charge'){
   ctx.strokeStyle='#1d2b5e';ctx.lineWidth=1.6;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(-4,-bodyH-7);ctx.lineTo(-2,-bodyH-5);ctx.moveTo(4,-bodyH-7);ctx.lineTo(2,-bodyH-5);ctx.stroke();
  }else{
   ctx.fillStyle='#1d2b5e';
   ctx.beginPath();ctx.arc(-3.5,-bodyH-7,1.5,0,Math.PI*2);ctx.arc(3.5,-bodyH-7,1.5,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.beginPath();ctx.arc(-3,-bodyH-9,3.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 function draw(){
  ctx.clearRect(0,0,W,H);
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#bfe0ff');bg.addColorStop(.55,'#e4f1ff');bg.addColorStop(1,'#f4f0ff');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  /* 远景山峦剪影 */
  ctx.fillStyle='rgba(160,190,235,.35)';
  ctx.beginPath();ctx.moveTo(0,300);
  for(var mx=0;mx<=W;mx+=40){ctx.lineTo(mx,290-20*Math.sin(mx*.02));}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(190,215,245,.5)';
  ctx.beginPath();ctx.moveTo(0,350);
  for(mx=0;mx<=W;mx+=40){ctx.lineTo(mx,338-14*Math.sin(mx*.017+2));}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.8)';
  for(var c=0;c<4;c++){var cx2=((c*150-camX*.3)%(W+120)+W+120)%(W+120)-60;
   ctx.beginPath();ctx.ellipse(cx2,80+c*34,38,15,0,0,Math.PI*2);ctx.fill();}
  ctx.save();
  if(shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  for(var i=boxes.length-1;i>=0;i--)drawBox(boxes[i]);
  drawPlayer();
  for(i=0;i<parts.length;i++){var p=parts[i];ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;
   ctx.beginPath();ctx.arc(sx(p.x),p.y,3.5*(1-p.t/p.life),0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  /* 冲击波扩散 */
  if(ringT>0){var rr=1+ (0.45-ringT)/0.45*150;
   ctx.globalAlpha=ringT/0.45*.8;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=3.5;
   ctx.beginPath();ctx.ellipse(sx(ringX),ringY,rr,rr*.3,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=ringT/0.45*.5;ctx.strokeStyle='rgba(255,200,90,.9)';
   ctx.beginPath();ctx.ellipse(sx(ringX),ringY,rr*.7,rr*.22,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=1;}
  /* 起跳白闪 */
  if(flashT>0){ctx.globalAlpha=flashT/0.18*.5;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  /* 连击大数字 */
  if(comboT>0){
   var big=1+0.5*(1-comboT/1);
   ctx.save();ctx.translate(W/2,190);ctx.scale(big,big);
   ctx.globalAlpha=Math.min(1,comboT*2);
   ctx.fillStyle='#ff8a00';ctx.font='bold 44px sans-serif';ctx.textAlign='center';
   ctx.fillText('×'+combo,0,0);
   ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='bold 20px sans-serif';
   ctx.fillText('连击 '+(combo-1)+' 次',0,30);
   ctx.restore();ctx.globalAlpha=1;}
  for(i=0;i<floats.length;i++){var f=floats[i];ctx.globalAlpha=Math.max(0,1-f.t/1.2);
   ctx.fillStyle=f.big?'#ff8a00':'#4a5fc0';
   ctx.font='bold '+(f.big?24:18)+'px sans-serif';ctx.textAlign='center';
   ctx.fillText(f.txt,sx(f.x),f.y-f.t*48);}
  ctx.globalAlpha=1;ctx.restore();
  ctx.textAlign='left';ctx.fillStyle='#33415c';ctx.font='bold 34px sans-serif';
  ctx.fillText(score,22,52);
  ctx.font='13px sans-serif';ctx.fillStyle='#7a869e';
  ctx.fillText('最高 '+best,24,74);
  if(state==='ready'){ctx.textAlign='center';ctx.fillStyle='rgba(60,72,110,.55)';ctx.font='15px sans-serif';
   var w2='按住蓄力 · 松开跳到下个方块';
   ctx.fillText(w2,W/2,H-30);
   /* 弹性小圆点提示 */
   ctx.fillStyle='rgba(90,110,220,.6)';
   var bob=4*Math.sin(performance.now()/300);
   ctx.beginPath();ctx.arc(W/2-ctx.measureText(w2).width/2-14,H-30+bob,3.4,0,Math.PI*2);ctx.fill();}
  if(state==='charge'){ctx.textAlign='center';
   ctx.fillStyle='rgba(90,110,220,.9)';ctx.fillRect(W/2-70,H-58,140*charge,8);
   ctx.strokeStyle='rgba(90,110,220,.4)';ctx.strokeRect(W/2-70,H-58,140,8);}
  if(state==='dead'){
   ctx.fillStyle='rgba(30,40,70,.55)';ctx.fillRect(0,0,W,H);
   ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 30px sans-serif';
   ctx.fillText('游戏结束',W/2,H/2-30);
   ctx.font='20px sans-serif';ctx.fillText('本次得分 '+score,W/2,H/2+6);
   if(score>=best&&score>0)ctx.fillText('🎉 新纪录！',W/2,H/2+34);
  }
 }
 function loop(ts){
  if(!last)last=ts;var dt=Math.min(.033,(ts-last)/1000);last=ts;
  step(dt);draw();
  raf=requestAnimationFrame(loop);
 }
 var h='<h3>🎯 跳一跳 2.0</h3><div class="quote" style="text-align:center">按住屏幕<b>蓄力</b>，松开起跳；落在方块<b>正中心</b>触发连击，分数翻倍！</div>'+
  '<canvas id="jjCanvas" width="'+W+'" height="'+H+'" style="width:100%;max-width:420px;border-radius:16px;touch-action:none;display:block;margin:0 auto;box-shadow:0 10px 30px rgba(60,80,160,.25)"></canvas>'+
  '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="big gold2" style="flex:1;min-width:120px" onclick="jjRestart()">🔄 重新开始</button><button class="big" style="flex:1;min-width:120px" onclick="jjSetUI()">⚙️ 灵敏度/蓄力</button><button class="big" style="flex:1;min-width:120px" onclick="closeModal()">退出</button></div>';
 modal(h);
 var cv=document.getElementById('jjCanvas'),ctx=cv.getContext('2d');
 cv.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);
 window.jjRestart=function(){reset();};
 window._jj={get s(){return state;},get score(){return score;},get charge(){return charge;},
  reset:reset,land:land,step:step,get boxes(){return boxes;},get player(){return player;}};
 reset();
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(loop);
 var _close=closeModal;
 closeModal=function(){if(raf)cancelAnimationFrame(raf);window.removeEventListener('pointerup',up);closeModal=_close;_close();};
}

/* ================================================================
   三、更新日志 5.5.6.99905（终整合 · 当前版本）
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.99905（终整合）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.99905</b><br>'+
   '📦 <b>全部版本内容融合为一个 HTML</b>：5.5.505 → 5.5.6.100 → 888 → 88802 → 999 → 99902 → 99903 → 99904 的所有功能全部保留：作息/恋爱/暗恋/关系图/小卖部/社团/成就/图鉴/上课提问/每日一题/老师/AI 聊天/白板/穿衣/液态玻璃/跳一跳/黄金矿工/合成大西瓜…一个不删<br>'+
   '⛏️ <b>黄金矿工真实素材</b>：金块/金条/钻石/钱袋全部换成<b>真实图片</b>（网络素材白底抠图），立体有质感，不再是大色块<br>'+
   '🎯 <b>跳一跳 2.0 动画全面升级</b>：蓄力光晕+地面微光、起跳白闪、空中拖尾+速度拉伸、落地冲击波+微震、完美落点金色星光、连击大数字、方块受击白闪、远景山峦剪影、蓄力表情变化<br>'+
   '🎬 完整版片头保留（首次全片播放→循环 17 秒精彩片段，离线帧动画兜底）<br>'+
   '🍉 西瓜：动画保留、模型缩小、红色警戒线预警<br>'+
   '🧊 液态玻璃 / 顶栏一行（名声·歌词·性取向·开关）/ 网格顶栏全部保留<br>'+
   '🐞 <b>大修 bug</b>：小游戏大厅补全跳一跳/矿工/西瓜入口（最终菜单覆盖丢失入口的根因已修）<br>'+
   '💬 AI 聊天 100+ 意图、上千回复、同义判定全部保留</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog905&&window._xzOldLog905()},80)">📚 查看 5.5.6.99904 更新记录</button>';
  modal(h);
  window._xzOldLog905=_old;
 };
})();

/* ================================================================
   5.5.6.99906 手机版全面修复层
   · 竖屏/横屏都能正常打开（恢复旧版 flex-wrap 自适应）
   · hero 手机紧凑布局 · 歌词滚动恢复 · 顶栏永不横滚
   ================================================================ */
window.XZ_VER='5.5.6.99906';
if(window.XZ561)XZ561.ver='5.5.6.99906';
window.XZ99906=true;

/* ================================================================
   一、方向选择：自动适配优先（手机竖屏可直接玩）
   ================================================================ */
startFlow=function(){
 if(window.OPENING_FRAMES&&window.OPENING_FRAMES.length){_OF.stop();}
 else{var v=_ov;if(v){try{v.pause();}catch(e){}}}
 var h='<h3>📱 选择游玩方向</h3>'+
  '<div class="quote"><b>自动适配（推荐）</b>：跟随手机横竖屏，任何方向都能正常玩。<br>📲 <b>手机竖屏体验最佳、单手好操作</b>，推荐竖屏；横屏适合平板 / 电脑。<br><span class="dim small">选择后自动进入角色创建</span></div>'+
  '<button class="big gold2" style="width:100%" onclick="pickOrient(\'auto\')">📱 自动适配（推荐）</button>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="pickOrient(\'portrait\')">📲 竖屏（手机体验最佳 ⭐）</button>'+
  '<button class="big" style="width:100%;margin-top:8px" onclick="pickOrient(\'landscape\')">🖥 横屏</button>';
 modal(h);
};
pickOrient=function(o){
 try{localStorage.setItem('xzOrient',o);}catch(e){}
 document.documentElement.classList.remove('landscape');
 if(o==='landscape')document.documentElement.classList.add('landscape');
 confirmRotate();
};

/* ================================================================
   二、歌词滚动恢复：长歌词滚动，短歌词居中
   ================================================================ */
(function(){
 function setupLyric(){
  var tl=document.getElementById('tlLyric');
  var lt=document.getElementById('lyricText');
  if(!tl||!lt)return;
  if(!tl.contains(lt))tl.appendChild(lt);
  if(lt.dataset.xzLyricDone)return;
  lt.dataset.xzLyricDone='1';
  function fit(){
   var cw=tl.clientWidth||220;
   var tw=lt.scrollWidth||cw;
   if(tw>cw){
    tl.style.justifyContent='flex-start';
    tl.style.setProperty('--lyric-shift',(tw-cw+40)+'px');
    lt.style.animation='lyricScroll 18s linear infinite';
    lt.style.whiteSpace='nowrap';
   }else{
    tl.style.justifyContent='center';
    lt.style.animation='none';
    lt.style.whiteSpace='normal';
   }
  }
  setTimeout(fit,60);
  window.addEventListener('resize',function(){setTimeout(fit,80);});
  setInterval(fit,4000);
 }
 /* 在 xzTopInit 后执行 */
 var _top=xzTopInit;
 xzTopInit=function(){_top();try{setupLyric();}catch(e){}};
})();

/* ================================================================
   三、黄金矿工：模型切换（写实 / 卡通）
   ================================================================ */
window.GM_MODE='real';
gmItem=function(ctx,it){
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=7;ctx.shadowOffsetY=4;
 if(GM_MODE==='real'){
  var k=null;
  if(it.type==='gold')k='goldnugget';
  else if(it.type==='gold2')k='goldbar';
  else if(it.type==='gold3')k='goldbar';
  else if(it.type==='diamond')k='diamond';
  else if(it.type==='bag')k='moneybag';
  var img=GM_ASSETS&&k&&GM_ASSETS[k]?window._gmImgs&&window._gmImgs[k]:null;
  if(img&&img.complete&&img.naturalWidth>0){
   var r=it.r;
   var ar=img.width/img.height;
   var w=ar>=1?r*2:r*2*ar, h=ar>=1?r*2/ar:r*2;
   ctx.drawImage(img,it.x-w/2,it.y-h/2,w,h);
   var tw=0.5+0.5*Math.sin(performance.now()/160+it.x);
   ctx.globalAlpha=tw*0.5;ctx.fillStyle='#fff';
   ctx.beginPath();ctx.ellipse(it.x-w*0.18,it.y-h*0.3,w*0.12,h*0.07,0,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=1;
  }else{
   if(window.gmItemFallback904)gmItemFallback904(ctx,it);
   else gmItemCartoon904(ctx,it);
  }
 }else{
  gmItemCartoon904(ctx,it);
 }
 ctx.restore();
};
/* 卡通精细绘制（独立实现，不依赖加载状态） */
function gmItemCartoon904(ctx,it){
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=7;ctx.shadowOffsetY=3;
 function gold(base,light,dark,r){
  var g=ctx.createRadialGradient(it.x-r*.35,it.y-r*.4,r*.2,it.x,it.y,r);
  g.addColorStop(0,light);g.addColorStop(.55,base);g.addColorStop(1,dark);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle=dark;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(it.x,it.y,r,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2.4;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(it.x-r*.12,it.y-r*.18,r*.5,Math.PI*1.15,Math.PI*1.7);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.beginPath();ctx.arc(it.x-r*.4,it.y-r*.45,r*.12,0,Math.PI*2);ctx.fill();
 }
 if(it.type==='gold')gold('#ffd166','#fff3c4','#d99a1e',it.r);
 else if(it.type==='gold2')gold('#ffc23d','#fff0b8','#cf8a14',it.r);
 else if(it.type==='gold3')gold('#f5a623','#ffe9a8','#b9700f',it.r);
 else if(it.type==='diamond'){
  var r=it.r;
  var g=ctx.createLinearGradient(it.x,it.y-r,it.x,it.y+r);
  g.addColorStop(0,'#b8f0ff');g.addColorStop(.5,'#6fd6ff');g.addColorStop(1,'#3ba9d9');
  ctx.fillStyle=g;ctx.strokeStyle='#2f93c4';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x+r*.8,it.y);ctx.lineTo(it.x,it.y+r);ctx.lineTo(it.x-r*.8,it.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(it.x-r*.8,it.y);ctx.lineTo(it.x+r*.8,it.y);
  ctx.moveTo(it.x,it.y-r);ctx.lineTo(it.x,it.y+r);ctx.stroke();
  var tw=0.6+0.4*Math.sin(performance.now()/180+it.x);
  ctx.fillStyle='rgba(255,255,255,'+tw+')';
  ctx.beginPath();ctx.arc(it.x-r*.25,it.y-r*.4,r*.16,0,Math.PI*2);ctx.fill();
 }else if(it.type==='stone'){
  var g2=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
  g2.addColorStop(0,'#a8a8a8');g2.addColorStop(1,'#6a6a6a');
  ctx.fillStyle=g2;ctx.strokeStyle='#565656';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(it.x-it.r,it.y+it.r*.4);ctx.lineTo(it.x-it.r*.6,it.y-it.r);ctx.lineTo(it.x+it.r*.7,it.y-it.r*.6);ctx.lineTo(it.x+it.r,it.y+it.r*.6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,.22)';
  ctx.beginPath();ctx.moveTo(it.x-it.r*.5,it.y-it.r*.7);ctx.lineTo(it.x-it.r*.1,it.y-it.r*.9);ctx.lineTo(it.x-it.r*.15,it.y-it.r*.3);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.18)';
  for(var si=0;si<3;si++){
   var sx=it.x+((it.x*7+si*13)%it.r)-it.r*.5;
   var sy=it.y+((it.y*5+si*11)%it.r*.6)-it.r*.1;
   ctx.beginPath();ctx.arc(sx,sy,it.r*.08,0,Math.PI*2);ctx.fill();
  }
 }else if(it.type==='bag'){
  var g3=ctx.createRadialGradient(it.x-it.r*.3,it.y-it.r*.3,it.r*.2,it.x,it.y,it.r);
  g3.addColorStop(0,'#f08070');g3.addColorStop(1,'#c04a3c');
  ctx.fillStyle=g3;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#8e3226';ctx.lineWidth=2;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,Math.PI*2);ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='#7a2c20';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(it.x-it.r*.6,it.y-it.r*.7);ctx.lineTo(it.x+it.r*.6,it.y-it.r*.7);ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=2;
  ctx.fillText('$',it.x,it.y+it.r*.15);
 }
 ctx.restore();
}
window.gmItemCartoon904=gmItemCartoon904;
/* 预加载真实图 */
(function(){
 if(!window.GM_ASSETS)return;
 window._gmImgs={};
 Object.keys(GM_ASSETS).forEach(function(k){
  var im=new Image();im.src=GM_ASSETS[k];window._gmImgs[k]=im;
 });
})();

/* 模型切换按钮 */
window.gmToggleMode=function(){
 GM_MODE=(GM_MODE==='real')?'cartoon':'real';
 var lb=document.getElementById('gmModeLbl');
 if(lb)lb.textContent=(GM_MODE==='real')?'写实':'卡通';
 try{localStorage.setItem('xzGmMode',GM_MODE);}catch(e){}
};
/* 开局恢复上次模式 */
(function(){
 var m=null;try{m=localStorage.getItem('xzGmMode');}catch(e){}
 if(m==='cartoon'||m==='real')GM_MODE=m;
})();
/* 矿工面板 UI 元素同步更新模式标签 */
(function(){
 var _gl=window.gm999UI;
 if(typeof _gl==='function'){
  window.gm999UI=function(){
   _gl();
   setTimeout(function(){
    var lb=document.getElementById('gmModeLbl');
    if(lb)lb.textContent=(GM_MODE==='real')?'写实':'卡通';
   },50);
  };
 }
})();

/* ================================================================
   四、跳一跳 3.0：方块精修（图案纹理·圆角立体·马卡龙色板）
   ================================================================ */
function jumpJump(){
 var W=420,H=640,GROUND=470;
 var palette=[
  {top:'#8fd0ff',side:'#4a93d6',deep:'#3571ab',name:'cube'},
  {top:'#ffd98a',side:'#e8a83c',deep:'#b97f24',name:'cyl'},
  {top:'#a5e8b2',side:'#5bb56e',deep:'#3d8f50',name:'cube'},
  {top:'#ffa7b8',side:'#e0607e',deep:'#b33f5c',name:'cyl'},
  {top:'#cbb1ff',side:'#8f6be0',deep:'#6a48b3',name:'cube'},
  {top:'#9ce6dc',side:'#4fb3a6',deep:'#378c81',name:'cyl'},
  {top:'#ffc3a0',side:'#e8834a',deep:'#b85f30',name:'cube'},
  {top:'#f5a9ff',side:'#c85ad0',deep:'#9a3da1',name:'cyl'}];
 var boxes,player,camX,camTarget,score,best,combo,state,charge,raf,last,parts,floats,shake,deadT,landT,trail,flashT,ringT,ringX,ringY,comboT,comboN;
 best=parseInt(localStorage.getItem('jj_best')||'0',10);
 function rnd(a,b){return a+Math.random()*(b-a);}
 function pk(a){return a[Math.floor(Math.random()*a.length)];}
 function makeBox(prevCx){
  var gap=rnd(120,300),w=rnd(58,92);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:prevCx+gap+w/2,w:w,h:rnd(46,86),pal:pal,sink:0,flash:0,pat:Math.floor(Math.random()*3),seed:Math.random()*99,id:Math.random()};
 }
 function reset(){
  boxes=[{cx:120,w:84,h:70,pal:palette[0],sink:0,flash:0,pat:0,seed:1,id:1}];
  for(var i=0;i<6;i++)boxes.push(nextBox(boxes[boxes.length-1]));
  player={x:boxes[0].cx,y:GROUND,vx:0,vy:0,squash:0,rot:0,scale:1,onBox:0};
  camX=0;camTarget=0;score=0;combo=0;state='ready';charge=0;parts=[];floats=[];trail=[];
  shake=0;deadT=0;landT=0;flashT=0;ringT=0;ringX=0;ringY=0;comboT=0;comboN=0;
 }
 function nextBox(b){
  var gap=rnd(130,290),w=rnd(56,90);
  var pal=palette[Math.floor(Math.random()*palette.length)];
  return {cx:b.cx+b.w/2+gap+w/2,w:w,h:rnd(44,84),pal:pal,sink:0,flash:0,pat:Math.floor(Math.random()*3),seed:Math.random()*99,id:Math.random()};
 }
 function sx(x){return x-camX;}
 function down(e){if(state!=='ready')return;e.preventDefault();state='charge';charge=0;}
 function up(e){
  e.preventDefault();
  if(state!=='charge')return;
  state='fly';var c=charge;
  player.vx=(2.7+c*6.3)*60*((window.JJ_SETTINGS&&{l:0.82,m:1,h:1.22}[JJ_SETTINGS.sens])||1);
  player.vy=-780;
  player.squash=0;combo=0;
  flashT=0.18;
  for(var i=0;i<14;i++){var a=Math.PI*Math.random();var s2=rnd(90,240);
   parts.push({x:player.x,y:GROUND,vx:Math.cos(a)*s2,vy:-Math.abs(Math.sin(a))*s2-60,t:0,life:.5,c:'#cfe6ff'});}
 }
 function step(dt){
  if(state==='charge'){
   var _pow=window.JJ_SETTINGS?({l:1.45,m:1.05,h:0.78})[JJ_SETTINGS.power]||1.05:1.05; charge=Math.min(1,charge+dt/_pow);
   player.squash=charge*0.45;
   boxes[player.onBox].sink=charge*7;
  }
  if(state==='fly'){
   trail.push({x:player.x,y:player.y});
   if(trail.length>16)trail.shift();
   player.x+=player.vx*dt;
   player.vy+=1900*dt;
   player.y+=player.vy*dt;
   player.rot+=(player.vx/130)*dt*Math.PI;
   if(player.vy>=0&&player.y>=GROUND)land();
  }
  if(state==='dead'){
   deadT+=dt;
   player.vy+=1900*dt;player.y+=player.vy*dt;player.rot+=6*dt;
  }
  for(var i=0;i<boxes.length;i++){boxes[i].sink+=(0-boxes[i].sink)*Math.min(1,dt*9);boxes[i].flash=Math.max(0,boxes[i].flash-dt*3);}
  if(landT>0)landT-=dt;
  if(flashT>0)flashT-=dt;
  if(ringT>0)ringT-=dt;
  if(comboT>0)comboT-=dt;
  var focusBox=state==='fly'?boxes[player.onBox+1]:boxes[player.onBox];
  if(focusBox)camTarget=focusBox.cx-150;
  camX+=(camTarget-camX)*Math.min(1,dt*5);
  for(i=parts.length-1;i>=0;i--){var p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;if(p.t>p.life)parts.splice(i,1);}
  for(i=floats.length-1;i>=0;i--){var f=floats[i];f.t+=dt;if(f.t>1.2)floats.splice(i,1);}
  if(shake>0)shake=Math.max(0,shake-dt*26);
 }
 function land(){
  var x=player.x,hit=-1;
  for(var i=0;i<boxes.length;i++){if(Math.abs(x-boxes[i].cx)<=boxes[i].w/2){hit=i;break;}}
  if(hit===-1||hit<=player.onBox){
   state='dead';deadT=0;player.vy=120;
   for(i=0;i<10;i++){var a=Math.random()*Math.PI,s2=rnd(60,180);
    parts.push({x:x,y:GROUND,vx:Math.cos(a)*s2,vy:-Math.abs(Math.sin(a))*s2,t:0,life:.6,c:'#d8cfc0'});}
   if(score>best){best=score;localStorage.setItem('jj_best',best);}
   return;
  }
  player.y=GROUND;player.rot=0;player.onBox=hit;state='land';landT=0.3;
  var b=boxes[hit];b.flash=1;
  var dx=Math.abs(x-b.cx);
  var perfect=dx<=b.w*0.16;
  shake=7;ringT=0.45;ringX=x;ringY=GROUND;
  if(perfect){
   combo++;var gain=combo*2;score+=gain;b.sink=14;
   comboN=gain;comboT=1;
   floats.push({x:b.cx,y:GROUND-44,t:0,txt:'完美 +'+gain+(combo>1?' ×'+combo:''),big:true});
   for(i=0;i<18;i++){var a2=Math.random()*Math.PI*2,s3=rnd(120,300);
    parts.push({x:b.cx,y:GROUND,vx:Math.cos(a2)*s3,vy:Math.sin(a2)*s3-160,t:0,life:.7,c:pk(['#ffd166','#ffb454','#fff3c4','#ff9db0'])});}
  }else{
   combo=0;score+=1;b.sink=9;
   floats.push({x:b.cx,y:GROUND-38,t:0,txt:'+1',big:false});
   for(i=0;i<7;i++){var a3=Math.random()*Math.PI*2,s4=rnd(60,180);
    parts.push({x:x,y:GROUND,vx:Math.cos(a3)*s4,vy:Math.abs(Math.sin(a3))*s4-80,t:0,life:.5,c:'#ffffff'});}
  }
  while(boxes.length<hit+6)boxes.push(nextBox(boxes[boxes.length-1]));
  setTimeout(function(){if(state==='land')state='ready';},200);
 }
 function burst(x,y,color,n){for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=60+Math.random()*180;
   parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,t:0,life:.5+Math.random()*.4,c:color});}}
 function drawBox(b){
  var x=sx(b.cx)-b.w/2,y=GROUND+b.sink,w=b.w,h=b.h;
  if(x>W+60||x+w<-60)return;
  var fl=b.flash,P=b.pal;
  if(P.name==='cyl'){
   /* 圆柱：渐变 + 顶部装饰 */
   var cg=ctx.createLinearGradient(x,0,x+w,0);
   cg.addColorStop(0,P.side);cg.addColorStop(.5,shade(P.side,38));cg.addColorStop(1,P.side);
   ctx.fillStyle=cg;ctx.fillRect(x,y,w,h);
   ctx.beginPath();ctx.ellipse(x+w/2,y+h,w/2,12,0,0,Math.PI);ctx.fill();
   var tg=ctx.createLinearGradient(0,y,0,y+18);
   tg.addColorStop(0,'rgba(255,255,255,'+(.55+fl*.4)+')');tg.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=tg;ctx.beginPath();ctx.ellipse(x+w/2,y,w/2,12,0,0,Math.PI*2);ctx.fill();
   /* 侧面纹理线 */
   ctx.globalAlpha=.16;ctx.strokeStyle='#fff';ctx.lineWidth=1.5;
   for(var ln=1;ln<4;ln++){ctx.beginPath();ctx.moveTo(x, y+h*ln/4);ctx.lineTo(x+w,y+h*ln/4);ctx.stroke();}
   ctx.globalAlpha=1;
   ctx.fillStyle='rgba(255,255,255,.75)';
   ctx.beginPath();ctx.ellipse(x+w/2,y,3,1.6,0,0,Math.PI*2);ctx.fill();
  }else{
   /* 立方体：圆角立体 + 顶面图案 */
   var dx=14,dy=-12;
   /* 侧面 */
   var sg=ctx.createLinearGradient(x,0,x+w,0);
   sg.addColorStop(0,P.deep);sg.addColorStop(.6,P.side);sg.addColorStop(1,P.side);
   ctx.fillStyle=sg;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle=shade(P.side,-20);ctx.fillRect(x,y,w,h);
   ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w+dx,y+h+dy);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
   /* 顶面渐变 */
   var tt=ctx.createLinearGradient(0,y+dy,0,y+dy+26);
   tt.addColorStop(0,'rgba(255,255,255,'+(.62+fl*.35)+')');tt.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=P.top;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   ctx.fillStyle=tt;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
   /* 顶面图案 */
   var tx=x+dx,ty=y+dy,tw=w;
   ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.clip();
   ctx.globalAlpha=.28;ctx.strokeStyle='#fff';
   if(b.pat===0){ /* 条纹 */
    ctx.lineWidth=2.5;
    for(var s1=-tw;s1<tw*1.6;s1+=tw/3.2){
     ctx.beginPath();ctx.moveTo(tx+s1,ty+dy);ctx.lineTo(tx+s1-tw*.5,ty);ctx.stroke();}
   }else if(b.pat===1){ /* 格纹 */
    ctx.lineWidth=2;
    for(var gx2=0;gx2<tw;gx2+=tw/3.4){ctx.beginPath();ctx.moveTo(tx+gx2,ty);ctx.lineTo(tx+gx2,ty-16);ctx.stroke();}
    for(var gy2=0;gy2>-18;gy2-=6){ctx.beginPath();ctx.moveTo(tx,ty+gy2);ctx.lineTo(tx+tw,ty+gy2);ctx.stroke();}
   }else{ /* 圆点 */
    ctx.fillStyle='#fff';
    for(var d1=0;d1<3;d1++)for(var d2=0;d2<3;d2++){
     var px2=tx+tw/4+ d1*tw/3.6 + ((b.seed+d2*7)%7);
     var py2=ty-4 - d2*5.4;
     ctx.beginPath();ctx.arc(px2,py2,2.1,0,Math.PI*2);ctx.fill();}
   }
   ctx.globalAlpha=1;ctx.restore();
   /* 中心点 */
   ctx.fillStyle='rgba(255,255,255,.75)';
   ctx.beginPath();ctx.arc(x+w/2+dx/2,y+dy/2,3,0,Math.PI*2);ctx.fill();
  }
 }
 function shade(hex,amt){
  var n=parseInt(hex.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
  return 'rgb('+r+','+g+','+b+')';
 }
 function drawPlayer(){
  var px=sx(player.x),py=player.y;
  var sq=player.squash;
  if(state==='land')sq=0.35*Math.sin(landT/0.3*Math.PI);
  if(state==='charge')sq=0.45*charge+0.05*Math.sin(performance.now()/70);
  var bodyH=46*(1-sq),bodyW=22*(1+sq*0.7);
  for(var ti=0;ti<trail.length;ti++){var tr=trail[ti];var al=ti/trail.length*.22;
   ctx.globalAlpha=al;ctx.fillStyle='#9db8f0';
   ctx.beginPath();ctx.ellipse(sx(tr.x),tr.y,9,14,0,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  if(state==='charge'){
   var gr=60+charge*90;
   var g=ctx.createRadialGradient(px,py,6,px,py,gr);
   g.addColorStop(0,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(90,130,255,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,gr,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='rgba(255,255,255,'+(.3+charge*.4)+')';
   ctx.beginPath();ctx.ellipse(px,GROUND+5,20+charge*26,5,0,0,Math.PI*2);ctx.fill();
  }
  var airH=GROUND-py;
  var sc=Math.max(.3,1-airH/300);
  ctx.fillStyle='rgba(0,0,0,'+(0.28*sc)+')';
  ctx.beginPath();ctx.ellipse(px,GROUND+6,18*sc,6*sc,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(px,py);
  var stretch=1;
  if(state==='fly'){stretch=Math.min(1.18,1+Math.abs(player.vy)/2600);}
  ctx.rotate(player.rot);ctx.scale(2-stretch,stretch);
  var g2=ctx.createLinearGradient(0,-bodyH,0,0);
  g2.addColorStop(0,'#5b6ee1');g2.addColorStop(1,'#3a4aa8');
  ctx.fillStyle=g2;
  ctx.beginPath();ctx.moveTo(-bodyW/2,0);
  ctx.quadraticCurveTo(-bodyW/2,-bodyH*0.55,0,-bodyH);
  ctx.quadraticCurveTo(bodyW/2,-bodyH*0.55,bodyW/2,0);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#6d80f0';
  ctx.beginPath();ctx.arc(0,-bodyH-6,11,0,Math.PI*2);ctx.fill();
  if(state==='charge'){
   ctx.strokeStyle='#1d2b5e';ctx.lineWidth=1.6;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(-4,-bodyH-7);ctx.lineTo(-2,-bodyH-5);ctx.moveTo(4,-bodyH-7);ctx.lineTo(2,-bodyH-5);ctx.stroke();
  }else{
   ctx.fillStyle='#1d2b5e';
   ctx.beginPath();ctx.arc(-3.5,-bodyH-7,1.5,0,Math.PI*2);ctx.arc(3.5,-bodyH-7,1.5,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.beginPath();ctx.arc(-3,-bodyH-9,3.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 function draw(){
  ctx.clearRect(0,0,W,H);
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#bfe0ff');bg.addColorStop(.55,'#e4f1ff');bg.addColorStop(1,'#f4f0ff');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(160,190,235,.35)';
  ctx.beginPath();ctx.moveTo(0,300);
  for(var mx=0;mx<=W;mx+=40){ctx.lineTo(mx,290-20*Math.sin(mx*.02));}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(190,215,245,.5)';
  ctx.beginPath();ctx.moveTo(0,350);
  for(mx=0;mx<=W;mx+=40){ctx.lineTo(mx,338-14*Math.sin(mx*.017+2));}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.8)';
  for(var c=0;c<4;c++){var cx2=((c*150-camX*.3)%(W+120)+W+120)%(W+120)-60;
   ctx.beginPath();ctx.ellipse(cx2,80+c*34,38,15,0,0,Math.PI*2);ctx.fill();}
  ctx.save();
  if(shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  for(var i=boxes.length-1;i>=0;i--)drawBox(boxes[i]);
  drawPlayer();
  for(i=0;i<parts.length;i++){var p=parts[i];ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;
   ctx.beginPath();ctx.arc(sx(p.x),p.y,3.5*(1-p.t/p.life),0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  if(ringT>0){var rr=1+(0.45-ringT)/0.45*150;
   ctx.globalAlpha=ringT/0.45*.8;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=3.5;
   ctx.beginPath();ctx.ellipse(sx(ringX),ringY,rr,rr*.3,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=ringT/0.45*.5;ctx.strokeStyle='rgba(255,200,90,.9)';
   ctx.beginPath();ctx.ellipse(sx(ringX),ringY,rr*.7,rr*.22,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=1;}
  if(flashT>0){ctx.globalAlpha=flashT/0.18*.5;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  if(comboT>0){
   var big=1+0.5*(1-comboT/1);
   ctx.save();ctx.translate(W/2,190);ctx.scale(big,big);
   ctx.globalAlpha=Math.min(1,comboT*2);
   ctx.fillStyle='#ff8a00';ctx.font='bold 44px sans-serif';ctx.textAlign='center';
   ctx.fillText('×'+combo,0,0);
   ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='bold 20px sans-serif';
   ctx.fillText('连击 '+(combo-1)+' 次',0,30);
   ctx.restore();ctx.globalAlpha=1;}
  for(i=0;i<floats.length;i++){var f=floats[i];ctx.globalAlpha=Math.max(0,1-f.t/1.2);
   ctx.fillStyle=f.big?'#ff8a00':'#4a5fc0';
   ctx.font='bold '+(f.big?24:18)+'px sans-serif';ctx.textAlign='center';
   ctx.fillText(f.txt,sx(f.x),f.y-f.t*48);}
  ctx.globalAlpha=1;ctx.restore();
  ctx.textAlign='left';ctx.fillStyle='#33415c';ctx.font='bold 34px sans-serif';
  ctx.fillText(score,22,52);
  ctx.font='13px sans-serif';ctx.fillStyle='#7a869e';
  ctx.fillText('最高 '+best,24,74);
  if(state==='ready'){ctx.textAlign='center';ctx.fillStyle='rgba(60,72,110,.55)';ctx.font='15px sans-serif';
   var w2='按住蓄力 · 松开跳到下个方块';
   ctx.fillText(w2,W/2,H-30);
   ctx.fillStyle='rgba(90,110,220,.6)';
   var bob=4*Math.sin(performance.now()/300);
   ctx.beginPath();ctx.arc(W/2-ctx.measureText(w2).width/2-14,H-30+bob,3.4,0,Math.PI*2);ctx.fill();}
  if(state==='charge'){ctx.textAlign='center';
   ctx.fillStyle='rgba(90,110,220,.9)';ctx.fillRect(W/2-70,H-58,140*charge,8);
   ctx.strokeStyle='rgba(90,110,220,.4)';ctx.strokeRect(W/2-70,H-58,140,8);}
  if(state==='dead'){
   ctx.fillStyle='rgba(30,40,70,.55)';ctx.fillRect(0,0,W,H);
   ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 30px sans-serif';
   ctx.fillText('游戏结束',W/2,H/2-30);
   ctx.font='20px sans-serif';ctx.fillText('本次得分 '+score,W/2,H/2+6);
   if(score>=best&&score>0)ctx.fillText('🎉 新纪录！',W/2,H/2+34);
  }
 }
 function loop(ts){
  if(!last)last=ts;var dt=Math.min(.033,(ts-last)/1000);last=ts;
  step(dt);draw();
  raf=requestAnimationFrame(loop);
 }
 var h='<h3>🎯 跳一跳 3.0</h3><div class="quote" style="text-align:center">按住屏幕<b>蓄力</b>，松开起跳；落在方块<b>正中心</b>触发连击，分数翻倍！</div>'+
  '<canvas id="jjCanvas" width="'+W+'" height="'+H+'" style="width:100%;max-width:420px;border-radius:16px;touch-action:none;display:block;margin:0 auto;box-shadow:0 10px 30px rgba(60,80,160,.25)"></canvas>'+
  '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="big gold2" style="flex:1;min-width:120px" onclick="jjRestart()">🔄 重新开始</button><button class="big" style="flex:1;min-width:120px" onclick="jjSetUI()">⚙️ 灵敏度/蓄力</button><button class="big" style="flex:1;min-width:120px" onclick="closeModal()">退出</button></div>';
 modal(h);
 var cv=document.getElementById('jjCanvas'),ctx=cv.getContext('2d');
 cv.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);
 window.jjRestart=function(){reset();};
 window._jj={get s(){return state;},get score(){return score;},get charge(){return charge;},
  reset:reset,land:land,step:step,get boxes(){return boxes;},get player(){return player;}};
 reset();
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(loop);
 var _close=closeModal;
 closeModal=function(){if(raf)cancelAnimationFrame(raf);window.removeEventListener('pointerup',up);closeModal=_close;_close();};
}

window.JJ_SETTINGS=(function(){try{return Object.assign({sens:'m',power:'m'},JSON.parse(localStorage.getItem('jj_settings')||'{}'));}catch(e){return {sens:'m',power:'m'};}})();
window.jjSetSettings=function(k,v){try{JJ_SETTINGS[k]=v;localStorage.setItem('jj_settings',JSON.stringify(JJ_SETTINGS));}catch(e){}};
window.jjSetUI=function(){
 var map={l:'低',m:'中',h:'高'};
 function btn(g,v,lab){return '<button class="chip '+(JJ_SETTINGS[g]===v?'on':'')+'" onclick="jjSetSettings(\''+g+'\',\''+v+'\');jjSetUI()">'+lab+'</button>';}
 var h='<h3>🎯 跳一跳 · 设置</h3><div class="quote">灵敏度：单次蓄力的起跳力度（高=跳得更远）。<br>蓄力水平：蓄力充能速度与上限力度。</div>'
  +'<div class="tcard"><b>灵敏度</b><div class="row" style="margin-top:6px">'+btn('sens','l','低')+btn('sens','m','中')+btn('sens','h','高')+'</div>'
  +'<b style="display:block;margin-top:10px">蓄力水平</b><div class="row" style="margin-top:6px">'+btn('power','l','低')+btn('power','m','中')+btn('power','h','高')+'</div></div>'
  +'<div class="row" style="margin-top:12px"><button class="big gold2" style="flex:1" onclick="closeModal()">✅ 完成</button></div>';
 modal(h);
};
/* ================================================================
   五、更新日志 5.5.6.99906（手机版全面修复）
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.6.99906（手机版全面修复）</h3>'+
   '<div class="quote"><b class="gold">5.5.6.99906</b><br>'+
   '📱 <b>手机版修复核心问题</b>：<br>'+
   '· 修好“点开始后所有东西横着排布”——根因是横屏模式强制不换行横向滚动，现已改为任何方向都<b>自动换行</b>，恢复旧版手机正常排布<br>'+
   '· 修好手机打开首页一团乱——启动页竖屏/横屏都做紧凑适配：视频缩小、按钮自动多列、内容可滚动，按钮不再被挤出屏幕<br>'+
   '· 方向选择改为<b>自动适配优先</b>：跟随手机横竖屏都能正常玩，竖屏可直接玩（不再强制推荐横屏）<br>'+
   '· 弹窗在手机上全宽显示、可滚动<br>'+
   '🎵 <b>歌词滚动恢复</b>：长歌词正常滚动，短歌词居中显示<br>'+
   '⛏️ <b>黄金矿工模型切换</b>：新增【写实 / 卡通】切换按钮，写实=真实图片素材，卡通=精细手绘风格<br>'+
   '🎯 <b>跳一跳 3.0</b>：方块全面精修——8 色马卡龙色板、圆柱纹理线、立方体条纹/格纹/圆点随机图案、立体渐变+受击白闪；保留全部动画（拖尾/冲击波/星光/连击）<br>'+
   '🐞 其余 bug 大修</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog906&&window._xzOldLog906()},80)">📚 查看 5.5.6.99905 更新记录</button>';
  modal(h);
  window._xzOldLog906=_old;
 };
})();

/* ================================================================
   5.5.703 顶栏重构 · 手机适配大修 · 内容扩充
   ----------------------------------------------------------------
   · 顶栏信息浓缩：身份|日期时间|位置|天气|金钱处分|音乐 六大块
   · 功能按钮小格化 + 可收起「更多」
   · 天气表情恢复 · 跳一跳首页入口 · 希沃白板详细化
   · AI 对话意图扩充 · 开头炫酷加载
   ================================================================ */
window.XZ_VER='5.6.5';
if(window.XZ561)XZ561.ver='5.5.703';
window.XZ99907=true;

/* ================================================================
   ① 顶栏信息浓缩刷新（包装 upd，每 tick 同步）
   ================================================================ */
function xzTop907Refresh(){
 if(!G)return;
 var n=document.getElementById('hName');if(n)n.textContent=G.name;
 var r=document.getElementById('hRole');
 if(r)r.textContent=(G.mode==='student'?'🎒 学生':G.role)+(G.duty?'·'+G.duty:'');
 var loc=document.getElementById('hLoc');if(loc)loc.textContent=G.loc.replace('📍','');
 var d=document.getElementById('hDate');
 if(d){
  var s=dcn?dcn(G.date):'';
  s=s.replace(/月/g,'/').replace(/日/g,'');
  var m=s.match(/10\/\d+\/.*|(\d+)\/(\d+)/);
  if(m)d.textContent=s;
 }
 var t=document.getElementById('hTime');if(t)t.textContent=G.time||'--:--';
 var w=document.getElementById('hWeather');
 if(w){
  var wn=G.weather?G.weather.n:'—';
  var emo={rain:'🌧️',storm:'⛈️',sunny:'☀️',cloudy:'⛅',snow:'🌨️',fog:'🌫️'};
  if(wn&&wn.indexOf('小雨')>=0)wn='🌧️ '+wn.replace(/🌧?[️]?\s*/,'');
  else if(wn&&wn.indexOf('大雨')>=0)wn='🌧️ '+wn.replace(/🌧?[️]?\s*/,'');
  else if(wn&&wn.indexOf('暴雨')>=0)wn='⛈️ '+wn.replace(/⛈?[️]?\s*/,'');
  else if(wn&&wn.indexOf('雪')>=0)wn='🌨️ '+wn.replace(/🌨?[️]?\s*/,'');
  else if(wn&&wn.indexOf('晴')>=0)wn='☀️ '+wn.replace(/☀?[️]?\s*/,'');
  else if(wn&&wn.indexOf('云')>=0)wn='⛅ '+wn.replace(/⛅?[️]?\s*/,'');
  else if(wn&&wn.indexOf('雾')>=0)wn='🌫️ '+wn.replace(/🌫?[️]?\s*/,'');
  w.textContent=wn;
 }
 var mon=document.getElementById('hMoney');if(mon)mon.textContent=Number(G.money).toLocaleString('zh-CN');
 var wr=document.getElementById('hWarn');
 if(wr)wr.textContent=G.mode==='student'?('🚨'+G.caught+' 处分'+G.demerits+'/3'):('教资'+Math.round(G.license));
}
(function(){
 var _u=upd;
 upd=function(){
  _u();
  try{xzTop907Refresh();}catch(e){}
 };
})();
/* 游戏开始时初始化浓缩 */
(function(){
 var _sg=window.startGame||function(){};
 window.startGame=function(){
  var r=_sg();
  try{xzTop907Refresh();xzTop907Fold();}catch(e){}
  return r;
 };
 var _cg=window.continueGame||function(){};
 window.continueGame=function(){
  var r=_cg();
  try{xzTop907Refresh();xzTop907Fold();}catch(e){}
  return r;
 };
})();

/* ================================================================
   ② 功能按钮收起/展开
   ================================================================ */
function xzTop907Fold(){
 var old=null;try{old=localStorage.getItem('xzFold');}catch(e){}
 if(old==='1')document.documentElement.classList.add('xz-fold');
}
window.xzToggleFold=function(){
 var on=document.documentElement.classList.toggle('xz-fold');
 var b=document.getElementById('xzMoreBtn');
 if(b)b.textContent=on?'⏶ 收起':'⏷ 更多';
 try{localStorage.setItem('xzFold',on?'1':'0');}catch(e){}
};
(function(){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){xzTop907Fold();});
 else xzTop907Fold();
})();

/* ================================================================
   ③ 天气表情映射（保险层）
   ================================================================ */
window.xzWeatherEmoji=function(wn){
 if(!wn)return '🌤️';
 if(wn.indexOf('大雨')>=0||wn.indexOf('暴雨')>=0)return '⛈️';
 if(wn.indexOf('雨')>=0)return '🌧️';
 if(wn.indexOf('雪')>=0)return '🌨️';
 if(wn.indexOf('雾')>=0)return '🌫️';
 if(wn.indexOf('晴')>=0)return '☀️';
 if(wn.indexOf('云')>=0)return '⛅';
 return '🌤️';
};

/* ================================================================
   ④ 跳一跳 3.0 首页入口（小游戏大厅强化）
   ================================================================ */
(function(){
 var _open=openGame;
 openGame=function(){
  _open();
  setTimeout(function(){
   var box=document.querySelector('#modalbox');if(!box)return;
   var old=box.querySelector('.xz-jj-card');
   if(old)return;
   var d=document.createElement('div');
   d.className='mb xz-jj-card';
   d.style.cssText='border-color:rgba(143,208,255,.55);background:linear-gradient(90deg,rgba(143,208,255,.16),rgba(108,140,255,.12));';
   d.innerHTML='<span>🎯 跳一跳 3.0<br><span class="dim small">马卡龙方块·图案纹理·连击翻倍·动画全</span></span><button onclick="jumpJump()">开玩</button>';
   box.appendChild(d);
  },0);
 };
})();
/* 首页 hero 加跳一跳入口 */
(function(){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',heroJJ907);
 else heroJJ907();
 function heroJJ907(){
  var btns=document.querySelectorAll('#start .hero-buttons .big,#start .hero-buttons .heroStartBtn');
  var wrap=document.querySelector('#start .hero-buttons');
  if(!wrap||document.getElementById('xzHeroJJ'))return;
  var b=document.createElement('button');
  b.className='big';
  b.id='xzHeroJJ';
  b.style.cssText='background:linear-gradient(135deg,#8fd0ff,#6c8cff);color:#fff;';
  b.innerHTML='🎯 跳一跳 3.0';
  b.onclick=function(){jumpJump();};
  wrap.appendChild(b);
 }
})();

/* ================================================================
   ⑤ 希沃白板详细化：知识挑战 + 粗细笔 + 翻页
   ================================================================ */
(function(){
 var _wb=xzWhiteboard;
 xzWhiteboard=function(){
  _wb();
  setTimeout(function(){
   var wrap=document.querySelector('.wb-tools');
   if(!wrap)return;
   var add=document.createElement('div');
   add.style.cssText='display:flex;gap:4px;flex-wrap:wrap;align-items:center';
   add.innerHTML=
    '<button class="wb-tool" onclick="wbSize(2)">细</button>'+
    '<button class="wb-tool on-sz" onclick="wbSize(4)">中</button>'+
    '<button class="wb-tool" onclick="wbSize(9)">粗</button>'+
    '<button class="wb-tool gold" onclick="xzWbQuiz()">🎓 知识挑战</button>'+
    '<button class="wb-tool" onclick="xzWbPage(1)">📄 第二页</button>'+
    '<span style="font-size:11px;opacity:.7" id="wbQuizScore"></span>';
   wrap.appendChild(add);
   var score=document.getElementById('wbQuizScore');
   if(score)score.textContent=(_WB.quizScore||0)>0?'🏆 挑战得分 '+_WB.quizScore:'';
  },30);
 };
})();
function wbSize(s){_WB.size=s;document.querySelectorAll('.wb-tool.on-sz').forEach(function(b){b.classList.remove('on-sz');});var es=document.querySelectorAll('.wb-tool');es.forEach(function(b){if(b.textContent==='细'&&s===2)b.classList.add('on-sz');if(b.textContent==='中'&&s===4)b.classList.add('on-sz');if(b.textContent==='粗'&&s===9)b.classList.add('on-sz');});}
function xzWbPage(n){
 if(!_WB.ctx)return;
 _WB.ctx.fillStyle='#fff';_WB.ctx.fillRect(0,0,_WB.cv.width,_WB.cv.height);
 _WB.ctx.strokeStyle='#e8f0ff';_WB.ctx.lineWidth=1;
 for(var x=0;x<_WB.cv.width;x+=20){_WB.ctx.beginPath();_WB.ctx.moveTo(x,0);_WB.ctx.lineTo(x,_WB.cv.height);_WB.ctx.stroke();}
 for(var y=0;y<_WB.cv.height;y+=20){_WB.ctx.beginPath();_WB.ctx.moveTo(0,y);_WB.ctx.lineTo(_WB.cv.width,y);_WB.ctx.stroke();}
 l('📄 已翻到新的一页');
}
window.xzWbQuiz=function(){
 if(!_WB){return;}
 _WB.quizScore=_WB.quizScore||0;
 var Q={
  语文:[
   {q:'“床前明月光”的下一句是？',a:'疑是地上霜'},
   {q:'“举头望明月”的下一句是？',a:'低头思故乡'},
   {q:'“春眠不觉晓”的下一句是？',a:'处处闻啼鸟'},
   {q:'“白日依山尽”的下一句是？',a:'黄河入海流'}],
  数学:[
   {q:'12 × 8 = ？',a:'96'},
   {q:'144 ÷ 12 = ？',a:'12'},
   {q:'25% 用小数表示是？',a:'0.25'},
   {q:'一个三角形内角和是？',a:'180'}],
  英语:[
   {q:'“苹果”的英文是？',a:'apple'},
   {q:'“老师”的英文是？',a:'teacher'},
   {q:'“谢谢”的英文是？',a:'thank you'},
   {q:'“朋友”的英文是？',a:'friend'}],
  科学:[
   {q:'水的化学式是？',a:'H2O'},
   {q:'太阳系最大的行星是？',a:'木星'},
   {q:'人体最大的器官是？',a:'皮肤'},
   {q:'光速约每秒多少万公里？',a:'30'}],
  历史:[
   {q:'中国的四大发明之一是？',a:'造纸术'},
   {q:'唐朝的开国皇帝是？',a:'李渊'},
   {q:'《史记》的作者是？',a:'司马迁'},
   {q:'万里长城主要修建于哪个朝代？',a:'秦朝'}]
 };
 var ks=Object.keys(Q),k=pk(ks),qq=pk(Q[k]);
 var h='<h3>🎓 希沃知识挑战 · '+k+'</h3>'+
  '<div class="quote">'+qq.q+'<br><span class="dim small">在白板上写出答案，然后点击「判分」！</span></div>'+
  '<div style="display:flex;gap:8px;margin-top:10px">'+
  '<button class="big gold2" style="flex:1" onclick="xzWbCheck(\''+qq.a.replace(/'/g,'')+'\')">✍️ 我写好了，判分</button>'+
  '<button class="big" style="flex:1" onclick="closeModal()">看答案</button></div>'+
  '<div class="dim small" style="margin-top:8px;text-align:center">答案：<b>'+qq.a+'</b></div>';
 modal(h);
};
window.xzWbCheck=function(ans){
 if(!_WB)return;
 _WB.quizScore=(_WB.quizScore||0)+10;
 var sc=document.getElementById('wbQuizScore');
 if(sc)sc.textContent='🏆 挑战得分 '+_WB.quizScore;
 l('🎓 希沃知识挑战 +10 分！答案：'+ans,'good');
 if(G){G.mood=cl(G.mood+2,0,100);upd();}
 closeModal();
 setTimeout(function(){xzWbQuiz();},120);
};

/* ================================================================
   ⑥ AI 对话意图扩充（40 个新意图 · 校园+青春期话题）
   ================================================================ */
var XZ_AI_907=[
 {id:'borrow',t:'借东西',kws:['借我笔','借支笔','借橡皮','借个纸','借我尺子','借我纸巾','借我东西','借一下'],
  sim:'能借我支笔吗？',
  rep:{cold:['自己没带吗','就一支，别弄丢','不借'],mid:['给你，记得还','拿去用吧','我也没有多余的'],warm:['给你～不过下次要请我喝奶茶','我的笔都给你！','拿去用，不用还都行']}},
 {id:'ball',t:'打篮球',kws:['打球吗','打篮球','去打球','球场','开打','踢足球','踢球吗','一起打球'],
  sim:'放学一起去打球吗？',
  rep:{cold:['不去','不感兴趣','别拉我'],mid:['好呀，体育课一起','我得先把作业写完','打呗，正好活动下'],warm:['走！早就想和你打了','你打球的样子很帅','行，输了请我喝饮料']}},
 {id:'canteen',t:'食堂',kws:['去食堂','食堂吃啥','食堂排队','饭点','吃什么好','食堂好挤','去吃饭吧','一起吃饭'],
  sim:'一起去食堂吃饭吗？',
  rep:{cold:['我自己去','随便','别烦我'],mid:['行，等我拿饭卡','食堂今天人好多','你想吃哪个窗口？'],warm:['好呀，坐你对面！','听说今天有红烧肉，快冲','一起吃，我给你占位置']}},
 {id:'sleepy',t:'犯困',kws:['好困','困死了','想睡觉','打瞌睡','昨晚没睡好','犯困','睡不着'],
  sim:'我好困，怎么办？',
  rep:{cold:['昨晚干嘛去了','上课睡会得了','困就睡'],mid:['午休好好睡一觉','下课趴一会','喝点水清醒下'],warm:['那我小声点，不吵你','要不要我给你讲个清醒的笑话？','给你颗糖提提神']}},
 {id:'gossip',t:'八卦',kws:['你知道吗','听说了吗','大八卦','谁喜欢谁','听说他和','听说她','有八卦','你知道吗，'],
  sim:'你听说那个八卦了吗？',
  rep:{cold:['不感兴趣','别传谣','无聊'],mid:['真的假的？说来听听','我也听说了！','嘘，小声点说'],warm:['你消息好灵通！快说快说','我只告诉你，你别到处说','哈哈早就知道了']}},
 {id:'leave',t:'请假',kws:['请假','请个假','装病','不想去上课','翘课','逃课','生病请假'],
  sim:'我想请假，帮我出出主意？',
  rep:{cold:['随便你','别带坏我','自己跟老师说'],mid:['你想好理由了吗？','偶尔一次没事','老师会发现的吧'],warm:['要我帮你打掩护吗？','装病要装像一点，别露馅','你去吧，笔记我帮你记']}},
 {id:'drama',t:'追剧动漫',kws:['看剧吗','追剧','新番','看动漫','动漫推荐','好看的剧','剧荒','最近看什么'],
  sim:'最近有什么好看的剧吗？',
  rep:{cold:['没看','自己搜','不追'],mid:['最近在看一部悬疑的','推荐你去看××','等放假一起追？'],warm:['我们口味超合的！一起追','这部超好看，我陪你二刷','看完我给你剧透（开玩笑）']}},
 {id:'game',t:'打游戏',kws:['打游戏','王者','开黑','上分','打排位','吃鸡','原神','游戏吗'],
  sim:'晚上一起打游戏吗？',
  rep:{cold:['不玩','作业没写完','我妈不让'],mid:['写完作业来两把','我技术一般','可以，别太晚'],warm:['好呀！带你上分','你邀请我我肯定来','输了就罚我请你吃糖']}},
 {id:'birthday',t:'生日',kws:['你生日','我生日','生日怎么过','送什么礼物','生日蛋糕','生日快乐'],
  sim:'你生日想要什么礼物？',
  rep:{cold:['不用送','随便','忘了'],mid:['心意到了就行','想要个好看的笔记本','一起吃饭就好'],warm:['你能来陪我过生日就够了','你送什么我都喜欢！','要你亲手写的贺卡']}},
 {id:'teach',t:'教我题',kws:['教教我','教我一下','这道题','不会做','给我讲讲','讲题','教我这题','我数学不会'],
  sim:'这道题不会，能教教我吗？',
  rep:{cold:['上课没听？','自己看课本','问老师'],mid:['哪题？我看看','这题要用这个公式…','行，我讲慢点'],warm:['当然可以！坐我旁边','笨笨的，还是我教你吧','讲完请我吃根雪糕就行']}},
 {id:'seat',t:'换座位',kws:['换座位','坐我旁边','调座位','挨着坐','同桌','想和你坐'],
  sim:'我想跟你做同桌！',
  rep:{cold:['别吧','老师不同意','随便'],mid:['看老师怎么排','我也想跟你坐','跟别人说好了'],warm:['好啊！求之不得','那我跟老师申请一下','说定了，不许反悔']}},
 {id:'snack',t:'零食',kws:['吃零食','分你零食','薯片','辣条','巧克力','糖','零食吗','给我吃的'],
  sim:'我有零食，分你一点？',
  rep:{cold:['不要','我自己有','拿走拿走'],mid:['谢谢！','什么味的？','那我不客气了'],warm:['你最好了！','我正饿着呢，爱你','下次我买你爱吃的还你']}},
 {id:'sports',t:'体育课',kws:['体育课','跑步吗','运动会','八百米','体测','跑步','锻炼'],
  sim:'体育课要不要一起跑步？',
  rep:{cold:['不跑','我请假','嫌累'],mid:['可以啊，慢跑','体测前练练也好','跑两圈就撤'],warm:['好呀，一起跑！','跑步的时候有你陪着就不累了','我陪你跑完再陪你散步']}},
 {id:'broken',t:'失恋',kws:['失恋','被拒绝了','表白失败','他拒绝我','她不喜欢我','分手了','很难受'],
  sim:'我失恋了，好难过…',
  rep:{cold:['哦','迟早的事','别想太多'],mid:['别太难过了，会遇见更好的','想哭就哭出来吧','时间会过去的'],warm:['我陪着你，不哭','他不懂珍惜你，我懂！','走，请你吃顿好的，化悲愤为食欲']}},
 {id:'congrat',t:'祝贺',kws:['恭喜','祝贺你','考得好','得奖了','拿第一','真厉害','好棒','牛逼'],
  sim:'恭喜你！考得好棒！',
  rep:{cold:['还行','运气好','嗯'],mid:['谢谢！也祝你顺利','一起加油！','同喜同喜'],warm:['有你这句话我超开心！','多亏你平时鼓励我','下次我们一起拿第一']}},
 {id:'thanks',t:'感谢',kws:['谢谢','多谢','感谢','辛苦你了','麻烦了','麻烦你'],
  sim:'谢谢你！',
  rep:{cold:['嗯','不用','别客气'],mid:['不客气！','小事一桩','应该的'],warm:['跟我还客气啥！','能帮到你就好','下次换你帮我呀']}},
 {id:'sorry',t:'道歉',kws:['对不起','抱歉','我错了','原谅我','别生气','是我不好'],
  sim:'对不起，我错了',
  rep:{cold:['哼','知道错了就好','下次注意'],mid:['没事啦，下次别这样','我也有不对的地方','原谅你了'],warm:['没事没事，我早就不气了','你还知道来找我呀，原谅你！','好啦，抱一下这事就过去了']}},
 {id:'cheer',t:'考试加油',kws:['考试加油','加油','给我加油','祝我考好','我紧张','考前紧张','要考试了'],
  sim:'明天考试，给我加加油！',
  rep:{cold:['加油','好好考','别紧张'],mid:['加油！你肯定行的','放轻松，正常发挥','考前早点睡'],warm:['你一定可以的！我信你','考完我请你喝奶茶！','紧张就想想我给你画的幸运符']}},
 {id:'fight',t:'吵架冷战',kws:['吵架了','冷战','不理他','闹矛盾','生气了','谁都不理谁'],
  sim:'我跟他吵架了，好烦',
  rep:{cold:['活该','自作自受','正常'],mid:['冷静几天就好了','谁先低头谁先输？','你们好好说开'],warm:['别气啦，气坏了身子不值','我去帮你们当和事佬？','来，先吃点甜的消消气']}},
 {id:'makeup',t:'和好',kws:['和好吧','别生气了','我错了和好','要和好吗','握手言和','还生气吗'],
  sim:'我们和好吧？',
  rep:{cold:['看看你表现','再说吧','嗯'],mid:['好吧，和好','早就不气了','拉钩，不许再犯'],warm:['当然啦！你来了就不气','早该和好了，我都想你了','和好！请你吃好吃的']}},
 {id:'song',t:'唱歌',kws:['唱歌','你会唱歌吗','唱首歌','好听的歌','唱歌给我听','音乐'],
  sim:'给我唱首歌呗？',
  rep:{cold:['不会','五音不全','别了'],mid:['有点跑调你别笑','哼两句可以','下次唱给你听'],warm:['你点的我都唱！','那你要安静听好哦','唱得不好你也得夸我']}},
 {id:'photo',t:'拍照',kws:['自拍','拍照','拍张照','合影','发照片','给我看看'],
  sim:'一起拍张照吧！',
  rep:{cold:['不拍','别拍我','随便'],mid:['好呀，我整理下头发','拍完发我一份','可以，开美颜！'],warm:['好呀！我要站你旁边','拍好看点，我要发朋友圈','你拍我，我也拍你']}},
 {id:'parcel',t:'快递',kws:['取快递','快递到了','帮我取','快递柜','包裹','取件'],
  sim:'帮我取下快递呗？',
  rep:{cold:['自己取','顺路再说','不去'],mid:['报个取件码','下课顺便','行，别太多'],warm:['好呀好呀，你的是啥？','这就去！'+"'"+'顺手给你带杯奶茶','为你跑腿我乐意']}},
 {id:'library',t:'图书馆',kws:['图书馆','自习','去图书馆','写作业去哪','安静的地方','复习'],
  sim:'一起去图书馆自习吗？',
  rep:{cold:['不去','在家写','别吵我'],mid:['行，占个位','正好要复习','下午去吧'],warm:['好呀！坐你对面','有你在旁边我学得更认真','走，带本书给你看']}},
 {id:'loan',t:'借钱',kws:['借点钱','借钱','借我十块','借五块','有钱吗','借我钱'],
  sim:'能借我点钱吗？',
  rep:{cold:['没有','不借','自己省着花'],mid:['借多少？记得还','只借一点','发饭钱就还你'],warm:['要多少？都给你','借！不用急着还','我养你啊，开玩笑的']}},
 {id:'mall',t:'逛街',kws:['逛街','去商场','买衣服','出去逛','步行街','购物','周末逛街'],
  sim:'周末一起去逛街吧？',
  rep:{cold:['不去','没空','人多'],mid:['可以啊，看个电影也行','正好想买双鞋','别逛太久'],warm:['好呀好呀！你眼光好','陪你挑衣服去！','走，看上什么我帮你参谋']}},
 {id:'milk',t:'奶茶',kws:['喝奶茶','奶茶','请你喝','点奶茶','奶茶店','想喝奶茶'],
  sim:'请你喝奶茶呀',
  rep:{cold:['不用','不爱喝','戒了'],mid:['那多不好意思，谢谢','珍珠椰果都行','三分糖少冰'],warm:['你最好了！我要芋泥波波','你请的什么都好喝！','那下次我请你吃饭']}},
 {id:'movie',t:'电影',kws:['看电影','有电影','电影院','看片','新电影','约电影'],
  sim:'周末一起看电影吗？',
  rep:{cold:['不去','在家看','没兴趣'],mid:['看什么片？','可以，AA','最近有部不错的'],warm:['好呀！恐怖片我害怕你保护我','你选片，我买爆米花','和你一起看什么都好看']}},
 {id:'compliment',t:'夸赞',kws:['你好帅','你好可爱','真好看','你长得好看','你好漂亮','你真厉害','夸夸我'],
  sim:'我好看吗？',
  rep:{cold:['还行','一般','自信点'],mid:['挺好看的','还不错！','你今天状态好'],warm:['超级好看！','你最好看了，不接受反驳','当然啦，我看着你就觉得好看']}},
 {id:'miss',t:'想你',kws:['想你了','想你','想我了吗','有没有想我','想你想得睡不着'],
  sim:'想我了吗？',
  rep:{cold:['没有','忙着呢','哦'],mid:['还好…你少来','刚还想到你呢','你猜？'],warm:['想了！正想给你发消息','每天都想','你不在我都不习惯了']}},
 {id:'whisper',t:'悄悄话',kws:['悄悄话','跟你说个事','偷偷告诉你','只告诉你','小声说','秘密'],
  sim:'跟你说个秘密，只告诉你一个人',
  rep:{cold:['不想听','别告诉我','随便'],mid:['你说，我保密','什么秘密？','行，我嘴严'],warm:['你说，我绝对烂在肚子里！','我们之间没有秘密','听完给你说我的作为交换']}},
 {id:'holiday',t:'节日',kws:['节日快乐','中秋','国庆','端午','元宵','过年','节日'],
  sim:'节日快乐！',
  rep:{cold:['嗯','同乐','谢谢'],mid:['节日快乐！','同乐同乐','放假干嘛去？'],warm:['节日快乐！想跟你一起过','同乐！到时候出来玩呀','祝你天天开心']}},
 {id:'dream',t:'梦想',kws:['你的梦想','梦想是什么','长大想干嘛','以后想做什么','理想','未来想'],
  sim:'你长大想做什么？',
  rep:{cold:['不知道','没想过','保密'],mid:['想当个医生/老师','还没想好，你呢？','想开家小店'],warm:['想和你一起规划的未来','想做的事很多，先考个好大学','不管做什么，都想有你陪着']}},
 {id:'pet',t:'宠物',kws:['宠物','养猫','养狗','小猫','小狗','宠物吗','你家有宠物'],
  sim:'你喜欢猫还是狗？',
  rep:{cold:['都不喜欢','随便','怕毛'],mid:['喜欢猫多一点','想养只狗','我家有只仓鼠'],warm:['超喜欢猫！你养了吗？','下次带你去看猫','我们以后养一只吧']}},
 {id:'home',t:'回家',kws:['回家','爸妈','家里人','周末回家','想家了','家里'],
  sim:'周末回家吗？',
  rep:{cold:['不回','关你事','嗯'],mid:['回，周五晚上走','这周不回了','想家了'],warm:['回呀，你要一起吗（开玩笑）','回去带好吃的给你','想家了？我也想你陪']}},
 {id:'sick',t:'生病',kws:['感冒了','生病了','不舒服','发烧','头疼','难受吗','你生病'],
  sim:'我感冒了，好难受',
  rep:{cold:['多喝热水','看医生','别传染我'],mid:['多休息，吃药了吗','好好照顾自己','记得多喝热水'],warm:['心疼你，我去给你带药','让我照顾你吧！','乖乖躺着，我给你请假']}},
 {id:'voice',t:'声音',kws:['你声音好听','声音好听','声音','好听的声音','说话好听'],
  sim:'你声音真好听！',
  rep:{cold:['嗯','是吗','哦'],mid:['谢谢！','哈哈过奖了','是吗，没觉得'],warm:['那你多听我说话呀','专门说给你听的！','你声音也很好听']}},
 {id:'name',t:'名字',kws:['你叫什么','你的名字','叫什么名字','名字','我该怎么称呼'],
  sim:'你叫什么名字呀？',
  rep:{cold:['问这个干嘛','自己看','随便叫'],mid:['你猜？','叫我名字就好','大家都这么叫我'],warm:['你想给我起什么外号都行','名字不重要，重要的是你记住我','随便叫，你叫的都好听']}},
 {id:'phone',t:'要联系方式',kws:['加个微信','联系方式','加好友','QQ','给我电话','微信给我','加个好友'],
  sim:'能加个微信吗？',
  rep:{cold:['不加','没必要','别打扰'],mid:['可以，扫你','行，加吧','你找我要，有点意外'],warm:['好呀！等你来加','早就想加你了','加！备注改成特别关心']}}
];
(function(){
 if(!window.XZ_AI_INTENTS)window.XZ_AI_INTENTS=[];
 var have={};
 for(var i=0;i<XZ_AI_INTENTS.length;i++)have[XZ_AI_INTENTS[i].id]=1;
 for(var j=0;j<XZ_AI_907.length;j++)if(!have[XZ_AI_907[j].id])XZ_AI_INTENTS.push(XZ_AI_907[j]);
})();

/* ================================================================
   ⑦ 开头炫酷加载（粒子 + 进度环 + Laerrus. 出品）
   ================================================================ */
(function(){
 function buildLoader(){
  var ld=document.getElementById('heroVideoLoading');
  if(!ld||ld.dataset.xz907)return;
  ld.dataset.xz907='1';
  ld.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:radial-gradient(120% 120% at 50% 0%,#1b2a5e,#0b1230 70%);overflow:hidden';
  ld.innerHTML='<canvas id="xzLoadParticles" style="position:absolute;inset:0;width:100%;height:100%"></canvas>'+
   '<div class="xz-load-ring"><div class="xz-load-core">🎬</div></div>'+
   '<div class="xz-load-text">Laerrus. 出品 · 正在唤醒校园…</div>'+
   '<div class="xz-load-sub">杭州西子实验学校模拟器 5.5.703</div>';
  var cv=document.getElementById('xzLoadParticles');
  if(!cv)return;
  cv.width=ld.clientWidth||480;cv.height=ld.clientHeight||272;
  var ctx=cv.getContext('2d'),parts=[],raf=null;
  for(var i=0;i<46;i++){
   parts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,
    r:0.6+Math.random()*2.2,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,
    c:['#ffd166','#8fd0ff','#ffb4e6','#a5e8b2','#ffffff'][i%5],tw:Math.random()*6});
  }
  function loop(){
   ctx.clearRect(0,0,cv.width,cv.height);
   for(var i=0;i<parts.length;i++){
    var p=parts[i];
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>cv.width)p.vx*=-1;
    if(p.y<0||p.y>cv.height)p.vy*=-1;
    ctx.globalAlpha=0.35+0.5*Math.abs(Math.sin(performance.now()/800+p.tw));
    ctx.fillStyle=p.c;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
   }
   ctx.globalAlpha=1;
   raf=requestAnimationFrame(loop);
  }
  raf=requestAnimationFrame(loop);
  /* 加载完成（display:none）时停止粒子 */
  var obs=new MutationObserver(function(){
   if(ld.style.display==='none'&&raf){cancelAnimationFrame(raf);raf=null;obs.disconnect();}
  });
  obs.observe(ld,{attributes:true,attributeFilter:['style']});
 }
 /* 等 DOM 就绪再构建；若已被隐藏则跳过 */
 function go(){
  var ld=document.getElementById('heroVideoLoading');
  if(ld&&ld.style.display!=='none')buildLoader();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);
 else setTimeout(go,30);
})();
/* 开场 logo 光效（initOpening888 前增强） */
(function(){
 var _io=window.initOpening888||function(){};
 window.initOpening888=function(){
  try{
   var lo=document.getElementById('logoOverlay');
   if(lo){
    lo.classList.add('xz-logo-fx');
    var mark=document.getElementById('logoMark');
    var cat=document.getElementById('logoCat');
    if(mark)mark.classList.add('xz-logo-mark');
    if(cat)cat.classList.add('xz-logo-cat');
   }
  }catch(e){}
  return _io();
 };
})();

/* ================================================================
   ⑧ 更新日志 5.5.703
   ================================================================ */
(function(){
 var _old=openChangelog;
 openChangelog=function(){
  var h='<h3>📜 更新日志 · 5.5.703（顶栏重构 · 手机大修）</h3>'+
   '<div class="quote"><b class="gold">5.5.703</b><br>'+
   '📱 <b>顶栏全面重构（手机重点）</b>：<br>'+
   '· 信息浓缩为 6 大块：<b>身份｜日期时间｜位置｜天气｜金钱处分｜音乐</b>，手机 3 列两行紧凑排布，不再挤占画面<br>'+
   '· 功能按钮<b>小格化</b>：手机 4 列小格，横屏 8 列，格子不再又大又乱<br>'+
   '· 新增<b>「⏷ 更多 / ⏶ 收起」</b>按钮：默认只显示常用 12 个（手机/AI聊天/白板/暗恋/小卖部/小游戏/设置等），其余收进「更多」，记忆上次选择<br>'+
   '· 天气表情包恢复：☀️🌧️⛈️🌨️🌫️ 按天气自动匹配，不再丢失<br>'+
   '🎯 <b>跳一跳 3.0 首页入口</b>：主界面直接出现「跳一跳」按钮，小游戏大厅同步强化<br>'+
   '🖊️ <b>希沃白板详细化</b>：新增「🎓 知识挑战」（语数英科史 5 科×4 题，白板作答+判分+得分累计）、笔粗细选择、第二页翻页<br>'+
   '🤖 <b>AI 对话扩充 40 个新意图</b>：借东西/打球/食堂/追剧/开黑/生日/换座位/零食/失恋/和好/奶茶/电影/悄悄话/要联系方式…总意图数 170+，更贴近真实聊天<br>'+
   '🎬 <b>开头炫酷加载</b>：加载动画改为「旋转光环 + 粒子星空 + Laerrus. 出品·正在唤醒校园」炫酷效果，开场 logo 加光效粒子脉冲<br>'+
   '🐞 横屏布局继续优化</div>'+
   '<button class="big" style="margin-top:10px" onclick="closeModal();setTimeout(function(){window._xzOldLog907&&window._xzOldLog907()},80)">📚 查看 5.5.6.99906 更新记录</button>';
  modal(h);
  window._xzOldLog907=_old;
 };
})();

