import React from "react";
import { Indicator } from "@mantine/core";

import { DraggableItem } from "./components";
import { Icon } from "..";

const indicatorStyle = {
    width: "100%",
    height: "100%",
};

export const InventoryItem = ({ inventoryType, slotIndex, itemName, itemType, label, color }) => {
    const itemId = [inventoryType, slotIndex, itemName, itemType].join("-");

    return (
        <DraggableItem
            data={{ inventoryType, slotIndex, itemName, itemType, label, color }}
            itemId={itemId}
        >
            <Indicator
                style={indicatorStyle}
                position="bottom-start"
                label={label}
                color={color}
                size={16}
                withBorder
                inline
            >
                <Icon itemName={itemName} />
            </Indicator>
        </DraggableItem>
    );
};
