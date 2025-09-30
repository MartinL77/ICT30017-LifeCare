import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  Resident,
  StaffMember,
  ServiceDefinition,
  ServiceRecord,
} from "../types";
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

const Services: React.FC = () => {
  const toast = useToast();

  const [definitions, setDefinitions] = useLocalStorage<ServiceDefinition[]>(
    "service_defs",
    [
      // starter examples (edit/delete allowed)
      {
        id: crypto.randomUUID(),
        name: "Daily shower assist",
        defaultDurationMins: 30,
      },
      {
        id: crypto.randomUUID(),
        name: "In-home care visit",
        defaultDurationMins: 60,
      },
    ]
  );
  const [records, setRecords] = useLocalStorage<ServiceRecord[]>(
    "service_recs",
    []
  );

  const [residents] = useLocalStorage<Resident[]>("residents", []);
  const [staff] = useLocalStorage<StaffMember[]>("staff", []);

  // form state for definitions
  const [defName, setDefName] = useState("");
  const [defDuration, setDefDuration] = useState<number | "">("");

  // form state for logging record
  const [serviceId, setServiceId] = useState("");
  const [residentId, setResidentId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const addDefinition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defName.trim() || (!defDuration && defDuration !== 0)) {
      toast.error("Service name and default duration required");
      return;
    }
    setDefinitions([
      ...definitions,
      {
        id: crypto.randomUUID(),
        name: defName.trim(),
        defaultDurationMins: Number(defDuration),
      },
    ]);
    setDefName("");
    setDefDuration("");
    toast.success("Service type added");
  };

  const removeDefinition = (id: string) => {
    setDefinitions(definitions.filter((d) => d.id !== id));
    // also remove records tied to this service?
    setRecords(records.filter((r) => r.serviceId !== id));
    toast.info("Service type removed");
  };

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !residentId || !date) {
      toast.error("Service, resident, and date are required");
      return;
    }
    const fallback =
      definitions.find((d) => d.id === serviceId)?.defaultDurationMins ?? 30;
    const dur = duration === "" ? fallback : Number(duration);
    setRecords([
      ...records,
      {
        id: crypto.randomUUID(),
        serviceId,
        residentId,
        staffId: staffId || undefined,
        date,
        durationMins: dur,
        notes: notes.trim() || undefined,
      },
    ]);
    setServiceId("");
    setResidentId("");
    setStaffId("");
    setDate("");
    setDuration("");
    setNotes("");
    toast.success("Service logged");
  };

  const removeRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
    toast.info("Log removed");
  };

  const defsMap = useMemo(
    () => new Map(definitions.map((d) => [d.id, d])),
    [definitions]
  );
  const resMap = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );
  const staffMap = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);

  return (
    <Wrap>
      <Title>Service Management</Title>

      <Section>
        <H3>Service Types</H3>
        <Grid onSubmit={addDefinition}>
          <Input
            placeholder="Service name *"
            value={defName}
            onChange={(e) => setDefName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Default duration (mins) *"
            value={defDuration}
            onChange={(e) =>
              setDefDuration(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <Button type="submit">+ Add Service Type</Button>
        </Grid>

        <List style={{ marginTop: "1rem" }}>
          {definitions.map((d) => (
            <Card key={d.id}>
              <div>
                <strong>{d.name}</strong>{" "}
                <Muted>({d.defaultDurationMins} mins)</Muted>
              </div>
              <Danger onClick={() => removeDefinition(d.id)}>Delete</Danger>
            </Card>
          ))}
          {definitions.length === 0 && <Muted>No service types yet.</Muted>}
        </List>
      </Section>

      <Section>
        <H3>Log Delivered Service</H3>
        <Grid onSubmit={addRecord}>
          <Select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Select service *</option>
            {definitions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

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

          <Select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">Assign staff (optional)</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.role}
              </option>
            ))}
          </Select>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Duration (mins)"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button type="submit">+ Log Service</Button>
        </Grid>

        <List style={{ marginTop: "1rem" }}>
          {records.map((rec) => {
            const d = defsMap.get(rec.serviceId);
            const r = resMap.get(rec.residentId);
            const s = rec.staffId ? staffMap.get(rec.staffId) : undefined;
            return (
              <Card key={rec.id}>
                <div>
                  <strong>{d?.name ?? "Service"}</strong> →{" "}
                  {r?.name ?? "Resident"}
                  <div>
                    <Muted>
                      {rec.date} • {rec.durationMins} mins{" "}
                      {s ? `• ${s.name}` : ""}
                    </Muted>
                  </div>
                  {rec.notes && (
                    <div>
                      <Muted>{rec.notes}</Muted>
                    </div>
                  )}
                </div>
                <Danger onClick={() => removeRecord(rec.id)}>Delete</Danger>
              </Card>
            );
          })}
          {records.length === 0 && <Muted>No services logged yet.</Muted>}
        </List>
      </Section>
    </Wrap>
  );
};

export default Services;
