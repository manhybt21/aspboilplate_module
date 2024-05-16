export default class ApplicationInfoDto {
  version!: string
  releaseDate!: Date
  features: { [featureName: string]: boolean } | undefined
}
