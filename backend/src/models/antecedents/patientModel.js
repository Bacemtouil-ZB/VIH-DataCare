// ---------- Patient ----------
export async function getPatientByNumero(client, numero) {
  const r = await client.query(`SELECT * FROM patients WHERE numero = $1;`, [
    numero,
  ]);
  return r.rows[0] || null;
}
