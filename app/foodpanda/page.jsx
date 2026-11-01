"use client";

import React from "react";

const categories = [
  { name: "Pizza", emoji: "🍕" },
  { name: "Burgers", emoji: "🍔" },
  { name: "Biryani", emoji: "🍛" },
  { name: "Chinese", emoji: "🍜" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Drinks", emoji: "🥤" },
  { name: "Healthy", emoji: "🥗" },
  { name: "Fast Food", emoji: "🍟" },
];

const restaurants = [
  {
    name: "Pizza Hut",
    cuisine: "Pizza · Italian",
    rating: "4.8",
    time: "25–35 min",
    price: "Rs. 250",
    image: "https://images.unsplash.com/photo- pizza",
    emoji: "🍕",
    offer: "30% OFF",
  },
  {
    name: "Burger Lab",
    cuisine: "Burgers · Fast Food",
    rating: "4.7",
    time: "20–30 min",
    price: "Rs. 150",
    emoji: "🍔",
    offer: "Free delivery",
  },
  {
    name: "Biryani Express",
    cuisine: "Pakistani · Biryani",
    rating: "4.6",
    time: "30–40 min",
    price: "Rs. 100",
    emoji: "🍛",
    offer: "20% OFF",
  },
  {
    name: "Sweet Treats",
    cuisine: "Desserts · Bakery",
    rating: "4.9",
    time: "15–25 min",
    price: "Rs. 120",
    emoji: "🍰",
    offer: "Buy 1 Get 1",
  },
];

const foodImages = [
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d70f64] text-2xl text-white">
              🐼
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#d70f64]">
              foodpanda
            </span>
          </div>

          <div className="hidden max-w-xl flex-1 md:block">
            <input
              type="search"
              placeholder="Search for restaurants or dishes"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none transition focus:border-[#d70f64] focus:bg-white focus:ring-2 focus:ring-[#d70f64]/10"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold transition hover:border-[#d70f64] hover:text-[#d70f64]">
              Log in
            </button>
            <button className="rounded-xl bg-[#d70f64] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b80c54]">
              Sign up
            </button>
            <button className="relative rounded-xl bg-gray-100 p-3 text-xl transition hover:bg-gray-200" aria-label="Cart">
              🛒
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d70f64] text-xs font-bold text-white">
                2
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Location */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Delivering to
            </p>
            <button className="mt-1 flex items-center gap-2 font-bold">
              📍 Lahore, Pakistan
              <span className="text-[#d70f64]">⌄</span>
            </button>
          </div>
          <div className="md:hidden">
            <input
              type="search"
              placeholder="Search food..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#d70f64]"
            />
          </div>
        </div>

        {/* Hero banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#d70f64] p-8 text-white sm:p-12">
          <div className="relative z-10 max-w-xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-pink-100">
              Hungry? We've got you.
            </p>
            <h1 className="text-3xl font-black leading-tight sm:text-5xl">
              Your favorites,
              <br />
              delivered fast.
            </h1>
            <p className="mt-4 max-w-md text-sm text-pink-100 sm:text-base">
              Order from the best restaurants in your city and enjoy delicious food at your doorstep.
            </p>
            <button className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-[#d70f64] shadow-lg transition hover:bg-pink-50">
              Order now →
            </button>
          </div>
          <div className="absolute -right-8 -top-12 text-[180px] opacity-20 sm:right-10 sm:text-[240px]">
            🐼
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">What are you craving?</h2>
            <button className="text-sm font-bold text-[#d70f64] hover:underline">
              View all
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {categories.map((category) => (
              <button
                key={category.name}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-3xl transition group-hover:bg-pink-100">
                  {category.emoji}
                </span>
                <span className="text-center text-xs font-bold sm:text-sm">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Offers */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-extrabold">Offers for you</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between overflow-hidden rounded-2xl bg-[#ffe5ef] p-6">
              <div>
                <p className="text-xs font-bold uppercase text-[#d70f64]">Limited time</p>
                <h3 className="mt-2 text-2xl font-black text-gray-900">Up to 40% OFF</h3>
                <p className="mt-1 text-sm text-gray-600">On selected restaurants</p>
                <button className="mt-4 rounded-lg bg-[#d70f64] px-4 py-2 text-sm font-bold text-white hover:bg-[#b80c54]">
                  Explore deals
                </button>
              </div>
              <span className="text-7xl">🍔</span>
            </div>

            <div className="flex items-center justify-between overflow-hidden rounded-2xl bg-[#fff1d6] p-6">
              <div>
                <p className="text-xs font-bold uppercase text-orange-600">New users</p>
                <h3 className="mt-2 text-2xl font-black text-gray-900">Free delivery</h3>
                <p className="mt-1 text-sm text-gray-600">On your first order</p>
                <button className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">
                  Order today
                </button>
              </div>
              <span className="text-7xl">🛵</span>
            </div>
          </div>
        </section>

        {/* Restaurants */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold">Popular restaurants</h2>
            <button className="text-sm font-bold text-[#d70f64] hover:underline">
              See all →
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.map((restaurant, index) => (
              <article
                key={restaurant.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-pink-50">
                  <img
                    src={foodImages[index]}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-[#d70f64] px-3 py-1 text-xs font-bold text-white">
                    {restaurant.offer}
                  </span>
                  <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow transition hover:text-[#d70f64]" aria-label="Favorite">
                    ♡
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="truncate text-lg font-extrabold">{restaurant.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{restaurant.cuisine}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
                    <span className="text-orange-500">★ {restaurant.rating}</span>
                    <span>🕒 {restaurant.time}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500">Delivery from</span>
                    <span className="font-bold">{restaurant.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Popular dishes */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-extrabold">Popular dishes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Classic Cheeseburger", price: "Rs. 650", emoji: "🍔" },
              { name: "Chicken Biryani", price: "Rs. 450", emoji: "🍛" },
              { name: "Pepperoni Pizza", price: "Rs. 1,200", emoji: "🍕" },
            ].map((dish) => (
              <div
                key={dish.name}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-50 text-4xl">
                  {dish.emoji}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold">{dish.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#d70f64]">{dish.price}</p>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d70f64] text-xl font-bold text-white transition hover:bg-[#b80c54]">
                  +
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-lg font-extrabold text-[#d70f64]">🐼 foodpanda</span>
            <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-500">
              <a href="#" className="hover:text-[#d70f64]">About us</a>
              <a href="#" className="hover:text-[#d70f64]">Help center</a>
              <a href="#" className="hover:text-[#d70f64]">Terms & Conditions</a>
              <a href="#" className="hover:text-[#d70f64]">Privacy</a>
            </div>
            <p className="text-xs text-gray-400">© 2026 foodpanda UI</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
