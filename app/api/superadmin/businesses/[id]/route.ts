import { auth } from "@/auth";
import {
  cancelBusinessSubscription,
  changeBusinessUserPassword,
  createBusinessUser,
  getBusinessProfileById,
  renewBusinessSubscription,
  updateBusinessDetails,
  updateBusinessStatus,
  upsertBusinessSubscription,
} from "@/db/queries/business";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

type SuperAdminSession = {
  user?: {
    roleName?: string;
    businessId?: string | null;
  };
} | null;

function isSuperAdmin(session: SuperAdminSession) {
  return session?.user?.roleName === "SUPERADMIN" || session?.user?.businessId === null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const business = await getBusinessProfileById(id);

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json({ data: business });
}

const profileActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("suspend"),
  }),
  z.object({
    action: z.literal("activate"),
  }),
  z.object({
    action: z.literal("editBusiness"),
    businessName: z.string().min(2),
    registrationNumber: z.string().min(1),
    taxPin: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    industry: z.string().optional(),
    status: z.enum(["trial", "active", "suspended", "expired"]),
    description: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    ownerName: z.string().optional(),
    ownerEmail: z.string().email().optional(),
    ownerPhone: z.string().optional(),
  }),
  z.object({
    action: z.literal("subscription"),
    plan: z.enum(["Trial", "Starter", "Professional", "Enterprise"]),
    billingCycle: z.enum(["monthly", "quartely", "semi-annual", "annual"]),
    price: z.coerce.number().int().min(0),
    renewalDate: z.string().optional(),
    expiryDate: z.string().optional(),
    autoRenewal: z.coerce.boolean(),
  }),
  z.object({
    action: z.literal("renew"),
    renewalDate: z.string().min(1),
    expiryDate: z.string().min(1),
    billingCycle: z.enum(["monthly", "quartely", "semi-annual", "annual"]),
    price: z.coerce.number().int().min(0),
  }),
  z.object({
    action: z.literal("cancelSubscription"),
  }),
  z.object({
    action: z.literal("inviteUser"),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    roleName: z.string().min(2).default("Team Member"),
    password: z.string().min(6),
  }),
  z.object({
    action: z.literal("changePassword"),
    userId: z.string().min(1),
    password: z.string().min(6),
  }),
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = profileActionSchema.parse(await request.json());

    if (payload.action === "suspend") {
      return NextResponse.json({ data: await updateBusinessStatus(id, "suspended") });
    }

    if (payload.action === "activate") {
      return NextResponse.json({ data: await updateBusinessStatus(id, "active") });
    }

    if (payload.action === "editBusiness") {
      return NextResponse.json({
        data: await updateBusinessDetails({
          id,
          businessName: payload.businessName,
          registrationNumber: payload.registrationNumber,
          taxPin: payload.taxPin,
          email: payload.email,
          phone: payload.phone,
          industry: payload.industry,
          status: payload.status,
          description: payload.description,
          country: payload.country,
          city: payload.city,
          address: payload.address,
          ownerName: payload.ownerName,
          ownerEmail: payload.ownerEmail,
          ownerPhone: payload.ownerPhone,
        }),
      });
    }

    if (payload.action === "subscription") {
      return NextResponse.json({
        data: await upsertBusinessSubscription({
          businessId: id,
          plan: payload.plan,
          billingCycle: payload.billingCycle,
          price: payload.price,
          renewalDate: payload.renewalDate,
          expiryDate: payload.expiryDate,
          autoRenewal: payload.autoRenewal,
        }),
      });
    }

    if (payload.action === "renew") {
      return NextResponse.json({
        data: await renewBusinessSubscription({
          businessId: id,
          renewalDate: payload.renewalDate,
          expiryDate: payload.expiryDate,
          billingCycle: payload.billingCycle,
          price: payload.price,
        }),
      });
    }

    if (payload.action === "cancelSubscription") {
      return NextResponse.json({ data: await cancelBusinessSubscription(id) });
    }

    if (payload.action === "changePassword") {
      const passwordHash = await bcrypt.hash(payload.password, 10);
      return NextResponse.json({
        data: await changeBusinessUserPassword({
          businessId: id,
          userId: payload.userId,
          passwordHash,
        }),
      });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    return NextResponse.json({
      data: await createBusinessUser({
        businessId: id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        roleName: payload.roleName,
        passwordHash,
      }),
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update business profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
