-- ============================================
-- 平仄间 (PingZe Jian) - 中国诗词创作平台
-- 种子数据 - 常用诗词模板（词牌 + 诗体）
-- ============================================

-- ============================================
-- 词牌模板 (20个)
-- ============================================

-- 1. 水调歌头
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('水调歌头', '词', '宋', 19, 95,
 '[{"section":"上片","lines":[{"no":1,"chars":5,"pattern":"中仄仄平仄"},{"no":2,"chars":5,"pattern":"中仄仄平平"},{"no":3,"chars":6,"pattern":"中平中仄平仄"},{"no":4,"chars":9,"pattern":"中仄中平中仄仄平平"},{"no":5,"chars":7,"pattern":"中仄中平中仄"},{"no":6,"chars":7,"pattern":"中仄仄平平"},{"no":7,"chars":5,"pattern":"中平仄"},{"no":8,"chars":3,"pattern":"仄平仄"},{"no":9,"chars":3,"pattern":"仄平平"}]},{"section":"下片","lines":[{"no":10,"chars":3,"pattern":"中中仄"},{"no":11,"chars":3,"pattern":"中中仄"},{"no":12,"chars":2,"pattern":"仄平"},{"no":13,"chars":7,"pattern":"中平中仄仄平平"},{"no":14,"chars":7,"pattern":"中仄中平中仄"},{"no":15,"chars":7,"pattern":"中仄仄平平"},{"no":16,"chars":5,"pattern":"中平仄"},{"no":17,"chars":3,"pattern":"仄平仄"},{"no":18,"chars":3,"pattern":"仄平平"}]}]',
 '{"type":"平韵","lines":[2,4,6,9,11,13,15,18],"description":"双调九十五字，前后片各四平韵"}',
 '水调歌头，词牌名。又名"元会曲""凯歌""台城游"等。双调九十五字，上片九句，下片十句，前后片各四平韵。',
 '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。——苏轼'
);

-- 2. 满江红
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('满江红', '词', '宋', 18, 93,
 '[{"section":"上片","lines":[{"no":1,"chars":4,"pattern":"中仄平平"},{"no":2,"chars":3,"pattern":"中中仄"},{"no":3,"chars":9,"pattern":"中平中仄中仄平平仄"},{"no":4,"chars":3,"pattern":"平中仄"},{"no":5,"chars":7,"pattern":"中平中仄仄平平"},{"no":6,"chars":7,"pattern":"中仄中平平仄仄"},{"no":7,"chars":7,"pattern":"中平中仄平平仄"},{"no":8,"chars":7,"pattern":"仄平平"},{"no":9,"chars":5,"pattern":"中仄平平仄"}]},{"section":"下片","lines":[{"no":10,"chars":3,"pattern":"平中仄"},{"no":11,"chars":3,"pattern":"平中仄"},{"no":12,"chars":5,"pattern":"平平仄"},{"no":13,"chars":7,"pattern":"中平中仄仄平平"},{"no":14,"chars":7,"pattern":"中仄中平平仄仄"},{"no":15,"chars":7,"pattern":"中平中仄平平仄"},{"no":16,"chars":7,"pattern":"仄平平"},{"no":17,"chars":5,"pattern":"中仄平平仄"}]}]',
 '{"type":"仄韵","lines":[2,3,5,7,9,11,12,15,17],"description":"双调九十三字，前后片各五仄韵"}',
 '满江红，词牌名。双调九十三字，前片四仄韵，后片五仄韵，以入声韵为宜。',
 '怒发冲冠，凭栏处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲、白了少年头，空悲切。\n\n靖康耻，犹未雪。臣子恨，何时灭。驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头、收拾旧山河，朝天阙。——岳飞'
);

