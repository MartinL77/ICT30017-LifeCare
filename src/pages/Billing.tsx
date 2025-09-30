import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Invoice, Resident } from "../types";
import { useToast } from "../components/ToastProvider";

const Wrap = styled.div`
  padding: 2rem;
`;
const Title = styled.h2`
  margin: 0 0 1rem;
`;
const Section = styled.div`
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
`;
const H3 = styled.h3`
  margin: 0.2rem 0 1rem;
  font-size: 1rem;
`;
const Grid = styled.form`
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;
const Select = styled.select`
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
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
const List = styled.div`
  display: grid;
  gap: 0.7rem;
`;
const Card = styled.div`
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
const Toggle = styled.button`
  padding: 0.5rem 0.8rem;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.98);
  }
`;
const Muted = styled.span`
  color: var(--muted);
`;
const Totals = styled.div`
  display: flex;
  gap: 1rem;
  color: var(--muted);
`;

const Billing: React.FC = () => {
  const toast = useToast();
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", []);
  const [residents] = useLocalStorage<Resident[]>("residents", []);

  const [residentId, setResidentId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<string>("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentId || !description.trim() || amount === "" || !date) {
      toast.error("Resident, description, amount, and date are required");
      return;
    }
    setInvoices([
      ...invoices,
      {
        id: crypto.randomUUID(),
        residentId,
        description: description.trim(),
        amount: Number(amount),
        paid: false,
        date,
      },
    ]);
    setResidentId("");
    setDescription("");
    setAmount("");
    setDate("");
    toast.success("Invoice added");
  };

  const remove = (id: string) => {
    setInvoices(invoices.filter((i) => i.id !== id));
    toast.info("Invoice removed");
  };
  const togglePaid = (id: string) =>
    setInvoices(
      invoices.map((i) => (i.id === id ? { ...i, paid: !i.paid } : i))
    );

  const resMap = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );
  const totalDue = invoices
    .filter((i) => !i.paid)
    .reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices
    .filter((i) => i.paid)
    .reduce((s, i) => s + i.amount, 0);

  return (
    <Wrap>
      <Title>Billing</Title>

      <Section>
        <H3>Create Invoice</H3>
        <Grid onSubmit={add}>
          <Select
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
          >
            <option value="">Select resident *</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount *"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button type="submit">+ Add Invoice</Button>
        </Grid>
      </Section>

      <Section>
        <H3>Invoices</H3>
        <Totals>
          <div>
            <strong>Unpaid:</strong> ${totalDue.toFixed(2)}
          </div>
          <div>
            <strong>Paid:</strong> ${totalPaid.toFixed(2)}
          </div>
        </Totals>
        <List style={{ marginTop: ".8rem" }}>
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <div>
                <strong>
                  {resMap.get(inv.residentId)?.name ?? "Resident"}
                </strong>{" "}
                — ${inv.amount.toFixed(2)}
                <div>
                  <Muted>
                    {inv.date} • {inv.description}
                  </Muted>
                </div>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <Toggle onClick={() => togglePaid(inv.id)}>
                  {inv.paid ? "Mark Unpaid" : "Mark Paid"}
                </Toggle>
                <Danger onClick={() => remove(inv.id)}>Delete</Danger>
              </div>
            </Card>
          ))}
          {invoices.length === 0 && <Muted>No invoices yet.</Muted>}
        </List>
      </Section>
    </Wrap>
  );
};

export default Billing;
