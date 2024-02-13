"use client";
import {
    Box,
    Button,
    Center,
    Container,
    Image,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Spinner,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

import styles from "./page.module.css";
import { useState } from "react";

export default function App() {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <>
            <Center className={styles.page_container}>
                <Skeleton
                    className={styles.camera_container}
                    borderRadius={10}
                    pt={3}
                    pb={3}
                    isLoaded={showVideo}
                >
                    <Image
                        className={styles.camera}
                        borderRadius={10}
                        src={"http://localhost:5000/"}
                        alt="camera"
                        onLoad={() => setShowVideo(true)}
                    />
                </Skeleton>

                <Center
                    className={`${styles.container} ${styles.main_menu_container}`}
                    padding="6"
                    boxShadow="lg"
                >
                    <SkeletonCircle isLoaded={showVideo} size="100">
                        asdasd
                    </SkeletonCircle>
                    <SkeletonText
                        width="100%"
                        isLoaded={showVideo}
                        mt="4"
                        noOfLines={5}
                        spacing="4"
                        skeletonHeight="5"
                    >
                        <Container>
                            {showVideo ? (
                                <Text variant="heading">Labret</Text>
                            ) : (
                                <></>
                            )}
                        </Container>
                    </SkeletonText>
                </Center>
            </Center>
        </>
    );
}