-- 3. 沁园春
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('沁园春', '词', '宋', 25, 114,
 '[{"section":"上片","lines":[{"no":1,"chars":4,"pattern":"中仄平平"},{"no":2,"chars":4,"pattern":"中仄中平"},{"no":3,"chars":4,"pattern":"仄仄平平"},{"no":4,"chars":4,"pattern":"仄中平仄"},{"no":5,"chars":4,"pattern":"中平中仄"},{"no":6,"chars":4,"pattern":"中仄平平"},{"no":7,"chars":4,"pattern":"中仄平平"},{"no":8,"chars":7,"pattern":"中平中仄仄平平"},{"no":9,"chars":5,"pattern":"仄平平仄仄"},{"no":10,"chars":5,"pattern":"中仄平平"},{"no":11,"chars":5,"pattern":"中仄平平"},{"no":12,"chars":5,"pattern":"中仄平平"},{"no":13,"chars":5,"pattern":"中仄平平"}]},{"section":"下片","lines":[{"no":14,"chars":2,"pattern":"平平"},{"no":15,"chars":4,"pattern":"中仄平平"},{"no":16,"chars":4,"pattern":"中仄平平"},{"no":17,"chars":4,"pattern":"仄仄平平"},{"no":18,"chars":4,"pattern":"仄中平仄"},{"no":19,"chars":4,"pattern":"中平中仄"},{"no":20,"chars":4,"pattern":"中仄平平"},{"no":21,"chars":4,"pattern":"中仄平平"},{"no":22,"chars":7,"pattern":"中平中仄仄平平"},{"no":23,"chars":5,"pattern":"仄平平仄仄"},{"no":24,"chars":5,"pattern":"中仄平平"},{"no":25,"chars":5,"pattern":"中仄平平"}]}]',
 '{"type":"平韵","lines":[1,3,6,8,10,11,12,13,15,16,20,22,24,25],"description":"双调一百一十四字，前片四平韵，后片五平韵"}',
 '沁园春，词牌名。又名"东仙""寿星明"等。双调一百一十四字，前片四平韵，后片五平韵。',
 '北国风光，千里冰封，万里雪飘。望长城内外，惟余莽莽；大河上下，顿失滔滔。山舞银蛇，原驰蜡象，欲与天公试比高。须晴日，看红装素裹，分外妖娆。\n\n江山如此多娇，引无数英雄竞折腰。惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。一代天骄，成吉思汗，只识弯弓射大雕。俱往矣，数风流人物，还看今朝。——毛泽东'
);

-- 4. 念奴娇
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('念奴娇', '词', '宋', 20, 100,
 '[{"section":"上片","lines":[{"no":1,"chars":4,"pattern":"中平中仄"},{"no":2,"chars":3,"pattern":"仄平中"},{"no":3,"chars":9,"pattern":"中平中仄中仄平平仄"},{"no":4,"chars":4,"pattern":"仄平平仄"},{"no":5,"chars":7,"pattern":"中平平仄平平仄"},{"no":6,"chars":7,"pattern":"中仄中平平仄仄"},{"no":7,"chars":4,"pattern":"中仄平平"},{"no":8,"chars":5,"pattern":"中仄平平仄"},{"no":9,"chars":3,"pattern":"仄平仄"},{"no":10,"chars":5,"pattern":"中仄平平仄"}]},{"section":"下片","lines":[{"no":11,"chars":6,"pattern":"中平中仄平平"},{"no":12,"chars":7,"pattern":"中平中仄仄平平"},{"no":13,"chars":5,"pattern":"仄平平仄仄"},{"no":14,"chars":4,"pattern":"仄仄平平"},{"no":15,"chars":7,"pattern":"中仄中平平仄仄"},{"no":16,"chars":4,"pattern":"中仄平平"},{"no":17,"chars":5,"pattern":"中仄平平仄"},{"no":18,"chars":3,"pattern":"仄平仄"},{"no":19,"chars":5,"pattern":"中仄平平仄"}]}]',
 '{"type":"仄韵","lines":[2,3,5,6,8,10,12,13,15,17,19],"description":"双调一百字，前后片各四仄韵"}',
 '念奴娇，词牌名。又名"百字令""酹江月"等。双调一百字，前后片各四仄韵。',
 '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。\n\n遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。——苏轼'
);

-- 5. 菩萨蛮
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('菩萨蛮', '词', '唐', 8, 44,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中平中仄平平仄"},{"no":2,"chars":7,"pattern":"中平中仄平平仄"},{"no":3,"chars":5,"pattern":"中仄仄平平"},{"no":4,"chars":5,"pattern":"中平平仄平"}]},{"section":"下片","lines":[{"no":5,"chars":5,"pattern":"中平平仄仄"},{"no":6,"chars":5,"pattern":"中仄平平仄"},{"no":7,"chars":5,"pattern":"中仄仄平平"},{"no":8,"chars":5,"pattern":"中平平仄平"}]}]',
 '{"type":"换韵","lines":[1,2,3,4,5,6,7,8],"description":"双调四十四字，前后片各两仄韵、两平韵，平仄换韵"}',
 '菩萨蛮，词牌名。唐教坊曲名，后用作词牌。双调四十四字，前后段各四句，两仄韵两平韵，平仄换韵。',
 '小山重叠金明灭，鬓云欲度香腮雪。懒起画蛾眉，弄妆梳洗迟。\n\n照花前后镜，花面交相映。新帖绣罗襦，双双金鹧鸪。——温庭筠'
);

