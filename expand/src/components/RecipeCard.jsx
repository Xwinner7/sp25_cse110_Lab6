import React from 'react';
import './RecipeCard.css';

// 从 public 文件夹提供图片路径
const STAR_ICON_PATH = '/assets/images/icons/5-star.svg'; // 假设5星图片固定

function RecipeCard(props) {
  const { recipe } = props;

  // 从 recipe 对象中解构所需属性，提供默认值以防数据缺失
  const imgSrc = recipe.imgSrc || 'https://via.placeholder.com/178x118.png?text=No+Image';
  const title = recipe.titleTxt || recipe.title || 'Untitled Recipe'; // 兼容 titleTxt
  const sourceLink = recipe.titleLnk || recipe.href || '#'; // 兼容 titleLnk
  const organization = recipe.organization || 'Unknown Organization';
  
  // 评级逻辑，兼容 recipes.json 和表单的 rating 结构
  let ratingValue = 0;
  let ratingCount = 0;
  if (recipe.rating && typeof recipe.rating === 'object') { // 来自 RecipeForm
    ratingValue = recipe.rating.average || 0;
    ratingCount = recipe.rating.count || 0;
  } else if (recipe.rating) { // 来自旧版 recipes.json (假设是数字或字符串)
    ratingValue = parseFloat(recipe.rating) || 0;
    ratingCount = parseInt(recipe.numRatings) || 0; // 假设 numRatings 存在
  }

  const time = recipe.lengthTime || recipe.time || 'N/A'; // 兼容 lengthTime
  const ingredients = Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.join(', ')
                      : (typeof recipe.ingredients === 'string' ? recipe.ingredients : 'Not specified');

  return (
    <article>
      <img src={imgSrc} alt={recipe.imgAlt || title} /> {/* 使用 imgAlt */}
      <p className="title">
        <a href={sourceLink} target="_blank" rel="noopener noreferrer">{title}</a>
      </p>
      <p className="organization">{organization}</p>
      <div className="rating">
        {ratingValue > 0 ? (
          <>
            <span>{ratingValue.toFixed(1)}</span>
            <img src={STAR_ICON_PATH} alt={`${ratingValue} stars`} />
            {ratingCount > 0 && <span>({ratingCount})</span>}
          </>
        ) : (
          <span>No rating</span>
        )}
      </div>
      <time>{time}</time>
      <p className="ingredients">
        {ingredients}
      </p>
    </article>
  );
}

export default RecipeCard; 