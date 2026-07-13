import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const BACKUP_FORMAT = "portfolio-database-backup"
export const BACKUP_VERSION = 1

export const collectionNames = [
  "accounts",
  "sessions",
  "users",
  "verificationTokens",
  "educations",
  "projects",
  "blogs",
  "certifications",
  "companies",
  "positions",
  "clients",
  "contactQueries",
  "contactQueryReplies",
  "activities",
] as const

export type CollectionName = (typeof collectionNames)[number]
type JsonRecord = Record<string, unknown>
type BackupCollections = Record<CollectionName, JsonRecord[]>
type DatabaseClient = typeof prisma | Prisma.TransactionClient

const collectionModels: Record<CollectionName, string> = {
  accounts: "Account",
  sessions: "Session",
  users: "User",
  verificationTokens: "VerificationToken",
  educations: "Education",
  projects: "Project",
  blogs: "Blog",
  certifications: "Certification",
  companies: "Company",
  positions: "Position",
  clients: "Client",
  contactQueries: "ContactQuery",
  contactQueryReplies: "ContactQueryReply",
  activities: "Activity",
}

export interface DatabaseBackup {
  format: typeof BACKUP_FORMAT
  version: typeof BACKUP_VERSION
  exportedAt: string
  collections: BackupCollections
}

export class BackupValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("The backup file is invalid")
    this.name = "BackupValidationError"
  }
}

export class StandaloneRestoreError extends Error {
  constructor(
    public readonly restoreError: unknown,
    public readonly recoverySucceeded: boolean,
    public readonly recoveryError?: unknown
  ) {
    super(
      recoverySucceeded
        ? "Standalone restore failed and the previous data was recovered"
        : "Standalone restore and recovery both failed"
    )
    this.name = "StandaloneRestoreError"
  }
}

const objectIdPattern = /^[a-f\d]{24}$/i

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const enumValues = new Map(
  Prisma.dmmf.datamodel.enums.map((item) => [
    item.name,
    new Set(item.values.map((value) => value.name)),
  ])
)

const validatePrimitive = (value: unknown, type: string): boolean => {
  switch (type) {
    case "String":
      return typeof value === "string"
    case "Boolean":
      return typeof value === "boolean"
    case "Int":
      return typeof value === "number" && Number.isInteger(value)
    case "Float":
    case "Decimal":
      return typeof value === "number" && Number.isFinite(value)
    case "BigInt":
      return typeof value === "bigint" || (typeof value === "string" && /^-?\d+$/.test(value))
    case "DateTime":
      return (
        (typeof value === "string" || value instanceof Date) &&
        !Number.isNaN(new Date(value).getTime())
      )
    case "Json":
      return true
    default:
      return false
  }
}

const validateModelRecords = (
  issues: string[],
  records: JsonRecord[],
  collection: CollectionName
) => {
  const modelName = collectionModels[collection]
  const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName)
  if (!model) {
    issues.push(`No Prisma model metadata was found for ${collection}`)
    return
  }

  const fields = model.fields.filter((field) => field.kind !== "object")
  const allowedFields = new Set(fields.map((field) => field.name))

  records.forEach((record, index) => {
    Object.keys(record).forEach((field) => {
      if (!allowedFields.has(field)) {
        issues.push(`${collection}[${index}].${field} is not a recognized database field`)
      }
    })

    fields.forEach((field) => {
      const value = record[field.name]
      if (value === undefined) {
        if (field.isRequired) {
          issues.push(`${collection}[${index}].${field.name} is required`)
        }
        return
      }
      if (value === null) {
        if (field.isRequired) {
          issues.push(`${collection}[${index}].${field.name} cannot be null`)
        }
        return
      }

      const values = field.isList ? value : [value]
      if (!Array.isArray(values)) {
        issues.push(`${collection}[${index}].${field.name} must be an array`)
        return
      }

      values.forEach((item, valueIndex) => {
        const path = `${collection}[${index}].${field.name}${field.isList ? `[${valueIndex}]` : ""}`
        if (field.kind === "enum") {
          if (typeof item !== "string" || !enumValues.get(field.type)?.has(item)) {
            issues.push(`${path} is not a valid ${field.type} value`)
          }
        } else if (!validatePrimitive(item, field.type)) {
          issues.push(`${path} must be a valid ${field.type} value`)
        }

        if (field.nativeType?.[0] === "ObjectId") {
          if (typeof item !== "string" || !objectIdPattern.test(item)) {
            issues.push(`${path} must be a valid ObjectId`)
          }
        }
      })
    })
  })
}