-- 6. 蝶恋花
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('蝶恋花', '词', '宋', 12, 60,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄中平平仄仄"},{"no":2,"chars":7,"pattern":"中仄平平"},{"no":3,"chars":5,"pattern":"中仄平平仄"},{"no":4,"chars":7,"pattern":"中仄中平平仄仄"},{"no":5,"chars":4,"pattern":"中平中仄"},{"no":6,"chars":5,"pattern":"中仄平平仄"}]},{"section":"下片","lines":[{"no":7,"chars":7,"pattern":"中仄中平平仄仄"},{"no":8,"chars":7,"pattern":"中仄平平"},{"no":9,"chars":5,"pattern":"中仄平平仄"},{"no":10,"chars":7,"pattern":"中仄中平平仄仄"},{"no":11,"chars":4,"pattern":"中平中仄"},{"no":12,"chars":5,"pattern":"中仄平平仄"}]}]',
 '{"type":"仄韵","lines":[1,3,4,6,7,9,10,12],"description":"双调六十字，前后片各四仄韵"}',
 '蝶恋花，词牌名。本名"鹊踏枝"，后更名"蝶恋花"。双调六十字，前后片各四仄韵。',
 '伫倚危楼风细细，望极春愁，黯黯生天际。草色烟光残照里，无言谁会凭阑意。\n\n拟把疏狂图一醉，对酒当歌，强乐还无味。衣带渐宽终不悔，为伊消得人憔悴。——柳永'
);

-- 7. 临江仙
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('临江仙', '词', '宋', 12, 58,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄中平平仄仄"},{"no":2,"chars":7,"pattern":"中平中仄平平"},{"no":3,"chars":7,"pattern":"中平中仄仄平平"},{"no":4,"chars":5,"pattern":"中平平仄仄"},{"no":5,"chars":5,"pattern":"中仄仄平平"},{"no":6,"chars":5,"pattern":"中仄平平"}]},{"section":"下片","lines":[{"no":7,"chars":7,"pattern":"中仄中平平仄仄"},{"no":8,"chars":7,"pattern":"中平中仄平平"},{"no":9,"chars":7,"pattern":"中平中仄仄平平"},{"no":10,"chars":5,"pattern":"中平平仄仄"},{"no":11,"chars":5,"pattern":"中仄仄平平"},{"no":12,"chars":5,"pattern":"中仄平平"}]}]',
 '{"type":"平韵","lines":[2,3,5,6,8,9,11,12],"description":"双调五十八字，前后片各三平韵"}',
 '临江仙，词牌名。原为唐教坊曲，后用为词牌。双调五十八字，上下片各三平韵。',
 '滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。\n\n白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。——杨慎'
);

-- 8. 鹧鸪天
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('鹧鸪天', '词', '宋', 11, 55,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄平平中仄平"},{"no":2,"chars":7,"pattern":"中平中仄仄平平"},{"no":3,"chars":7,"pattern":"中平中仄平平仄"},{"no":4,"chars":7,"pattern":"中仄平平中仄平"},{"no":5,"chars":3,"pattern":"平仄仄"},{"no":6,"chars":3,"pattern":"仄平平"}]},{"section":"下片","lines":[{"no":7,"chars":7,"pattern":"中平中仄仄平平"},{"no":8,"chars":7,"pattern":"中仄平平中仄平"},{"no":9,"chars":7,"pattern":"中平中仄平平仄"},{"no":10,"chars":7,"pattern":"中仄平平中仄平"},{"no":11,"chars":3,"pattern":"仄平平"}]}]',
 '{"type":"平韵","lines":[1,2,4,6,7,8,10,11],"description":"双调五十五字，前片三平韵，后片两平韵"}',
 '鹧鸪天，词牌名。双调五十五字，前段四句三平韵，后段五句两平韵。',
 '彩袖殷勤捧玉钟，当年拚却醉颜红。舞低杨柳楼心月，歌尽桃花扇底风。\n\n从别后，忆相逢，几回魂梦与君同。今宵剩把银釭照，犹恐相逢是梦中。——晏几道'
);

