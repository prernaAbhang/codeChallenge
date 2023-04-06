import { UpdateProduct } from "../../../components/UpdateProduct";

export default function updateProduct({ productId }) {
    return <UpdateProduct productId={productId} />;
}

export const getServerSideProps = async (ctx) => {
    return { props: { productId: ctx.params.id } };
};
