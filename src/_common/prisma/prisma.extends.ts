import { Prisma, PrismaClient } from '@prisma/client';

export const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    query: {
      $allModels: {
        async findMany({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));
          return query(args);
        },

        async findFirst({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));
          return query(args);
        },

        async findUnique({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));

          return query(args);
        },

        async findFirstOrThrow({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);
          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));

          return query(args);
        },

        async findUniqueOrThrow({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));

          return query(args);
        },

        async count({ model, operation, args, query }) {
          const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

          if (target?.fields.some((f) => f.name === 'deletedAt')) {
            args.where = { ...args.where, deletedAt: null };
          }

          (args as any).include && ((args as any).include = includeSoftDelete((args as any).include, model));

          return query(args);
        },
      },
    },
    model: {
      $allModels: {
        /** SoftDelete
         * 테이블 내 deletedAt 컬럼에 현재 날짜를 기록하여 삭제된 데이터로 취급합니다.
         *  */
        async softDelete<M, A>(this: M, where: Prisma.Args<M, 'update'>['where']): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).update({
            where,
            data: {
              deletedAt: new Date(),
            },
          });
        },
      },
    },
  });

function includeSoftDelete(obj: object, model: Prisma.ModelName) {
  const target = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

  for (const key in obj) {
    if (obj[key] instanceof Object) {
      const includeModelInfo = target?.fields.find((m) => m.name === key);
      includeSoftDelete(obj[key], key !== 'include' ? (includeModelInfo?.type as Prisma.ModelName as Prisma.ModelName) : model);
    }

    if (!obj[key].deletedAt) {
      if (obj[key].where) {
        const includeModelInfo = target?.fields.find((m) => m.name === key);
        const includeTarget = Prisma.dmmf.datamodel.models.find((m) => m.name === includeModelInfo?.type);

        if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && includeModelInfo?.isList) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        } else if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && !includeModelInfo?.isList && !includeModelInfo?.isRequired) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        }
      }

      if (obj[key] === true) {
        const includeModelInfo = target?.fields.find((m) => m.name === key);
        const includeTarget = Prisma.dmmf.datamodel.models.find((m) => m.name === includeModelInfo?.type);
        if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && includeModelInfo?.isList) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        } else if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && !includeModelInfo?.isList && !includeModelInfo?.isRequired) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        }
      }

      if (obj[key].include) {
        const includeModelInfo = target?.fields.find((m) => m.name === key);
        const includeTarget = Prisma.dmmf.datamodel.models.find((m) => m.name === includeModelInfo?.type);
        if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && includeModelInfo?.isList) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        } else if (includeTarget?.fields.some((f) => f.name === 'deletedAt') && !includeModelInfo?.isList && !includeModelInfo?.isRequired) {
          obj[key] = { where: { ...obj[key].where, deletedAt: null } };
        }
      }
    }
  }
  return obj;
}
