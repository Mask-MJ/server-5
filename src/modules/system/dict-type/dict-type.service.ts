import { Inject, Injectable } from '@nestjs/common';
import {
  CreateDictTypeDto,
  QueryDictTypeDto,
  UpdateDictTypeDto,
} from './dict-type.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import {
  data,
  dictDataTree,
  keyWord,
  type DictDataTreeCreate,
} from './TreeStructure';

@Injectable()
export class DictTypeService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(user: ActiveUserData, createDictTypeDto: CreateDictTypeDto) {
    return this.prismaService.client.dictType.create({
      data: { ...createDictTypeDto, createBy: user.account },
    });
  }

  async findAll(queryDictTypeDto: QueryDictTypeDto) {
    const { name, value, page, pageSize } = queryDictTypeDto;
    const [rows, meta] = await this.prismaService.client.dictType
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          value: { contains: value, mode: 'insensitive' },
        },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.dictType.findUnique({ where: { id } });
  }

  update(
    id: number,
    user: ActiveUserData,
    updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.prismaService.client.dictType.update({
      where: { id },
      data: { ...updateDictTypeDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.dictType.delete({ where: { id } });
  }

  async export() {
    const dictType = await this.prismaService.client.dictType.findFirst({
      where: { name: 'ff' },
    });
    // 序列化数据, 改成树形结构, 递归
    function getChildren(
      data: dictDataTree[],
      id: number,
    ): DictDataTreeCreate[] {
      // console.log(data);
      return data
        .filter((item) => item.parent_id === id)
        .map((item) => {
          return {
            id: item.id,
            parentId: item.parent_id,
            name: item.name_ZH,
            value: item.name_EN,
            dictData: {},
            children: {
              create: getChildren(data, item.id),
            },
          };
        });
    }
    // 把 keyWord 放到树形结构中
    function addKeyWord(treeData: DictDataTreeCreate[]) {
      treeData.forEach((item, index) => {
        const keyWordItem = keyWord.find((key) => key.parent_id === item.id);
        if (keyWordItem) {
          if (!item.dictData.create) {
            item.dictData.create = [];
          }
          item.dictData.create.push({
            name: keyWordItem.name_ZH,
            value: keyWordItem.name_EN,
            sort: index + 1,
            type: '0',
            createBy: 'admin',
            dictTypeId: dictType.id,
          });
        }
        if (item.children) {
          addKeyWord(item.children.create);
        }
      });
    }
    // 删除数据中所有的 id 和 parentId 和 children 中 create 为空的数据
    function deleteId(treeData: DictDataTreeCreate[]) {
      treeData.forEach((item) => {
        delete item.id;
        delete item.parentId;
        if (item.children) {
          deleteId(item.children.create);
        }
        if (item.dictData.create?.length === 0) {
          delete item.dictData;
        }
        if (item.children.create?.length === 0) {
          delete item.children.create;
        }
      });
    }
    const treeData = getChildren(data, null);
    addKeyWord(treeData);
    deleteId(treeData);

    // return treeData;
    return this.prismaService.client.dictDataTree.create({
      data: treeData[1],
    });
  }
}
