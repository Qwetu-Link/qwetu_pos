"use server";

import { revalidatePath } from "next/cache";
import { createBusiness } from "@/db/queries/business";
import { businessSchema } from "@/validators/business";


export async function createBusinessAction(
    formData: FormData
) {
    const values = Object.fromEntries(formData);

    const parsed =
        businessSchema.safeParse(values);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const business =
        await createBusiness(parsed.data);

    revalidatePath("/dashboard/business");

    return {
        success: true,
        data: business,
    };
}