-- 9. 西江月
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('西江月', '词', '宋', 8, 50,
 '[{"section":"上片","lines":[{"no":1,"chars":6,"pattern":"中仄中平中仄"},{"no":2,"chars":6,"pattern":"中平中仄平平"},{"no":3,"chars":7,"pattern":"中平中仄仄平平"},{"no":4,"chars":6,"pattern":"中仄中平中仄"}]},{"section":"下片","lines":[{"no":5,"chars":6,"pattern":"中仄中平中仄"},{"no":6,"chars":6,"pattern":"中平中仄平平"},{"no":7,"chars":7,"pattern":"中平中仄仄平平"},{"no":8,"chars":6,"pattern":"中仄中平中仄"}]}]',
 '{"type":"平仄韵","lines":[2,3,6,7],"description":"双调五十字，前后片各两平韵一叶韵"}',
 '西江月，词牌名。原为唐教坊曲，后用为词牌。双调五十字，上下片各两平韵一叶韵。',
 '明月别枝惊鹊，清风半夜鸣蝉。稻花香里说丰年，听取蛙声一片。\n\n七八个星天外，两三点雨山前。旧时茅店社林边，路转溪桥忽见。——辛弃疾'
);

-- 10. 虞美人
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('虞美人', '词', '宋', 8, 56,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中平中仄平平仄"},{"no":2,"chars":5,"pattern":"中仄平平仄"},{"no":3,"chars":7,"pattern":"中平中仄仄平平"},{"no":4,"chars":9,"pattern":"中仄中平中仄仄平平"}]},{"section":"下片","lines":[{"no":5,"chars":7,"pattern":"中平中仄平平仄"},{"no":6,"chars":5,"pattern":"中仄平平仄"},{"no":7,"chars":7,"pattern":"中平中仄仄平平"},{"no":8,"chars":9,"pattern":"中仄中平中仄仄平平"}]}]',
 '{"type":"换韵","lines":[1,2,3,4,5,6,7,8],"description":"双调五十六字，前后片各两仄韵两平韵，平仄换韵"}',
 '虞美人，词牌名。原为唐教坊曲，初咏项羽宠姬虞美人而得名。双调五十六字，平仄换韵。',
 '春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。\n\n雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。——李煜'
);

-- 11. 浣溪沙
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('浣溪沙', '词', '宋', 6, 42,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄中平中仄平"},{"no":2,"chars":7,"pattern":"中平中仄仄平平"},{"no":3,"chars":7,"pattern":"中平中仄仄平平"}]},{"section":"下片","lines":[{"no":4,"chars":7,"pattern":"中仄中平平仄仄"},{"no":5,"chars":7,"pattern":"中平中仄仄平平"},{"no":6,"chars":7,"pattern":"中平中仄仄平平"}]}]',
 '{"type":"平韵","lines":[1,2,3,5,6],"description":"双调四十二字，上片三平韵，下片两平韵"}',
 '浣溪沙，词牌名。原为唐教坊曲名，后用作词牌。双调四十二字，上片三平韵，下片两平韵。',
 '一曲新词酒一杯，去年天气旧亭台。夕阳西下几时回？\n\n无可奈何花落去，似曾相识燕归来。小园香径独徘徊。——晏殊'
);

-- 12. 清平乐
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('清平乐', '词', '宋', 8, 46,
 '[{"section":"上片","lines":[{"no":1,"chars":4,"pattern":"中平中仄"},{"no":2,"chars":5,"pattern":"中仄平平仄"},{"no":3,"chars":7,"pattern":"中仄中平平仄仄"},{"no":4,"chars":6,"pattern":"中仄中平中仄"}]},{"section":"下片","lines":[{"no":5,"chars":6,"pattern":"中平中仄平平"},{"no":6,"chars":6,"pattern":"中平中仄平平"},{"no":7,"chars":5,"pattern":"中仄平平仄"},{"no":8,"chars":5,"pattern":"中仄平平"}]}]',
 '{"type":"换韵","lines":[1,2,3,4,5,6,7,8],"description":"双调四十六字，上片仄韵，下片平韵"}',
 '清平乐，词牌名。原为唐教坊曲名，后用为词牌。双调四十六字，上片四仄韵，下片三平韵。',
 '茅檐低小，溪上青青草。醉里吴音相媚好，白发谁家翁媪？\n\n大儿锄豆溪东，中儿正织鸡笼。最喜小儿亡赖，溪头卧剥莲蓬。——辛弃疾'
);

