export interface RhymeGroup {
  name: string;
  category: '上平' | '下平';
  characters: Set<string>;
}

export const RHYME_GROUPS: RhymeGroup[] = [
  { name: '一东', category: '上平', characters: new Set('东同铜桐筒童瞳中衷忠虫终戎崇嵩弓躬宫融雄熊穹穷冯风枫丰充隆空公功工攻蒙笼聋珑洪红鸿虹丛翁聪通蓬烘潼胧砻峒螽梦讧冻忡酆恫总侗窿懵庞种盅芎倥艨绒葱匆骢'.split('')) },
  { name: '二冬', category: '上平', characters: new Set('冬农宗钟龙舂松冲容蓉庸封胸雍浓重从逢缝踪茸峰锋蜂烽恭纵淙冲佣憧茏彤龚脓邛筇蛩供喁饔溶镕跫悰凇茕痈'.split('')) },
  { name: '三江', category: '上平', characters: new Set('江缸窗邦降双泷庞撞豇腔杠幢淙桩咙哝逄'.split('')) },
  { name: '四支', category: '上平', characters: new Set('支枝移为垂吹陂碑奇宜仪皮儿离施知驰池规危夷师姿迟眉悲之芝时诗棋旗辞词期滋基祠姬饥丝私司雌'.split('')) },
  { name: '五微', category: '上平', characters: new Set('微薇晖辉徽挥韦围帏违霏菲妃绯飞非扉肥腓威葳巍欷稀希晞颀沂旂矶机讥玑祈畿'.split('')) },
  { name: '六鱼', category: '上平', characters: new Set('鱼渔初书舒居裾车渠余予誉舆胥狙锄疏蔬梳虚嘘徐猪闾庐驴诸除如墟淤畲蛆纾茹苴沮雎潴'.split('')) },
  { name: '七虞', category: '上平', characters: new Set('虞愚娱隅刍无芜巫于衢癯儒襦濡须臾区朱殊珠株诸诛铢酥苏姝姑轳湖瑚猴喉乎弧狐觚辜菰菇蒲扶凫敷夫肤泸鲈颅鸬炉芦'.split('')) },
  { name: '八齐', category: '上平', characters: new Set('齐黎犁梨脐蛴啼蹄提题西栖犀嘶鸡稽笄倪霓猊溪圭携畦藜迷低梯鼙批嵇'.split('')) },
  { name: '九佳', category: '上平', characters: new Set('佳街鞋牌柴钗差涯阶偕谐骸排乖怀淮豺侪埋霾斋娲蜗娃哇'.split('')) },
  { name: '十灰', category: '上平', characters: new Set('灰恢魁隈回徊槐梅枚玫媒煤雷颓崔催摧堆陪杯醅嵬推诙裴培盔偎煨瑰茴追胚徘坯桅傀儡莓开唉哀埃台苔抬该才材财裁栽哉来莱灾猜孩徕骀胎皑'.split('')) },
  { name: '十一真', category: '上平', characters: new Set('真因茵辛新薪晨辰臣人仁神亲申伸绅身宾滨邻鳞麟珍尘陈春津秦频苹颦银垠筠巾民珉缗贫淳醇纯唇伦纶轮沦匀旬巡驯钧均臻榛姻寅彬鹑嶙磷辚峋恂询荀洵谆畛瞋'.split('')) },
  { name: '十二文', category: '上平', characters: new Set('文闻纹蚊云分芬焚坟群裙君军勤斤筋勋薰曛醺芸耘芹欣氲荤汶汾殷昕贲郧雯'.split('')) },
  { name: '十三元', category: '上平', characters: new Set('元原源沅鼋园袁猿垣烦蕃樊喧萱暄冤言轩藩媛援辕番繁翻幡璠鸳蜿宛豌昆温存敦浑囤仑抡坤阍婚门墩村奔孙荪扪暾臀'.split('')) },
  { name: '十四寒', category: '上平', characters: new Set('寒韩翰丹单安鞍难餐檀滩弹看干完冠官丸桓盘珊端酸鸾宽潘欢残瞒叹漫兰阑栏澜难'.split('')) },
  { name: '十五删', category: '上平', characters: new Set('删潸关弯湾还环鹌寰鬟斑班扳攀颁蛮般奸菅颜闲殷山艰'.split('')) },
  { name: '一先', category: '下平', characters: new Set('先前千阡笺天坚肩贤弦烟燕莲怜田填钿年颠巅牵妍研玄渊边绵悬泉鲜钱燃涎延筵铅咽涓娟捐鹃蠲蝉缠联旋还'.split('')) },
  { name: '二萧', category: '下平', characters: new Set('萧箫挑貂刁凋雕迢条髫调蜩枭浇聊辽寥撩寮僚尧幺宵消霄绡销超朝潮嚣樵骄娇焦蕉椒饶烧遥姚摇谣瑶韶昭招飙标杓镳瓢苗描猫腰邀乔桥侨妖夭漂飘翘佻徼侥哨娆陶鹩鹪鹞'.split('')) },
  { name: '三肴', category: '下平', characters: new Set('肴巢交郊茅嘲钞包胶爻苞梢蛟庖匏坳敲胞抛鲛崤铙炮哮捎茭淆泡跑咬啁教咆鞘剿刨佼抓姣唠'.split('')) },
  { name: '四豪', category: '下平', characters: new Set('豪毫操髦刀萄猱桃糟漕旄袍挠蒿涛皋号陶翱敖遭篙羔高嘈搔毛艘滔骚韬缫膏牢醪逃槽劳洮叨绸饕骜熬臊涝淘尻挑嚣捞嗥薅咎谣'.split('')) },
  { name: '五歌', category: '下平', characters: new Set('歌多罗河戈阿和波科柯陀娥蛾鹅萝荷过磨螺禾哥娑驼佗沱峨那苛诃珂窠莎莎蓑婆枷珈靴蛇讹拖'.split('')) },
  { name: '六麻', category: '下平', characters: new Set('麻花霞家茶华沙车牙蛇瓜斜邪芽嘉瑕纱鸦遮叉葩奢楂琶衙赊涯夸巴加耶嗟遐笳差蟆蛙虾拿葭茄挝呀枷哑娲爬杷蜗爷芭鲨珈骅娃哇洼畲丫夸裟瘕些桠杈痂哆爹椰咤笆桦划迦揶'.split('')) },
  { name: '七阳', category: '下平', characters: new Set('阳杨扬香乡光昌堂章张王房芳长塘妆常凉霜藏场央泱鸯秧嫱床方浆觞梁娘庄黄仓皇装殇襄骧相湘箱创忘芒望尝偿樯枪坊囊郎唐狂强肠康冈苍匡荒遑行妨棠翔良航倡伥羌庆姜僵缰疆粮穰将墙桑刚祥详洋徉佯粱量羊伤汤鲂樟彰漳璋猖商防筐煌隍凰蝗惶璜廊浪沧纲亢吭潢钢丧盲簧忙茫傍汪臧琅当庠裳昂障糖疡锵杭邙赃滂禳攘瓤抢螳踉眶炀阊彭蒋亡殃蔷镶孀搪彷胱磅膀螃'.split('')) },
  { name: '八庚', category: '下平', characters: new Set('庚更羹坑盲横觥彭棚亨英瑛烹平评京惊荆明盟鸣荣莹兵兄卿生甥笙牲擎鲸迎行衡耕萌氓宏闳茎莺樱泓橙筝争清情晴精睛菁旌晶盈瀛嬴营婴缨贞成盛城诚呈程声征正轻名令并倾萦琼赓撑瞠枪伧峥猩珩铿嵘丁嘤鹦铮砰绷轰訇瞪侦顷榜抨趟坪请'.split('')) },
  { name: '九青', category: '下平', characters: new Set('青经泾形陉亭庭廷霆蜓停丁仃馨星腥醒惺俜灵龄玲铃伶听灵囹圉瓶蓂宁泠扃丁瞑螟翎灵'.split('')) },
  { name: '十蒸', category: '下平', characters: new Set('蒸丞承陵凌绫菱凝冰凭仍朋鹏藤腾胜兢称应鹰兴冰凌凝乘胜'.split('')) },
  { name: '十一尤', category: '下平', characters: new Set('尤邮优忧流留榴骝刘由油游猷悠攸牛修羞秋周州洲舟酬仇柔俦畴筹稠邱抽湫遒收鸠不愁休囚求裘球浮谋牟眸矛侯猴喉讴沤鸥瓯楼娄陬偷头投钩沟幽彪疣绸浏瘤犹啾酋售蹂揉搜叟邹貅泅球逑俅蜉桴罘欧搂抠髅蝼兜句妯惆呕缪繇偻篓馗区'.split('')) },
  { name: '十二侵', category: '下平', characters: new Set('侵寻浔林霖临针箴沉沈深淫心琴禽擒钦衾吟今襟金音阴岑簪琳琛椹谌妊壬霖骎骎斟参森'.split('')) },
  { name: '十三覃', category: '下平', characters: new Set('覃潭谭昙含南男楠庵谙龛蓝岚蚕参婪惭探探担三眈戡婪'.split('')) },
  { name: '十四盐', category: '下平', characters: new Set('盐檐廉帘嫌严占髯谦奁纤签瞻蟾炎添兼缣沾尖潜阎镰黏淹钳甜恬拈砭詹蒹歼黔钤佥觇崦渐鹣腌襜蜚'.split('')) },
  { name: '十五咸', category: '下平', characters: new Set('咸函缄谗衔岩帆衫杉监凡馋芟搀喃嵌掺巉杉监馋搀岩帆衫杉凡馋'.split('')) },
];

export function findRhymeGroup(char: string): RhymeGroup | null {
  for (const group of RHYME_GROUPS) {
    if (group.characters.has(char)) {
      return group;
    }
  }
  return null;
}

export function checkSameRhyme(char1: string, char2: string): boolean {
  const g1 = findRhymeGroup(char1);
  const g2 = findRhymeGroup(char2);
  if (!g1 || !g2) return false;
  return g1.name === g2.name;
}

export function getRhymeGroupName(char: string): string | null {
  const group = findRhymeGroup(char);
  return group ? group.name : null;
}
