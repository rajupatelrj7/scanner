
import { GoogleGenAI, Type } from "@google/genai";
import { Vulnerability } from '../types';

export async function scanUrlForVulnerabilities(url: string): Promise<Vulnerability[]> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Fix: Separated prompt into a system instruction and a user prompt for better clarity and API usage.
  const systemInstruction = `
    You are an expert web security vulnerability scanner. Your task is to perform a simulated analysis of a given website URL.
    
    Your analysis should identify common web security vulnerabilities based on the OWASP Top 10 framework. This includes, but is not limited to:
    - A01:2021-Broken Access Control
    - A02:2021-Cryptographic Failures (e.g., Sensitive Data Exposure)
    - A03:2021-Injection (SQL, NoSQL, Command Injection, XSS)
    - A04:2021-Insecure Design
    - A05:2021-Security Misconfiguration (e.g., verbose error messages, directory listing)
    - A06:2021-Vulnerable and Outdated Components
    - A07:2021-Identification and Authentication Failures
    - A08:2021-Software and Data Integrity Failures
    - A09:2021-Security Logging and Monitoring Failures
    - A10:2021-Server-Side Request Forgery (SSRF)

    For each potential vulnerability you identify, provide the following details:
    1.  'name': A concise name for the vulnerability (e.g., "Cross-Site Scripting (XSS) - Reflected").
    2.  'severity': The severity level, which must be one of: 'Critical', 'High', 'Medium', 'Low', 'Informational'.
    3.  'description': A clear, detailed explanation of the vulnerability and why it poses a risk to the application.
    4.  'remediation': Actionable steps and best practices to fix the vulnerability.
    5.  'cwe': The most relevant Common Weakness Enumeration (CWE) identifier for the vulnerability (e.g., "CWE-79").

    Present your findings as a JSON array of vulnerability objects. If no vulnerabilities are found, return an empty array.
    Do not include any vulnerabilities that you are not confident about. Focus on plausible issues for a generic website.
  `;
  
  const userPrompt = `Perform a simulated analysis of the website at the URL: "${url}"`;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        severity: {
          type: Type.STRING,
          enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
        },
        description: { type: Type.STRING },
        remediation: { type: Type.STRING },
        cwe: { type: Type.STRING },
      },
      required: ['name', 'severity', 'description', 'remediation', 'cwe'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      return [];
    }
    
    return JSON.parse(jsonText) as Vulnerability[];

  } catch (error) {
    console.error("Error scanning URL:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a valid response from the AI model: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the vulnerability scan.");
  }
}
