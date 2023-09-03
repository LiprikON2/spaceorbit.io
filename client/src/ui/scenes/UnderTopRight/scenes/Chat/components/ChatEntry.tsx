import React from "react";
import { Paper, Text } from "@mantine/core";

export const ChatEntry = ({ name, message, localTime }) => {
    return (
        <Paper style={{ display: "inline" }} px="xs" py={0} withBorder={false} shadow="unset">
            <Text size="sm" c="dimmed" style={{ display: "inline" }}>
                {`[${localTime}] `}
            </Text>
            <Text size="sm" style={{ display: "inline" }}>{`${name}: `}</Text>
            <Text
                size="sm"
                style={{
                    display: "inline",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                }}
                weight="lighter"
            >
                {message}
            </Text>
        </Paper>
    );
};
