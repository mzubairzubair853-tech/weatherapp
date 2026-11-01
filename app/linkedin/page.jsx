"use client";

import React from "react";

const posts = [
  {
    name: "Sarah Johnson",
    role: "Product Designer at Google",
    time: "2h",
    avatar: "👩🏻",
    text: "Excited to share that I've just launched my latest design project! 🚀 After months of hard work, it's amazing to see everything come together. Huge thanks to everyone who supported me along the way.",
    tags: "#ProductDesign #UX #Design",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000",
    likes: 248,
    comments: 32,
  },
  {
    name: "Michael Chen",
    role: "Software Engineer at Microsoft",
    time: "5h",
    avatar: "👨🏻",
    text: "A few lessons I've learned as a software engineer:\n\n• Write code for humans first\n• Keep learning every day\n• Ask questions without hesitation\n• Build projects that solve real problems\n\nWhat advice would you give to someone starting their career?",
    tags: "#SoftwareEngineering #CareerGrowth",
    likes: 156,
    comments: 41,
  },
  {
    name: "Emily Davis",
    role: "Marketing Manager | Content Strategy",
    time: "1d",
    avatar: "👩🏼",
    text: "Your personal brand is more than your job title. It's the value you bring, the problems you solve, and the relationships you build. Keep showing up and sharing your journey!",
    tags: "#PersonalBrand #Marketing #Growth",
    likes: 89,
    comments: 17,
  },
];

const suggestions = [
  { name: "David Wilson", role: "Frontend Developer", avatar: "👨🏽" },
  { name: "Sophia Martinez", role: "UI/UX Designer", avatar: "👩🏽" },
  { name: "James Taylor", role: "Data Analyst", avatar: "👨🏻" },
];

