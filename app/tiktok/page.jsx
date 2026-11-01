"use client";

import React from "react";

const friends = [
  { name: "Ayesha Khan", message: "Sent you a Snap", time: "2m", avatar: "👩🏻", online: true },
  { name: "Ali Ahmed", message: "You: Haha 😂", time: "5m", avatar: "👨🏻", online: true },
  { name: "Sara Malik", message: "New Snap", time: "12m", avatar: "👩🏽", online: false },
  { name: "Hamza", message: "Received a Snap", time: "20m", avatar: "👨🏽", online: true },
  { name: "Fatima Noor", message: "You: See you soon!", time: "1h", avatar: "👩🏼", online: false },
  { name: "Usman", message: "Delivered", time: "2h", avatar: "👨🏾", online: false },
  { name: "Zara", message: "New Snap", time: "3h", avatar: "👩🏻‍🦰", online: true },
];

const stories = [
  { name: "My Story", avatar: "😎", own: true },
  { name: "Ayesha", avatar: "👩🏻" },
  { name: "Ali", avatar: "👨🏻" },
  { name: "Sara", avatar: "👩🏽" },
  { name: "Hamza", avatar: "👨🏽" },
  { name: "Fatima", avatar: "👩🏼" },
  { name: "Zara", avatar: "👩🏻‍🦰" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 flex h-16 items-center justify-between bg-[#fffc00] px-4 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            👻
          </div>
          <span className="hidden text-xl font-black tracking-tight sm:block">
            Snapchat
          </span>
        </div>

        <div className="mx-4 hidden max-w-xl flex-1 md:block">
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-full border border-black/5 bg-white/80 px-5 py-2.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-black/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-xl transition hover:bg-black/10" aria-label="Camera">
            📸
          </button>
          <button className="rounded-full p-2 text-xl transition hover:bg-black/10" aria-label="Map">
            🗺️
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xl">
            😎
          </div>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-[1fr_340px] lg:p-8">
        {/* Main content */}
        <section className="min-w-0">
          <div className="mb-6 md:hidden">
            <input
              type="search"
              placeholder="Search friends"
              className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Stories */}
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Stories</h2>
              <button className="text-sm font-semibold text-gray-500 hover:text-black">
                View all
              </button>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-2">
              {stories.map((story) => (
                <button
                  key={story.name}
                  className="group flex min-w-[64px] flex-col items-center gap-2"
                >
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                    story.own
                      ? "border-2 border-dashed border-gray-300 bg-gray-100"
                      : "border-[3px] border-yellow-400 bg-white p-1"
                  }`}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                      {story.avatar}
                    </div>
                    {story.own && (
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm font-bold text-white">
                        +
                      </span>
                    )}
                  </div>
                  <span className="max-w-[70px] truncate text-xs font-medium">
                    {story.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat list */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Chat</h2>
              <button className="rounded-full bg-yellow-300 px-4 py-2 text-sm font-bold transition hover:bg-yellow-400">
                New Chat +
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {friends.map((friend) => (
                <button
                  key={friend.name}
                  className="flex w-full items-center gap-4 rounded-xl px-3 py-4 text-left transition hover:bg-gray-50"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {friend.avatar}
                    {friend.online && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold">{friend.name}</span>
                      <span className="shrink-0 text-xs text-gray-400">{friend.time}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {friend.message}
                    </p>
                  </div>

                  <span className="text-lg text-gray-300">›</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between p-5">
              <h2 className="font-bold">Snap Map</h2>
              <span className="text-xl">📍</span>
            </div>

            <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#dce9d5]">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-1/4 top-0 h-full w-5 rotate-12 bg-white" />
                <div className="absolute left-2/3 top-0 h-full w-8 -rotate-12 bg-white" />
                <div className="absolute left-0 top-1/3 h-5 w-full rotate-6 bg-white" />
                <div className="absolute left-0 top-2/3 h-8 w-full -rotate-3 bg-white" />
                <div className="absolute left-1/2 top-0 h-full w-2 bg-[#b6d8ef]" />
              </div>

              {[
                "left-[25%] top-[25%]",
                "left-[65%] top-[35%]",
                "left-[45%] top-[65%]",
                "left-[75%] top-[75%]",
              ].map((position, index) => (
                <div
                  key={index}
                  className={`absolute ${position} flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-yellow-300 text-xl shadow-md`}
                >
                  {["👨🏻", "👩🏻", "👨🏽", "👩🏼"][index]}
                </div>
              ))}

              <button className="absolute bottom-3 right-3 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-md transition hover:bg-gray-100">
                Open Map →
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold">Quick Actions</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center gap-3 rounded-xl bg-yellow-50 p-3 text-sm font-semibold transition hover:bg-yellow-100">
                <span className="text-xl">📷</span>
                Take a Snap
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-semibold transition hover:bg-gray-100">
                <span className="text-xl">👥</span>
                Add Friends
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-semibold transition hover:bg-gray-100">
                <span className="text-xl">👤</span>
                My Profile
              </button>
            </div>
          </div>

          <p className="px-2 text-center text-xs text-gray-400">
            Terms · Privacy · Community Guidelines
          </p>
        </aside>
      </div>
    </main>
  );
}
