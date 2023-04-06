const { SignUp } = require("../components/SignUp");

export default function Home() {
    return (
        <div className="container">
            <h1 className="text-center mt-5">Sign up</h1>
            <SignUp />
        </div>
    );
}

export const getStaticProps = async () => {
    return { props: {} };
};
