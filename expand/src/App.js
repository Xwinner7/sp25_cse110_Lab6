import React, { useState, useEffect } from 'react';
import './App.css';
import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';

const RECIPES_STORAGE_KEY = 'recipes';

function App() {
  const [recipes, setRecipes] = useState([]);

  // 加载初始数据
  useEffect(() => {
    const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (storedRecipes) {
      try {
        const parsedRecipes = JSON.parse(storedRecipes);
        // 确保解析出来的是数组
        if (Array.isArray(parsedRecipes)) {
            setRecipes(parsedRecipes);
        } else {
            console.error("Stored recipes are not an array, loading defaults.");
            loadInitialData();
        }
      } catch (error) {
        console.error("Error parsing recipes from localStorage:", error);
        loadInitialData(); // localStorage 数据损坏，尝试从 public/recipes.json 加载
      }
    } else {
      loadInitialData(); // localStorage 中没有数据，从 public/recipes.json 加载
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，仅在组件挂载时运行一次

  // 从 public/recipes.json 加载数据
  const loadInitialData = () => {
    fetch('/recipes.json') // 确保 recipes.json 在 public 文件夹中
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // 确保获取到的是数组
        if (Array.isArray(data)) {
            setRecipes(data);
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(data));
        } else {
            console.error("Fetched initial recipes are not an array. Setting to empty.");
            setRecipes([]);
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify([]));
        }
      })
      .catch(error => {
        console.error("Could not load initial recipes:", error);
        setRecipes([]); // 即使加载失败，也设置一个空数组
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify([]));
      });
  };

  // 当 recipes 状态改变时，更新 localStorage
  useEffect(() => {
    // 只有当 recipes 已经初始化后（即不再是初始的空数组，除非初始加载就是空）才更新 localStorage
    // 这避免了在首次渲染、数据尚未从 localStorage 或 fetch 加载完成时，用空数组覆盖掉 localStorage 的情况
    const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (recipes.length > 0 || storedRecipes !== null ) { // 如果recipes有内容，或localStorage明确存在（即使是空数组的字符串）
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
    }
  }, [recipes]);

  const addRecipeHandler = (newRecipeData) => {
    // 为新食谱添加一个唯一 ID，用于 React 的 key
    const recipeWithId = { ...newRecipeData, id: Date.now().toString() }; 
    setRecipes(prevRecipes => [...prevRecipes, recipeWithId]);
  };

  const clearRecipesHandler = () => {
    setRecipes([]);
    // localStorage 将在上面的 useEffect 中被更新为空数组字符串 '[]'
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe App</h1>
      </header>
      <RecipeForm 
        onAddRecipe={addRecipeHandler} 
        onClearRecipes={clearRecipesHandler} 
      />
      <main style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            // 使用 recipe.id (如果存在) 或 recipe.titleTxt (如果存在) 作为key，最后回退到 Date.now() 随机数
            <RecipeCard key={recipe.id || recipe.titleTxt || Date.now() * Math.random()} recipe={recipe} />
          ))
        ) : (
          <p>No recipes to display. Add some using the form above or check `public/recipes.json`!</p>
        )}
      </main>
    </div>
  );
}

export default App;
