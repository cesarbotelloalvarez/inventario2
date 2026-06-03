import { getDashboardData } from "@/lib/dashboard";
import { handleApiError, jsonOk } from "@/lib/api";
export async function GET() { try { return jsonOk(await getDashboardData()); } catch (e) { return handleApiError(e); } }
