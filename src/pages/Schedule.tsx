import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Resident, StaffMember, ScheduleItem } from "../types";
import { useToast } from "../components/ToastProvider";

const Container = styled.div`
  padding: 2rem;
`;
const Title = styled.h2`
  margin: 0 0 1rem 0;
`;
const Form = styled.form`
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
  margin: 1rem 0 1.5rem;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  gap: 0.8rem;
`;
const Row = styled.div`
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

const Schedule: React.FC = () => {
  const [residents] = useLocalStorage<Resident[]>("residents", []);
  const [staff] = useLocalStorage<StaffMember[]>("staff", []);
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>(
    "schedule",
    []
  );
  const toast = useToast();

  const [staffId, setStaffId] = useState("");
  const [residentId, setResidentId] = useState("");
  const [shift, setShift] = useState("");

  const staffMap = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);
  const resMap = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId || !residentId || !shift.trim()) {
      toast.error("Choose staff, resident, and enter a shift");
      return;
    }
    const id = crypto.randomUUID();
    setSchedule([
      ...schedule,
      { id, staffId, residentId, shift: shift.trim() },
    ]);
    setStaffId("");
    setResidentId("");
    setShift("");
    toast.success("Assignment added");
  };

  const remove = (id: string) => {
    setSchedule(schedule.filter((s) => s.id !== id));
    toast.info("Assignment deleted");
  };

  return (
    <Container>
      <Title>Schedule</Title>

      <Form onSubmit={add}>
        <Select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
          <option value="">Select staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.role}
            </option>
          ))}
        </Select>
        <Select
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
        >
          <option value="">Select resident</option>
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.age}y)
            </option>
          ))}
        </Select>
        <Input
          placeholder="Shift (e.g., 09:00–17:00)"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        />
        <Button type="submit">+ Add Assignment</Button>
      </Form>

      <List>
        {schedule.map((item) => {
          const s = staffMap.get(item.staffId);
          const r = resMap.get(item.residentId);
          return (
            <Row key={item.id}>
              <div>
                <strong>{s ? s.name : "Unknown Staff"}</strong> →{" "}
                {r ? r.name : "Unknown Resident"}
                <div>
                  <Muted>{item.shift}</Muted>
                </div>
              </div>
              <Danger onClick={() => remove(item.id)}>Delete</Danger>
            </Row>
          );
        })}
        {schedule.length === 0 && <Muted>No assignments yet.</Muted>}
      </List>
    </Container>
  );
};

export default Schedule;