-- 13. 如梦令
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('如梦令', '词', '宋', 7, 33,
 '[{"section":"全词","lines":[{"no":1,"chars":6,"pattern":"中仄中平中仄"},{"no":2,"chars":6,"pattern":"中仄中平中仄"},{"no":3,"chars":5,"pattern":"中仄仄平平"},{"no":4,"chars":6,"pattern":"中仄中平中仄"},{"no":5,"chars":2,"pattern":"平仄"},{"no":6,"chars":2,"pattern":"平仄"},{"no":7,"chars":6,"pattern":"中仄中平中仄"}]}]',
 '{"type":"仄韵","lines":[1,2,3,4,7],"description":"单调三十三字，七句五仄韵一叠韵"}',
 '如梦令，词牌名。原名"忆仙姿"，后更名"如梦令"。单调三十三字，七句五仄韵。',
 '常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。——李清照'
);

-- 14. 忆江南
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('忆江南', '词', '唐', 5, 27,
 '[{"section":"全词","lines":[{"no":1,"chars":3,"pattern":"平中仄"},{"no":2,"chars":5,"pattern":"中仄仄平平"},{"no":3,"chars":7,"pattern":"中仄中平平仄仄"},{"no":4,"chars":7,"pattern":"中平中仄仄平平"},{"no":5,"chars":5,"pattern":"中仄仄平平"}]}]',
 '{"type":"平韵","lines":[2,4,5],"description":"单调二十七字，五句三平韵"}',
 '忆江南，词牌名。原名"谢秋娘"，后更名"忆江南"。单调二十七字，五句三平韵。',
 '江南好，风景旧曾谙。日出江花红胜火，春来江水绿如蓝。能不忆江南？——白居易'
);

-- 15. 长相思
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('长相思', '词', '清', 8, 36,
 '[{"section":"上片","lines":[{"no":1,"chars":3,"pattern":"仄仄平"},{"no":2,"chars":3,"pattern":"仄仄平"},{"no":3,"chars":7,"pattern":"中仄平平中仄平"},{"no":4,"chars":5,"pattern":"中平中仄平"}]},{"section":"下片","lines":[{"no":5,"chars":3,"pattern":"仄仄平"},{"no":6,"chars":3,"pattern":"仄仄平"},{"no":7,"chars":7,"pattern":"中仄平平中仄平"},{"no":8,"chars":5,"pattern":"中平中仄平"}]}]',
 '{"type":"平韵","lines":[1,2,3,4,5,6,7,8],"description":"双调三十六字，前后片各两平韵一叠韵"}',
 '长相思，词牌名。双调三十六字，前后片各三平韵一叠韵。',
 '山一程，水一程，身向榆关那畔行，夜深千帐灯。\n\n风一更，雪一更，聒碎乡心梦不成，故园无此声。——纳兰性德'
);

-- 16. 点绛唇
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('点绛唇', '词', '宋', 9, 41,
 '[{"section":"上片","lines":[{"no":1,"chars":4,"pattern":"中仄平平"},{"no":2,"chars":4,"pattern":"中平平仄"},{"no":3,"chars":5,"pattern":"中仄平平仄"},{"no":4,"chars":3,"pattern":"平平仄"},{"no":5,"chars":4,"pattern":"中仄平平"}]},{"section":"下片","lines":[{"no":6,"chars":4,"pattern":"中仄平平"},{"no":7,"chars":5,"pattern":"中仄平平仄"},{"no":8,"chars":3,"pattern":"平平仄"},{"no":9,"chars":4,"pattern":"中仄平平"}]}]',
 '{"type":"仄韵","lines":[2,3,4,5,7,8,9],"description":"双调四十一字，前片三仄韵，后片四仄韵"}',
 '点绛唇，词牌名。双调四十一字，前片三仄韵，后片四仄韵。',
 '蹴罢秋千，起来慵整纤纤手。露浓花瘦，薄汗轻衣透。\n\n见客入来，袜刬金钗溜。和羞走，倚门回首，却把青梅嗅。——李清照'
);

