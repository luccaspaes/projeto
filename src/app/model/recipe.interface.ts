export interface Step {
    number: number;
    step: string;
    translatedStep?: string; 
  }
  
  export interface Instruction {
    name: string;
    steps: Step[];
  }
  
  export interface Recipe {
    id: number;
    title: string;
    image: string;
    instructions?: string;
    analyzedInstructions: Array<any>;
    isFavorite?: boolean;
    showInstructions?: boolean;
    translatedStep?: string;
    translatedTitle?: string; 
  }