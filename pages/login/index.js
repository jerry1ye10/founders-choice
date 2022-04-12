import Image from "next/image";
import { LINKEDIN_AUTH_URL } from "../../utils/auth";

import lockIcon from "../../public/icons/lock.svg";
import peopleCheckIcon from "../../public/icons/people-check.svg";
import personGearIcon from "../../public/icons/person-gear.svg";
import linkedInIcon from "../../public/icons/LinkedIn.svg";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center text-center raleway text-4xl w-3/5 mx-auto sm:pt-32">
      <div>
        We use{" "}
        <b>
          <a href={LINKEDIN_AUTH_URL()}> Linkedin </a>{" "}
        </b>{" "}
        to verify your identity
      </div>

      <div className="w-1/4 self-start -mt-32 mb-20">
        <Image className="w-1/4" src={personGearIcon} />
      </div>

      <div>
        We reference <b>Crunchbase</b> to find your VC investors
      </div>

      <div className="w-1/4 self-center -mt-32 mb-20">
        <Image className="w-1/4" src={peopleCheckIcon} />
      </div>

      <div>
        We <b>anonymize</b> and <b>securely</b> store your responses
      </div>

      <div className="w-1/4 self-end -mt-32 mb-20">
        <Image className="w-1/4" src={lockIcon} />
      </div>
      <a
        href={LINKEDIN_AUTH_URL()}
        className="text-4xl mb-16 bg-gray-300 montserrat p-4 rounded-lg flex"
      >
        <Image src={linkedInIcon} width="48" />{" "}
        <div className="my-auto ml-4">Login with LinkedIn</div>
      </a>

      <div className="text-lg mb-32">
        You can learn more about us and how we process your data{" "}
        <u>
          <a href="/about">here</a>
        </u>
      </div>
    </div>
  );
}
