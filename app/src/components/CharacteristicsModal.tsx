import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    HStack,
    Button,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    Image,
    Badge,
} from "@chakra-ui/react";
import { Actionable } from "./ActionMenu/Actionable";
import { Fleet as FleetType, Planet, Rarity } from "../types/types";
import { RarityBadge } from "./RarityBadge/RarityBadge";
import { ReactElement } from "react";
import { getPlanetImage } from "../utils/planet";
import { match } from "ts-pattern";
import { Fleet } from "./Fleet";

const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
});

export type Characteristic =
    | {
          label: string;
          value: number | string;
          type: "DEFAULT";
      }
    | {
          label: string;
          value: Rarity;
          type: "RARITY";
      }
    | {
          label: string;
          value: Planet;
          type: "PLANET";
      }
    | {
          label: string;
          value: FleetType[];
          type: "FLEET";
      };

type CharacteristicsModalProps = {
    header: string;
    characteristics: Characteristic[];
    isOpen: boolean;
    children?: ReactElement;
    onClose: () => void;
};

export const CharacteristicsModal = (props: CharacteristicsModalProps) => {
    const { header, characteristics, isOpen, children, onClose } = props;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <Actionable>
                <ModalContent>
                    <ModalHeader>{header}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Characteristic</Th>
                                        <Th w="100%" />
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {characteristics.map((characteristic) => (
                                        <Tr key={characteristic.label}>
                                            <Td>{characteristic.label}</Td>
                                            {match(characteristic)
                                                .with(
                                                    { type: "RARITY" },
                                                    ({ value }) => (
                                                        <Td flexGrow={1}>
                                                            <RarityBadge
                                                                rarity={value}
                                                            />
                                                        </Td>
                                                    )
                                                )
                                                .with(
                                                    { type: "DEFAULT" },
                                                    ({ value }) => (
                                                        <Td flexGrow={1}>
                                                            {typeof value ===
                                                            "number"
                                                                ? formatter.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </Td>
                                                    )
                                                )
                                                .with(
                                                    { type: "PLANET" },
                                                    ({ value }) => (
                                                        <Td flexGrow={1}>
                                                            <HStack>
                                                                <Image
                                                                    src={`/assets/${getPlanetImage(
                                                                        value.variant
                                                                    )}`}
                                                                    w="32px"
                                                                    h="32px"
                                                                />
                                                                <Text>
                                                                    {value.name}
                                                                </Text>
                                                                <Badge fontSize="md">
                                                                    {
                                                                        value
                                                                            .coordinates
                                                                            .x
                                                                    }
                                                                    :
                                                                    {
                                                                        value
                                                                            .coordinates
                                                                            .y
                                                                    }
                                                                    :
                                                                    {
                                                                        value
                                                                            .coordinates
                                                                            .z
                                                                    }
                                                                </Badge>
                                                            </HStack>
                                                        </Td>
                                                    )
                                                )
                                                .with(
                                                    { type: "FLEET" },
                                                    ({ value }) => (
                                                        <Td py={2} pl="22px">
                                                            <HStack
                                                                wrap="wrap"
                                                                py={2}
                                                                flexGrow={1}
                                                            >
                                                                {value.map(
                                                                    (fleet) => (
                                                                        <Fleet
                                                                            key={
                                                                                fleet.uid
                                                                            }
                                                                            fleet={
                                                                                fleet
                                                                            }
                                                                            size="xs"
                                                                            isNonActionable
                                                                        />
                                                                    )
                                                                )}
                                                            </HStack>
                                                        </Td>
                                                    )
                                                )
                                                .exhaustive()}
                                        </Tr>
                                    ))}
                                    {children}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button variant="ghost" onClick={onClose}>
                                Close
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Actionable>
        </Modal>
    );
};
