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
    analyzedInstructions?: Instruction[];
    isFavorite?: boolean;
    showInstructions?: boolean;
  }