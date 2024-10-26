import React, { useState } from 'react';
import { GeminiService } from './services/gemini.service';
import { useTranslation } from './hooks/useTranslation';

const geminiService = new GeminiService('AIzaSyAl0kF68tAl1dX5QAn6A8IC2vAAwy2sPFU');

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputIngredient, setInputIngredient] = useState('');
  const [selectedMealTypeIndex, setSelectedMealTypeIndex] = useState(0);
  const [selectedCookingMethodIndex, setSelectedCookingMethodIndex] = useState(0);
  const [peopleCount, setPeopleCount] = useState(1);
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'tr'>('en');

  const { t, toggleLanguage } = useTranslation(currentLanguage);

  const mealTypes = [
    t('mealTypes.breakfast'),
    t('mealTypes.lunch'),
    t('mealTypes.dinner'),
    t('mealTypes.snack')
  ];

  const cookingMethods = [
    t('cookingMethods.stovetop'),
    t('cookingMethods.oven'),
    t('cookingMethods.grill'),
    t('cookingMethods.noCook')
  ];

  const addIngredient = () => {
    if (inputIngredient.trim()) {
      setIngredients([...ingredients, inputIngredient.trim()]);
      setInputIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setRecipe(t('messages.fillFields'));
      return;
    }

    setIsLoading(true);
    try {
      const mealTypeValues = ['breakfast', 'lunch', 'dinner', 'snack'];
      const cookingMethodValues = ['stovetop', 'oven', 'grill', 'noCook'];

      const generatedRecipe = await geminiService.getRecipe(
        ingredients,
        mealTypeValues[selectedMealTypeIndex],
        peopleCount,
        cookingMethodValues[selectedCookingMethodIndex]
      );
      setRecipe(generatedRecipe);
    } catch (error) {
      setRecipe(t('messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('appTitle')}</h1>
        <button 
          onClick={() => {
            setCurrentLanguage(currentLanguage === 'en' ? 'tr' : 'en');
            toggleLanguage();
          }}
          className="px-3 py-1 bg-blue-700 rounded"
        >
          {currentLanguage.toUpperCase()}
        </button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Ingredients Input */}
          <div>
            <h2 className="text-lg font-bold mb-2">{t('ingredients.title')}</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputIngredient}
                onChange={(e) => setInputIngredient(e.target.value)}
                placeholder={t('ingredients.placeholder')}
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              />
              <button
                onClick={addIngredient}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {t('ingredients.addButton')}
              </button>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="bg-white p-4 rounded-lg shadow max-h-40 overflow-y-auto">
            {ingredients.length === 0 ? (
              <p className="text-gray-500">{t('ingredients.empty')}</p>
            ) : (
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 px-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Meal Type */}
          <div>
            <h2 className="text-lg font-bold mb-2">{t('mealTypes.title')}</h2>
            <select
              value={selectedMealTypeIndex}
              onChange={(e) => setSelectedMealTypeIndex(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {mealTypes.map((type, index) => (
                <option key={index} value={index}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* People Count */}
          <div>
            <h2 className="text-lg font-bold mb-2">{t('peopleCount.title')}</h2>
            <input
              type="range"
              min="1"
              max="10"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-center">
              {peopleCount} {t('peopleCount.person')}
            </p>
          </div>

          {/* Cooking Method */}
          <div>
            <h2 className="text-lg font-bold mb-2">{t('cookingMethods.title')}</h2>
            <select
              value={selectedCookingMethodIndex}
              onChange={(e) => setSelectedCookingMethodIndex(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {cookingMethods.map((method, index) => (
                <option key={index} value={index}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRecipe}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg disabled:bg-blue-400"
          >
            {t('buttons.generate')}
          </button>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">{t('messages.loading')}</p>
            </div>
          )}

          {/* Recipe Output */}
          {recipe && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <pre className="whitespace-pre-wrap">{recipe}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;