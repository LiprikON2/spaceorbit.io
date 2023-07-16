import React from "react";
import { useToggle } from "@mantine/hooks";
import { Home, User } from "tabler-icons-react";

import { Button } from "~/ui/components";
import { ProfileModal } from "./scenes/ProfileModal";
import { useGame } from "~/ui/hooks";

export const BottomRight = ({ GroupComponent }) => {
    const {
        gameManager,
        exit,
        computed: { isLoaded, isLoading },
    } = useGame();
    const [openedProfileModal, toggleProfileModal] = useToggle([false, true]);

    const toggleProfile = () => {
        if (isLoaded) {
            if (openedProfileModal) {
                gameManager.unlockInput();
            } else {
                gameManager.lockInput();
            }
        }

        toggleProfileModal();
    };

    return (
        <>
            <GroupComponent>
                {isLoaded && (
                    <Button isSquare onClick={() => exit(true)}>
                        <Home />
                    </Button>
                )}
                {!isLoading && (
                    <Button isSquare onClick={toggleProfile}>
                        <User />
                    </Button>
                )}
            </GroupComponent>
            <ProfileModal opened={openedProfileModal} onClose={toggleProfile} />
        </>
    );
};
