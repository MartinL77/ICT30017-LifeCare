import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { StaffMember } from "../types";
import { useToast } from "../components/ToastProvider";

const Container = styled.div`
  padding: 2rem;
`;
const HeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;
const Title = styled.h2`
  margin: 0;
`;
const Search = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 260px;
`;
const Card = styled.div`
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;
const Form = styled.form`
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
  margin: 1rem 0 1.5rem;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;
const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
`;
const Select = styled.select`
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
`;
const Button = styled.button`
  padding: 0.7rem 1rem;
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: var(--brandDark);
  }
`;
const Danger = styled.button`
  padding: 0.5rem 0.8rem;
  background: var(--danger);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;
const Help = styled.div`
  color: var(--muted);
  font-size: 0.9rem;
`;

const Staff: React.FC = () => {
  const [staff, setStaff] = useLocalStorage<StaffMember[]>("staff", []);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("Full-time");

  const filtered = useMemo(
    () =>
      staff.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [staff, query]
  );

  const addStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      toast.error("Name and Role are required");
      return;
    }
    const id = crypto.randomUUID();
    setStaff([
      ...staff,
      { id, name: name.trim(), role: role.trim(), availability },
    ]);
    setName("");
    setRole("");
    setAvailability("Full-time");
    toast.success("Staff member added");
  };

  const remove = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
    toast.info("Staff member deleted");
  };

  return (
    <Container>
      <HeadRow>
        <Title>Staff</Title>
        <Search
          placeholder="Search staff…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </HeadRow>

      <Form onSubmit={addStaff}>
        <Input
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Role * (e.g., Nurse)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Casual</option>
        </Select>
        <Button type="submit">+ Add Staff</Button>
      </Form>

      {filtered.map((s) => (
        <Card key={s.id}>
          <div>
            <strong>{s.name}</strong> — {s.role}
            <div style={{ color: "var(--muted)", marginTop: 4 }}>
              Availability: {s.availability}
            </div>
          </div>
          <Danger onClick={() => remove(s.id)}>Delete</Danger>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Help>No matches. Try a different search.</Help>
      )}
    </Container>
  );
};

export default Staff;
