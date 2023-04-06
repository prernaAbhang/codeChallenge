import { AddProduct } from "../components/AddProduct";

export default function addProduct() {
    return <AddProduct />;
}

export const getStaticProps = async () => {
    return { props: {} };
};
