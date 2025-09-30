import React, { useMemo } from "react";
import styled from "styled-components";
import StatCard from "../components/StatCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  Resident,
  StaffMember,
  ScheduleItem,
  ServiceDefinition,
  ServiceRecord,
  Room,
  InventoryItem,
  Invoice,
} from "../types";

const Wrap = styled.div`
  padding: 2rem;
`;
const Title = styled.h2`
  margin: 0 0 0.75rem 0;
`;
const Subtitle = styled.p`
  color: var(--muted);
  margin: 0 0 1.5rem 0;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: 2rem;
`;

const Panel = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
`;
const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
`;
const Item = styled.li`
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Muted = styled.span`
  color: var(--muted);
`;

const TwoCol = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const Home: React.FC = () => {
  // Core modules
  const [residents] = useLocalStorage<Resident[]>("residents", []);
  const [staff] = useLocalStorage<StaffMember[]>("staff", []);
  const [schedule] = useLocalStorage<ScheduleItem[]>("schedule", []);

  // Services
  const [serviceDefs] = useLocalStorage<ServiceDefinition[]>(
    "service_defs",
    []
  );
  const [serviceRecs] = useLocalStorage<ServiceRecord[]>("service_recs", []);

  // Facilities
  const [rooms] = useLocalStorage<Room[]>("rooms", []);

  // Inventory
  const [inventory] = useLocalStorage<InventoryItem[]>("inventory", []);

  // Billing
  const [invoices] = useLocalStorage<Invoice[]>("invoices", []);

  // Lookup maps
  const staffById = useMemo(
    () => new Map(staff.map((s) => [s.id, s])),
    [staff]
  );
  const residentsById = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );
  const serviceNameById = useMemo(
    () => new Map(serviceDefs.map((d) => [d.id, d.name])),
    [serviceDefs]
  );

  // Recent items
  const recentAssignments = useMemo(() => schedule.slice(-5), [schedule]);
  const recentServices = useMemo(() => serviceRecs.slice(-3), [serviceRecs]);
  const recentInvoices = useMemo(() => invoices.slice(-3), [invoices]);

  // Facilities snapshot
  const occupiedCount = rooms.filter((r) => !!r.occupantResidentId).length;
  const availableCount = rooms.length - occupiedCount;

  // Inventory snapshot
  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.quantity <= i.threshold).slice(0, 3),
    [inventory]
  );

  // Billing snapshot
  const totalUnpaid = invoices
    .filter((i) => !i.paid)
    .reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices
    .filter((i) => i.paid)
    .reduce((s, i) => s + i.amount, 0);

  return (
    <Wrap>
      <Title>Welcome back 👋</Title>
      <Subtitle>
        Operational snapshot across residents, staff, services, facilities,
        inventory, and billing.
      </Subtitle>

      {/* Top-level stats */}
      <Grid>
        <StatCard
          to="/residents"
          label="Residents"
          value={residents.length}
          sub="View & manage residents"
        />
        <StatCard
          to="/staff"
          label="Staff"
          value={staff.length}
          sub="Manage carers & roles"
        />
        <StatCard
          to="/schedule"
          label="Assignments"
          value={schedule.length}
          sub="Shifts & pairings"
        />
        <StatCard
          to="/services"
          label="Service Types"
          value={serviceDefs.length}
          sub="Configured services"
        />
        <StatCard
          to="/facilities"
          label="Rooms"
          value={rooms.length}
          sub={`${occupiedCount} occupied / ${availableCount} free`}
        />
        <StatCard
          to="/inventory"
          label="Inventory Items"
          value={inventory.length}
          sub={`${lowStockItems.length} low-stock`}
        />
        <StatCard
          to="/billing"
          label="Invoices"
          value={invoices.length}
          sub={`$${totalUnpaid.toFixed(2)} unpaid`}
        />
      </Grid>

      {/* Recent Residents + Assignments */}
      <Grid>
        <Panel>
          <SectionTitle>Recent Residents</SectionTitle>
          {residents.length === 0 ? (
            <Subtitle>No residents yet. Add your first one!</Subtitle>
          ) : (
            <List>
              {residents.slice(-5).map((r) => (
                <Item key={r.id}>
                  <span>
                    {r.name} — {r.age}y
                  </span>
                  <Muted>{r.carePlan || "No care plan"}</Muted>
                </Item>
              ))}
            </List>
          )}
        </Panel>

        <Panel>
          <SectionTitle>Recent Assignments</SectionTitle>
          {recentAssignments.length === 0 ? (
            <Subtitle>No assignments yet. Create one in Schedule.</Subtitle>
          ) : (
            <List>
              {recentAssignments.map((a) => {
                const staffName =
                  staffById.get(a.staffId)?.name ?? "Unknown Staff";
                const residentName =
                  residentsById.get(a.residentId)?.name ?? "Unknown Resident";
                return (
                  <Item key={a.id}>
                    <span>
                      <strong>{staffName}</strong> → {residentName}
                    </span>
                    <Muted>{a.shift}</Muted>
                  </Item>
                );
              })}
            </List>
          )}
        </Panel>
      </Grid>

      {/* Snapshots for Services / Facilities / Inventory / Billing */}
      <TwoCol>
        <Panel>
          <SectionTitle>Recent Services</SectionTitle>
          {serviceRecs.length === 0 ? (
            <Subtitle>No services logged yet.</Subtitle>
          ) : (
            <List>
              {recentServices.map((sv) => {
                const name = serviceNameById.get(sv.serviceId) ?? "Service";
                const residentName =
                  residentsById.get(sv.residentId)?.name ?? "Resident";
                const staffName = sv.staffId
                  ? staffById.get(sv.staffId)?.name ?? "Staff"
                  : null;
                return (
                  <Item key={sv.id}>
                    <span>
                      <strong>{name}</strong> → {residentName}
                      {staffName && (
                        <>
                          {" "}
                          • <Muted>{staffName}</Muted>
                        </>
                      )}
                    </span>
                    <Muted>
                      {sv.date} • {sv.durationMins} mins
                    </Muted>
                  </Item>
                );
              })}
            </List>
          )}
        </Panel>

        <Panel>
          <SectionTitle>Facilities Overview</SectionTitle>
          {rooms.length === 0 ? (
            <Subtitle>No rooms configured yet.</Subtitle>
          ) : (
            <List>
              <Item>
                <span>Occupied Rooms</span>
                <Muted>{occupiedCount}</Muted>
              </Item>
              <Item>
                <span>Available Rooms</span>
                <Muted>{availableCount}</Muted>
              </Item>
              {/* Show up to 3 occupied room lines */}
              {rooms
                .filter((r) => r.occupantResidentId)
                .slice(0, 3)
                .map((rm) => (
                  <Item key={rm.id}>
                    <span>{rm.name}</span>
                    <Muted>
                      {residentsById.get(rm.occupantResidentId!)?.name ??
                        "Occupied"}
                    </Muted>
                  </Item>
                ))}
            </List>
          )}
        </Panel>
      </TwoCol>

      <TwoCol>
        <Panel>
          <SectionTitle>Inventory Snapshot</SectionTitle>
          {inventory.length === 0 ? (
            <Subtitle>No inventory yet.</Subtitle>
          ) : (
            <List>
              <Item>
                <span>Total Items</span>
                <Muted>{inventory.length}</Muted>
              </Item>
              <Item>
                <span>Low-stock</span>
                <Muted>
                  {inventory.filter((i) => i.quantity <= i.threshold).length}
                </Muted>
              </Item>
              {lowStockItems.map((it) => (
                <Item key={it.id}>
                  <span>{it.name}</span>
                  <Muted>
                    Qty {it.quantity} / Thr {it.threshold}
                  </Muted>
                </Item>
              ))}
            </List>
          )}
        </Panel>

        <Panel>
          <SectionTitle>Billing Snapshot</SectionTitle>
          {invoices.length === 0 ? (
            <Subtitle>No invoices yet.</Subtitle>
          ) : (
            <List>
              <Item>
                <span>Unpaid Total</span>
                <Muted>${totalUnpaid.toFixed(2)}</Muted>
              </Item>
              <Item>
                <span>Paid Total</span>
                <Muted>${totalPaid.toFixed(2)}</Muted>
              </Item>
              {recentInvoices.map((inv) => (
                <Item key={inv.id}>
                  <span>
                    <strong>
                      {residentsById.get(inv.residentId)?.name ?? "Resident"}
                    </strong>{" "}
                    - <Muted>{inv.description}</Muted>
                  </span>
                  <Muted>
                    ${inv.amount.toFixed(2)} {inv.paid ? "• Paid" : "• Unpaid"}
                  </Muted>
                </Item>
              ))}
            </List>
          )}
        </Panel>
      </TwoCol>
    </Wrap>
  );
};

export default Home;
