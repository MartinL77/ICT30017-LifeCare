import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Resident, Room } from "../types";
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
const Muted = styled.span`
  color: var(--muted);
`;

const Facilities: React.FC = () => {
  const toast = useToast();
  const [rooms, setRooms] = useLocalStorage<Room[]>("rooms", []);
  const [residents] = useLocalStorage<Resident[]>("residents", []);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");

  const addRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || capacity === "") {
      toast.error("Room name and capacity required");
      return;
    }
    setRooms([
      ...rooms,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        capacity: Number(capacity),
      },
    ]);
    setName("");
    setCapacity("");
    toast.success("Room added");
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    toast.info("Room deleted");
  };

  const assign = (roomId: string, residentId: string) => {
    setRooms(
      rooms.map((r) =>
        r.id === roomId
          ? { ...r, occupantResidentId: residentId || undefined }
          : r
      )
    );
    toast.success("Occupancy updated");
  };

  const resMap = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );

  return (
    <Wrap>
      <Title>Facility Management</Title>

      <Section>
        <H3>Add Room</H3>
        <Grid onSubmit={addRoom}>
          <Input
            placeholder="Room name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Capacity *"
            value={capacity}
            onChange={(e) =>
              setCapacity(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Button type="submit">+ Add Room</Button>
        </Grid>
      </Section>

      <Section>
        <H3>Rooms</H3>
        <List>
          {rooms.map((room) => (
            <Card key={room.id}>
              <div>
                <strong>{room.name}</strong>{" "}
                <Muted>(cap {room.capacity})</Muted>
                <div>
                  <Muted>Occupant: </Muted>
                  {room.occupantResidentId ? (
                    <strong>
                      {resMap.get(room.occupantResidentId)?.name ?? "Unknown"}
                    </strong>
                  ) : (
                    <Muted>None</Muted>
                  )}
                </div>
              </div>
              <div
                style={{ display: "flex", gap: ".5rem", alignItems: "center" }}
              >
                <Select
                  value={room.occupantResidentId ?? ""}
                  onChange={(e) => assign(room.id, e.target.value)}
                >
                  <option value="">-- Empty --</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </Select>
                <Danger onClick={() => removeRoom(room.id)}>Delete</Danger>
              </div>
            </Card>
          ))}
          {rooms.length === 0 && <Muted>No rooms yet.</Muted>}
        </List>
      </Section>
    </Wrap>
  );
};

export default Facilities;
