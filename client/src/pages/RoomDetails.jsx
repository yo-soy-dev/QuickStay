import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { facilityIcons, assets, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../conext/AppContext";

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  const checkAvailability = async () => {
    try {
      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error("Check-In Date should be less than Check-Out Date");
        return;
      }

      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success && data.isAvailable) {
        setIsAvailable(true);
        toast.success("Room is available");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      return checkAvailability();
    }

    try {
      const { data } = await axios.post(
        "/api/bookings/book",
        {
          room: id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod: "Pay At Hotel",
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    const room = rooms.find(room => room._id === id);
    room && setRoom(room)
    room && setMainImage(room.images[0])
  }, [rooms]);

  useEffect(() => {
    setIsAvailable(false);
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div>
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}
            <span className="font-inter text-sm"> ({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <StarRating rating={room.rating} />
          <p>200+ reviews</p>
        </div>

        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                alt="Room"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === img ? "outline-3 outline-orange-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                required
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                required
                min={checkInDate}
                disabled={!checkInDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                required
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
            // className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all text-white font-semibold rounded-xl max-md:w-full max-md:mt-6 md:px-10 py-3 md:py-4 text-base shadow-md shadow-blue-300"
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        <div className="mt-10 space-y-4">
          {roomCommonData.map((spec, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6" />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. The quoted price is for two guests. For accurate group
            pricing, adjust the guest count. This apartment offers a true city
            vibe and a cozy experience.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel?.owner?.image || assets.defaultUserIcon}
              alt="Host"
              className="h-20 w-20 md:h-20 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating rating={room.rating} />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
