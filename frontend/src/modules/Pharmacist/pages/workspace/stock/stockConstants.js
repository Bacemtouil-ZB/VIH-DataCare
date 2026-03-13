export const toUiStockItem = (row) => ({
  id:          row?.id,
  code:        String(row?.code || "").toUpperCase(),
  composition: row?.composition || "",
  quantity:    Number(row?.quantite ?? row?.quantity ?? 0),
  updatedAt:   row?.updated_at || row?.updatedAt || null,
});

export const INITIAL_ADD_FORM = {
  medicamentCode:        "",
  medicamentComposition: "",
  quantityToAdd:         "",
};