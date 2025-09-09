
export enum Category {
  GENERAL = '금연구역 지정 및 관리 일반',
  SCHOOL = '어린이집·유치원·학교 금연구역',
  APARTMENT = '공동주택 금연구역',
  PUBLIC_FACILITY = '공중이용시설 금연구역 (유형별)',
  SMOKING_ROOM = '흡연실 설치 및 관리',
  FINE = '과태료 부과 및 감면',
  ENFORCEMENT = '금연지도원 및 단속',
  ETC = '기타',
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: Category;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export type Page = 'user' | 'admin';