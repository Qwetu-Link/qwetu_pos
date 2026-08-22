import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { invoiceTable } from "@/db/schema/invoice";
import { paymentTable, transactionTable } from "@/db/schema/payments";
import { roleTable } from "@/db/schema/roles";
import { subscriptionTable } from "@/db/schema/subscription";
import { usersTable } from "@/db/schema/users";
import { locationTable } from "@/db/schema/variants";
import { BusinessFormValues } from "@/db/schema/validators/business";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createBusiness(data: BusinessFormValues) {
  const id = randomUUID();
  const { password: _password, confirmPassword: _confirmPassword, ...businessData } = data;

  await db
    .insert(businessTable)
    .values({ id, ...businessData });

  return getBusinessById(id);
}

export async function getBusinesses() {
  const businesses = await db
    .select()
    .from(businessTable)
    .orderBy(desc(businessTable.createdAt));

  return withOwnerDetails(businesses);
}

export async function getBusinessById(id: string) {
  const [business] = await db
    .select()
    .from(businessTable)
    .where(eq(businessTable.id, id))
    .limit(1);

  if (!business) {
    return null;
  }

  const [businessWithOwner] = await withOwnerDetails([business]);
  return businessWithOwner;
}

export async function getBusinessProfileById(id: string) {
  const business = await getBusinessById(id);
  if (!business) {
    return null;
  }

  const [users, locations, payments, subscription, revenue] = await Promise.all([
    getBusinessUsers(id),
    getBusinessLocations(id),
    getBusinessPayments(id),
    getBusinessSubscription(id),
    getBusinessRevenueSummary(id),
  ]);

  const activity = [
    {
      id: `${business.id}-created`,
      title: "Business created",
      description: `${business.businessName} was registered on the platform.`,
      date: business.createdAt,
      actor: business.ownerName ?? "System",
    },
    ...(subscription
      ? [{
        id: `${subscription.id}-subscription`,
        title: "Subscription updated",
        description: `${subscription.plan} plan is ${subscription.status ?? "active"}.`,
        date: subscription.updatedAt,
        actor: "Super Admin",
      }]
      : []),
    ...users.slice(0, 4).map((user) => ({
      id: `${user.id}-user`,
      title: "User added",
      description: `${user.name} was added as ${user.role ?? "Team Member"}.`,
      date: user.createdAt,
      actor: business.ownerName ?? "Super Admin",
    })),
    ...locations.slice(0, 4).map((location) => ({
      id: `${location.id}-location`,
      title: "Location added",
      description: `${location.name} was added as a business location.`,
      date: location.createdAt,
      actor: "System",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    business: {
      ...business,
      users: users.length,
      branches: locations.length,
    },
    users,
    branches: locations,
    payments,
    subscription,
    revenue,
    activity,
  };
}

export async function updateBusinessStatus(id: string, status: "trial" | "active" | "suspended" | "expired") {
  await db
    .update(businessTable)
    .set({
      status,
      isActive: status === "trial" || status === "active",
    })
    .where(eq(businessTable.id, id));

  return getBusinessProfileById(id);
}

export async function updateBusinessDetails(data: {
  id: string;
  businessName: string;
  registrationNumber: string;
  taxPin: string;
  email: string;
  phone: string;
  industry?: string;
  status: "trial" | "active" | "suspended" | "expired";
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}) {
  const owner = await getPrimaryBusinessOwner(data.id);

  await db.transaction(async (tx) => {
    await tx
      .update(businessTable)
      .set({
        businessName: data.businessName,
        registrationNumber: data.registrationNumber,
        taxPin: data.taxPin,
        email: data.email,
        phone: data.phone,
        industry: data.industry,
        status: data.status,
        description: data.description,
        country: data.country,
        city: data.city,
        address: data.address,
        isActive: data.status === "trial" || data.status === "active",
      })
      .where(eq(businessTable.id, data.id));

    if (owner && (data.ownerName || data.ownerEmail || data.ownerPhone)) {
      const [firstName, ...lastNameParts] = (data.ownerName || owner.name || "").trim().split(/\s+/);
      await tx
        .update(usersTable)
        .set({
          name: data.ownerName || owner.name,
          firstName: firstName || owner.firstName,
          lastName: lastNameParts.join(" ") || owner.lastName,
          email: data.ownerEmail || owner.email,
          phone: data.ownerPhone || owner.phone,
        })
        .where(eq(usersTable.id, owner.id));
    }
  });

  return getBusinessProfileById(data.id);
}

export async function upsertBusinessSubscription(data: {
  businessId: string;
  plan: "Trial" | "Starter" | "Professional" | "Enterprise";
  billingCycle: "monthly" | "quartely" | "semi-annual" | "annual";
  price: number;
  renewalDate?: string;
  expiryDate?: string;
  autoRenewal: boolean;
}) {
  const existing = await getBusinessSubscription(data.businessId);

  if (existing) {
    await db
      .update(subscriptionTable)
      .set({
        plan: data.plan,
        billingCycle: data.billingCycle,
        price: data.price,
        renewalDate: data.renewalDate,
        expiryDate: data.expiryDate,
        autoRenewal: data.autoRenewal,
        paymentStatus: "pending",
        status: "active",
        description: `${data.plan} subscription`,
      })
      .where(eq(subscriptionTable.id, existing.id));
  } else {
    await db.insert(subscriptionTable).values({
      id: randomUUID(),
      businessId: data.businessId,
      plan: data.plan,
      billingCycle: data.billingCycle,
      price: data.price,
      renewalDate: data.renewalDate,
      expiryDate: data.expiryDate,
      autoRenewal: data.autoRenewal,
      paymentStatus: "pending",
      status: "active",
      description: `${data.plan} subscription`,
    });
  }

  await db
    .update(businessTable)
    .set({
      plan: data.plan.toLowerCase() as "trial" | "starter" | "professional" | "enterprise",
      status: "active",
      isActive: true,
    })
    .where(eq(businessTable.id, data.businessId));

  return getBusinessProfileById(data.businessId);
}

export async function renewBusinessSubscription(data: {
  businessId: string;
  renewalDate: string;
  expiryDate: string;
  billingCycle: "monthly" | "quartely" | "semi-annual" | "annual";
  price: number;
}) {
  const existing = await getBusinessSubscription(data.businessId);
  if (!existing) {
    throw new Error("No subscription exists for this business.");
  }

  await db
    .update(subscriptionTable)
    .set({
      renewalDate: data.renewalDate,
      expiryDate: data.expiryDate,
      billingCycle: data.billingCycle,
      price: data.price,
      paymentStatus: "pending",
      status: "active",
    })
    .where(eq(subscriptionTable.id, existing.id));

  await updateBusinessStatus(data.businessId, "active");
  return getBusinessProfileById(data.businessId);
}

export async function cancelBusinessSubscription(businessId: string) {
  const existing = await getBusinessSubscription(businessId);
  if (existing) {
    await db
      .update(subscriptionTable)
      .set({
        status: "cancelled",
        autoRenewal: false,
      })
      .where(eq(subscriptionTable.id, existing.id));
  }

  await updateBusinessStatus(businessId, "expired");
  return getBusinessProfileById(businessId);
}

export async function createBusinessUser(data: {
  businessId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  roleName: string;
}) {
  const [existingRole] = await db
    .select()
    .from(roleTable)
    .where(and(eq(roleTable.businessId, data.businessId), eq(roleTable.name, data.roleName)))
    .limit(1);

  const roleId = existingRole?.id ?? randomUUID();

  if (!existingRole) {
    await db.insert(roleTable).values({
      id: roleId,
      businessId: data.businessId,
      name: data.roleName,
    });
  }

  await db.insert(usersTable).values({
    id: randomUUID(),
    name: `${data.firstName} ${data.lastName}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    businessId: data.businessId,
    roleId,
    passwordHash: data.passwordHash,
    isActive: true,
  });

  return getBusinessProfileById(data.businessId);
}

export async function changeBusinessUserPassword(data: {
  businessId: string;
  userId: string;
  passwordHash: string;
}) {
  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(and(eq(usersTable.id, data.userId), eq(usersTable.businessId, data.businessId)))
    .limit(1);

  if (!user) {
    throw new Error("User does not belong to this business.");
  }

  await db
    .update(usersTable)
    .set({ passwordHash: data.passwordHash })
    .where(and(eq(usersTable.id, data.userId), eq(usersTable.businessId, data.businessId)));

  return getBusinessProfileById(data.businessId);
}

async function withOwnerDetails<T extends { id: string }>(businesses: T[]) {
  if (businesses.length === 0) {
    return [];
  }

  const businessIds = businesses.map((business) => business.id);
  const owners = await db
    .select({
      id: usersTable.id,
      businessId: usersTable.businessId,
      name: usersTable.name,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      phone: usersTable.phone,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(inArray(usersTable.businessId, businessIds))
    .orderBy(usersTable.createdAt);

  const ownersByBusinessId = new Map(
    owners
      .filter((owner) => owner.businessId)
      .map((owner) => [
        owner.businessId,
        {
          ownerId: owner.id,
          ownerName: owner.name || [owner.firstName, owner.lastName].filter(Boolean).join(" ") || null,
          ownerEmail: owner.email,
          ownerPhone: owner.phone,
        },
      ])
  );

  return businesses.map((business) => ({
    ...business,
    ...ownersByBusinessId.get(business.id),
  }));
}

async function getPrimaryBusinessOwner(businessId: string) {
  const [owner] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      phone: usersTable.phone,
    })
    .from(usersTable)
    .where(eq(usersTable.businessId, businessId))
    .orderBy(usersTable.createdAt)
    .limit(1);

  return owner ?? null;
}

async function getBusinessUsers(businessId: string) {
  const rows = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      phone: usersTable.phone,
      isActive: usersTable.isActive,
      createdAt: usersTable.createdAt,
      role: roleTable.name,
    })
    .from(usersTable)
    .leftJoin(roleTable, eq(roleTable.id, usersTable.roleId))
    .where(eq(usersTable.businessId, businessId))
    .orderBy(desc(usersTable.createdAt));

  return rows.map((user) => {
    const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    return {
      ...user,
      name,
      avatar: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      status: user.isActive ? "active" : "inactive",
    };
  });
}

async function getBusinessLocations(businessId: string) {
  return db
    .select({
      id: locationTable.id,
      name: locationTable.name,
      status: sql<string>`case when ${locationTable.stock} <= ${locationTable.reorderPoint} then 'low' else 'active' end`,
      location: locationTable.name,
      manager: sql<string>`'Unassigned'`,
      phone: sql<string>`''`,
      users: sql<number>`0`,
      stock: locationTable.stock,
      reorderPoint: locationTable.reorderPoint,
      createdAt: locationTable.createdAt,
    })
    .from(locationTable)
    .where(eq(locationTable.businessId, businessId))
    .orderBy(desc(locationTable.createdAt));
}

async function getBusinessPayments(businessId: string) {
  const rows = await db
    .select({
      id: paymentTable.id,
      invoice: invoiceTable.invoiceNumber,
      amount: paymentTable.amount,
      status: paymentTable.status,
      method: transactionTable.paymentMethod,
      date: paymentTable.paidAt,
      description: paymentTable.notes,
      reference: transactionTable.reference,
    })
    .from(paymentTable)
    .leftJoin(invoiceTable, eq(invoiceTable.id, paymentTable.invoiceId))
    .leftJoin(transactionTable, eq(transactionTable.paymentId, paymentTable.id))
    .where(eq(paymentTable.businessId, businessId))
    .orderBy(desc(paymentTable.paidAt));

  return rows.map((payment) => ({
    ...payment,
    invoice: payment.invoice ?? payment.reference ?? payment.id,
    method: payment.method ?? "cash",
    description: payment.description ?? "Business payment",
  }));
}

async function getBusinessSubscription(businessId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.businessId, businessId))
    .orderBy(desc(subscriptionTable.updatedAt))
    .limit(1);

  return subscription ?? null;
}

async function getBusinessRevenueSummary(businessId: string) {
  const [summary] = await db
    .select({
      paid: sql<number>`coalesce(sum(case when ${paymentTable.status} = 'completed' then ${paymentTable.amount} else 0 end), 0)`,
      pending: sql<number>`coalesce(sum(case when ${paymentTable.status} = 'pending' then ${paymentTable.amount} else 0 end), 0)`,
      invoices: sql<number>`count(${paymentTable.id})`,
    })
    .from(paymentTable)
    .where(eq(paymentTable.businessId, businessId));

  return {
    paid: Number(summary?.paid ?? 0),
    pending: Number(summary?.pending ?? 0),
    invoices: Number(summary?.invoices ?? 0),
  };
}
