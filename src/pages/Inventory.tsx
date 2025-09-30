import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { InventoryItem } from "../types";
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
const Card = styled.div<{ low?: boolean }>`
  background: #fff;
  border: 1px solid ${({ low }) => (low ? "#ffb3b3" : "var(--border)")};
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
const Muted = styled.span`
  color: var(--muted);
`;
const QtyBar = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;

const Inventory: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useLocalStorage<InventoryItem[]>("inventory", []);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [threshold, setThreshold] = useState<number | "">("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || quantity === "" || threshold === "") {
      toast.error("Name, quantity, and threshold required");
      return;
    }
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        quantity: Number(quantity),
        threshold: Number(threshold),
      },
    ]);
    setName("");
    setQuantity("");
    setThreshold("");
    toast.success("Item added");
  };

  const remove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    toast.info("Item removed");
  };

  const inc = (id: string) =>
    setItems(
      items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  const dec = (id: string) =>
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
      )
    );

  const lowCount = useMemo(
    () => items.filter((i) => i.quantity <= i.threshold).length,
    [items]
  );

  return (
    <Wrap>
      <Title>Inventory Management</Title>

      <Section>
        <H3>Add Item</H3>
        <Grid onSubmit={add}>
          <Input
            placeholder="Item name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity *"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Input
            type="number"
            placeholder="Low-stock threshold *"
            value={threshold}
            onChange={(e) =>
              setThreshold(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Button type="submit">+ Add Item</Button>
        </Grid>
      </Section>

      <Section>
        <H3>
          Items{" "}
          <Muted>
            ({items.length} total, {lowCount} low-stock)
          </Muted>
        </H3>
        <List>
          {items.map((item) => (
            <Card key={item.id} low={item.quantity <= item.threshold}>
              <div>
                <strong>{item.name}</strong>{" "}
                <Muted>(threshold {item.threshold})</Muted>
                <div>
                  <Muted>Qty: {item.quantity}</Muted>
                </div>
              </div>
              <QtyBar>
                <Button type="button" onClick={() => dec(item.id)}>
                  -
                </Button>
                <Button type="button" onClick={() => inc(item.id)}>
                  +
                </Button>
                <Danger onClick={() => remove(item.id)}>Delete</Danger>
              </QtyBar>
            </Card>
          ))}
          {items.length === 0 && <Muted>No items yet.</Muted>}
        </List>
      </Section>
    </Wrap>
  );
};

export default Inventory;