const duplicateIssues = (
  records: JsonRecord[],
  collection: CollectionName,
  fields: string[]
): string[] => {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  records.forEach((record) => {
    const values = fields.map((field) => record[field])
    if (values.some((value) => value === null || value === undefined)) return
    const key = JSON.stringify(values)
    if (seen.has(key)) duplicates.add(key)
    seen.add(key)
  })

  return [...duplicates].map(
    (key) => `${collection} contains a duplicate ${fields.join(" + ")} value: ${key}`
  )
}

const validateForeignKey = (
  issues: string[],
  records: JsonRecord[],
  collection: CollectionName,
  field: string,
  validIds: Set<string>,
  target: string,
  optional = false
) => {
  records.forEach((record, index) => {
    const value = record[field]
    if (optional && (value === null || value === undefined)) return
    if (typeof value !== "string" || !objectIdPattern.test(value)) {
      issues.push(`${collection}[${index}].${field} must be a valid ObjectId`)
    } else if (!validIds.has(value)) {
      issues.push(`${collection}[${index}].${field} references a missing ${target}: ${value}`)
    }
  })
}

const idsFor = (
  issues: string[],
  records: JsonRecord[],
  collection: CollectionName
): Set<string> => {
  const ids = new Set<string>()
  records.forEach((record, index) => {
    const id = record.id
    if (typeof id !== "string" || !objectIdPattern.test(id)) {
      issues.push(`${collection}[${index}].id must be a valid ObjectId`)
    } else if (ids.has(id)) {
      issues.push(`${collection} contains duplicate id: ${id}`)
    } else {
      ids.add(id)
    }
  })
  return ids
}

