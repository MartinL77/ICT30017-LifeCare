import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled(Link)`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem;
  display: block;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,.06);
    border-color: #ddd8f7;
  }
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: .4rem;
`;

const Value = styled.div`
  font-weight: 800;
  font-size: 2rem;
  color: var(--text);
`;

const Sub = styled.div`
  margin-top: .35rem;
  font-size: .85rem;
  color: var(--muted);
`;

type Props = { to: string; label: string; value: number; sub?: string; }

const StatCard: React.FC<Props> = ({ to, label, value, sub }) => (
  <Card to={to}>
    <Label>{label}</Label>
    <Value>{value}</Value>
    {sub && <Sub>{sub}</Sub>}
  </Card>
);

export default StatCard;
