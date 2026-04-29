// patientsPageHelpers.js

/**
 * Returns how many days from today until `dateStr` (YYYY-MM-DD).
 * Negative = in the past.
 */
export const daysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

/**
 * Returns { width (0–100), cls } for the progress bar based on days remaining.
 * Logic: closer = fuller bar = more urgent.
 *   0–1   → 100%  red    (aujourd'hui / demain)
 *   2–7   → 75%   red    (cette semaine)
 *   8–14  → 45%   amber  (semaine prochaine)
 *   15–30 → 20%   green  (plus tard)
 *   30+   → 8%    green
 *   past  → 100%  grey   (passé)
 */
export const getRdvBarWidth = (days) => {
  if (days < 0)   return { width: 100, cls: "bar-past"  };
  if (days <= 1)  return { width: 100, cls: "bar-soon"  };
  if (days <= 7)  return { width: 75,  cls: "bar-soon"  };
  if (days <= 14) return { width: 45,  cls: "bar-next"  };
  if (days <= 30) return { width: 20,  cls: "bar-later" };
  return               { width: 8,   cls: "bar-later" };
};

/**
 * Maps days value to the filter key used in the RDV <select>.
 */
export const getRdvFilterKey = (days) => {
  if (days < 0)   return "past";
  if (days <= 7)  return "this-week";
  if (days <= 14) return "next-week";
  return "later";
};

/**
 * Returns human-readable label for days remaining.
 */
export const getDaysLabel = (days) => {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Demain";
  if (days < 0)  return `il y a ${Math.abs(days)}j`;
  return `dans ${days}j`;
};

/**
 * Applies search, hospitalisation, and RDV filters to the patients array.
 */
export const filterPatients = (patients, { search, filter, rdvFilter, rdvMap }) => {
  if (!Array.isArray(patients)) return [];

  return patients.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name?.toLowerCase().includes(q) ||
      p.surname?.toLowerCase().includes(q) ||
      `${p.name} ${p.surname}`.toLowerCase().includes(q) ||
      `${p.surname} ${p.name}`.toLowerCase().includes(q) ||
      p.numero?.toLowerCase().includes(q);

    const matchHospit = filter === "" || p.hospitalisation === filter;

    let matchRdv = true;
    if (rdvFilter !== "") {
      const rdv = rdvMap[p.id];
      if (!rdv) {
        matchRdv = rdvFilter === "none";
      } else {
        const days = daysUntil(rdv.date);
        matchRdv = getRdvFilterKey(days) === rdvFilter;
      }
    }

    return matchSearch && matchHospit && matchRdv;
  });
};