export const parseAndValidateBackup = (input: unknown): DatabaseBackup => {
  const issues: string[] = []

  if (!isRecord(input)) {
    throw new BackupValidationError(["The JSON root must be an object"])
  }
  if (input.format !== BACKUP_FORMAT) {
    issues.push(`format must be "${BACKUP_FORMAT}"`)
  }
  if (input.version !== BACKUP_VERSION) {
    issues.push(`version must be ${BACKUP_VERSION}`)
  }
  if (!isRecord(input.collections)) {
    throw new BackupValidationError([...issues, "collections must be an object"])
  }

  const collections = {} as BackupCollections
  for (const name of collectionNames) {
    const value = input.collections[name]
    if (!Array.isArray(value)) {
      issues.push(`collections.${name} must be an array`)
      collections[name] = []
      continue
    }
    collections[name] = value.filter((item, index): item is JsonRecord => {
      if (!isRecord(item)) {
        issues.push(`${name}[${index}] must be an object`)
        return false
      }
      return true
    })
    validateModelRecords(issues, collections[name], name)
  }

  const ids = {} as Record<CollectionName, Set<string>>
  for (const name of collectionNames) {
    ids[name] = idsFor(issues, collections[name], name)
  }

  validateForeignKey(issues, collections.accounts, "accounts", "userId", ids.users, "user")
  validateForeignKey(issues, collections.sessions, "sessions", "userId", ids.users, "user")
  validateForeignKey(issues, collections.positions, "positions", "company", ids.companies, "company")
  validateForeignKey(issues, collections.blogs, "blogs", "projectId", ids.projects, "project", true)
  validateForeignKey(
    issues,
    collections.contactQueryReplies,
    "contactQueryReplies",
    "queryId",
    ids.contactQueries,
    "contact query"
  )
  validateForeignKey(issues, collections.activities, "activities", "userId", ids.users, "user")

  collections.projects.forEach((project, index) => {
    const value = project.associatedWith
    if (value === null || value === undefined) return
    if (typeof value !== "string" || !objectIdPattern.test(value)) {
      issues.push(`projects[${index}].associatedWith must be a valid ObjectId`)
      return
    }
    const matchingCollections = [
      ids.educations.has(value),
      ids.companies.has(value),
      ids.certifications.has(value),
      ids.clients.has(value),
    ].filter(Boolean).length
    if (matchingCollections === 0) {
      issues.push(
        `projects[${index}].associatedWith references a missing education, company, certification, or client: ${value}`
      )
    } else if (matchingCollections > 1) {
      issues.push(
        `projects[${index}].associatedWith is ambiguous because ${value} exists in multiple associated collections`
      )
    }
  })

  const uniqueChecks: Array<[CollectionName, string[]]> = [
    ["users", ["email"]],
    ["accounts", ["provider", "providerAccountId"]],
    ["sessions", ["sessionToken"]],
    ["verificationTokens", ["token"]],
    ["verificationTokens", ["identifier", "token"]],
    ["projects", ["slug"]],
    ["blogs", ["projectId"]],
    ["certifications", ["title", "issuer"]],
    ["companies", ["name"]],
  ]
  uniqueChecks.forEach(([collection, fields]) => {
    issues.push(...duplicateIssues(collections[collection], collection, fields))
  })

  for (const name of collectionNames) {
    const modelName = collectionModels[name]
    const fields = Prisma.dmmf.datamodel.models
      .find((item) => item.name === modelName)
      ?.fields.filter((field) => field.kind === "scalar" && field.type === "DateTime")
      .map((field) => field.name) ?? []
    collections[name] = collections[name].map((record, index) => {
      const hydrated = { ...record }
      fields.forEach((field) => {
        const value = hydrated[field]
        if (value === null || value === undefined) return
        if (typeof value !== "string" && !(value instanceof Date)) {
          issues.push(`${name}[${index}].${field} must be an ISO date string`)
          return
        }
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) {
          issues.push(`${name}[${index}].${field} is not a valid date`)
        } else {
          hydrated[field] = date
        }
      })
      return hydrated
    })
  }

  if (issues.length > 0) throw new BackupValidationError(issues)

  const exportedAt = typeof input.exportedAt === "string" ? new Date(input.exportedAt) : null
  if (!exportedAt || Number.isNaN(exportedAt.getTime())) {
    throw new BackupValidationError(["exportedAt must be a valid ISO date string"])
  }

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    collections,
  }
}

export const exportDatabase = async (client: DatabaseClient = prisma): Promise<DatabaseBackup> => {
  const [
    accounts,
    sessions,
    users,
    verificationTokens,
    educations,
    projects,
    blogs,
    certifications,
    companies,
    positions,
    clients,
    contactQueries,
    contactQueryReplies,
    activities,
  ] = await Promise.all([
    client.account.findMany(),
    client.session.findMany(),
    client.user.findMany(),
    client.verificationToken.findMany(),
    client.education.findMany(),
    client.project.findMany(),
    client.blog.findMany(),
    client.certification.findMany(),
    client.company.findMany(),
    client.position.findMany(),
    client.client.findMany(),
    client.contactQuery.findMany(),
    client.contactQueryReply.findMany(),
    client.activity.findMany(),
  ])

  return JSON.parse(
    JSON.stringify({
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      collections: {
        accounts,
        sessions,
        users,
        verificationTokens,
        educations,
        projects,
        blogs,
        certifications,
        companies,
        positions,
        clients,
        contactQueries,
        contactQueryReplies,
        activities,
      },
    })
  ) as DatabaseBackup
}

