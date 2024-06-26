// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useToast,
  Flex,
  Heading,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spacer,
} from "@chakra-ui/react";
import BASE_API_URL from "../../constant/ip";
import { useNavigate } from "react-router-dom";
import TesEditModal from "../../components/TesEditModal";

const ListPaymentPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [subsData, setsubsData] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    status: "",
    created_at: "",
    subscription_expiry_date: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalEdit, setModalEdit] = useState(false);

  const getSubsData = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.get(`${BASE_API_URL}super-admin/list-pay`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log(response.data.data);
      setsubsData(response.data.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    getSubsData();
  }, []);

  const handleCardPress = (data) => {
    setSelectedUser(data);
    setFields({
      name: data.user.name,
      status: data.status,
      created_at: data.created_at,
      subscription_expiry_date: data.user.subscription_expiry_date,
    });
    setModalEdit(true);
  };

  const deleteUser = async (id) => {
    try {
      const userToken = localStorage.getItem("userToken");
      await axios.delete(`${BASE_API_URL}super-admin/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      getSubsData();
      toast({
        title: "Hapus user success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const editUser = async (id) => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.put(
        `${BASE_API_URL}super-admin/${id}`,
        fields,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
    } catch (error) {
      console.error("Error editing user:", error);
      toast({
        title: "Error editing user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    const userToken = localStorage.getItem("userToken");
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      localStorage.removeItem("userToken");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("userToken");
      navigate("/login");
    }
  };

  return (
    <Flex>
      {/* Main Content */}
      <Box flex="1" bg="gray.100" p={6}>
        <Flex alignItems="center" mb={6}>
          <Heading size="md">Dashboard</Heading>
          <Button onClick={() => handleLogout()}>logout</Button>
          <Spacer />
        </Flex>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Name</Th>
                <Th>subscription</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Token</Th>
                <Th>Start Date</Th>
                <Th>Expired Date</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {subsData.map((item, index) => (
                <Tr key={item.id}>
                  <Td>{index + 1}</Td>
                  <Td>{item.user.name}</Td>
                  <Td>{item.subscription.name}</Td>
                  <Td>{item.subscription.price}</Td>
                  <Td>{item.status}</Td>
                  <Td>{item.order_id}</Td>
                  <Td>{item.created_at}</Td>
                  <Td>{item.user.subscription_expiry_date}</Td>
                  <Td alignItems={"center"}>
                    <Button onClick={() => handleCardPress(item)}>Edit</Button>
                    <Button onClick={() => deleteUser(item.id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {/* Edit User Modal */}
        <TesEditModal
          modalEdit={modalEdit}
          setModalEdit={setModalEdit}
          selectedUser={selectedUser}
          fields={fields}
          setFields={setFields}
          editUser={editUser}
        />

      </Box>
    </Flex>
  );
};

export default ListPaymentPage;
