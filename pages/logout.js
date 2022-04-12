import { withIronSessionSsr } from "iron-session/next"

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        req.session.destroy();
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    },
    {
        cookieName: "vcrank_session",
        password: process.env.SESSION_SECRET_KEY,
        cookieOptions: {
          secure: process.env.NODE_ENV === "production",
        },
    }
)

export default function Logout() {
    return <Loader className="mt-36">
        <h1 className="mt-6">Please wait while we log you out...</h1>
    </Loader>
}