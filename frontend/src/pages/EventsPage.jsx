import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { productData } from "../static/data";
import { getAllEvents } from "../redux/actions/events";

const EventsPage = () => {
  const dispatch = useDispatch();
  // const events = productData;
  // const isLoading = false;
  const { allEvents, isLoading } = useSelector((state) => state.events);
  useEffect(() => {
    if (allEvents == null) dispatch(getAllEvents());
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
