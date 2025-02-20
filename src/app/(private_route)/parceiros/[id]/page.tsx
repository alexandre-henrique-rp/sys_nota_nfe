"use client";

import { CardForm } from "@/app/components/form";
import { toaster } from "@/app/components/ui/toaster";
import {
    
    Button,
    Flex,
    HStack,
    Link,
    Spinner,
    Table,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
    params: { id: string };
};

export default function PartnerPage({ params }: Props) {
    const router = useRouter();
    const { id } = params;

   
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [partner, setPartner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(1);

   
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        chave_pix: "",
        valor: "",
    });

    const body = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        chave_pix: formData.chave_pix,
        valor: formData.valor,
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "valor" ? parseFloat(value) || "" : value,
        }));
    };

    // Paginação
    const handlenextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const handleprevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Busca dados do parceiro
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/parceiros/getone/${id}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar dados do parceiro");
            }
            const data = await response.json();

            setPartner(data);

            // Preenche o form
            setFormData({
                nome: data.nome || "",
                email: data.email || "",
                telefone: data.telefone || "",
                cpf: data.cpf || "",
                chave_pix: data.chave_pix || "",
                valor: data.valor || "",
            });

            if (data.clientes && data.clientes.length > 0) {
                setTotalPages(Math.ceil(data.clientes.length / pageSize));
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toaster.create({
                title: "Erro",
                description: "Não foi possível carregar o parceiro.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Atualiza dados do parceiro (PATCH)
    const handlePatch = async () => {
        try {
            const response = await fetch(`/api/parceiros/patch/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar parceiro");
            }
            const data = await response.json();

            toaster.create({
                title: "Sucesso",
                description: data.message || "Parceiro atualizado com sucesso!",
                type: "success",
            });
            router.push(`/parceiros`);
        } catch (error: any) {
            toaster.create({
                title: "Erro",
                description: error.message || "Falha ao atualizar o parceiro",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Paginação
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const visibleClients = partner?.clientes?.slice(startIndex, endIndex) ?? [];

    // Tela de carregamento
    if (loading) {
        return (
            <HStack
                justify="center"
                align="center"
                gap="5"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="full"
                h="full"
            >
                <Spinner color="green.800" size="lg" />
                <Text color="green.800" fontSize="xl">
                    Carregando...
                </Text>
            </HStack>
        );
    }

    return (
        <Flex gap={6} w="full" h="full" direction={{ base: "column", md: "row" }}>
            {/* Formulário à esquerda (ou topo no mobile) */}
            <Flex flexDir="column" gap={6} w={{ base: "100%", md: "40%" }}>
                <Text
                    w="full"
                    alignContent="center"
                    fontSize="2xl"
                    fontWeight="bold"
                    color="black"
                >
                    Atualizar informações
                </Text>
                <CardForm.InputString
                    name="nome"
                    color="black"
                    label="Nome"
                    type="text"
                    fontWeight="semibold"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <CardForm.InputString
                    name="email"
                    color="black"
                    label="Email"
                    type="email"
                    fontWeight="semibold"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <CardForm.InputString
                    name="telefone"
                    color="black"
                    label="Telefone"
                    type="text"
                    fontWeight="semibold"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <CardForm.InputString
                    name="cpf"
                    color="black"
                    label="CPF"
                    type="text"
                    fontWeight="semibold"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <CardForm.InputString
                    name="chave_pix"
                    color="black"
                    label="Chave PIX"
                    type="text"
                    fontWeight="semibold"
                    value={formData.chave_pix}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <CardForm.InputString
                    name="valor"
                    color="black"
                    label="Valor"
                    type="text"
                    fontWeight="semibold"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                    border="none"
                    borderBottom="1px solid black"
                    rounded="none"
                />
                <Flex w="full" gap={5} justify="start">
                    <Button
                        type="submit"
                        onClick={handlePatch}
                        bg="#00713C"
                        color="white"
                        _hover={{ background: "green.600" }}
                        w="150px"
                        loadingText="Salvando..."
                    >
                        Salvar
                    </Button>
                </Flex>
            </Flex>


            <Flex
                pl={{ base: 0, md: 8 }}
                w="full"
                flexDir="column"
                mt={{ base: 4, md: 0 }}
            >
                {isMobile ? (

                    <VStack w="full" align="stretch">
                        <Flex h={"fit"} w={"full"}>
                            <Text
                                w="full"
                                alignContent="center"
                                fontSize="2xl"
                                fontWeight="bold"
                                color="black"
                            >
                                Clientes
                            </Text>
                        </Flex>
                        <Flex w="full" justify="center" wrap="wrap" gap={4}>
                            {visibleClients.map((cliente: any) => (
                                <Link
                                    href={`/cliente/${cliente.id}`}
                                    key={cliente.id}
                                    bg="white"
                                    p={4}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    color="black"
                                    transition="0.2s"
                                    _hover={{ bg: "green.100", transform: "scale(1.02)" }}
                                    w={{ base: "100%", sm: "100%", md: "320px" }}
                                    minW="280px"
                                    cursor="pointer"
                                >
                                    <Flex direction="column" align="start" w="full">
                                        <Text><b>ID:</b> {cliente.id}</Text>
                                        <Text><b>Cliente:</b> {cliente.cliente}</Text>
                                        <Text><b>Status:</b> {cliente.status ? "Ativo" : "Inativo"}</Text>
                                        <Text>
                                            <b>Cobranças Abertas:</b>{" "}
                                            {cliente.cobrancas?.length ?? 0}
                                        </Text>
                                    </Flex>
                                </Link>
                            ))}
                        </Flex>
                    </VStack>
                ) : (

                    <Flex w="full" flexDir="column">
                        <Table.Root bg="white" size="sm" color="black">
                            <Table.Header>
                                <Table.Row bg="green.600" borderBottom="none">
                                    <Table.ColumnHeader
                                        border="none"
                                        py="1"
                                        fontSize="md"
                                        color="white"
                                        textAlign="center"
                                        roundedLeft={"md"}
                                    >
                                        Id
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        border="none"
                                        py="1"
                                        fontSize="md"
                                        color="white"
                                        textAlign="center"
                                    >
                                        Cliente
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        border="none"
                                        py="1"
                                        fontSize="md"
                                        color="white"
                                        textAlign="center"
                                    >
                                        Status
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader
                                        border="none"
                                        py="1"
                                        fontSize="md"
                                        color="white"
                                        textAlign="center"
                                        roundedRight={"md"}
                                    >
                                        Cobranças Abertas
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body bg="white" border="none">
                                {visibleClients.length > 0 ? (
                                    visibleClients.map((cliente: any) => (
                                        <Table.Row key={cliente.id} h="50px" bg="white">
                                            <Table.Cell
                                                border="none"
                                                h="50px"
                                                textAlign="center"
                                            >
                                                {cliente.id}
                                            </Table.Cell>
                                            <Table.Cell
                                                border="none"
                                                h="50px"
                                                textAlign="center"
                                            >
                                                {cliente.cliente}
                                            </Table.Cell>
                                            <Table.Cell
                                                border="none"
                                                h="50px"
                                                textAlign="center"
                                            >
                                                {cliente.status ? "Ativo" : "Inativo"}
                                            </Table.Cell>
                                            <Table.Cell
                                                border="none"
                                                h="50px"
                                                textAlign="center"
                                            >
                                                {cliente.cobrancas?.length ?? 0}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} bg={"white"} textAlign="center">
                                            Nenhum cliente encontrado
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>

                        <Flex gap={4} mt={4} justify="center">
                            <Button
                                onClick={handleprevPage}
                                disabled={currentPage === 1}
                                color="white"
                                bg="#00713C"
                            >
                                Anterior
                            </Button>
                            <Text fontSize="md" color="black">
                                Página {currentPage} de {totalPages}
                            </Text>
                            <Button
                                onClick={handlenextPage}
                                disabled={currentPage === totalPages}
                                color="white"
                                bg="#00713C"
                            >
                                Próximo
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex >
    );
}
