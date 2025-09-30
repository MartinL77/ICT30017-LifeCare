import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

/* --- FIXED NAV BAR ALWAYS ON TOP --- */
const Z_NAV = 2000;
const Z_MOBILE_PANEL = 1900;
const Z_CLICKAWAY = 1850;

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navH);
  background: var(--brand);
  color: #fff;
  z-index: ${Z_NAV};
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
`;

const Inner = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(NavLink)`
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.3px;
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const DesktopLinks = styled.div`
  display: none;
  gap: 0.5rem;
  @media (min-width: 769px) {
    display: flex;
    align-items: center;
  }
`;

const A = styled(NavLink)`
  color: #fff;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  &.active {
    background: #fff;
    color: var(--brand);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

/* --- MOBILE --- */
const BurgerBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const Icon = ({ open }: { open: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    {open ? (
      <path
        fill="currentColor"
        d="M18.3 5.71L12 12.01l-6.29-6.3-1.42 1.42L10.59 13.4l-6.3 6.3 1.42 1.41L12 14.82l6.29 6.29 1.42-1.41-6.3-6.3 6.3-6.3z"
      />
    ) : (
      <path
        fill="currentColor"
        d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
      />
    )}
  </svg>
);

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* Make the mobile panel FIXED, starting below the navbar. */
const MobilePanel = styled.div<{ open: boolean }>`
  position: fixed;
  top: var(--navH);
  left: 0;
  right: 0;
  background: var(--brand);
  z-index: ${Z_MOBILE_PANEL};
  overflow: hidden;
  max-height: ${(p) => (p.open ? "60vh" : "0")};
  transition: max-height 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobilePanelInner = styled.div<{ open: boolean }>`
  animation: ${slideDown} 0.16s ease;
  padding: ${(p) => (p.open ? ".5rem 0 .6rem" : "0")};
`;

const MobileLinks = styled.div`
  display: grid;
  gap: 0.25rem;
  padding: 0.4rem 1rem 0.8rem;
`;

const MobileA = styled(NavLink)`
  color: #fff;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  &.active {
    background: #fff;
    color: var(--brand);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

/* Click-away overlay only covers BELOW the navbar */
const ClickAway = styled.div<{ open: boolean }>`
  display: ${(p) => (p.open ? "block" : "none")};
  position: fixed;
  top: var(--navH);
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: ${Z_CLICKAWAY};
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const close = () => setOpen(false);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Bar>
      <Inner aria-label="Primary">
        <Logo to="/">Life Care</Logo>

        {/* Desktop */}
        <DesktopLinks role="menubar" aria-label="Primary navigation">
          <A to="/residents">Residents</A>
          <A to="/staff">Staff</A>
          <A to="/schedule">Schedule</A>
          <A to="/services">Services</A>
          <A to="/facilities">Facilities</A>
          <A to="/inventory">Inventory</A>
          <A to="/billing">Billing</A>
        </DesktopLinks>

        {/* Mobile toggle */}
        <BurgerBtn
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <Icon open={open} />
          <span style={{ fontWeight: 600 }}>{open ? "Close" : "Menu"}</span>
        </BurgerBtn>
      </Inner>

      {/* Mobile dropdown (fixed, below navbar) */}
      <MobilePanel id="mobile-menu" open={open}>
        <MobilePanelInner open={open} aria-hidden={!open}>
          <MobileLinks role="menu">
            <MobileA to="/residents" role="menuitem">
              Residents
            </MobileA>
            <MobileA to="/staff" role="menuitem">
              Staff
            </MobileA>
            <MobileA to="/schedule" role="menuitem">
              Schedule
            </MobileA>
            <MobileA to="/services" role="menuitem">
              Services
            </MobileA>
            <MobileA to="/facilities" role="menuitem">
              Facilities
            </MobileA>
            <MobileA to="/inventory" role="menuitem">
              Inventory
            </MobileA>
            <MobileA to="/billing" role="menuitem">
              Billing
            </MobileA>
          </MobileLinks>
        </MobilePanelInner>
      </MobilePanel>

      <ClickAway open={open} onClick={close} />
    </Bar>
  );
};

export default Navbar;
