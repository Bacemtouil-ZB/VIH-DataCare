// Retourne données prêtes pour PieChart + tableau récapitulatif
export const toPopulationsClesChartData = (populationsCles) => {
  if (!populationsCles) return null;

  return {
    hsh:         populationsCles.hsh,
    udi:         populationsCles.udi,
    transgenres: populationsCles.transgenres,

    // Format PieChart Recharts — total par groupe
    pieData: [
      { name: "HSH",         value: populationsCles.hsh.total,         fill: "#1890ff" },
      { name: "UDI",         value: populationsCles.udi.total,         fill: "#faad14" },
      { name: "Transgenres", value: populationsCles.transgenres.total, fill: "#722ed1" },
    ],
  };
};