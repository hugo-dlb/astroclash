import { useToast as useChakraToast } from "@chakra-ui/react";

export const useToast = () => useChakraToast({
    containerStyle: {
        marginBottom: "32px"
    },
    isClosable: true
});