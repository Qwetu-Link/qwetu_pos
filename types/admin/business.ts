

export interface Business {
    id: string;
    businessName: string;
    legalName?: string;
    registrationNumber: string;
    taxPin: string;
    email: string;
    phone: string;
    ownerId?: string | null;
    ownerName?: string | null;
    ownerEmail?: string | null;
    ownerPhone?: string | null;
    alternativePhone?: string;
    address?: string;
    city?: string;
    county?: string;
    country?: string;
    currency?: string;
    timezone?: string;
    logoPath?: string;
    plan:string;
    status:string;
    description?:string;
    industry?:string;
    whatsappStatus: boolean;
    receiptFooter?: string;
    invoiceTerms?: string;
    users:number;
    branches:number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
