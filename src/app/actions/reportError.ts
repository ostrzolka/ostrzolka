"use server";

import { supabaseAdmin } from "@/lib/supabase";

export type ReportErrorResult = {
    success: boolean;
    error?: string;
};

export async function reportError(formData: FormData): Promise<ReportErrorResult> {
    try {
        const objectId = formData.get("objectId") as string;
        const objectType = formData.get("objectType") as string;
        const objectName = formData.get("objectName") as string;
        const message = formData.get("message") as string;

        if (!objectId || !objectType || !objectName || !message) {
            return { success: false, error: "Brak wymaganych danych." };
        }

        if (message.trim().length === 0) {
            return { success: false, error: "Wiadomość nie może być pusta." };
        }

        const { error } = await supabaseAdmin
            .from("error_reports")
            .insert({
                object_id: objectId,
                object_type: objectType,
                object_name: objectName,
                message: message.trim(),
            });

        if (error) {
            console.error("Supabase insert error:", error);
            return { success: false, error: "Wystąpił błąd podczas wysyłania zgłoszenia." };
        }

        return { success: true };
    } catch (err) {
        console.error("Server action error:", err);
        return { success: false, error: "Wystąpił nieoczekiwany błąd." };
    }
}
