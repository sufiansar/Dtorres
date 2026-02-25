import HttpStatus from "http-status";
import AppError from "../errorHelpers/AppError";

type QueryParams = Record<string, any>;

export class PrismaQueryBuilder {
  private query: QueryParams;
  private prismaQuery: {
    where?: any;
    orderBy?: any;
    select?: any;
    skip?: number;
    take?: number;
  };

  constructor(query: QueryParams) {
    this.query = query;
    this.prismaQuery = {};
  }

  // ------------------------
  // Utility: smart cast value
  // ------------------------
  private castValue(value: any) {
    if (value === "true") return true;
    if (value === "false") return false;

    if (!isNaN(value)) return Number(value);

    // ISO date support
    if (!isNaN(Date.parse(value))) return new Date(value);

    return value;
  }

  filter(filterableFields?: string[]): this {
    const queryObj = { ...this.query };

    // remove non-filter params
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((f) => delete queryObj[f]);

    const where: Record<string, any> = {};

    const allowedOperators = ["gt", "gte", "lt", "lte", "equals", "in", "not"];

    for (const [field, value] of Object.entries(queryObj)) {
      // If whitelist exists → enforce it
      if (filterableFields && !filterableFields.includes(field)) continue;

      if (typeof value === "object" && value !== null) {
        where[field] = {};

        for (const [op, val] of Object.entries(value)) {
          if (!allowedOperators.includes(op)) {
            throw new AppError(
              HttpStatus.BAD_REQUEST,
              `Invalid operator: ${op}`,
            );
          }

          if (op === "in") {
            where[field][op] = String(val)
              .split(",")
              .map((v) => this.castValue(v));
          } else {
            where[field][op] = this.castValue(val);
          }
        }
      } else {
        where[field] = this.castValue(value);
      }
    }

    // merge safely with existing Prisma where (ex: search)
    this.prismaQuery.where = {
      ...(this.prismaQuery.where || {}),
      ...where,
    };

    return this;
  }

  // ------------------------
  // SEARCH
  // ------------------------
  search(searchableFields: string[]): this {
    const term = this.query.searchTerm;

    if (!term) return this;

    const or = searchableFields.map((field) => ({
      [field]: {
        contains: term,
        mode: "insensitive",
      },
    }));

    this.prismaQuery.where = {
      ...(this.prismaQuery.where || {}),
      OR: or,
    };

    return this;
  }

  // ------------------------
  // SORT
  // ------------------------
  sort(): this {
    const sort = this.query.sort || "-createdAt";

    const orderBy = sort.split(",").map((field: string) => {
      if (field.startsWith("-")) {
        return { [field.slice(1)]: "desc" };
      }
      return { [field]: "asc" };
    });

    this.prismaQuery.orderBy = orderBy;

    return this;
  }

  // ------------------------
  // SELECT FIELDS
  // ------------------------
  fields(): this {
    if (!this.query.fields) return this;

    const select: Record<string, boolean> = {};

    this.query.fields.split(",").forEach((f: string) => {
      select[f] = true;
    });

    this.prismaQuery.select = select;

    return this;
  }

  // ------------------------
  // PAGINATION
  // ------------------------
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.prismaQuery.skip = (page - 1) * limit;
    this.prismaQuery.take = limit;

    return this;
  }

  // ------------------------
  // BUILD
  // ------------------------
  build() {
    return this.prismaQuery;
  }

  // ------------------------
  // META DATA
  // ------------------------

  async getMeta(model: any) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const total = await model.count({
      where: this.prismaQuery.where,
    });

    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}
