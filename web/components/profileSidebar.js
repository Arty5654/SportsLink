"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const profileSidebar = ({ active }) => {
  return (
    <div className="text-left">
      <div className="flex flex-col gap-4">
        <Link href="/profile">
          <p
            className={`cursor-pointer ${
              active === "info" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            My Info
          </p>
        </Link>
        <Link href="/profile/edit">
          <p
            className={`cursor-pointer ${
              active === "edit" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            Edit Profile
          </p>
        </Link>
        <Link href="/profile/notif_pref">
          <p
            className={`cursor-pointer ${
              active === "notif_pref" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            Notification Preferences
          </p>
        </Link>
        <Link href="/profile/privacy">
          <p
            className={`cursor-pointer ${
              active === "privacy" ? "border-l-4 border-blue-500 pl-1" : ""
            } `}
          >
            Privacy
          </p>
        </Link>
        <Link href="/profile/search">
          <p
            className={`cursor-pointer ${
              active === "search" ? "border-l-4 border-blue-500 pl-1" : ""
            } `}
          >
            User Look Up
          </p>
        </Link>
        <Link href="/profile/userPlayerHistory">
          <p
            className={`cursor-pointer ${
              active === "userPlayerHistory" ? "border-l-4 border-blue-500 pl-1" : ""
            } `}
          >
            User Player History
          </p>
        </Link>
        <Link href="/profile/myEvents">
          <p
            className={`cursor-pointer ${
              active === "myEvents" ? "border-l-4 border-blue-500 pl-1" : ""
            }`}
          >
            My Events
          </p>
        </Link>
        <p>Settings</p>
      </div>
    </div>
  );
};

export default profileSidebar;