const createIfPresent = async (data: JsonRecord[], create: () => Promise<unknown>) => {
  if (data.length > 0) await create()
}

const clearDatabase = async (client: DatabaseClient) => {
  await client.contactQueryReply.deleteMany()
  await client.activity.deleteMany()
  await client.session.deleteMany()
  await client.account.deleteMany()
  await client.blog.deleteMany()
  await client.project.deleteMany()
  await client.position.deleteMany()
  await client.contactQuery.deleteMany()
  await client.education.deleteMany()
  await client.certification.deleteMany()
  await client.company.deleteMany()
  await client.client.deleteMany()
  await client.verificationToken.deleteMany()
  await client.user.deleteMany()
}

type DatamodelField = (typeof Prisma.dmmf.datamodel.models)[number]["fields"][number]

const toMongoValue = (
  value: unknown,
  field: DatamodelField
): Prisma.InputJsonValue => {
  if (field.nativeType?.[0] === "ObjectId") {
    return { $oid: value as string }
  }
  if (field.type === "DateTime") {
    return { $date: (value as Date).toISOString() }
  }
  if (field.type === "BigInt") {
    return { $numberLong: String(value) }
  }
  return value as Prisma.InputJsonValue
}

const toMongoDocument = (
  collection: CollectionName,
  record: JsonRecord
): Prisma.InputJsonObject => {
  const modelName = collectionModels[collection]
  const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName)
  if (!model) throw new Error(`No Prisma model metadata was found for ${collection}`)

  return Object.fromEntries(
    model.fields
      .filter((field) => field.kind !== "object" && record[field.name] !== undefined)
      .map((field) => {
        const value = record[field.name]
        const mongoValue = field.isList
          ? (value as unknown[]).map((item) => toMongoValue(item, field))
          : value === null
            ? null
            : toMongoValue(value, field)
        return [field.dbName ?? field.name, mongoValue]
      })
  ) as Prisma.InputJsonObject
}

const assertMongoCommandSucceeded = (result: Prisma.JsonObject, operation: string) => {
  const writeErrors = result.writeErrors
  if (
    result.ok !== 1 ||
    (Array.isArray(writeErrors) && writeErrors.length > 0) ||
    result.writeConcernError
  ) {
    throw new Error(`Raw MongoDB ${operation} command failed`)
  }
}

const rawClearDatabase = async () => {
  // Raw MongoDB commands bypass Prisma's transaction-dependent relation emulation.
  for (const collection of collectionNames) {
    const modelName = collectionModels[collection]
    const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName)
    if (!model) throw new Error(`No Prisma model metadata was found for ${collection}`)
    const result = await prisma.$runCommandRaw({
      delete: model.dbName ?? model.name,
      deletes: [{ q: {}, limit: 0 }],
    })
    assertMongoCommandSucceeded(result, `delete ${model.name}`)
  }
}

const rawInsertDatabase = async (collections: BackupCollections) => {
  const maxBatchBytes = 8 * 1024 * 1024

  for (const collection of collectionNames) {
    const records = collections[collection]
    if (records.length === 0) continue

    const modelName = collectionModels[collection]
    const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName)
    if (!model) throw new Error(`No Prisma model metadata was found for ${collection}`)

    let batch: Prisma.InputJsonObject[] = []
    let batchBytes = 0
    const insertBatch = async () => {
      if (batch.length === 0) return
      const result = await prisma.$runCommandRaw({
        insert: model.dbName ?? model.name,
        documents: batch,
        ordered: true,
      })
      assertMongoCommandSucceeded(result, `insert ${model.name}`)
      batch = []
      batchBytes = 0
    }

    for (const record of records) {
      const document = toMongoDocument(collection, record)
      const documentBytes = Buffer.byteLength(JSON.stringify(document), "utf8")
      if (batch.length > 0 && batchBytes + documentBytes > maxBatchBytes) {
        await insertBatch()
      }
      batch.push(document)
      batchBytes += documentBytes
    }
    await insertBatch()
  }
}

