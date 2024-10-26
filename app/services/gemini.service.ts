import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async getRecipe(ingredients: string[], mealType: string, peopleCount: number, cookingMethod: string): Promise<string> {
        const prompt = `Create a recipe with these parameters:
            Ingredients available: ${ingredients.join(', ')}
            Meal type: ${mealType}
            Number of people: ${peopleCount}
            Cooking method: ${cookingMethod}
            
            Please provide a detailed recipe with ingredients list and step-by-step instructions.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating recipe:', error);
            return 'Failed to generate recipe. Please try again.';
        }
    }
}