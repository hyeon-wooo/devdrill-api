export enum ECommandImportance {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

/** 명령어 숙련도 */
export enum ECommandMastery {
  /** 전혀 모름 */
  NOT_AT_ALL = 'NOT_AT_ALL',
  /** 이제 막 공부 시작한 비기너 */
  BEGINNER = 'BEGINNER',
  /** 어느정도 익숙해짐 */
  ASSOCIATE = 'ASSOCIATE',
  /** 자유자재로 사용 가능 */
  MASTER = 'MASTER',
}

export enum ETopic {
  LINUX = 'Linux',
  DOCKER = 'Docker',
  K8S = 'Kubernetes',
  AWS = 'AWS',
  GIT = 'Git',
}
