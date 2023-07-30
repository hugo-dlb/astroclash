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
    InputGroup,
    InputRightElement,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { faEye, faEyeSlash } from "@fortawesome/pro-regular-svg-icons";
import { useState, FormEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { FaIcon } from "../components/FaIcon";
import { useStore } from "../store/store";

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const register = useStore((state) => state.register);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            await register({ username, email, password });
            navigate("/planets");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <VStack spacing={8}>
                <VStack>
                    <Heading textAlign="center">Register on Astroclash</Heading>
                    <HStack>
                        <Text>Already have an account?</Text>
                        <Button
                            as={Link}
                            variant="link"
                            colorScheme="blue"
                            to="/login"
                        >
                            Login
                        </Button>
                    </HStack>
                </VStack>
                <Box w="full">
                    <form onSubmit={handleSubmit}>
                        <VStack>
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    required
                                    autoFocus
                                />
                                <FormHelperText>
                                    Your username can contain up to 20
                                    characters.
                                </FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />
                                <FormHelperText>
                                    We'll never share your email.
                                </FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                    />
                                    <InputRightElement>
                                        <Tooltip
                                            label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            <IconButton
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                variant="ghost"
                                                icon={
                                                    showPassword ? (
                                                        <FaIcon
                                                            icon={faEyeSlash}
                                                        />
                                                    ) : (
                                                        <FaIcon icon={faEye} />
                                                    )
                                                }
                                                onClick={() =>
                                                    setShowPassword(
                                                        (previousValue) =>
                                                            !previousValue
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText>
                                    Your password must contain 8 or more
                                    characters with at least one of each:
                                    uppercase, lowercase, number and special
                                    character.
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            w="full"
                            mt={4}
                            loadingText="Register"
                            isLoading={isLoading}
                        >
                            Register
                        </Button>
                    </form>
                </Box>
            </VStack>
        </AuthLayout>
    );
};