const insertDatabase = async (client: DatabaseClient, c: BackupCollections) => {
  await createIfPresent(c.users, () =>
    client.user.createMany({ data: c.users as unknown as Prisma.UserCreateManyInput[] })
  )
  await createIfPresent(c.verificationTokens, () =>
    client.verificationToken.createMany({
      data: c.verificationTokens as unknown as Prisma.VerificationTokenCreateManyInput[],
    })
  )
  await createIfPresent(c.educations, () =>
    client.education.createMany({
      data: c.educations as unknown as Prisma.EducationCreateManyInput[],
    })
  )
  await createIfPresent(c.certifications, () =>
    client.certification.createMany({
      data: c.certifications as unknown as Prisma.CertificationCreateManyInput[],
    })
  )
  await createIfPresent(c.companies, () =>
    client.company.createMany({
      data: c.companies as unknown as Prisma.CompanyCreateManyInput[],
    })
  )
  await createIfPresent(c.clients, () =>
    client.client.createMany({ data: c.clients as unknown as Prisma.ClientCreateManyInput[] })
  )
  await createIfPresent(c.contactQueries, () =>
    client.contactQuery.createMany({
      data: c.contactQueries as unknown as Prisma.ContactQueryCreateManyInput[],
    })
  )
  await createIfPresent(c.projects, () =>
    client.project.createMany({
      data: c.projects as unknown as Prisma.ProjectCreateManyInput[],
    })
  )
  await createIfPresent(c.positions, () =>
    client.position.createMany({
      data: c.positions as unknown as Prisma.PositionCreateManyInput[],
    })
  )
  await createIfPresent(c.blogs, () =>
    client.blog.createMany({ data: c.blogs as unknown as Prisma.BlogCreateManyInput[] })
  )
  await createIfPresent(c.accounts, () =>
    client.account.createMany({ data: c.accounts as unknown as Prisma.AccountCreateManyInput[] })
  )
  await createIfPresent(c.sessions, () =>
    client.session.createMany({ data: c.sessions as unknown as Prisma.SessionCreateManyInput[] })
  )
  await createIfPresent(c.contactQueryReplies, () =>
    client.contactQueryReply.createMany({
      data: c.contactQueryReplies as unknown as Prisma.ContactQueryReplyCreateManyInput[],
    })
  )
  await createIfPresent(c.activities, () =>
    client.activity.createMany({
      data: c.activities as unknown as Prisma.ActivityCreateManyInput[],
    })
  )
}

const collectionCounts = (c: BackupCollections): Record<CollectionName, number> =>
  Object.fromEntries(collectionNames.map((name) => [name, c[name].length])) as Record<
    CollectionName,
    number
  >

export const replaceDatabase = async (backup: DatabaseBackup): Promise<Record<CollectionName, number>> => {
  const c = backup.collections

  await prisma.$transaction(
    async (tx) => {
      await clearDatabase(tx)
      await insertDatabase(tx, c)
    },
    { maxWait: 10_000, timeout: 120_000 }
  )

  return collectionCounts(c)
}

export const replaceDatabaseStandalone = async (
  backup: DatabaseBackup
): Promise<Record<CollectionName, number>> => {
  // Hydration is required because exportDatabase serializes dates for a portable JSON snapshot.
  const recoverySnapshot = parseAndValidateBackup(await exportDatabase())

  try {
    await rawClearDatabase()
    await rawInsertDatabase(backup.collections)
    return collectionCounts(backup.collections)
  } catch (restoreError) {
    try {
      await rawClearDatabase()
      await rawInsertDatabase(recoverySnapshot.collections)
    } catch (recoveryError) {
      throw new StandaloneRestoreError(restoreError, false, recoveryError)
    }
    throw new StandaloneRestoreError(restoreError, true)
  }
}
