import React, { useState } from "react";
import { GET_COMPANY_BY_SLUG, GET_INVESTOR_BY_SLUG } from "../utils/routes";
import ky from "ky-universal";

const Modal = ({ investors, additionalInvestors, setAdditionalInvestors }) => {
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [verified, setVerified] = useState(false);
  const [investorData, setInvestorData] = useState({});

  const [error, setError] = useState([false, ""]);
  const handleSubmit = () => {
    closeModal();
    setAdditionalInvestors([...additionalInvestors, investorData]);
  };
  const handleVerifySlug = async () => {
    setIsLoading(true);
    const investorAlreadyExists = investors
      .concat(additionalInvestors)
      .find((investor) => investor.slug === slug);
    if (investorAlreadyExists) {
      setError([true, "Investor already exists"]);
      setIsLoading(false);
      return;
    }
    try {
      const data = await ky
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_INVESTOR_BY_SLUG}`, {
          json: { slug },
        })
        .json();
      if (data) {
        setInvestorData(data);
        setVerified(true);
        setError([false, ""]);
      } else {
        setError([true, "This slug does not exist"]);
      }
    } catch (err) {
      setError([true, "This is an invalid investor"]);
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setInvestorData({});
    setIsLoading(false);
    setVerified(false);
    setError([false, ""]);
  };
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box rounded-md py-12 relative">
          <label
            htmlFor="my-modal"
            className="absolute text-2xl right-3 top-3 cursor-pointer"
            onClick={closeModal}
          >
            ✕
          </label>
          <div className="text-lg -mt-2 font-bold">
            Add More Investors below
          </div>
          {error[0] && (
            <div className="text-red-500 font-light text-sm mt-2">
              {error[1]}
            </div>
          )}
          {verified ? (
            <div className="flex justify-center my-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white rounded-lg overflow-hidden flex items-center">
                <img
                  className="object-contain w-full my-auto"
                  src={investorData?.image}
                />
              </div>
              <p className=" ml-4 py-4 font-semibold">{investorData.name}</p>
            </div>
          ) : (
            <p className="py-4 flex max-w-full justify-center text-sm items-center break-words flex-wrap">
              <div>https://www.crunchbase.com/organization/</div>
              <input
                className="pl-1 border rounded-sm"
                placeholder="[investor slug]"
                onChange={(e) => setSlug(e.target.value)}
              ></input>
            </p>
          )}
          {verified ? (
            <label
              htmlFor="my-modal"
              onClick={handleSubmit}
              className="cursor-pointer bg-transparent hover:bg-gray-400 text-md border border-black py-2 px-4 rounded-full w-32 mt-2"
            >
              Add
            </label>
          ) : (
            <button
              onClick={handleVerifySlug}
              className="cursor-pointer bg-transparent hover:bg-gray-400 text-md border border-black py-2 px-4 rounded-full w-32 mt-2"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
