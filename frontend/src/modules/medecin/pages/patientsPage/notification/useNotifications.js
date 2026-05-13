// useNotifications.js
import { useState, useEffect, useRef } from "react";
import { getNotificationsRdv } from "../../../services/suiviNotificationService";
import {
  NOTIF_READ_KEY,
  NOTIF_REFRESH_MS,
} from "./notificationConstants.js";
import {
  loadFromStorage,
  saveToStorage,
  saveClickedAt,
  enrichNotif,
  isNotifVisible,
} from "./notificationHelpers.js";

export default function useNotifications() {
  const [rawNotifs, setRawNotifs] = useState([]);
  const [readIds,   setReadIds]   = useState(() => loadFromStorage(NOTIF_READ_KEY, []));
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Fetch ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getNotificationsRdv();
        if (!mountedRef.current) return;

        const validData = data ?? [];
        setRawNotifs(validData);

        // nettoyer readIds — garder seulement ids encore en BD
        setReadIds((prev) => {
          const validIds = validData.map((n) => n.notif_id);
          const cleaned  = prev.filter((id) => validIds.includes(id));
          saveToStorage(NOTIF_READ_KEY, cleaned);
          return cleaned;
        });

      } catch (err) {
        console.error("Erreur fetch notifications:", err);
      }
    };
    //nettoie les IDs expirés
    fetchNotifs();
    const interval = setInterval(fetchNotifs, NOTIF_REFRESH_MS);
    return () => clearInterval(interval);
  }, []); 

  // ── Calculs dérivés ───────────────────────────────────────
  const notifications = rawNotifs
    .map((n) => enrichNotif(n, readIds))
    .filter(isNotifVisible);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Marquer lue + enregistrer clic si lien ───────────────
  const markOne = (notif) => {
    setReadIds((prev) => {
      const updated = [...new Set([...prev, notif.notif_id])];
      saveToStorage(NOTIF_READ_KEY, updated);
      return updated;
    });
    if (notif.rdv_url) {
      saveClickedAt(notif.notif_id);
    }
  };

  // ── Marquer toutes lues ───────────────────────────────────
  const markAll = () => {
    const ids = rawNotifs.map((n) => n.notif_id);
    setReadIds(ids);
    saveToStorage(NOTIF_READ_KEY, ids);
  };

  return {
    notifications,
    unreadCount,
    markOne,
    markAll,
  };
}