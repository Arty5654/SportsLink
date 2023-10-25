"use client"
import React, { useState, useEffect } from "react";
import Sidebar from "@components/profileSidebar";
import axios from "axios";
import "@styles/global.css";

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the email query parameter from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const userEmail = queryParams.get("email");

    axios
      .get(`http://localhost:5000/get_user_info?email=${userEmail}`)
      .then((response) => {
        setUserProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user profile', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex">
      <Sidebar active="search" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-3/4 text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
          <div className="pb-8">
            <h1 className="font-base text-3xl">
              {userProfile.firstName} {userProfile.lastName}
            </h1>
            <p className="text-gray-500 pb-8">{userProfile.username}</p>
          </div>
          <div className="flex gap-8 pb-8 border-b border-gray-200">
            {/* You can add the Friends and Messages links here */}
          </div>
          <div className="text-base pb-4">
            <p className="pt-8 pb-4 text-xs text-gray-500">Contact Information</p>
            <div className="flex flex-col gap-4">
              <p className="items-end">
                Phone: <span className="text-blue-500 text-sm"> {userProfile.phoneNumber}</span>
              </p>
              <p className="items-end">
                Email: <span className="text-blue-500 text-sm"> {userProfile.email}</span>
              </p>
              <p className="items-end">
                Address: <span className="text-sm text-blue-500">{userProfile.city}</span>
              </p>
            </div>
          </div>
          <div>
            <p className="pt-8 pb-4 text-xs text-gray-500">Basic Information</p>
            <div className="flex flex-col gap-4">
              <p className="items-end">
                Birthday: <span className="text-sm text-blue-500">{userProfile.birthday}</span>
              </p>
              <p className="items-end">
                Gender: <span className="text-sm text-blue-500">{userProfile.gender}</span>
              </p>
              <p className="items-end">
                Age: <span className="text-sm text-blue-500">{userProfile.age}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;