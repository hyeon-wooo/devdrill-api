export enum EQuizAction {
  ENTER = 'enter',
  SUBMIT = 'submit',
}

/** 퀴즈 상세 진입경로 */
export enum EQuizEnterMethod {
  /** 무작위 풀기 */
  SHUFFLE = 'shuffle',
  /** 둘러보기 (전체, 북마크만, 안풀어본, 모르겠는 등 무관) */
  EXPLORE = 'explore',
  /** 특정문제로 유도하는 푸시알림을 터치하여 진입 */
  PUSH_NOTIFICATION = 'push',
}

export enum EQuizAttachmentType {
  IMAGE = 'image',
  CODE = 'code',
}

export enum EQuizAttachmentPosition {
  CONTENT = 'content',
  CHOICE_A = 'choiceA',
  CHOICE_B = 'choiceB',
  CHOICE_C = 'choiceC',
  CHOICE_D = 'choiceD',
  EXPLANATION = 'explanation',
  TIP = 'tip',
}

export enum ECodeLanguage {
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  C = 'c',
  CPP = 'cpp',
  CSHARP = 'csharp',
  GO = 'go',
  RUBY = 'ruby',
  PHP = 'php',
  R = 'r',
  SQL = 'sql',
  JSON = 'json',
  YAML = 'yaml',
  XML = 'xml',
  HTML = 'html',
  CSS = 'css',
  SHELL = 'shell',
  OTHER = 'other',
}
