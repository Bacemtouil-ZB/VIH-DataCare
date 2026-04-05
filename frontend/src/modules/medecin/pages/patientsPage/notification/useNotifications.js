// // useNotifications.js
// import { useState, useEffect, useCallback } from "react";
// import { getNotificationsRdv } from "../../../services/suiviNotificationService";
// import {
//   NOTIF_STORAGE_KEY,
//   NOTIF_NEW_KEY,
//   NOTIF_REFRESH_MS,
// } from "./notificationConstants.js";
// import {
//   loadFromStorage,
//   saveToStorage,
//   enrichNotif,
//   filterExpired,
// } from "./notificationHelpers.js";

// export default function useNotifications() {
//   const [rawNotifs, setRawNotifs] = useState([]);
//   const [readIds,   setReadIds]   = useState(() => loadFromStorage(NOTIF_STORAGE_KEY));
//   const [seenIds,   setSeenIds]   = useState(() => loadFromStorage(NOTIF_NEW_KEY));

//   // ── Fetch ──
//   const fetchNotifs = useCallback(async () => {
//     try {
//       const data = await getNotificationsRdv();
//       const filtered = filterExpired(data ?? []);
//       setRawNotifs(filtered);
//     } catch (err) {
//       console.error("Erreur fetch notifications:", err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchNotifs();
//     const interval = setInterval(fetchNotifs, NOTIF_REFRESH_MS);
//     return () => clearInterval(interval);
//   }, [fetchNotifs]);

//   // ── Enrichir ──
//   const notifications = rawNotifs.map((n) => enrichNotif(n, readIds, seenIds));

//   // ── Compteurs ──
//   const unreadCount = notifications.filter((n) => !n.isRead).length;
//   const hasNew      = notifications.some((n) => n.isNew);   // point rouge

//   // ── Marquer comme vu (point rouge disparait) ──
//   const markAllSeen = useCallback(() => {
//     const ids = rawNotifs.map((n) => n.id);
//     setSeenIds(ids);
//     saveToStorage(NOTIF_NEW_KEY, ids);
//   }, [rawNotifs]);

//   // ── Mark one lu ──
//   const markOne = useCallback((id) => {
//     setReadIds((prev) => {
//       const updated = [...new Set([...prev, id])];
//       saveToStorage(NOTIF_STORAGE_KEY, updated);
//       return updated;
//     });
//   }, []);

//   // ── Mark all lu ──
//   const markAll = useCallback(() => {
//     const ids = rawNotifs.map((n) => n.id);
//     setReadIds(ids);
//     saveToStorage(NOTIF_STORAGE_KEY, ids);
//   }, [rawNotifs]);

//   return {
//     notifications,
//     unreadCount,
//     hasNew,
//     markOne,
//     markAll,
//     markAllSeen,
//   };
// }
import { useState, useEffect, useCallback, useRef } from "react";
import { getNotificationsRdv } from "./../../../services/suiviNotificationService";
import {
  NOTIF_STORAGE_KEY,
  NOTIF_NEW_KEY,
  NOTIF_REFRESH_MS,
} from "./notificationConstants.js";
import {
  loadFromStorage,
  saveToStorage,
  enrichNotif,
  filterExpired,
} from "./notificationHelpers.js";

export default function useNotifications() {
  const [rawNotifs, setRawNotifs] = useState([]);
  const [readIds,   setReadIds]   = useState(() => loadFromStorage(NOTIF_STORAGE_KEY));
  const [seenIds,   setSeenIds]   = useState(() => loadFromStorage(NOTIF_NEW_KEY));

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Une seule déclaration de fetchNotifs ──
  const fetchNotifs = useCallback(async () => {
    try {
      const data     = await getNotificationsRdv();
      const filtered = filterExpired(data ?? []);
      setTimeout(() => {
        if (mountedRef.current) setRawNotifs(filtered);
      }, 0);
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, NOTIF_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  // ── Calculs dérivés ──
  const notifications = rawNotifs.map((n) => enrichNotif(n, readIds, seenIds));
  const unreadCount   = notifications.filter((n) => !n.isRead).length;
  const hasNew        = notifications.some((n) => n.isNew);

  const markAllSeen = useCallback(() => {
    const ids = rawNotifs.map((n) => n.id);
    setSeenIds(ids);
    saveToStorage(NOTIF_NEW_KEY, ids);
  }, [rawNotifs]);

  const markOne = useCallback((id) => {
    setReadIds((prev) => {
      const updated = [...new Set([...prev, id])];
      saveToStorage(NOTIF_STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const markAll = useCallback(() => {
    const ids = rawNotifs.map((n) => n.id);
    setReadIds(ids);
    saveToStorage(NOTIF_STORAGE_KEY, ids);
  }, [rawNotifs]);

  return {
    notifications,
    unreadCount,
    hasNew,
    markOne,
    markAll,
    markAllSeen,
  };
}