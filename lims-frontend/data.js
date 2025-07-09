const reagents = [
  { reagent: 'DMEM', vendor: 'Sigma', catalog: '25346545', lot: '44534347', exp: '2022-10-27', days: 28 },
  { reagent: 'FBS', vendor: 'VWR', catalog: '658922-500', lot: '4354340', exp: '2022-10-28', days: 28 },
  { reagent: 'Gentamycin Sulfate', vendor: 'Sigma', catalog: '354875', lot: '4354346', exp: '2022-10-18', days: 19 },
];

const lotBox = Array.from({ length: 100 }, (_, i) => ({
  position: i + 1,
  label: `A${i + 1}`,
  filled: i < 50
}));

const samples = [
  {
    sample_id: "PLSMA_6", status: "Derivative", category: "Derivative",
    parent_id: "BLD_11", barcode: "PLSMA_6_No Derivative", custodian: "Jonny Bairstow",
    subject_id: "USR_2", storage: "STG_42-R1C5", quantity: 10, unit: "ml", type: "Plasma"
  },
  {
    sample_id: "PLSMA_5", status: "Derivative", category: "Derivative",
    parent_id: "BLD_10", barcode: "PLSMA_5_No Derivative", custodian: "Master Admin",
    subject_id: "M_ADMIN_Mon1", storage: "STG_16-R2C6", quantity: 2, unit: "ml", type: "Plasma"
  },
];