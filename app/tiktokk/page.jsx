"use client";

import React, { useState } from "react";

const videos = [
  {
    creator: "travelwithalex",
    name: "Alex Morgan",
    avatar: "🌍",
    description: "Exploring the beautiful streets of Italy 🇮🇹✨",
    hashtags: "#travel #italy #wanderlust",
    song: "Original sound - travelwithalex",
    likes: "245.8K",
    comments: "3,420",
    shares: "12.5K",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900",
  },
  {
    creator: "foodie_life",
    name: "Foodie Life",
    avatar: "👨🏻‍🍳",
    description: "The most delicious burger you'll ever try 🍔",
    hashtags: "#food #burger #foodtok",
    song: "Cooking vibes - Foodie Life",
    likes: "189.2K",
    comments: "2,180",
    shares: "8,600",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
  },
  {
    creator: "daily.fitness",
    name: "Daily Fitness",
    avatar: "💪",
    description: "Your reminder to keep showing up! 🔥",
    hashtags: "#fitness #motivation #gym",
    song: "Motivation mix",
    likes: "98.4K",
    comments: "1,230",
    shares: "5,200",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900",
  },
];

const suggestedUsers = [
  { name: "Emma Watson", username: "@emmawatson", avatar: "👩🏻" },
  { name: "James Wilson", username: "@jameswilson", avatar: "🧑🏻" },
  { name: "Sophia Lee", username: "@sophialee", avatar: "👩🏽" },
  { name: "David Kim", username: "@davidkim", avatar: "👨🏻" },
];

export default function Page() {
  const [following, setFollowing] = useState([]);
  const [liked, setLiked] = useState([]);
  const [activeTab, setActiveTab] = useState("For You");

  const toggleFollow = (username) => {
    setFollowing((prev) =>
      prev.includes(username)
        ? prev.filter((user) => user !== username)
        : [...prev, username]
    );
  };

  const toggleLike = (creator) => {
    setLiked((prev) =>
      prev.includes(creator)
        ? prev.filter((user) => user !== creator)
        : [...prev, creator]
    );
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top navbar */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="text-3xl font-black tracking-tight">
            <span className="text-[#25f4ee]">Tik</span>
            <span className="text-[#fe2c55]">Tok</span>
          </span>
        </a>

        <div className="mx-4 hidden max-w-xl flex-1 md:block">
          <div className="flex rounded-full bg-gray-100 transition focus-within:ring-2 focus-within:ring-gray-300">
            <input
              type="search"
              placeholder="Search accounts and videos"
              className="w-full bg-transparent px-5 py-3 text-sm outline-none"
            />
            <button className="border-l border-gray-200 px-5 text-xl text-gray-500 hover:text-black">
              ⌕
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-md border border-gray-200 px-4 py-2 text-sm font-bold transition hover:bg-gray-50 sm:block">
            ⊕ Upload
          </button>
          <button className="rounded-md bg-[#fe2c55] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#e0264b]">
            Log in
          </button>
          <button className="text-2xl text-gray-600" aria-label="More options">
            ⋯
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] pt-16">
        {/* Sidebar */}
        <aside className="fixed bottom-0 left-0 top-16 hidden w-60 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 lg:block">
          <nav className="space-y-2">
            {[
              ["⌂", "For You"],
              ["♙", "Following"],
              ["◎", "Explore"],
              ["▣", "LIVE"],
              ["♫", "Sounds"],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-bold transition ${
                  activeTab === label
                    ? "bg-gray-50 text-[#fe2c55]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="mb-4 px-3 text-sm text-gray-500">
              Log in to follow creators, like videos, and view comments.
            </p>
            <button className="w-full rounded-lg border border-[#fe2c55] py-3 font-bold text-[#fe2c55] transition hover:bg-pink-50">
              Log in
            </button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="mb-4 px-3 text-sm font-bold text-gray-500">
              Following accounts
            </h3>
            {suggestedUsers.map((user) => (
              <button
                key={user.username}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl">
                  {user.avatar}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{user.name}</span>
                  <span className="block truncate text-xs text-gray-400">{user.username}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 px-3 text-xs leading-6 text-gray-400">
            About · Newsroom · Contact · Careers ·
            <br />
            © 2026 TikTok UI
          </div>
        </aside>

        {/* Video feed */}
        <section className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-8 lg:ml-60">
          <div className="mb-6 flex items-center justify-center gap-8 border-b border-gray-200">
            {["Following", "For You"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm font-bold ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-gray-900" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {videos.map((video) => (
              <article
                key={video.creator}
                className="mx-auto flex max-w-xl gap-3 border-b border-gray-100 pb-8 sm:gap-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                      {video.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold hover:underline">
                        {video.creator}
                      </h2>
                      <p className="truncate text-xs text-gray-500">{video.name}</p>
                    </div>
                    <button
                      onClick={() => toggleFollow(video.creator)}
                      className={`rounded-md border px-4 py-1.5 text-sm font-bold transition ${
                        following.includes(video.creator)
                          ? "border-gray-300 text-gray-600"
                          : "border-[#fe2c55] text-[#fe2c55] hover:bg-pink-50"
                      }`}
                    >
                      {following.includes(video.creator) ? "Following" : "Follow"}
                    </button>
                  </div>

                  <p className="mb-2 text-sm leading-6">
                    {video.description}{" "}
                    <span className="font-semibold">{video.hashtags}</span>
                  </p>

                  <div className="relative overflow-hidden rounded-xl bg-gray-100 sm:max-w-[420px]">
                    <img
                      src={video.image}
                      alt={`${video.name} video thumbnail`}
                      className="aspect-[9/12] w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="flex h-16 w-16 items-center justify-center rounded-full bg-black/30 text-4xl text-white backdrop-blur-sm transition hover:bg-black/50" aria-label="Play video">
                        ▶
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
                      <span>♫</span>
                      <span>{video.song}</span>
                    </div>
                  </div>
                </div>

                {/* Engagement buttons */}
                <div className="flex shrink-0 flex-col items-center justify-end gap-5 pb-2">
                  <button
                    onClick={() => toggleLike(video.creator)}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-2xl transition ${
                        liked.includes(video.creator)
                          ? "bg-pink-100 text-[#fe2c55]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ♥
                    </span>
                    <span className="text-xs font-bold">
                      {liked.includes(video.creator) ? "Liked" : video.likes}
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-2xl transition hover:bg-gray-200">
                      💬
                    </span>
                    <span className="text-xs font-bold">{video.comments}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-2xl transition hover:bg-gray-200">
                      ↗
                    </span>
                    <span className="text-xs font-bold">{video.shares}</span>
                  </button>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xl text-white">
                    ♫
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="sticky top-20 hidden h-fit w-72 shrink-0 space-y-6 px-4 py-6 xl:block">
          <div>
            <h2 className="mb-4 text-sm font-bold text-gray-500">
              Suggested accounts
            </h2>
            {suggestedUsers.map((user) => (
              <div key={user.username} className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  {user.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{user.username}</h3>
                  <p className="truncate text-xs text-gray-400">{user.name}</p>
                </div>
                <button
                  onClick={() => toggleFollow(user.username)}
                  className="text-xs font-bold text-[#fe2c55] hover:underline"
                >
                  {following.includes(user.username) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
            <button className="text-sm font-bold text-gray-500 hover:text-gray-900">
              See all
            </button>
          </div>

          <div className="border-t border-gray-100 pt-5 text-xs leading-6 text-gray-400">
            <div className="flex flex-wrap gap-x-3">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Newsroom</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Careers</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <p className="mt-3 font-bold text-gray-500">TikTok © 2026 UI</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
