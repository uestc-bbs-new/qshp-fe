import IC电设 from '../../assets/forumCover/IC电设.jpg'
import defaultCover from '../../assets/forumCover/default.jpg'
import 二手专区 from '../../assets/forumCover/二手专区.jpg'
import 交通出行 from '../../assets/forumCover/交通出行.jpg'
import 体坛风云 from '../../assets/forumCover/体坛风云.jpg'
import 保研考研 from '../../assets/forumCover/保研考研.jpg'
import 公考选调 from '../../assets/forumCover/公考选调.jpg'
import 兼职信息发布栏 from '../../assets/forumCover/兼职信息发布栏.jpg'
import 军事国防 from '../../assets/forumCover/军事国防.jpg'
import 出国留学 from '../../assets/forumCover/出国留学.jpg'
import 动漫时代 from '../../assets/forumCover/动漫时代.jpg'
import 吃喝玩乐 from '../../assets/forumCover/吃喝玩乐.jpg'
import 同城同乡 from '../../assets/forumCover/同城同乡.jpg'
import 天下足球 from '../../assets/forumCover/天下足球.jpg'
import 失物招领 from '../../assets/forumCover/失物招领.jpg'
import 学术交流 from '../../assets/forumCover/学术交流.jpg'
import 就业创业 from '../../assets/forumCover/就业创业.jpg'
import 店铺专区 from '../../assets/forumCover/店铺专区.jpg'
import 影视天地 from '../../assets/forumCover/影视天地.jpg'
import 情感专区 from '../../assets/forumCover/情感专区.jpg'
import 情系舞缘 from '../../assets/forumCover/情系舞缘.jpg'
import 成电锐评 from '../../assets/forumCover/成电锐评.jpg'
import 成电骑迹 from '../../assets/forumCover/成电骑迹.jpg'
import 房屋租赁 from '../../assets/forumCover/房屋租赁.jpg'
import 拼车同行 from '../../assets/forumCover/拼车同行.jpg'
import 文人墨客 from '../../assets/forumCover/文人墨客.jpg'
import 新生专区 from '../../assets/forumCover/新生专区.jpg'
import 校园热点 from '../../assets/forumCover/校园热点.jpg'
import 毕业感言 from '../../assets/forumCover/毕业感言.jpg'
import 水手之家 from '../../assets/forumCover/水手之家.jpg'
import 电子数码 from '../../assets/forumCover/电子数码.jpg'
import 社团交流中心 from '../../assets/forumCover/社团交流中心.jpg'
import 程序员之家 from '../../assets/forumCover/程序员之家.jpg'
import 站务公告 from '../../assets/forumCover/站务公告.jpg'
import 站务综合 from '../../assets/forumCover/站务综合.jpg'
import 考试专区 from '../../assets/forumCover/考试专区.jpg'
import 自然科学 from '../../assets/forumCover/自然科学.jpg'
import 视觉艺术 from '../../assets/forumCover/视觉艺术.jpg'
import 跑步家园 from '../../assets/forumCover/跑步家园.jpg'
import 部门直通车 from '../../assets/forumCover/部门直通车.jpg'
import 音乐空间 from '../../assets/forumCover/音乐空间.jpg'
import 鹊桥 from '../../assets/forumCover/鹊桥.jpg'

const forumCoverMap: { [forum_id: number]: string } = {
  0: defaultCover,
  2: 站务公告,
  17: 同城同乡,
  20: 学术交流,
  25: 水手之家,
  45: 情感专区,
  46: 站务综合,
  55: 视觉艺术,
  61: 二手专区,
  66: 电子数码,
  70: 程序员之家,
  74: 音乐空间,
  111: 店铺专区,
  114: 文人墨客,
  115: 军事国防,
  118: 体坛风云,
  121: IC电设,
  140: 动漫时代,
  149: 影视天地,
  157: 天下足球,
  174: 就业创业,
  183: 兼职信息发布栏,
  199: 保研考研,
  208: 社团交流中心,
  219: 出国留学,
  225: 交通出行,
  236: 校园热点,
  237: 毕业感言,
  244: 成电骑迹,
  255: 房屋租赁,
  305: 失物招领,
  309: 成电锐评,
  312: 跑步家园,
  313: 鹊桥,
  316: 自然科学,
  326: 新生专区,
  334: 情系舞缘,
  370: 吃喝玩乐,
  382: 考试专区,
  391: 拼车同行,
  403: 部门直通车,
  430: 公考选调,
}

export const getForumCover = (forum_id: number) =>
  forumCoverMap[forum_id] || forumCoverMap[0]
