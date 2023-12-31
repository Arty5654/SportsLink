"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "@app/User";
import SmallMap from "./SmallMap";
import eventsCSS from "./eventsCSS.css";

const ParticipantCard = ({ username }) => {
  const [user, setUser] = useState(new User());
  const [friendEmail, setFriendEmail] = useState("");

  // set initial state
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const convertUsername = async () => {
      try {
        await axios
          .post("http://localhost:5000/get_email_from_username", {
            friendUsername: username,
          })
          .then((response) => {
            console.log("Email response", response.data);
            setFriendEmail(response.data);
          });
      } catch (error) {
        console.log("Error converting username to email");
      }
    };

    convertUsername();
  }, []);

  const handleAddFriend = () => {
    try {
      const r = axios.post("http://localhost:5000/send_friend_request", {
        email: user.email,
        friend_email: friendEmail.email,
      });

      r.then((response) => {
        if (response.status === 200) {
          alert("Friend Request sent!");
          console.log("Friend request sent");
        } else if (response.status === 204) {
          console.log("There is already a request pending between you and this user!");
        }
      }).catch((error) => {
        //run this code always when status!==200
        if (error.response) {
          if (error.response.status === 404) {
            // friend doesnt exist
            console.log("This user does not exist!");
            alert("This user does not exist! Tell them to sign up!");
          } else if (error.response.status === 409) {
            // pending request already exists or already friends
            console.log(
              "There might already be a request between you and this user, or you are already friends!"
            );
            alert(
              "There might already be a request between you and this user, or you are already friends!\n\nClick the bell icon to see your pending requests, or wait till they accept your request"
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
    } catch (error) {
      console.log("Friend request error");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm border-l border-gray-400 px-2 relative">{username}</p>
      <div onClick={handleAddFriend} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="gray"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
};

const EventDetails = () => {
  const router = useRouter();
  const [user, setUser] = useState(new User());
  const [event, setEvent] = useState({
    title: "",
    desc: "",
    address: "",
    lat: 0,
    lng: 0,
    sport: "",
    level: "",
    open: false,
    currentParticipants: 0,
    maxParticipants: 0,
    participants: [],
    eventOwner: "",
    town: "",
    end: false,
    teamGreen: [],
    teamBlue: [],
  });

  const status = event.currentParticipants < event.maxParticipants ? "Open" : "Closed";
  const eventOwner = event.eventOwner === user.email;
  const isUserParticipant = event.participants.some(participant => participant.username === user?.username);
  const searchParams = useSearchParams();
  const eventID = searchParams.get("id");
  const [isMemberOfGreen, setIsMemberOfGreen] = useState(false);
  const [isMemberOfBlue, setIsMemberOfBlue] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser) {
      router.push("/signin");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        axios.get(`http://localhost:5000/get_event_details?id=${eventID}`).then((response) => {
          const data = response.data;
          console.log(data);
          setEvent({
            title: data.title,
            desc: data.desc,
            address: data.address,
            lat: data.lat,
            lng: data.lng,
            sport: data.sport,
            level: data.level,
            open: data.open,
            currentParticipants: data.currentParticipants,
            maxParticipants: data.maxParticipants,
            participants: data.participants,
            eventOwner: data.eventOwner,
            town: data.town,
            end: data.end,
            teamBlue: data.teamBlue,
            teamGreen: data.teamGreen,
          });

          if (event.teamBlue && event.teamBlue.includes(user.username)) {
            setIsMemberOfBlue(true);
          } else {
            setIsMemberOfBlue(false);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getEventDetails();
  }, [eventID]);

  const handleJoinEvent = () => {
    if (isUserParticipant) {
      // user is registered for event
      axios
        .post("http://localhost:5000/leave_event", {
          id: eventID,
          username: user.username,
        })
        .then((response) => {
          if (response.status === 200) {
            alert("You have successfully left the event");
            window.location.reload();
          }
        });
    } else {
      // user isnt registered for event
      if (event.currentParticipants < event.maxParticipants) {
        // join event

        let updatedUser = { ...user };

        if (event.sport === "Tennis") {
          updatedUser.numTennis = (updatedUser.numTennis || 0) + 1;
        } else if (event.sport === "Weightlifting") {
          updatedUser.numWeights = (updatedUser.numWeights || 0) + 1;
        } else if (event.sport === "Basketball") {
          updatedUser.numBasketball = (updatedUser.numBasketball || 0) + 1;
        } else if (event.sport === "Soccer") {
          updatedUser.numSoccer = (updatedUser.numSoccer || 0) + 1;
        }

        setUser(updatedUser);
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        axios
          .post("http://localhost:5000/join_event", {
            id: eventID,
            username: user.username,
            numBasketball: updatedUser.numBasketball,
            numTennis: updatedUser.numTennis,
            numSoccer: updatedUser.numSoccer,
            numWeights: updatedUser.numWeights,
            teamGreen: event.teamGreen,
            teamBlue: event.teamBlue,
          })
          .then((response) => {
            if (response.status === 200) {
              alert("You have successfully joined the event!");
              window.location.reload();
            }
          })
          .catch((error) => {
            console.error("Error joining event: ", error);
          });
        // add to event history
        axios
          .post("http://localhost:5000/add_event_history", {
            event: eventID,
            user: user.username,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("Added to History");
            }
          });
      } else {
        alert("The event is full. You cannot join at the moment.");
      }
    }
  };

  const handleEditClick = () => {
    router.push(`/edit-event?id=${eventID}`);
  };

  const handleJoinTeam = (team) => {
    const updatedEvent = { ...event };

    if (event.teamBlue.includes(user.username)) {
      alert("Already a part of Team Blue");
      setIsMemberOfGreen(false);
      setIsMemberOfBlue(true);

      return;
    }
    if (event.teamGreen.includes(user.username)) {
      alert("Already a part of Team Green");
      setIsMemberOfGreen(true);
      setIsMemberOfBlue(false);

      return;
    }
    if (team === "green") {
      updatedEvent.teamGreen.push(user.username);
      updatedEvent.teamBlue = updatedEvent.teamBlue.filter((email) => email !== user.username);
      setIsMemberOfGreen(true);
      setIsMemberOfBlue(false);

      if (!isUserParticipant) {
        handleJoinEvent();
      }
    } else if (team === "blue") {
      updatedEvent.teamBlue.push(user.username);
      updatedEvent.teamGreen = updatedEvent.teamGreen.filter(
        (email) => email !== user.username
      );
      setIsMemberOfBlue(true);
      setIsMemberOfGreen(false);

      if (!isUserParticipant) {
        handleJoinEvent();
      }
    }
    setEvent(updatedEvent);
    axios
      .post("http://localhost:5000/update_lists", {
        id: eventID,
        teamGreen: event.teamGreen,
        teamBlue: event.teamBlue,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Added to Team");
        }
      });
  };

  const handleLeaveTeam = (team) => {
    const updatedEvent = { ...event };
    if (team === "green") {
      updatedEvent.teamGreen = updatedEvent.teamGreen.filter(
        (email) => email !== user.username
      );
      setIsMemberOfGreen(false);
    } else if (team === "blue") {
      updatedEvent.teamBlue = updatedEvent.teamBlue.filter((email) => email !== user.username);
      setIsMemberOfBlue(false);
    }
    setEvent(updatedEvent);
    axios
      .post("http://localhost:5000/update_lists", {
        id: eventID,
        teamGreen: event.teamGreen,
        teamBlue: event.teamBlue,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Added to Team");
        }
      });
  };

  return (
    <div className="w-full flex gap-8">
      {/* ITEM: Left Side */}
      <div className="w-4/5">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-semibold">{event.title}</h1>

          {event.end ? (
            <p></p>
          ) : (
            <div>
              {eventOwner ? (
                <button
                  className="text-sm font-base text-gray-500 pb-1 cusor-pointer"
                  onClick={handleEditClick}
                >
                  <u>Edit</u>
                </button>
              ) : (
                <p></p>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 font-base border-b border-gray-300 pb-4">
          {event.sport} in {event.town} • <span className="text-blue-500">{event.level}</span>
        </p>

        {event.end ? (
          <div>
            <p className="pt-4 text-xl font-semibold">Event Summary</p>
            <p>{event.desc}</p>
          </div>
        ) : (
          <p className="pt-4">{event.desc}</p>
        )}

        <div className="mt-8">
          <SmallMap
            center={{ lat: event.lat, lng: event.lng }}
            zoom={15}
            address={event.address}
          />
        </div>
        <div className="team-container">
          <div className="team-card green-team">
            <h3 className="team-title">Team Green</h3>
            {event.teamGreen.map((member, index) => (
              <p key={index} className="team-member">
                {member}
              </p>
            ))}
            {isMemberOfGreen ? (
              <button onClick={() => handleLeaveTeam("green")}>Leave Team</button>
            ) : (
              <button onClick={() => handleJoinTeam("green")} disabled={isMemberOfBlue}>
                Join Team
              </button>
            )}
          </div>

          <div className="team-card blue-team">
            <h3 className="team-title">Team Blue</h3>
            {event.teamBlue.map((member, index) => (
              <p key={index} className="team-member">
                {member}
              </p>
            ))}
            {isMemberOfBlue ? (
              <button onClick={() => handleLeaveTeam("blue")}>Leave Team</button>
            ) : (
              <button onClick={() => handleJoinTeam("blue")} disabled={isMemberOfGreen}>
                Join Team
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ITEM: Right Bar*/}
      <div className="w-1/3 border border-gray-300 rounded-xl h-128 shadow-lg">
        <div className="py-10 px-8">
          <h1 className="text-xl font-semibold flex items-center">
            Status:&nbsp;
            {event.end ? (
              <p className="text-red-500">Ended</p>
            ) : (
              <span
                className={
                  status === "Open" ? "text-blue-500 font-base" : "text-red-500 font-base"
                }
              >
                {status}
              </span>
            )}
          </h1>

          <p className="text-sm text-gray-600 pb-6">
            Participants{" "}
            <span>
              {event.currentParticipants} / {event.maxParticipants}
            </span>
          </p>

          {event.end ? (
            <p className="w-full bg-gray-400 text-white font-semibold text-lg rounded-xl py-2 mb-4 text-center">
              Event has Ended
            </p>
          ) : (
            <button
              onClick={handleJoinEvent}
              className={
                status === "Open"
                  ? `w-full ${
                      isUserParticipant ? "bg-red-500" : "bg-green-500"
                    } hover:ease-in duration-100 text-white font-semibold text-lg rounded-xl py-2 mb-4`
                  : isUserParticipant
                  ? "w-full bg-red-500 text-white font-semibold text-lg rounded-xl py-2 mb-4"
                  : "w-full bg-gray-500 text-white font-semibold text-lg rounded-xl py-2 mb-4"
              }
            >
              {isUserParticipant ? "Leave Event" : "Join Event"}
            </button>
          )}

<div>
    <h2 className="pb-4 text-lg pt-2">Participants</h2>
    <div className="flex flex-col gap-2">
        {event.participants.map((participant, index) => (
            <ParticipantCard key={index} username={participant.username} />
        ))}
    </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
