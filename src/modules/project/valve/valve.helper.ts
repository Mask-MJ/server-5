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
      ].join('-'),
    actuatorDescription:
      actuatorDescription ||
      [
        actuatorBrand,
        actuatorSeries,
        actuatorSize,
        actuatorFailurePosition,
        handwheel,
        stroke,
      ].join('-'),
    positionerDescription:
      positionerDescription || [positionerBrand, positionerModel].join('-'),
    lsDescription: lsDescription || [lsBrand, lsModel, lsQty].join('-'),
    pilotDescription:
      pilotDescription || [pilotBrand, pilotModel, pilotQty].join('-'),
    qeDescription: qeDescription || [qeBrand, qeModel, qeQty].join('-'),
    regulatorDescription:
      regulatorDescription || [regulatorBrand, regulatorModel].join('-'),
    signalComparatorDescription:
      signalComparatorDescription ||
      [signalComparatorBrand, signalComparatorModel].join('-'),
    sovDescription: sovDescription || [sovBrand, sovModel, sovQty].join('-'),
    tripValveDescription:
      tripValveDescription || [tripValveBrand, tripValveModel].join('-'),
    vbDescription: vbDescription || [vbBrand, vbModel, vbQty].join('-'),
  };
}
