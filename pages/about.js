import Image from "next/image";
import Link from "next/link";
import Angellist from "../public/logos/angellist.png";
import Angels from "../public/logos/angels.png";
import Beta from "../public/logos/beta.jpg";
import BBG from "../public/logos/bbg.png";
import Crunchbase from "../public/logos/crunchbase.png";
import Precursor from "../public/logos/precursor.png";

const STYLED_HEADER = `
  montserrat text-5xl font-semibold sm:my-8
`;

const PUBLIC_REPO = "https://github.com/jerry1ye10/founders-choice";

const STYLED_SUBHEADER = `
  montserrat text-3xl font-semibold mb-2
`;

const STYLED_PARA = `
  raleway text-sm sm:text-1xl md:text-3xl font-extralight text-left mb-6
`;

export default function FAQ() {
  return (
    <div className="container px-4 md:px-36 sm:mt-12 mx-auto">
      <h1 className={STYLED_HEADER}>About</h1>
      <p className={STYLED_PARA}>
        Choosing the right partners to sit on your cap table is one of the
        hardest decisions that a founder has to make. The wrong choice is
        difficult to undo. Without knowing the right people, it can be difficult
        to get reliable information on which firms to choose. We hope that by
        havng venture-backed founders compare their investors on our site, we
        can create a ranking of VC firms, allowing founders to easily find the
        VC firms who are right for them. We verify that all founders are only
        able to contribute to the rankings of VCs that have actually invested in
        their startup. If you are a founder who’s raised money, we would love
        your feedback! If not, we hope our rankings can be helpful to you.
      </p>

      <h1 className={STYLED_HEADER}>FAQ</h1>
      <h3 className={STYLED_SUBHEADER}>Where are the rankings?</h3>
      <p className={STYLED_PARA}>
        Right now, we're focused on gathering feedback from founders to make
        sure our rankings are as high quality as possible. Please be patient as
        we gather data to ensure the quality of our rankings!
      </p>

      <h3 className={STYLED_SUBHEADER}>How do we calculate these rankings?</h3>
      <p className={STYLED_PARA}>
        We use an{" "}
        <a href="https://en.wikipedia.org/wiki/Elo_rating_system">
          {" "}
          Elo-based algorithm{" "}
        </a>
        , which asks founders to choose their preferences among the VCs they’ve
        worked with. The advantage of this system is that it only accepts
        ratings from founders who have actually worked with these VCs, and it
        preserves anonymity of the founders while avoiding the vitriol on other
        review sites.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        Which founders are able to contribute to these rankings?
      </h3>
      <p className={STYLED_PARA}>
        Any founder who has been backed by a VC, as shown on Crunchbase, can
        submit rankings.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        As a founder, what precautions do you take to secure my data?
      </h3>
      <p className={STYLED_PARA}>
        Although we authenticate all founders through their LinkedIn profiles,
        we only store that data temporarily for authentication purposes. As soon
        as founders start submitting comparisons, we hash your identity, and
        unlink your hashed identity from the ratings you’ve made, so no one can
        ever connect your ratings to you. To be as secure as possible, we’re
        also open sourcing{" "}
        <Link href={PUBLIC_REPO}>
          <a class="underline text-blue-400">our code</a>
        </Link>{" "}
        so that you can see how we handle the data.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        How do you validate who has invested in a startup?
      </h3>
      <p className={STYLED_PARA}>
        We use a combination of Linkedin and Crunchbase to verify the identity
        of a founder and check which VCs have backed their startup. We also
        invite founders to correct our data.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        What do these rankings actually measure?
      </h3>
      <p className={STYLED_PARA}>
        These rankings measure founders’ preferences among the VCs who have
        backed them. So if one firm is ranked higher than another, it means that
        founders who have had both VCs invest in them generally prefer the
        higher-ranked firm. We ask founders to make pairwise comparisons of all
        of the firms that have invested in them. Specifically, we prompt them
        with the question “Which (firm) would you rather have as an investor?”
      </p>

      <h3 className={STYLED_SUBHEADER}>What is this ranking for?</h3>
      <p className={STYLED_PARA}>
        Even though many angels are just as good if not better than VCs for
        founders, and the specific partner sometimes matter more than the VC
        firm, we are only ranking VC firms (and accelerators) because we need
        enough data to present meaningful rankings. As of now, we are only
        asking venture-backed founders (verified by Crunchbase) to complete the
        rankings.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        What if a VC firm has only made a few investments or only invested small
        amounts, will that hurt their ranking?
      </h3>
      <p className={STYLED_PARA}>
        Like a chess player who has only played a few tournaments, VCs will need
        to co-invest with some of the best VCs so that founders can meaningfully
        compare them. That said, there’s no reward for having invested in more
        companies, or writing bigger checks (unless the founders value a VC more
        because they wrote a bigger check). This ranking is entirely about who
        founders see as most valuable.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        How often will you update the rankings?
      </h3>
      <p className={STYLED_PARA}>
        We need a certain minimum number of ratings from founders for our
        ranking to be meaningful. So we intend to update the rankings only when
        we have enough new ratings from founders. At the moment, our plan is to
        update the rankings every six months, though that might change.
      </p>

      <h3 className={STYLED_SUBHEADER}>
        Can you make the rankings more specific, like ranking which firms are
        most helpful in particular ways?
      </h3>
      <p className={STYLED_PARA}>
        At the moment, our focus is just to produce a general ranking – an
        alternative to the Midas List, which measures VCs in terms of their
        investment returns, whether or not they were helpful to founders. We are
        going to start by ranking firms on a general "who is most preferred by
        founders who they have backed" basis. We might consider ways to make our
        rankings more useful in the future, and we’re open to your suggestions.
      </p>
      <h3 className={STYLED_SUBHEADER}>Who built this?</h3>
      <p className={STYLED_PARA}>
        We are Jerry Ye and Daniel Tao, two student engineers at UPenn. You can
        read more about us{" "}
        <Link href="https://www.linkedin.com/in/jerry-y-048a65110/">
          <a class="underline text-blue-400">here</a>
        </Link>{" "}
        and{" "}
        <Link href="https://danxtao.com/">
          <a class="underline text-blue-400">here</a>
        </Link>
        .
      </p>

      <h1 className={`${STYLED_HEADER} text-center mt-8 text-6xl`}>
        Our Sponsors
      </h1>

      <div className="flex items-center justify-center">
        <Image
          src={Angels}
          layout="fixed"
          alt="2.12 Angels"
          height="225"
          width="225"
          objectFit="contain"
        />
        <Image
          src={Angellist}
          layout="fixed"
          height="92"
          width="502"
          alt="Angellist"
          objectFit="contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <Image
          width="450"
          height="76"
          src={BBG}
          layout="fixed"
          alt="BBG Ventures"
          objectFit="contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={Crunchbase}
          width="550"
          height="88"
          layout="fixed"
          alt="Crunchbase"
          objectFit="contain"
        />
        <Image
          src={Precursor}
          layout="fixed"
          width="159"
          height="225"
          alt="Precursor Ventures"
          objectFit="contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={Beta}
          layout="fixed"
          alt="Bloomberg Beta"
          objectFit="contain"
        />
      </div>
      <br />

      <p className={`${STYLED_PARA} mb-36 mt-12`}>
        Although we have venture capital firms as sponsors for this project,
        they do not have access to any of the data nor are they able to
        contribute to any of the rankings. Our sponsors are only interested in
        supporting this ranking project so they can better serve founders.
      </p>
    </div>
  );
}
