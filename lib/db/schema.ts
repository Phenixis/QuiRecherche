import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  primaryKey,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable('users', {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  image: text("image"),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const ABTest = pgTable('ab_test', {
  name: varchar('name').primaryKey(),
  description: text('description').notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const ABTestResult = pgTable('ab_test_result', {
  id: serial('id').primaryKey(),
  testId: varchar('test_name')
    .notNull()
    .references(() => ABTest.name),
  userIP: varchar('user_ip', { length: 45 }).notNull(),
  variant: varchar('variant', { length: 50 }).notNull(),
  startingTime: timestamp('starting_time').notNull(),
  endingTime: timestamp('ending_time').notNull(),
})

export const ticket = pgTable('ticket', {
  id: serial('id').primaryKey(),
  openedBy: text("userId")
    .references(() => users.id, { onDelete: "cascade" }),
  openerEmail: varchar('opener_email', { length: 255 }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  closedAt: timestamp('closed_at'),
});

export const ticketComment = pgTable('ticket_comment', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id')
    .notNull()
    .references(() => ticket.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/* SPECIFIC TABLES */
export const university = pgTable('university', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const researcher = pgTable('researcher', {
  pid: varchar('pid', { length: 255 }).primaryKey(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  ORCID: varchar('ORCID', { length: 255 }).notNull(),
  scraped: integer('scraped').notNull().default(-2),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const affiliation = pgTable(
  'affiliation',
  {
    id: serial('id').primaryKey(),
    researcherPid: varchar('researcher_id', { length: 255 })
      .notNull()
      .references(() => researcher.pid, { onDelete: "cascade" }),
    universityId: integer('university_id')
      .notNull()
      .references(() => university.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  }
);

export const typePublication = pgTable('type_publication', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  abbreviation: varchar('abbreviation', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const universityContribution = pgTable('university_contribution', {
  id: serial('id').primaryKey(),
  universityId: integer('university_id')
    .notNull()
    .references(() => university.id, { onDelete: "cascade" }),
  paperId: integer('paper_id')
    .notNull()
    .references(() => paper.id, { onDelete: "cascade" }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const paper = pgTable('paper', {
  id: serial('id').primaryKey(),
  titre: varchar('titre', { length: 255 }).notNull(),
  typePublicationId: integer('type_publication_id')
    .notNull()
    .references(() => typePublication.id, { onDelete: "cascade" }),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  doi: varchar('doi', { length: 255 }),
  venue: varchar('venue', { length: 255 }),
  page_start: integer('page_start'),
  page_end: integer('page_end'),
  ee: varchar('ee', { length: 255 }), // Will now contain a link to the article on Hal or DBLP
  dblp_id: varchar('dblp_id', { length: 255 }),
  deletedAt: timestamp('deleted_at'),
});

export const article = pgTable('article', {
  id: serial('id').primaryKey(),
  paperId: integer('paper_id')
    .notNull()
    .references(() => paper.id, { onDelete: "cascade" }),
  volume: varchar('volume', { length: 100 }).notNull(),
  number: varchar('number', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const contribution = pgTable(
  'contribution',
  {
    id: serial('id').primaryKey(),
    researcherPid: varchar('researcher_id', { length: 255 })
      .notNull()
      .references(() => researcher.pid, { onDelete: "cascade" }),
    paperId: integer('paper_id')
      .notNull()
      .references(() => paper.id, { onDelete: "cascade" }),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  }
);

/* RELATIONS */

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  activityLogs: many(activityLogs),
  authenticators: many(authenticators),
  accounts: many(accounts),
  sessions: many(sessions),
  ticket: many(ticket),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const ABTestRelations = relations(ABTest, ({ many }) => ({
  results: many(ABTestResult),
}));

export const ABTestResultRelations = relations(ABTestResult, ({ one }) => ({
  test: one(ABTest, {
    fields: [ABTestResult.testId],
    references: [ABTest.name],
  }),
}));

export const TicketRelations = relations(ticket, ({ many }) => ({
  comments: many(ticketComment)
}));

export const TicketCommentRelations = relations(ticketComment, ({ one }) => ({
  ticket: one(ticket, {
    fields: [ticketComment.ticketId],
    references: [ticket.id],
  }),
  user: one(users, {
    fields: [ticketComment.userId],
    references: [users.id],
  }),
}));

/* SPECIFIC RELATIONS */

export const UniversityRelations = relations(university, ({ many }) => ({
  affiliations: many(affiliation),
  contributions: many(universityContribution),
}));

export const ResearcherRelations = relations(researcher, ({ many }) => ({
  affiliations: many(affiliation),
  contributions: many(contribution),
}));

export const AffiliationRelations = relations(affiliation, ({ one }) => ({
  university: one(university, {
    fields: [affiliation.universityId],
    references: [university.id],
  }),
  researcher: one(researcher, {
    fields: [affiliation.researcherPid],
    references: [researcher.pid],
  }),
}));

export const TypePublicationRelations = relations(typePublication, ({ many }) => ({
  papers: many(paper),
}));

export const PaperRelations = relations(paper, ({ one, many }) => ({
  typePublication: one(typePublication, {
    fields: [paper.typePublicationId],
    references: [typePublication.id],
  }),
  articles: many(article),
  contributions: many(contribution),
  universities: many(universityContribution),
}));

export const ArticleRelations = relations(article, ({ one }) => ({
  paper: one(paper, {
    fields: [article.paperId],
    references: [paper.id],
  }),
}));

export const ContributionRelations = relations(contribution, ({ one }) => ({
  researcher: one(researcher, {
    fields: [contribution.researcherPid],
    references: [researcher.pid],
  }),
  paper: one(paper, {
    fields: [contribution.paperId],
    references: [paper.id],
  }),
}));

export const UniversityContributionRelations = relations(universityContribution, ({ one }) => ({
  university: one(university, {
    fields: [universityContribution.universityId],
    references: [university.id],
  }),
  paper: one(paper, {
    fields: [universityContribution.paperId],
    references: [paper.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  })[];
};
export type ABTest = typeof ABTest.$inferSelect;
export type NewABTest = typeof ABTest.$inferInsert;
export type ABTestResult = typeof ABTestResult.$inferSelect;
export type NewABTestResult = typeof ABTestResult.$inferInsert;
export type Ticket = typeof ticket.$inferSelect;
export type NewTicket = typeof ticket.$inferInsert;
export type TicketComment = typeof ticketComment.$inferSelect;
export type NewTicketComment = typeof ticketComment.$inferInsert;

export type University = typeof university.$inferSelect;
export type NewUniversity = typeof university.$inferInsert;
export type Researcher = typeof researcher.$inferSelect;
export type NewResearcher = typeof researcher.$inferInsert;
export type Affiliation = typeof affiliation.$inferSelect;
export type NewAffiliation = typeof affiliation.$inferInsert;
export type TypePublication = typeof typePublication.$inferSelect;
export type NewTypePublication = typeof typePublication.$inferInsert;
export type Paper = typeof paper.$inferSelect;
export type NewPaper = typeof paper.$inferInsert;
export type Article = typeof article.$inferSelect;
export type NewArticle = typeof article.$inferInsert;
export type Contribution = typeof contribution.$inferSelect;
export type NewContribution = typeof contribution.$inferInsert;
export type UniversityContribution = typeof universityContribution.$inferSelect;
export type NewUniversityContribution = typeof universityContribution.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

export enum TicketStatus {
  OPEN = 'open',
  REVIEWING = 'reviewing',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}