-- 17. 卜算子
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('卜算子', '词', '宋', 8, 44,
 '[{"section":"上片","lines":[{"no":1,"chars":5,"pattern":"中仄仄平平"},{"no":2,"chars":5,"pattern":"中仄平平仄"},{"no":3,"chars":7,"pattern":"中仄平平仄仄平"},{"no":4,"chars":5,"pattern":"中仄平平仄"}]},{"section":"下片","lines":[{"no":5,"chars":5,"pattern":"中仄仄平平"},{"no":6,"chars":5,"pattern":"中仄平平仄"},{"no":7,"chars":7,"pattern":"中仄平平仄仄平"},{"no":8,"chars":5,"pattern":"中仄平平仄"}]}]',
 '{"type":"仄韵","lines":[2,4,6,8],"description":"双调四十四字，前后片各两仄韵"}',
 '卜算子，词牌名。双调四十四字，前后片各两仄韵。',
 '驿外断桥边，寂寞开无主。已是黄昏独自愁，更著风和雨。\n\n无意苦争春，一任群芳妒。零落成泥碾作尘，只有香如故。——陆游'
);

-- 18. 浪淘沙
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('浪淘沙', '词', '宋', 10, 54,
 '[{"section":"上片","lines":[{"no":1,"chars":5,"pattern":"中仄仄平平"},{"no":2,"chars":5,"pattern":"中仄仄平平"},{"no":3,"chars":7,"pattern":"中平中仄仄平平"},{"no":4,"chars":7,"pattern":"中仄中平平仄仄"},{"no":5,"chars":5,"pattern":"中仄仄平平"}]},{"section":"下片","lines":[{"no":6,"chars":5,"pattern":"中仄仄平平"},{"no":7,"chars":5,"pattern":"中仄仄平平"},{"no":8,"chars":7,"pattern":"中平中仄仄平平"},{"no":9,"chars":7,"pattern":"中仄中平平仄仄"},{"no":10,"chars":5,"pattern":"中仄仄平平"}]}]',
 '{"type":"平韵","lines":[1,2,3,5,6,7,8,10],"description":"双调五十四字，前后片各四平韵"}',
 '浪淘沙，词牌名。原为唐教坊曲，后用作词牌。双调五十四字，前后片各四平韵。',
 '帘外雨潺潺，春意阑珊。罗衾不耐五更寒。梦里不知身是客，一晌贪欢。\n\n独自莫凭栏，无限江山。别时容易见时难。流水落花春去也，天上人间。——李煜'
);

-- 19. 渔家傲
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('渔家傲', '词', '宋', 10, 62,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄中平平仄仄"},{"no":2,"chars":7,"pattern":"中平中仄平平仄"},{"no":3,"chars":7,"pattern":"中仄中平平仄仄"},{"no":4,"chars":3,"pattern":"平平仄"},{"no":5,"chars":7,"pattern":"中平中仄平平仄"}]},{"section":"下片","lines":[{"no":6,"chars":7,"pattern":"中仄中平平仄仄"},{"no":7,"chars":7,"pattern":"中平中仄平平仄"},{"no":8,"chars":7,"pattern":"中仄中平平仄仄"},{"no":9,"chars":3,"pattern":"平平仄"},{"no":10,"chars":7,"pattern":"中平中仄平平仄"}]}]',
 '{"type":"仄韵","lines":[1,2,3,4,5,6,7,8,9,10],"description":"双调六十二字，前后片各五仄韵"}',
 '渔家傲，词牌名。双调六十二字，上下片各五句，五仄韵。',
 '塞下秋来风景异，衡阳雁去无留意。四面边声连角起，千嶂里，长烟落日孤城闭。\n\n浊酒一杯家万里，燕然未勒归无计。羌管悠悠霜满地，人不寐，将军白发征夫泪。——范仲淹'
);

-- 20. 定风波
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('定风波', '词', '宋', 12, 62,
 '[{"section":"上片","lines":[{"no":1,"chars":7,"pattern":"中仄平平中仄平"},{"no":2,"chars":7,"pattern":"中平中仄仄平平"},{"no":3,"chars":7,"pattern":"中仄中平平仄仄"},{"no":4,"chars":1,"pattern":"仄"},{"no":5,"chars":2,"pattern":"平仄"},{"no":6,"chars":7,"pattern":"中平中仄仄平平"}]},{"section":"下片","lines":[{"no":7,"chars":7,"pattern":"中仄平平中仄平"},{"no":8,"chars":7,"pattern":"中平中仄仄平平"},{"no":9,"chars":7,"pattern":"中仄中平平仄仄"},{"no":10,"chars":1,"pattern":"仄"},{"no":11,"chars":2,"pattern":"平仄"},{"no":12,"chars":7,"pattern":"中平中仄仄平平"}]}]',
 '{"type":"平仄韵","lines":[1,2,6,7,8,12],"description":"双调六十二字，平仄换韵"}',
 '定风波，词牌名。双调六十二字，前片三平韵两仄韵，后片两仄韵两平韵。',
 '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。\n\n料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。——苏轼'
);

