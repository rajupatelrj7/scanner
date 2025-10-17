export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Vulnerability {
  name: string;
  severity: Severity;
  description: string;
  remediation: string;
  cwe: string;
}

export interface ScanResult {
    url: string;
    timestamp: string;
    vulnerabilities: Vulnerability[];
}
