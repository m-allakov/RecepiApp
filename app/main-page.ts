import { EventData, Page, TextField } from '@nativescript/core';
import { RecipeViewModel } from './view-models/recipe-view-model';

let viewModel: RecipeViewModel;

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!viewModel) {
        viewModel = new RecipeViewModel();
    }
    page.bindingContext = viewModel;
}

export function onTapGenerate(args: EventData) {
    viewModel.generateRecipe();
}

export function addIngredient(args: EventData) {
    const page = (<any>args.object).page;
    const textField = <TextField>page.getViewById('ingredientInput');
    const ingredient = textField.text?.trim();
    
    if (ingredient) {
        viewModel.addIngredient(ingredient);
        textField.text = '';
    }
}

export function removeIngredient(args: EventData) {
    const index = (<any>args.object).bindingContext.index;
    viewModel.removeIngredient(index);
}

export function onPeopleCountChange(args: EventData) {
    const slider = <any>args.object;
    viewModel.setPeopleCount(Math.round(slider.value));
}

export function onMealTypeChange(args: EventData) {
    const picker = <any>args.object;
    viewModel.selectedMealTypeIndex = picker.selectedIndex;
}

export function onCookingMethodChange(args: EventData) {
    const picker = <any>args.object;
    viewModel.selectedCookingMethodIndex = picker.selectedIndex;
}

export function onLanguageToggle() {
    viewModel.toggleLanguage();
}