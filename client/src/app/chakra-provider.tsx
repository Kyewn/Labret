"use client";

import { ChakraProvider } from "@chakra-ui/react";

export function NextChakraProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ChakraProvider>{children}</ChakraProvider>;
}
