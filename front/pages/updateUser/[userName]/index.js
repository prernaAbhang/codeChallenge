import { UpdateUser } from "../../../components/UpdateUser";

export default function updateUser({ userName }) {
    return (
        <div className="container">
            <UpdateUser userName={userName} />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    return { props: { userName: ctx.params.userName } };
};
