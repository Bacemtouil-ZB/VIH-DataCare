import { MOBILE_ACCESS_STATUS } from "./mobileAccess.constants.js";
import QRCode from "qrcode";

export const getAccountStatus = (data) => {
  if (!data.hasMobileAccount) return MOBILE_ACCESS_STATUS.NO_ACCOUNT;
  if (data.isActive) return MOBILE_ACCESS_STATUS.ACTIVE;
  return MOBILE_ACCESS_STATUS.INACTIVE;
};

export const buildPrintContent = (credentials, qrDataUrl) => {
  const date = new Date().toLocaleDateString('fr-TN', { day: '2-digit', month: 'long', year: 'numeric' });

  return `
    <html>
      <head>
        <title>patient Accès</title>
        <style>
          @page { margin: 15mm 20mm; size: A4; }
          @media print { head, header, footer { display: none !important; } }
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #222; background: white; padding: 0; margin: 0; }
        </style>
      </head>
      <body>
        <div style="max-width:640px; margin:0 auto; padding: 32px 40px;">

          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div>
              <div style="font-size:10px; font-weight:500; letter-spacing:0.08em; color:#888; text-transform:uppercase; margin-bottom:3px;">République Tunisienne — Ministère de la Santé</div>
              <div style="font-size:17px; font-weight:700; color:#1a3a5c;">Hôpital Farhat Hached</div>
              <div style="font-size:11px; color:#555; margin-top:2px;">Sousse, Tunisie</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:17px; font-weight:700; color:#0f6e56;">VIHDataCare</div>
              <div style="font-size:10px; color:#888; margin-top:2px;">Accès Application Mobile</div>
            </div>
          </div>

          <div style="border-top:2px solid #1a3a5c; border-bottom:0.5px solid #ddd; padding:8px 0; margin-bottom:22px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:600; color:#1a3a5c; text-transform:uppercase; letter-spacing:0.04em;">Fiche d'accès patient</span>
            <span style="font-size:10px; color:#999;">${date}</span>
          </div>

          <div style="display:flex; gap:24px; align-items:flex-start;">
            <div style="flex:1;">

              <div style="margin-bottom:18px;">
                <div style="font-size:10px; color:#888; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:5px;">Patient</div>
                <div style="font-size:15px; font-weight:600; color:#1a3a5c; border-bottom:0.5px solid #eee; padding-bottom:7px;">${credentials.patientName}</div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px;">
                <div style="background:#f0f6ff; border-radius:6px; padding:11px 13px; border-left:3px solid #1a3a5c;">
                  <div style="font-size:9px; color:#555; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Identifiant</div>
                  <div style="font-size:14px; font-weight:700; color:#1a3a5c; font-family:'Courier New',monospace;">${credentials.username}</div>
                </div>
                <div style="background:#f0faf6; border-radius:6px; padding:11px 13px; border-left:3px solid #0f6e56;">
                  <div style="font-size:9px; color:#555; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Mot de passe temporaire</div>
                  <div style="font-size:14px; font-weight:700; color:#0f6e56; font-family:'Courier New',monospace;">${credentials.password}</div>
                </div>
              </div>

              <div style="background:#fffbea; border:0.5px solid #f0d070; border-radius:6px; padding:11px 13px; margin-bottom:14px;">
                <div style="font-size:10px; font-weight:600; color:#7a5c00; margin-bottom:4px;">Instructions importantes</div>
                <div style="font-size:10px; color:#6b5500; line-height:1.7;">
                  • Changez votre mot de passe dès la première connexion.<br/>
                  • Gardez ces informations strictement confidentielles.<br/>
                  • Ne partagez jamais vos identifiants avec un tiers.
                </div>
              </div>

              <div style="font-size:9px; color:#aaa; line-height:1.5; border-top:0.5px solid #eee; padding-top:10px; margin-top:14px;">
                Document généré automatiquement par le système VIHDataCare.<br/>
                Hôpital Farhat Hached — Service Infectiologie — Sousse, Tunisie
              </div>

            </div>

            <div style="display:flex; flex-direction:column; align-items:center; gap:7px; min-width:110px;">
              <div style="width:100px; height:100px; border:1.5px solid #1a3a5c; border-radius:6px; display:flex; align-items:center; justify-content:center; background:#f8faff;">
                <img src="${qrDataUrl}" width="88" height="88" style="border-radius:4px; display:block;" />
              </div>
              <div style="font-size:9px; color:#999; text-align:center; width:100px; line-height:1.4;">Scanner pour télécharger l'application</div>
            </div>
          </div>

        </div>
      </body>
    </html>
  `;
};

export const printCredentials = async (credentials) => {
  try {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas); // ← ajoute au DOM d'abord
    
    await QRCode.toCanvas(canvas,
      "https://expo.dev/accounts/zb9/projects/frontend-mobile/builds/8adb9b61-c468-4a40-9800-45e19730487e",
      { width: 200, margin: 2 }
    );
    
    const qrDataUrl = canvas.toDataURL("image/png");
    document.body.removeChild(canvas); // ← retire du DOM

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed; top:-9999px; left:-9999px; width:0; height:0; border:none;";
    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(buildPrintContent(credentials, qrDataUrl));
    iframe.contentDocument.close();

    // ← délai pour laisser le temps au iframe de charger
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      iframe.contentWindow.onafterprint = () => document.body.removeChild(iframe);
    }, 500);

  } catch (err) {
    console.error("QR generation error:", err);
  }
};