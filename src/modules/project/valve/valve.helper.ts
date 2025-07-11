import { CreateValveDto } from './valve.dto';
export function createValveDescription(
  createValveDto: CreateValveDto,
): CreateValveDto {
  const {
    valveBrand,
    valveSeries,
    valveSize,
    valveRating,
    valveEndConnection,
    valveStemSize,
    valveBodyMaterial,
    valveBonnet,
    valveTrim,
    valveSeatLeakage,
    valveCv,
    valveDescription,

    actuatorBrand,
    actuatorSeries,
    actuatorSize,
    actuatorFailurePosition,
    handwheel,
    stroke,
    actuatorDescription,

    positionerBrand,
    positionerModel,
    positionerDescription,

    lsBrand,
    lsModel,
    lsQty,
    lsDescription,

    pilotBrand,
    pilotModel,
    pilotQty,
    pilotDescription,

    qeBrand,
    qeModel,
    qeQty,
    qeDescription,

    regulatorBrand,
    regulatorModel,
    regulatorDescription,

    signalComparatorBrand,
    signalComparatorModel,
    signalComparatorDescription,

    sovBrand,
    sovModel,
    sovQty,
    sovDescription,

    tripValveBrand,
    tripValveModel,
    tripValveDescription,

    vbBrand,
    vbModel,
    vbQty,
    vbDescription,
  } = createValveDto;

  return {
    ...createValveDto,
    valveDescription:
      valveDescription ||
      [
        valveBrand,
        valveSeries,
        valveSize,
        valveRating,
        valveEndConnection,
        valveStemSize,
        valveBodyMaterial,
        valveBonnet,
        valveTrim,
        valveSeatLeakage,
        valveCv,
      ]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    actuatorDescription:
      actuatorDescription ||
      [
        actuatorBrand,
        actuatorSeries,
        actuatorSize,
        actuatorFailurePosition,
        handwheel,
        stroke,
      ]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    positionerDescription:
      positionerDescription ||
      [positionerBrand, positionerModel]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    lsDescription:
      lsDescription ||
      [lsBrand, lsModel, lsQty]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    pilotDescription:
      pilotDescription ||
      [pilotBrand, pilotModel, pilotQty]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    qeDescription:
      qeDescription ||
      [qeBrand, qeModel, qeQty]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    regulatorDescription:
      regulatorDescription ||
      [regulatorBrand, regulatorModel]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    signalComparatorDescription:
      signalComparatorDescription ||
      [signalComparatorBrand, signalComparatorModel]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    sovDescription:
      sovDescription ||
      [sovBrand, sovModel, sovQty]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    tripValveDescription:
      tripValveDescription ||
      [tripValveBrand, tripValveModel]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
    vbDescription:
      vbDescription ||
      [vbBrand, vbModel, vbQty]
        .filter((item) => item !== null && item !== undefined && item !== '')
        .join('-'),
  };
}
