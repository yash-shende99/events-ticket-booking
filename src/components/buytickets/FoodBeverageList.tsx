"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const FOOD_ITEMS = [
  {
    id: "f1",
    name: "Regular Popcorn (Salted)",
    price: 350,
    calories: "340 kcal",
    category: "Snacks",
    image: "/assets/popcorn_cup.png",
    allergens: "None"
  },
  {
    id: "f2",
    name: "Large Popcorn (Cheese)",
    price: 450,
    calories: "520 kcal",
    category: "Snacks",
    image: "/assets/popcorn_cup.png",
    allergens: "Milk"
  },
  {
    id: "f3",
    name: "Pepsi (Regular)",
    price: 180,
    calories: "150 kcal",
    category: "Beverages",
    image: "/assets/pepsi.png",
    allergens: "Caffeine"
  },
  {
    id: "f4",
    name: "Nachos with Salsa & Cheese",
    price: 280,
    calories: "450 kcal",
    category: "Snacks",
    image: "/assets/nachos.png",
    allergens: "Milk, Gluten"
  },
  {
    id: "f5",
    name: "Popcorn Combo 1",
    price: 650,
    calories: "890 kcal",
    category: "Combos",
    image: "/assets/popcorn_cup.png",
    allergens: "Milk, Caffeine"
  },
  {
    id: "f6",
    name: "Cold Coffee",
    price: 220,
    calories: "280 kcal",
    category: "Beverages",
    image: "/assets/coffee.png",
    allergens: "Milk, Caffeine"
  }
];

export default function FoodBeverageList({ activeCategory, searchQuery, onFoodTotalChange }: { activeCategory: string, searchQuery: string, onFoodTotalChange: (total: number) => void }) {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let total = 0;
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = FOOD_ITEMS.find(f => f.id === itemId);
      if (item) {
        total += item.price * qty;
      }
    });
    onFoodTotalChange(total);
  }, [cart, onFoodTotalChange]);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredItems = FOOD_ITEMS.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredItems.map((item) => {
        const qty = cart[item.id] || 0;

        return (
          <div key={item.id} className="bg-white rounded-lg p-5 flex gap-5 shadow-sm transition hover:shadow-md">
            
            {/* Left Side: Image & Icon */}
            <div className="w-28 flex flex-col items-center flex-shrink-0">
              <div className="w-full flex justify-start mb-2">
                <div className="w-3 h-3 border border-green-600 flex items-center justify-center rounded-sm">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="w-24 h-24 relative">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain" unoptimized={item.image.startsWith('http')} />
              </div>
            </div>
            
            {/* Right Side: Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {item.calories} | Allergens: {item.allergens}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-900">₹{item.price}</div>
                
                {qty === 0 ? (
                  <button 
                    onClick={() => updateQty(item.id, 1)}
                    className="border border-[#f84464] text-[#f84464] px-8 py-1.5 rounded text-sm font-semibold hover:bg-red-50 transition"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center border border-[#f84464] rounded bg-white overflow-hidden shadow-sm">
                    <button 
                      onClick={() => updateQty(item.id, -1)}
                      className="px-3 py-1.5 text-[#f84464] hover:bg-red-50 font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm font-semibold text-[#f84464] w-8 text-center">{qty}</span>
                    <button 
                      onClick={() => updateQty(item.id, 1)}
                      className="px-3 py-1.5 text-[#f84464] hover:bg-red-50 font-bold"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
