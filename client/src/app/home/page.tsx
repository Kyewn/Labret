import { useToast } from "@chakra-ui/react";

export default function Home() {
    const makeToast = useToast();

    makeToast({
        title: "Title",
        description: "Description",
        status: "success",
    });

    return (
        <>
            <p>You made it!</p>
        </>
    );
}
