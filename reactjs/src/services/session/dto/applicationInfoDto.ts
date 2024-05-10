interface ApplicationInfoDto {
  version: string;
  releaseDate: Date;
  features: Feature[];
}

export interface Feature {
  name: string;
  included: boolean;
}

export default ApplicationInfoDto;