-- ============================================
-- 诗体模板 (4个)
-- ============================================

-- 21. 五言绝句
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('五言绝句', '诗', '唐', 4, 20,
 '[{"lines":[{"no":1,"chars":5,"pattern":"仄仄平平仄"},{"no":2,"chars":5,"pattern":"平平仄仄平"},{"no":3,"chars":5,"pattern":"平平平仄仄"},{"no":4,"chars":5,"pattern":"仄仄仄平平"}]}]',
 '{"type":"平韵","lines":[2,4],"description":"四句二十字，二四句押平声韵，首句可押可不押"}',
 '五言绝句，简称五绝。四句，每句五字，共二十字。讲究平仄，第二、四句押韵。',
 '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。——王之涣《登鹳雀楼》'
);

-- 22. 七言绝句
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('七言绝句', '诗', '唐', 4, 28,
 '[{"lines":[{"no":1,"chars":7,"pattern":"平平仄仄仄平平"},{"no":2,"chars":7,"pattern":"仄仄平平仄仄平"},{"no":3,"chars":7,"pattern":"仄仄平平平仄仄"},{"no":4,"chars":7,"pattern":"平平仄仄仄平平"}]}]',
 '{"type":"平韵","lines":[1,2,4],"description":"四句二十八字，一、二、四句押平声韵"}',
 '七言绝句，简称七绝。四句，每句七字，共二十八字。讲究平仄对仗，一、二、四句押韵。',
 '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。——李白《早发白帝城》'
);

-- 23. 五言律诗
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('五言律诗', '诗', '唐', 8, 40,
 '[{"lines":[{"no":1,"chars":5,"pattern":"仄仄平平仄"},{"no":2,"chars":5,"pattern":"平平仄仄平"},{"no":3,"chars":5,"pattern":"平平平仄仄"},{"no":4,"chars":5,"pattern":"仄仄仄平平"},{"no":5,"chars":5,"pattern":"仄仄平平仄"},{"no":6,"chars":5,"pattern":"平平仄仄平"},{"no":7,"chars":5,"pattern":"平平平仄仄"},{"no":8,"chars":5,"pattern":"仄仄仄平平"}]}]',
 '{"type":"平韵","lines":[2,4,6,8],"description":"八句四十字，二、四、六、八句押平声韵，颔联颈联须对仗"}',
 '五言律诗，简称五律。八句，每句五字，共四十字。颔联、颈联须对仗，二、四、六、八句押韵。',
 '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。——杜甫《春望》'
);

-- 24. 七言律诗
INSERT INTO templates (name, type, dynasty, line_count, character_count, pingze_pattern, rhyme_scheme, description, example_poem) VALUES
('七言律诗', '诗', '唐', 8, 56,
 '[{"lines":[{"no":1,"chars":7,"pattern":"平平仄仄仄平平"},{"no":2,"chars":7,"pattern":"仄仄平平仄仄平"},{"no":3,"chars":7,"pattern":"仄仄平平平仄仄"},{"no":4,"chars":7,"pattern":"平平仄仄仄平平"},{"no":5,"chars":7,"pattern":"平平仄仄平平仄"},{"no":6,"chars":7,"pattern":"仄仄平平仄仄平"},{"no":7,"chars":7,"pattern":"仄仄平平平仄仄"},{"no":8,"chars":7,"pattern":"平平仄仄仄平平"}]}]',
 '{"type":"平韵","lines":[1,2,4,6,8],"description":"八句五十六字，一、二、四、六、八句押平声韵，颔联颈联须对仗"}',
 '七言律诗，简称七律。八句，每句七字，共五十六字。颔联、颈联须对仗，一、二、四、六、八句押韵。',
 '风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。\n万里悲秋常作客，百年多病独登台。艰难苦恨繁霜鬓，潦倒新停浊酒杯。——杜甫《登高》'
);
