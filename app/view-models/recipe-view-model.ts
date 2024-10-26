import { Observable } from '@nativescript/core';
import { GeminiService } from '../services/gemini.service';
import { t, setLanguage } from '../i18n';

export class RecipeViewModel extends Observable {
    private geminiService: GeminiService;
    private _ingredients: string[] = [];
    private _peopleCount: number = 1;
    private _recipe: string = '';
    private _isLoading: boolean = false;
    private _currentLanguage: string = 'TR';
    private _selectedMealTypeIndex: number = 0;
    private _selectedCookingMethodIndex: number = 0;

    constructor() {
        super();
        this.geminiService = new GeminiService('AIzaSyAl0kF68tAl1dX5QAn6A8IC2vAAwy2sPFU');
        
        // Set initial values
        this.set('ingredients', []);
        this.set('peopleCount', 1);
        this.set('selectedMealTypeIndex', 0);
        this.set('selectedCookingMethodIndex', 0);
        this.set('recipe', '');
        this.set('isLoading', false);
        
        this.updateLocalizedData();
    }

    get currentLanguage(): string {
        return this._currentLanguage;
    }

    get selectedMealTypeIndex(): number {
        return this._selectedMealTypeIndex;
    }

    set selectedMealTypeIndex(value: number) {
        if (this._selectedMealTypeIndex !== value) {
            this._selectedMealTypeIndex = value;
            this.notifyPropertyChange('selectedMealTypeIndex', value);
        }
    }

    get selectedCookingMethodIndex(): number {
        return this._selectedCookingMethodIndex;
    }

    set selectedCookingMethodIndex(value: number) {
        if (this._selectedCookingMethodIndex !== value) {
            this._selectedCookingMethodIndex = value;
            this.notifyPropertyChange('selectedCookingMethodIndex', value);
        }
    }

    get localizedMealTypes(): string[] {
        return [
            t('mealTypes.breakfast'),
            t('mealTypes.lunch'),
            t('mealTypes.dinner'),
            t('mealTypes.snack')
        ];
    }

    get localizedCookingMethods(): string[] {
        return [
            t('cookingMethods.stovetop'),
            t('cookingMethods.oven'),
            t('cookingMethods.grill'),
            t('cookingMethods.noCook')
        ];
    }

    toggleLanguage() {
        this._currentLanguage = this._currentLanguage === 'TR' ? 'EN' : 'TR';
        setLanguage(this._currentLanguage.toLowerCase() as 'en' | 'tr');
        this.updateLocalizedData();
        this.notifyPropertyChange('currentLanguage', this._currentLanguage);
    }

    private updateLocalizedData() {
        this.notifyPropertyChange('localizedMealTypes', this.localizedMealTypes);
        this.notifyPropertyChange('localizedCookingMethods', this.localizedCookingMethods);
    }

    get ingredients(): string[] {
        return this._ingredients;
    }

    get peopleCount(): number {
        return this._peopleCount;
    }

    set peopleCount(value: number) {
        if (this._peopleCount !== value) {
            this._peopleCount = value;
            this.notifyPropertyChange('peopleCount', value);
        }
    }

    get recipe(): string {
        return this._recipe;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    addIngredient(ingredient: string) {
        this._ingredients.push(ingredient);
        this.notifyPropertyChange('ingredients', this._ingredients);
    }

    removeIngredient(index: number) {
        this._ingredients.splice(index, 1);
        this.notifyPropertyChange('ingredients', this._ingredients);
    }

    setPeopleCount(value: number) {
        this.peopleCount = value;
    }

    async generateRecipe() {
        if (this._ingredients.length === 0) {
            this._recipe = t('messages.fillFields');
            this.notifyPropertyChange('recipe', this._recipe);
            return;
        }

        this._isLoading = true;
        this.notifyPropertyChange('isLoading', true);

        try {
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
            const cookingMethods = ['stovetop', 'oven', 'grill', 'noCook'];

            const recipe = await this.geminiService.getRecipe(
                this._ingredients,
                mealTypes[this._selectedMealTypeIndex],
                this._peopleCount,
                cookingMethods[this._selectedCookingMethodIndex]
            );
            this._recipe = recipe;
            this.notifyPropertyChange('recipe', this._recipe);
        } catch (error) {
            this._recipe = t('messages.error');
            this.notifyPropertyChange('recipe', this._recipe);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }
}