const news = [
  { title: "Tech companies expand AI teams", readers: "2,340 readers" },
  { title: "The future of remote work", readers: "1,825 readers" },
  { title: "New skills employers value", readers: "1,210 readers" },
  { title: "Startups attract fresh funding", readers: "980 readers" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f3f2ef] text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <a href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0a66c2] text-2xl font-black text-white">
            in
          </a>

          <div className="hidden w-64 items-center gap-2 rounded-md bg-[#edf3f8] px-3 py-2.5 md:flex">
            <span className="text-gray-500">⌕</span>
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-4">
            {[
              ["⌂", "Home"],
              ["♙", "My Network"],
              ["▣", "Jobs"],
              ["✉", "Messaging"],
              ["♧", "Notifications"],
            ].map(([icon, label]) => (
              <button
                key={label}
                className="flex min-w-10 flex-col items-center gap-1 px-1 text-gray-500 transition hover:text-gray-900 sm:min-w-14"
              >
                <span className="text-xl">{icon}</span>
                <span className="hidden text-[11px] sm:block">{label}</span>
              </button>
            ))}

            <button className="flex flex-col items-center gap-1 border-l border-gray-200 pl-3 text-gray-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-lg">🙂</span>
              <span className="hidden text-[11px] sm:block">Me ▾</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        {/* Left sidebar */}
        <aside className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="h-16 bg-gradient-to-r from-blue-200 to-blue-400" />
            <div className="-mt-8 flex flex-col items-center px-4 pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-4xl">
                👨🏻‍💻
              </div>
              <h2 className="mt-3 text-center font-bold">Zubair Ahmed</h2>
              <p className="mt-1 text-center text-xs text-gray-500">
                Frontend Developer | React & Next.js
              </p>
              <p className="mt-3 text-center text-xs text-gray-400">
                Lahore, Pakistan
              </p>
            </div>

            <div className="border-t border-gray-100 px-4 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Profile viewers</span>
                <span className="font-bold text-[#0a66c2]">128</span>
              </div>
              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">Post impressions</span>
                <span className="font-bold text-[#0a66c2]">1,482</span>
              </div>
            </div>

            <button className="w-full border-t border-gray-100 px-4 py-3 text-left text-xs font-bold hover:bg-gray-50">
              <span className="text-gray-500">▣</span> My saved items
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold">Recent</h3>
            {["# webdevelopment", "# reactjs", "# uiuxdesign"].map((tag) => (
              <button key={tag} className="mb-3 block text-xs font-semibold text-gray-500 hover:text-[#0a66c2]">
                {tag}
              </button>
            ))}
            <button className="mt-2 text-xs font-bold text-[#0a66c2]">
              Discover more
            </button>
          </div>
        </aside>

        {/* Feed */}
        <section className="min-w-0 space-y-4">
          {/* Create post */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-3xl">
                👨🏻‍💻
              </div>
              <button className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-left text-sm font-semibold text-gray-500 transition hover:bg-gray-100">
                Start a post
              </button>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              {[
                ["📷", "Photo", "text-blue-600"],
                ["▣", "Video", "text-green-600"],
                ["📝", "Write article", "text-orange-600"],
              ].map(([icon, label, color]) => (
                <button key={label} className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold transition hover:bg-gray-100 sm:px-4 ${color}`}>
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-px flex-1 bg-gray-300" />
            Sort by: <button className="font-bold text-gray-700">Top ▾</button>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <article key={post.name} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex items-start gap-3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  {post.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold hover:text-[#0a66c2] hover:underline">
                    {post.name}
                  </h3>
                  <p className="truncate text-xs text-gray-500">{post.role}</p>
                  <p className="mt-1 text-xs text-gray-400">{post.time} · 🌐</p>
                </div>
                <button className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100" aria-label="More options">
                  ···
                </button>
              </div>

              <div className="px-4 pb-3">
                <p className="whitespace-pre-line text-sm leading-6">{post.text}</p>
                <p className="mt-2 text-sm font-semibold text-[#0a66c2]">{post.tags}</p>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="max-h-[420px] w-full object-cover"
                />
              )}

              <div className="mx-4 flex items-center justify-between border-b border-gray-100 py-3 text-xs text-gray-500">
                <span>👍 ❤️ 👏 {post.likes}</span>
                <span>{post.comments} comments · 8 reposts</span>
              </div>

              <div className="grid grid-cols-4 px-2 py-1">
                {[
                  ["👍", "Like"],
                  ["▢", "Comment"],
                  ["↻", "Repost"],
                  ["➤", "Send"],
                ].map(([icon, label]) => (
                  <button key={label} className="flex flex-col items-center gap-1 rounded-md py-3 text-xs font-bold text-gray-500 transition hover:bg-gray-100 sm:flex-row sm:justify-center sm:gap-2">
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">LinkedIn News</h2>
              <span className="text-gray-400">ⓘ</span>
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Top stories
            </p>
            {news.map((item) => (
              <button key={item.title} className="mb-4 block text-left">
                <h3 className="text-sm font-semibold hover:text-[#0a66c2]">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-400">{item.readers}</p>
              </button>
            ))}
            <button className="text-sm font-bold text-gray-500 hover:text-[#0a66c2]">
              Show more ↓
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-4 font-bold">People you may know</h2>
            {suggestions.map((person) => (
              <div key={person.name} className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  {person.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{person.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{person.role}</p>
                  <button className="mt-2 rounded-full border border-gray-500 px-4 py-1 text-xs font-bold text-gray-600 transition hover:border-[#0a66c2] hover:bg-blue-50 hover:text-[#0a66c2]">
                    + Connect
                  </button>
                </div>
              </div>
            ))}
            <button className="mt-1 text-sm font-bold text-gray-500 hover:text-[#0a66c2]">
              View all
            </button>
          </div>

          <footer className="px-3 py-2 text-center text-xs leading-6 text-gray-500">
            <div className="flex flex-wrap justify-center gap-x-3">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Help Center</a>
              <a href="#" className="hover:underline">Privacy & Terms</a>
              <a href="#" className="hover:underline">Advertising</a>
            </div>
            <p className="mt-2 font-bold text-[#0a66c2]">LinkedIn <span className="text-gray-500">© 2026</span></p>
          </footer>
        </aside>
      </div>
    </main>
  );
}
