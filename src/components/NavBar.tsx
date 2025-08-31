import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  useDisclosure,
  Stack,
  Button,
} from "@chakra-ui/react";

interface NavLinkProps {
  name: string;
  path: string;
}

const links: NavLinkProps[] = [
  { name: "Dashboard", path: "/" },
  { name: "Residents", path: "/residents" },
  { name: "Staff", path: "/staff" },
  { name: "Scheduling", path: "/scheduling" },
  { name: "Inventory", path: "/inventory" },
  { name: "Billing", path: "/billing" },
  { name: "Family Portal", path: "/family" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

const NavLink: React.FC<NavLinkProps> = ({ name, path }) => (
  <Link
    href={path}
    px={3}
    py={2}
    rounded="md"
    _hover={{ textDecoration: "none", bg: "purple.200", color: "black" }}
  >
    {name}
  </Link>
);

const Navbar: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="purple.600" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">Life Care</Box>

        {/* Desktop Navigation */}
        <HStack display={{ base: "none", md: "flex" }}>
          {links.map((link) => (
            <NavLink key={link.name} name={link.name} path={link.path} />
          ))}
        </HStack>

        {/* Mobile Menu Button */}
        <Button
          size="md"
          display={{ md: "none" }}
          onClick={open ? onClose : onOpen}
          bg="transparent"
          _hover={{ bg: "purple.700" }}
        >
          {open ? "CLOSE" : "OPEN"}
        </Button>
      </Flex>

      {/* Mobile Navigation */}
      {open && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav">
            {links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
