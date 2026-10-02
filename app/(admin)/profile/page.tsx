"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#78942b]">
            Account
          </p>
          <h1 className="text-3xl font-semibold text-[#292431]">Profile settings</h1>
        </div>
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "!w-full !max-w-none !rounded-xl !border-black/8 !bg-[#fffefa] !shadow-sm",
            },
          }}
        />
      </div>
    </div>
  );
}
