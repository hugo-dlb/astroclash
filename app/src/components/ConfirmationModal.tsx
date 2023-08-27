import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    HStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Actionable } from "./ActionMenu/Actionable";

type ConfirmationModalProps = {
    isOpen: boolean;
    headerText: string;
    descriptionText: string;
    cancelText?: string;
    confirmText?: string;
    confirmButtonColorScheme?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmationModal = (props: ConfirmationModalProps) => {
    const {
        isOpen,
        headerText,
        descriptionText,
        cancelText = "Cancel",
        confirmText = "Confirm",
        confirmButtonColorScheme,
        onConfirm,
        onCancel,
    } = props;
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCancel}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {headerText}
                    </AlertDialogHeader>
                    <AlertDialogBody>{descriptionText}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Actionable>
                            <HStack spacing={4}>
                                <Button ref={cancelRef} onClick={onCancel}>
                                    {cancelText}
                                </Button>
                                <Button
                                    colorScheme={confirmButtonColorScheme}
                                    onClick={onConfirm}
                                >
                                    {confirmText}
                                </Button>
                            </HStack>
                        </Actionable>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
