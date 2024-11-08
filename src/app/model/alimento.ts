export interface Alimento {
    id: number;               // Id único do alimento
    nome: string;             // Nome do alimento
    calorias: number;         // Quantidade de calorias
    carboidratos: number;     // Quantidade de carboidratos
    proteinas: number;        // Quantidade de proteínas
    gorduras: number;         // Quantidade de gorduras
    quantidade?: number;      // Quantidade que o usuário deseja adicionar (opcional)
  }