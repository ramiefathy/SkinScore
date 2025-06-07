
import type { Tool } from '../types';
import { aasTool } from './aas';
import { abcdeMelanomaTool } from './abcdeMelanoma';
import { absisTool } from './absis';
import { acneQolTool } from './acneQol';
import { bilagSkinTool } from './bilagSkin';
import { bpdaiTool } from './bpdai';
import { bvasSkinTool } from './bvasSkin';
import { bwatTool } from './bwat';
import { cdasiTool } from './cdasi';
import { cdlqiTool } from './cdlqi';
import { ceaRosaceaTool } from './ceaRosacea';
import { clasiTool } from './clasi';
import { ctcaeSkinTool } from './ctcaeSkin';
import { dasiTool } from './dasi';
import { dlqiTool } from './dlqi';
import { dssiTool } from './dssi';
import { easiTool } from './easi';
import { essdaiCutaneousTool } from './essdaiCutaneous';
import { fitzpatrickSkinTypeTool } from './fitzpatrickSkinType';
import { fiveDItchTool } from './fiveDItch';
import { gagsTool } from './gags';
import { hecsiTool } from './hecsi';
import { hiscrTool } from './hiscr';
import { hsPgaTool } from './hsPga';
import { hurleyStagingHsTool } from './hurleyStagingHs';
import { igaAcneTool } from './igaAcne';
import { igaRosaceaTool } from './igaRosacea';
import { ihs4Tool } from './ihs4';
import { iimSontheimer2002Tool } from './iimSontheimer2002';
import { issVisTool } from './issVis';
import { loscatTool } from './loscat';
import { masiMmasiTool } from './masiMmasi';
import { melasqolTool } from './melasqol';
import { mfgScoreTool } from './mfgScore';
import { mrssTool } from './mrss';
import { mssHsTool } from './mssHs';
import { mswatTool } from './mswat';
import { napsiTool } from './napsi';
import { nrsPruritusTool } from './nrsPruritus';
import { pasiTool } from './pasi';
import { pdaiTool } from './pdai';
import { pestTool } from './pest';
import { pgDelphiTool } from './pgDelphi';
import { pgParacelsusTool } from './pgParacelsus';
import { pgSuTool } from './pgSu';
import { pgaPsoriasisTool } from './pgaPsoriasis';
import { poemTool } from './poem';
import { pssiTool } from './pssi';
import { pushTool } from './push';
import { saltTool } from './salt';
import { sasiTool } from './sasi';
import { sassadTool } from './sassad';
import { scoradTool } from './scorad';
import { scortenTool } from './scorten';
import { scqoli10Tool } from './scqoli10';
import { sevenPointChecklistTool } from './sevenPointChecklist';
import { skindex29Tool } from './skindex29';
import { sledaiSkinTool } from './sledaiSkin';
import { uas7Tool } from './uas7';
import { uctTool } from './uct';
import { vasiTool } from './vasi';
import { vasPruritusTool } from './vasPruritus';
import { vidaTool } from './vida';
import { vigaAdTool } from './vigaAd';
import { vitiqolTool } from './vitiqol';


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
  dssiTool,
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
  iimSontheimer2002Tool,
  issVisTool,
  loscatTool,
  masiMmasiTool,
  melasqolTool,
  mfgScoreTool,
  mrssTool,
  mssHsTool,
  mswatTool,
  napsiTool,
  nrsPruritusTool,
  pasiTool,
  pdaiTool,
  pestTool,
  pgDelphiTool,
  pgParacelsusTool,
  pgSuTool,
  pgaPsoriasisTool,
  poemTool,
  pssiTool,
  pushTool,
  saltTool,
  sasiTool,
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
