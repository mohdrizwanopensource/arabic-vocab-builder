export interface ExampleSentence {
  arabic?: string;
  translation: string;
}

export interface VocabWord {
  id: string | number;
  word: string;
  arabic?: string;
  meaning: string;
  partOfSpeech?: string;
  exampleSentence?: ExampleSentence;
  isLearned?: boolean;
  isStillLearning?: boolean;
  isBookmarked?: boolean;
}

export type ViewMode = "simple" | "detailed";
export type FilterMode = "all" | "learning" | "known" | "bookmarked";

