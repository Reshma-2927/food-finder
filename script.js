const API = {
  categories: 'https://www.themealdb.com/api/json/v1/1/categories.php',
  mealsByCategory: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=',
  searchMeal: 'https://www.themealdb.com/api/json/v1/1/search.php?s='
};

let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();

  document.getElementById("menu-button").onclick = () => {
    document.getElementById("sidebar").classList.remove("translate-x-full");
    document.getElementById("sidebar-overlay").classList.remove("hidden");
  };

  document.getElementById("close-button").onclick = () => {
    document.getElementById("sidebar").classList.add("translate-x-full");
    document.getElementById("sidebar-overlay").classList.add("hidden");
  };

  document.getElementById("sidebar-overlay").onclick = () => {
    document.getElementById("sidebar").classList.add("translate-x-full");
    document.getElementById("sidebar-overlay").classList.add("hidden");
  };

  document.getElementById("search-form").onsubmit = (e) => {
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    if (query) fetchMeals(query, true);
  };
});

function fetchCategories() {
  fetch(API.categories)
    .then(res => res.json())
    .then(data => {
      allCategories = data.categories;
      const grid = document.getElementById("categories-grid");
      const list = document.getElementById("sidebar-category-list");

      if (!grid || !list) {
        console.error("Missing #categories-grid or #sidebar-category-list in HTML");
        return;
      }

      grid.innerHTML = "";
      list.innerHTML = "";

      data.categories.forEach(category => {
        // CATEGORY CARD
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative";
        card.innerHTML = `
          <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-40 object-cover" />
          <span class="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow">${category.strCategory}</span>
        `;
        card.onclick = () => fetchMeals(category.strCategory);
        grid.appendChild(card);

        // SIDEBAR LINK
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="block px-4 py-2 hover:bg-orange-100 hover:text-orange-600">${category.strCategory}</a>`;
        li.onclick = (e) => {
          e.preventDefault();
          document.getElementById("sidebar").classList.add("translate-x-full");
          document.getElementById("sidebar-overlay").classList.add("hidden");
          fetchMeals(category.strCategory);
        };
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error fetching categories", err);
    });
}

function fetchMeals(key, isSearch = false) {
  const url = isSearch ? API.searchMeal + key : API.mealsByCategory + key;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("meals-grid");
      const container = document.getElementById("meals-section");
      const title = document.getElementById("category-title");
      const desc = document.getElementById("category-description");
      const box = document.getElementById("category-description-container");

      if (!grid || !container || !title || !desc || !box) {
        console.error("Missing meals container elements in HTML");
        return;
      }

      grid.innerHTML = "";
      container.classList.remove("hidden");

      if (!isSearch) {
        const match = allCategories.find(c => c.strCategory === key);
        if (match) {
          title.textContent = match.strCategory;
          desc.textContent = match.strCategoryDescription;
        }
      } else {
        title.textContent = "Search Results";
        desc.textContent = "Showing meals that match your search.";
      }
      box.classList.remove("hidden");

      const meals = data.meals || [];
      if (meals.length === 0) {
        grid.innerHTML = "<p class='col-span-full text-center text-gray-500'>No meals found.</p>";
        return;
      }

      meals.forEach(meal => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden cursor-pointer";
        card.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover" />
          <div class="p-3 font-semibold text-center text-gray-800">${meal.strMeal}</div>
        `;
        card.onclick = () => window.location.href = `meal.html?id=${meal.idMeal}`;
        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error fetching meals", err);
    });
}

