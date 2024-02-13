import { Center, Spinner } from "@chakra-ui/react";
// import "./globals.css";

export default function Loading() {
    return (
        <Center className="pageContainer">
            <Spinner
                thickness="6px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Center>
    );
}
