CREATE TABLE IF NOT EXISTS public.notifications (
  id              SERIAL PRIMARY KEY,
  patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  suivi_id        INTEGER REFERENCES suivi_therapeutique(id) ON DELETE CASCADE,
  rdv_id          INTEGER REFERENCES rendezvous(id) ON DELETE CASCADE,
  prescription_id INTEGER REFERENCES prescription_medicale(id) ON DELETE CASCADE,
  type            VARCHAR(50) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),

  CONSTRAINT notifications_type_check CHECK (
    type IN (
      'delivrance',
      'en_retard',
      'perdu_de_vue',
      'recupere',
      'alerte',
      'prescription_non_validee',
      'rdv_manque',
      'rdv_proche'
    )
  )
);

CREATE INDEX idx_notif_created_at  ON notifications(created_at DESC);
CREATE INDEX idx_notif_type        ON notifications(type);
CREATE INDEX idx_notif_patient_id  ON notifications(patient_id);