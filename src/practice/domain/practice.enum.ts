export enum EPracticeStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/** 문제 선별 조건 */
export enum EPracticeSelectionCondition {
  /** 무작위(조건없음) */
  NONE = 'NONE',

  /** 무작위(틀린문제 우선) */
  WRONG_FIRST = 'wrong_first',
}
