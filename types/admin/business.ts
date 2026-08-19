

export interface Business {
    id: string;
    businessName: string;
    legalName?: string;
    registrationNumber: string;
    taxPin: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    address?: string;
    city?: string;
    county?: string;
    country?: string;
    currency?: string;
    timezone?: string;
    logoPath?: string;
    receiptFooter?: string;
    invoiceTerms?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}