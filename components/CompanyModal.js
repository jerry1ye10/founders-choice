import React, { useState } from "react";
import { GET_COMPANY_BY_SLUG } from "../utils/routes";
import ky from "ky-universal";

const Modal = ({ setSelectedCompany, handleSubmit, oldCompany }) => {
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const [error, setError] = useState([false, ""]);
  const handleVerifySlug = async () => {
    setIsLoading(true);
    const data = await ky
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_COMPANY_BY_SLUG}`, {
        json: { slug },
      })
      .json();

    if (data.company) {
      setCompanyName(data.company);
      setVerified(true);
      setSelectedCompany({ value: slug, label: data.company });
      setError([false, ""]);
    } else {
      setError([true, "The slug does not exist"]);
    }

    setIsLoading(false);
  };

  const closeModal = () => {
    setSelectedCompany(oldCompany);
    setCompanyName("");
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
            {verified
              ? `Rank investors for the following startup`
              : `Enter your Startup Slug below`}
          </div>
          {error[0] && (
            <div className="text-red-500 font-light text-sm mt-2">
              {error[1]}
            </div>
          )}
          {verified ? (
            <p className="py-4 font-semibold">{companyName}</p>
          ) : (
            <p className="py-4 flex justify-center text-sm items-center">
              <div>https://www.crunchbase.com/organization/</div>
              <input
                className="pl-1 border rounded-sm"
                placeholder="[startup slug]"
                onChange={(e) => setSlug(e.target.value)}
              ></input>
            </p>
          )}
          {verified ? (
            <button
              onClick={handleSubmit}
              className="bg-transparent hover:bg-gray-400 text-md border border-black py-2 px-4 rounded-full w-32 mt-2"
            >
              Next{" "}
            </button>
          ) : (
            <button
              onClick={handleVerifySlug}
              className="bg-transparent hover:bg-gray-400 text-md border border-black py-2 px-4 rounded-full w-32 mt-2"
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
