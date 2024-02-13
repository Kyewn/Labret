"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { themes } from "@config/themes";

export function NextChakraProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ChakraProvider theme={themes}>{children}</ChakraProvider>;
}
