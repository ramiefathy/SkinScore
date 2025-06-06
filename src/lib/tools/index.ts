
import type { Tool } from '../types';
import { dlqiTool } from './dlqi';
import { scqoli10Tool } from './scqoli10';
import { pasiTool } from './pasi';
import { napsiTool } from './napsi';
import { pgaPsoriasisTool } from './pgaPsoriasis';
import { pssiTool } from './pssi';
import { scoradTool } from './scorad';
import { easiTool } from './easi';
import { abcdeMelanomaTool } from './abcdeMelanoma';
import { hurleyStagingHsTool } from './hurleyStagingHs';
import { fitzpatrickSkinTypeTool } from './fitzpatrickSkinType';
import { sassadTool } from './sassad';
import { vigaAdTool } from './vigaAd';
import { hecsiTool } from './hecsi';
import { dasiTool } from './dasi';
import { igaAcneTool } from './igaAcne';
import { gagsTool } from './gags';
import { acneQolTool } from './acneQol';
import { uas7Tool } from './uas7';
import { uctTool } from './uct';
import { aasTool } from './aas';
import { masiMmasiTool } from './masiMmasi';
import { melasqolTool } from './melasqol';
import { vasiTool } from './vasi';
import { vidaTool } from './vida';
import { vitiqolTool } from './vitiqol';
import { sevenPointChecklistTool } from './sevenPointChecklist';
import { mssHsTool } from './mssHs';
import { hsPgaTool } from './hsPga';
import { cdlqiTool } from './cdlqi';
import { skindex29Tool } from './skindex29';
import { vasPruritusTool } from './vasPruritus';
import { nrsPruritusTool } from './nrsPruritus';
import { fiveDItchTool } from './fiveDItch';
import { hiscrTool } from './hiscr';
import { ihs4Tool } from './ihs4';
import { igaRosaceaTool } from './igaRosacea';
import { ceaRosaceaTool } from './ceaRosacea';
import { issVisTool } from './issVis';
import { loscatTool } from './loscat';
import { mswatTool } from './mswat';
import { mfgScoreTool } from './mfgScore';
import { ctcaeSkinTool } from './ctcaeSkin';
import { bilagSkinTool } from './bilagSkin';
import { sledaiSkinTool } from './sledaiSkin';
import { bvasSkinTool } from './bvasSkin';
import { essdaiCutaneousTool } from './essdaiCutaneous';
import { scortenTool } from './scorten';
import { bwatTool } from './bwat';
import { clasiTool } from './clasi';
import { cdasiTool } from './cdasi';
import { pestTool } from './pest';
import { absisTool } from './absis';
import { bpdaiTool } from './bpdai';
import { pushTool } from './push';


export const toolData: Tool[] = [
  aasTool,
  abcdeMelanomaTool,
  absisTool,
  acneQolTool,
  bilagSkinTool,
  bpdaiTool,
  bvasSkinTool,
  bwatTool,
  cdasiTool,
  cdlqiTool,
  ceaRosaceaTool,
  clasiTool,
  ctcaeSkinTool,
  dasiTool,
  dlqiTool,
  easiTool,
  essdaiCutaneousTool,
  fitzpatrickSkinTypeTool,
  fiveDItchTool,
  gagsTool,
  hecsiTool,
  hiscrTool,
  hsPgaTool,
  hurleyStagingHsTool,
  igaAcneTool,
  igaRosaceaTool,
  ihs4Tool,
  issVisTool,
  loscatTool,
  masiMmasiTool,
  melasqolTool,
  mfgScoreTool,
  mssHsTool,
  mswatTool,
  napsiTool,
  nrsPruritusTool,
  pasiTool,
  pestTool,
  pgaPsoriasisTool,
  pssiTool,
  pushTool,
  sassadTool,
  scoradTool,
  scortenTool,
  scqoli10Tool,
  sevenPointChecklistTool,
  skindex29Tool,
  sledaiSkinTool,
  uas7Tool,
  uctTool,
  vasiTool,
  vasPruritusTool,
  vidaTool,
  vigaAdTool,
  vitiqolTool,
].sort((a, b) => a.name.localeCompare(b.name));
