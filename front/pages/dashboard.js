import { Dashboard } from "../components/Dashboard";

export default function Home() {
    return (
        <div className="container">
            <Dashboard />
        </div>
    );
}

export const getStaticProps = async () => {
    return { props: {} };
};
