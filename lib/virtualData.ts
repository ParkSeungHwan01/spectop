import companyProfilesRaw from '@/data/company-profiles.json';
import virtualCandidatesRaw from '@/data/virtual-candidates.json';
import { CompanyProfile, TargetCompanyId, VirtualCandidate } from './types';

const COMPANY_PROFILES = companyProfilesRaw as CompanyProfile[];
const VIRTUAL_CANDIDATES = virtualCandidatesRaw as VirtualCandidate[];

export function getCompanyProfile(companyId: TargetCompanyId): CompanyProfile | null {
  if (!companyId) return null;
  return COMPANY_PROFILES.find((c) => c.id === companyId) ?? null;
}

export function getCandidatesByCompany(companyId: TargetCompanyId): VirtualCandidate[] {
  if (!companyId) return [];
  return VIRTUAL_CANDIDATES.filter((c) => c.target_company === companyId);
}
