const styles = `
.users-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.users-stat-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: #fff;
  min-width: 100px;
}

.users-stat-card__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6c757d;
}

.users-stat-card__value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  color: #1e293b;
}

.users-stat-card--success .users-stat-card__value {
  color: #198754;
}

.users-stat-card--danger .users-stat-card__value {
  color: #dc3545;
}
`;

export default function UserStatsCards({ totalUsers, activeUsers, inactiveUsers }) {
  return (
    <>
      <style>{styles}</style>
      <div className="users-stats" aria-label="Statistiques utilisateurs">
        <div className="users-stat-card">
          <span className="users-stat-card__label">Total</span>
          <strong className="users-stat-card__value">{totalUsers}</strong>
        </div>
        <div className="users-stat-card users-stat-card--success">
          <span className="users-stat-card__label">Activés</span>
          <strong className="users-stat-card__value">{activeUsers}</strong>
        </div>
        <div className="users-stat-card users-stat-card--danger">
          <span className="users-stat-card__label">Inactifs</span>
          <strong className="users-stat-card__value">{inactiveUsers}</strong>
        </div>
      </div>
    </>
  );
}