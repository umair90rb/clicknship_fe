interface Field {
  name: string;
  type: string;
  isOptional?: boolean;
}

export type AvailableCourierIntegrationList = {
  courier: string;
  requiredFields: Field[];
};
