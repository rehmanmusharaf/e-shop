import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { productData } from "../static/data";
const EventsPage = () => {
  // const events = productData;
  // const isLoading = false;

  const { events, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={events && events[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
