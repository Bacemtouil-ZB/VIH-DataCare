import { MOBILE_ACCESS_STATUS } from "./mobileAccess.constants.js";

// Determine account status from API response
export const getAccountStatus = (data) => {
  if (!data.hasMobileAccount) return MOBILE_ACCESS_STATUS.NO_ACCOUNT;
  if (data.isActive) return MOBILE_ACCESS_STATUS.ACTIVE;
  return MOBILE_ACCESS_STATUS.INACTIVE;
};

// Generate printable credentials content
export const buildPrintContent = (credentials) => {
  return `
    <html>
      <body style="font-family: Arial; padding: 40px;">
        <h2>VIHDataCare — Accès Application Mobile</h2>
        <hr/>
        <p><strong>Patient:</strong> ${credentials.patientName}</p>
        <p><strong>Identifiant:</strong> ${credentials.username}</p>
        <p><strong>Mot de passe:</strong> ${credentials.password}</p>
        <hr/>
        <p style="color: gray; font-size: 12px;">
          Changez votre mot de passe à la première connexion.
          Gardez ces informations confidentielles.
        </p>
      </body>
    </html>
  `;
};

// Print credentials in new window
export const printCredentials = (credentials) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(buildPrintContent(credentials));
  printWindow.document.close();
  printWindow.print();
};