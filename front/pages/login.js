const { Login } = require("../components/Login");

export default function Home() {
    return (
        <div className="container">
            <h1 className="text-center mt-5">Login</h1>
            <Login />
        </div>
    );
}

export const getStaticProps = async () => {
    return { props: {} };
};
