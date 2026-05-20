import {
  hasAllFactoryScope,
  getAccessibleFactoryIds,
  type UserWithRoles,
} from './user-factory-scope';

describe('user-factory-scope', () => {
  describe('hasAllFactoryScope', () => {
    it('returns true when user is admin', () => {
      const user: UserWithRoles = { isAdmin: true, role: [] };
      expect(hasAllFactoryScope(user)).toBe(true);
    });

    it('returns true when any role has grantAllFactories=true', () => {
      const user: UserWithRoles = {
        isAdmin: false,
        role: [
          { id: 1, grantAllFactories: false },
          { id: 2, grantAllFactories: true },
        ],
      };
      expect(hasAllFactoryScope(user)).toBe(true);
    });

    it('returns false when not admin and no grant-all role', () => {
      const user: UserWithRoles = {
        isAdmin: false,
        role: [{ id: 1, grantAllFactories: false }],
      };
      expect(hasAllFactoryScope(user)).toBe(false);
    });

    it('returns false when user has no roles and is not admin', () => {
      const user: UserWithRoles = { isAdmin: false, role: [] };
      expect(hasAllFactoryScope(user)).toBe(false);
    });
  });

  describe('getAccessibleFactoryIds', () => {
    const buildPrisma = (factoryIds: number[]) => ({
      client: {
        factory: {
          findMany: jest.fn().mockResolvedValue(
            factoryIds.map((id) => ({ id })),
          ),
        },
      },
    });

    it('returns null when user has all-factory scope (admin)', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: true,
        role: [],
      });
      expect(result).toBeNull();
      expect(prisma.client.factory.findMany).not.toHaveBeenCalled();
    });

    it('returns null when user has any grantAllFactories role', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [{ id: 1, grantAllFactories: true }],
      });
      expect(result).toBeNull();
      expect(prisma.client.factory.findMany).not.toHaveBeenCalled();
    });

    it('returns factoryIds from roles when not all-scope', async () => {
      const prisma = buildPrisma([10, 11]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [
          { id: 1, grantAllFactories: false },
          { id: 2, grantAllFactories: false },
        ],
      });
      expect(result).toEqual([10, 11]);
      expect(prisma.client.factory.findMany).toHaveBeenCalledWith({
        where: { role: { some: { id: { in: [1, 2] } } } },
        select: { id: true },
      });
    });

    it('returns empty array when user has no roles', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [],
      });
      expect(result).toEqual([]);
    });
  });
});
