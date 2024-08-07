import { ContractService } from './contract/contract.service';
import { ContractController } from './contract/contract.controller';
import { FactoryService } from './factory/factory.service';
import { FactoryController } from './factory/factory.controller';
import { DeviceService } from './device/device.service';
import { DeviceController } from './device/device.controller';
import { ValveService } from './valve/valve.service';
import { ValveController } from './valve/valve.controller';
import { AnalysisTaskService } from './analysis-task/analysis-task.service';
import { AnalysisTaskController } from './analysis-task/analysis-task.controller';

export const projectControllers = [
  ContractController,
  FactoryController,
  DeviceController,
  ValveController,
  AnalysisTaskController,
];

export const projectProviders = [
  ContractService,
  FactoryService,
  DeviceService,
  ValveService,
  AnalysisTaskService,
];
