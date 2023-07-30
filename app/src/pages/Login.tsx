import { FormEventHandler, useState } from "react";
import {
    VStack,
    Heading,
    HStack,
    Button,
    Box,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useStore } from "../store/store";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const login = useStore((state) => state.login);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/planets");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <VStack spacing={8}>
                <VStack>
                    <Heading textAlign="center">Astroclash Login</Heading>
                    <HStack>
                        <Text>Don't have an account?</Text>
                        <Button
                            as={Link}
                            variant="link"
                            colorScheme="blue"
                            to="/register"
                        >
                            Register
                        </Button>
                    </HStack>
                </VStack>
                <Box w="full">
                    <form onSubmit={handleSubmit}>
                        <VStack>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    value={email}
                                    required
                                    autoFocus
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    value={password}
                                    required
                                />
                                <FormHelperText>
                                    Your password contains 8 or more characters
                                    with at least one of each: uppercase,
                                    lowercase, number and special character.
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <Button
                            type="submit"
                            w="full"
                            colorScheme="blue"
                            mt={4}
                            loadingText="Login"
                            isLoading={isLoading}
                        >
                            Login
                        </Button>
                    </form>
                </Box>
            </VStack>
        </AuthLayout>
    );
};
