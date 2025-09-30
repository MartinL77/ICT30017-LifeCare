import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Resident } from "../types";
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

const Residents: React.FC = () => {
  const [residents, setResidents] = useLocalStorage<Resident[]>(
    "residents",
    []
  );
  const [query, setQuery] = useState("");
  const toast = useToast();

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [carePlan, setCarePlan] = useState("");
  const [medication, setMedication] = useState("");

  const filtered = useMemo(
    () =>
      residents.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
      ),
    [residents, query]
  );

  const addResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    const id = crypto.randomUUID();
    setResidents([
      ...residents,
      {
        id,
        name: name.trim(),
        age: Number(age) || 0,
        carePlan: carePlan.trim(),
        medication: medication.trim(),
      },
    ]);
    setName("");
    setAge("");
    setCarePlan("");
    setMedication("");
    toast.success("Resident added");
  };

  const remove = (id: string) => {
    setResidents(residents.filter((r) => r.id !== id));
    toast.info("Resident deleted");
  };

  return (
    <Container>
      <HeadRow>
        <Title>Residents</Title>
        <Search
          placeholder="Search residents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </HeadRow>

      <Form onSubmit={addResident}>
        <Input
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <Input
          placeholder="Care plan"
          value={carePlan}
          onChange={(e) => setCarePlan(e.target.value)}
        />
        <Input
          placeholder="Medication needs"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
        />
        <Button type="submit">+ Add Resident</Button>
      </Form>

      {filtered.map((r) => (
        <Card key={r.id}>
          <div>
            <strong>{r.name}</strong> — {r.age || "N/A"}y
            <div style={{ color: "var(--muted)", marginTop: 4 }}>
              Care: {r.carePlan || "—"} • Meds: {r.medication || "—"}
            </div>
          </div>
          <Danger onClick={() => remove(r.id)}>Delete</Danger>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Help>No matches. Try a different search.</Help>
      )}
    </Container>
  );
};

export default Residents;
